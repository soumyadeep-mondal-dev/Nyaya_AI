import json
import os
from datetime import date
from typing import Any, TypedDict

from langgraph.graph import END, StateGraph
import google.generativeai as genai
from dotenv import load_dotenv

from rag import retrieve


class NyayaState(TypedDict):
    grievance: str
    location: str
    facts: dict
    statutes: str
    document: str
    jurisdiction: dict
    routing: dict
    error: str


load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")


def safe_gemini_response(response):
    try:
        return response.text
    except Exception:
        return response.candidates[0].content.parts[0].text


def _build_prompt(system_prompt: str, user_prompt: str) -> str:
    return f"SYSTEM INSTRUCTION:\n{system_prompt}\n\nUSER INPUT:\n{user_prompt}"


def _extract_json(text: str) -> Any:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`").strip()
        if cleaned.lower().startswith("json"):
            cleaned = cleaned[4:].strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start != -1 and end != -1 and end > start:
            return json.loads(cleaned[start : end + 1])
        raise


def _json_with_fallback(response_text: str) -> dict[str, Any]:
    try:
        parsed = _extract_json(response_text)
        if isinstance(parsed, dict):
            return parsed
        return {"raw": response_text, "parsed_type": type(parsed).__name__}
    except Exception:
        return {"raw": response_text}


def _with_error(state: NyayaState, message: str) -> NyayaState:
    state["error"] = message
    return state


def intake_agent(state: NyayaState) -> NyayaState:
    try:
        system_prompt = (
            "You are a legal intake specialist for Indian citizens.\n"
            "Extract structured information from the grievance. Return ONLY valid JSON\n"
            "with fields: issue_type (one of: fraud/property/consumer/labour/criminal/\n"
            "family), parties_involved (list of strings), timeline (string),\n"
            "amount_involved (string or null), location_detail (string), urgency\n"
            "(low/medium/high), summary (one sentence summary of the issue)"
        )

        grievance = str(state.get("grievance", "")).strip()
        location = str(state.get("location", "")).strip()

        msg = (
            f"GRIEVANCE:\n{grievance}\n\n"
            f"LOCATION:\n{location}\n\n"
            "Return only JSON."
        )

        try:
            response = model.generate_content(_build_prompt(system_prompt, msg))
            response_text = safe_gemini_response(response)
        except Exception as e:
            state["error"] = f"Gemini API error: {str(e)}"
            return state

        state["facts"] = _json_with_fallback(response_text)
        state["error"] = ""
        return state
    except Exception as e:
        return _with_error(state, str(e))


def law_sleuth_agent(state: NyayaState) -> NyayaState:
    try:
        facts = state.get("facts") if isinstance(state.get("facts"), dict) else {}
        summary = str(facts.get("summary") or state.get("grievance", "")).strip()
        relevant = retrieve(summary, k=4)

        system_prompt = (
            "You are an expert in Indian law (BNS, BNSS, Consumer\n"
            "Protection Act, Labour Laws). Given the citizen's facts and relevant\n"
            "legal sections, identify all applicable laws. Return a clear numbered\n"
            "list of: applicable sections, what each section covers for this case,\n"
            "and the strength of each legal claim (strong/moderate/weak)"
        )

        msg = (
            "FACTS (JSON):\n"
            f"{json.dumps(facts, ensure_ascii=False)}\n\n"
            "RELEVANT SECTIONS (RAG):\n"
            f"{relevant}\n\n"
            "Write the answer as a numbered list."
        )

        try:
            response = model.generate_content(_build_prompt(system_prompt, msg))
            response_text = safe_gemini_response(response)
        except Exception as e:
            state["error"] = f"Gemini API error: {str(e)}"
            return state

        state["statutes"] = response_text
        state["error"] = ""
        return state
    except Exception as e:
        return _with_error(state, str(e))


def compliance_agent(state: NyayaState) -> NyayaState:
    try:
        system_prompt = (
            "You are a legal document drafter. Generate a formal\n"
            "complaint/petition in proper Indian legal format.\n\n"
            "Structure EXACTLY as:\n"
            "TO,\n"
            "[Authority Name]\n"
            "[Authority Address]\n\n"
            "COMPLAINT/PETITION\n\n"
            "COMPLAINANT: [Name placeholder]\n"
            "DATE: [Today's date]\n\n"
            "SUBJECT: [One line subject]\n\n"
            "FACTS OF THE CASE:\n"
            "[Numbered facts]\n\n"
            "LEGAL PROVISIONS VIOLATED:\n"
            "[List sections]\n\n"
            "RELIEF SOUGHT:\n"
            "[What the citizen wants]\n\n"
            "VERIFICATION:\n"
            "I, the complainant, hereby declare that...\n\n"
            "[Signature placeholder]"
        )

        facts = state.get("facts") if isinstance(state.get("facts"), dict) else {}
        statutes = str(state.get("statutes", "")).strip()
        grievance = str(state.get("grievance", "")).strip()
        location = str(state.get("location", "")).strip()

        msg = (
            f"Today's date: {date.today().isoformat()}\n\n"
            f"GRIEVANCE:\n{grievance}\n\n"
            f"LOCATION:\n{location}\n\n"
            "FACTS (JSON):\n"
            f"{json.dumps(facts, ensure_ascii=False)}\n\n"
            "LEGAL ANALYSIS:\n"
            f"{statutes}\n\n"
            "Generate the document using the exact structure."
        )

        try:
            response = model.generate_content(_build_prompt(system_prompt, msg))
            response_text = safe_gemini_response(response)
        except Exception as e:
            state["error"] = f"Gemini API error: {str(e)}"
            return state

        state["document"] = response_text
        state["error"] = ""
        return state
    except Exception as e:
        return _with_error(state, str(e))


def action_agent(state: NyayaState) -> NyayaState:
    try:
        system_prompt = (
            "Based on the legal analysis, identify the correct\n"
            "authority and next steps. Return ONLY valid JSON:\n"
            "{\n"
            "  authority_type: 'Police Station' or 'Consumer Forum' or\n"
            "  'Labour Court' or 'Civil Court' or 'Magistrate Court',\n"
            "  specific_authority: string (e.g. 'District Consumer Disputes\n"
            "  Redressal Commission'),\n"
            "  next_steps: [array of 4-5 actionable steps with step numbers],\n"
            "  time_limit: string (e.g. '2 years from date of incident'),\n"
            "  filing_fee: string (approximate)\n"
            "}"
        )

        facts = state.get("facts") if isinstance(state.get("facts"), dict) else {}
        statutes = str(state.get("statutes", "")).strip()
        location = str(state.get("location", "")).strip()

        msg = (
            f"LOCATION:\n{location}\n\n"
            "FACTS (JSON):\n"
            f"{json.dumps(facts, ensure_ascii=False)}\n\n"
            "LEGAL ANALYSIS:\n"
            f"{statutes}\n\n"
            "Return only JSON."
        )

        try:
            response = model.generate_content(_build_prompt(system_prompt, msg))
            response_text = safe_gemini_response(response)
        except Exception as e:
            state["error"] = f"Gemini API error: {str(e)}"
            return state

        state["jurisdiction"] = _json_with_fallback(response_text)
        state["error"] = ""
        return state
    except Exception as e:
        return _with_error(state, str(e))


def matchmaking_agent(state: NyayaState) -> NyayaState:
    try:
        system_prompt = (
            "Evaluate this legal case and provide lawyer\n"
            "recommendation. Return ONLY valid JSON:\n"
            "{\n"
            "  complexity_score: number 1-10,\n"
            "  needs_lawyer: boolean,\n"
            "  reason: string (one sentence why or why not),\n"
            "  lawyer_type: 'No lawyer needed - self-file' or\n"
            "  'Local lawyer - general practice' or\n"
            "  'Specialist lawyer - [domain]' or\n"
            "  'Senior counsel / Tier-1 firm',\n"
            "  estimated_legal_fee: string,\n"
            "  estimated_resolution_time: string,\n"
            "  success_probability: 'High' or 'Medium' or 'Low',\n"
            "  key_evidence_needed: [list of 3-5 documents/evidence to collect]\n"
            "}"
        )

        facts = state.get("facts") if isinstance(state.get("facts"), dict) else {}
        statutes = str(state.get("statutes", "")).strip()
        jurisdiction = state.get("jurisdiction") if isinstance(state.get("jurisdiction"), dict) else {}
        location = str(state.get("location", "")).strip()

        msg = (
            f"LOCATION:\n{location}\n\n"
            "FACTS (JSON):\n"
            f"{json.dumps(facts, ensure_ascii=False)}\n\n"
            "LEGAL ANALYSIS:\n"
            f"{statutes}\n\n"
            "AUTHORITY / NEXT STEPS (JSON):\n"
            f"{json.dumps(jurisdiction, ensure_ascii=False)}\n\n"
            "Return only JSON."
        )

        try:
            response = model.generate_content(_build_prompt(system_prompt, msg))
            response_text = safe_gemini_response(response)
        except Exception as e:
            state["error"] = f"Gemini API error: {str(e)}"
            return state

        state["routing"] = _json_with_fallback(response_text)
        state["error"] = ""
        return state
    except Exception as e:
        return _with_error(state, str(e))


def build_pipeline():
    try:
        graph = StateGraph(NyayaState)
        graph.add_node("intake", intake_agent)
        graph.add_node("law_sleuth", law_sleuth_agent)
        graph.add_node("compliance", compliance_agent)
        graph.add_node("action", action_agent)
        graph.add_node("matchmaking", matchmaking_agent)

        graph.set_entry_point("intake")
        graph.add_edge("intake", "law_sleuth")
        graph.add_edge("law_sleuth", "compliance")
        graph.add_edge("compliance", "action")
        graph.add_edge("action", "matchmaking")
        graph.add_edge("matchmaking", END)
        return graph.compile()
    except Exception:
        class _SequentialPipeline:
            def invoke(self, state: NyayaState):
                result = intake_agent(state)
                result = law_sleuth_agent(result)
                result = compliance_agent(result)
                result = action_agent(result)
                result = matchmaking_agent(result)
                return result

        return _SequentialPipeline()
