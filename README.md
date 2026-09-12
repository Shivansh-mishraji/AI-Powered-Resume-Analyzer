<div align="center">

# 🚀 AI-Powered Resume & Job Description Analyzer
### *Hybrid AI Career Intelligence Platform & ATS Semantic Analyzer*

[![Live Website](https://img.shields.io/badge/🌐_Live_Website-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-powered-resume-analyzer-pi.vercel.app)
[![Backend API](https://img.shields.io/badge/⚡_Backend_API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://resume-analyzer-api.onrender.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Python](https://img.shields.io/badge/Python_3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Multi-Provider AI](https://img.shields.io/badge/AI_BYOK-Gemini_·_OpenAI_·_Claude-orange?style=for-the-badge)](https://aistudio.google.com/)
[![Pytest](https://img.shields.io/badge/Pytest-90_Tests_Passed-success?style=for-the-badge&logo=pytest&logoColor=white)](https://docs.pytest.org/)

<br/><br/>

<img src="./assets/banner.jpg" alt="AI Resume Analyzer Banner" width="100%" style="border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.4);" />

<br/>

<p align="center">
  <b>Upload your resume (PDF/DOCX) + Job Description + Optional Multi-Provider API Key → Deep Semantic Matching, Skill Gaps, Strengths, Weaknesses, ATS Heuristic Audit, and Actionable AI Suggestions!</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/AI%20Engine-Gemini%202.5%20%2F%202.0%20%2F%20GPT--4o%20%2F%20Claude-blue?logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-0.115+-green?logo=fastapi" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" />
  <img src="https://img.shields.io/badge/Tests-90%2F90%20Passing-brightgreen" />
  <img src="https://img.shields.io/badge/Zero%20Disk%20Storage-Privacy%20First-purple" />
  <img src="https://img.shields.io/badge/Performance-60%2F120%20FPS%20GPU-cyan" />
</p>

</div>

---

> 👑 **Project Leader & Principal Architect:** [Shivansh Mishra](https://github.com/Shivansh-mishraji)  
> 🌐 **Live Production Website:** [https://ai-powered-resume-analyzer-pi.vercel.app](https://ai-powered-resume-analyzer-pi.vercel.app)  
> ⚡ **Live Production API:** [https://resume-analyzer-api.onrender.com](https://resume-analyzer-api.onrender.com)

---

## 🎯 Why ResumeAI?

Job hunting is competitive, and standard keyword matchers fail to understand real-world engineering context (e.g. recognizing that *AWS ECS + Terraform* fulfills *Container Orchestration & IaC*).

The **AI-Powered Resume Analyzer** is a **Hybrid Multi-Model Career Intelligence Platform**:
1. 🤖 **Primary Engine (Multi-Provider AI via BYOK):**
   - **Google Gemini**: Auto-detects legacy `AIza...` and modern `AQ....` developer keys with automatic model fallback chain (`gemini-3.6-flash` → `gemini-2.5-flash` → `gemini-1.5-flash`).
   - **OpenAI**: Auto-detects `sk-...` keys and routes to `gpt-4o` / `gpt-4o-mini`.
   - **Anthropic Claude**: Auto-detects `sk-ant-...` keys and routes to `claude-opus-4` / `claude-3-5-sonnet`.
   - Generates deep contextual semantic matching, dynamic skill extraction, candidate profiling, strengths & weaknesses analysis, and personalized resume improvement advice.
2. ⚙️ **Fallback Engine (Deterministic Rule-Based Analyzer):** If an API key is unprovided or third-party AI services are unreachable, automatically falls back to our sub-5ms, 89-test-verified keyword extraction and set-intersection scoring engine.
3. 🧠 **Enterprise Skills Taxonomy & Synonym Graph:** Catalogs 440+ canonical technologies across 12 engineering domains with automatic alias resolution (`k8s` → `Kubernetes`, `postgres` → `PostgreSQL`, `mongo` → `MongoDB`).
4. 🔍 **Deep ATS Heuristic & Quantification Engine:** Audits 7 standard resume sections, analyzes Action Verb Density across 150+ verbs, and calculates a quantified impact score (`%`, `$`, throughput, latency).
5. 📄 **Automated Multi-Format Audit Exporter:** Generates executive PDF, Markdown, JSON, and printable HTML reports stamped with tamper-proof **SHA-256 cryptographic digital seals**.
6. 🎯 **Candidate Technical Interview Generator:** Automatically generates tailored technical questions, system design scenarios, and behavioral prompts based on identified skill gaps.
7. 🔒 **Enterprise-Grade Client Security:**
   - Keys are obfuscated in `sessionStorage` (auto-cleared on tab close).
   - Never logged, never written to disk, and never stored in any database.
   - Master toggle allows users to pause AI analysis without clearing their saved key.
8. ⚡ **Zero-Lag & 60/120 FPS Performance:**
   - Score counting uses `requestAnimationFrame` with an ease-out cubic animation curve.
   - Background aurora effects are GPU-accelerated with tab-visibility awareness (`document.hidden`) and `prefers-reduced-motion` compliance.
   - Silent backend pre-warming (`warmUpBackend()`) automatically wakes Render free-tier instances on page load.
9. 📊 **Unified Data Contract:** Both AI and Fallback engines return a standardized Pydantic JSON response, guaranteeing zero frontend crashes.

---

## 🔬 System Architecture Flow

```
                      👤 USER
                         │
                         ▼
          🎨 REACT 19 + VITE FRONTEND (Vercel)
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
    📄 Resume       📋 Job JD       🔑 AI Key (BYOK)
    (PDF/DOCX)                      (Gemini AQ./AIza, OpenAI, Claude)
         │               │               │
         └───────────────┼───────────────┘
                         ▼
          ⚙️ FASTAPI BACKEND (Render Cloud)
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
                API Key Provided?
                 /              \
               YES              NO
                │                │
                ▼                ▼
          🤖 MULTI-MODEL   ⚙️ RULE ENGINE
             PRIMARY          FALLBACK
        (Gemini/GPT/Claude) (Deterministic)
                │                │
                └───────┬────────┘
                        ▼
              📋 ENRICHMENT PIPELINE
         ├── Skills Taxonomy Graph (12 Domains)
         ├── Deep ATS Heuristics & Verbs
         ├── Interview Question Generator
         └── SHA-256 Executive Exporter
                        │
                        ▼
                📊 REACT DASHBOARD
```

<p align="center">
  <img src="./assets/architecture.jpg" alt="System Architecture Diagram" width="100%" style="border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.4);" />
</p>

---

## 🖥️ Live Application & Dashboard Showcase

<p align="center">
  <img src="./assets/dashboard.jpg" alt="Interactive Desktop Results Dashboard" width="67%" style="border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); vertical-align: middle; margin-right: 1.5%;" />
  <img src="./assets/mobile.jpg" alt="Responsive Mobile Experience" width="30%" style="border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); vertical-align: middle;" />
</p>

<p align="center">
  <em>Interactive Results Dashboard (Left) &amp; Touch-Optimized Responsive Mobile Experience (Right)</em>
</p>

---

## ⚡ 3-Stage Pipeline Breakdown

<p align="center">
  <img src="./assets/step1_parsing.jpg" alt="Step 1: In-Memory Parsing" width="32%" style="border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.3);" />
  <img src="./assets/step2_matching.jpg" alt="Step 2: Semantic Matching" width="32%" style="border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.3);" />
  <img src="./assets/step3_ui_dashboard.jpg" alt="Step 3: Interactive UI Dashboard" width="32%" style="border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.3);" />
</p>

| Stage 1: In-Memory Document Ingestion | Stage 2: Multi-Model Semantic Matching | Stage 3: Real-Time Intelligence Dashboard |
|---|---|---|
| • PyMuPDF stream parsing (`sort=True`)<br/>• Strict 5MB &amp; 10-page safety guards<br/>• 100% transient RAM processing | • Multi-Provider AI (Gemini, GPT-4o, Claude)<br/>• 89-test deterministic fallback engine<br/>• Dynamic skill extraction &amp; gap identification | • 60/120 FPS hardware-synced score physics<br/>• Nebula Aurora GPU-accelerated theme<br/>• Comprehensive strengths &amp; recommendations |

---

## 👥 Engineering Team & Technical Attribution

BBD University • Academic Capstone 2026 • Full-Stack AI Academic Evaluation

### 👑 Project Leadership & Principal Architect

<a href="https://github.com/Shivansh-mishraji">
  <img align="left" width="160" height="160" src="./assets/team/shivansh_circle.png" alt="Shivansh Mishra • Team Leader & Principal Architect" />
</a>

### 👑 <a href="https://github.com/Shivansh-mishraji">Shivansh Mishra</a>
**Team Leader & Principal Architect • Backend & AI Systems Architecture**  
[![Team Lead](https://img.shields.io/badge/👑_Team_Lead-00F0FF?style=flat-square&labelColor=0d1117&color=00F0FF)](https://github.com/Shivansh-mishraji) [![GitHub Profile](https://img.shields.io/badge/GitHub-Shivansh--mishraji-181717?style=flat-square&logo=github)](https://github.com/Shivansh-mishraji) [![Email Contact](https://img.shields.io/badge/Email-tgsmishra%40gmail.com-D14836?style=flat-square&logo=gmail&logoColor=white)](mailto:tgsmishra@gmail.com)

*Conceived, engineered, and steered the complete platform architecture end-to-end:*
- **FastAPI REST Gateway & Routing:** Architected the central routing layer, request validation, upload boundaries, and explicit CORS origin security.
- **5 Strategic Enterprise Backend Systems:** Built the Enterprise Skills Taxonomy Engine (440+ skills, 12 domains), Deep ATS Heuristic Engine, Automated Executive Multi-Format Report Exporter (PDF/Markdown/HTML/JSON with SHA-256 seals), and Candidate Interview Question Generator.
- **Multi-Provider AI Rubric Engine:** Integrated Google Gemini (`AQ....` & `AIza...` keys), OpenAI (`sk-...`), and Claude (`sk-ant-...`) with automated multi-tier model fallbacks.
- **In-Memory Document Ingestion:** Authored zero-persistence PyMuPDF binary streaming (`sort=True`) with zero disk retention for enterprise-grade privacy.
- **Deterministic Fallback Orchestration:** Built high-availability fallback engine guaranteeing uninterrupted analysis under network disconnects or API limits.
- **Cloud Production Deployments:** Led the cloud infrastructure deployments on Render (FastAPI) and Vercel (React).

<br clear="left" />

### 🌟 Core Engineering Contributors

<table>
  <tr align="center">
    <th width="25%">👑 Team Leader</th>
    <th width="25%">Frontend Architect</th>
    <th width="25%">QA &amp; Security Lead</th>
    <th width="25%">Research &amp; Docs Lead</th>
  </tr>
  <tr align="center" valign="top">
    <td>
      <a href="https://github.com/Shivansh-mishraji">
        <img src="./assets/team/shivansh_circle.png" width="85" height="85" alt="Shivansh Mishra" /><br/>
        <b>Shivansh Mishra</b>
      </a><br/>
      <small><b>Team Leader &amp; Principal Architect</b></small><br/><br/>
      <small>FastAPI Gateway, 5 Backend Systems, Skills Taxonomy, ATS Engine, Exporter, In-Memory Stream Parsing</small><br/><br/>
      <a href="https://github.com/Shivansh-mishraji"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github" /></a>
      <a href="mailto:tgsmishra@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=flat-square&logo=gmail" /></a>
    </td>
    <td>
      <a href="https://github.com/harsh123-code">
        <img src="./assets/team/harshvardhan_circle.png" width="85" height="85" alt="Harshvardhan Sisodiya" /><br/>
        <b>Harshvardhan Sisodiya</b>
      </a><br/>
      <small>Frontend Architect &amp; UI/UX Lead</small><br/><br/>
      <small>React 19 SPA, Nebula Aurora Glassmorphism, 60fps rAF Animation Physics, BYOK Hub, Team Deck</small><br/><br/>
      <a href="https://github.com/harsh123-code"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github" /></a>
      <a href="mailto:hsisodiya205@bbdu.ac.in"><img src="https://img.shields.io/badge/Email-D14836?style=flat-square&logo=gmail" /></a>
    </td>
    <td>
      <a href="https://github.com/patelvishal-ji">
        <img src="./assets/team/vishal_circle.png" width="85" height="85" alt="Vishal Patel" /><br/>
        <b>Vishal Patel</b>
      </a><br/>
      <small>QA Lead &amp; Security Specialist</small><br/><br/>
      <small>Pytest 90/90 Test Suite, Security Sanitization (XSS/SQLi), E2E Test Harness, Concurrency Benchmarks</small><br/><br/>
      <a href="https://github.com/patelvishal-ji"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github" /></a>
      <a href="mailto:patelvishal7800023@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=flat-square&logo=gmail" /></a>
    </td>
    <td>
      <a href="https://github.com/sujeet-official">
        <img src="./assets/team/sujeet_circle.png" width="85" height="85" alt="Sujeet Kannaujiya" /><br/>
        <b>Sujeet Kannaujiya</b>
      </a><br/>
      <small>Research &amp; Technical Docs Lead</small><br/><br/>
      <small>Capstone Project Dossier, LLM Benchmark Study, Ethical AI Non-Bias Rubric, ATS Specifications</small><br/><br/>
      <a href="https://github.com/sujeet-official"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github" /></a>
      <a href="mailto:sujeetkannaujiya2004@bbdu.ac.in"><img src="https://img.shields.io/badge/Email-D14836?style=flat-square&logo=gmail" /></a>
    </td>
  </tr>
</table>

| Member | Role | Core Modules & Technical Contributions | Contact |
|---|---|---|---|
| 👑 **Shivansh Mishra** | **Team Leader • Backend & AI Architect** | • FastAPI REST Gateway, Routing & CORS Architecture<br/>• 5 Enterprise Backend Systems (Taxonomy, ATS, Exporters, Interview Kit)<br/>• In-Memory PyMuPDF Document Streaming (`sort=True`)<br/>• Deterministic Rule-Based Fallback Orchestration | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github)](https://github.com/Shivansh-mishraji) [![Email](https://img.shields.io/badge/Email-D14836?style=flat&logo=gmail&logoColor=white)](mailto:tgsmishra@gmail.com) |
| **Harshvardhan Sisodiya** | Frontend Architect • UI/UX Lead | • React 19 + Vite Modular Single-Page Application (SPA)<br/>• Nebula Aurora Glassmorphism & 60fps rAF Animation Engine<br/>• 180px SVG Radial Match Gauge & Count-Up Physics<br/>• Multi-Provider BYOK Security Hub & Live Telemetry | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github)](https://github.com/harsh123-code) [![Email](https://img.shields.io/badge/Email-D14836?style=flat&logo=gmail&logoColor=white)](mailto:hsisodiya205@bbdu.ac.in) |
| **Vishal Patel** | QA Lead • Security & Automated Testing | • Pytest Automated Test Suite (90/90 Passing Tests)<br/>• Automated Security Test Harness (XSS, SQLi, Prompt Injection)<br/>• End-to-End Automated Integration Test Harness (`e2e_integration_test.py`)<br/>• API Concurrency & Latency Benchmark Runner (`benchmark_runner.py`) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github)](https://github.com/patelvishal-ji) [![Email](https://img.shields.io/badge/Email-D14836?style=flat&logo=gmail&logoColor=white)](mailto:patelvishal7800023@gmail.com) |
| **Sujeet Kannaujiya** | Research Lead • Technical Documentation | • Academic Capstone Project Technical Dossier (`docs/CAPSTONE_PROJECT_DOSSIER.md`)<br/>• LLM Benchmarking Study across Gemini, GPT-4o, Claude (`RESEARCH_LLM_BENCHMARKS.md`)<br/>• Ethical AI Framework & Non-Discriminatory Rubric (`ETHICAL_AI_AND_BIAS_AUDIT.md`)<br/>• ATS Parsing Heuristics & Font Encoding Specification (`ATS_PARSER_HEURISTICS_SPEC.md`) | [![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github)](https://github.com/sujeet-official) [![Email](https://img.shields.io/badge/Email-D14836?style=flat&logo=gmail&logoColor=white)](mailto:sujeetkannaujiya2004@bbdu.ac.in) |

---

## 🔑 Multi-Provider BYOK — Bring Your Own Key

This project implements an enterprise **BYOK (Bring Your Own Key)** architecture for maximum privacy, security, and flexibility:

- **Supported Key Formats:**
  - 🤖 **Google Gemini**: Accepts both legacy `AIza...` and modern `AQ....` developer keys ([Google AI Studio](https://aistudio.google.com/app/apikey)).
  - ⚡ **OpenAI**: Accepts `sk-...` keys for GPT-4o / GPT-4o-mini ([OpenAI Platform](https://platform.openai.com/api-keys)).
  - 🧠 **Anthropic Claude**: Accepts `sk-ant-...` keys for Claude 3.5 Sonnet / Opus ([Anthropic Console](https://console.anthropic.com/keys)).
- **Zero Server Persistence:** API keys are never stored on disk, never saved to any database, and never written to server logs.
- **Client Session Isolation:** Keys are obfuscated in browser `sessionStorage` and cleared automatically when the tab closes.
- **Flexible Mode Control:** Master toggle allows pausing AI mode anytime to test deterministic rule-based analysis without losing your key.

---

## 🧪 Running Tests

```bash
cd backend
pytest
```

**90/90 tests passing ✅ — 100% pass rate in 2.4s**

| Module | Tests | Status | Scope / Focus Area |
|---|:---:|:---:|---|
| `test_ai_service.py` | 7 | ✅ All Pass | Gemini 2.5/2.0 Flash fallback, error handling, rate-limits |
| `test_analysis_service.py` | 4 | ✅ All Pass | Analysis router, character limits, deterministic fallback |
| `test_analyze.py` | 3 | ✅ All Pass | Upload validation, PDF stream handling, MIME enforcement |
| `test_ats_audit.py` | 9 | ✅ All Pass | 7 section headers, 150+ action verbs, metric quantification |
| `test_interview_generator.py` | 8 | ✅ All Pass | Skill gap probing, competency validation, system design |
| `test_main.py` | 3 | ✅ All Pass | Core FastAPI lifespan, CORS middleware, /health probe |
| `test_new_endpoints.py` | 9 | ✅ All Pass | /taxonomy/domains, /audit/ats, /export/* (MD/JSON/HTML/PDF) |
| `test_report_exporter.py` | 8 | ✅ All Pass | SHA-256 seal determinism, PyMuPDF PDF, HTML print CSS |
| `test_score_calculator.py` | 7 | ✅ All Pass | Skill ratio calculation, weighting logic, boundary clamp |
| `test_security_sanitization.py` | 7 | ✅ All Pass | XSS neutralization, SQLi handling, prompt injection defense |
| `test_skill_extractor.py` | 9 | ✅ All Pass | Keyword extraction, case insensitivity, boundary isolation |
| `test_taxonomy.py` | 9 | ✅ All Pass | 440+ canonical skills, 12 domains, 79 synonym alias mappings |
| `test_text_cleaner.py` | 7 | ✅ All Pass | Whitespace normalization, punctuation, non-ASCII cleanup |

---

## 📁 Project Structure

```
AI-Powered-Resume-Analyzer/
├── .github/
│   └── workflows/
│       └── ci.yml                          # GitHub Actions CI pipeline
├── backend/
│   ├── app/
│   │   ├── main.py                         # FastAPI gateway & enterprise endpoints
│   │   ├── config.py                       # Central limits, origins & constants
│   │   ├── schemas/
│   │   │   └── analysis_schema.py          # Unified response & request schemas
│   │   └── services/
│   │       ├── resume_parser.py            # In-memory PDF (sort=True) & DOCX parser
│   │       ├── text_cleaner.py             # Regex text normalization
│   │       ├── skill_extractor.py          # 50+ tech skill keyword matcher
│   │       ├── score_calculator.py         # Set-intersection match score engine
│   │       ├── rule_based_service.py       # Deterministic fallback service
│   │       ├── ai_service.py               # Multi-provider AI semantic engine
│   │       ├── analysis_service.py         # Analysis router & enrichment orchestrator
│   │       ├── taxonomy_service.py         # 440+ canonical skills & synonym engine
│   │       ├── taxonomy_graph.json         # 12 engineering domains ontology graph
│   │       ├── skills_graph.json           # Skills graph alias mapping
│   │       ├── ats_audit_service.py        # Deep ATS heuristic & quantification engine
│   │       ├── report_exporter.py          # PDF/MD/JSON/HTML with SHA-256 seals
│   │       └── interview_generator.py      # Candidate technical interview question generator
│   ├── tests/                              # 89/89 passing pytest test suite (13 modules)
│   ├── conftest.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx                         # Root React orchestrator & state
│   │   ├── App.css                         # Nebula Aurora glassmorphic theme
│   │   ├── index.css                       # Global resets & design tokens
│   │   ├── components/                     # 29 modular UI components (TeamModal deck)
│   │   ├── hooks/                          # sessionStorage BYOK security hook
│   │   └── services/                       # API client & backend cold-start warmup
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── vercel.json
├── docs/
│   ├── API_REFERENCE.md                    # Endpoint specs & JSON payloads
│   ├── ARCHITECTURE.md                     # System architecture & component design
│   ├── CAPSTONE_PROJECT_DOSSIER.md         # Final academic project dossier (BBDU)
│   ├── RESEARCH_LLM_BENCHMARKS.md          # LLM benchmarking study (Gemini/GPT/Claude)
│   ├── ETHICAL_AI_AND_BIAS_AUDIT.md        # EEOC non-bias compliance framework
│   ├── ATS_PARSER_HEURISTICS_SPEC.md       # Multi-column parsing & font specs
│   ├── SECURITY_AUDIT_REPORT.md            # OWASP API Top 10 security audit
│   ├── RESEARCH.md                         # Algorithmic research notes
│   └── GUIDELINES.md                       # Engineering guidelines
├── testing/
│   ├── run_tests.py                        # QA test runner with audit logs
│   ├── benchmark_runner.py                 # Concurrency & latency benchmark harness
│   ├── e2e_integration_test.py             # Automated end-to-end integration test
│   ├── fixtures/
│   │   └── synthetic_eval_dataset.json     # Multi-domain synthetic test resumes
│   └── reports/                            # Timestamped QA audit reports
├── assets/                                 # Visual diagrams, screenshots & banners
├── DEPLOYMENT.md                           # Cloud deployment guide (Render + Vercel)
└── README.md
```

---

## ⚡ Quick Start Guide (Run Locally)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Shivansh-mishraji/AI-Powered-Resume-Analyzer.git
cd "AI-Powered-Resume-Analyzer"
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
  <sub>👑 Project Conceived, Architected & Directed by <b><a href="https://github.com/Shivansh-mishraji">Shivansh Mishra</a></b> (Team Leader & Principal Architect)</sub><br/>
  <sub>Built with ❤️ by Shivansh, Harshvardhan, Vishal & Sujeet • BBD University Academic Capstone 2026</sub>
</div>
