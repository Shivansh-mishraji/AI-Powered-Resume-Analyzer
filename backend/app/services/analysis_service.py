from typing import Optional, List
from app.config import MAX_RESUME_CHARS, MAX_JD_CHARS
from app.schemas.analysis_schema import AnalysisResult
from app.services.rule_based_service import run_rule_based_analysis
from app.services.ai_service import (
    generate_ai_analysis,
    GeminiAuthError,
    GeminiRateLimitError,
    GeminiServiceError
)

def analyze_resume_content(
    resume_text: str,
    job_description: str,
    api_key: Optional[str] = None,
    filename: str = "resume.pdf"
) -> AnalysisResult:
    """
    Main Analysis Router.
    Routes request to Gemini AI (if API key available) with transparent fallback
    to the deterministic rule-based engine if unconfigured or on transient failures.
    """
    warnings: List[str] = []

    # Apply length boundaries safely
    processed_resume = resume_text
    if len(resume_text) > MAX_RESUME_CHARS:
        processed_resume = resume_text[:MAX_RESUME_CHARS]
        warnings.append(f"Resume text was shortened from {len(resume_text)} to {MAX_RESUME_CHARS} characters.")

    processed_jd = job_description
    if len(job_description) > MAX_JD_CHARS:
        processed_jd = job_description[:MAX_JD_CHARS]
        warnings.append(f"Job description was shortened from {len(job_description)} to {MAX_JD_CHARS} characters.")

    key = (api_key or "").strip()

    # Scenario A: No API key provided -> Direct deterministic fallback
    if not key:
        warnings.append("No Gemini API key provided. Ran deterministic rule-based analysis.")
        return run_rule_based_analysis(
            resume_text=processed_resume,
            job_description=processed_jd,
            filename=filename,
            custom_warnings=warnings
        )

    # Scenario B: API key provided -> Attempt AI analysis with transparent fallback
    try:
        return generate_ai_analysis(
            resume_text=processed_resume,
            job_description=processed_jd,
            api_key=key,
            filename=filename,
            warnings=warnings
        )
    except (GeminiAuthError, GeminiRateLimitError):
        # Re-raise auth & rate limit errors so main.py can return specific 401/429 status codes
        raise
    except GeminiServiceError as e:
        # On transient unhandled AI service failures, fall back gracefully to rule-based engine
        warnings.append(f"AI analysis was unavailable ({str(e)}). Fell back to deterministic rule-based engine.")
        return run_rule_based_analysis(
            resume_text=processed_resume,
            job_description=processed_jd,
            filename=filename,
            custom_warnings=warnings
        )
    except Exception as e:
        warnings.append(f"AI engine encountered an unexpected error ({str(e)}). Fell back to deterministic engine.")
        return run_rule_based_analysis(
            resume_text=processed_resume,
            job_description=processed_jd,
            filename=filename,
            custom_warnings=warnings
        )
