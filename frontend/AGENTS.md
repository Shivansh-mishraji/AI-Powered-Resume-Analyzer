# AGENTS.md — Frontend Developer
# Member: Harshwardhan
# Role: Frontend Developer
# Project: AI-Powered Resume & Job Description Analyzer

---

## Your Responsibilities

**You own everything in `frontend/`.**

| What you own | What you do NOT own |
|---|---|
| React application setup | Backend logic |
| All UI components | Score calculation |
| File upload interface | AI integration |
| Job description input | The Gemini API key |
| Results display page | Backend endpoints |
| API call from frontend to backend | Database (we have none in V1) |
| Loading and error states | |
| Mobile responsiveness | |

---

## The Golden Rule

**Never put the Gemini API key or any secret in React code.**

If the API key ends up in your React project, it becomes visible to anyone who opens the browser and looks at the source code.

Correct flow:
```
React → POST /analyze → FastAPI (key stays here) → Gemini API
```

---

## Week 1 — Basic React Homepage

### Goal
A working webpage that opens in the browser and shows the main interface.

### What to build

**File:** `frontend/src/App.jsx`

Build a single page that shows:
```
AI Resume Analyzer

Upload Your Resume
[ Choose File ]

Paste Job Description
[                         ]
[                         ]
[                         ]

[ Analyze Resume ]
```

**File:** `frontend/src/App.css`

Basic styling: centered layout, readable fonts, clean colors.

### Commit sequence

```
chore: initialize react frontend with vite
feat: add main homepage layout
feat: add resume upload input
feat: add job description textarea
feat: add analyze button
feat: add basic css styling
```

### End-of-week checkpoint

Before Saturday, verify:
- [ ] `npm run dev` starts without errors
- [ ] Page opens in browser
- [ ] File input, textarea, and button all appear
- [ ] You can answer all 6 Mentor Test questions for this week's code

### Saturday mentor update

> "I created the initial React frontend with the resume upload, Job Description input and Analyze button."

---

## Week 2 — Validation + UI Improvement

### Goal
A more complete and user-friendly homepage with validation and feedback.

### What to build

**File:** `frontend/src/App.jsx` (update)

Features to add:
- When a file is selected, show: `Selected Resume: resume.pdf [Remove]`
- Wrong file type error: `❌ Please upload PDF or DOCX only`
- No resume error: `❌ Please upload your resume`
- Empty JD error: `❌ Please enter a Job Description`
- When Analyze clicked: show `Analyzing your resume... Please wait...`

**Concepts to use:**
- `useState` for storing file, fileName, jdText, error messages, loading state
- `onChange` on file input
- `onClick` on Analyze button with validation before calling API

### Commit sequence

```
feat: add file selection display with remove option
feat: add file type validation
feat: add empty field validation
feat: add loading state on analyze click
feat: improve homepage styling
```

### End-of-week checkpoint

- [ ] Selecting a PDF shows the filename correctly
- [ ] Selecting a JPG shows error message
- [ ] Clicking Analyze with empty JD shows error
- [ ] Loading text appears when Analyze is clicked
- [ ] You can explain what `useState` does in your code

### Saturday mentor update

> "I added file validation, error messages, loading state and improved the UI."

---

## Week 3 — Connect Frontend to Backend

### Goal
When the user clicks Analyze, the frontend sends resume + JD to Shivansh's FastAPI backend.

### Before you start

Talk to Shivansh and get:
1. The exact URL of the backend (likely `http://localhost:8000/analyze` for local dev)
2. The exact field names he expects (`resume`, `job_description`)
3. The exact JSON shape the backend returns

Do NOT build the results page until you know the real JSON shape.

### What to build

**File:** `frontend/src/services/api.js`

```js
export async function analyzeResume(file, jobDescription) {
  const formData = new FormData()
  formData.append("resume", file)
  formData.append("job_description", jobDescription)

  const response = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    body: formData
  })

  if (!response.ok) {
    throw new Error("Analysis failed")
  }

  return await response.json()
}
```

**Update:** `App.jsx` — wire the Analyze button click to call `analyzeResume()`

On success → store result in state (pass to Results page)
On error → show `❌ Something went wrong. Please try again.`

### Commit sequence

```
feat: add api service for backend communication
feat: connect analyze button to backend api
feat: handle api success response
feat: handle api error with user message
```

### End-of-week checkpoint

