import pytest
from unittest.mock import MagicMock, patch
from google.genai.errors import ClientError, ServerError
from app.services.ai_service import (
    generate_ai_analysis,
    GeminiAuthError,
    GeminiRateLimitError,
    GeminiServiceError
)
from app.schemas.analysis_schema import AnalysisResult

SAMPLE_AI_JSON = """
{
  "filename": "candidate_resume.pdf",
  "score": 85,
  "is_ai_powered": true,
  "analysis_confidence": "high",
  "candidate_summary": "Experienced Python backend engineer with strong cloud foundation.",
  "matched_skills": ["Python", "FastAPI", "Docker"],
  "missing_skills": ["Kubernetes"],
  "strengths": ["Solid API development experience", "Containerization skills"],
  "weaknesses": ["No Kubernetes experience mentioned"],
  "suggestions": ["Add a bullet point on container orchestration workflows"],
  "warnings": []
}
"""

def test_ai_service_success():
    """Verify AI service parses valid structured response correctly."""
    mock_response = MagicMock()
    mock_response.text = SAMPLE_AI_JSON

    with patch("google.genai.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client.models.generate_content.return_value = mock_response
        mock_client_cls.return_value = mock_client

        result = generate_ai_analysis(
            resume_text="Experienced Python FastAPI developer",
            job_description="Need Python and Docker engineer",
            api_key="valid-dummy-api-key",
            filename="candidate_resume.pdf"
        )

        assert isinstance(result, AnalysisResult)
        assert result.score == 85
        assert result.is_ai_powered is True
        assert result.analysis_confidence == "high"
        assert "Python" in result.matched_skills
        assert "Kubernetes" in result.missing_skills

def test_ai_service_missing_key():
    """Verify AI service raises GeminiAuthError when API key is empty."""
    with pytest.raises(GeminiAuthError):
        generate_ai_analysis(
            resume_text="Some resume",
            job_description="Some JD",
            api_key=""
        )

def test_ai_service_invalid_key():
    """Verify AI service catches auth error and raises GeminiAuthError."""
    with patch("google.genai.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client.models.generate_content.side_effect = ClientError(
            401, {"message": "API_KEY_INVALID: User unauthenticated"}
        )
        mock_client_cls.return_value = mock_client

        with pytest.raises(GeminiAuthError):
            generate_ai_analysis(
                resume_text="Some resume",
                job_description="Some JD",
                api_key="bad-api-key"
            )

def test_ai_service_rate_limit():
    """Verify AI service catches 429 and raises GeminiRateLimitError."""
    with patch("google.genai.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client.models.generate_content.side_effect = ClientError(
            429, {"message": "RESOURCE_EXHAUSTED: Rate limit exceeded"}
        )
        mock_client_cls.return_value = mock_client

        with pytest.raises(GeminiRateLimitError):
            generate_ai_analysis(
                resume_text="Some resume",
                job_description="Some JD",
                api_key="rate-limited-key"
            )

def test_ai_service_retry_on_transient_failure():
    """Verify AI service retries once on transient errors before succeeding."""
    mock_success = MagicMock()
    mock_success.text = SAMPLE_AI_JSON

    with patch("google.genai.Client") as mock_client_cls:
        mock_client = MagicMock()
        mock_client.models.generate_content.side_effect = [
            ServerError(503, {"message": "Service Unavailable"}),
            mock_success
        ]
        mock_client_cls.return_value = mock_client

        result = generate_ai_analysis(
            resume_text="Experienced Python developer",
            job_description="Python JD",
            api_key="dummy-key"
        )

        assert result.score == 85
        assert mock_client.models.generate_content.call_count == 2
