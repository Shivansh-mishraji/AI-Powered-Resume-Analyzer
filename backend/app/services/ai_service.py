import time
from typing import List, Optional
from google import genai
from google.genai import types
from google.genai.errors import APIError
from app.config import DEFAULT_GEMINI_MODEL
from app.schemas.analysis_schema import AnalysisResult

class GeminiAuthError(Exception):
    """Raised when the provided Gemini API key is invalid or unauthorized."""
    pass

class GeminiRateLimitError(Exception):
    """Raised when the Gemini API returns a 429 rate limit."""
    pass

class GeminiServiceError(Exception):
    """Raised on general or transient Gemini API failures."""
    pass

def generate_ai_analysis(
    resume_text: str,
    job_description: str,
    api_key: str,
    filename: str = "resume.pdf",
    warnings: Optional[List[str]] = None
) -> AnalysisResult:
    """
    Analyzes resume against job description using Google Gemini AI.
    Implements evidence-based rubric scoring and a 1-retry policy for transient errors.
    """
    key = (api_key or "").strip()
    if not key:
        raise GeminiAuthError("No Gemini API key provided.")

    system_instruction = """
You are an expert technical recruiter and Senior ATS Intelligence Analyst.
Evaluate the candidate's resume against the target job description objectively and rigorously.

EVALUATION RULES:
1. EVIDENCE-BASED MATCHING: Only credit a skill/requirement if direct evidence or a reasonable semantic equivalent (e.g. 'AWS ECS + Terraform' for 'Container Orchestration & IaC') exists in the resume.
2. HONEST REPORTING: If a skill is not found, state 'No evidence of [Skill] found in resume' rather than claiming the candidate cannot do it.
3. SCORING RUBRIC (0-100):
   - 90–100: Exceeds mandatory requirements with direct, proven project experience.
   - 75–89: Strong match; satisfies core requirements with minor gaps in secondary tools.
   - 50–74: Partial match; meets fundamentals but misses 2+ core qualifications.
   - 0–49: Major mismatch in primary domain, stack, or seniority level.
4. CONFIDENCE: Set analysis_confidence to 'high' for clear text, 'medium' for vague resumes, or 'low' for ambiguous requirements.
5. CONSTRUCTIVE ADVICE: Provide 2-3 actionable, realistic resume improvement suggestions. Do not invent fake projects.
6. FORMAT: Return strictly valid JSON conforming to the requested schema.
"""

    prompt = f"""
=== CANDIDATE RESUME DATA ===
{resume_text}

=== TARGET JOB DESCRIPTION ===
{job_description}

Perform deep semantic evaluation and return structured analysis.
"""

    # Attempt call with a single retry for transient failures
    max_attempts = 2
    last_exception = None

    for attempt in range(1, max_attempts + 1):
        try:
            client = genai.Client(api_key=key)
            response = client.models.generate_content(
                model=DEFAULT_GEMINI_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    response_schema=AnalysisResult,
                    temperature=0.1
                )
            )

            if not response.text:
                raise GeminiServiceError("Empty response received from Gemini API.")

            result = AnalysisResult.model_validate_json(response.text)
            
            # Ensure filename and warnings are preserved
            result.filename = filename
            result.is_ai_powered = True
            if warnings:
                result.warnings = list(set(result.warnings + warnings))
            
            return result

        except APIError as e:
            last_exception = e
            status_code = getattr(e, "code", None) or getattr(e, "status_code", None)
            error_message = str(e).lower()

            if status_code == 401 or "api_key_invalid" in error_message or "unauthenticated" in error_message:
                raise GeminiAuthError("Invalid Gemini API key provided. Please check your key.")
            elif status_code == 429 or "resource_exhausted" in error_message or "rate limit" in error_message:
                raise GeminiRateLimitError("Gemini API rate limit exceeded. Please wait a moment before trying again.")
            
            # If transient server error and we have attempts left, sleep briefly and retry
            if attempt < max_attempts:
                time.sleep(1.0)
                continue
            raise GeminiServiceError(f"Gemini API error: {str(e)}")

        except Exception as e:
            last_exception = e
            if attempt < max_attempts:
                time.sleep(1.0)
                continue
            raise GeminiServiceError(f"Failed to process AI analysis: {str(e)}")

    raise GeminiServiceError(f"AI analysis failed after retry: {str(last_exception)}")
