# AGENTS.md — Testing & QA
# Member: Vishal Patel
# GitHub Username: patelvishal-ji
# Git Author Name: Vishal Patel
# Git Email: patelvishal7800023@gmail.com
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

---

## Saturday Mentor Reporting (Vishal)

Every Saturday you send Shivansh your update so he can include it in the team report to the mentor. This section tells you exactly what to send and how to explain your testing work.

### Your weekly update format (send this to Shivansh every Friday evening)

```
Vishal — Week [N]

Tests performed this week: [number]
Tests passed: [number]
Tests failed: [number]

What I tested:
- [Brief description of each test area]

Bugs found:
- Bug #[X]: [One line description] — Severity: [High/Medium/Low]

Bugs fixed and retested:
- Bug #[X]: [Was fixed by Shivansh] — Retested: [PASS/FAIL]

What I'll test next week:
- [Brief plan]
```

---

### Week 1 Mentor Update

**What Vishal did:**
> "I studied the project flow to understand what the website is supposed to do. I created the initial test case list covering the basic user journey — opening the website, uploading a file, pasting a JD, clicking Analyze, and seeing results."

**Approach:**
> "Before testing anything, I first understood what the expected behavior should be for each feature. A test without a clear expected result is not useful — you can't tell if something passed or failed."

**What is in Git:**
> `docs/testing/test-cases.md` committed.

**Be ready if mentor asks:**
- "What is a test case?"
- "How many tests did you write?"
- "What does your test case cover?"

---

### Week 2 Mentor Update

**What Vishal did:**
> "I tested the resume upload feature with 8 different scenarios — valid PDF, valid DOCX, JPG, TXT, no file, very large file, empty document, and a renamed file. I documented each test with its expected and actual result."

**Approach:**
> "I tested both valid and invalid inputs. Testing only valid inputs is not enough — you need to try to break the feature with unexpected inputs to find edge cases."

**If a bug was found:**
> "I found that [describe bug]. I took a screenshot, wrote the bug report in bug-report.md, and reported it to Shivansh."

**Be ready if mentor asks:**
- "What is an edge case?"
- "What happened when you uploaded an invalid file?"
- "How did you report the bug?"

---

### Week 3 Mentor Update

**What Vishal did:**
> "I tested the job description input with 8 scenarios — normal JD, very long JD, very short JD, empty JD, random text, special characters, and a JD with specific skills like Python, FastAPI, Docker."

**Approach:**
> "I focused on what happens at the boundaries — what happens with too little input, too much input, or completely wrong input. These boundary conditions are where systems most commonly fail."

**Be ready if mentor asks:**
- "What is boundary testing?"
- "What happened when you left the JD empty?"

---

### Week 4 Mentor Update

**What Vishal did:**
> "I tested 5 complete analysis scenarios — strong match, weak match, partial match, wrong job role, and AI suggestion relevance. I checked whether the results made logical sense — not just whether they appeared."

**Approach:**
> "For this week's testing I focused on 'sanity checking' — does the result make sense? If a resume has Python and the JD requires Python, Python should appear in matched skills, not missing skills. This kind of logical verification is just as important as functional testing."

**Be ready if mentor asks:**
- "What is a sanity check?"
- "How did you verify the score was correct?"
- "What did you do with a completely unrelated resume and JD?"

---

### Week 5 Mentor Update

**What Vishal did:**
> "I performed bug hunting — intentionally trying unusual actions to find problems. I tried submitting with no inputs, refreshing mid-analysis, uploading oversized files, and testing on mobile. I updated the bug report with all findings."

**Approach:**
> "Bug hunting is different from normal testing. Instead of following the expected flow, I deliberately tried to do things a normal user might accidentally do. This finds bugs that structured test cases miss."

**Be ready if mentor asks:**
- "What bugs did you find?"
- "How did you test on mobile?"
- "What is the severity of the bugs you found?"

---

### Week 6 Mentor Update

**What Vishal did:**
> "I performed final end-to-end testing of the complete website, covering all major features — file upload, JD input, analysis results, and mobile view. I compiled the final test report with a summary of all tests performed across all weeks."

**Be ready if mentor asks:**
- "How many total tests were performed?"
- "What was the final pass rate?"
- "Are there any open bugs?"
- "Show me your final test report."

---

### General Tips for Mentor Meetings

1. **Bring your bug-report.md.** If the mentor asks "did you find any issues?", you should be able to show documented bugs.
2. **Demonstrate a test live.** Open the website and show the mentor what happens when you upload an invalid file.
3. **Know the difference between High and Low severity.** The mentor may ask you to prioritize.
4. **Testing is not just clicking.** Explain that you verified logical correctness too — not just that buttons work.

