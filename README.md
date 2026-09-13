<div align="center">

# 🚀 AI-Powered Resume Analyzer

### *Hybrid Multi-Model Career Intelligence Platform & ATS Semantic Analyzer*

[![Live Website](https://img.shields.io/badge/🌐_Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-powered-resume-analyzer-pi.vercel.app)
[![Backend API](https://img.shields.io/badge/⚡_API-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black)](https://resume-analyzer-api.onrender.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Python 3.13](https://img.shields.io/badge/Python_3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Tests](https://img.shields.io/badge/Tests-90%2F90_Passing-brightgreen?style=for-the-badge&logo=pytest)](https://docs.pytest.org/)

<br/>

<img src="./assets/banner.jpg" alt="AI Resume Analyzer" width="100%" style="border-radius:12px;" />

<br/><br/>

> **Upload Resume (PDF/DOCX) + Job Description + Optional AI Key → Instant deep semantic match, ATS audit, skill gaps, interview kit & professional PDF report.**

</div>

---

## ⚡ What It Does

| Step | Action |
|------|--------|
| 📤 **Upload** | Drop your resume (PDF/DOCX ≤ 5MB) + paste a job description |
| 🔑 **BYOK** | Optionally add a Gemini / OpenAI / Claude key for AI-powered analysis |
| 🤖 **Analyze** | Hybrid engine scores your resume 0–100% against the JD |
| 📊 **Dashboard** | Interactive bento-grid results with 8 analysis modules |
| 📄 **Export** | Download a multi-page professional PDF audit report |

---

## 🧠 Core Features

### 1 · 🤖 Multi-Provider AI Engine (BYOK)
Auto-detects your API key provider and routes to the best model — no config needed.
- **Gemini** (`AQ...` / `AIza...`) → `gemini-2.5-flash` with auto-fallback chain
- **OpenAI** (`sk-...`) → `gpt-4o` / `gpt-4o-mini`
- **Claude** (`sk-ant-...`) → `claude-opus-4` / `claude-3-5-sonnet`
- No key? **Deterministic rule-based fallback** kicks in instantly (<5ms).

> 📖 See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for full engine design.

---

### 2 · 🎯 Deep Semantic Match Scoring
Contextual skill matching — understands that *AWS ECS + Terraform = Container Orchestration & IaC*. Not keyword counting.

### 3 · 🧬 Skills Taxonomy Graph (12 Domains)
440+ canonical technologies across 12 engineering domains with alias resolution (`k8s` → `Kubernetes`, `mongo` → `MongoDB`).

> 📖 See [`docs/SKILLS.md`](./docs/SKILLS.md) for the full taxonomy.

### 4 · 🔍 Deep ATS Heuristic Audit
- **4 composite scores:** ATS Parseability, Section Health, Verb Density, Quantification Impact
- **7 section detectors:** Experience, Skills, Education, Projects, Certifications, Summary, Achievements
- **150+ action verb** recognition with diversity scoring
- Quantified bullet detection (`%`, `$`, throughput, latency)

> 📖 See [`docs/ATS_PARSER_HEURISTICS_SPEC.md`](./docs/ATS_PARSER_HEURISTICS_SPEC.md)

### 5 · 📄 Professional Multi-Page PDF Export
Real backend-generated PDF (not a browser print dialog):
- **Page 1** — Cover + KPI Dashboard (score tile, tier badge)
- **Page 2** — Skills Matrix (matched chips, gap chips, domain taxonomy)
- **Page 3** — ATS Audit (score bars, section health, action verbs)
- **Page 4** — Strategic Insights (strengths, weaknesses, recommendations)
- **Page 5** — Interview Question Kit
- **Final** — SHA-256 Cryptographic Provenance seal

### 6 · 🎤 Targeted Interview Kit
Auto-generates technical questions, system design scenarios, and behavioral prompts based on your specific skill gaps and experience.

### 7 · 🔒 Zero-Storage Privacy Architecture
- Resume text is processed **in-memory only** — never written to disk or database
- API keys stored in `sessionStorage` only (auto-cleared on tab close)
- PyMuPDF streams bytes directly — no temp files

> 📖 See [`docs/SECURITY_AUDIT_REPORT.md`](./docs/SECURITY_AUDIT_REPORT.md)

### 8 · 🎨 Nebula Aurora UI
- React 19 + Vite + Tailwind glassmorphism design system
- 60/120 FPS hardware-synchronized GPU animations
- Fully responsive, mobile-first bento grid layout
- Team modal with instant photo preloading

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
     (PDF/DOCX)                   (Gemini / OpenAI / Claude)
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

> 📖 Full system design → [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 6, Tailwind CSS, Material Symbols |
| **Backend** | FastAPI, Python 3.13, Uvicorn |
| **AI** | Google Gemini, OpenAI GPT-4o, Anthropic Claude |
| **Parsing** | PyMuPDF (in-memory), python-docx |
| **PDF Export** | PyMuPDF (multi-page generation) |
| **Deployment** | Vercel (frontend) + Render (backend) |
| **Testing** | Pytest — 90/90 tests passing |

---

## 🚀 Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

> 📖 Full setup, env vars, and deployment guide → [`docs/GUIDELINES.md`](./docs/GUIDELINES.md)

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [`ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | System design, data flow, module breakdown |
| [`API_REFERENCE.md`](./docs/API_REFERENCE.md) | All REST endpoints with request/response schemas |
| [`SKILLS.md`](./docs/SKILLS.md) | 440+ skills taxonomy across 12 domains |
| [`ATS_PARSER_HEURISTICS_SPEC.md`](./docs/ATS_PARSER_HEURISTICS_SPEC.md) | ATS scoring algorithm details |
| [`SECURITY_AUDIT_REPORT.md`](./docs/SECURITY_AUDIT_REPORT.md) | Privacy-first security model |
| [`ETHICAL_AI_AND_BIAS_AUDIT.md`](./docs/ETHICAL_AI_AND_BIAS_AUDIT.md) | Bias mitigation & fairness audit |
| [`RESEARCH.md`](./docs/RESEARCH.md) | LLM benchmark research & prompt engineering |
| [`GUIDELINES.md`](./docs/GUIDELINES.md) | Dev setup, contribution, deployment |
| [`CAPSTONE_PROJECT_DOSSIER.md`](./docs/CAPSTONE_PROJECT_DOSSIER.md) | Academic capstone context |

---

## 👥 Engineering Team

| Name | Role |
|------|------|
| **Shivansh Mishra** | Project Lead & Principal Architect |
| **Aarav Mehra** | ML Engineering & Prompt Architecture |
| **Priya Sharma** | Frontend Engineering & UI/UX |
| **Rohan Verma** | Backend API & Infrastructure |

---

<div align="center">

**Built with ❤️ for the Capstone Project**

[![Try It Now](https://img.shields.io/badge/Try_It_Now-Live_Demo-6366F1?style=for-the-badge)](https://ai-powered-resume-analyzer-pi.vercel.app)

</div>
