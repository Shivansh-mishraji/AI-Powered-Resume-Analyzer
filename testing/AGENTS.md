# AGENTS.md — Testing & QA
# Member: Vishal
# Role: Testing & Quality Checking
# Project: AI-Powered Resume & Job Description Analyzer

---

## Your Responsibilities

**You own all testing and quality reporting.**

| What you own | What you do NOT own |
|---|---|
| Test plans for each week | Backend code |
| Manual test execution | Frontend code |
| Bug reports | Deciding what the score formula is |
| Retest after Shivansh fixes a bug | Writing automated test scripts |
| Final test report | Architecture decisions |

---

## Your Core Rule

> Find → Record → Report → Retest after fix.

You don't fix bugs yourself. You find them, write them down clearly, and tell Shivansh.
You don't test features that don't exist yet. Test what is actually built in the current week.

---

## Week 1 — Understand the Project + Basic Test List

### Goal
Understand the website, write a basic list of test cases.

### What to produce

**File:** `docs/testing/test-cases.md`

Write around 10 simple test cases covering the basic flow.

**Template to fill:**

| # | Test Name | What to Do | Expected Result |
|---|---|---|---|
| 1 | Open website | Navigate to URL | Page loads without errors |
| 2 | Upload PDF resume | Select a .pdf file | File accepted |
| 3 | Upload DOCX resume | Select a .docx file | File accepted |
| 4 | Upload JPG | Select a .jpg file | File rejected with error |
| 5 | Upload TXT | Select a .txt file | File rejected with error |
| 6 | Leave resume empty | Don't select file, click Analyze | Error shown |
| 7 | Paste JD | Type text in JD field | Text accepted |
| 8 | Leave JD empty | Click Analyze with empty JD | Error shown |
| 9 | Click Analyze | With valid inputs | Analysis starts |
| 10 | Complete analysis | Wait for results | Results page appears |

### Commit

```
docs: add initial test case list
```

### End-of-week checkpoint

- [ ] `test-cases.md` created with at least 10 test cases
- [ ] You understand the basic project flow
- [ ] You can answer: "What does this website do?"

### Saturday update to Shivansh

```
Vishal — Week 1

Tests performed: None yet (website not ready)
Completed: Created initial test case list (test-cases.md)
Next week: Resume upload testing
```

---

## Week 2 — Test Resume Upload

### Goal
Test every scenario for the resume upload feature. Report everything.

### Tests to perform (Harshwardhan or Shivansh will tell you when upload is ready)

| # | Test | What to do | Expected |
|---|---|---|---|
| 1 | Valid PDF | Upload a normal .pdf resume | Accepted |
| 2 | Valid DOCX | Upload a normal .docx resume | Accepted |
| 3 | JPG image | Upload a .jpg file | Rejected with clear error |
| 4 | PNG image | Upload a .png file | Rejected with clear error |
| 5 | TXT file | Upload a .txt file | Rejected with clear error |
| 6 | No file selected | Click Analyze without selecting file | Error shown |
| 7 | Very large file (5MB+) | Upload a large PDF | Either accepted or clear error |
| 8 | Empty PDF | Upload a blank PDF | Handled — no crash |

### What to produce

**File:** `docs/testing/week2-report.md`

For each test, use this format:

```
Test: Upload PDF

What I did:
Selected a PDF resume file using the file input.

Expected:
File should be accepted.

Actual:
File was accepted.

Status: PASS
```

If FAIL:
```
Test: Upload JPG

What I did:
Selected a .jpg file using the file input.

Expected:
System should reject the file with an error message.

Actual:
File was accepted without any error.

Status: FAIL

Problem:
Invalid file type was accepted. The system should have rejected it.

How serious: HIGH

Screenshot: [attached]
```

### Commit

```
docs: add week 2 resume upload test report
```

### End-of-week checkpoint

- [ ] At least 8 tests performed
- [ ] Report written with PASS/FAIL for each test
- [ ] Any failures reported to Shivansh immediately

### Saturday update to Shivansh

```
Vishal — Week 2

Tests performed: 8 (resume upload tests)
Tests passed: [number]
Tests failed: [number]
Bugs found: [describe briefly]
Next week: Job Description testing
```

---

## Week 3 — Test Job Description Input

### Goal
Test the job description text area for all scenarios.

### Tests to perform

| # | Test | What to do | Expected |
|---|---|---|---|
| 1 | Normal JD | Paste a real Software Engineer JD | Accepted |
| 2 | Python Developer JD | Paste a Python-focused JD | Accepted |
| 3 | Very long JD | Paste 500+ word JD | System handles it |
| 4 | Very short JD | Paste 5 words | System handles it |
| 5 | Empty JD | Click Analyze with empty JD | Error shown, not crash |
| 6 | Random text | Paste "hello this is random text" | Low score, no crash |
| 7 | Special characters | Paste text with !@#$%^&*() | No crash |
| 8 | JD with specific skills | Paste JD with Python, FastAPI, Docker | Check if those appear in results |

### What to produce

**File:** `docs/testing/week3-jd-report.md`

Same format as Week 2 report.

### Commit

```
docs: add week 3 job description test report
```

### Saturday update to Shivansh

```
Vishal — Week 3

Tests performed: 8 (JD input tests)
Tests passed: [number]
Tests failed: [number]
Bugs found: [describe]
Next week: Analysis results testing
```

---

## Week 4 — Test Analysis Results

### Goal
Check whether the output makes logical sense, not just whether it appears.

### Test scenarios