- [ ] Clicking Analyze sends request to backend (check browser Network tab)
- [ ] You can see the JSON response in the browser console
- [ ] Errors show a helpful message instead of a blank screen
- [ ] You can explain: "When the user clicks Analyze, my frontend sends the resume and Job Description to Shivansh's FastAPI backend and receives the analysis response."

### Saturday mentor update

> "I connected the frontend with Shivansh's FastAPI backend and sent the resume and Job Description for analysis."

---

## Week 4 — Results Page

### Goal
Display the actual analysis results received from the backend.

### What to build

**File:** `frontend/src/pages/Results.jsx`

Display:
```
Resume Analysis

Overall Score
78/100

Matched Skills
✓ Python
✓ FastAPI
✓ SQL

Missing Skills
✗ Docker
✗ AWS

AI Suggestions

1. Add your FastAPI project...
2. Learn Docker basics...
3. Add relevant experience...
```

**Rules:**
- Use REAL data from the backend — not hardcoded numbers
- `result.score` for the score
- `result.matched_skills.map(...)` for matched skills
- `result.missing_skills.map(...)` for missing skills
- `result.recommendations` for AI suggestions

### Commit sequence

```
feat: add results page component
feat: display match score from api response
feat: display matched skills list
feat: display missing skills list
feat: display ai recommendations
```

### End-of-week checkpoint

- [ ] Results page shows real data from a real analysis
- [ ] Refreshing or running a new analysis works correctly
- [ ] You can explain what `.map()` does in your code
- [ ] Score is NOT hardcoded to 78

### Saturday mentor update

> "I created the results page to display the score, matched skills, missing skills and AI recommendations."

---

## Week 5 — Integration + Complete Flow

### Goal
The complete website works end-to-end. Every state is handled. Mobile works.

### Full flow to verify manually

```
Open Website
     ↓
Upload PDF resume
     ↓
Paste Job Description
     ↓
Click Analyze
     ↓
"Analyzing..." appears
     ↓
Backend processes
     ↓
Results page shows
     ↓
Score + Skills + Suggestions visible
```

### Test checklist

| Test | Expected |
|---|---|
| Upload PDF + paste JD → Analyze | Results appear |
| Upload DOCX → Analyze | Results appear |
| Upload JPG | Validation error before reaching backend |
| Empty JD → Analyze | Validation error |
| Backend fails | User-friendly error message |
| Open on mobile | Page fits, buttons work, results readable |

### Commit sequence

```
fix: resolve any ui issues found during testing
feat: improve mobile layout with media queries
feat: add navigation between home and results
chore: clean up unused code
```

### Saturday mentor update

> "I integrated and tested the complete frontend workflow and made it responsive."

---

## Week 6 — Final Polish + Deployment

### Goal
Frontend is deployed, screenshots are taken for the project report.

### What to do

1. Fix any remaining UI problems
2. Remove unused code and console.log statements
3. Test mobile view one final time
4. Run `npm run build` and deploy (Netlify / Vercel / GitHub Pages)
5. Update the frontend API URL from `http://localhost:8000` to the deployed backend URL
6. Take screenshots for the project PPT and report

### Commit sequence

```
fix: update api url to production backend
fix: final ui fixes before deployment
chore: build and deploy frontend
docs: add screenshots to project docs
```

### Saturday mentor update

> "I fixed the remaining UI issues and prepared the frontend for deployment."

---

## Your Full File Structure (Build Toward This)

```
frontend/
|
|-- src/
|   |-- App.jsx
|   |-- App.css
|   |
|   |-- components/
|   |   |-- ResumeUpload.jsx
|   |   `-- JobDescription.jsx
|   |
|   |-- pages/
|   |   `-- Results.jsx
|   |
|   `-- services/
|       `-- api.js
|
|-- public/
|-- package.json
`-- index.html
```

Do NOT create all these at once. Add each file when you actually need it.

---

## Six-Week Summary

| Week | Main Build | End Result |
|---|---|---|
| 1 | Basic homepage layout | Page opens in browser |
| 2 | Upload + validation + loading | Complete input form |
| 3 | Backend connection | Frontend talks to FastAPI |
| 4 | Results page | Score, skills, suggestions shown |
| 5 | Full flow + mobile | End-to-end working |
| 6 | Final polish + deployment | Live frontend |

---

## Coordination Rules

| Situation | You do |
|---|---|
| Need to know API response format | Ask Shivansh — he defines it in `schemas/analysis.py` |
| Backend returns unexpected data | Tell Shivansh with a screenshot of the error |
| Something doesn't look right on results | Fix the component first, ask if you're stuck |
| UI bug found during testing | Vishal will report it — you fix it |
