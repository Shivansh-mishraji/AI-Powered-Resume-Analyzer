# AGENTS.md — Backend & AI Engineer
# Member: Shivansh Mishra
# Role: Backend Engineer + AI Engineer + Scrum Master
# Project: AI-Powered Resume & Job Description Analyzer

---

## Your Responsibilities

**You own everything in `backend/`.**

| Domain | You own it |
|---|---|
| All FastAPI endpoints | YES |
| Resume parser service | YES |
| Text cleaner service | YES |
| Skill extractor service | YES |
| Matcher service | YES |
| Deterministic scorer | YES |
| AI analyzer service | YES |
| API response schemas | YES |
| Backend test cases | YES |
| Environment variables & secrets | YES |
| Weekly scrum coordination | YES (Scrum Master) |

**You do NOT own:**
- React frontend code (Harshwardhan's domain)
- Frontend styling decisions
- First draft of documentation (Sujeet's domain)

---

## Development Loop (Follow This Every Time)

```
Learn the concept
       ↓
Write the code
       ↓
Run it yourself
       ↓
Test it manually
       ↓
Commit it with a clear message
       ↓
Tell Vishal so he can test it
```

Never skip the "run it yourself" step. Never commit what you haven't tested.

---

## Week 1 — FastAPI Foundation + Resume Upload

### Goal
Working backend with file upload and text extraction from PDF and DOCX files.

### What to build

**File:** `backend/app/main.py`

Endpoints:
- `GET /health` → returns `{"status": "ok"}`
- `POST /resume/upload` → accepts PDF/DOCX, rejects everything else

**File:** `backend/app/services/resume_parser.py`

Functions:
- `extract_text_from_pdf(file_bytes: bytes) -> str`
- `extract_text_from_docx(file_bytes: bytes) -> str`

**File:** `backend/tests/test_resume_parser.py`

Test cases:
- Valid PDF → text extracted
- Valid DOCX → text extracted
- JPG → rejected with 400
- Empty PDF → handled without crash

### Commit sequence

```
chore: initialize project structure
chore: initialize FastAPI backend
feat: add health check endpoint
feat: add resume upload endpoint
feat: add pdf text extraction
feat: add docx text extraction
test: add resume parser tests
```

### End-of-week checkpoint

Before Saturday, verify:
- [ ] `GET /health` returns `{"status": "ok"}` in Swagger
- [ ] `POST /resume/upload` accepts a real PDF resume
- [ ] `POST /resume/upload` accepts a real DOCX resume
- [ ] `POST /resume/upload` rejects a JPG with a clear error message
- [ ] You can explain every function in `resume_parser.py` in your own words

### Saturday mentor update (use your own words)

> "This week I set up the FastAPI backend, created the resume upload API, implemented PDF and DOCX text extraction, and tested different file types."

---

## Week 2 — JD Processing + Skill Extraction

### Goal
Backend receives both resume (file) and job description (text), extracts skills from both.

### What to build

**Extend:** `backend/app/main.py` or create `backend/app/routes/analysis.py`

- `POST /analyze` → accepts `resume` (UploadFile) + `job_description` (Form text string)

**File:** `backend/app/services/text_cleaner.py`

- `clean_text(raw: str) -> str`

**File:** `backend/app/services/skill_extractor.py`

- `extract_skills(text: str) -> list[str]` using a predefined skill list

### Commit sequence

```
feat: add job description input to analyze endpoint
feat: add text cleaning service
feat: add predefined skill list
feat: add keyword-based skill extraction
feat: extract skills from resume text
feat: extract skills from job description text
```

### End-of-week checkpoint

- [ ] `POST /analyze` receives both file and text without errors
- [ ] `clean_text()` removes extra whitespace and noise
- [ ] `extract_skills()` correctly identifies Python, FastAPI, SQL etc. from sample text
- [ ] You can explain what `clean_text()` does and why it's needed

### Saturday mentor update

> "I implemented job description processing and basic skill extraction from both the resume and JD."

---

## Week 3 — Matching + Scoring

### Goal
System compares resume skills vs JD skills and returns a deterministic numeric score.

### What to build

**File:** `backend/app/services/matcher.py`

- `match_skills(jd_skills: list, resume_skills: list) -> dict`
  - Returns: `{"matched": [...], "missing": [...]}`

**File:** `backend/app/schemas/analysis.py`

- `AnalysisResponse` Pydantic model

**Update:** `POST /analyze` to return full structured response:

```json
{
  "score": 72,
  "matched_skills": ["Python", "FastAPI"],
  "missing_skills": ["Docker", "AWS"],
  "recommendations": []
}
```

**File:** `backend/tests/test_matcher.py`

Test cases:
- Full match → score 100
- No match → score 0
- Partial match → correct percentage
- Empty JD skills → handled without crash

### Commit sequence

```
feat: add skill matching logic
feat: add deterministic scoring formula
feat: add analysis response schema
feat: complete analyze endpoint with match result
test: add matching and scoring tests
```

### Scoring formula

```python
score = round((len(matched) / len(jd_skills)) * 100) if jd_skills else 0
```

### Non-negotiable rule

The score is calculated by Python code. The LLM does NOT decide the number. If your mentor asks "Why?", your answer is:

> "Deterministic code gives consistent, explainable results. LLMs can give different scores for the same input which makes the system unreliable."

### Saturday mentor update

> "I implemented resume-JD skill matching and a deterministic scoring system to identify matched and missing skills."

---

## Week 4 — AI Integration

### Goal
AI generates human-readable explanation and suggestions based on the deterministic analysis output.

### What to build

**File:** `backend/app/services/ai_analyzer.py`

- `generate_recommendations(resume_skills, jd_skills, matched, missing, score) -> str`
- Calls Gemini API
- Returns text with strengths, gaps, suggestions
- Fails gracefully: if API is down, return empty string — never crash

**File:** `backend/.env.example`

```
GEMINI_API_KEY=your_api_key_here
```

**Update:** `POST /analyze` response now includes `"recommendations"` field

### Commit sequence

```
feat: add ai analyzer service
feat: integrate gemini api
feat: add prompt template for resume feedback
feat: integrate ai recommendations into analyze response
chore: add .env.example for api key configuration
```

### Key rules for this week

1. **Never commit `.env`** — only commit `.env.example`
2. **Never hardcode the API key** in Python code
3. **The key never goes to the frontend** — React never touches it
4. **If the AI call fails, return partial result** — not a 500 error

### Saturday mentor update

> "I integrated the AI layer to generate personalized resume improvement suggestions based on the JD and the calculated analysis."

---

## Week 5 — Frontend Integration + Complete Testing

### Goal
Frontend successfully calls `POST /analyze` and receives full results. All edge cases handled.

### What to do

1. Add CORS middleware to `main.py`:
   ```python
   app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
   ```
2. Coordinate with Harshwardhan — give him the exact JSON shape your API returns
3. Fix any edge cases discovered during integration testing
4. Write end-to-end test cases with Vishal

### Test cases to personally verify

| # | Scenario | Expected outcome |
|---|---|---|
| 1 | Strong resume + matching JD | High score |
| 2 | Weak resume + unrelated JD | Low score |
| 3 | Partial match | Medium score, correct missing skills |
| 4 | JPG uploaded | 400 error, clear message |
| 5 | Empty JD | Error, not crash |
| 6 | Very long JD (2000+ words) | Still responds correctly |
| 7 | Gemini API down | Returns score without recommendations |

### Commit sequence

```
feat: add cors middleware for frontend integration
fix: handle edge cases in analyzer endpoint
test: add end-to-end test cases
docs: update api documentation
```

### Saturday mentor update

> "I integrated the backend with the frontend, completed the analysis workflow, and tested different resume-JD combinations."

---

## Week 6 — Deployment + Final Cleanup

### Goal
Live backend deployed, documented, demo-ready.

### Checklist before deployment

- [ ] Environment variables set on hosting platform (not in `.env` file)
- [ ] CORS `allow_origins` updated to production frontend URL
- [ ] File size limit configured
- [ ] Error handling covers all known failure points
- [ ] Swagger docs accessible in production
- [ ] README has clear local setup instructions
- [ ] `.env` is in `.gitignore` and not in any commit

### Commit sequence

```
chore: configure production environment variables
fix: adjust cors for production frontend url
docs: finalize api documentation
docs: update README with setup instructions
chore: final cleanup before deployment
```

### Saturday mentor update

> "I deployed the backend, fixed production issues, finalized API documentation, and prepared the V1 for demonstration."

---

## Your Final Backend Structure

Build toward this. Do NOT create all files on Day 1.

```
backend/
|
|-- app/
|   |-- __init__.py
|   |-- main.py
|   |
|   |-- routes/
|   |   `-- analysis.py
|   |
|   |-- services/
|   |   |-- resume_parser.py
|   |   |-- text_cleaner.py
|   |   |-- skill_extractor.py
|   |   |-- matcher.py
|   |   `-- ai_analyzer.py
|   |
|   `-- schemas/
|       `-- analysis.py
|
|-- tests/
|   |-- test_resume_parser.py
|   |-- test_skill_extractor.py
|   |-- test_matcher.py
|   `-- test_analyze_endpoint.py
|
|-- .env.example
|-- requirements.txt
`-- README.md
```

---

## Scrum Master Duties (Weekly)

Every Saturday, before the mentor meeting, collect this from each team member and compile it:

```
Week [N] Team Update

Shivansh (Backend/AI):
- Built: ...
- Committed: ...
- Next: ...

Harshwardhan (Frontend):
- Built: ...
- Committed: ...
- Next: ...

Vishal (Testing):
- Tested: ...
- Issues found: ...
- Next: ...

Sujeet (Documentation):
- Documented: ...
- Next: ...

Blockers (if any):
- ...
```

Present this to the mentor. Keep it honest — if something didn't get done, say so.

---

## Non-Negotiable Personal Rules

1. **Understand before committing.** If AI wrote a function, you must explain it in your own words before committing.
2. **Score is calculated by Python code, not AI.** The LLM only explains and suggests.
3. **API keys never leave the backend.** React never sees the Gemini API key.
4. **One commit per logical unit of work.** Not "added everything". Not 10 files in one commit.
5. **Tests exist before claiming something works.** Manual testing counts, but pytest cases are better.
6. **Fail gracefully.** If the AI call fails, return deterministic result without recommendations — never crash.
7. **Tell Vishal when a feature is ready.** Don't make him wait to start testing.

---

## Six-Week Summary

| Week | Main Work | End Result |
|---|---|---|
| 1 | FastAPI + upload + PDF/DOCX parsing | Resume text extraction working |
| 2 | JD endpoint + text cleaning + skill extraction | Resume + JD skills extracted |
| 3 | Matching + scoring + API schema | Deterministic match score returned |
| 4 | AI integration + secrets | Personalized recommendations added |
| 5 | CORS + edge cases + integration | Complete working API |
| 6 | Deployment + docs + cleanup | Live V1 |
