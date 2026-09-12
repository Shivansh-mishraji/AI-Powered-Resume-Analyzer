"""
Multi-Provider AI Service
=========================
Auto-detects the API key type and routes to the best available model:

  Key Prefix       Provider          Best Model Used
  ─────────────    ────────────      ──────────────────────
  AIza...          Google Gemini     gemini-3.6-flash → fallback chain
  sk-ant-...       Anthropic Claude  claude-opus-4 → sonnet → haiku
  sk-...           OpenAI            gpt-4o → gpt-4o-mini → gpt-3.5-turbo

Better API key tier = better model = richer, more accurate analysis.
"""

import json
import re
import time
from typing import List, Optional, Literal
from pydantic import BaseModel, Field

from app.config import GEMINI_MODEL_FALLBACK_CHAIN
from app.schemas.analysis_schema import AnalysisResult

class GeminiAnalysisPayload(BaseModel):
    score: int = Field(..., ge=0, le=100, description="Overall match percentage between 0 and 100.")
    analysis_confidence: Literal["high", "medium", "low"] = Field(
        default="high",
        description="Confidence level of analysis: high, medium, or low."
    )
    candidate_summary: str = Field(..., description="Professional summary of candidate profile and role alignment.")
    matched_skills: List[str] = Field(default_factory=list, description="Skills required by the job that the candidate possesses.")
    missing_skills: List[str] = Field(default_factory=list, description="Skills required by the job that the candidate lacks.")
    strengths: List[str] = Field(default_factory=list, description="Key competitive candidate strengths for this role.")
    weaknesses: List[str] = Field(default_factory=list, description="Critical missing qualifications or gaps for this role.")
    suggestions: List[str] = Field(default_factory=list, description="Actionable resume optimization recommendations.")

# ──────────────────────────────────────────────
# Key Security Utilities
# ──────────────────────────────────────────────

def mask_key(key: str) -> str:
    """Mask API key for safe logging — never expose full key in logs or errors."""
    if not key or len(key) < 10:
        return "****"
    return f"{key[:4]}{'*' * min(len(key) - 8, 12)}{key[-4:]}"

def sanitize_key(key: str) -> str:
    """Strip whitespace, quotes, and newlines from key input."""
    return key.strip().strip('"').strip("'").replace('\n', '').replace('\r', '')


# ──────────────────────────────────────────────
# Custom Exceptions
# ──────────────────────────────────────────────

class GeminiAuthError(Exception):
    """Invalid or missing API key."""
    pass

class GeminiRateLimitError(Exception):
    """Rate limit hit — ask user to wait."""
    pass

class GeminiServiceError(Exception):
    """General AI provider failure."""
    pass


# ──────────────────────────────────────────────
# Key Type Detection
# ──────────────────────────────────────────────

def detect_provider(api_key: str) -> str:
    """
    Detect AI provider from API key prefix.
    Returns: 'gemini' | 'anthropic' | 'openai' | 'unknown'
    """
    key = api_key.strip()
    if key.startswith("AIza") or key.startswith("AQ."):
        return "gemini"
    if key.startswith("sk-ant-"):
        return "anthropic"
    if key.startswith("sk-"):
        return "openai"
    return "gemini"  # default fallback — try Gemini


# ──────────────────────────────────────────────
# Shared Prompt Builder
# ──────────────────────────────────────────────

SYSTEM_INSTRUCTION = """
You are an expert technical recruiter and Senior ATS Intelligence Analyst.
Evaluate the candidate's resume against the target job description objectively.

EVALUATION RULES:
1. EVIDENCE-BASED: Only credit a skill if direct evidence exists in the resume.
2. HONEST: If a skill is missing, say 'No evidence of [Skill] found in resume'.
3. SCORING RUBRIC (0-100):
   - 90-100: Exceeds mandatory requirements with proven project experience.
   - 75-89: Strong match; satisfies core requirements with minor gaps.
   - 50-74: Partial match; meets fundamentals but misses 2+ core requirements.
   - 0-49: Major mismatch in domain, stack, or seniority.
4. CONFIDENCE: Set analysis_confidence to 'high', 'medium', or 'low'.
5. ADVICE: Provide 2-3 actionable, realistic improvement suggestions.
6. FORMAT: Return strictly valid JSON conforming to the requested schema.
"""

def build_prompt(resume_text: str, job_description: str) -> str:
    return f"""
=== CANDIDATE RESUME ===
{resume_text}

=== TARGET JOB DESCRIPTION ===
{job_description}

Perform deep semantic evaluation and return structured analysis as JSON.
"""

