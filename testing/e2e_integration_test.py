"""
End-to-End Automated Integration Test Suite for AI-Powered Resume Analyzer.
Verifies the complete candidate lifecycle from document upload through ATS diagnostics,
taxonomy alignment, interview kit generation, and cryptographically sealed report export.
Authored by: Vishal Patel (QA Lead • Security & Automated Testing)
"""

import io
import time
from typing import Dict, Any
from fastapi.testclient import TestClient
import pymupdf

import os
import sys

# Ensure backend package is in python path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app


class E2EIntegrationHarness:
    """
    Automated QA harness validating end-to-end multi-service pipeline integrity.
    """

    def __init__(self):
        self.client = TestClient(app)
        self.test_results: Dict[str, Any] = {}

    def generate_candidate_pdf(self) -> bytes:
        """Constructs an in-memory test PDF resume with standard ATS sections."""
        doc = pymupdf.open()
        page = doc.new_page()
        content = (
            "Alex Mercer | alex.mercer@example.com | San Francisco, CA | linkedin.com/in/alexmercer\n\n"
            "PROFESSIONAL SUMMARY\n"
            "Staff Infrastructure Architect with 9+ years experience designing high-throughput distributed systems.\n\n"
            "WORK EXPERIENCE\n"
            "Principal Infrastructure Engineer at CloudScale Technologies (2020 - Present)\n"
            "- Architected multi-region Kubernetes cluster handling 85k requests per second with 99.99% SLA.\n"
            "- Spearheaded database migration to PostgreSQL, reducing p99 query latency by 55%.\n"
            "- Engineered automated Terraform CI/CD pipelines, saving $180k in annual cloud infrastructure waste.\n"
            "- Optimized Redis caching layer, decreasing cache miss rates from 14% to 1.2%.\n\n"
            "EDUCATION\n"
            "Master of Science in Computer Science, Stanford University\n\n"
            "TECHNICAL SKILLS\n"
            "Python, FastAPI, Docker, Kubernetes, AWS, PostgreSQL, Redis, Terraform, Go\n\n"
            "PROJECTS\n"
            "Global Rate Limiter: Engineered distributed token-bucket rate limiter in Go with Redis backplane.\n\n"
            "CERTIFICATIONS\n"
            "Certified Kubernetes Administrator (CKA), AWS Solutions Architect Professional\n"
        )
        page.insert_text((40, 50), content, fontsize=9.5)
        pdf_bytes = doc.tobytes()
        doc.close()
        return pdf_bytes

    def execute_e2e_pipeline(self) -> Dict[str, Any]:
        """
        Executes and audits the complete end-to-end API pipeline.
        """
        audit_log = []
        start_time = time.perf_counter()

        # Step 1: Health Check
        res_health = self.client.get("/health")
        assert res_health.status_code == 200, "Health check failed"
        audit_log.append("[PASS] Step 1: /health returned HTTP 200 OK")

        # Step 2: Extract & Analyze PDF
        pdf_bytes = self.generate_candidate_pdf()
        jd_text = (
            "We are seeking a Staff Backend Engineer proficient in Python, FastAPI, Docker, "
            "Kubernetes, and AWS to architect resilient cloud microservices."
        )

        files = {"resume": ("alex_mercer_resume.pdf", io.BytesIO(pdf_bytes), "application/pdf")}
        data = {"job_description": jd_text}

        res_analyze = self.client.post("/analyze", files=files, data=data)
        assert res_analyze.status_code == 200, f"Analysis failed: {res_analyze.text}"
        analysis_data = res_analyze.json()
        assert analysis_data["score"] >= 75, f"Unexpected score: {analysis_data['score']}"
        assert "ats_audit" in analysis_data, "ATS audit field missing from analysis payload"
        audit_log.append(f"[PASS] Step 2: /analyze completed with Match Score: {analysis_data['score']}%")

        # Step 3: Taxonomy Categorization
        res_tax = self.client.post(
            "/taxonomy/categorize",
            json={"skills": ["k8s", "Postgres", "FastAPI", "Python", "Docker"]}
        )
        assert res_tax.status_code == 200
        tax_data = res_tax.json()
        assert tax_data["resolved_synonyms"]["k8s"] == "Kubernetes"
        audit_log.append("[PASS] Step 3: /taxonomy/categorize verified synonym resolution (k8s -> Kubernetes)")

        # Step 4: Deep ATS Heuristic Audit
        res_ats = self.client.post(
            "/audit/ats",
            json={"resume_text": analysis_data.get("candidate_summary", "") + "\n" + jd_text}
        )
        assert res_ats.status_code == 200
        audit_log.append("[PASS] Step 4: /audit/ats successfully computed ATS heuristics")

        # Step 5: Interview Question Generation
        res_interview = self.client.post(
            "/interview/generate",
            json={
                "matched_skills": analysis_data.get("matched_skills", []),
                "missing_skills": analysis_data.get("missing_skills", []),
                "score": analysis_data.get("score", 85)
            }
        )
        assert res_interview.status_code == 200
        interview_kit = res_interview.json()
        assert interview_kit["total_questions"] >= 5
        audit_log.append(f"[PASS] Step 5: /interview/generate created {interview_kit['total_questions']} interview prompts")

        # Step 6: Export Multi-Format Reports & Cryptographic Verification
        res_pdf = self.client.post(
            "/export/pdf",
            json={"analysis": analysis_data, "ats_audit": analysis_data.get("ats_audit")}
        )
        assert res_pdf.status_code == 200
        assert res_pdf.headers["content-type"] == "application/pdf"
        assert "X-Verification-Hash" in res_pdf.headers
        v_hash = res_pdf.headers["X-Verification-Hash"]
        assert len(v_hash) == 64
        audit_log.append(f"[PASS] Step 6: /export/pdf generated verifiable PDF with SHA-256: {v_hash[:16]}...")

        elapsed_sec = round(time.perf_counter() - start_time, 3)

        return {
            "status": "ALL_TESTS_PASSED",
            "qa_lead": "Vishal Patel",
            "duration_seconds": elapsed_sec,
            "steps_completed": len(audit_log),
            "audit_trail": audit_log,
            "verification_hash": v_hash
        }


def test_e2e_integration_flow():
    """Pytest test case executing full E2E harness."""
    harness = E2EIntegrationHarness()
    results = harness.execute_e2e_pipeline()
    assert results["status"] == "ALL_TESTS_PASSED"
    assert results["steps_completed"] == 6


if __name__ == "__main__":
    harness = E2EIntegrationHarness()
    print("Executing E2E Integration Suite...")
    summary = harness.execute_e2e_pipeline()
    print(f"\nResult: {summary['status']} ({summary['duration_seconds']}s)")
    for step in summary["audit_trail"]:
        print(step)
