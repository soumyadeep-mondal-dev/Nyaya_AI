# Nyaya AI ⚖️
### An Agentic Protocol for the Common Citizen
> HackArena 2.0 — Team HACKAHOLICS

## The Problem
India’s justice system faces a massive access gap: over **55 million** cases are pending across courts, and legal help is often expensive and hard to find. For the common citizen, procedural complexity and unclear “what to do next” steps make even basic grievances feel impossible to pursue.

## Our Solution
Nyaya AI is a **5-agent pipeline** that converts a plain-language grievance into structured facts, relevant laws, a formal complaint/petition draft, actionable next steps, and a lawyer recommendation. It combines agentic reasoning with retrieval from an Indian legal knowledge base (BNS/BNSS) to deliver fast, citizen-friendly guidance.

## Architecture

```
User Input
   ↓
Intake Agent
   ↓
Law-Sleuth (RAG)
   ↓
Compliance Agent
   ↓
Action Agent
   ↓
Matchmaking Agent
   ↓
Legal Document + Lawyer Match
```

## Tech Stack
- Frontend: React + Vite
- Backend: FastAPI + Python
- Agents: LangGraph + Gemini 2.5 Flash (Google)
- RAG: FAISS + Sentence Transformers
- Knowledge Base: BNS/BNSS Indian Legal Database

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your GEMINI_API_KEY to .env
python main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Team
- Samyak Jain
- Anayan Mandal
- Soumyadeep Mondal
- Soham Jana

## Demo
- **Security deposit dispute (Property/Civil):** landlord refuses to return deposit after move-out; user wants recovery steps and a formal notice/complaint draft.
- **Online shopping fraud (Fraud/Criminal):** fake product delivery + refund denial; user wants applicable sections and how to file a complaint.
- **Salary not paid (Labour):** unpaid wages for multiple months; user wants a structured complaint and the correct authority to approach.

---
