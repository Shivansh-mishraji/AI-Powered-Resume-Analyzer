# AGENTS.md — Research & Documentation
# Member: Sujeet
# Role: Research Lead + Documentation
# Project: AI-Powered Resume & Job Description Analyzer

---

## Your Responsibilities

**You own everything in `docs/`.**

| What you own | What you do NOT own |
|---|---|
| Problem statement | Code |
| Project objectives | Test execution |
| Research on existing tools | Architecture decisions |
| User flow documentation | UI design choices |
| System requirements document | Scoring formula |
| Architecture explanation | AI integration |
| Final project report | PPT design (you write content, team reviews) |
| User manual | Viva answers for other members |
| Viva question list | |

---

## Core Rule

> Write about what is built, not what you plan to build.

For example: `docs/architecture.md` should not be written until Week 4, because the architecture is defined through actual working code in Weeks 1-4. Before that, you would be documenting guesses.

---

## Week 1 — Problem Research + Basic Documents

### Goal
Understand and document why this project exists.

### What to produce

**File:** `docs/problem-statement.md`

Write 300-500 words covering:
1. What problem job seekers face with resumes
2. Why manually comparing a resume with a JD is difficult
3. What our project does to solve this

Avoid writing anything that isn't true about V1:
- Do NOT mention machine learning models
- Do NOT mention user accounts
- Do NOT mention databases or storage
- Our V1 is: parsing + matching + scoring + AI suggestions

---

**File:** `docs/objectives.md`

Write 5-8 clear objectives.

Example:
```
1. Allow users to upload a resume in PDF or DOCX format.
2. Allow users to input a job description as text.
3. Extract skills mentioned in the resume.
4. Extract required skills from the job description.
5. Compare resume skills with JD skills.
6. Calculate a deterministic match score.
7. Generate AI-powered improvement suggestions.
8. Display clear results to the user.
```

---

**File:** `docs/existing-systems.md`

Research 4-5 existing tools:
- Resumeworded
- Jobscan
- LinkedIn Resume Insights
- Resume.io
- Any other you find

For each, write:
- What it does
- One good feature
- One limitation

End with a short paragraph explaining what makes V1 different (simple, free, no account required, transparent scoring).

### Commit sequence

```
docs: add problem statement
docs: add project objectives
docs: add existing systems research
```

### End-of-week checkpoint

- [ ] `problem-statement.md` written and describes our actual V1
- [ ] `objectives.md` has at least 5 clear objectives
- [ ] `existing-systems.md` covers at least 4 tools with pros and cons
- [ ] You did NOT write anything about features that don't exist in V1

### Saturday update to Shivansh

```
Sujeet — Week 1

Completed:
1. problem-statement.md
2. objectives.md
3. existing-systems.md

What I researched:
- Why resume-JD mismatch is a real problem
- 5 existing tools (Resumeworded, Jobscan, LinkedIn, Resume.io, Zety)

Next week:
- User flow documentation
- Flowchart diagram
```

---

## Week 2 — User Flow + Flowchart

### Goal
Document and visualize what happens when a user uses the website.

### Coordinate first

Before writing, ask Shivansh or Harshwardhan to walk you through the current flow verbally. Then document it — not the other way around.

### What to produce

**File:** `docs/user-flow.md`

Write the steps in plain language:
```
Step 1: User opens the website
Step 2: User uploads their resume (PDF or DOCX)
Step 3: User pastes the job description text
Step 4: User clicks "Analyze Resume"
Step 5: System extracts text from the resume
Step 6: System identifies required skills from the JD
Step 7: System matches resume skills with JD skills
Step 8: System calculates a match score
Step 9: AI generates improvement suggestions
Step 10: User sees the results (score, matched skills, missing skills, suggestions)
```

---

**File:** `docs/diagrams/project-flow.png`

Create a flowchart using draw.io, Canva, or Lucidchart.

The diagram should visually represent the same steps above with arrows.

Save the exported image as `docs/diagrams/project-flow.png`.

### Commit sequence

```
docs: add user flow documentation
docs: add project flow diagram
```

### End-of-week checkpoint

- [ ] `user-flow.md` describes the actual website flow
- [ ] `project-flow.png` created and saved in `docs/diagrams/`
- [ ] You verified the flow with Shivansh before writing

### Saturday update to Shivansh

```
Sujeet — Week 2

Completed:
1. user-flow.md
2. project-flow.png (flowchart diagram)

Next week:
- System requirements documentation
```

---

## Week 3 — Requirements Document

### Goal
Write down formally what the system should and should not do.

