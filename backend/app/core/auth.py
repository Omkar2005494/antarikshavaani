"""
AntarikshaVaani - Persistent Authentication & JWT Security Engine
Author: Team Stackverse-labs
"""

import os
import time
import json
import hmac
import hashlib
import base64
import sqlite3
from typing import Optional, Dict, Any

AUTH_DB_PATH = "/Users/omkar/.gemini/antigravity/scratch/antarikshavaani/backend/app/database/users.db"
SECRET_KEY = "antarikshavaani_stackverse_labs_super_secret_jwt_key_2026"
TOKEN_EXPIRY_SECONDS = 86400 * 7  # 7 days

def init_auth_db():
    os.makedirs(os.path.dirname(AUTH_DB_PATH), exist_ok=True)
    conn = sqlite3.connect(AUTH_DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            role TEXT DEFAULT 'Space Explorer',
            organization TEXT DEFAULT 'Stackverse-labs',
            created_at REAL
        )
    """)
    conn.commit()

    # Pre-seed demo researcher account
    cursor.execute("SELECT id FROM users WHERE email = ?", ("omkar@stackverse.io",))
    if not cursor.fetchone():
        salt = os.urandom(16).hex()
        pwd_hash = hashlib.pbkdf2_hmac("sha256", "stackverse2026".encode(), salt.encode(), 100000).hex()
        cursor.execute("""
            INSERT INTO users (username, email, password_hash, salt, role, organization, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, ("Omkar Bhandari", "omkar@stackverse.io", pwd_hash, salt, "Lead AI Researcher", "DSU Bangalore • Stackverse-labs", time.time()))
        conn.commit()
    conn.close()

init_auth_db()

def hash_password(password: str) -> tuple[str, str]:
    salt = os.urandom(16).hex()
    pwd_hash = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000).hex()
    return pwd_hash, salt

def verify_password(password: str, stored_hash: str, salt: str) -> bool:
    pwd_hash = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100000).hex()
    return hmac.compare_digest(pwd_hash, stored_hash)

def base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')

def base64url_decode(data: str) -> bytes:
    padding = '=' * (4 - (len(data) % 4))
    return base64.urlsafe_b64decode(data + padding)

def create_access_token(user_id: int, username: str, email: str, role: str) -> str:
    header = {"alg": "HS256", "typ": "JWT"}
    payload = {
        "sub": user_id,
        "username": username,
        "email": email,
        "role": role,
        "exp": int(time.time()) + TOKEN_EXPIRY_SECONDS
    }
    encoded_header = base64url_encode(json.dumps(header).encode())
    encoded_payload = base64url_encode(json.dumps(payload).encode())
    signature_input = f"{encoded_header}.{encoded_payload}".encode()
    signature = hmac.new(SECRET_KEY.encode(), signature_input, hashlib.sha256).digest()
    encoded_signature = base64url_encode(signature)
    return f"{encoded_header}.{encoded_payload}.{encoded_signature}"

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        encoded_header, encoded_payload, encoded_signature = parts
        signature_input = f"{encoded_header}.{encoded_payload}".encode()
        expected_sig = base64url_encode(hmac.new(SECRET_KEY.encode(), signature_input, hashlib.sha256).digest())
        if not hmac.compare_digest(encoded_signature, expected_sig):
            return None
        payload = json.loads(base64url_decode(encoded_payload).decode())
        if payload.get("exp", 0) < time.time():
            return None
        return payload
    except Exception:
        return None

class AuthManager:
    def register(self, username: str, email: str, password: str, role: str = "Space Explorer", organization: str = "Stackverse-labs") -> Dict[str, Any]:
        conn = sqlite3.connect(AUTH_DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE email = ? OR username = ?", (email, username))
        if cursor.fetchone():
            conn.close()
            return {"success": False, "error": "Username or Email already registered"}

        pwd_hash, salt = hash_password(password)
        cursor.execute("""
            INSERT INTO users (username, email, password_hash, salt, role, organization, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (username, email, pwd_hash, salt, role, organization, time.time()))
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()

        token = create_access_token(user_id, username, email, role)
        return {
            "success": True,
            "token": token,
            "user": {
                "id": user_id,
                "username": username,
                "email": email,
                "role": role,
                "organization": organization
            }
        }

    def login(self, email_or_user: str, password: str) -> Dict[str, Any]:
        conn = sqlite3.connect(AUTH_DB_PATH)
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, username, email, password_hash, salt, role, organization FROM users WHERE email = ? OR username = ?
        """, (email_or_user, email_or_user))
        row = cursor.fetchone()
        conn.close()

        if not row:
            return {"success": False, "error": "Invalid email/username or password"}

        user_id, username, user_email, pwd_hash, salt, role, org = row
        if not verify_password(password, pwd_hash, salt):
            return {"success": False, "error": "Invalid email/username or password"}

        token = create_access_token(user_id, username, user_email, role)
        return {
            "success": True,
            "token": token,
            "user": {
                "id": user_id,
                "username": username,
                "email": user_email,
                "role": role,
                "organization": org
            }
        }

    def get_user_by_id(self, user_id: int) -> Optional[Dict[str, Any]]:
        conn = sqlite3.connect(AUTH_DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, username, email, role, organization, created_at FROM users WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        conn.close()
        if not row:
            return None
        return {
            "id": row[0],
            "username": row[1],
            "email": row[2],
            "role": row[3],
            "organization": row[4],
            "created_at": row[5]
        }

auth_manager = AuthManager()
