"""
Deep ATS Heuristic & Quantification Analysis Engine.
Analyzes resume document structure, action verb density, metric quantification,
and calculates an authoritative ATS Parseability Index (0-100).
"""

import re
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict


# Authoritative action verbs catalog organized by engineering competency
ACTION_VERBS = {
    "architectural_leadership": [
        "architected", "orchestrated", "spearheaded", "steered", "championed",
        "founded", "directed", "formulated", "pioneered", "governed"
    ],
    "engineering_construction": [
        "engineered", "developed", "built", "implemented", "constructed",
        "authored", "designed", "coded", "programmed", "configured", "integrated"
    ],
    "optimization_scalability": [
        "optimized", "accelerated", "scaled", "streamlined", "automated",
        "enhanced", "refactored", "maximized", "minimized", "boosted", "consolidated"
    ],
    "validation_security": [
        "audited", "benchmarked", "diagnosed", "secured", "hardened",
        "sanitized", "tested", "validated", "verified", "debugged", "monitored"
    ]
}

# Standard ATS sections and regex detection triggers
SECTION_PATTERNS = {
    "contact_info": re.compile(r"(@|\b(email|phone|mobile|tel|linkedin|github|portfolio|contact)\b)", re.I),
    "professional_summary": re.compile(r"(summary|profile|about me|objective|executive summary)", re.I),
    "work_experience": re.compile(r"(experience|work history|employment|career history|professional background)", re.I),
    "education": re.compile(r"(education|academic|degree|university|college|b\.tech|m\.tech|bachelor|master)", re.I),
    "technical_skills": re.compile(r"(skills|technical skills|technologies|proficiencies|core competencies|stack)", re.I),
    "projects": re.compile(r"(projects|personal projects|key projects|open source|portfolio projects)", re.I),
    "certifications": re.compile(r"(certifications|licenses|credentials|accreditations|courses)", re.I),
}

# Quantification patterns (numbers, percentages, currencies, throughput, latencies)
METRIC_PATTERNS = [
    re.compile(r"\b\d+(\.\d+)?%", re.I),                           # 45%, 99.9%
    re.compile(r"\$\s*\d+([,\.]\d+)?\s*([kKmMbB]|million|thousand)?", re.I), # $500k, $1.2M
    re.compile(r"\b\d+([,\.]\d+)?\s*(k|k\+|m|m\+|b)\b", re.I),      # 10k, 5M users
    re.compile(r"\b\d+x\b", re.I),                                 # 10x throughput
    re.compile(r"\b(reduced|increased|improved|decreased|cut|boosted|saved)\b.*?\b\d+", re.I),
    re.compile(r"\b\d+\s*(ms|seconds|minutes|req/s|rps|qps|fps|tb|gb|mb)\b", re.I), # 60 FPS, 14ms
    re.compile(r"\b(from\s+\d+.*?to\s+\d+)\b", re.I),              # from 500ms to 20ms
]


@dataclass
class AtsAuditResult:
    """Structured ATS heuristic evaluation result."""
    overall_score: int
    section_health_score: int
    verb_density_score: int
    quantification_score: int
    sections_detected: List[str]
    missing_sections: List[str]
    action_verbs_found: List[str]
    verb_diversity_count: int
    quantified_bullets_count: int
    total_bullet_count: int
    quantification_ratio: float
    recommendations: List[str]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


