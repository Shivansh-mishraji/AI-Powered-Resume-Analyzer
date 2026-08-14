# SKILLS.md — Backend & AI Engineer
# Member: Shivansh Mishra
# Role: Backend Engineer + AI Engineer + Scrum Master
# Project: AI-Powered Resume & Job Description Analyzer

---

## Philosophy

> Learn it → Build it → Run it → Test it → Commit it.
>
> Never commit code you cannot explain.
>
> AI is a senior developer that explains and reviews — not one that secretly builds the project for you.

---

## Your Learning Path (in order)

```
FastAPI Basics
     ↓
File Uploads
     ↓
PDF/DOCX Parsing
     ↓
Python Text Processing
     ↓
Basic Skill Matching
     ↓
APIs + JSON Design
     ↓
LLM API Integration
     ↓
Prompt Engineering
     ↓
Secrets Management
     ↓
CORS + Testing
     ↓
Deployment
```

Learn exactly when needed — not all at once before Day 1.

---

## WEEK 1 Skills — FastAPI + Resume Upload

### Skill 1.1 — What is an API?

**Learn:**
- HTTP request/response cycle
- GET vs POST — difference and when to use each
- Status codes: `200 OK`, `400 Bad Request`, `422 Unprocessable`, `500 Server Error`
- What JSON is and why APIs return it

**Questions you must be able to answer by end of Week 1:**
> "What is the difference between GET and POST?"
> "Why does an API return JSON and not HTML?"
> "What does status code 422 mean?"

---

### Skill 1.2 — FastAPI Fundamentals

**Learn:**
- Install FastAPI + Uvicorn: `pip install fastapi uvicorn`
- Create a basic app: `app = FastAPI()`
- Define a route: `@app.get("/health")`
- Run: `uvicorn app.main:app --reload`
- Access Swagger UI at `/docs`
- Pydantic models for response validation

**What to read:** FastAPI official docs — "First Steps" section only. Don't read everything.

**Build:** `GET /health` → returns `{"status": "ok"}`

**Questions you must answer:**
> "What does Pydantic do in FastAPI?"
> "What is Swagger UI used for?"
> "What does `--reload` do when running uvicorn?"

---

### Skill 1.3 — File Upload with FastAPI

**Learn:**
- `UploadFile` and `File` imports from FastAPI
- `multipart/form-data` — why file uploads use it instead of JSON
- Reading file bytes: `await file.read()`
- Checking file type: `file.content_type` and `file.filename`
- Rejecting bad files with `HTTPException`

**Build:** `POST /resume/upload` — accepts PDF/DOCX, rejects everything else

**Example rejection:**
```python
if file.content_type not in ["application/pdf", "application/vnd.openxmlformats..."]:
    raise HTTPException(status_code=400, detail="Invalid file type")
```

**Questions you must answer:**
> "Why do we use multipart/form-data for file uploads?"
> "How does FastAPI know what type of file was uploaded?"
> "What is HTTPException used for?"

---

### Skill 1.4 — PDF Text Extraction (PyMuPDF)

**Learn:**
- Install: `pip install pymupdf`
- Open PDF: `fitz.open(stream=bytes, filetype="pdf")`
- Iterate pages: `for page in doc:`
- Extract text: `page.get_text()`
- Handle empty PDFs gracefully

**Build:** `extract_text_from_pdf(file_bytes: bytes) -> str` in `services/resume_parser.py`

**Test with:**
- Normal multi-page PDF resume
- Single page resume
- Empty/blank PDF

**Questions you must answer:**
> "What library extracts PDF text, and what function does it use?"
> "What happens if the PDF has no selectable text (scanned image PDF)?"
> "How do you handle a PDF with multiple pages?"

---

### Skill 1.5 — DOCX Text Extraction (python-docx)

**Learn:**
- Install: `pip install python-docx`
- Open document: `Document(BytesIO(file_bytes))`
- Iterate paragraphs: `for para in doc.paragraphs:`
- Extract text: `para.text`
- Note: tables need separate handling

**Build:** `extract_text_from_docx(file_bytes: bytes) -> str` in `services/resume_parser.py`

**Test with:**
- Normal DOCX resume
- DOCX with tables (does table text get extracted?)
- Empty DOCX

**Questions you must answer:**
> "Does python-docx automatically extract text from tables?"
> "Why do we handle PDF and DOCX extraction differently?"

---

### Skill 1.6 — Git Workflow + Conventional Commits

**Learn:**
- `git init`, `git add .`, `git commit -m "..."`, `git push`
- Commit message format (conventional commits):
  - `feat:` — new feature
  - `fix:` — bug fix
  - `chore:` — setup/config
  - `docs:` — documentation
  - `test:` — test cases
