# System Architecture — AI-Powered Resume Analyzer

## Overview

The AI-Powered Resume Analyzer is a full-stack web application built with a clean separation of concerns. The backend is a stateless Python FastAPI service, the frontend is a React 19 SPA, and Google Gemini 2.5 Flash provides the AI intelligence layer.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                   USER BROWSER                       │
│              http://localhost:5173                   │
│                                                      │
│  ┌──────────┐  ┌─────────┐  ┌───────────────────┐  │
│  │ TopNavBar│  │ Sidebar │  │      Hero Panel    │  │
│  │ (fixed)  │  │ (260px) │  │  Upload + JD Input │  │
│  └──────────┘  └─────────┘  └───────────────────┘  │
│                              ┌───────────────────┐  │
│                              │ Results Dashboard  │  │
│                              │ Gauge | KPI | Grid │  │
│                              └───────────────────┘  │
└────────────────────┬────────────────────────────────┘
                     │  HTTP POST /analyze
                     │  Header: X-Gemini-API-Key
                     ▼
┌─────────────────────────────────────────────────────┐
│               FASTAPI BACKEND                        │
│              http://127.0.0.1:8000                   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │               Request Pipeline               │   │
│  │  1. Validate file type (PDF/DOCX only)       │   │
│  │  2. Check file size (≤ 5MB)                  │   │
│  │  3. Extract API key from header              │   │
│  └──────────────────┬───────────────────────────┘   │
│                     │                               │
│  ┌──────────────────▼───────────────────────────┐   │
│  │           In-Memory Parser Service           │   │
│  │  PDF  → PyMuPDF (fitz.open stream)           │   │
│  │  DOCX → python-docx (io.BytesIO stream)      │   │
│  │  ⚠️  Files never written to disk              │   │
│  └──────────────────┬───────────────────────────┘   │
│                     │                               │
│  ┌──────────────────▼───────────────────────────┐   │
│  │         Text Cleaning & Skill Extraction     │   │
│  │  - Regex noise removal                        │   │
│  │  - 50+ keyword dictionary                     │   │
│  │  - C++/C#/.NET symbol preservation            │   │
│  │  - Synonym normalization (ML = Machine       │   │
│  │    Learning, JS = JavaScript)                 │   │
│  └──────────────────┬───────────────────────────┘   │
│                     │                               │
│         ┌───────────▼──────────┐                   │
│         │   API Key present?   │                   │
│         └──────┬───────┬───────┘                   │
│                │ YES   │ NO                         │
│                ▼       ▼                           │
│  ┌──────────────┐ ┌──────────────┐                 │
│  │  Gemini AI   │ │ Rule-Based   │                 │
│  │  Service     │ │ Matcher      │                 │
│  │  7-rubric    │ │  keyword /   │                 │
│  │  scoring     │ │  total × 100 │                 │
│  └──────┬───────┘ └──────┬───────┘                 │
│         └───────┬─────────┘                        │
│                 ▼                                  │
│  ┌──────────────────────────────────────────────┐   │
│  │         Unified Pydantic Response            │   │
│  │  { score, matched_skills, missing_skills,    │   │
│  │    insights, mode, rubric_scores }           │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

---

## Data Flow — Step by Step

| Step | Component | Action |
|------|-----------|--------|
| 1 | Browser | User drops resume file + pastes JD + optionally enters API key |
| 2 | React Frontend | Sends `multipart/form-data` POST to `/analyze` with `X-Gemini-API-Key` header |
| 3 | FastAPI Router | Validates file type, size, extracts text content |
| 4 | Parser Service | Opens file as byte stream in RAM (never touches disk) |
| 5 | Cleaner | Strips noise, normalizes text, extracts skills |
| 6 | Router Logic | If API key present → Gemini AI. Else → Rule-based |
| 7 | AI/Matcher | Scores resume against JD on 7 rubrics (AI) or keyword ratio (rule) |
| 8 | Response | Returns unified JSON with score, skills, insights |
| 9 | Dashboard | Animates score gauge, renders skill matrix, displays insights |

---

## Privacy & Security Model

| Concern | Implementation |
|---------|---------------|
| **File Storage** | Zero — files read via `fitz.open(stream=bytes)` directly into RAM |
| **API Key** | Never stored — passed as `X-Gemini-API-Key` header, used in-request only |
| **User Data** | No database — fully stateless, data lost after response |
| **CORS** | Configured to only accept `localhost:5173` in dev |
| **Input Validation** | Pydantic v2 strict models reject malformed requests with `422` |
| **Text Truncation** | 15,000 char limit prevents LLM token overflow attacks |

---

## Dual-Engine Design

The key architectural decision is the **dual-engine fallback system**:

```
User provides API Key?
    ├── YES → Gemini AI Mode
    │          7-rubric semantic scoring
    │          Qualitative insights (strengths, gaps, recommendations)
    │          Natural language improvement suggestions
    │
    └── NO  → Rule-Based Mode (Deterministic)
               Score = (matched_keywords / total_jd_keywords) × 100
               Keyword-level skill matching
               Basic matched/missing skill lists
               Always works — no external dependency
```

This ensures **100% uptime** — the app never fails even when the Gemini API is unavailable, over quota, or the user has no key.

---

## Responsiveness Architecture (Frontend)

```
Viewport Width
│
├── < 768px   → Mobile
│               Sidebar hidden
│               TopNavBar shows ☰ hamburger
│               Click ☰ → slide-out drawer with navigation
│               Results in single-column stacked layout
│
├── 768–1024px → Tablet
│               Compact sidebar
│               2-column results grid
│
└── > 1024px   → Desktop
                Fixed 260px sidebar always visible
                3-column Bento Grid results layout
```

---

## Technology Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Backend Framework | FastAPI | Async-native, auto OpenAPI docs, fastest Python framework |
| PDF Parser | PyMuPDF | 50× faster than pdfplumber, correct reading-order sorting |
| AI Model | Gemini 2.5 Flash | Free tier, fast inference, structured JSON output support |
| Frontend | React 19 + Vite | Latest stable, fastest HMR dev experience |
| No Database | sessionStorage (planned) | Keeps system stateless, privacy-first, no GDPR concerns |
| BYOK | Per-request header | Zero server-side credential risk |
