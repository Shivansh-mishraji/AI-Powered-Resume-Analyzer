"""
Enterprise Skills Taxonomy & Synonym Resolution Service.
Provides deep ontology-based skill matching across 12 tech domains with alias mapping.
"""

import json
import os
import re
from typing import Dict, List, Set, Tuple, Optional


class TaxonomyService:
    """
    Enterprise skills taxonomy engine.
    Categorizes skills across 12 engineering domains and resolves industry synonyms.
    """

    def __init__(self, taxonomy_path: Optional[str] = None):
        if taxonomy_path is None:
            base_dir = os.path.dirname(os.path.abspath(__file__))
            taxonomy_path = os.path.join(base_dir, "taxonomy_graph.json")
            if not os.path.exists(taxonomy_path):
                alt_path = os.path.join(base_dir, "skills_graph.json")
                if os.path.exists(alt_path):
                    taxonomy_path = alt_path

        self.taxonomy_path = taxonomy_path
        self.domains: Dict[str, List[str]] = {}
        self.synonyms: Dict[str, str] = {}
        self._skill_to_domain: Dict[str, str] = {}
        self._canonical_skills: Set[str] = set()
        self._compiled_patterns: Dict[str, re.Pattern] = {}
        self._load_taxonomy()

    def _load_taxonomy(self) -> None:
        """Loads and indexes the taxonomy graph."""
        if not os.path.exists(self.taxonomy_path):
            return

        with open(self.taxonomy_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.domains = data.get("domains", {})
        self.synonyms = {k.lower(): v for k, v in data.get("synonyms", {}).items()}

        for domain, skills in self.domains.items():
            for skill in skills:
                canonical = skill.strip()
                self._canonical_skills.add(canonical)
                self._skill_to_domain[canonical.lower()] = domain

        # Precompile token matching patterns for canonical skills and synonyms
        all_terms = list(self._canonical_skills) + list(self.synonyms.keys())
        # Sort by descending length so multi-word phrases match before single words
        all_terms.sort(key=len, reverse=True)

        for term in all_terms:
            escaped = re.escape(term)
            # Match word boundary or boundary punctuation
            pattern_str = rf"(?<![\w\-]){escaped}(?![\w\-])"
            self._compiled_patterns[term] = re.compile(pattern_str, re.IGNORECASE)

    def resolve_synonym(self, term: str) -> str:
        """Resolves shorthand/alias to canonical skill name."""
        lowered = term.strip().lower()
        if lowered in self.synonyms:
            return self.synonyms[lowered]

        # Case-preserving match against canonical skills
        for canonical in self._canonical_skills:
            if canonical.lower() == lowered:
                return canonical

        return term.strip()

    def extract_canonical_skills(self, text: str) -> List[str]:
        """
        Extracts all canonical skills from text using token-boundary regex matching
        and synonym resolution.
        """
        if not text:
            return []

        matched: Set[str] = set()

        for term, pattern in self._compiled_patterns.items():
            if pattern.search(text):
                canonical = self.resolve_synonym(term)
                matched.add(canonical)

        return sorted(list(matched))

    def categorize_skills(self, skills: List[str]) -> Dict[str, List[str]]:
        """
        Groups a list of skills into their respective domains.
        Returns a dictionary of {domain_name: [skills]}.
        """
        categorized: Dict[str, List[str]] = {domain: [] for domain in self.domains}
        categorized["other"] = []

        for skill in skills:
            canonical = self.resolve_synonym(skill)
            domain = self._skill_to_domain.get(canonical.lower())
            if domain and domain in categorized:
                if canonical not in categorized[domain]:
                    categorized[domain].append(canonical)
            else:
                if canonical not in categorized["other"]:
                    categorized["other"].append(canonical)

        # Remove empty categories
        return {d: sk for d, sk in categorized.items() if sk}

    def calculate_domain_coverage(
        self, matched_skills: List[str], target_skills: List[str]
    ) -> Dict[str, float]:
        """
        Calculates percentage coverage per domain based on matched vs target skills.
        """
        target_cats = self.categorize_skills(target_skills)
        matched_set = {self.resolve_synonym(s).lower() for s in matched_skills}

        coverage: Dict[str, float] = {}

        for domain, req_skills in target_cats.items():
            if not req_skills:
                continue
            matched_count = sum(
                1 for s in req_skills if s.lower() in matched_set
            )
            pct = round((matched_count / len(req_skills)) * 100.0, 1)
            coverage[domain] = pct

        return coverage

    def get_domain_summary(self, skills: List[str]) -> Dict[str, int]:
        """Returns skill counts per domain."""
        cats = self.categorize_skills(skills)
        return {domain: len(skill_list) for domain, skill_list in cats.items()}

    def get_all_domains(self) -> List[str]:
        """Returns list of all cataloged domains."""
        return sorted(list(self.domains.keys()))


# Global singleton instance for efficient zero-overhead reuse
_taxonomy_instance: Optional[TaxonomyService] = None


def get_taxonomy_service() -> TaxonomyService:
    """Returns the singleton TaxonomyService instance."""
    global _taxonomy_instance
    if _taxonomy_instance is None:
        _taxonomy_instance = TaxonomyService()
    return _taxonomy_instance
