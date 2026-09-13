<div align="center">

# 🚀 AI-Powered Resume Analyzer
### *Hybrid Multi-Model Career Intelligence Platform & ATS Semantic Analyzer*

[![Live Website](https://img.shields.io/badge/🌐_Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-powered-resume-analyzer-pi.vercel.app)
[![Backend API](https://img.shields.io/badge/⚡_Backend_API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://resume-analyzer-api.onrender.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Python 3.13](https://img.shields.io/badge/Python_3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Multi-Provider AI](https://img.shields.io/badge/AI_BYOK-Gemini_·_OpenAI_·_Claude-orange?style=for-the-badge)](https://aistudio.google.com/)
[![Tests](https://img.shields.io/badge/Pytest-90_Tests_Passed-success?style=for-the-badge&logo=pytest&logoColor=white)](https://docs.pytest.org/)

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

## 🎯 Core Features — At a Glance

| # | Feature | Description |
|---|---------|-------------|
| 1 | 🤖 **Multi-Provider AI (BYOK)** | Gemini, OpenAI GPT-4o, Claude — auto-detected from key prefix. No key? Deterministic fallback (<5ms). |
| 2 | 🎯 **Deep Semantic Matching** | Understands context: *AWS ECS + Terraform = Container Orchestration & IaC* — not just keyword counting. |
| 3 | 🧬 **Skills Taxonomy Graph** | 440+ canonical technologies across 12 engineering domains with alias resolution (`k8s` → `Kubernetes`). |
| 4 | 🔍 **Deep ATS Heuristic Audit** | 4 composite scores, 7 section detectors, 150+ action verbs, quantified bullet analysis. |
| 5 | 📄 **Professional PDF Export** | Real multi-page backend PDF — cover, skills matrix, ATS audit, insights, interview kit, SHA-256 seal. |
| 6 | 🎤 **Targeted Interview Kit** | Auto-generates technical questions & behavioral prompts from your specific skill gaps. |
| 7 | 🔒 **Zero-Storage Privacy** | In-memory only processing — no disk writes, no DB, keys live in `sessionStorage` only. |
| 8 | 🎨 **Nebula Aurora UI** | React 19 glassmorphism, 60/120 FPS GPU animations, fully responsive bento grid. |

> 📖 Detailed explanations → [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)

---

## 🏗️ System Architecture

```
                         👤 USER
                          │
                          ▼
           🎨 REACT 19 + VITE FRONTEND (Vercel)
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
     📄 Resume       📋 Job JD       🔑 AI Key (BYOK)
     (PDF/DOCX)                   (Gemini AQ./AIza, OpenAI, Claude)
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
          └── SHA-256 Executive PDF Exporter
                         │
                         ▼
                 📊 REACT DASHBOARD
```

---

## 🖥️ Dashboard Showcase

<p align="center">
  <img src="./assets/dashboard.jpg" alt="Interactive Desktop Results Dashboard" width="67%" style="border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); vertical-align: middle; margin-right: 1.5%;" />
  <img src="./assets/mobile.jpg" alt="Responsive Mobile Experience" width="30%" style="border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); vertical-align: middle;" />
</p>

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 6, Tailwind CSS, Material Symbols |
| **Backend** | FastAPI, Python 3.13, Uvicorn |
| **AI Engines** | Google Gemini 2.5, OpenAI GPT-4o, Anthropic Claude |
| **Parsing** | PyMuPDF (in-memory, sort=True), python-docx |
| **PDF Export** | PyMuPDF multi-page generation with SHA-256 seals |
| **Deployment** | Vercel (frontend) + Render (backend) |
| **Testing** | Pytest — 90/90 tests passing in 2.4s |

---

## 🔑 Multi-Provider BYOK — Bring Your Own Key

- 🤖 **Google Gemini**: `AIza...` / `AQ...` → `gemini-2.5-flash` with auto-fallback chain. [Get key](https://aistudio.google.com/app/apikey)
- ⚡ **OpenAI**: `sk-...` → `gpt-4o` / `gpt-4o-mini`. [Get key](https://platform.openai.com/api-keys)
- 🧠 **Anthropic Claude**: `sk-ant-...` → `claude-opus-4` / `claude-3-5-sonnet`. [Get key](https://console.anthropic.com/keys)
- **Zero Server Persistence** — keys never stored on disk or any DB.
- **Client Session Isolation** — `sessionStorage` only, auto-cleared on tab close.

---

## 🧪 Test Suite — 90/90 Passing

```bash
cd backend && pytest
```

| Module | Tests | Scope |
|--------|:-----:|-------|
| `test_ai_service.py` | 7 | Gemini/GPT/Claude fallback & rate-limit handling |
| `test_analysis_service.py` | 4 | Analysis router, deterministic fallback |
| `test_ats_audit.py` | 9 | 7 section headers, 150+ action verbs, quantification |
| `test_interview_generator.py` | 8 | Skill gap probing, system design questions |
| `test_new_endpoints.py` | 9 | /taxonomy, /audit/ats, /export/* (PDF/MD/JSON/HTML) |
| `test_report_exporter.py` | 8 | SHA-256 determinism, PyMuPDF PDF, HTML CSS |
| `test_security_sanitization.py` | 7 | XSS, SQLi, prompt injection defense |
| `test_taxonomy.py` | 9 | 440+ skills, 12 domains, 79 synonym aliases |
| + 5 more modules | 29 | Score calc, skill extraction, text cleaning, etc. |

---

## 📁 Project Structure

```
AI-Powered-Resume-Analyzer/
├── backend/
│   ├── app/
│   │   ├── main.py                     # FastAPI gateway & enterprise endpoints
│   │   ├── config.py                   # Central limits, origins & constants
│   │   ├── schemas/analysis_schema.py  # Unified Pydantic response schemas
│   │   └── services/
│   │       ├── ai_service.py           # Multi-provider AI semantic engine
│   │       ├── analysis_service.py     # Analysis router & enrichment orchestrator
│   │       ├── taxonomy_service.py     # 440+ canonical skills & synonym engine
│   │       ├── ats_audit_service.py    # Deep ATS heuristic & quantification engine
│   │       ├── report_exporter.py      # Multi-page PDF/MD/JSON/HTML + SHA-256
│   │       └── interview_generator.py  # Technical interview question generator
│   └── tests/                          # 90/90 passing pytest suite (13 modules)
├── frontend/
│   └── src/
│       ├── components/                 # Modular UI components (bento grid, team modal)
│       ├── hooks/                      # sessionStorage BYOK security hook
│       └── services/api.js             # API client & backend warmup
├── docs/                               # 9 detailed documentation files
├── testing/                            # E2E, benchmark & QA test harness
├── assets/                             # Banners, diagrams, team photos
└── DEPLOYMENT.md
```

---

## 🚀 Quick Start

```bash
# 1. Clone
git clone https://github.com/Shivansh-mishraji/AI-Powered-Resume-Analyzer.git

# 2. Backend
cd backend && pip install -r requirements.txt
python -m uvicorn app.main:app --reload
# → http://127.0.0.1:8000/docs

# 3. Frontend (new terminal)
cd frontend && npm install && npm run dev
# → http://localhost:5173

# 4. Tests
cd backend && python testing/run_tests.py
```

> 📖 Full setup, env vars & deployment → [`docs/GUIDELINES.md`](./docs/GUIDELINES.md) | [`DEPLOYMENT.md`](./DEPLOYMENT.md)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [`ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | System design, data flow, module breakdown |
| [`API_REFERENCE.md`](./docs/API_REFERENCE.md) | All REST endpoints with request/response schemas |
| [`SKILLS.md`](./docs/SKILLS.md) | 440+ skills taxonomy across 12 domains |
| [`ATS_PARSER_HEURISTICS_SPEC.md`](./docs/ATS_PARSER_HEURISTICS_SPEC.md) | ATS scoring algorithm details |
| [`SECURITY_AUDIT_REPORT.md`](./docs/SECURITY_AUDIT_REPORT.md) | OWASP API Top 10 security audit |
| [`ETHICAL_AI_AND_BIAS_AUDIT.md`](./docs/ETHICAL_AI_AND_BIAS_AUDIT.md) | Bias mitigation & fairness framework |
| [`RESEARCH_LLM_BENCHMARKS.md`](./docs/RESEARCH_LLM_BENCHMARKS.md) | LLM benchmarking study (Gemini/GPT/Claude) |
| [`RESEARCH.md`](./docs/RESEARCH.md) | Algorithmic research notes |
| [`GUIDELINES.md`](./docs/GUIDELINES.md) | Dev setup, contribution, deployment |
| [`CAPSTONE_PROJECT_DOSSIER.md`](./docs/CAPSTONE_PROJECT_DOSSIER.md) | Academic capstone dossier (BBDU) |

---

## 👥 Engineering Team

BBD University • Academic Capstone 2026

<table>
  <tr align="center">
    <th width="25%">👑 Team Leader</th>
    <th width="25%">Frontend Architect</th>
    <th width="25%">QA & Security Lead</th>
    <th width="25%">Research & Docs Lead</th>
  </tr>
  <tr align="center" valign="top">
    <td>
      <a href="https://github.com/Shivansh-mishraji">
        <img src="./assets/team/shivansh_circle.png" width="85" height="85" alt="Shivansh Mishra" /><br/>
        <b>Shivansh Mishra</b>
      </a><br/>
      <small><b>Team Leader & Principal Architect</b></small><br/><br/>
      <small>FastAPI Gateway, 5 Backend Systems, Skills Taxonomy, ATS Engine, PDF Exporter, Cloud Deployment</small><br/><br/>
      <a href="https://github.com/Shivansh-mishraji"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github" /></a>
      <a href="mailto:tgsmishra@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=flat-square&logo=gmail" /></a>
    </td>
    <td>
      <a href="https://github.com/harsh123-code">
        <img src="./assets/team/harshvardhan_circle.png" width="85" height="85" alt="Harshvardhan Sisodiya" /><br/>
        <b>Harshvardhan Sisodiya</b>
      </a><br/>
      <small>Frontend Architect & UI/UX Lead</small><br/><br/>
      <small>React 19 SPA, Nebula Aurora Glassmorphism, 60fps rAF Animation Physics, BYOK Hub, Team Deck</small><br/><br/>
      <a href="https://github.com/harsh123-code"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github" /></a>
      <a href="mailto:hsisodiya205@bbdu.ac.in"><img src="https://img.shields.io/badge/Email-D14836?style=flat-square&logo=gmail" /></a>
    </td>
    <td>
      <a href="https://github.com/patelvishal-ji">
        <img src="./assets/team/vishal_circle.png" width="85" height="85" alt="Vishal Patel" /><br/>
        <b>Vishal Patel</b>
      </a><br/>
      <small>QA Lead & Security Specialist</small><br/><br/>
      <small>Pytest 90/90 Test Suite, XSS/SQLi Security Harness, E2E Integration Tests, Concurrency Benchmarks</small><br/><br/>
      <a href="https://github.com/patelvishal-ji"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github" /></a>
      <a href="mailto:patelvishal7800023@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=flat-square&logo=gmail" /></a>
    </td>
    <td>
      <a href="https://github.com/sujeet-official">
        <img src="./assets/team/sujeet_circle.png" width="85" height="85" alt="Sujeet Kannaujiya" /><br/>
        <b>Sujeet Kannaujiya</b>
      </a><br/>
      <small>Research & Technical Docs Lead</small><br/><br/>
      <small>Capstone Dossier, LLM Benchmark Study, Ethical AI Framework, ATS Specifications</small><br/><br/>
      <a href="https://github.com/sujeet-official"><img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github" /></a>
      <a href="mailto:sujeetkannaujiya2004@bbdu.ac.in"><img src="https://img.shields.io/badge/Email-D14836?style=flat-square&logo=gmail" /></a>
    </td>
  </tr>
</table>

---

<div align="center">
  <sub>👑 Project Conceived, Architected & Directed by <b><a href="https://github.com/Shivansh-mishraji">Shivansh Mishra</a></b> (Team Leader & Principal Architect)</sub><br/>
  <sub>Built with ❤️ by Shivansh, Harshvardhan, Vishal & Sujeet • BBD University Academic Capstone 2026</sub>

[![Try It Now](https://img.shields.io/badge/Try_It_Now-Live_Demo-6366F1?style=for-the-badge)](https://ai-powered-resume-analyzer-pi.vercel.app)
</div>
