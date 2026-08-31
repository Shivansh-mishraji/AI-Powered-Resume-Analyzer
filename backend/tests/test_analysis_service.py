import pytest
from unittest.mock import patch
from app.services.analysis_service import analyze_resume_content
from app.services.ai_service import GeminiServiceError
from app.schemas.analysis_schema import AnalysisResult

SAMPLE_AI_RESULT = AnalysisResult(
    filename="test.pdf",
    score=90,
    is_ai_powered=True,
    analysis_confidence="high",
    candidate_summary="Senior Python developer with strong DevOps background.",
    matched_skills=["Python", "Docker"],
    missing_skills=["Kubernetes"],
    strengths=["Strong backend skills"],
    weaknesses=["Needs K8s exposure"],
    suggestions=["Mention container orchestration"],
    warnings=[]
)

def test_router_with_valid_api_key():
    """Verify router selects AI engine when API key is provided."""
    with patch("app.services.analysis_service.generate_ai_analysis", return_value=SAMPLE_AI_RESULT):
        result = analyze_resume_content(
            resume_text="Senior Python and Docker engineer",
            job_description="Need Python and Kubernetes developer",
            api_key="valid-key",
            filename="test.pdf"
        )

        assert result.is_ai_powered is True
        assert result.score == 90
        assert result.analysis_confidence == "high"

def test_router_without_api_key_runs_rule_based():
    """Verify router runs deterministic rule-based engine when API key is None or empty."""
    result = analyze_resume_content(
        resume_text="Experienced Python developer with Docker and FastAPI experience in production.",
        job_description="Looking for a Python and FastAPI developer with AWS experience.",
        api_key=None,
        filename="test.pdf"
    )

    assert result.is_ai_powered is False
    assert result.analysis_confidence == "not_applicable"
    assert "Python" in result.matched_skills
    assert "Fastapi" in result.matched_skills
    assert any("No Gemini API key" in w for w in result.warnings)

def test_router_fallback_on_transient_ai_error():
    """Verify router transparently falls back to rule-based engine on AI service failure."""
    with patch("app.services.analysis_service.generate_ai_analysis", side_effect=GeminiServiceError("Network timeout")):
        result = analyze_resume_content(
            resume_text="Python and Docker backend engineer with PostgreSQL experience.",
            job_description="Python engineer needed.",
            api_key="some-key",
            filename="test.pdf"
        )

        assert result.is_ai_powered is False
        assert result.analysis_confidence == "not_applicable"
        assert "Python" in result.matched_skills
        assert any("AI analysis was unavailable" in w for w in result.warnings)

def test_router_truncation_warning():
    """Verify router truncates long resumes and appends warning message."""
    long_resume = "Python developer " * 1500  # > 15,000 characters
    result = analyze_resume_content(
        resume_text=long_resume,
        job_description="Python developer required.",
        api_key=None
    )

    assert result.is_ai_powered is False
    assert any("shortened" in w for w in result.warnings)
