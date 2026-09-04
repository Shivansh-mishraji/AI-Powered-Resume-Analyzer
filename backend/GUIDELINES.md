# Engineering Guidelines — Backend & AI Lead
# Member: Shivansh Mishra
# GitHub Username: Shivansh-mishraji
# Git Author Name: Shivansh Mishra
# Git Email: tgsmishra@gmail.com
# Role: Backend Engineer + AI Engineer + Scrum Master
# Project: AI-Powered Resume & Job Description Analyzer

---

## Core Engineering Principles
- **Clean Architecture & Separation of Concerns:** FastAPI endpoints in `app/main.py` handle only HTTP concerns (validation, header extraction, routing). All business logic lives in `app/services/`.
- **In-Memory Operations Only:** Never write uploaded resume files to disk; parse directly from memory buffers for security and speed.
- **Ephemeral Key Handling:** The user's Gemini API key is accepted via the `X-Gemini-API-Key` header. It must never be logged, persisted to disk, stored in a database, or returned in error payloads.
- **Unified Schema Parity:** Both `ai_service.py` and `rule_based_service.py` must return the identical `AnalysisResult` Pydantic model.
- **Graceful Degradation:** All AI API calls must be wrapped in error handlers with a single retry on transient failures, followed by transparent fallback to `rule_based_service.py` with an honest note in the `warnings` list.
- **Hermetic Automated Testing:** Never make real network calls to Google Gemini during automated `pytest` test runs. Always use `unittest.mock` for AI service unit tests.

---

## Backend Directory Responsibilities

| File Path | Purpose |
|---|---|
| `app/config.py` | Central constants: `MAX_FILE_SIZE_BYTES`, `MAX_RESUME_CHARS`, `MAX_JD_CHARS`, `ALLOWED_CORS_ORIGINS`. |
| `app/schemas/analysis_schema.py` | Unified Pydantic data contracts for both AI and Fallback engines. |
| `app/services/resume_parser.py` | In-memory text extraction using PyMuPDF (`sort=True`) and python-docx. Scanned PDF detection. |
| `app/services/text_cleaner.py` | Regex text normalization (lowercasing, whitespace collapse, symbol preservation). |
| `app/services/skill_extractor.py` | 50+ tech skill keyword matcher with word boundaries. |
| `app/services/score_calculator.py` | Mathematical set-intersection scoring calculator. |
| `app/services/rule_based_service.py` | Wraps deterministic logic into the unified `AnalysisResult` schema (`is_ai_powered: false`). |
| `app/services/ai_service.py` | Google Gemini AI integration with rubric-grounded prompt and structured JSON validation. |
| `app/services/analysis_service.py` | Router that coordinates primary AI analysis with deterministic fallback. |
| `app/main.py` | FastAPI application, CORS configuration, and HTTP routing. |

---

## Development & Git Workflow

1. Always run baseline tests (`python testing/run_tests.py`) before and after making code changes.
2. Commit on the feature branch (`feature/gemini-ai-upgrade`) with descriptive commit messages and proper team author tags.
3. Coordinate with Vishal Patel to update automated test cases whenever service logic changes.