### What to produce

**File:** `docs/requirements.md`

**Part 1 — Functional Requirements (10-15 items)**

Format: `FR-01: [requirement description]`

Cover:
- Uploading resume (PDF, DOCX)
- Inputting job description
- Text extraction
- Skill identification
- Matching and scoring
- AI suggestions
- Displaying results
- Error handling for invalid files
- Error handling for empty fields

**Part 2 — Non-Functional Requirements (5-8 items)**

Format: `NFR-01: [requirement description]`

Cover:
- Usability (easy to use without a manual)
- Performance (results within a reasonable time)
- Security (API key not exposed to user)
- Compatibility (works on modern browsers)
- Responsiveness (works on mobile)

### Commit sequence

```
docs: add system requirements document
```

### End-of-week checkpoint

- [ ] At least 10 functional requirements written
- [ ] At least 5 non-functional requirements written
- [ ] All requirements reflect V1 scope (no auth, no database, no payments)

### Saturday update to Shivansh

```
Sujeet — Week 3

Completed:
1. requirements.md (10 FR, 5 NFR)

Next week:
- System architecture diagram
- Architecture explanation document
```

---

## Week 4 — Architecture Documentation

### Goal
Explain how the system is built using non-technical language.

### Coordinate FIRST

Before writing `architecture-explanation.md`:
1. Ask Shivansh to verbally explain what each service file does
2. Then you write it down in your own words
3. Show him the draft and ask if it's accurate

Do NOT write architecture docs based on guesses.

### What to produce

**File:** `docs/diagrams/system-architecture.png`

Create a diagram showing:
```
USER
  ↓
FRONTEND (React)
  ↓
BACKEND (FastAPI)
  ↓
[Resume Parser]   [JD Processor]
         ↓
    [Skill Extractor]
         ↓
      [Matcher]
         ↓
      [Scorer]
         ↓
   [AI Analyzer]
         ↓
   JSON Response
         ↓
FRONTEND Results Page
```

---

**File:** `docs/architecture-explanation.md`

For each component, write 1-3 simple sentences.

Example:
```
Frontend (React): The visual part of the website that the user sees. 
It collects the resume file and job description from the user and displays the results.

Backend (FastAPI): The server that receives the data from the frontend and 
processes it. All business logic happens here.

Resume Parser: Reads the uploaded PDF or DOCX file and converts it into 
plain text that the rest of the system can process.

Skill Extractor: Scans the cleaned text and identifies skills mentioned, 
using a predefined list of known technologies and skills.

Matcher: Compares the skills found in the resume with the skills required 
by the job description. Produces a "matched" list and a "missing" list.

Scorer: Calculates the overall match percentage based on how many JD skills 
appear in the resume. This is calculated by code, not by AI.

AI Analyzer: Sends the match results to the Gemini AI to generate 
human-readable improvement suggestions based on the candidate's gaps.
```

### Commit sequence

```
docs: add system architecture diagram
docs: add architecture explanation document
```

### End-of-week checkpoint

- [ ] Architecture diagram created and saved
- [ ] Architecture explanation covers all 7 components
- [ ] Every explanation was verified with Shivansh

### Saturday update to Shivansh

```
Sujeet — Week 4

Completed:
1. system-architecture.png
2. architecture-explanation.md

Next week:
- Start project report draft
```

---

## Week 5 — Project Report (First Draft)

### Goal
Compile all your documents into a structured project report.

### What to produce

**File:** `docs/report/final-report.md`

Structure:

```markdown
# AI-Powered Resume & Job Description Analyzer
## Project Report — [Date]

---

## 1. Abstract
[200-300 words: what the project is, what it does, brief mention of technologies]

## 2. Introduction
[400-600 words: background, motivation, what problem we solve]

## 3. Problem Statement
[Use and expand your Week 1 document]

## 4. Objectives
[Use your Week 1 objectives]

## 5. Literature Review / Existing Systems
[Use your Week 1 existing systems research]

## 6. Proposed System
[Explain our V1 solution clearly]

## 7. System Architecture
[Include the architecture diagram + explanation from Week 4]

## 8. Methodology
[Explain step by step how the analysis works — use the user flow from Week 2]

## 9. Technologies Used
[FastAPI, React, PyMuPDF, python-docx, Gemini API]

## 10. Advantages
[List at least 5 advantages of our system]

## 11. Limitations
[List at least 4 honest limitations of V1]

## 12. Future Scope
[List 5-7 features that could be added in V2+]

## 13. Conclusion
[2-3 paragraphs summarizing what was achieved]
```