FALLBACK_SCHEMA_HINT = """
Return a JSON object with these exact keys:
{
  "score": <int 0-100>,
  "is_ai_powered": true,
  "analysis_confidence": "<high|medium|low>",
  "matched_skills": ["skill1", "skill2"],
  "missing_skills": ["skill3", "skill4"],
  "candidate_summary": "<2-3 sentence summary>",
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2"],
  "warnings": [],
  "filename": "resume.pdf"
}
"""


# ──────────────────────────────────────────────
# Gemini Provider
# ──────────────────────────────────────────────

def _parse_ai_response_text(raw_text: str, filename: str, warnings: List[str]) -> AnalysisResult:
    """Safely extracts JSON from model text, strips markdown code blocks, and validates into AnalysisResult."""
    text = (raw_text or "").strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()

    # Extract outermost JSON object if surrounded by preamble or postscript text
    start = text.find("{")
    end = text.rfind("}") + 1
    if start != -1 and end > start:
        text = text[start:end]

    try:
        data = json.loads(text)
    except json.JSONDecodeError:
        cleaned = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', text)
        data = json.loads(cleaned)

    return _normalize_and_validate_result(data, filename, warnings)


def _normalize_and_validate_result(data: dict, filename: str, warnings: List[str]) -> AnalysisResult:
    if "score" not in data and "overall_match_score" in data:
        data["score"] = data["overall_match_score"]
    try:
        data["score"] = max(0, min(100, int(data.get("score", 70))))
    except Exception:
        data["score"] = 70

    data["filename"] = filename
    data["is_ai_powered"] = True
    data["warnings"] = list(set((data.get("warnings") or []) + warnings))
    
    conf = str(data.get("analysis_confidence", "high")).lower()
    if conf not in ("high", "medium", "low", "not_applicable"):
        conf = "high"
    data["analysis_confidence"] = conf

    data.setdefault("candidate_summary", "Candidate profile evaluated against job requirements.")
    data.setdefault("matched_skills", [])
    data.setdefault("missing_skills", [])
    data.setdefault("strengths", [])
    data.setdefault("weaknesses", [])
    data.setdefault("suggestions", [])

    valid_keys = {
        "filename", "score", "is_ai_powered", "analysis_confidence",
        "candidate_summary", "matched_skills", "missing_skills",
        "strengths", "weaknesses", "suggestions", "warnings",
        "ats_audit", "domain_breakdown", "interview_questions"
    }
    filtered_data = {k: v for k, v in data.items() if k in valid_keys}
    return AnalysisResult(**filtered_data)


def _extract_response_text(response) -> Optional[str]:
    """Safely extracts raw text/JSON from a Gemini response across SDK versions, parsed fields, and candidate parts."""
    if not response:
        return None
    # 1. Standard text property
    try:
        text = getattr(response, "text", None)
        if text and isinstance(text, str) and text.strip():
            return text.strip()
    except Exception:
        pass

    # 2. Check if response.parsed was populated by the SDK
    try:
        parsed = getattr(response, "parsed", None)
        if parsed:
            if hasattr(parsed, "model_dump_json"):
                return parsed.model_dump_json()
            elif isinstance(parsed, dict):
                return json.dumps(parsed)
    except Exception:
        pass

    # 3. Direct candidate parts traversal (handles thinking model parts & multi-part output)
    try:
        candidates = getattr(response, "candidates", None)
        if candidates and len(candidates) > 0:
            content = getattr(candidates[0], "content", None)
            if content and getattr(content, "parts", None):
                combined = []
                for part in content.parts:
                    pt = getattr(part, "text", None)
                    if pt and isinstance(pt, str) and pt.strip():
                        combined.append(pt)
                if combined:
                    return "".join(combined).strip()
    except Exception:
        pass

    return None


def _call_gemini(resume_text: str, job_description: str, api_key: str,
                 filename: str, warnings: List[str]) -> AnalysisResult:
    from google import genai
    from google.genai import types
    from google.genai.errors import APIError

    client = genai.Client(api_key=api_key.strip())
    prompt = build_prompt(resume_text, job_description)
    last_error = None

    for model in GEMINI_MODEL_FALLBACK_CHAIN:
        try:
            # Using response_mime_type="application/json" with schema hint in prompt
            # guarantees strict JSON without OpenAPI schema rejection (no additionalProperties issues)
            response = client.models.generate_content(
                model=model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTION + "\n" + FALLBACK_SCHEMA_HINT,
                    response_mime_type="application/json",
                    temperature=0.1
                )
            )
            raw_text = _extract_response_text(response)
            if raw_text:
                try:
                    return _parse_ai_response_text(raw_text, filename, warnings)
                except Exception as pe:
                    last_error = f"Model {model} JSON parse failed: {pe}"
                    continue
            else:
                finish_reason = None
                try:
                    if response and response.candidates:
                        finish_reason = getattr(response.candidates[0], "finish_reason", None)
                except Exception:
                    pass
                last_error = f"Model {model} returned empty response (finish_reason: {finish_reason})"
                continue

        except APIError as e:
            last_error = e
            code = getattr(e, "code", None) or getattr(e, "status_code", None)
            msg = str(e).lower()
            if (
                code == 401
                or "api_key_invalid" in msg
                or "api key not valid" in msg
                or "invalid api key" in msg
                or "unauthenticated" in msg
                or ("api_key" in msg and "not valid" in msg)
                or ("api key" in msg and "invalid" in msg)
            ):
                raise GeminiAuthError("Invalid Gemini API key. Please check your key.")
            if code == 429 or "resource_exhausted" in msg or "rate limit" in msg or "quota" in msg:
                raise GeminiRateLimitError("Gemini rate limit hit. Please wait a moment.")
            if code == 404 or "not_found" in msg or "no longer available" in msg:
                continue

            time.sleep(0.5)
            continue

        except Exception as e:
            last_error = e
            continue

    raise GeminiServiceError(f"All Gemini models unavailable: {last_error}")


