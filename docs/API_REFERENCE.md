# API Reference — AI-Powered Resume Analyzer

> Documented by: Sujeet Kannaujiya (Research & Documentation Lead)  
> Principal Architect: Shivansh Mishra (Team Leader & Principal Architect)

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
Analyzes a resume against a target job description using either the **Multi-Provider AI Engine** (Google Gemini, OpenAI, or Anthropic Claude) or the **Deterministic Rule-Based Engine** (fallback mode), automatically enriched with ATS heuristics and taxonomy domains.

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

### 3. GET `/taxonomy/domains` (or `/api/taxonomy/domains`)
Returns all 12 cataloged technology domains, canonical skill counts, and alias mappings.

**Response (200 OK):**
```json
{
  "domains": [
    "ai_machine_learning",
    "backend_engineering",
    "cloud_infrastructure",
    "data_engineering_streaming",
    "databases_storage",
    "devops_cicd",
    "frontend_mobile",
    "security_compliance"
  ],
  "total_canonical_skills": 440,
  "total_synonyms": 79
}
```

---

### 4. POST `/taxonomy/categorize` (or `/api/taxonomy/categorize`)
Groups arbitrary skills into their respective domains and resolves industry synonyms (e.g., `k8s` → `Kubernetes`).

#### Request Body (`application/json`):
```json
{
  "skills": ["k8s", "FastAPI", "Postgres", "PyTorch", "Docker"]
}
```

**Response (200 OK):**
```json
{
  "categorized": {
    "backend_engineering": ["FastAPI"],
    "cloud_infrastructure": ["Kubernetes", "Docker"],
    "databases_storage": ["PostgreSQL"],
    "ai_machine_learning": ["PyTorch"]
  },
  "resolved_synonyms": {
    "k8s": "Kubernetes",
    "Postgres": "PostgreSQL"
  }
}
```

---

### 5. POST `/audit/ats` (or `/api/audit/ats`)
Evaluates raw resume text for ATS section integrity, action verb strength, and quantified achievements.

#### Request Body (`application/json`):
```json
{
  "resume_text": "Alex Mercer | alex@example.com\nEXPERIENCE:\n- Architected microservices boosting throughput by 45%.\nSKILLS: Python, FastAPI"
}
```

**Response (200 OK):**
```json
{
  "overall_score": 85,
  "section_health_score": 100,
  "verb_density_score": 75,
  "quantification_score": 90,
  "sections_detected": ["contact_info", "work_experience", "technical_skills"],
  "missing_sections": ["certifications", "projects"],
  "action_verbs_found": ["architected"],
  "verb_diversity_count": 1,
  "quantified_bullets_count": 1,
  "total_bullet_count": 1,
  "quantification_ratio": 100.0,
  "recommendations": [
    "Include cloud or industry certifications to validate technical credentials."
  ]
}
```

---

### 6. POST `/export/markdown`, `/export/json`, `/export/html`, `/export/pdf`
Exports candidate evaluations into executive multi-format documents stamped with **SHA-256 digital seals**.

- `POST /export/markdown`: Returns formatted Markdown with cryptographic verification block.
- `POST /export/json`: Returns canonical JSON conforming to `2.1.0-enterprise` audit schema.
- `POST /export/html`: Returns standalone styled HTML with `@media print` CSS.
- `POST /export/pdf`: Returns raw binary PDF bytes (`application/pdf`) with `X-Verification-Hash` response header.

---

### 7. POST `/interview/generate` (or `/api/interview/generate`)
Generates structured technical probing questions, architecture drills, and behavioral STAR prompts based on candidate skill gaps.

#### Request Body (`application/json`):
```json
{
  "matched_skills": ["Python", "FastAPI"],
  "missing_skills": ["Kubernetes", "Redis"],
  "score": 80
}
```

**Response (200 OK):**
```json
{
  "candidate_assessment": {
    "seniority_tier": "Senior Software Engineer",
    "matched_skills_count": 2,
    "missing_skills_count": 2,
    "overall_fit_score": 80
  },
  "total_questions": 8,
  "technical_questions": [
    {
      "skill": "Kubernetes",
      "category": "SkillGapProbe",
      "question": "Describe the architecture of Kubernetes control plane components...",
      "difficulty": "Lead",
      "rationale": "Candidate lacked 'Kubernetes' in initial audit.",
      "expected_answer_points": ["etcd state", "apiserver", "kubelet"]
    }
  ],
  "system_design_prompts": [...],
  "behavioral_prompts": [...]
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
