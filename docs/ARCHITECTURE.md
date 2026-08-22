# System Architecture — AI-Powered Resume Analyzer

> Documented by: Sujeet (Research & Documentation)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                        USER                             │
│            (Browser at localhost:5173)                  │
└─────────────────────────┬───────────────────────────────┘
                          │  HTTP POST /analyze
                          │  (multipart/form-data)
                          ▼
┌─────────────────────────────────────────────────────────┐
│              FRONTEND  (React + Vite)                   │
│                                                         │
│   App.jsx                                               │
│   ├── File Upload Input (PDF / DOCX)                    │
│   ├── Job Description Textarea                          │
│   ├── fetch() → POST http://127.0.0.1:8000/analyze      │
│   └── Results Display (Score, Matched, Missing Skills)  │
└─────────────────────────┬───────────────────────────────┘
                          │  HTTP Request (CORS enabled)
                          ▼
┌─────────────────────────────────────────────────────────┐
│              BACKEND  (FastAPI + Uvicorn)               │
│                                                         │
│   main.py                                               │
│   ├── GET  /health        → Health check                │
│   ├── POST /resume/upload → Raw text extraction only    │
│   └── POST /analyze       → Full analysis pipeline      │
│                                                         │
│   Services Layer                                        │
│   ├── resume_parser.py    → PyMuPDF (PDF) / python-docx │
│   ├── text_cleaner.py     → Regex normalization         │
│   ├── skill_extractor.py  → 50+ skill keyword matching  │
│   └── score_calculator.py → Set intersection scoring   │
└─────────────────────────────────────────────────────────┘
```

---

## Data Flow — `/analyze` Endpoint

```
User uploads PDF + pastes Job Description
           │
           ▼
   Validate file type (PDF/DOCX only)
           │
           ▼
   Read file bytes into memory (no disk write)
           │
           ▼
   resume_parser.py → extract raw text
           │
           ▼
   text_cleaner.py  → normalize text (lowercase, remove symbols)
           │
           ├─────────────────────────────────────┐
           ▼                                     ▼
   Extract resume skills              Extract JD skills
   (skill_extractor.py)              (skill_extractor.py)
           │                                     │
           └──────────────┬──────────────────────┘
                          ▼
               score_calculator.py
               ├── matched = resume ∩ jd
               ├── missing = jd - resume
               └── score  = matched/total × 100
                          │
                          ▼
               JSON Response → Frontend
```

---

## Technology Decisions

| Layer | Technology | Reason |
|---|---|---|
| Backend Framework | FastAPI | Async, auto-docs (Swagger), fast, type-safe |
| ASGI Server | Uvicorn | High-performance async server for FastAPI |
| PDF Parsing | PyMuPDF (`fitz`) | In-memory binary stream processing, no temp files |
| DOCX Parsing | python-docx | Standard library for `.docx` format |
| Frontend | React + Vite | Fast dev server, component-based UI |
| Testing | pytest + TestClient | Zero-dependency, runs without live server |

---

## Project Folder Structure

```
Resume Analyzer/
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI app + endpoints
│   │   └── services/
│   │       ├── resume_parser.py     # PDF & DOCX text extraction
│   │       ├── text_cleaner.py      # Text normalization
│   │       ├── skill_extractor.py   # Keyword skill matching
│   │       └── score_calculator.py  # Match scoring logic
│   ├── tests/
│   │   ├── test_main.py             # Tests for /health and /resume/upload
│   │   ├── test_analyze.py          # Tests for /analyze endpoint
│   │   ├── test_text_cleaner.py     # Unit tests for text cleaner
│   │   ├── test_skill_extractor.py  # Unit tests for skill extractor
│   │   └── test_score_calculator.py # Unit tests for score calculator
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── App.jsx                  # Main React component
│       └── App.css                  # Styles
└── docs/
    ├── API_REFERENCE.md             # Full API documentation
    ├── ARCHITECTURE.md              # This file
    └── RESEARCH.md                  # Technology research notes
```
