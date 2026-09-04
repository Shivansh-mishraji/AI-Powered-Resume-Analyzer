<div align="center">

# 🚀 AI-Powered Resume & Job Description Analyzer
### *Hybrid AI Career Intelligence Platform & ATS Semantic Analyzer*

[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python_3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-BYOK_Enabled-orange?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Pytest](https://img.shields.io/badge/Pytest-29_Tests_Passed-success?style=for-the-badge&logo=pytest&logoColor=white)](https://docs.pytest.org/)
[![CI](https://github.com/Shivansh-mishraji/AI-Powered-Resume-Analyzer/actions/workflows/ci.yml/badge.svg?branch=master)](https://github.com/Shivansh-mishraji/AI-Powered-Resume-Analyzer/actions/workflows/ci.yml)

<br/>

<img src="./assets/architecture_banner.jpg" alt="AI Resume Analyzer Architecture" width="100%" style="border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.4);" />

<p align="center">
  <b>Upload your resume (PDF/DOCX) + Job Description + Optional Gemini API Key → Deep Semantic Matching, Skill Gaps, Strengths, Weaknesses, and Actionable AI Suggestions!</b>
</p>

<p align="center">
  <strong>Upload your resume. Paste a job description. Get an AI-powered match score, skill gap analysis, and personalized improvement suggestions — instantly.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Google%20Gemini-2.5%20Flash-blue?logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-0.115+-green?logo=fastapi" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/Tests-38%2F38%20Passing-brightgreen" />
  <img src="https://img.shields.io/badge/Zero%20Disk%20Storage-Privacy%20First-purple" />
</p>

---

## 👥 Team

Job hunting is competitive, and standard keyword matchers fail to understand real-world engineering context (e.g. recognizing that *AWS ECS + Terraform* fulfills *Container Orchestration & IaC*).

The **AI-Powered Resume Analyzer** is a **Hybrid AI Intelligence Platform**:
1. 🤖 **Primary Engine (Google Gemini AI via BYOK):** Performs deep contextual semantic matching, dynamic skill extraction, candidate profiling, strengths & weaknesses analysis, and personalized resume improvement advice.
2. ⚙️ **Fallback Engine (Deterministic Rule-Based Analyzer):** If an API key is unprovided or AI service is unavailable, automatically falls back to our fast, 29-test-verified keyword extraction and set-intersection scoring engine.
3. 📄 **Secure In-Memory Parsing:** Parses PDF (`PyMuPDF` with block sorting) and DOCX directly in memory with zero disk persistence.
4. 🔐 **Privacy-First BYOK Model:** Users can provide their own Google Gemini API key. The key stays strictly in React component memory and is never logged or stored by the backend.
5. 📊 **Unified Data Contract:** Both AI and Fallback engines return a standardized JSON response, ensuring zero frontend crashes.

---

## 🔬 System Architecture Flow

```
                      👤 USER
                         │
                         ▼
                🎨 REACT FRONTEND
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    📄 Resume       📋 Job JD       🔑 Gemini Key
    (PDF/DOCX)                        (Optional)
         │               │               │
         └───────────────┼───────────────┘
                         ▼
                ⚙️ FASTAPI BACKEND
                         │
                  🛡️ VALIDATION
             (File Size ≤ 5MB, MIME)
                         │
                  📄 RESUME PARSER
             (In-Memory Stream, sort=True)
                         │
                  🧹 TEXT CLEANER
                         │
                🔀 ANALYSIS ROUTER
                         │
                API Key Available?
                 /              \
               YES              NO
                │                │
                ▼                ▼
          🤖 GEMINI AI     ⚙️ RULE ENGINE
            PRIMARY          FALLBACK
          (Structured)     (Deterministic)
                │                │
                └───────┬────────┘
                        ▼
             📋 UNIFIED RESULT SCHEMA
                        │
                        ▼
                📊 REACT DASHBOARD
```

---

## 👥 The Dream Team & Role Breakdown

Our project is divided among 4 specialized members following Agile/Scrum engineering workflows:

<div align="center">

| Member | Role | GitHub Profile |
|---|---|---|
| **Shivansh Mishra** | Backend Lead + AI Engineer + Scrum Master | [@Shivansh-mishraji](https://github.com/Shivansh-mishraji) |
| **Harshvardhan Sisodiya** | Frontend Developer (UI/UX) | [@harsh123-code](https://github.com/harsh123-code) |
| **Vishal Patel** | Testing & QA Automation Specialist | [@patelvishal-ji](https://github.com/patelvishal-ji) |
| **Sujeet Kannaujiya** | Research Lead & Technical Writer | [@sujeet-official](https://github.com/sujeet-official) |

</div>

---

## 🖥️ Dashboard Preview

#### ⚡ **Shivansh Mishra** — *Backend & AI Lead*
* ✅ **Done:** Built FastAPI backend architecture, in-memory PDF/DOCX binary parsers, text cleaner service, skill extractor, score calculator, and CI workflow.
* 🔄 **Doing Now:** Building the central `config.py`, unified Pydantic schemas, `rule_based_service.py`, `ai_service.py` (Gemini rubric), and `analysis_service.py` router.
* 🚀 **Will Do:** Production CORS hardening and deployment on Render.

---

#### 🎨 **Harshvardhan Sisodiya** — *Frontend Developer*
* ✅ **Done:** Built the React + Vite frontend layout, dark glassmorphism styling, drag-and-drop file upload, and animated score gauge.
* 🔄 **Doing Now:** Adding the in-memory BYOK Gemini API key input (`type="password"` with show/hide), loading state debounce, and AI insight cards.
* 🚀 **Will Do:** Build production bundle and deploy frontend on Vercel.

---

#### 🧪 **Vishal Patel** — *Testing & QA Specialist*
* ✅ **Done:** Created automated test suite (29/29 passing tests) and `testing/run_tests.py` QA test runner with narrative audit reports.
* 🔄 **Doing Now:** Writing unit tests for the AI service (`test_ai_service.py` with mocks) and Analysis Router (`test_analysis_service.py` for schema parity).
* 🚀 **Will Do:** Execute manual edge-case testing (scanned PDFs, corrupted files, rate limits) and sign off on final QA audit trail.

---

#### 📚 **Sujeet Kannaujiya** — *Research & Documentation*
* ✅ **Done:** Authored [`API_REFERENCE.md`](./docs/API_REFERENCE.md), [`ARCHITECTURE.md`](./docs/ARCHITECTURE.md), and [`RESEARCH.md`](./docs/RESEARCH.md).
* 🔄 **Doing Now:** Updating all technical documentation for the Hybrid AI Architecture, security guidelines, and schema contracts.
* 🚀 **Will Do:** Final documentation synchronization, viva cheat sheets, and project presentation slides.

---

## 🗺️ 6-Week Project Roadmap

```
📄 Resume (PDF/DOCX) + 📋 Job Description
              ⬇️
         ⚛️ React Frontend  (Vite · Port 5173)
              ⬇️  HTTP POST /analyze
        ⚡ FastAPI Backend  (Uvicorn · Port 8000)
              ⬇️
    📄 In-Memory File Parsing  (PyMuPDF / python-docx)
    — Files are NEVER saved to disk —
              ⬇️
    🧹 Text Cleaning & Skill Extraction
              ⬇️
       ┌──────────────────────────┐
       │  API Key provided?       │
       │  YES → 🤖 Gemini AI      │
       │  NO  → 🔄 Rule-Based     │
       └──────────────────────────┘
              ⬇️
      📊 Unified JSON Result
              ⬇️
   🖥️ Interactive Results Dashboard
```

### ✅ Completed Sprints (Weeks 1 – 4)
- [x] **Week 1 (Foundation):** FastAPI backend initialized, `/health` endpoint, strict PDF/DOCX validation, initial React Vite frontend.
- [x] **Week 2 (Text Cleaning & Skill Extraction):** In-memory text extraction, regex text normalization, and 50+ tech skills dictionary.
- [x] **Week 3 (Scoring & Full-Stack Integration):** Set-intersection score calculator, connected `POST /analyze`, 29 unit tests passing.
- [x] **Week 4 (UI Overhaul, QA & CI/CD):** Glassmorphic dark mode UI, radial score gauge, QA test audit logging system, and GitHub Actions CI pipeline.

---

### 🔄 Active Sprint (Week 5 — Hybrid Gemini AI Upgrade)
- [ ] **Phase 1 (Docs First):** Comprehensive documentation update for Hybrid AI & BYOK model.
- [ ] **Phases 2 – 9 (Backend & AI):** Central configuration, unified Pydantic response contract, Gemini AI service with rubric scoring, and analysis router.
- [ ] **Phases 10 – 11 (Testing):** Mocked AI service unit tests, router fallback tests, and QA audit report update.
- [ ] **Phases 12 – 13 (Frontend):** In-memory BYOK key input, AI/Fallback status indicators, and candidate strengths/weaknesses/suggestions display.

### Prerequisites

### 🚀 Upcoming Sprint (Week 6 — Deployment & Submission)
- [ ] **Phase 14 (Manual Verification):** Stress testing with real-world resumes, scanned PDFs, and rate limits.
- [ ] **Phase 15 (Deployment):** Frontend deployed to Vercel, Backend deployed to Render.
- [ ] **Phase 16 (Final Polish):** Final documentation sync from "Planned" to "Implemented" and viva defense prep.

---

## 🔑 BYOK — Bring Your Own Key

This project uses a **BYOK (Bring Your Own Key)** model for privacy and security:

- Your Gemini API key is passed directly in the request header per-session
- It is **never stored** on the server or in any database
- Without a key → system **automatically falls back** to deterministic keyword matching
- Get a free key at → [Google AI Studio](https://aistudio.google.com/app/apikey)

---

## 🧪 Running Tests

```bash
cd testing
python run_tests.py
```

**38/38 tests passing ✅ — 100% pass rate in 3.66s**

| Module | Tests | Status |
|--------|-------|--------|
| File Parser (PDF/DOCX) | 12 | ✅ All Pass |
| Skill Extractor & Text Cleaner | 10 | ✅ All Pass |
| API Integration (/analyze) | 16 | ✅ All Pass |

---

## 📁 Project Structure

```
AI-Powered-Resume-Analyzer/
│
├── .github/
│   └── workflows/
│       └── ci.yml                  # GitHub Actions CI pipeline
│
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI application & HTTP Gateway
│   │   ├── config.py               # Central limits, origins, & constants
│   │   ├── schemas/
│   │   │   └── analysis_schema.py  # Unified Pydantic response contract
│   │   └── services/
│   │       ├── resume_parser.py    # In-memory PDF (sort=True) & DOCX parser
│   │       ├── text_cleaner.py     # Regex-based text normalization
│   │       ├── skill_extractor.py  # 50+ tech skill keyword matcher
│   │       ├── score_calculator.py # Set-intersection match score engine
│   │       ├── rule_based_service.py # Deterministic fallback wrapper
│   │       ├── ai_service.py       # Google Gemini AI semantic service
│   │       └── analysis_service.py # Analysis Router & Orchestrator
│   ├── tests/
│   │   ├── test_main.py
│   │   ├── test_analyze.py
│   │   ├── test_score_calculator.py
│   │   ├── test_skill_extractor.py
│   │   ├── test_text_cleaner.py
│   │   ├── test_ai_service.py      # Mocked Gemini AI tests
│   │   └── test_analysis_service.py# Router & fallback tests
│   ├── conftest.py
│   ├── requirements.txt
│   └── GUIDELINES.md
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Main React component (BYOK + AI UI)
│   │   ├── App.css                 # Dark mode glassmorphism styles
│   │   └── index.css               # Global typography & variables
│   ├── index.html
│   ├── vite.config.js
│   └── GUIDELINES.md
│
├── testing/
│   ├── run_tests.py                # QA test runner with narrative logs
│   └── reports/                    # Timestamped test execution history
│
├── docs/
│   ├── API_REFERENCE.md            # Endpoint documentation & payloads
│   ├── ARCHITECTURE.md             # System architecture & component design
│   └── RESEARCH.md                 # Technical decisions & algorithmic research
│
├── assets/                         # Architecture diagrams & pipeline visuals
├── README.md
└── .gitignore
```

---

## ⚡ Quick Start Guide (Run Locally)

### 1️⃣ Clone the Repository & Checkout Branch
```bash
git clone https://github.com/Shivansh-mishraji/AI-Powered-Resume-Analyzer.git
cd "AI-Powered-Resume-Analyzer"
git checkout feature/gemini-ai-upgrade
```

### 2️⃣ Start the Backend Server
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate      # On macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```
👉 *Swagger API Docs:* **`http://127.0.0.1:8000/docs`**

### 3️⃣ Start the Frontend App
```bash
# In a new terminal window:
cd frontend
npm install
npm run dev
```
👉 *Frontend UI Live:* **`http://localhost:5173/`**

### 4️⃣ Run Automated QA Test Suite
```bash
# Run from project root — generates timestamped report in testing/reports/
python testing/run_tests.py
```

---

<div align="center">
  <sub>Built with ❤️ by Shivansh, Harshwardhan, Vishal & Sujeet | Academic Minor Project 2026</sub>
</div>