- `.gitignore` — always exclude: `.env`, `__pycache__/`, `venv/`, `*.pyc`
- One commit = one logical unit of work

**Week 1 commit sequence:**
```
chore: initialize project structure
chore: initialize FastAPI backend
feat: add health check endpoint
feat: add resume upload endpoint
feat: add pdf text extraction
feat: add docx text extraction
test: add resume parser tests
```

**Questions you must answer:**
> "What goes into .gitignore and why?"
> "Why do we write 'feat: add ...' instead of 'updated stuff'?"

---

## WEEK 2 Skills — JD Processing + Skill Extraction

### Skill 2.1 — Text Cleaning

**Learn:**
- Python string methods: `strip()`, `replace()`, `split()`, `join()`
- `re` module basics: `re.sub()` to remove extra whitespace and special characters
- Why raw extracted text is noisy (extra newlines, headers, bullets)

**Build:** `clean_text(raw: str) -> str` in `services/text_cleaner.py`

**Questions you must answer:**
> "Why do we clean text before analysis?"
> "What kind of noise does PDF extraction introduce?"

---

### Skill 2.2 — Receiving File + Text in Same Request

**Learn:**
- `Form(...)` from FastAPI for text fields alongside `UploadFile`
- You cannot use a Pydantic model for body when also receiving files — use `Form` instead
- How to combine both in one endpoint

**Build:** `POST /analyze` — accepts `resume` (UploadFile) + `job_description` (Form text)

**Questions you must answer:**
> "Can FastAPI receive both a file and a text field in the same POST request?"
> "Why can't we use a Pydantic body model alongside UploadFile?"

---

### Skill 2.3 — Keyword-Based Skill Extraction

**Learn:**
- Why keyword matching comes before LLMs (simple, fast, predictable, free)
- Building a predefined skill list
- Case-insensitive string matching
- Python list comprehensions

**Concept:**
```python
SKILL_LIST = ["Python", "FastAPI", "Docker", "SQL", "React", "AWS", ...]
text_lower = text.lower()
found = [s for s in SKILL_LIST if s.lower() in text_lower]
```

**Build:** `extract_skills(text: str) -> list[str]` in `services/skill_extractor.py`

**Questions you must answer:**
> "Why are we not using AI to extract skills in Week 2?"
> "What are the limitations of keyword-based skill extraction?"
> "How do we avoid duplicates in the skill list?"

---

## WEEK 3 Skills — Matching + Scoring

### Skill 3.1 — Skill Matching with Python Sets

**Learn:**
- Python set operations: `&` (intersection), `-` (difference)
- Converting lists to sets for fast comparison
- Building a structured match result

**Concept:**
```python
jd = {"Python", "FastAPI", "Docker"}
resume = {"Python", "FastAPI", "SQL"}
matched = jd & resume      # {"Python", "FastAPI"}
missing = jd - resume      # {"Docker"}
```

**Build:** `match_skills(jd_skills: list, resume_skills: list) -> dict` in `services/matcher.py`

**Return format:**
```python
{
  "matched": ["Python", "FastAPI"],
  "missing": ["Docker"]
}
```

**Questions you must answer:**
> "What Python data structure makes skill comparison simple and efficient?"
> "What is set intersection and set difference?"

---

### Skill 3.2 — Deterministic Scoring

**Learn:**
- Why the backend (not AI) calculates the score
- Simple percentage formula
- What "deterministic" means: same input always gives same output
- Integer vs float, clamping to 0–100

**Formula:**
```python
score = round((len(matched) / len(jd_skills)) * 100)
```

**Questions you must answer:**
> "Why shouldn't the LLM decide the numerical score?"
> "What does 'deterministic' mean in this context?"
> "What happens if jd_skills is an empty list?"

---

### Skill 3.3 — Structured API Response with Pydantic

**Learn:**
- Pydantic response models with `BaseModel`
- Using `response_model=` in FastAPI route decorator
- Why we define the response shape explicitly

**Target JSON shape:**
```json
{
  "score": 72,
  "matched_skills": ["Python", "FastAPI"],
  "missing_skills": ["Docker", "AWS"],
  "recommendations": []
}
```

**Questions you must answer:**
> "Who owns the business logic — frontend or backend?"
> "Why do we define a Pydantic model for the response?"

---

## WEEK 4 Skills — AI Integration

### Skill 4.1 — LLM API Integration (Gemini)

**Learn:**
- What an LLM API call looks like
- Using `google-generativeai` Python SDK
- Sending a text prompt, receiving a text response
- Parsing the response string

