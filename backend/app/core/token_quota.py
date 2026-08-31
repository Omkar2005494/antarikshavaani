"""
AntarikshaVaani - 30-Minute Unlimited Token Pass & Space Access Engine
Author: Team Stackverse-labs

Provides 100% UNLIMITED queries, physics analytics, and 4K AI image generations
for a continuous 30-minute window (1,800 seconds) without token exhaustion.
"""

import os
import time
import sqlite3
from typing import Dict, Any, Tuple, Optional

DB_PATH = "/Users/omkar/.gemini/antigravity/scratch/antarikshavaani/backend/app/database/token_quota.db"
UNLIMITED_PASS_SECONDS = 1800  # 30 Minutes (Half Hour)

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
            last_activity REAL,
            session_start_time REAL
        )
    """)
    conn.commit()
    
    # Check if session_start_time exists, add if missing
    cursor.execute("PRAGMA table_info(user_tokens)")
    cols = [row[1] for row in cursor.fetchall()]
    if "session_start_time" not in cols:
        cursor.execute("ALTER TABLE user_tokens ADD COLUMN session_start_time REAL DEFAULT 0")
        conn.commit()
        
    conn.close()

init_token_db()

class TokenQuotaManager:
    def get_or_create_quota(self, identifier: str, is_authenticated: bool = False) -> Dict[str, Any]:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT tokens_total, tokens_used, is_authenticated, session_start_time FROM user_tokens WHERE identifier = ?", (identifier,))
        row = cursor.fetchone()
        current_time = time.time()

        if row:
            total, used, auth_flag, session_start = row
            if session_start is None or session_start == 0:
                session_start = current_time
                cursor.execute("UPDATE user_tokens SET session_start_time = ? WHERE identifier = ?", (session_start, identifier))
                conn.commit()

            # Active 30-minute unlimited window
            elapsed = current_time - session_start
            if elapsed >= UNLIMITED_PASS_SECONDS:
                # Renew 30-minute pass
                session_start = current_time
                cursor.execute("UPDATE user_tokens SET tokens_used = 0, session_start_time = ? WHERE identifier = ?", (current_time, identifier))
                conn.commit()

            conn.close()
            remaining_seconds = max(0, int(UNLIMITED_PASS_SECONDS - (current_time - session_start)))

            return {
                "identifier": identifier,
                "is_authenticated": True,
                "is_unlimited": True,
                "tokens_total": "∞",
                "tokens_used": used,
                "tokens_remaining": "∞",
                "unlimited_pass_seconds": remaining_seconds,
                "pass_window_minutes": 30,
                "quota_cycle": "30-Minute Unlimited Pass"
            }
        else:
            cursor.execute("""
                INSERT INTO user_tokens (identifier, is_authenticated, tokens_total, tokens_used, last_activity, session_start_time)
                VALUES (?, 1, 999999, 0, ?, ?)
            """, (identifier, current_time, current_time))
            conn.commit()
            conn.close()
            return {
                "identifier": identifier,
                "is_authenticated": True,
                "is_unlimited": True,
                "tokens_total": "∞",
                "tokens_used": 0,
                "tokens_remaining": "∞",
                "unlimited_pass_seconds": UNLIMITED_PASS_SECONDS,
                "pass_window_minutes": 30,
                "quota_cycle": "30-Minute Unlimited Pass"
            }

    def consume_tokens(self, identifier: str, prompt: str, response_text: str, is_authenticated: bool = False, is_image: bool = False) -> Tuple[bool, Dict[str, Any]]:
        # 30-Minute Unlimited Pass: All queries, physics & images are 100% UNRESTRICTED & FREE
        quota = self.get_or_create_quota(identifier, is_authenticated)
        
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("UPDATE user_tokens SET tokens_used = tokens_used + 1, last_activity = ? WHERE identifier = ?", (time.time(), identifier))
        conn.commit()
        conn.close()

        quota["tokens_deducted"] = 0
        quota["tokens_remaining"] = "∞"
        return True, quota

token_manager = TokenQuotaManager()
