from typing import List, Optional
from app.services.text_cleaner import clean_text
from app.services.skill_extractor import extract_skills
from app.services.score_calculator import calculate_score
from app.schemas.analysis_schema import AnalysisResult

def run_rule_based_analysis(
    resume_text: str,
    job_description: str,
    filename: str = "resume.pdf",
    custom_warnings: Optional[List[str]] = None
) -> AnalysisResult:
    """
    Runs deterministic keyword matching and score calculation,
    returning results wrapped in the unified AnalysisResult schema.
    """
    cleaned_resume = clean_text(resume_text)
    cleaned_jd = clean_text(job_description)

    resume_skills = extract_skills(cleaned_resume)
    jd_skills = extract_skills(cleaned_jd)

    score_result = calculate_score(resume_skills, jd_skills)

    warnings = custom_warnings or []
    if not warnings:
        warnings.append("Analyzed using deterministic rule-based engine.")

    return AnalysisResult(
        filename=filename,
        score=int(round(score_result.get("score", 0))),
        is_ai_powered=False,
        analysis_confidence="not_applicable",
        candidate_summary="Analyzed using deterministic rule-based keyword matching engine.",
        matched_skills=score_result.get("matched_skills", []),
        missing_skills=score_result.get("missing_skills", []),
        strengths=[],
        weaknesses=[],
        suggestions=[],
        warnings=warnings
    )
