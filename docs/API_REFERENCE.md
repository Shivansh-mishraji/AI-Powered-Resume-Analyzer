# API Reference — AI-Powered Resume Analyzer

> Documented by: Sujeet Kannaujiya (Research & Documentation Lead)

- **Local Base URL:** `http://127.0.0.1:8000`
- **Cloud Production URL:** `https://resume-analyzer-api.onrender.com`
- **Live Frontend Web App:** `https://ai-powered-resume-analyzer-pi.vercel.app`

---

## Endpoints

### 1. GET `/health`
Health check endpoint to verify backend operational status and warm up serverless / free-tier containers.

**Response (200 OK):**
```json
{
  "status": "ok"
}
```

---

### 2. POST `/analyze`
Analyzes a resume against a target job description using either the **Multi-Provider AI Engine** (Google Gemini, OpenAI, or Anthropic Claude) or the **Deterministic Rule-Based Engine** (fallback mode).

#### Request Headers:
| Header | Type | Required | Description |
|---|---|---|---|
| `X-Gemini-API-Key` | string | ❌ Optional | Multi-Provider BYOK key. Auto-detects Google Gemini (`AQ.` or `AIza...`), OpenAI (`sk-...`), Anthropic Claude (`sk-ant-...`), or custom keys. |

#### Request Body (`multipart/form-data`):
| Field | Type | Required | Description |
|---|---|---|---|
| `resume` | File | ✅ Required | PDF or DOCX file (Max 5MB, max 10 pages). |
| `job_description` | string | ✅ Required | Target job description text (Max 5,000 characters). |

---

### Success Responses (200 OK)

#### Scenario A: AI-Powered Mode (Valid Key Provided)
```json
{
  "filename": "john_doe_resume.pdf",
  "score": 88,
  "is_ai_powered": true,
  "analysis_confidence": "high",
  "candidate_summary": "Strong backend developer with 3+ years of experience in Python, FastAPI, and PostgreSQL. Demonstrates relevant cloud deployment and containerization expertise.",
  "matched_skills": [
    "Python",
    "FastAPI",
    "Docker",
    "PostgreSQL",
    "REST APIs",
    "CI/CD"
  ],
  "missing_skills": [
    "Kubernetes",
    "Redis"
  ],
  "strengths": [
    "Direct hands-on experience architecting scalable REST APIs using FastAPI.",
    "Demonstrated database design and optimization with PostgreSQL.",
    "Active CI/CD automation experience matching job requirements."
  ],
  "weaknesses": [
    "No direct evidence of Kubernetes container orchestration found in resume.",
    "Lacks mentioned experience with Redis in-memory caching."
  ],
  "suggestions": [
    "Add a bullet point explaining your experience with container orchestration or Docker Compose.",
    "Highlight any caching strategies or performance optimizations implemented in your backend projects."
  ],
  "warnings": []
}
```

#### Scenario B: Fallback Mode (No Key / AI Unavailable)
```json
{
  "filename": "john_doe_resume.pdf",
  "score": 75,
  "is_ai_powered": false,
  "analysis_confidence": "not_applicable",
  "candidate_summary": "Analyzed using deterministic rule-based keyword matching engine.",
  "matched_skills": [
    "Docker",
    "Fastapi",
    "Python"
  ],
  "missing_skills": [
    "Kubernetes"
  ],
  "strengths": [],
  "weaknesses": [],
  "suggestions": [],
  "warnings": [
    "No Gemini API key provided. Ran deterministic rule-based analysis."
  ]
}
```

---

## Standard Error Codes

| Status Code | Error Message / Scenario | Reason |
|---|---|---|
| `400 Bad Request` | `Invalid file type. Only PDF and DOCX allowed.` | Uploaded file MIME type or extension is invalid. |
| `400 Bad Request` | `Job description cannot be empty.` | Job description text contains only whitespace. |
| `400 Bad Request` | `The uploaded document appears to be an image scan.` | PDF extractable text is under the minimum threshold (50 chars). |
| `413 Payload Too Large` | `File size exceeds the 5MB limit.` | Uploaded resume file is larger than 5,242,880 bytes. |
| `422 Unprocessable Entity` | `Validation error in request payload.` | Form data format is invalid or missing required keys. |
| `429 Too Many Requests` | `Gemini API rate limit reached.` | User's free-tier Gemini API key exceeded request quota. |
| `500 Internal Server Error` | `Unexpected server error occurred.` | Unhandled internal exception occurred. |

---

## Response Field Definitions

| Field | Type | Description |
|---|---|---|
| `filename` | string | Original filename of the uploaded resume. |
| `score` | integer | Contextual or set-based match score between 0 and 100. |
| `is_ai_powered` | boolean | `true` if processed by Google Gemini; `false` if rule-based fallback. |
| `analysis_confidence` | string | `high`, `medium`, `low` (for AI mode) or `not_applicable` (for fallback). |
| `candidate_summary` | string | 2-3 sentence overview of candidate profile and role alignment. |
| `matched_skills` | array of strings | Skills required by JD that the candidate possesses. |
| `missing_skills` | array of strings | Critical skills/qualifications required by JD absent from resume. |
| `strengths` | array of strings | Key competitive advantages for this specific role. |
| `weaknesses` | array of strings | Specific gaps or missing qualifications for this role. |
| `suggestions` | array of strings | Actionable resume optimization advice without hallucinating facts. |
| `warnings` | array of strings | Non-blocking alerts (e.g. text truncation, fallback trigger reason). |
