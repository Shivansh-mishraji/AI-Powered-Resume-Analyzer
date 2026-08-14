# SKILLS.md — Research & Documentation
# Member: Sujeet
# Role: Research Lead + Documentation
# Project: AI-Powered Resume & Job Description Analyzer

---

## Your Philosophy

> Write about what is built — not what you hope will be built.
>
> Each document you write should correspond to something that actually exists in the project.

You can use ChatGPT/AI to help draft text — but you must read and verify that it matches our actual project before submitting anything.

**For example:** If our project doesn't use machine learning models, don't write "Our ML model predicts candidate success." That would be wrong, and your mentor will notice.

Our V1 is: **Resume parsing + JD analysis + deterministic matching/scoring + AI-generated recommendations.**

If you understand that, you'll be able to verify what you write.

---

## WEEK 1 Skills — Basic Research + Problem Statement

### Skill 1.1 — Understanding the Problem

**Read and understand:**
- Why do job seekers struggle to tailor resumes?
- What is a Job Description (JD)?
- What is the problem with manually comparing a resume to a JD?
- How does our project help?

**Core concept:**
```
Resume → generic, unchanged for every job application
JD → specific skills and requirements for one role
Gap → resume doesn't highlight the right skills for that specific JD
Our solution → analyze both and show the gap
```

**You should be able to answer:**
> "What problem does this project solve?"
> "Why can't a student just manually compare their resume to a JD?"
> "Who would use this project?"

---

### Skill 1.2 — Writing a Problem Statement

**Learn:**
- A problem statement explains WHY the project exists
- It should describe the current pain, who faces it, and what the solution is
- Around 300–500 words is appropriate

