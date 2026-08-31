"""
AntarikshaVaani - Space Token Quota & Credit Engine (30-Minute Restriction Cycle)
Author: Team Stackverse-labs

Enforces:
- 1,000 Tokens for Authenticated Users per 30-Minute Window
- 50 Tokens for Anonymous Guest Users per 30-Minute Window
- 350 Tokens for Heavy AI Image Generation
- Automatic token quota replenishment every 30 minutes (1,800 seconds)
"""

import os
import time
import sqlite3
from typing import Dict, Any, Tuple, Optional

DB_PATH = "/Users/omkar/.gemini/antigravity/scratch/antarikshavaani/backend/app/database/token_quota.db"
AUTH_USER_DEFAULT_TOKENS = 1000
GUEST_DEFAULT_TOKENS = 50
IMAGE_GEN_TOKEN_COST = 350
QUOTA_WINDOW_SECONDS = 1800  # 30 Minutes (Half Hour)

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
            last_reset_time REAL
        )
    """)
    conn.commit()
    
    # Check if last_reset_time column exists, add if missing
    cursor.execute("PRAGMA table_info(user_tokens)")
    cols = [row[1] for row in cursor.fetchall()]
    if "last_reset_time" not in cols:
        cursor.execute("ALTER TABLE user_tokens ADD COLUMN last_reset_time REAL DEFAULT 0")
        conn.commit()
        
    conn.close()

init_token_db()

class TokenQuotaManager:
    def get_or_create_quota(self, identifier: str, is_authenticated: bool = False) -> Dict[str, Any]:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT tokens_total, tokens_used, is_authenticated, last_reset_time FROM user_tokens WHERE identifier = ?", (identifier,))
        row = cursor.fetchone()
        current_time = time.time()

        if row:
            total, used, auth_flag, last_reset = row
            if last_reset is None or last_reset == 0:
                last_reset = current_time
                cursor.execute("UPDATE user_tokens SET last_reset_time = ? WHERE identifier = ?", (last_reset, identifier))
                conn.commit()

            # Check if 30 minutes (1800 seconds) have elapsed -> AUTO-RECHARGE TOKENS
            if (current_time - last_reset) >= QUOTA_WINDOW_SECONDS:
                used = 0
                last_reset = current_time
                cursor.execute("UPDATE user_tokens SET tokens_used = 0, last_reset_time = ? WHERE identifier = ?", (current_time, identifier))
                conn.commit()

            # Upgrade guest to authenticated quota if they signed in
            if is_authenticated and not auth_flag:
                total = AUTH_USER_DEFAULT_TOKENS
                cursor.execute("UPDATE user_tokens SET tokens_total = ?, is_authenticated = 1 WHERE identifier = ?", (total, identifier))
                conn.commit()

            conn.close()
            remaining = max(0, total - used)
            reset_in_seconds = max(0, int(QUOTA_WINDOW_SECONDS - (current_time - last_reset)))

            return {
                "identifier": identifier,
                "is_authenticated": bool(is_authenticated or auth_flag),
                "tokens_total": total,
                "tokens_used": used,
                "tokens_remaining": remaining,
                "reset_in_seconds": reset_in_seconds,
                "reset_window_minutes": 30,
                "quota_cycle": "30 Minutes"
            }
        else:
            total = AUTH_USER_DEFAULT_TOKENS if is_authenticated else GUEST_DEFAULT_TOKENS
            used = 0
            cursor.execute("""
                INSERT INTO user_tokens (identifier, is_authenticated, tokens_total, tokens_used, last_activity, last_reset_time)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (identifier, 1 if is_authenticated else 0, total, used, current_time, current_time))
            conn.commit()
            conn.close()
            return {
                "identifier": identifier,
                "is_authenticated": is_authenticated,
                "tokens_total": total,
                "tokens_used": used,
                "tokens_remaining": total,
                "reset_in_seconds": QUOTA_WINDOW_SECONDS,
                "reset_window_minutes": 30,
                "quota_cycle": "30 Minutes"
            }

    def consume_tokens(self, identifier: str, prompt: str, response_text: str, is_authenticated: bool = False, is_image: bool = False) -> Tuple[bool, Dict[str, Any]]:
        # Image Generation costs 350 Space Tokens
        if is_image or any(w in prompt.lower() for w in ["image", "photo", "picture", "generate image", "create image", "visualize", "render"]):
            tokens_to_deduct = IMAGE_GEN_TOKEN_COST
        else:
            word_count = len(prompt.split()) + (len(response_text.split()) // 3)
            tokens_to_deduct = max(5, min(word_count, 25))

        quota = self.get_or_create_quota(identifier, is_authenticated)
        if quota["tokens_remaining"] < tokens_to_deduct:
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
