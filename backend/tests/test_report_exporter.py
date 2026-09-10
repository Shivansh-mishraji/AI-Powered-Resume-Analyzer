"""
Unit tests for Automated Executive PDF & Markdown Audit Exporter Engine.
Validates SHA-256 verification seals, Markdown/JSON/HTML/PDF formatting,
and document immutability.
"""

import pytest
import pymupdf
from app.services.report_exporter import ReportExporter, get_report_exporter


@pytest.fixture
def exporter():
    return get_report_exporter()


@pytest.fixture
def sample_analysis():
    return {
        "filename": "john_doe_resume.pdf",
        "score": 88,
        "is_ai_powered": True,
        "analysis_confidence": "high",
        "candidate_summary": "Principal Backend Architect with extensive cloud and microservices experience.",
        "matched_skills": ["Python", "FastAPI", "Docker", "Kubernetes", "PostgreSQL"],
        "missing_skills": ["Terraform"],
        "strengths": ["Deep distributed systems background"],
        "weaknesses": ["Lacks explicit infrastructure-as-code mentions"],
        "suggestions": ["Add AWS Terraform deployment examples"],
        "warnings": []
    }


@pytest.fixture
def sample_ats_audit():
    return {
        "overall_score": 92,
        "section_health_score": 100,
        "verb_density_score": 90,
        "quantification_score": 85,
        "sections_detected": ["contact_info", "work_experience", "education", "technical_skills", "projects"],
        "missing_sections": ["certifications"],
        "action_verbs_found": ["architected", "engineered", "optimized", "scaled"],
        "verb_diversity_count": 8,
        "quantified_bullets_count": 6,
        "total_bullet_count": 8,
        "quantification_ratio": 75.0,
        "recommendations": ["Include cloud certifications."]
    }


def test_exporter_singleton():
    """Verify singleton instance consistency."""
    assert get_report_exporter() is get_report_exporter()


def test_generate_verification_hash_deterministic(exporter, sample_analysis):
    """Verify cryptographic SHA-256 digest is deterministic for identical payloads."""
    hash1 = exporter.generate_verification_hash(sample_analysis)
    hash2 = exporter.generate_verification_hash(sample_analysis)
    assert hash1 == hash2
    assert len(hash1) == 64  # Standard SHA-256 hex length


def test_generate_verification_hash_varies_with_input(exporter, sample_analysis):
    """Verify modifying payload changes cryptographic hash."""
    hash1 = exporter.generate_verification_hash(sample_analysis)
    modified = dict(sample_analysis)
    modified["score"] = 55
    hash2 = exporter.generate_verification_hash(modified)
    assert hash1 != hash2


def test_export_to_markdown_structure(exporter, sample_analysis, sample_ats_audit):
    """Verify Markdown export contains all critical sections and metadata."""
    md = exporter.export_to_markdown(sample_analysis, sample_ats_audit)
    assert "# 📋 EXECUTIVE RESUME AUDIT" in md
    assert "john_doe_resume.pdf" in md
    assert "88%" in md
    assert "Python" in md
    assert "Terraform" in md
    assert "Deep ATS Structure & Heuristic Audit" in md
    assert "SHA-256" in md
    assert "Shivansh Mishra" in md


def test_export_to_json_structure(exporter, sample_analysis, sample_ats_audit):
    """Verify JSON export adheres to enterprise audit schema."""
    data = exporter.export_to_json(sample_analysis, sample_ats_audit)
    assert "audit_metadata" in data
    assert "candidate_profile" in data
    assert "skills_matrix" in data
    assert "ats_heuristics" in data
    assert "strategic_insights" in data

    assert data["candidate_profile"]["score"] == 88
    assert data["skills_matrix"]["matched_count"] == 5
    assert data["skills_matrix"]["missing_count"] == 1
    assert len(data["audit_metadata"]["verification_hash"]) == 64


def test_export_to_html_structure(exporter, sample_analysis, sample_ats_audit):
    """Verify HTML export is valid standalone document with responsive styles."""
    html = exporter.export_to_html(sample_analysis, sample_ats_audit)
    assert "<!DOCTYPE html>" in html
    assert "<title>Executive Resume Audit" in html
    assert "@media print" in html
    assert "badge-success" in html
    assert "88%" in html
    assert "SHA-256 SEAL" in html


def test_export_to_pdf_validity(exporter, sample_analysis, sample_ats_audit):
    """Verify PDF generator produces valid, readable PDF binary with PyMuPDF."""
    pdf_bytes = exporter.export_to_pdf(sample_analysis, sample_ats_audit)
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 1000
    assert pdf_bytes.startswith(b"%PDF-")

    # Validate PDF structure can be reopened by PyMuPDF
    doc = pymupdf.open(stream=pdf_bytes, filetype="pdf")
    assert doc.page_count >= 1
    first_page_text = doc[0].get_text()
    assert "EXECUTIVE RESUME AUDIT" in first_page_text
    doc.close()


def test_export_with_minimal_data(exporter):
    """Verify exporter handles sparse payload without raising exceptions."""
    minimal = {"filename": "sparse.pdf", "score": 50}
    md = exporter.export_to_markdown(minimal)
    js = exporter.export_to_json(minimal)
    htm = exporter.export_to_html(minimal)
    pdf = exporter.export_to_pdf(minimal)

    assert "sparse.pdf" in md
    assert js["candidate_profile"]["score"] == 50
    assert "sparse.pdf" in htm
    assert pdf.startswith(b"%PDF-")
