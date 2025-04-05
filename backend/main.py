from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
import httpx
from typing import List, Dict, Any
import asyncio
from wcag_checker import WCAGChecker
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)

def get_allowed_origins():
    base_urls = ["http://localhost", "http://127.0.0.1"]
    ports = range(5170, 5180)  # Vite uses ports in this range
    return [f"{base}:{port}" for base in base_urls for port in ports]

app = FastAPI(title="WCAG Compliance Checker API")

# Configure rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=False,  # Set to False since we don't need credentials
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept", "Origin"],
)

class URLInput(BaseModel):
    url: HttpUrl

class ComplianceReport(BaseModel):
    url: str
    compliance_score: float
    summary: Dict[str, int]
    issues_by_type: Dict[str, List[Dict]]
    recommendations: List[Dict[str, str]]
    metrics: Dict[str, Dict[str, Any]]

@app.post("/check", response_model=ComplianceReport)
@limiter.limit("10/minute")
async def check_compliance(url_input: URLInput, request: Request):
    try:
        checker = WCAGChecker()
        results = await checker.analyze_url(str(url_input.url))
        return results
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail={"message": str(e), "type": type(e).__name__}
        )

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
