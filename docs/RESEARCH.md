# Research Notes — AI-Powered Resume Analyzer

> Researched & Documented by: Sujeet (Research & Documentation)

---

## Why FastAPI over Flask or Django?

| Feature | FastAPI | Flask | Django |
|---|---|---|---|
| **Performance** | ⭐⭐⭐ (async) | ⭐⭐ (sync) | ⭐⭐ (sync) |
| **Auto Swagger Docs** | ✅ Built-in `/docs` | ❌ Needs extension | ❌ Needs extension |
| **Type Safety** | ✅ Pydantic validation | ❌ Manual | ⚠️ Partial |
| **Learning Curve** | Low | Very Low | High |
| **Best For** | APIs & ML services | Simple APIs | Full web apps |

**Decision:** FastAPI is the industry standard for Python AI/ML APIs due to its async support, automatic documentation, and built-in data validation.

---

## Why PyMuPDF for PDF Parsing?

Alternatives evaluated:

| Library | Speed | In-Memory Support | Accuracy | License |
|---|---|---|---|---|
| **PyMuPDF (fitz)** | ⭐⭐⭐ Very Fast | ✅ Yes | ⭐⭐⭐ Excellent | AGPL |
| pdfplumber | ⭐⭐ Medium | ✅ Yes | ⭐⭐⭐ Excellent | MIT |
| PyPDF2 | ⭐ Slow | ⚠️ Limited | ⭐⭐ Good | BSD |
| pdfminer | ⭐ Very Slow | ✅ Yes | ⭐⭐ Good | MIT |

**Decision:** PyMuPDF is the fastest and most accurate PDF text extractor. It processes binary streams in memory without writing temporary files to disk, which is critical for security and performance.

---

## Why React + Vite over Create React App?

| Feature | Vite | Create React App |
|---|---|---|
| **Dev Server Start** | ~300ms | ~10 seconds |
| **Hot Module Reload** | Instant | Several seconds |
| **Build Tool** | Rollup (ESM native) | Webpack |
| **Bundle Size** | Smaller | Larger |
| **Maintenance** | Actively maintained | Deprecated |

**Decision:** Vite is the modern standard for React development. Create React App is officially deprecated since 2023.

---

## Skill Extraction Approach

We evaluated two approaches:

### Approach 1: Machine Learning (NLP-based NER)
- Using `spaCy` Named Entity Recognition to detect skills
- **Pros:** Intelligent, can find new/unlisted skills
- **Cons:** Requires large model download (~500MB), slow inference, overkill for V1

### Approach 2: Keyword Matching (Our Choice)
- Maintain a curated dictionary of 50+ known tech skills
- Use regex with word boundaries to match exactly
- **Pros:** Fast (< 1ms), lightweight, predictable, easy to expand
- **Cons:** Can only find skills that are in the dictionary

**Decision:** Keyword matching for V1. NLP-based extraction is planned for V2 after we have enough user data to justify the complexity.

---

## Scoring Algorithm

The match score is calculated using **Set Intersection**:

```
score = |resume_skills ∩ jd_skills| / |jd_skills| × 100
```

- `resume_skills ∩ jd_skills` = skills present in BOTH (matched skills)
- `|jd_skills|` = total skills required by the job description
- Result is a 0–100 percentage

**Example:**
- JD requires: Python, FastAPI, Docker, Kubernetes (4 skills)
- Resume has: Python, FastAPI, Docker, SQL (4 skills)
- Matched: Python, FastAPI, Docker (3 skills)
- Score = 3/4 × 100 = **75.0%**

---

## Future Improvements (V2 Roadmap)

1. **AI-powered skill extraction** using spaCy or HuggingFace transformers
2. **Gemini API integration** for generating personalized improvement suggestions
3. **Resume scoring by section** (education, experience, projects separately)
4. **PDF report generation** with detailed analysis
5. **User authentication** and history tracking
