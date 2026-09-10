# System Architecture — AI-Powered Resume Analyzer

> **Conceived, Architected & Directed by:** [Shivansh Mishra](https://github.com/Shivansh-mishraji) (Team Leader & Principal Architect)  
> **Documented by:** Sujeet Kannaujiya (Research & Documentation Lead)  
> **Evaluation:** BBD University • Academic Capstone 2026

- **Live Application:** [https://ai-powered-resume-analyzer-pi.vercel.app](https://ai-powered-resume-analyzer-pi.vercel.app)
- **Live Backend API:** [https://resume-analyzer-api.onrender.com](https://resume-analyzer-api.onrender.com)

---

## 🏛️ High-Level System Architecture

![System Architecture](../assets/architecture.jpg)

The AI-Powered Resume Analyzer implements a **Hybrid Multi-Model & Deterministic Architecture** using a Bring-Your-Own-Key (BYOK) model. 

```
┌────────────────────────────────────────────────────────────────────────┐
│                                 USER                                   │
│             (Browser at ai-powered-resume-analyzer-pi.vercel.app)       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP POST /analyze
                                    │ Headers: 'X-Gemini-API-Key' (Optional multi-provider key)
                                    │ Body: multipart/form-data (Resume, JD)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React 19 + Vite)                      │
│                                                                        │
│   App.jsx                                                              │
│   ├── Multi-Provider BYOK (Gemini AQ./AIza, OpenAI, Claude)            │
│   ├── Drag-and-Drop File Upload (PDF / DOCX in-memory)                 │
│   ├── Target Job Description Textarea & Quick Templates                │
│   ├── Silent Backend Warmup Trigger (warmUpBackend on mount)           │
│   ├── GPU-Accelerated Nebula Aurora Background & Reduced-Motion Guard  │
│   └── 60/120 FPS rAF Score Dashboard (Score, Skills, Strengths, Advice)│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP Request (CORS scoped to origin)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (FastAPI + Uvicorn)                     │
│                                                                        │
│   HTTP Gateway (`main.py`)                                             │
│   ├── GET  /health              ──> System health check                │
│   ├── POST /analyze             ──> Enriched analysis orchestrator     │
│   ├── GET  /taxonomy/domains    ──> 12 domains & 440+ skills catalog   │
│   ├── POST /audit/ats           ──> Deep ATS heuristics & verb density │
│   ├── POST /export/*            ──> PDF/MD/JSON/HTML with SHA-256 seal │
│   └── POST /interview/generate  ──> Technical interview kit generator │
│                                                                        │
│   Configuration Layer (`config.py`)                                    │
│   ├── MAX_FILE_SIZE_BYTES       ──> 5 MB                               │
│   ├── MAX_RESUME_CHARS          ──> 15,000 characters                  │
│   ├── MAX_JD_CHARS              ──> 5,000 characters                   │
│   └── ALLOWED_CORS_ORIGINS      ──> Explicit frontend origins          │
│                                                                        │
│   Parsing & In-Memory Extraction Layer (`resume_parser.py`)            │
│   ├── PyMuPDF (`pymupdf`) with `sort=True` geometric block sorting     │
│   ├── python-docx for Word document streams                            │
│   └── Scanned PDF detection (rejection if extractable text < 50 chars) │
│                                                                        │
│   5 Enterprise Backend Engines                                         │
│   ├── 1. Skills Taxonomy Engine (`taxonomy_service.py`)                │
│   ├── 2. Deep ATS Heuristic Engine (`ats_audit_service.py`)            │
│   ├── 3. Executive Report Exporter (`report_exporter.py`)              │
│   ├── 4. Interview Question Generator (`interview_generator.py`)       │
│   └── 5. Multi-Provider AI Engine (`ai_service.py` - Gemini/GPT/Claude)│
│                                                                        │
│   Unified Schema Contract (`schemas/analysis_schema.py`)               │
│   └── AnalysisResult with ats_audit, domain_breakdown & interview kit  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 End-to-End Data Flow (`POST /analyze`)

```
User uploads Resume + pastes Job Description + optional AI Key
                             │
                             ▼
     [1. Request Gateway & Validation]
     ├── Validate Content-Type (application/pdf or docx)
     ├── Enforce file size limit (≤ 5MB)
     └── Read binary stream directly into RAM
                             │
                             ▼
     [2. Parsing & Text Normalization]
     ├── Extract text stream in memory (sort=True)
     ├── Scanned image check (len(text) ≥ 50 chars)
     ├── Normalize whitespace & format bounds
     └── Check text length limits (warn if truncated)
                             │
                             ▼
     [3. Analysis Router Decision]
                    │
            API Key Provided?
             /             \
           YES              NO
            │                │
            ▼                ▼
     [4. Gemini AI Service]  [4b. Rule-Based Engine]
     ├── Rubric-based prompt ├── Clean text (regex)
     ├── Structured JSON     ├── Extract 50+ keywords
     ├── 1-retry on failure  └── Calculate set score
     │                       │
     ├── Success ────┐       │
     └── Failure ─┐  │       │
                  │  │       │
                  ▼  ▼       ▼
     [5. Unified Result & Enterprise Enrichment]
     ├── Enriches with 440+ Skills Taxonomy Breakdown
     ├── Enriches with Deep ATS Section & Verb Heuristics
     ├── Enriches with Tailored Candidate Interview Questions
     └── Generates Tamper-Proof Cryptographic SHA-256 Digest
                             │
                             ▼
     [6. JSON Response ──> React Dashboard]
```

---

## 🔐 Security & Privacy Architecture (BYOK Model)

1. **In-Memory Lifespan:** The user's API key is accepted via the `X-Gemini-API-Key` HTTP header. It resides only in temporary process memory for the duration of the request.
2. **Zero Storage / Zero Logging:** The key is never written to disk, never saved to a database, and never printed in server or access logs.
3. **Client-Side Encryption:** Keys in the browser are obfuscated in `sessionStorage` and destroyed on tab close.
4. **CORS Boundary Enforcement:** Cross-Origin Resource Sharing is strictly constrained to the official Vercel deployment domain and local development ports.
5. **Deterministic Fallback Guarantee:** If an API key is unprovided or third-party AI services are unreachable, the system automatically falls back to our sub-5ms, 89-test-verified deterministic rule-based scoring engine.

---

## 🧪 Test Architecture (89/89 Tests Passing)

The test suite covers:
- In-memory PDF / DOCX parsing edge cases
- Text cleaning, normalization, and punctuation isolation
- Set-intersection mathematical scoring
- Multi-provider AI key detection and fallback recovery
- Enterprise skills taxonomy and synonym resolution
- Deep ATS heuristic scoring, section triggers, and metric quantification
- Multi-format report export (Markdown, JSON, HTML, PDF) and SHA-256 validation
- Security sanitization against XSS, SQLi, and prompt injection attacks
- End-to-end integration pipeline verification

```bash
cd backend
pytest -v
# 89 passed in 3.09s (100% success rate)
```
