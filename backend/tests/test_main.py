import fitz
import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_invalid_file_type():
    file_content = b"fake image content"
    files = {"file": ("test.jpg", io.BytesIO(file_content), "image/jpeg")}
    response = client.post("/resume/upload", files=files)
    assert response.status_code == 400
    assert "Invalid file type" in response.json()["detail"]


def test_valid_pdf_upload():
    # Generate a simple 1-page PDF in memory for testing
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((50, 50), "Shivansh Mishra - Python Developer with FastAPI skills")
    pdf_bytes = doc.tobytes()
    doc.close()

    files = {"file": ("resume.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    response = client.post("/resume/upload", files=files)

    assert response.status_code == 200
    data = response.json()
    assert data["filename"] == "resume.pdf"
    assert data["text_length"] > 0
    assert "Shivansh Mishra" in data["preview"]