# ──────────────────────────────────────────────
# OpenAI Provider
# ──────────────────────────────────────────────

OPENAI_MODELS = ["gpt-4o", "gpt-4o-mini", "gpt-3.5-turbo"]

def _call_openai(resume_text: str, job_description: str, api_key: str,
                 filename: str, warnings: List[str]) -> AnalysisResult:
    from openai import OpenAI, AuthenticationError, RateLimitError

    client = OpenAI(api_key=api_key.strip())
    prompt = build_prompt(resume_text, job_description)
    last_error = None

    for model in OPENAI_MODELS:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": SYSTEM_INSTRUCTION + "\n" + FALLBACK_SCHEMA_HINT},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.1
            )
            raw = response.choices[0].message.content
            return _parse_ai_response_text(raw, filename, warnings)

        except AuthenticationError:
            raise GeminiAuthError("Invalid OpenAI API key. Please check your key.")
        except RateLimitError:
            raise GeminiRateLimitError("OpenAI rate limit hit. Please wait a moment.")
        except Exception as e:
            last_error = e
            continue

    raise GeminiServiceError(f"All OpenAI models failed: {last_error}")


# ──────────────────────────────────────────────
# Anthropic Provider
# ──────────────────────────────────────────────

ANTHROPIC_MODELS = ["claude-opus-4-5", "claude-sonnet-4-5", "claude-haiku-3-5", "claude-3-opus-20240229"]

def _call_anthropic(resume_text: str, job_description: str, api_key: str,
                    filename: str, warnings: List[str]) -> AnalysisResult:
    import anthropic

    client = anthropic.Anthropic(api_key=api_key.strip())
    prompt = build_prompt(resume_text, job_description)
    last_error = None

    for model in ANTHROPIC_MODELS:
        try:
            response = client.messages.create(
                model=model,
                max_tokens=2048,
                system=SYSTEM_INSTRUCTION + "\n" + FALLBACK_SCHEMA_HINT,
                messages=[{"role": "user", "content": prompt}]
            )
            raw = response.content[0].text
            return _parse_ai_response_text(raw, filename, warnings)

        except anthropic.AuthenticationError:
            raise GeminiAuthError("Invalid Anthropic API key. Please check your key.")
        except anthropic.RateLimitError:
            raise GeminiRateLimitError("Anthropic rate limit hit. Please wait a moment.")
        except Exception as e:
            last_error = e
            continue

    raise GeminiServiceError(f"All Claude models failed: {last_error}")


# ──────────────────────────────────────────────
# Main Entry Point
# ──────────────────────────────────────────────

def generate_ai_analysis(
    resume_text: str,
    job_description: str,
    api_key: str,
    filename: str = "resume.pdf",
    warnings: Optional[List[str]] = None
) -> AnalysisResult:
    """
    Auto-detects provider from key prefix and routes to best available model.

    Provider Quality Tiers:
      Gemini (AIza...)     → gemini-3.6-flash (best) → fallback chain
      OpenAI  (sk-...)     → gpt-4o (best) → gpt-4o-mini → gpt-3.5-turbo
      Claude  (sk-ant-...) → claude-opus-4 (best) → sonnet → haiku
    """
    key = sanitize_key(api_key or "")
    if not key:
        raise GeminiAuthError("No API key provided.")

    warnings = warnings or []
    provider = detect_provider(key)

    if provider == "openai":
        return _call_openai(resume_text, job_description, key, filename, warnings)
    elif provider == "anthropic":
        return _call_anthropic(resume_text, job_description, key, filename, warnings)
    else:
        return _call_gemini(resume_text, job_description, key, filename, warnings)
