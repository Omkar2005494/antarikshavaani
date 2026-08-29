"""
AntarikshaVaani - Space Mission Intelligence API Server
Author: Team Stackverse-labs

LEGAL & FAIR-USE NOTICE:
This software is an open-source educational and scientific research tool developed for 
Bhartiya Antriksh Hackathon 2026 / National Space Day. It is not an official ISRO entity.
Data ingested from ISSDC PRADAN (https://pradan.issdc.gov.in) and NASA PDS4 is governed by 
Open Access and Academic Fair Use (Section 107 of the Copyright Act).
Rate limiting is strictly enforced to prevent automated scraping, denial of service, and API abuse.
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

app = FastAPI(
    title="AntarikshaVaani Mission Intelligence API",
    description="Multi-Agent Space Data Query Engine for ISRO Datasets with Rate Limiting and Fair-Use Protection",
    version="1.1.0"
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

@app.get("/health")
def health_check():
    return {
        "status": "ONLINE",
        "system": "AntarikshaVaani Core",
        "rate_limiting": "ACTIVE (Max 20 req/min per IP)",
        "legal_status": "Academic Open Access & Fair Use",
        "active_satellites_indexed": len(db_manager.search_satellites()),
        "lunar_sites_indexed": len(db_manager.search_lunar_sites())
    }

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
        "non_endorsement": "AntarikshaVaani is an independent open-science research tool and is not an official government or commercial ISRO platform.",
        "rate_limit_policy": "Strict rate limit of 20 queries/minute per IP is enforced to prevent DDoS, automated bot scraping, and commercial redistribution."
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
    final_result = None
    async for event in space_swarm.execute_stream(req.prompt):
        if event.get("final_data"):
            final_result = event["final_data"]
    return final_result or {"error": "Failed to process query"}

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
                        "text": f"⚠️ **Fair-Use Rate Limit Exceeded:** You have reached the maximum allowed query frequency (20 requests/minute). Please wait **{retry_after} seconds** before submitting another query.\n\n*This rate limit protects public server resources and ensures fair open access for all space researchers.*",
                        "citations": ["Stackverse-labs Public Fair Use Policy"]
                    }
                })
                continue

            payload = json.loads(data)
            prompt = payload.get("prompt", "")
            
            if not prompt:
                await websocket.send_json({"error": "Empty prompt provided"})
                continue

            async for event in space_swarm.execute_stream(prompt):
                await websocket.send_json(event)
                
    except WebSocketDisconnect:
        pass
    except Exception as e:
        await websocket.send_json({"error": str(e)})

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
