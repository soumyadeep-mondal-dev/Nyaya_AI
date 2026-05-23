import time
from datetime import datetime, timezone

import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

from agents import build_pipeline
from rag import build_index
from routing import get_recommendations

app = FastAPI(title="Nyaya AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GrievanceRequest(BaseModel):
    grievance: str = Field(..., min_length=1)
    location: str = Field(default="Kolkata")


class HealthResponse(BaseModel):
    status: str
    model: str
    knowledge_base_loaded: bool
    timestamp: str


class LawyerRecommendationRequest(BaseModel):
    city: str
    case_type: str
    complexity_score: int


_pipeline = None
_knowledge_loaded = False


@app.on_event("startup")
def _startup() -> None:
    global _pipeline, _knowledge_loaded
    print("Nyaya AI backend starting... Loading legal knowledge base...")
    load_dotenv()
    build_index()
    _knowledge_loaded = True
    _pipeline = build_pipeline()


@app.middleware("http")
async def _timing_middleware(request: Request, call_next):
    if request.url.path != "/analyze":
        return await call_next(request)

    start = time.perf_counter()
    response = await call_next(request)
    elapsed_ms = (time.perf_counter() - start) * 1000.0
    print(f"/analyze took {elapsed_ms:.2f} ms")
    return response


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        model="gemini-2.5-flash",
        knowledge_base_loaded=_knowledge_loaded,
        timestamp=datetime.now(timezone.utc).isoformat(),
    )


@app.post("/analyze")
def analyze(payload: GrievanceRequest):
    grievance = payload.grievance.strip()
    if len(grievance) < 20:
        raise HTTPException(status_code=422, detail="grievance must be at least 20 characters")

    print(f"Processing grievance: {grievance[:50]}...")

    if _pipeline is None:
        raise HTTPException(status_code=500, detail="Pipeline not initialized")

    initial_state = {
        "grievance": grievance,
        "location": payload.location,
        "facts": {},
        "statutes": "",
        "document": "",
        "jurisdiction": {},
        "routing": {},
        "error": "",
    }

    try:
        result = _pipeline.invoke(initial_state)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    if isinstance(result, dict) and result.get("error"):
        raise HTTPException(status_code=500, detail=str(result.get("error")))

    return result


@app.post("/recommend-lawyer")
def recommend_lawyer(payload: LawyerRecommendationRequest):
    return get_recommendations(payload.city, payload.case_type, payload.complexity_score)


@app.get("/sample-cases")
def sample_cases():
    return [
        {
            "id": "case-1",
            "title": "Security deposit dispute with landlord",
            "grievance_text": "My landlord is refusing to return my security deposit even after I vacated the flat and handed over the keys. He is making false claims about damages and is not providing any itemized bill or proof.",
            "location": "Kolkata",
            "expected_category": "property",
        },
        {
            "id": "case-2",
            "title": "Online shopping fraud",
            "grievance_text": "I ordered a phone online and paid in full, but the seller delivered a fake product. The platform is refusing a refund and the seller has stopped responding. I have invoices and chat proof.",
            "location": "Delhi",
            "expected_category": "fraud",
        },
        {
            "id": "case-3",
            "title": "Salary not paid by employer",
            "grievance_text": "My employer has not paid my salary for the last two months despite repeated follow-ups. They are delaying payment without any written reason. I have offer letter, attendance logs, and emails.",
            "location": "Bangalore",
            "expected_category": "labour",
        },
        {
            "id": "case-4",
            "title": "Consumer product defect",
            "grievance_text": "I purchased a new washing machine that stopped working within two weeks. The company service center keeps postponing the repair and refuses replacement. I want a refund or replacement under warranty.",
            "location": "Mumbai",
            "expected_category": "consumer",
        },
        {
            "id": "case-5",
            "title": "Harassment by neighbor",
            "grievance_text": "My neighbor is repeatedly threatening me and my family, shouting abuse late at night, and banging on our door. We feel unsafe and want police help. I have audio recordings and witnesses.",
            "location": "Hyderabad",
            "expected_category": "criminal",
        },
    ]


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
