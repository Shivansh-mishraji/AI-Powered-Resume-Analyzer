"""
Unit tests for Deep ATS Heuristic & Quantification Engine.
Validates section detection, action verb density, bullet quantification,
and composite ATS index calculation.
"""

import pytest
from app.services.ats_audit_service import (
    AtsAuditService,
    get_ats_audit_service,
    AtsAuditResult
)


@pytest.fixture
def audit_service():
    return get_ats_audit_service()


def test_ats_audit_service_singleton():
    """Verify singleton returns same instance."""
    assert get_ats_audit_service() is get_ats_audit_service()


def test_ats_audit_empty_text(audit_service):
    """Verify handling of empty or blank resume text."""
    res = audit_service.audit_resume("")
    assert res.overall_score == 0
    assert res.section_health_score == 0
    assert len(res.missing_sections) > 0
    assert len(res.recommendations) > 0


def test_ats_detects_all_standard_sections(audit_service):
    """Verify detection of standard ATS resume section headers."""
    resume_text = """
    John Doe
    Email: john@example.com | Phone: 555-0199 | LinkedIn: linkedin.com/in/johndoe
    
    PROFESSIONAL SUMMARY
    Senior Software Engineer with 7+ years of experience in distributed systems.
    
    WORK EXPERIENCE
    Senior Backend Architect at CloudCorp (2020 - Present)
    - Architected microservices platform handling 50k req/s.
    
    EDUCATION
    Bachelor of Technology in Computer Science, State University
    
    TECHNICAL SKILLS
    Python, FastAPI, Docker, Kubernetes, AWS, PostgreSQL
    
    PROJECTS
    Distributed Cache Engine: Built in-memory key-value store with 99.9% uptime.
    
    CERTIFICATIONS
    AWS Certified Solutions Architect - Associate
    """
    res = audit_service.audit_resume(resume_text)
    assert "contact_info" in res.sections_detected
    assert "professional_summary" in res.sections_detected
    assert "work_experience" in res.sections_detected
    assert "education" in res.sections_detected
    assert "technical_skills" in res.sections_detected
    assert "projects" in res.sections_detected
    assert "certifications" in res.sections_detected
    assert res.section_health_score == 100
    assert len(res.missing_sections) == 0


def test_ats_identifies_missing_sections(audit_service):
    """Verify identification of omitted resume sections."""
    sparse_text = """
    Jane Doe
    Skills: Python, Go
    Education: B.S. Computer Science
    """
    res = audit_service.audit_resume(sparse_text)
    assert "technical_skills" in res.sections_detected
    assert "education" in res.sections_detected
    assert "work_experience" in res.missing_sections
    assert "projects" in res.missing_sections
    assert "certifications" in res.missing_sections
    assert res.section_health_score < 100


def test_ats_detects_action_verbs(audit_service):
    """Verify action verb detection across architectural and engineering categories."""
    resume_text = """
    - Architected and spearheaded the migration to Kubernetes.
    - Engineered high-throughput event streaming with Kafka.
    - Optimized database queries, reducing p99 latency by 45%.
    - Secured and audited cloud IAM policies.
    """
    res = audit_service.audit_resume(resume_text)
    verbs = res.action_verbs_found
    assert "architected" in verbs
    assert "spearheaded" in verbs
    assert "engineered" in verbs
    assert "optimized" in verbs
    assert "secured" in verbs
    assert "audited" in verbs
    assert res.verb_diversity_count >= 6


def test_ats_quantification_metrics(audit_service):
    """Verify quantification detection for percentages, currencies, throughput, and latencies."""
    resume_text = """
    - Improved page load performance by 40% across all customer portals.
    - Reduced cloud infrastructure spending by $150k annually.
    - Scaled backend architecture to support 10M daily active users.
    - Achieved 10x throughput enhancement on data pipeline.
    - Decreased response latency from 450ms to 25ms.
    """
    res = audit_service.audit_resume(resume_text)
    assert res.quantified_bullets_count >= 4
    assert res.quantification_ratio >= 80.0
    assert res.quantification_score >= 80


def test_ats_composite_score_calculation(audit_service):
    """Verify composite ATS health score combines section health, metrics, and verbs."""
    strong_text = """
    Jane Smith | jane@example.com | San Francisco, CA
    SUMMARY: Senior Systems Engineer specializing in cloud infrastructure.
    EXPERIENCE:
    - Architected distributed microservices on AWS, boosting reliability to 99.99%.
    - Optimized Postgres query performance, decreasing latency by 60%.
    - Automated CI/CD pipelines, saving 15 hours per engineering sprint.
    - Scaled real-time WebSocket cluster to 200k concurrent connections.
    EDUCATION: Master of Science in Computer Science
    SKILLS: Go, Python, Docker, Kubernetes, Terraform, AWS
    PROJECTS: Distributed consensus engine in Go.
    CERTIFICATIONS: Certified Kubernetes Administrator (CKA)
    """
    res = audit_service.audit_resume(strong_text)
    assert res.overall_score >= 80
    assert res.section_health_score == 100
    assert res.quantification_score >= 70


def test_ats_actionable_recommendations(audit_service):
    """Verify targeted recommendations generated for missing projects and low quantification."""
    weak_text = """
    Developer with Python experience.
    Responsible for maintaining company website.
    Worked with database and bug fixes.
    """
    res = audit_service.audit_resume(weak_text)
    recs_str = " ".join(res.recommendations).lower()
    assert "projects" in recs_str or "quantification" in recs_str or "action verbs" in recs_str


def test_ats_result_to_dict(audit_service):
    """Verify serializability to dictionary."""
    res = audit_service.audit_resume("Python developer with AWS experience.")
    d = res.to_dict()
    assert isinstance(d, dict)
    assert "overall_score" in d
    assert "sections_detected" in d
    assert "quantification_ratio" in d
