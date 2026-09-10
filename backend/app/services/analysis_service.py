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
from app.services.ats_audit_service import get_ats_audit_service
from app.services.taxonomy_service import get_taxonomy_service
from app.services.interview_generator import get_interview_generator


def _enrich_result(result: AnalysisResult, resume_text: str) -> AnalysisResult:
    """Enriches AnalysisResult with ATS heuristics, domain taxonomy breakdown, and interview questions."""
    try:
        ats_service = get_ats_audit_service()
        ats_res = ats_service.audit_resume(resume_text)
        result.ats_audit = ats_res.to_dict()
    except Exception:
        result.ats_audit = None

    try:
        tax_service = get_taxonomy_service()
        result.domain_breakdown = tax_service.categorize_skills(result.matched_skills)
    except Exception:
        result.domain_breakdown = None

    try:
        int_service = get_interview_generator()
        kit = int_service.generate_interview_kit(
            matched_skills=result.matched_skills,
            missing_skills=result.missing_skills,
            weaknesses=result.weaknesses,
            score=result.score
        )
        result.interview_questions = kit.get("technical_questions", [])
    except Exception:
        result.interview_questions = None

    return result


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
    Enriches all outputs with deep ATS heuristics and skill taxonomy graphs.
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
        raw_result = run_rule_based_analysis(
            resume_text=processed_resume,
            job_description=processed_jd,
            filename=filename,
            custom_warnings=warnings
        )
        return _enrich_result(raw_result, processed_resume)

    # Scenario B: API key provided -> Attempt AI analysis with transparent fallback
    try:
        raw_result = generate_ai_analysis(
            resume_text=processed_resume,
            job_description=processed_jd,
            api_key=key,
            filename=filename,
            warnings=warnings
        )
        return _enrich_result(raw_result, processed_resume)
    except (GeminiAuthError, GeminiRateLimitError):
        # Re-raise auth & rate limit errors so main.py can return specific 401/429 status codes
        raise
    except GeminiServiceError as e:
        # On transient unhandled AI service failures, fall back gracefully to rule-based engine
        warnings.append(f"AI analysis was unavailable ({str(e)}). Fell back to deterministic rule-based engine.")
        raw_result = run_rule_based_analysis(
            resume_text=processed_resume,
            job_description=processed_jd,
            filename=filename,
            custom_warnings=warnings
        )
        return _enrich_result(raw_result, processed_resume)
    except Exception as e:
        warnings.append(f"AI engine encountered an unexpected error ({str(e)}). Fell back to deterministic engine.")
        raw_result = run_rule_based_analysis(
            resume_text=processed_resume,
            job_description=processed_jd,
            filename=filename,
            custom_warnings=warnings
        )
        return _enrich_result(raw_result, processed_resume)