**Structure:**
1. The situation (what's happening today)
2. The problem (what's wrong with today)
3. The consequences (why it matters)
4. The proposed solution (our project)

**You should be able to answer:**
> "Why is it hard for students to manually compare their resume with a JD?"
> "What does our project do differently?"

---

### Skill 1.3 — Research on Existing Tools

**Learn:**
- What tools already do resume analysis (Resumeworded, Jobscan, LinkedIn Resume Insights, etc.)
- What they do well
- What they don't do (limitation)
- How our V1 is positioned (simple, free, student-focused)

**Research format:**

| Tool | What it does | Good feature | Limitation |
|---|---|---|---|
| Resumeworded | Resume score and suggestions | Easy to use | Paid subscription |
| Jobscan | Match resume to JD | Detailed match | Requires sign up |
| [3 more...] | | | |

**You should be able to answer:**
> "What tools already do resume analysis?"
> "What is different about our project vs Resumeworded?"

---

## WEEK 2 Skills — Understanding the Project Flow

### Skill 2.1 — Understanding User Flow

**Learn:**
- What "user flow" means: the steps a user takes to complete a task
- How to write a user flow in plain language
- What happens at each step in our project

**Our flow:**
```
Step 1: User opens website
Step 2: User uploads resume (PDF or DOCX)
Step 3: User pastes job description
Step 4: User clicks Analyze
Step 5: System extracts text from resume
Step 6: System extracts required skills from JD
Step 7: System matches skills and calculates score
Step 8: AI generates suggestions
Step 9: User sees results (score + matched skills + missing skills + suggestions)
```

**You should be able to answer:**
> "Walk me through the user flow of this website."
> "What does the user see as output?"

---

### Skill 2.2 — Creating a Flowchart

**Learn to use (pick one):**
- draw.io (free, browser-based)
- Canva (free, drag and drop)
- Lucidchart (free tier available)

**The diagram should show the flow above as a visual diagram with arrows.**

**You should be able to answer:**
> "What tool did you use to create the flowchart?"
> "What does each box in the flowchart represent?"

---

## WEEK 3 Skills — Requirements Documentation

### Skill 3.1 — Functional vs Non-Functional Requirements

**Learn:**
- **Functional requirements** = what the system should DO
  - Example: "User should be able to upload a resume"
- **Non-functional requirements** = how well the system should do it
  - Example: "The website should be easy to use"

**Format: FR-XX and NFR-XX**

Examples:
```
FR-01: User should be able to upload a resume.
FR-02: System should accept PDF format.
FR-03: System should accept DOCX format.
FR-04: System should calculate a match score.
...

NFR-01: Website should be easy to use.
NFR-02: Results should load within a reasonable time.
...
```

**You should be able to answer:**
> "What is the difference between functional and non-functional requirements?"
> "Give me an example of a functional requirement for this project."

---

## WEEK 4 Skills — Architecture Documentation

### Skill 4.1 — Understanding System Architecture (Without Coding)

**Learn what each component does in plain language:**

| Component | Plain explanation |
|---|---|
| Frontend (React) | The part the user sees and interacts with in the browser |
| Backend (FastAPI) | The server that processes requests from the frontend |
| Resume Parser | Reads the uploaded file and extracts plain text |
| Text Cleaner | Removes noise from the extracted text |
| Skill Extractor | Identifies skills mentioned in the resume and JD |
| Matcher | Compares resume skills to JD skills |
| Scorer | Calculates a numeric match percentage |
| AI Analyzer | Uses Gemini AI to generate improvement suggestions |

**You should be able to answer:**
> "What is the frontend responsible for?"
> "What does the resume parser do?"
> "Why does the score come from the Python code and not the AI?"

---

### Skill 4.2 — Creating an Architecture Diagram

**Learn to draw:**
- Box for each component
- Arrows showing data flow
- Labels on arrows (e.g., "resume file", "extracted text", "JSON response")

**Use draw.io or Canva.**

**You should be able to answer:**
> "What does the arrow between the Backend and the AI Analyzer represent?"
> "Where does the score come from in the architecture?"

---

## WEEK 5 Skills — Project Report Writing

### Skill 5.1 — Academic Report Structure

**Learn:**
- What an Abstract is: a 200-300 word summary of the entire project
- What an Introduction is: background and motivation
- What Methodology is: how the system works, step by step
- What Limitations are: what the project doesn't do well
- What Future Scope is: what could be added later

**You should be able to answer:**
> "What is the difference between an abstract and an introduction?"
> "What goes in the 'Limitations' section?"
> "Give me 3 examples of Future Scope for our project."

---

### Skill 5.2 — Limitations (Specific to Our Project)

**V1 limitations to document honestly:**
- Keyword-based skill extraction misses skills with synonyms
- Does not handle scanned (image-only) PDFs
- AI suggestions may occasionally be generic
- Only supports PDF and DOCX — not other formats
- No user accounts or resume history

**You should be able to answer:**
> "What is a limitation of keyword-based skill matching?"
> "Why can't the system read scanned PDFs?"

---

## WEEK 6 Skills — PPT + User Manual + Viva

### Skill 6.1 — Making a Presentation

**Learn:**
- A project PPT should tell a story: Problem → Solution → How → Demo → Results
- Around 10-12 slides is enough
- Screenshots of the actual working website are essential
- Avoid putting long paragraphs on slides — use bullet points

**You should be able to answer:**
> "What is on your title slide?"
> "Which slide shows the system architecture?"

---

### Skill 6.2 — Preparing Viva Questions

**Categories:**
- **Basic**: What is the project? Who uses it? What problem does it solve?
- **Technical**: What is FastAPI? What is React? What does the resume parser do?
- **Project-specific**: How is the score calculated? What does the AI do? What are the limitations?

**You should be able to answer all 30 questions in `viva-questions.md` yourself before the viva.**

---

## Your Final Folder Structure

```
docs/
|
|-- problem-statement.md       <- Week 1
|-- objectives.md              <- Week 1
|-- existing-systems.md        <- Week 1-2
|-- user-flow.md               <- Week 2
|-- requirements.md            <- Week 3
|-- architecture-explanation.md <- Week 4
|-- user-manual.md             <- Week 6
|
|-- diagrams/
|   |-- project-flow.png       <- Week 2
|   `-- system-architecture.png <- Week 4
|
`-- report/
    `-- final-report.md        <- Week 5-6
```

Add files week by week — not all at once.
