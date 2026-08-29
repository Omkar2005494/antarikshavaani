"""
AntarikshaVaani Rate Limiting & Anti-Abuse Protection Engine
Author: Team Stackverse-labs

Protects public API endpoints and WebSocket channels against scraping, DDoS, and excessive automated load.
Enforces fair-use quotas to ensure legal compliance and server stability.
"""

import time
from collections import defaultdict
from typing import Dict, List, Tuple
from fastapi import Request, HTTPException, status

class RateLimiter:
    def __init__(self, requests_per_minute: int = 20, burst_limit_10s: int = 8):
        """
        :param requests_per_minute: Maximum allowed requests per sliding 60-second window per IP.
        :param burst_limit_10s: Maximum allowed burst requests within a 10-second window.
        """
        self.requests_per_minute = requests_per_minute
        self.burst_limit_10s = burst_limit_10s
        self.history: Dict[str, List[float]] = defaultdict(list)

    def _cleanup_old_timestamps(self, ip: str, now: float):
        """Removes timestamps older than 60 seconds for the given IP."""
        cutoff = now - 60.0
        self.history[ip] = [ts for ts in self.history[ip] if ts > cutoff]

    def check_rate_limit(self, ip: str) -> Tuple[bool, int, float]:
        """
        Checks if the request from the IP is allowed.
        Returns:
            (allowed: bool, remaining_requests: int, retry_after_seconds: float)
        """
        now = time.time()
        self._cleanup_old_timestamps(ip, now)

        ip_timestamps = self.history[ip]
        total_in_minute = len(ip_timestamps)

        # Check 10-second burst limit
        recent_10s = [ts for ts in ip_timestamps if ts > (now - 10.0)]
        if len(recent_10s) >= self.burst_limit_10s:
            retry_after = 10.0 - (now - recent_10s[0])
            return False, 0, max(1.0, round(retry_after, 1))

        # Check 60-second total limit
        if total_in_minute >= self.requests_per_minute:
            retry_after = 60.0 - (now - ip_timestamps[0])
            return False, 0, max(1.0, round(retry_after, 1))

        # Request is allowed
        self.history[ip].append(now)
        remaining = self.requests_per_minute - (total_in_minute + 1)
        return True, remaining, 0.0

# Singleton instances for API and WebSockets
api_limiter = RateLimiter(requests_per_minute=20, burst_limit_10s=8)
ws_limiter = RateLimiter(requests_per_minute=30, burst_limit_10s=10)

def get_client_ip(request: Request) -> str:
    """Extracts client IP address considering proxy headers like X-Forwarded-For."""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "127.0.0.1"

def enforce_api_rate_limit(request: Request):
    """FastAPI dependency to enforce rate limits on REST endpoints."""
    ip = get_client_ip(request)
    allowed, remaining, retry_after = api_limiter.check_rate_limit(ip)
    
    if not allowed:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "error": "RATE_LIMIT_EXCEEDED",
                "message": f"⏱️ Fair-use rate limit exceeded (Max 20 requests/minute). Please wait {retry_after}s to ensure fair public access.",
                "retry_after_seconds": retry_after,
                "fair_use_policy": "Academic Fair Use (Section 107) • Stackverse-labs"
            },
            headers={
                "Retry-After": str(int(retry_after)),
                "X-RateLimit-Limit": str(api_limiter.requests_per_minute),
                "X-RateLimit-Remaining": "0"
            }
        )
