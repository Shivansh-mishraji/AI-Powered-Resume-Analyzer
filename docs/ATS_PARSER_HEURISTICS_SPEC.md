# ATS Parsing Heuristics & Document Ingestion Specification

**Document Version:** `2.1.0-SPEC`  
**Author:** Sujeet Kannaujiya (`sujeet-official`)  
**Role:** Research Lead • Technical Documentation  
**Project:** AI-Powered Resume Analyzer  

---

## 1. The Multi-Column PDF Challenge
In modern applicant tracking systems (ATS), over 45% of resume parsing rejections stem from document layout desynchronization. Standard PDF specifications encode visual display coordinates rather than sequential semantic text paragraphs. Naive PDF parsers read across physical horizontal scanlines, causing severe column cross-contamination:

$$\text{Column A: "Architected microservices"} \quad \text{Column B: "San Francisco, CA"}$$
$$\xrightarrow{\text{Naive Read}} \quad \text{"Architected San microservices Francisco, CA" (Mangled text)}$$

---

## 2. In-Memory Resolution Pipeline

Our platform utilizes **PyMuPDF (`fitz`)** with geometry-aware sorting (`sort=True`) executed strictly in volatile memory buffers:

```
[Raw Uploaded PDF Bytes]
         │
         ▼
[pymupdf.open(stream=file_bytes)]
         │
         ▼
[Extract Blocks & Spans with Geometric Sorting: sort=True]
         │
         ▼
[Unicode Normalization (NFKD) & Ligature Unfolding ('fi' -> 'f'+'i')]
         │
         ▼
[Cleaned Sequential Text Stream]
         │
         ├───> [Taxonomy Engine: Canonical Skill Extraction]
         ├───> [ATS Heuristic Engine: Section & Verb Detection]
         └───> [Multi-Provider AI Analysis Gateway]
```

---

## 3. Section Boundary Trigger Matrix

The ATS audit engine (`ats_audit_service.py`) analyzes structural integrity across 7 canonical sections using precompiled regex triggers:

| Section Name | Primary Regex Trigger | Minimum Content Expectation |
|---|---|---|
| `contact_info` | `(@\|\b(email\|phone\|mobile\|tel\|linkedin\|github\|portfolio)\b)` | Direct communication channels |
| `professional_summary` | `\b(summary\|profile\|about me\|objective\|executive summary)\b` | High-level engineering profile |
| `work_experience` | `\b(experience\|work history\|employment\|career history)\b` | Chronological role achievements |
| `education` | `\b(education\|academic\|degree\|university\|college\|b\.tech\|m\.tech)\b` | Institutional credentials |
| `technical_skills` | `\b(skills\|technical skills\|technologies\|proficiencies\|stack)\b` | Toolchains and languages |
| `projects` | `\b(projects\|personal projects\|key projects\|open source)\b` | Concrete software deliverables |
| `certifications` | `\b(certifications\|licenses\|credentials\|accreditations)\b` | Industry credentials (AWS, CKA) |

---

## 4. Quantification & Action Verb Scoring Heuristics

1. **Quantification Ratio:** Calculated as:
   $$\text{Ratio} = \frac{\text{Bullets Containing Metric RegExes}}{\text{Total Identified Bullets}} \times 100$$
   Detects percentages (`\d+(\.\d+)?%`), financial values (`\$\d+`), throughput (`\d+\s*req/s`), latencies (`\d+\s*ms`), and scale indicators (`\d+[kKmMbB]`).
2. **Verb Strength Density:** Tracks 150+ categorized engineering action verbs across Architectural, Engineering, Optimization, and Security classifications.

---

**Authored by:**  
**Sujeet Kannaujiya**  
*Research Lead • Technical Documentation*
