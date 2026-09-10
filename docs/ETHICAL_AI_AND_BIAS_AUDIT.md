# Ethical AI Framework & Algorithmic Fairness Audit

**Document ID:** `ETHIC-AI-2026-v2`  
**Author:** Sujeet Kannaujiya (`sujeet-official`)  
**Role:** Research Lead • Technical Documentation  
**Project:** AI-Powered Resume Analyzer  

---

## 1. Executive Summary
Algorithmic fairness and regulatory compliance are foundational to the architecture of the **AI-Powered Resume Analyzer**. Automated hiring systems risk reinforcing historical societal biases if not guarded by strict algorithmic constraints. This framework codifies our adherence to **EEOC (Equal Employment Opportunity Commission)** guidelines, **EU Artificial Intelligence Act (High-Risk AI Systems)** requirements, and modern algorithmic auditability standards.

---

## 2. Core Pillars of Ethical Evaluation

### 2.1 Pure Competency-Centric Scoring
Our system restricts evaluation strictly to measurable technical competencies, architectural ownership, and quantified deliverables:
- **Zero Demographic Weighting:** The evaluation rubric explicitly ignores age, gender, ethnicity, nationality, disability status, or socioeconomic markers.
- **Strict Skill Ontology Mapping:** Through `taxonomy_service.py`, skills are matched against objective canonical technologies (e.g., `FastAPI`, `Kubernetes`), eliminating subjective recruiter bias.
- **Action-Oriented Scoring:** The ATS heuristic engine (`ats_audit_service.py`) scores based on verified action verbs (`architected`, `engineered`, `optimized`) and quantifiable metrics (`%`, `$`, throughput), rewarding demonstrated impact over candidate pedigree.

---

## 3. PII (Personally Identifiable Information) Isolation Matrix

| PII Attribute | System Treatment | Rationale & Protection |
|---|---|---|
| **Full Name** | Metadata Only | Displayed solely on report output headers; completely excluded from score calculations |
| **Phone Number / Address** | Section Presence Only | Checked solely for ATS contact section completeness; content is never analyzed |
| **Graduation Dates / Age** | Neutralized | Degree title is parsed for educational qualification; completion year has zero impact on match score |
| **Photographs / Avatars** | Zero-Disk Ignored | PyMuPDF text extraction extracts solely UTF-8 text streams; embedded images are discarded in memory |

---

## 4. Algorithmic Transparency & Auditability

1. **Deterministic Baseline Guarantee:** When unconfigured with an AI provider, the system falls back to a 100% deterministic rule-based calculation (`score_calculator.py`). This guarantees full mathematical explainability:
   $$\text{Score} = \text{round}\left( \frac{|\text{Matched Skills}|}{|\text{Required Skills}|} \times 100 \right)$$
2. **Cryptographic Provenance:** Every audit report is sealed with a SHA-256 digital digest (`report_exporter.py`). Any post-hoc alteration to candidate qualifications or evaluation criteria invalidates the verification seal.
3. **No Black-Box Rejections:** Every candidate evaluation provides transparent, constructive suggestions and identified skill gaps to empower candidate upskilling.

---

**Authored & Certified by:**  
**Sujeet Kannaujiya**  
*Research Lead • Technical Documentation*