class AtsAuditService:
    """
    Evaluates resumes on structural integrity, semantic readability,
    metric quantification, and action verb strength.
    """

    def __init__(self):
        # Flatten all action verbs into a fast lookup set
        self.all_verbs = {
            verb
            for sublist in ACTION_VERBS.values()
            for verb in sublist
        }
        self.verb_regex = re.compile(
            rf"\b({'|'.join(re.escape(v) for v in sorted(self.all_verbs, key=len, reverse=True))})\b",
            re.IGNORECASE
        )

    def audit_resume(self, text: str) -> AtsAuditResult:
        """
        Performs full ATS structural and heuristic evaluation of resume plain text.
        """
        if not text or not text.strip():
            return AtsAuditResult(
                overall_score=0,
                section_health_score=0,
                verb_density_score=0,
                quantification_score=0,
                sections_detected=[],
                missing_sections=list(SECTION_PATTERNS.keys()),
                action_verbs_found=[],
                verb_diversity_count=0,
                quantified_bullets_count=0,
                total_bullet_count=0,
                quantification_ratio=0.0,
                recommendations=["The resume text is empty or could not be parsed."]
            )

        lines = [line.strip() for line in text.split("\n") if line.strip()]

        # 1. Detect sections
        detected_sections = []
        missing_sections = []
        for sec_name, pattern in SECTION_PATTERNS.items():
            found = False
            for line in lines:
                if pattern.search(line):
                    found = True
                    break
            if found:
                detected_sections.append(sec_name)
            else:
                missing_sections.append(sec_name)

        section_health = int((len(detected_sections) / len(SECTION_PATTERNS)) * 100)

        # 2. Extract action verbs
        matched_verbs = set()
        for match in self.verb_regex.finditer(text):
            matched_verbs.add(match.group(1).lower())

        verb_count = len(matched_verbs)
        # 12+ distinct active verbs is considered elite for a software engineering resume
        verb_score = min(100, int((verb_count / 12.0) * 100))

        # 3. Identify bullet points and quantification metrics
        bullet_lines = [
            line for line in lines
            if line.startswith(("-", "•", "*", "–", "—", ">")) or (len(line) > 30 and any(line.startswith(str(i)) for i in range(1, 10)))
        ]
        # If no bullet markers are found, treat long content lines as points
        if len(bullet_lines) < 3:
            bullet_lines = [line for line in lines if len(line) > 35]

        total_bullets = max(len(bullet_lines), 1)
        quantified_bullets = 0

        for bullet in bullet_lines:
            for pattern in METRIC_PATTERNS:
                if pattern.search(bullet):
                    quantified_bullets += 1
                    break

        quantification_ratio = round((quantified_bullets / total_bullets) * 100.0, 1)
        # 50%+ bullets with measurable metrics is top-tier
        quant_score = min(100, int((quantification_ratio / 50.0) * 100))

        # 4. Calculate weighted composite ATS score
        # 40% Section Structure + 35% Metric Impact + 25% Action Verb Strength
        overall_score = int(
            (section_health * 0.40) + (quant_score * 0.35) + (verb_score * 0.25)
        )

        # 5. Formulate actionable recommendations
        recommendations = []
        if "projects" in missing_sections:
            recommendations.append(
                "Add a dedicated 'Projects' section showcasing architectural complexity, tools used, and production outcomes."
            )
        if "certifications" in missing_sections:
            recommendations.append(
                "Include cloud or industry certifications (e.g. AWS Certified, Kubernetes CKA) to validate technical credentials."
            )
        if quantification_ratio < 40.0:
            recommendations.append(
                f"Low impact quantification ({quantification_ratio}%). Enhance bullet points with concrete metrics (e.g., 'reduced API latency by 45%', 'scaled system to 10k users')."
            )
        if verb_count < 8:
            recommendations.append(
                "Incorporate more strong engineering action verbs (e.g., 'Architected', 'Spearheaded', 'Optimized') instead of passive duties."
            )
        if len(lines) < 15:
            recommendations.append(
                "The resume appears concise or under-detailed. Expand on project deliverables and technical ownership."
            )

        if not recommendations:
            recommendations.append(
                "Outstanding ATS compliance: standard sections, rich quantification, and strong action-oriented engineering verbs."
            )

        return AtsAuditResult(
            overall_score=overall_score,
            section_health_score=section_health,
            verb_density_score=verb_score,
            quantification_score=quant_score,
            sections_detected=detected_sections,
            missing_sections=missing_sections,
            action_verbs_found=sorted(list(matched_verbs)),
            verb_diversity_count=verb_count,
            quantified_bullets_count=quantified_bullets,
            total_bullet_count=total_bullets,
            quantification_ratio=quantification_ratio,
            recommendations=recommendations
        )


# Singleton factory
_ats_instance: Optional[AtsAuditService] = None


def get_ats_audit_service() -> AtsAuditService:
    """Returns the singleton AtsAuditService."""
    global _ats_instance
    if _ats_instance is None:
        _ats_instance = AtsAuditService()
    return _ats_instance
