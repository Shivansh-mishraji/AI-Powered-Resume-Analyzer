# API Reference — AI-Powered Resume Analyzer

Base URL (Local): `http://127.0.0.1:8000`

---

## Endpoints

### `GET /health`

Check if the backend server is running.

**Request**
```bash
curl http://127.0.0.1:8000/health
```

**Response `200 OK`**
```json
{
  "status": "ok",
  "timestamp": "2026-09-03T20:00:00.000Z"
}
```

---

### `POST /analyze`

Submit a resume and job description for full AI-powered analysis.

**Request Headers**

| Header | Required | Description |
|--------|----------|-------------|
| `Content-Type` | Yes | `multipart/form-data` |
| `X-Gemini-API-Key` | No | Your Google Gemini API key. If omitted, rule-based fallback is used |

**Request Body (multipart/form-data)**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | Resume file — PDF or DOCX, max 5MB |
| `job_description` | string | Yes | Full job description text |

**Example Request**
```bash
curl -X POST http://127.0.0.1:8000/analyze \
  -H "X-Gemini-API-Key: YOUR_GEMINI_KEY" \
  -F "file=@resume.pdf" \
  -F "job_description=We are looking for a Python developer with FastAPI and SQL experience..."
```

**Response `200 OK` — AI Mode**
```json
{
  "score": 87,
  "mode": "ai",
  "matched_skills": ["Python", "FastAPI", "SQL", "React", "Docker"],
  "missing_skills": ["Kubernetes", "Go"],
  "rubric_scores": {
    "skills_match": 90,
    "experience_relevance": 85,
    "education_fit": 80,
    "communication_clarity": 88,
    "achievement_quantification": 75,
    "industry_keywords": 92,
    "career_progression": 87
  },
  "insights": {
    "strengths": [
      "Strong backend skills with Python and FastAPI",
      "Solid database experience with SQL"
    ],
    "gaps": [
      "Missing container orchestration skills (Kubernetes)",
      "No Go language experience mentioned"
    ],
    "recommendations": [
      "Add Kubernetes certification or project to your resume",
      "Quantify achievements with metrics (e.g., reduced load time by 30%)"
    ]
  }
}
```

**Response `200 OK` — Rule-Based Fallback Mode**
```json
{
  "score": 72,
  "mode": "rule-based",
  "matched_skills": ["Python", "FastAPI", "SQL"],
  "missing_skills": ["Kubernetes", "Go", "React", "Docker"],
  "rubric_scores": null,
  "insights": {
    "strengths": [],
    "gaps": [],
    "recommendations": []
  }
}
```

---

## Error Responses

| Status Code | Meaning | When It Happens |
|-------------|---------|-----------------|
| `400` | Bad Request | File is corrupted, unreadable, or scanned-only PDF with no text |
| `401` | Unauthorized | Provided Gemini API key is invalid or expired |
| `413` | Payload Too Large | Uploaded file exceeds 5MB size limit |
| `422` | Unprocessable Entity | Missing required fields (no file or no job description) |
| `429` | Too Many Requests | Gemini API rate limit exceeded — system retries, then falls back |
| `500` | Internal Server Error | Unexpected server-side error |

**Example Error Response**
```json
{
  "detail": "File type not supported. Please upload a PDF or DOCX file."
}
```

---

## Notes

- **BYOK**: The `X-Gemini-API-Key` header is used per-request and never stored server-side.
- **Fallback**: If the key is missing, invalid, or Gemini returns `429/5xx`, the system automatically falls back to rule-based scoring.
- **Text Limit**: Resume text is truncated to 15,000 characters before sending to Gemini to prevent token overflow.
- **File Privacy**: Uploaded files are processed entirely in RAM and never saved to disk.
