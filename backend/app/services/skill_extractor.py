import re
from typing import List, Set
from app.services.text_cleaner import clean_text


KNOWN_SKILLS = {
    # Programming Languages
    "python", "java", "c++", "c#", "javascript", "typescript",
    "ruby", "go", "golang", "rust", "php", "kotlin", "swift",
    # Web Frameworks
    "fastapi", "django", "flask", "react", "next.js", "vue",
    "angular", "node.js", "express", "spring boot",
    # Databases & Cloud
    "sql", "postgresql", "mysql", "mongodb", "redis",
    "firebase", "aws", "azure", "gcp", "docker", "kubernetes",
    # AI & Data Science
    "machine learning", "deep learning", "nlp", "pandas",
    "numpy", "scikit-learn", "tensorflow", "pytorch",
    # Core Tools
    "git", "github", "rest api", "graphql", "linux",
    "agile", "scrum", "html", "css", "postman"
}


def extract_skills(text: str) -> List[str]:
    """Finds all known technical skills present in the given text."""
    if not text:
        return []

    cleaned = clean_text(text)
    found: Set[str] = set()

    for skill in KNOWN_SKILLS:
        pattern = r"(?<!\w)" + re.escape(skill) + r"(?!\w)"
        if re.search(pattern, cleaned):
            found.add(skill.title())

    return sorted(list(found))
