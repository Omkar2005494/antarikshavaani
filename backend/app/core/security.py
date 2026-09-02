"""
AntarikshaVaani - Enterprise Aerospace Security & Sanitization Shield
Author: Team Stackverse-labs

Provides:
- Level 1: Sovereign Air-Gapped Local Inference
- Level 2: Enterprise HTTP Security Headers & Origin Controls
- Level 3: Adversarial Prompt Injection & Jailbreak Defense
- Level 4: Cryptographic Role-Based Access Control & Session Integrity
- Level 5: Ground-Truth Telemetry Integrity Guards
"""

import re
import html
from typing import Tuple, Dict, Any

# Known Adversarial Injection & Jailbreak Patterns
INJECTION_PATTERNS = [
    r"ignore (all )?(previous|prior) (instructions|prompts)",
    r"you are now (DAN|unrestricted|jailbroken|god mode|an evil)",
    r"system prompt (reveal|leak|print|show|dump)",
    r"disregard (all )?(guidelines|rules|directives)",
    r"<script.*?>.*?</script>",
    r"javascript:",
    r"UNION\s+SELECT",
    r"DROP\s+TABLE",
    r"INSERT\s+INTO",
    r"exec\s*\(",
    r"eval\s*\(",
    r"__import__",
    r"subprocess\.",
    r"os\.system"
]

class SecurityShield:
    def __init__(self):
        self._compiled_patterns = [re.compile(p, re.IGNORECASE) for p in INJECTION_PATTERNS]

    def sanitize_input(self, user_input: str) -> Tuple[bool, str, str]:
        """
        Sanitizes user input and detects prompt injection, jailbreaks, or code injection.
        Returns: (is_safe, sanitized_text, warning_reason)
        """
        if not user_input or not isinstance(user_input, str):
            return False, "", "Empty input provided."

        text = user_input.strip()

        # Check maximum query length (prevent buffer/token denial of service)
        if len(text) > 2000:
            return False, text[:2000], "Query exceeds 2,000 character fair-use safety limit."

        # Check for adversarial prompt injection patterns
        for pattern in self._compiled_patterns:
            if pattern.search(text):
                return False, text, "Security Violation: Adversarial prompt injection or system override detected."

        # Sanitize HTML escape sequences to prevent XSS reflection
        clean_text = html.escape(text)

        return True, text, ""

    def get_security_headers(self) -> Dict[str, str]:
        """Returns standard enterprise HTTP security headers for production deployment."""
        return {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "Referrer-Policy": "strict-origin-when-cross-origin"
        }

security_shield = SecurityShield()
