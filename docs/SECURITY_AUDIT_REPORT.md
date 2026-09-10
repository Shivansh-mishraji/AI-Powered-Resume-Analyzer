# Security Architecture & OWASP Compliance Forensic Audit

**Document Reference:** `SEC-AUDIT-2026-FINAL`  
**Author:** Sujeet Kannaujiya (`sujeet-official`)  
**Role:** Research Lead • Technical Documentation  
**Project:** AI-Powered Resume Analyzer  

---

## 1. Threat Profile & Security Posture
The **AI-Powered Resume Analyzer** processes sensitive personal documents (CVs, resumes, employment histories) and facilitates third-party LLM inference. To safeguard candidate privacy and comply with data sovereignty regulations, the architecture enforces a **Strict Zero-Disk In-Memory Processing Model**.

---

## 2. OWASP API Security Top 10 Evaluation

| OWASP Vulnerability | Risk Assessment | Implemented Defense Mechanism |
|---|---|---|
| **API1: Broken Object Level Auth** | LOW | Analysis routes process requests ephemerally; no user state or historical document IDs are stored |
| **API2: Broken Authentication** | LOW | Endpoints utilize optional client-provided BYOK headers (`X-Gemini-API-Key`) validated directly against provider endpoints |
| **API3: Broken Object Property Level Auth** | LOW | Strict Pydantic response models (`AnalysisResult`) filter internal fields and prevent data leakage |
| **API4: Unrestricted Resource Consumption** | MEDIUM | Enforced 5MB file upload limit (`MAX_FILE_SIZE_BYTES`) and character ceiling (`MAX_RESUME_CHARS=15000`) |
| **API5: Broken Function Level Auth** | LOW | No administrative escalation paths; stateless operational model |
| **API6: Unrestricted Access to Sensitive Business Flows** | LOW | Client-side debouncing and server-side rate-limit exception handling (`HTTP 429`) |
| **API7: Server-Side Request Forgery (SSRF)** | LOW | Document uploads accept direct binary multipart payloads; no URL-fetching or remote file retrieval |
| **API8: Security Misconfiguration** | LOW | CORS strictly constrained to whitelisted production domains (Vercel, Localhost) via `CORSMiddleware` |
| **API9: Improper Inventory Management** | LOW | Centralized FastAPI OpenAPI `/docs` and structured versioning (`v2.1.0`) |
| **API10: Unsafe Consumption of APIs** | LOW | Multi-tier exception wrappers (`GeminiAuthError`, `GeminiRateLimitError`, `GeminiServiceError`) preventing raw trace leaks |

---

## 3. Zero-Disk Memory Forensics
1. **Volatile Buffer Decoding:** When a PDF or DOCX file is uploaded via `POST /analyze`, bytes are read directly into Python memory buffers via `await file.read()`.
2. **Immediate Garbage Collection:** PyMuPDF instances are closed via `doc.close()`, returning allocated memory to the Python runtime.
3. **No File System Footprint:** Zero temporary files are written to `/tmp` or local disks, eliminating data recovery risks on shared cloud containers.

---

**Audited & Authored by:**  
**Sujeet Kannaujiya**  
*Research Lead • Technical Documentation*
