from typing import List, Dict


def calculate_score(resume_skills: List[str], jd_skills: List[str]) -> Dict:
    """Compares resume skills against JD skills.
    Returns match score, matched skills, and missing skills."""

    if not jd_skills:
        return {
            "score": 0,
            "matched_skills": [],
            "missing_skills": [],
            "total_jd_skills": 0
        }

    resume_set = set(skill.lower() for skill in resume_skills)
    jd_set = set(skill.lower() for skill in jd_skills)

    matched = resume_set & jd_set              # Skills in BOTH resume and JD
    missing = jd_set - resume_set              # Skills in JD but NOT in resume

    score = round((len(matched) / len(jd_set)) * 100, 1)

    return {
        "score": score,
        "matched_skills": sorted([s.title() for s in matched]),
        "missing_skills": sorted([s.title() for s in missing]),
        "total_jd_skills": len(jd_set)
    }