### Limitations to document honestly

1. Keyword-based matching misses synonyms (e.g., "Postgres" vs "PostgreSQL")
2. Cannot read scanned/image PDFs (only text-based PDFs)
3. AI suggestions may occasionally be generic
4. No resume history — user must re-upload every time
5. Skill list is manually maintained and may not cover all technologies

### Future Scope to document

1. User accounts and resume history
2. Multiple job application tracking
3. Better AI models for skill extraction
4. Support for more file formats
5. Job recommendations based on resume
6. Resume rewriting suggestions
7. SaaS version with subscription

### Commit sequence

```
docs: add first draft of project report
```

### Saturday update to Shivansh

```
Sujeet — Week 5

Completed:
1. First draft of final-report.md

Next week:
- PPT slides
- User manual
- 30 viva questions
- Final report polish
```

---

## Week 6 — PPT + User Manual + Viva Questions

### What to produce

**PPT Slides (10-12 slides)**

Suggested structure:
1. Title — project name, team members, date
2. Problem — what problem we solve
3. Existing Systems — what already exists
4. Our Solution — what we built
5. Objectives — bullet points
6. System Architecture — the diagram
7. Technology Stack — FastAPI, React, PyMuPDF, Gemini
8. Working Flow — the user flow diagram
9. Screenshots — show the actual website
10. Results — sample output (score, skills, suggestions)
11. Limitations & Future Scope
12. Conclusion + Thank You

**Rules for PPT:**
- No long paragraphs on slides
- Use bullet points
- Every slide must have a screenshot or diagram if possible
- Font size at least 18pt

---

**File:** `docs/user-manual.md`

Write step-by-step instructions for a normal user:

```markdown
# User Manual

## How to Use the AI Resume Analyzer

Step 1: Open the website at [URL]

Step 2: Click "Choose File" and select your resume (PDF or DOCX format only)

Step 3: In the "Paste Job Description" box, copy and paste the full job description 
from the job you are applying to

Step 4: Click "Analyze Resume"

Step 5: Wait a few seconds for the analysis to complete

Step 6: View your results:
- Overall Match Score (percentage)
- Matched Skills (skills that appear in both your resume and the JD)
- Missing Skills (skills the JD requires but your resume doesn't show)
- AI Suggestions (personalized recommendations to improve your resume)
```

Add screenshots once the website is live.

---

**File:** `docs/viva-questions.md`

Write 30 questions + answers. Divide into:

**Basic (10 questions)**
- What is the project?
- What problem does it solve?
- Who are the target users?
- Why did we build this?
- What are the main features?

**Technical (10 questions)**
- What is FastAPI?
- What is React?
- What is resume parsing?
- What library is used to extract text from PDFs?
- What library is used for DOCX files?
- What is an API?
- What is JSON?
- What is Pydantic?
- What is Gemini API used for?
- How is CORS handled?

**Project-specific (10 questions)**
- How does resume-JD matching work?
- How is the score calculated?
- Why is the score calculated by code and not AI?
- What are matched skills?
- What are missing skills?
- How does the AI generate suggestions?
- What file types are supported?
- What are the limitations of this project?
- What could be added in the next version?
- How would you improve the skill matching?

### Commit sequence

```
docs: add user manual
docs: add viva question list
docs: finalize project report
```

---

## Your Full Document Structure

```
docs/
|
|-- problem-statement.md        <- Week 1
|-- objectives.md               <- Week 1
|-- existing-systems.md         <- Week 1-2
|-- user-flow.md                <- Week 2
|-- requirements.md             <- Week 3
|-- architecture-explanation.md <- Week 4
|-- user-manual.md              <- Week 6
|-- viva-questions.md           <- Week 6
|
|-- diagrams/
|   |-- project-flow.png        <- Week 2
|   `-- system-architecture.png <- Week 4
|
`-- report/
    `-- final-report.md         <- Week 5 (finalized Week 6)
```

---

## Six-Week Summary

| Week | Document | Difficulty |
|---|---|---|
| 1 | Problem statement + objectives + existing systems | Easy |
| 2 | User flow + flowchart | Easy |
| 3 | Requirements document | Easy |
| 4 | Architecture diagram + explanation | Easy |
| 5 | First draft of project report | Easy |
| 6 | PPT + user manual + viva questions + final report | Easy |

---

## Documentation Standard (Every Document)

```markdown
# [Document Title]

## Purpose
One paragraph: why this document exists.

## [Content Sections]
Actual content, not speculation.

## References
Any external sources cited.
```

Every document must describe the actual system — not what you hope it will become.
