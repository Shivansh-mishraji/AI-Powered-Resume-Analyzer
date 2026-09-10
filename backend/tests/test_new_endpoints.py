"""
Integration tests for new Enterprise Backend Endpoints:
- /taxonomy/domains & /taxonomy/categorize
- /audit/ats
- /export/markdown, /export/json, /export/html, /export/pdf
- /interview/generate
- /analyze enriched response fields
"""

import io
from fastapi.testclient import TestClient
import pymupdf
from app.main import app

client = TestClient(app)


def make_pdf(text: str) -> bytes:
    """Helper: creates in-memory PDF with specified text."""
    doc = pymupdf.open()
    page = doc.new_page()
    page.insert_text((50, 50), text)
    pdf_bytes = doc.tobytes()
    doc.close()
    return pdf_bytes


def test_taxonomy_domains_endpoint():
    """Verify /taxonomy/domains and /api/taxonomy/domains endpoints."""
    res1 = client.get("/taxonomy/domains")
    assert res1.status_code == 200
    data1 = res1.json()
    assert "domains" in data1
    assert data1["total_canonical_skills"] >= 100
    assert "backend_engineering" in data1["domains"]

    res2 = client.get("/api/taxonomy/domains")
    assert res2.status_code == 200
    assert res2.json() == data1


def test_taxonomy_categorize_endpoint():
    """Verify /taxonomy/categorize groups skills and maps synonyms."""
    payload = {"skills": ["k8s", "FastAPI", "Postgres", "PyTorch"]}
    res = client.post("/taxonomy/categorize", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "categorized" in data
    assert "resolved_synonyms" in data
    assert data["resolved_synonyms"]["k8s"] == "Kubernetes"
    assert data["resolved_synonyms"]["Postgres"] == "PostgreSQL"


def test_audit_ats_endpoint():
    """Verify /audit/ats evaluates text and returns heuristic diagnostics."""
    payload = {
        "resume_text": (
            "John Doe | john@example.com\n"
            "EDUCATION: BS Computer Science\n"
            "EXPERIENCE:\n"
            "- Architected microservices improving throughput by 45%.\n"
            "SKILLS: Python, FastAPI, Docker\n"
            "PROJECTS: Built distributed rate limiter."
        )
    }
    res = client.post("/audit/ats", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["overall_score"] > 0
    assert "work_experience" in data["sections_detected"]
    assert "technical_skills" in data["sections_detected"]
    assert data["quantified_bullets_count"] >= 1


def test_export_markdown_endpoint():
    """Verify /export/markdown produces formatted markdown and SHA-256 seal."""
    payload = {
        "analysis": {
            "filename": "candidate_resume.pdf",
            "score": 85,
            "is_ai_powered": False,
            "analysis_confidence": "not_applicable",
            "candidate_summary": "Solid backend profile.",
            "matched_skills": ["Python", "FastAPI"],
            "missing_skills": ["Kubernetes"],
            "strengths": ["Fast learner"],
            "weaknesses": ["K8s gap"],
            "suggestions": ["Learn container orchestration"],
            "warnings": []
        }
    }
    res = client.post("/export/markdown", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "markdown" in data
    assert "verification_hash" in data
    assert len(data["verification_hash"]) == 64
    assert "# 📋 EXECUTIVE RESUME AUDIT" in data["markdown"]


def test_export_json_endpoint():
    """Verify /export/json produces structured audit dictionary."""
    payload = {
        "analysis": {
            "filename": "candidate.pdf",
            "score": 77,
            "matched_skills": ["Python"],
            "missing_skills": ["AWS"]
        }
    }
    res = client.post("/export/json", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["audit_metadata"]["status"] == "verified"
    assert data["candidate_profile"]["score"] == 77


def test_export_html_endpoint():
    """Verify /export/html produces styled HTML document."""
    payload = {
        "analysis": {
            "filename": "candidate.pdf",
            "score": 90,
            "matched_skills": ["Python", "Docker"],
            "missing_skills": []
        }
    }
    res = client.post("/export/html", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "<!DOCTYPE html>" in data["html"]
    assert "90%" in data["html"]


def test_export_pdf_endpoint():
    """Verify /export/pdf produces binary PDF stream with proper headers."""
    payload = {
        "analysis": {
            "filename": "candidate.pdf",
            "score": 92,
            "matched_skills": ["Python", "FastAPI", "Docker", "Kubernetes"],
            "missing_skills": ["Terraform"]
        }
    }
    res = client.post("/export/pdf", json=payload)
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/pdf"
    assert "X-Verification-Hash" in res.headers
    assert res.content.startswith(b"%PDF-")


def test_interview_generate_endpoint():
    """Verify /interview/generate endpoint generates tailored technical questions."""
    payload = {
        "matched_skills": ["Python", "FastAPI"],
        "missing_skills": ["Kubernetes", "Redis"],
        "score": 80
    }
    res = client.post("/interview/generate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert "technical_questions" in data
    assert "system_design_prompts" in data
    assert len(data["technical_questions"]) >= 4


def test_analyze_enriches_response():
    """Verify /analyze response model is enriched with ats_audit, domain_breakdown, and interview_questions."""
    pdf_bytes = make_pdf(
        "John Doe | john@example.com\n"
        "EXPERIENCE: Senior Python developer with FastAPI and Docker production systems.\n"
        "EDUCATION: BS in Computer Science.\n"
        "SKILLS: Python, FastAPI, Docker, PostgreSQL\n"
        "PROJECTS: Optimized database queries by 50%."
    )
    jd_text = "Looking for a Python and FastAPI developer with Kubernetes knowledge."

    files = {"resume": ("resume.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
    data = {"job_description": jd_text}

    response = client.post("/analyze", files=files, data=data)
    assert response.status_code == 200
    result = response.json()

    # Backwards compatibility check
    assert "matched_skills" in result
    assert "missing_skills" in result
    assert result["score"] >= 0

    # Enterprise enrichment verification
    assert "ats_audit" in result and result["ats_audit"] is not None
    assert "domain_breakdown" in result and result["domain_breakdown"] is not None
    assert "interview_questions" in result and result["interview_questions"] is not None
    assert len(result["interview_questions"]) > 0
