import io
from fastapi.testclient import TestClient
import pymupdf
from app.main import app

client = TestClient(app)

def make_pdf(text: str) -> bytes:
    """Helper: creates an in-memory PDF with given text."""
    doc = pymupdf.open()
    page = doc.new_page()
    page.insert_text((50, 50), text)
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes

def test_analyze_extracts_skills_from_pdf():
    pdf_bytes = make_pdf("Experienced Python developer with FastAPI, Docker, and AWS skills in backend production systems.")
    jd_text = "We need a Python developer who knows FastAPI and Docker."

    files = {"resume": ("resume.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    data = {"job_description": jd_text}

    response = client.post("/analyze", files=files, data=data)

    assert response.status_code == 200
    result = response.json()
    assert result["score"] >= 0
    assert "matched_skills" in result
    assert "missing_skills" in result
    assert "Python" in result["matched_skills"]
    assert "Fastapi" in result["matched_skills"]
    assert result["is_ai_powered"] is False
    assert result["analysis_confidence"] == "not_applicable"

def test_analyze_rejects_empty_job_description():
    pdf_bytes = make_pdf("Experienced Python developer with Django and PostgreSQL production experience.")
    files = {"resume": ("resume.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    data = {"job_description": "   "}

    response = client.post("/analyze", files=files, data=data)
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()

def test_analyze_rejects_invalid_file_type():
    files = {"resume": ("photo.jpg", io.BytesIO(b"fake image content here for testing"), "image/jpeg")}
    data = {"job_description": "Python developer needed."}

    response = client.post("/analyze", files=files, data=data)
    assert response.status_code == 400
