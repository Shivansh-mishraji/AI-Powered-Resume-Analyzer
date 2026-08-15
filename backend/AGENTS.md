# AGENTS.md — Backend & AI Engineer

---

## HOW AI ASSISTS YOU (Read This First)

> **AI gives instructions. You write the code.**

When you ask for help:
- AI will tell you **what** to do
- AI will explain **why** you are doing it
- AI will explain **how** to do it step by step
- **You** open the file, type the code, run it, test it, commit it

AI will **never** write full files for you or commit code on your behalf.
That defeats the purpose of this project — you need to actually learn this.

If you get stuck on a specific line or error, AI will explain the fix.
But the typing is always yours.

---

# Member: Shivansh Mishra
# GitHub Username: Shivansh-mishraji
# Git Author Name: Shivansh Mishra
# Git Email: tgsmishra@gmail.com
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

---

## Saturday Mentor Reporting (Shivansh)

Every Saturday you give the mentor a clear update. This section tells you exactly what to say, how to explain your approach, and what questions to be ready for.

### How to structure your update (every week)

```
1. What I built this week (features/endpoints)
2. The approach I used and WHY
3. What I learned
4. What I tested
5. What is committed and pushed
6. What's planned for next week
7. Any blockers
```

Do NOT just say "I did backend work." Say WHAT you built, HOW you built it, and WHY that approach was chosen.

---

### Week 1 Mentor Update — FastAPI + Resume Upload

**What I built:**
> "I set up the FastAPI backend, created the health check endpoint, implemented the resume upload API that accepts PDF and DOCX files, and built the text extraction service for both formats."

**Approach I used:**
> "I used FastAPI because it's a modern Python web framework with automatic Swagger documentation and built-in request validation through Pydantic. For PDF extraction I used PyMuPDF because it's fast and reliable for text-based PDFs. For DOCX I used python-docx which lets me iterate through paragraphs. I kept them as separate functions in a single resume_parser.py service file."

**Why this approach:**
> "I separated the parser into its own service file so the route code stays clean. Each file type has its own function because PDF and DOCX have fundamentally different internal formats."

**What I tested:**
> "I tested with a real PDF resume, a DOCX resume, and a JPG to confirm it's rejected. I also tested an empty PDF."

**What is in Git:**
> Show the mentor: `git log --oneline` — they should see 7 commits with clear messages.

**Be ready for these questions:**
- "What is FastAPI?"
- "Why did you use PyMuPDF and not pdfplumber?"
- "What happens if someone uploads a corrupted PDF?"
- "What does your health check endpoint do?"

---

### Week 2 Mentor Update — JD Processing + Skill Extraction

**What I built:**
> "I extended the analyze endpoint to accept both a resume file and a job description text field in the same request. I built a text cleaner to normalize raw extracted text, and a skill extractor that identifies known technologies from both the resume and JD."

**Approach I used:**
> "I used a predefined skill list instead of AI for skill extraction at this stage. This is intentional — keyword matching is fast, free, predictable, and easy to debug. The skill extractor does a case-insensitive search for each known skill in the cleaned text."

**Why this approach:**
> "We deliberately did NOT use AI for skill extraction in Week 2 because we want the core matching logic to be deterministic and understandable. AI will come in Week 4, but only for generating human-readable suggestions — not for the core logic."

**What is in Git:**
> Show 5 new commits from this week.

**Be ready for these questions:**
- "Why keyword matching and not AI for skill extraction?"
- "What is text cleaning and why is it needed?"
- "How does your skill list work?"
- "What does `POST /analyze` accept as input?"

---

### Week 3 Mentor Update — Matching + Scoring

**What I built:**
> "I implemented the skill matching logic that compares resume skills with JD skills and produces a matched list and a missing list. I also built the deterministic scoring system that calculates a match percentage."

**Approach I used:**
> "I used Python set operations — specifically set intersection for matched skills and set difference for missing skills. This is the most efficient and readable way to compare two lists. The score is calculated as: (number of matched skills / total JD skills) × 100."

**Why this approach:**
> "The score is calculated by Python code, not by AI. This is a deliberate design decision. If we let the AI decide the score, the same resume could get a different score each time. Deterministic code gives consistent, explainable results — which is much more credible for a real-world system."

**API response format:**
> Show the mentor the actual Swagger response:
```json
{
  "score": 72,
  "matched_skills": ["Python", "FastAPI"],
  "missing_skills": ["Docker", "AWS"],
  "recommendations": []
}
```

**Be ready for these questions:**
- "How is the score calculated?"
- "Why is the score calculated by code and not AI?"
- "What is set intersection?"
- "What does the API return?"

---

### Week 4 Mentor Update — AI Integration

**What I built:**
> "I integrated the Gemini AI API to generate personalized improvement suggestions based on the match analysis. The AI receives the resume skills, JD skills, matched skills, missing skills, and score — and returns strengths, skill gaps, and concrete suggestions."

**Approach I used:**
> "The AI is used only for explanation and recommendations — not for scoring or matching. I wrote a structured prompt that gives the AI specific context so it doesn't generate generic advice. The API key is stored in a .env file and loaded through python-dotenv — it never leaves the backend."

**Why this approach:**
> "Separating AI from the scoring logic means if the AI API is down, the system still works — it just returns the score and skills without recommendations. This is called graceful degradation."

**Security point to mention:**
> "The Gemini API key is stored only in the backend's .env file. It is in .gitignore and never committed to GitHub. The frontend never sees the key."

**Be ready for these questions:**
- "What exactly does the AI do in your system?"
- "Where is the API key stored?"
- "What happens if the AI service is unavailable?"
- "What prompt do you send to the AI?"

---

### Week 5 Mentor Update — Frontend Integration + Complete Testing

**What I built:**
> "I added CORS middleware so the React frontend can call our FastAPI backend. I fixed edge cases discovered during integration testing, and worked with Vishal to test all 7 key scenarios including invalid files, empty JD, and AI failure."

**Approach I used:**
> "CORS is configured to allow all origins during development. For production, it will be restricted to the frontend's specific URL. I also ensured the API fails gracefully in all edge cases — returning a partial result rather than crashing."

**Be ready for these questions:**
- "What is CORS?"
- "What happens if you send an invalid file?"
- "What happens if the AI API is down?"
- "Walk me through a complete request from frontend to response."

---

### Week 6 Mentor Update — Deployment + Final

**What I built:**
> "I deployed the FastAPI backend, configured production environment variables, updated CORS for the production frontend URL, and finalized the API documentation and README."

**Be ready for these questions:**
- "How is the API key set in production?"
- "What hosting platform did you use?"
- "How does someone set up this project locally?"
- "What is the complete flow from user input to result?"

---

### General Mentor Presentation Tips

1. **Always have the live demo ready.** Open Swagger UI before the meeting starts.
2. **Show the Git log.** Run `git log --oneline` and show the mentor the clean commit history.
3. **Explain the WHY, not just the WHAT.** Don't just say "I used FastAPI." Say "I used FastAPI because..."
4. **Be honest about what's incomplete.** Saying "I planned X but ran into Y" is better than pretending something works when it doesn't.
5. **Have a test resume and JD ready.** Do a live demo of uploading and getting results.
6. **Know your code.** If the mentor points to any function in any service file, you should explain what it does.

