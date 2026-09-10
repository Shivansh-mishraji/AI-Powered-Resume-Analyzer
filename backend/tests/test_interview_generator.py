"""
Unit tests for Candidate Interview Question Generator Engine.
Validates generation of targeted technical probes, system design prompts,
and seniority tier assessments.
"""

import pytest
from app.services.interview_generator import (
    InterviewGeneratorService,
    get_interview_generator
)


@pytest.fixture
def generator():
    return get_interview_generator()


def test_interview_generator_singleton():
    """Verify singleton instance consistency."""
    assert get_interview_generator() is get_interview_generator()


def test_generate_interview_kit_structure(generator):
    """Verify structured kit returns all expected sections."""
    kit = generator.generate_interview_kit(
        matched_skills=["Python", "FastAPI"],
        missing_skills=["Kubernetes", "AWS"],
        score=75
    )
    assert "candidate_assessment" in kit
    assert "technical_questions" in kit
    assert "system_design_prompts" in kit
    assert "behavioral_prompts" in kit
    assert kit["total_questions"] >= 5


def test_probe_questions_for_missing_skills(generator):
    """Verify probing questions generated specifically for missing skills."""
    kit = generator.generate_interview_kit(
        matched_skills=["Python"],
        missing_skills=["Kubernetes", "Redis"]
    )
    questions = kit["technical_questions"]
    probe_skills = [q["skill"] for q in questions if q["category"] == "SkillGapProbe"]
    assert "Kubernetes" in probe_skills
    assert "Redis" in probe_skills

    # Check rationale
    k8s_q = next(q for q in questions if q["skill"] == "Kubernetes")
    assert "lacked" in k8s_q["rationale"].lower() or "probing" in k8s_q["rationale"].lower()
    assert len(k8s_q["expected_answer_points"]) > 0


def test_validation_questions_for_matched_skills(generator):
    """Verify in-depth validation questions generated for matched skills."""
    kit = generator.generate_interview_kit(
        matched_skills=["PostgreSQL", "Docker"],
        missing_skills=[]
    )
    questions = kit["technical_questions"]
    val_skills = [q["skill"] for q in questions if q["category"] == "CoreCompetencyValidation"]
    assert "PostgreSQL" in val_skills
    assert "Docker" in val_skills

    pg_q = next(q for q in questions if q["skill"] == "PostgreSQL")
    assert "validating" in pg_q["rationale"].lower() or "strength" in pg_q["rationale"].lower()
    assert len(pg_q["expected_answer_points"]) > 0


def test_seniority_tier_assessment(generator):
    """Verify seniority tier scaling with matched skills count and score."""
    junior_kit = generator.generate_interview_kit(
        matched_skills=["Python"],
        missing_skills=["Docker", "AWS", "K8s"],
        score=35
    )
    assert junior_kit["candidate_assessment"]["seniority_tier"] == "Associate / Junior Software Engineer"

    senior_kit = generator.generate_interview_kit(
        matched_skills=["Python", "FastAPI", "Docker", "Kubernetes", "AWS", "PostgreSQL", "Redis"],
        missing_skills=[],
        score=82
    )
    assert "Senior" in senior_kit["candidate_assessment"]["seniority_tier"]

    staff_kit = generator.generate_interview_kit(
        matched_skills=[
            "Python", "Go", "FastAPI", "Docker", "Kubernetes", "AWS",
            "PostgreSQL", "Redis", "Kafka", "GraphQL", "Terraform", "CI/CD"
        ],
        missing_skills=[],
        score=95
    )
    assert "Staff" in staff_kit["candidate_assessment"]["seniority_tier"]


def test_system_design_and_behavioral_prompts(generator):
    """Verify architectural scenarios and STAR behavioral prompts are provided."""
    kit = generator.generate_interview_kit(
        matched_skills=["Python", "FastAPI"],
        missing_skills=["Docker"]
    )
    assert len(kit["system_design_prompts"]) >= 2
    assert len(kit["behavioral_prompts"]) >= 2
    assert "Rate Limiter" in kit["system_design_prompts"][0]["title"]
    assert "outage" in kit["behavioral_prompts"][0]["prompt"].lower()


def test_uncataloged_skills_fallback(generator):
    """Verify graceful handling and structured question creation for uncataloged skills."""
    kit = generator.generate_interview_kit(
        matched_skills=["CustomInternalFramework"],
        missing_skills=["ObscureLegacyDB"]
    )
    questions = kit["technical_questions"]
    assert len(questions) == 2
    assert questions[0]["skill"] == "ObscureLegacyDB"
    assert questions[1]["skill"] == "CustomInternalFramework"
    assert len(questions[0]["expected_answer_points"]) > 0


def test_empty_skills_kit(generator):
    """Verify kit generation with empty skills list."""
    kit = generator.generate_interview_kit(matched_skills=[], missing_skills=[])
    assert kit["total_questions"] >= 4
    assert kit["candidate_assessment"]["matched_skills_count"] == 0
