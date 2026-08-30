"""
AntarikshaVaani - Space Token Quota & Credit Engine
Author: Team Stackverse-labs

Enforces:
- 500 Tokens for Authenticated Users (Google / Email Firebase Sign-in)
- 50 Tokens for Anonymous Guest Users
"""

import os
import time
import sqlite3
from typing import Dict, Any, Tuple

DB_PATH = "/Users/omkar/.gemini/antigravity/scratch/antarikshavaani/backend/app/database/token_quota.db"
AUTH_USER_DEFAULT_TOKENS = 500
GUEST_DEFAULT_TOKENS = 50

def init_token_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS user_tokens (
            identifier TEXT PRIMARY KEY,
            is_authenticated INTEGER,
            tokens_total INTEGER,
            tokens_used INTEGER,
            last_activity REAL
        )
    """)
    conn.commit()
    conn.close()

init_token_db()

class TokenQuotaManager:
    def get_or_create_quota(self, identifier: str, is_authenticated: bool = False) -> Dict[str, Any]:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT tokens_total, tokens_used, is_authenticated FROM user_tokens WHERE identifier = ?", (identifier,))
        row = cursor.fetchone()

        if row:
            total, used, auth_flag = row
            # Upgrade guest to authenticated quota if they just signed in
            if is_authenticated and not auth_flag:
                total = AUTH_USER_DEFAULT_TOKENS
                cursor.execute("UPDATE user_tokens SET tokens_total = ?, is_authenticated = 1 WHERE identifier = ?", (total, identifier))
                conn.commit()
            conn.close()
            remaining = max(0, total - used)
            return {
                "identifier": identifier,
                "is_authenticated": bool(is_authenticated or auth_flag),
                "tokens_total": total,
                "tokens_used": used,
                "tokens_remaining": remaining
            }
        else:
            total = AUTH_USER_DEFAULT_TOKENS if is_authenticated else GUEST_DEFAULT_TOKENS
            used = 0
            cursor.execute("""
                INSERT INTO user_tokens (identifier, is_authenticated, tokens_total, tokens_used, last_activity)
                VALUES (?, ?, ?, ?, ?)
            """, (identifier, 1 if is_authenticated else 0, total, used, time.time()))
            conn.commit()
            conn.close()
            return {
                "identifier": identifier,
                "is_authenticated": is_authenticated,
                "tokens_total": total,
                "tokens_used": used,
                "tokens_remaining": total
            }

    def consume_tokens(self, identifier: str, prompt: str, response_text: str, is_authenticated: bool = False) -> Tuple[bool, Dict[str, Any]]:
        # Calculate tokens consumed (approx 1 token per 4 characters / 1 word, min 5 tokens)
        word_count = len(prompt.split()) + (len(response_text.split()) // 3)
        tokens_to_deduct = max(5, min(word_count, 25))

        quota = self.get_or_create_quota(identifier, is_authenticated)
        if quota["tokens_remaining"] < tokens_to_deduct and quota["tokens_remaining"] <= 0:
            return False, quota

        new_used = quota["tokens_used"] + tokens_to_deduct
        new_remaining = max(0, quota["tokens_total"] - new_used)

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("UPDATE user_tokens SET tokens_used = ?, last_activity = ? WHERE identifier = ?", (new_used, time.time(), identifier))
        conn.commit()
        conn.close()

        quota["tokens_used"] = new_used
        quota["tokens_remaining"] = new_remaining
        quota["tokens_deducted"] = tokens_to_deduct
        return True, quota

token_manager = TokenQuotaManager()
