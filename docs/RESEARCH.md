# Research & Technical Decisions — AI-Powered Resume Analyzer

> Researched & Documented by: Sujeet Kannaujiya (Research & Documentation Lead)

- **Live Application:** [https://ai-powered-resume-analyzer-pi.vercel.app](https://ai-powered-resume-analyzer-pi.vercel.app)
- **Live Backend API:** [https://resume-analyzer-api.onrender.com](https://resume-analyzer-api.onrender.com)

---

## 1. Why Google Gemini for Semantic Analysis?

We evaluated multiple LLM and NLP options for the primary intelligence engine:

| Approach | Contextual Reasoning | Structured Output Support | Latency | Infrastructure Cost |
|---|---|---|---|---|
| **Google Gemini (Flash)** | ⭐⭐⭐ High | ✅ Built-in Pydantic JSON schema | ~1.0 – 2.0s | $0 (Free Tier / BYOK) |
| OpenAI GPT-4o-mini | ⭐⭐⭐ High | ✅ Structured Outputs | ~1.5 – 2.5s | Pay-per-token required |
| Local LLM (Llama 3 / Ollama) | ⭐⭐ Medium | ⚠️ Inconsistent JSON parsing | ~5 – 15s | High RAM/GPU requirement |
| Traditional NLP (spaCy NER) | ⭐ Low | ❌ Unstructured entities | < 500ms | CPU only |

### Key Findings:
1. **Dynamic Skill Extraction:** Gemini extracts unlisted and emerging technologies dynamically without relying on a static 50-word dictionary.
2. **Semantic Equivalence:** Understands technical relationships (e.g. *AWS ECS + Terraform* fulfills *Container Orchestration & Infrastructure as Code*).
3. **Structured Outputs:** Gemini's official `google-genai` SDK supports strict JSON schema mapping via Pydantic (`response_schema=AnalysisResult`), ensuring consistent response structures.

---

## 2. Why Not a 5-Agent Multi-Agent Swarm?

During architectural planning, a Multi-Agent Swarm (Agent 1: Extract, Agent 2: Match, Agent 3: Audit, Agent 4: Rewrite, Agent 5: Prep) was evaluated.

### Trade-Off Analysis:

```
[Multi-Agent Swarm (Rejected)]
Request ──> Agent 1 ──> Agent 2 ──> Agent 3 ──> Agent 4 ──> Agent 5 ──> Response
Latency: 8–15 seconds | Failure Points: 5 sequential network hops | Token Cost: 5x

[Single Unified AI Pipeline (Selected)]
Request ──> Structured Gemini Call (Rubric-Grounded Prompt) ──> Unified Pydantic Response
Latency: ~1.5 seconds | Failure Points: 1 hop with 1 retry | Token Cost: 1x
```

**Decision:** A single, well-prompted Gemini call with structured JSON schema output provides identical analytical depth with significantly lower latency, lower token overhead, and greater reliability.

---

## 3. Why the BYOK (Bring Your Own Key) Model?

1. **Zero Database & Zero Credential Storage:** Eliminates the need to build and maintain user authentication systems, password hashing, and database encryption.
2. **Privacy Preservation:** The API key is stored only in React component memory for the current browser session and is discarded immediately after request processing.
3. **Sustainability:** Eliminates API hosting costs for the project maintainer while allowing any user to test the application using their personal Google AI Studio free-tier quota.

---

## 4. Why Preserve the Deterministic Rule-Based Fallback?

No cloud AI API is immune to transient network outages, invalid user keys, or rate limits (HTTP 429). 

Preserving our 39-test-verified **Regex Keyword Extractor & Set-Intersection Calculator** guarantees that:
* The application **never crashes or returns a dead screen**.
* If AI analysis is unavailable, the user receives an honest, transparent rule-based match score accompanied by an explanatory warning in the response payload.

---

## 5. Technical Limits & Boundary Decisions

To protect the server from memory bloat and malicious payloads, the following constraints are enforced:

| Parameter | Limit | Rationale |
|---|---|---|
| `MAX_FILE_SIZE_BYTES` | `5 MB` | Ample for any standard PDF/DOCX resume while preventing RAM exhaustion. |
| `MAX_PDF_PAGES` | `10 Pages` | Rejects multi-volume thesis documents; typical resumes are 1–3 pages. |
| `MIN_EXTRACTED_CHARS` | `50 Chars` | Detects scanned image PDFs that contain no selectable text layer. |
| `MAX_RESUME_CHARS` | `15,000 Chars` | Bounds the LLM prompt payload; resumes exceeding this are truncated with a warning. |
| `MAX_JD_CHARS` | `5,000 Chars` | Prevents overly long job description submissions. |
