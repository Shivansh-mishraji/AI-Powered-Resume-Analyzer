"""
Unit tests for Enterprise Skills Taxonomy & Synonym Graph Service.
Validates ontology structure, token-boundary regex extraction, and domain categorization.
"""

import pytest
from app.services.taxonomy_service import TaxonomyService, get_taxonomy_service


@pytest.fixture
def taxonomy():
    return get_taxonomy_service()


def test_taxonomy_service_singleton():
    """Verify get_taxonomy_service returns identical singleton instance."""
    instance1 = get_taxonomy_service()
    instance2 = get_taxonomy_service()
    assert instance1 is instance2


def test_taxonomy_loads_domains_and_skills(taxonomy):
    """Verify ontology loads domains and canonical skills."""
    domains = taxonomy.get_all_domains()
    assert len(domains) >= 10
    assert "backend_engineering" in domains
    assert "cloud_infrastructure" in domains
    assert "devops_cicd" in domains
    assert "ai_machine_learning" in domains
    assert "databases_storage" in domains
    assert len(taxonomy._canonical_skills) >= 100


def test_resolve_synonyms(taxonomy):
    """Verify synonym and alias resolution to canonical names."""
    assert taxonomy.resolve_synonym("k8s") == "Kubernetes"
    assert taxonomy.resolve_synonym("postgres") == "PostgreSQL"
    assert taxonomy.resolve_synonym("mongo") == "MongoDB"
    assert taxonomy.resolve_synonym("react.js") == "React"
    assert taxonomy.resolve_synonym("py") == "Python"
    assert taxonomy.resolve_synonym("tf") == "Terraform"


def test_resolve_unknown_term(taxonomy):
    """Verify unknown term returns stripped original text."""
    assert taxonomy.resolve_synonym("  UnicornTech  ") == "UnicornTech"


def test_extract_canonical_skills_regex(taxonomy):
    """Verify token-boundary regex extracts skills accurately without false positives."""
    text = (
        "Architected scalable microservices using Python, FastAPI, and Postgres. "
        "Deployed containers with k8s and Docker to AWS."
    )
    skills = taxonomy.extract_canonical_skills(text)
    assert "Python" in skills
    assert "FastAPI" in skills
    assert "PostgreSQL" in skills
    assert "Kubernetes" in skills
    assert "Docker" in skills
    assert "AWS" in skills


def test_extract_canonical_skills_empty(taxonomy):
    """Verify empty or whitespace string returns empty list."""
    assert taxonomy.extract_canonical_skills("") == []
    assert taxonomy.extract_canonical_skills("   \n\t  ") == []


def test_categorize_skills_into_domains(taxonomy):
    """Verify skills are correctly grouped into domains."""
    skills = ["Python", "FastAPI", "Kubernetes", "Docker", "PyTorch", "React", "PostgreSQL"]
    categorized = taxonomy.categorize_skills(skills)

    assert "backend_engineering" in categorized
    assert "Python" in categorized["backend_engineering"]
    assert "FastAPI" in categorized["backend_engineering"]

    assert "devops_cicd" in categorized
    assert "Kubernetes" in categorized["devops_cicd"]
    assert "Docker" in categorized["devops_cicd"]

    assert "ai_machine_learning" in categorized
    assert "PyTorch" in categorized["ai_machine_learning"]

    assert "databases_storage" in categorized
    assert "PostgreSQL" in categorized["databases_storage"]


def test_calculate_domain_coverage(taxonomy):
    """Verify domain percentage coverage calculation."""
    target_skills = ["Python", "FastAPI", "Docker", "Kubernetes", "AWS"]
    matched_skills = ["Python", "FastAPI", "Docker"]

    coverage = taxonomy.calculate_domain_coverage(matched_skills, target_skills)
    assert "backend_engineering" in coverage
    assert coverage["backend_engineering"] == 100.0
    assert "devops_cicd" in coverage
    assert coverage["devops_cicd"] == 50.0


def test_get_domain_summary(taxonomy):
    """Verify domain summary counts."""
    skills = ["Python", "FastAPI", "Django", "Docker", "Kubernetes"]
    summary = taxonomy.get_domain_summary(skills)
    assert summary.get("backend_engineering") == 3
    assert summary.get("devops_cicd") == 2
