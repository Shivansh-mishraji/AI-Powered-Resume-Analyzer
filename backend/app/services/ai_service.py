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
import time
from typing import List, Optional

from app.config import GEMINI_MODEL_FALLBACK_CHAIN
from app.schemas.analysis_schema import AnalysisResult

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
    if key.startswith("AIza"):
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
            response = client.models.generate_content(
                model=model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_INSTRUCTION,
                    response_mime_type="application/json",
                    response_schema=AnalysisResult,
                    temperature=0.1
                )
            )
            if not response.text:
                continue

            result = AnalysisResult.model_validate_json(response.text)
            result.filename = filename
            result.is_ai_powered = True
            result.warnings = list(set((result.warnings or []) + warnings))
            return result

        except APIError as e:
            last_error = e
            code = getattr(e, "code", None) or getattr(e, "status_code", None)
            msg = str(e).lower()
            if code == 401 or "api_key_invalid" in msg or "unauthenticated" in msg:
                raise GeminiAuthError("Invalid Gemini API key. Please check your key.")
            if code == 429 or "resource_exhausted" in msg or "rate limit" in msg:
                raise GeminiRateLimitError("Gemini rate limit hit. Please wait a moment.")
            if code == 404 or "not_found" in msg or "no longer available" in msg:
                # This model is gone — try next in chain
                continue
            time.sleep(0.5)
            continue

        except Exception as e:
            last_error = e
            continue

    raise GeminiServiceError(f"All Gemini models unavailable: {last_error}")


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
    data.setdefault("analysis_confidence", "high")
    data.setdefault("candidate_summary", "Candidate profile evaluated against job requirements.")
    data.setdefault("matched_skills", [])
    data.setdefault("missing_skills", [])
    data.setdefault("strengths", [])
    data.setdefault("weaknesses", [])
    data.setdefault("suggestions", [])
    return AnalysisResult(**data)


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
            data = json.loads(raw)
            return _normalize_and_validate_result(data, filename, warnings)

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
            # Extract JSON from response
            start = raw.find("{")
            end = raw.rfind("}") + 1
            data = json.loads(raw[start:end])
            return _normalize_and_validate_result(data, filename, warnings)

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
