# SKILLS.md — Testing & QA
# Member: Vishal
# Role: Testing & Quality Checking
# Project: AI-Powered Resume & Job Description Analyzer

---

## Your Philosophy

> You don't need to write code. Your job is to use the website like a real user and carefully notice when things don't work correctly.

You don't need to learn:
- Python
- FastAPI
- React
- Databases
- Automated testing frameworks

**Your main skill is observation.** Use the product carefully, try unexpected things, and report what you find clearly.

You can use ChatGPT to help format reports or generate test ideas — but **you must perform the actual tests yourself**.

---

## What "Good Testing" Looks Like

Testing is not just clicking through and saying everything works.

Good testing means:
- Trying things that a normal user might not try (empty inputs, wrong file types, very long text)
- Documenting what you expected vs what actually happened
- Taking a screenshot when something fails
- Reporting the problem clearly enough that Shivansh can reproduce it

**You don't need to fix bugs. Your job is: Find → Document → Report → Retest after fix.**

---

## WEEK 1 Skills — Understanding the Project + Basic Test List

### Skill 1.1 — Understand the Basic Flow

Before testing anything, understand what the website is supposed to do.

**The flow:**
```
Open Website
     ↓
Upload Resume (PDF or DOCX)
     ↓
Paste Job Description
     ↓
Click Analyze
     ↓
Wait for results
     ↓
See: Score + Matched Skills + Missing Skills + AI Suggestions
```

**You should be able to answer:**
> "What does this website do?"
> "What does a user need to provide as input?"
> "What does the website show as output?"

---

### Skill 1.2 — Writing a Test Case

A test case is a structured description of:
1. What you do
2. What you expect
3. What actually happened
4. Pass or Fail

**Format (memorize this):**

```
Test: [Short name]

What I did:
[Describe what you did step by step]

Expected:
[What should have happened]

Actual:
[What actually happened]

Status: PASS / FAIL
```

**If FAIL, add:**
```
Problem:
[Describe the issue]

Screenshot: [attach if possible]
```

**You should be able to answer:**
> "What is a test case?"
> "What is the difference between PASS and FAIL?"

---

## WEEK 2 Skills — Testing Resume Upload

### Skill 2.1 — File Type Testing

**Understand:**
- The website should accept: PDF and DOCX
- The website should reject: JPG, PNG, TXT, EXE, and anything else

**Learn to test:**
- What a valid upload looks like (file is accepted, no error)
- What a rejected upload looks like (error message appears)
- What happens when no file is selected and you click Analyze

**You should be able to answer:**
> "Which file types are valid for this project?"
> "What error message should appear for an invalid file?"

---

### Skill 2.2 — Edge Case Testing

**Understand:** Edge cases are unusual or extreme inputs that might break the system.

**For file upload, edge cases are:**
- An empty document (0 bytes or blank content)
- A very large file (5MB+)
- A file that's renamed but has wrong content (e.g., a JPG renamed to `.pdf`)
- A corrupted file

**You should be able to answer:**
> "What is an edge case?"
> "Why do we test edge cases?"

---

## WEEK 3 Skills — Testing Job Description Input

### Skill 3.1 — Text Input Testing

**Tests to understand:**
- Normal JD → should work fine
- Very long JD → should still process (not time out or crash)
- Very short JD → should still produce some result
- Empty JD → should show an error, not crash
- Random text → system should handle it (low match score, no crash)
- Special characters → system should not crash

**You should be able to answer:**
> "What should happen when the JD field is empty?"
> "Why do we test with very long input?"

---

## WEEK 4 Skills — Testing Analysis Results

### Skill 4.1 — Understanding the Output

**Learn what the results page should show:**
- Overall match score (a number from 0 to 100)
- Matched skills (skills in both the resume and JD)
- Missing skills (skills in JD but not in resume)
- AI suggestions (text recommendations)

**You should be able to answer:**
> "What is 'matched skills'?"
> "What is 'missing skills'?"
> "Why should a strong resume have a higher score?"

---

### Skill 4.2 — Sanity Checking Results

**Sanity check = does the result make logical sense?**

| Scenario | Does it make sense? |
|---|---|
| Resume has Python, JD needs Python → Python in "matched" | YES |
| Resume has Python, JD needs Python → Python in "missing" | NO — this is a bug |
| Strong resume + matching JD → Score > 70 | YES |
| Blank resume + unrelated JD → Score near 0 | YES |
| AI suggestions mention Docker when resume lacks Docker | YES |
| AI suggestions mention skills the JD doesn't require | Suspicious |

**You should be able to answer:**
> "If a resume has Python and the JD requires Python, should Python appear in matched or missing skills?"
> "What is a 'sanity check' in testing?"

---

## WEEK 5 Skills — Bug Hunting

### Skill 5.1 — Systematic Bug Hunting

**Techniques:**
- Try things in the wrong order (e.g., click Analyze before uploading)
- Refresh the page mid-analysis
- Submit the same form twice quickly
- Open on mobile and check layout
- Try the entire flow from beginning to end without stopping

**You should be able to answer:**
> "What does 'trying to break the website' mean in testing?"
> "Why do we test on mobile separately?"

---

### Skill 5.2 — Writing a Bug Report

**A good bug report has:**
1. Bug number (Bug #1, Bug #2, etc.)
2. What you did (exact steps)
3. What you expected
4. What actually happened
5. How serious it is: Low / Medium / High
6. Screenshot (if possible)

**Severity guide:**
- **High** — feature completely broken (e.g., Analyze button crashes the page)
- **Medium** — feature partially broken or result is wrong (e.g., wrong skills in matched list)
- **Low** — visual/cosmetic issue (e.g., button is misaligned on mobile)

**You should be able to answer:**
> "What is a bug report?"
> "What is the difference between High and Low severity?"

---

## WEEK 6 Skills — Final Complete Testing

### Skill 6.1 — End-to-End Testing

**Understand:** End-to-end testing means testing the complete journey from start to finish.

**Full checklist (perform all of these):**

Website basics:
- Opens correctly
- Buttons visible and clickable
- Text readable

Resume upload:
- PDF works
- DOCX works
- JPG is rejected with an error

Job Description:
- Normal JD accepted
- Empty JD shows error

Analysis:
- Score appears
- Matched skills appear
- Missing skills appear
- Suggestions appear

Mobile:
- Page fits the screen
- Buttons tappable
- Results readable

**You should be able to answer:**
> "What is end-to-end testing?"
> "Walk me through all the tests you performed for the final report."

---

## Your Final Folder

```
docs/
└── testing/
    ├── test-cases.md
    ├── week2-report.md
    ├── week3-jd-report.md
    ├── week4-analysis-report.md
    ├── bug-report.md
    └── final-test-report.md
```

Add files week by week — don't create empty files ahead of time.
