import pytest
from app.services.score_calculator import calculate_score


def test_perfect_score():
    resume = ["Python", "Docker", "Aws"]
    jd = ["Python", "Docker", "Aws"]
    result = calculate_score(resume, jd)
    assert result["score"] == 100.0
    assert result["matched_skills"] == ["Aws", "Docker", "Python"]
    assert result["missing_skills"] == []


def test_zero_score():
    resume = ["React", "Javascript"]
    jd = ["Python", "Docker", "Aws"]
    result = calculate_score(resume, jd)
    assert result["score"] == 0.0
    assert result["matched_skills"] == []
    assert len(result["missing_skills"]) == 3


def test_partial_score():
    resume = ["Python", "Docker", "React"]
    jd = ["Python", "Docker", "Aws", "Kubernetes"]
    result = calculate_score(resume, jd)
    assert result["score"] == 50.0
    assert "Python" in result["matched_skills"]
    assert "Docker" in result["matched_skills"]
    assert "Aws" in result["missing_skills"]
    assert "Kubernetes" in result["missing_skills"]


def test_empty_jd_returns_zero():
    result = calculate_score(["Python", "Docker"], [])
    assert result["score"] == 0
    assert result["total_jd_skills"] == 0


def test_empty_resume_returns_zero_score():
    result = calculate_score([], ["Python", "Docker"])
    assert result["score"] == 0.0
    assert len(result["missing_skills"]) == 2


def test_case_insensitive_matching():
    # Skills coming from extractor are already title-cased
    # but score_calculator lowercases internally for comparison
    resume = ["python", "docker"]
    jd = ["Python", "Docker"]
    result = calculate_score(resume, jd)
    assert result["score"] == 100.0


def test_total_jd_skills_count():
    resume = ["Python"]
    jd = ["Python", "Docker", "Aws", "React"]
    result = calculate_score(resume, jd)
    assert result["total_jd_skills"] == 4