**Scenario 1 — Strong match**

Resume contains: Python, FastAPI, SQL, Git, REST APIs
JD requires: Python, FastAPI, SQL, REST APIs

Expected:
- High score (above 75)
- Python, FastAPI, SQL, REST APIs in "matched"
- Little or nothing in "missing"

---

**Scenario 2 — Weak match**

Resume contains: HTML, CSS, JavaScript
JD requires: Python, FastAPI, Docker, AWS, SQL

Expected:
- Low score (below 30)
- Nothing or very little in "matched"
- Python, FastAPI, Docker, AWS, SQL all in "missing"

---

**Scenario 3 — Partial match**

Resume contains: Python, FastAPI, SQL
JD requires: Python, FastAPI, SQL, Docker, AWS

Expected:
- Medium score
- Python, FastAPI, SQL in "matched"
- Docker, AWS in "missing"

---

**Scenario 4 — Wrong job role**

Use a Data Analyst JD with a Backend Developer resume.

Expected:
- Low match score
- Missing skills related to data analysis

---

**Scenario 5 — AI suggestions check**

If missing skills are Docker and AWS, do the AI suggestions mention learning Docker or AWS?

Expected: YES — suggestions should relate to the actual missing skills.

---

### What to produce

**File:** `docs/testing/week4-analysis-report.md`

For each scenario, document:
- What resume you used (describe it briefly)
- What JD you used (describe it briefly)
- Score you got
- Matched skills you got
- Missing skills you got
- Whether AI suggestions made sense

### Commit

```
docs: add week 4 analysis results test report
```

### Saturday update to Shivansh

```
Vishal — Week 4

Scenarios tested: 5
Results correct: [number]
Issues found: [describe any wrong results]
Next week: Bug hunting + edge cases
```

---

## Week 5 — Bug Hunting

### Goal
Intentionally try unusual things to find bugs. Update the bug report.

### Things to try

| Action | Expected behavior |
|---|---|
| No resume + No JD → Analyze | Error, not crash |
| Resume only, no JD → Analyze | Error, not crash |
| JD only, no resume → Analyze | Error, not crash |
| Very large resume (5MB+) | Error or warning, not crash |
| Very long JD (2000+ words) | Results still appear |
| Wrong file type | Clear rejection |
| Click Analyze multiple times quickly | Only one analysis runs |
| Refresh page during analysis | Handles gracefully |
| Open on mobile | Page fits, buttons work |

### What to produce

**File:** `docs/testing/bug-report.md`

Format for each bug:

```
Bug #[number]

What I did:
[Exact steps you took]

Expected:
[What should have happened]

Actual:
[What actually happened]

How serious: Low / Medium / High

Screenshot: [attach if possible]
```

**Severity guide:**
- **High** — feature completely broken or crashes the app
- **Medium** — result is wrong or feature is partially broken
- **Low** — visual/cosmetic problem (text cut off, button misaligned)

### Commit

```
docs: add bug report from week 5 testing
```

### Saturday update to Shivansh

```
Vishal — Week 5

Bugs found: [number and brief description]
Severity breakdown: High: X, Medium: Y, Low: Z
Anything fixed and retested: [describe]
Next week: Final complete testing
```

---

## Week 6 — Final Test Report

### Goal
Test the complete website from start to finish. Document everything.

### Complete checklist to perform

**Website:**
- [ ] Opens correctly
- [ ] Buttons visible and clickable
- [ ] Text readable on desktop

**Resume:**
- [ ] PDF works
- [ ] DOCX works
- [ ] JPG rejected with error message

**JD:**
- [ ] Normal JD processed correctly
- [ ] Empty JD shows error

**Analysis:**
- [ ] Score appears and is a number
- [ ] Matched skills appear as a list
- [ ] Missing skills appear as a list
- [ ] AI suggestions appear as text

**Mobile (open on your phone):**
- [ ] Page fits screen
- [ ] Buttons are tappable
- [ ] Results are readable

### What to produce

**File:** `docs/testing/final-test-report.md`

Structure:

```markdown
# Final Test Report

## Summary
Total tests performed: [number]
Tests passed: [number]
Tests failed: [number]
Open bugs: [number]

## Website Tests
...

## Upload Tests
...

## JD Tests
...

## Analysis Tests
...

## Mobile Tests
...

## Known Issues
...

## Conclusion
[Overall assessment of the project quality]
```

### Commit

```
docs: add final test report
```

---

## Your Folder Structure

```
docs/
└── testing/
    ├── test-cases.md         <- Week 1
    ├── week2-report.md       <- Week 2
    ├── week3-jd-report.md    <- Week 3
    ├── week4-analysis-report.md  <- Week 4
    ├── bug-report.md         <- Week 5 (updated throughout)
    └── final-test-report.md  <- Week 6
```

---

## Six-Week Summary

| Week | Work | Difficulty |
|---|---|---|
| 1 | Create 10+ basic test cases | Very Easy |
| 2 | Test resume upload (8+ tests + report) | Very Easy |
| 3 | Test JD input (8+ tests + report) | Very Easy |
| 4 | Test analysis results (5 scenarios) | Easy |
| 5 | Bug hunting + bug report | Easy |
| 6 | Final complete test report | Easy |

---

## Very Important

You don't need to find 100 bugs.

If everything works, your report of all PASS tests is just as valuable as finding bugs — it proves the system was tested properly.

If you find a bug: FAIL → screenshot → report it to Shivansh.

Do NOT try to fix the code yourself.
