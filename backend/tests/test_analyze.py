import io
from fastapi.testclient import TestClient
import fitz
from app.main import app

client = TestClient(app)


def make_pdf(text: str) -> bytes:
    """Helper: creates an in-memory PDF with given text."""
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((50, 50), text)
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes


def test_analyze_extracts_skills_from_pdf():
    pdf_bytes = make_pdf("Experienced Python developer with FastAPI, Docker, and AWS skills.")
    jd_text = "We need a Python developer who knows FastAPI and Docker."

    files = {"resume": ("resume.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    data = {"job_description": jd_text}

    response = client.post("/analyze", files=files, data=data)

    assert response.status_code == 200
    result = response.json()
    assert "Python" in result["resume_skills"]
    assert "Fastapi" in result["resume_skills"]
    assert "Docker" in result["resume_skills"]
    assert result["score"] >= 0
    assert "matched_skills" in result
    assert "missing_skills" in result
    assert result["total_jd_skills"] > 0

def test_analyze_rejects_empty_job_description():
    pdf_bytes = make_pdf("Python developer with Django experience.")
    files = {"resume": ("resume.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    data = {"job_description": "   "}

    response = client.post("/analyze", files=files, data=data)
    assert response.status_code == 400
    assert "empty" in response.json()["detail"].lower()


def test_analyze_rejects_invalid_file_type():
    files = {"resume": ("photo.jpg", io.BytesIO(b"fake image"), "image/jpeg")}
    data = {"job_description": "Python developer needed."}

    response = client.post("/analyze", files=files, data=data)
    assert response.status_code == 400
