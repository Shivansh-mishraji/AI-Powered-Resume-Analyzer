# API Reference — AI-Powered Resume Analyzer

> Documented by: Sujeet (Research & Documentation)

Base URL: `http://127.0.0.1:8000`

---

## Endpoints

### GET `/health`
Health check to verify the server is running.

**Response:**
```json
{ "status": "ok" }
```

---

### POST `/resume/upload`
Uploads a resume file and extracts raw text from it.

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | ✅ | PDF or DOCX resume file |

**Success Response (200):**
```json
{
  "filename": "shivansh_resume.pdf",
  "file_type": "application/pdf",
  "text_length": 2450,
  "preview": "Shivansh Mishra | Backend Developer | Python, FastAPI..."
}
```

**Error Responses:**

| Code | Reason |
|---|---|
| `400` | Invalid file type (not PDF or DOCX) |
| `400` | No readable text found in file |

---

### POST `/analyze`
Analyzes a resume against a job description and returns a skill match score.

**Request:** `multipart/form-data`

| Field | Type | Required | Description |
|---|---|---|---|
| `resume` | File | ✅ | PDF or DOCX resume file |
| `job_description` | string | ✅ | Raw job description text |

**Success Response (200):**
```json
{
  "filename": "shivansh_resume.pdf",
  "resume_skills": ["Docker", "Fastapi", "Git", "Python"],
  "jd_skills": ["Docker", "Fastapi", "Kubernetes", "Python"],
  "score": 75.0,
  "matched_skills": ["Docker", "Fastapi", "Python"],
  "missing_skills": ["Kubernetes"],
  "total_jd_skills": 4
}
```

**Error Responses:**

| Code | Reason |
|---|---|
| `400` | Invalid file type |
| `400` | Empty job description |
| `400` | Could not extract text from resume |

---

## Response Fields Explained

| Field | Type | Description |
|---|---|---|
| `score` | float | Match percentage (0–100). Higher = better fit. |
| `matched_skills` | list | Skills present in BOTH the resume AND the JD |
| `missing_skills` | list | Skills required by JD but ABSENT from the resume |
| `total_jd_skills` | int | Total number of skills detected in the JD |

---

## Allowed File Types

| MIME Type | Extension |
|---|---|
| `application/pdf` | `.pdf` |
| `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | `.docx` |
