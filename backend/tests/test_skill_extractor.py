import pytest
from app.services.skill_extractor import extract_skills


def test_extracts_python():
    result = extract_skills("I am an experienced Python developer.")
    assert "Python" in result


def test_extracts_multiple_skills():
    text = "Built REST APIs using FastAPI, Docker, and PostgreSQL on AWS."
    result = extract_skills(text)
    assert "Fastapi" in result
    assert "Docker" in result
    assert "Postgresql" in result
    assert "Aws" in result


def test_returns_sorted_list():
    result = extract_skills("Python, React, Docker, AWS")
    assert result == sorted(result)


def test_no_duplicate_skills():
    result = extract_skills("Python Python python PYTHON")
    assert result.count("Python") == 1


def test_empty_text_returns_empty_list():
    assert extract_skills("") == []


def test_none_returns_empty_list():
    assert extract_skills(None) == []


def test_no_false_positive_for_c():
    # 'c' should NOT match 'access' or 'because'
    result = extract_skills("because of access control")
    assert "C" not in result


def test_extracts_cpp():
    result = extract_skills("Proficient in C++ programming")
    assert "C++" in result


def test_skills_are_title_cased():
    result = extract_skills("machine learning and deep learning expert")
    assert "Machine Learning" in result
    assert "Deep Learning" in result
