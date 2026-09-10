# Academic Capstone Project Dossier & Final Technical Report

**Project Title:** AI-Powered Resume Analyzer: Hybrid Multi-Provider Semantic Evaluation & ATS Quantification Gateway  
**Institution:** Babu Banarasi Das University (BBDU)  
**Academic Year:** 2025–2026  
**Document Author:** Sujeet Kannaujiya (`sujeet-official`), Research Lead • Technical Documentation  

---

## 1. Project Overview & Problem Statement
Traditional Applicant Tracking Systems (ATS) rely primarily on rigid keyword matching, rejecting highly qualified candidates due to semantic mismatch, layout parsing errors, or missing synonyms. Conversely, pure generative AI solutions face unpredictable rate limits, high token costs, and opaque scoring black boxes.

The **AI-Powered Resume Analyzer** bridges this divide through a hybrid architecture combining:
1. **Multi-Provider AI Semantic Rubric Engine:** Deep semantic analysis utilizing Gemini 2.5/3.6 Flash, GPT-4o, and Claude 3.5.
2. **Deterministic Rule-Based Fallback Engine:** Sub-5ms keyword alignment and mathematical scoring guaranteeing zero downtime.
3. **Enterprise Skills Taxonomy & Synonym Graph:** 440+ canonical technologies across 12 engineering domains with alias mapping.
4. **Deep ATS Heuristic & Quantification Engine:** Action verb density and measurable bullet quantification scoring.
5. **Executive Report Exporter:** Tamper-proof Markdown, JSON, HTML, and PyMuPDF PDF reports with SHA-256 digital seals.

---

## 2. Engineering Team Roles & Distribution of Ownership

```
                        ╔═══════════════════════════════════════╗
                        ║           SHIVANSH MISHRA             ║
                        ║ 👑 Team Leader & Principal Architect   ║
                        ║ Backend Gateway, AI Rubrics, Exporters║
                        ╚═══════════════════╦═══════════════════╝
                                            ║
             ┌──────────────────────────────┼──────────────────────────────┐
             ▼                              ▼                              ▼
╔═════════════════════════╗    ╔═════════════════════════╗    ╔═════════════════════════╗
║  HARSHVARDHAN SISODIYA  ║    ║      VISHAL PATEL       ║    ║    SUJEET KANNAUJIYA    ║
║ 🎨 Frontend Architect    ║    ║ 🛡️ QA & Security Lead    ║    ║ 📑 Research & Docs Lead  ║
║ React 19, Nebula Aurora ║    ║ 89-Test Suite, Benchmarks║    ║ Research Dossier, Specs ║
╚═════════════════════════╝    ╚═════════════════════════╝    ╚═════════════════════════╝
```

### Team Deliverables Matrix:
- **Shivansh Mishra (Leader & Architect):** Conceived and engineered platform backend architecture, FastAPI endpoints, Gemini AI rubric engine, 440+ skills taxonomy graph, ATS heuristic engine, PyMuPDF report generator, and interview question generator.
- **Harshvardhan Sisodiya (Frontend Architect):** Engineered React 19 SPA, Nebula Aurora glassmorphism UI, 180px SVG radial match gauge, and interactive team flashcard deck.
- **Vishal Patel (QA & Security Lead):** Designed automated test suite (89 passing tests), E2E integration test harness, concurrency benchmark runner, and security vulnerability test suite.
- **Sujeet Kannaujiya (Research & Docs Lead):** Authored academic project dossier, LLM model benchmark study, ATS parsing specifications, ethical AI fairness rubric, and OWASP security audit.

---

## 3. High-Level System Architecture & Microservice Endpoints

```
[Candidate Client (React 19 SPA)]
         │
         │ (HTTP Multipart POST /analyze)
         ▼
[FastAPI REST API Gateway (port 8000)]
         │
         ├───> [PyMuPDF Stream Decoder (Zero-Disk In-Memory)]
         │
         ├───> [Analysis Router (analysis_service.py)]
         │         ├─── [Gemini AI Engine (X-Gemini-API-Key)]
         │         └─── [Deterministic Fallback (Rule-Based)]
         │
         ├───> [Skills Taxonomy Service (taxonomy_graph.json)]
         │
         ├───> [ATS Heuristic Audit Engine (ats_audit_service.py)]
         │
         ├───> [Candidate Interview Generator (interview_generator.py)]
         │
         └───> [Executive Report Exporter (report_exporter.py)]
                   ├─── Markdown Audit Log
                   ├─── Canonical JSON Schema
                   ├─── Responsive Printable HTML
                   └─── Cryptographically Signed PyMuPDF PDF
```

---

## 4. Key Performance Indicators (KPIs)
- **Test Suite Coverage:** **89/89 automated tests passing (100% success rate)**
- **Processing Latency:** Sub-5ms deterministic analysis, ~780ms cloud AI evaluation
- **Document Ingestion:** Zero-disk volatile memory decoding; zero disk persistence
- **Security Posture:** SHA-256 digital seals, XSS/SQLi sanitization, OWASP API Top 10 compliance

---

**Compiled & Authored by:**  
**Sujeet Kannaujiya**  
*Research Lead • Technical Documentation*  
*Babu Banarasi Das University (BBDU)*