**Free strategy:** Start with Gemini API free tier. Design `ai_analyzer.py` so the AI provider can be swapped later without changing the whole application.

**Questions you must answer:**
> "Which AI provider are we using and why?"
> "How do we call Gemini from Python?"
> "What does the API return?"

---

### Skill 4.2 — Prompt Engineering Basics

**Learn:**
- What a prompt is in the context of LLMs
- Structured prompts: giving the AI context + a clear task
- Why we pass structured data (not raw messy text) to the AI
- System vs user messages

**Prompt template for V1:**
```
You are a resume coach.

Candidate's Resume Skills: {resume_skills}
Job Description Required Skills: {jd_skills}
Matched Skills: {matched}
Missing Skills: {missing}
Current Match Score: {score}%

Provide:
1. Two strengths of this candidate for this role
2. Key skill gaps
3. Three specific, actionable suggestions to improve this resume for this role
```

**Questions you must answer:**
> "What context do we pass to the AI and why?"
> "What is the AI responsible for vs what the Python code is responsible for?"
> "Why do we pass matched/missing skills to the AI instead of letting it analyze raw text?"

---

### Skill 4.3 — Environment Variables + Secrets

**Learn:**
- What `.env` files are
- `python-dotenv`: `load_dotenv()` and `os.getenv("KEY")`
- Why API keys must never be hardcoded in source code
- Why `.env` must be in `.gitignore`
- `.env.example` as a safe committed template

**Correct architecture (NEVER deviate from this):**
```
React → POST /analyze → FastAPI → Gemini API
                                    ↑
                           Key stored in .env only
```

**Questions you must answer:**
> "Where does the Gemini API key live?"
> "What happens if you accidentally commit your API key to GitHub?"
> "What is .env.example and why do we commit it?"

---

## WEEK 5 Skills — Integration + Testing

### Skill 5.1 — CORS Middleware

**Learn:**
- What CORS is: browser security that blocks cross-origin requests
- `CORSMiddleware` in FastAPI
- `allow_origins`: use `["*"]` for development, specific URL for production

**Questions you must answer:**
> "Why does the frontend get a CORS error when calling the backend?"
> "What is the difference between CORS settings for development vs production?"

---

### Skill 5.2 — Graceful Error Handling

**Learn:**
- `try/except` blocks for AI call failures
- Returning partial results when AI is unavailable (not crashing)
- What "fail gracefully" means

**Pattern:**
```python
try:
    recommendations = ai_analyzer.generate(...)
except Exception:
    recommendations = []   # return partial result, not 500 error
```

**Questions you must answer:**
> "What should happen if the Gemini API is down?"
> "What is 'graceful degradation'?"

---

### Skill 5.3 — End-to-End Test Cases

**Test these exact scenarios before Week 5 is done:**

| # | Input | Expected |
|---|---|---|
| 1 | Strong resume + matching JD | High score + few missing skills |
| 2 | Weak resume + unrelated JD | Low score + many missing skills |
| 3 | Partial match | Medium score |
| 4 | Invalid file (JPG) | 400 error |
| 5 | Empty JD | Error message |
| 6 | Very long JD | Response still works |
| 7 | AI service down | Returns score without recommendations |

---

## WEEK 6 Skills — Deployment

### Skill 6.1 — Production Readiness

**Learn:**
- Setting environment variables on hosting platform (not `.env` file)
- CORS: change `allow_origins=["*"]` to the actual frontend URL
- File size limits in FastAPI
- Removing debug logs before production

**Checklist:**
- [ ] API key set as environment variable on hosting platform
- [ ] CORS configured for production frontend URL
- [ ] File size limit configured
- [ ] Error handling covers all known failure points
- [ ] Swagger docs accessible in production
- [ ] README has local setup instructions

---

## The Architecture You Must Be Able to Explain

```
POST /analyze
     ↓
File bytes + JD text
     ↓
resume_parser.py     → raw text from PDF/DOCX
     ↓
text_cleaner.py      → normalized text
     ↓
skill_extractor.py   → resume_skills list, jd_skills list
     ↓
matcher.py           → matched[], missing[]
     ↓
Score calculation    → score (0-100)
     ↓
ai_analyzer.py       → strengths, gaps, suggestions
     ↓
JSON Response        → to frontend
```

If your mentor points to any file in this chain and asks "What does this do?", you should be able to explain it.

---

## V1 Scope Boundary (Do NOT build these)

- NO user authentication or login
- NO database (no PostgreSQL, MongoDB, Redis)
- NO RAG or vector embeddings
- NO payments or SaaS
- NO multiple user sessions
- NO microservices
- NO resume history or storage

V1 = parsing + matching + scoring + AI recommendations. That is the complete product.
