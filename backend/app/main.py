"""
AntarikshaVaani - Space Mission Intelligence API Server
Author: Team Stackverse-labs

LEGAL & FAIR-USE NOTICE:
This software is an open-source educational and scientific research tool developed for 
Bhartiya Antriksh Hackathon 2026 / National Space Day. It is not an official ISRO entity.
Data ingested from ISSDC PRADAN (https://pradan.issdc.gov.in) and NASA PDS4 is governed by 
Open Access and Academic Fair Use (Section 107 of the Copyright Act).
Rate limiting & Token Quotas (1000 Auth / 50 Guest) are strictly enforced to prevent automated scraping.
"""

import json
import uvicorn
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional

from app.database.db_manager import db_manager
from app.agents.swarm import space_swarm
from app.core.rate_limiter import enforce_api_rate_limit, ws_limiter
from app.core.token_quota import token_manager

app = FastAPI(
    title="AntarikshaVaani Mission Intelligence API",
    description="Multi-Agent Space Data Query Engine for ISRO Datasets with Token Quota & Fair-Use Protection",
    version="1.2.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    prompt: str
    target_language: Optional[str] = None
    user_id: Optional[str] = None
    is_authenticated: Optional[bool] = False

@app.get("/health")
def health_check():
    return {
        "status": "ONLINE",
        "system": "AntarikshaVaani Core",
        "rate_limiting": "ACTIVE (Max 20 req/min per IP)",
        "token_quotas": "1000 Tokens (Authenticated) / 50 Tokens (Guest)",
        "legal_status": "Academic Open Access & Fair Use",
        "active_satellites_indexed": len(db_manager.search_satellites()),
        "lunar_sites_indexed": len(db_manager.search_lunar_sites())
    }

@app.get("/api/tokens")
def get_user_tokens(user_id: Optional[str] = None, is_authenticated: bool = False, request: Request = None):
    client_ip = request.client.host if (request and request.client) else "127.0.0.1"
    identifier = user_id if (user_id and is_authenticated) else client_ip
    return token_manager.get_or_create_quota(identifier, is_authenticated)

@app.get("/api/legal-disclaimer")
def get_legal_disclaimer():
    """Returns official Open-Science Fair-Use and Liability Waiver disclaimer."""
    return {
        "project": "AntarikshaVaani",
        "team": "Team Stackverse-labs (Dayananda Sagar University)",
        "license": "MIT Open Source License",
        "fair_use_statement": "Educational, scientific, and research fair use under Section 107 of the Copyright Act.",
        "data_attribution": [
            "ISRO ISSDC PRADAN Portal (https://pradan.issdc.gov.in)",
            "ISRO Space Weather Operations Centre (SWOC)",
            "Space-Track.org / ISTRAC Two-Line Element (TLE) Ephemeris"
        ],
        "token_policy": "1000 Space Tokens for Authenticated Researchers; 50 Tokens for Guest Explorers.",
        "rate_limit_policy": "Strict rate limit of 20 queries/minute per IP is enforced."
    }

@app.get("/api/satellites")
def get_satellites(dependencies=Depends(enforce_api_rate_limit)):
    return {
        "satellites": db_manager.search_satellites(),
        "summary": db_manager.get_satellite_fleet_summary()
    }

@app.get("/api/lunar-sites")
def get_lunar_sites(dependencies=Depends(enforce_api_rate_limit)):
    return {
        "sites": db_manager.search_lunar_sites()
    }

@app.get("/api/solar-events")
def get_solar_events(dependencies=Depends(enforce_api_rate_limit)):
    return {
        "events": db_manager.get_recent_solar_flares()
    }

@app.post("/api/query")
async def execute_query(req: QueryRequest, request: Request, dependencies=Depends(enforce_api_rate_limit)):
    """Single-turn query execution with Token Quota enforcement."""
    client_ip = request.client.host if request.client else "unknown"
    identifier = req.user_id if (req.user_id and req.is_authenticated) else client_ip
    
    # Check if this is an image generation query (costs 200 tokens)
    is_img = any(w in req.prompt.lower() for w in ["image", "photo", "picture", "generate image", "create image", "visualize", "render"])
    required_tokens = 200 if is_img else 5
    
    # Check token quota
    quota = token_manager.get_or_create_quota(identifier, bool(req.is_authenticated))
    if quota["tokens_remaining"] < required_tokens:
        if is_img:
            limit_msg = f"⚡ AI Space Image Generation requires 200 Space Tokens. You currently have {quota['tokens_remaining']}/{quota['tokens_total']} tokens. Please Sign In to get 1000 Space Tokens!"
        else:
            limit_msg = "⚡ Guest Token Quota Exhausted (0/50 tokens). Please Sign In with Google/Email to unlock 1000 Space Tokens!" if not req.is_authenticated else "⚡ Token quota limit reached (0/1000 tokens)."
        raise HTTPException(status_code=403, detail=limit_msg)

    final_result = None
    async for event in space_swarm.execute_stream(req.prompt, req.target_language):
        if "final_data" in event:
            final_result = event["final_data"]

    if not final_result:
        raise HTTPException(status_code=500, detail="Failed to process space intelligence query")

    # Deduct tokens after successful answer generation (200 for image, 5-25 for text)
    _, updated_quota = token_manager.consume_tokens(identifier, req.prompt, final_result.get("text", ""), bool(req.is_authenticated), is_image=is_img)
    final_result["token_info"] = updated_quota
    return final_result

@app.websocket("/ws/query")
async def websocket_query_endpoint(websocket: WebSocket):
    await websocket.accept()
    client_ip = websocket.client.host if websocket.client else "127.0.0.1"
    
    try:
        while True:
            data = await websocket.receive_text()
            
            # Enforce WebSocket rate limit per IP
            allowed, remaining, retry_after = ws_limiter.check_rate_limit(client_ip)
            if not allowed:
                await websocket.send_json({
                    "error": "RATE_LIMIT_EXCEEDED",
                    "step": 0,
                    "final_data": {
                        "intent": "Rate Limit Protection",
                        "text": f"⚠️ **Fair-Use Rate Limit Exceeded:** You have reached the maximum allowed query frequency (20 requests/minute). Please wait **{retry_after} seconds** before submitting another query.",
                        "citations": ["Stackverse-labs Public Fair Use Policy"]
                    }
                })
                continue

            payload = json.loads(data)
            prompt = payload.get("prompt", "")
            target_lang = payload.get("target_language") or payload.get("language")
            user_id = payload.get("user_id")
            is_auth = bool(payload.get("is_authenticated", False))
            
            identifier = user_id if (user_id and is_auth) else client_ip
            
            # Check if this is an image query (costs 200 tokens)
            is_img_query = any(w in prompt.lower() for w in ["image", "photo", "picture", "generate image", "create image", "visualize", "render"])
            required_tokens = 200 if is_img_query else 5

            # Check Token Quota
            quota = token_manager.get_or_create_quota(identifier, is_auth)
            if quota["tokens_remaining"] < required_tokens:
                if is_img_query:
                    quota_msg = f"⚡ **Insufficient Tokens for AI Imagery:** Image generation requires **200 Space Tokens**.\n\nYou currently have **{quota['tokens_remaining']}/{quota['tokens_total']} tokens**.\n\nPlease **Sign In with Google or Email** (click top-right Sign In) to claim **1000 Space Tokens**!"
                else:
                    quota_msg = "⚡ **Guest Token Quota Exhausted (0/50 tokens).**\n\nPlease **Sign In with Google or Email** (click top-right Sign In) to unlock **500 Free Space Tokens**!"
                await websocket.send_json({
                    "error": "TOKEN_QUOTA_EXHAUSTED",
                    "step": 0,
                    "final_data": {
                        "intent": "Token Quota Limit",
                        "text": quota_msg,
                        "token_info": quota,
                        "citations": ["Stackverse-labs Token Quota Policy"]
                    }
                })
                continue
            if quota["tokens_remaining"] <= 0:
                quota_msg = "⚡ **Guest Token Quota Exhausted (0/50 tokens).**\n\nPlease **Sign In with Google or Email** (click top-right Sign In) to unlock **500 Free Space Tokens**!" if not is_auth else "⚡ **Token quota limit reached (0/1000 tokens).**"
                await websocket.send_json({
                    "error": "TOKEN_QUOTA_EXHAUSTED",
                    "step": 0,
                    "final_data": {
                        "intent": "Token Quota Limit",
                        "text": quota_msg,
                        "token_info": quota,
                        "citations": ["Stackverse-labs Token Quota Policy"]
                    }
                })
                continue

            if not prompt:
                await websocket.send_json({"error": "Empty prompt provided"})
                continue

            final_text = ""
            async for event in space_swarm.execute_stream(prompt, target_lang):
                if event.get("final_data"):
                    final_text = event["final_data"].get("text", "")
                    # Deduct tokens (200 for image generation, 5-25 for text)
                    _, updated_quota = token_manager.consume_tokens(identifier, prompt, final_text, is_auth, is_image=is_img_query)
                    event["final_data"]["token_info"] = updated_quota
                await websocket.send_json(event)
                
    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_json({"error": str(e)})

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
