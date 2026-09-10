# QA Security Vulnerability & Boundary Assessment Matrix

**Document ID:** `QA-SEC-AUDIT-2026-09`  
**Lead Auditor:** Vishal Patel (`patelvishal-ji`)  
**Component:** Backend REST Gateway, Document Ingestion, and AI Pipelines  

---

## 1. Threat Modeling Overview

| Threat Category | Potential Risk | Mitigation Mechanism | Verification Test | Status |
|---|---|---|---|:---:|
| **XSS (Cross-Site Scripting)** | Malicious HTML/JS embedded in resume text | Clean text sanitization regex strips all HTML tags and attributes | `test_xss_script_injection_sanitization` | **PASS** |
| **SQL Injection** | SQL statements inside resume or job description | Fully in-memory computation; no raw SQL persistence layer | `test_sql_injection_payload_handling` | **PASS** |
| **Prompt Injection** | Candidate text attempting to hijack AI evaluation | In-memory sandbox, strict JSON schema output contracts, fallback isolation | `test_prompt_injection_isolation` | **PASS** |
| **Buffer Overflow / DoS** | Massive documents causing server memory crash | Strict 5MB file size limit + character cutoff boundaries (`MAX_RESUME_CHARS=15000`) | `test_excessive_token_length_truncation_safety` | **PASS** |
| **Path Traversal** | Document export writing to arbitrary server paths | Pure in-memory streaming via `io.BytesIO` and `Response(content=...)`; zero disk writes | `test_path_traversal_filename_sanitization` | **PASS** |
| **API Key Hijacking** | Leaked Gemini API keys via server logging | Ephemeral headers (`X-Gemini-API-Key`), zero-disk storage, sanitized telemetry logs | `test_ai_service.py` | **PASS** |

---

## 2. Document Parsing Safety Analysis
- **Zero-Disk Forensic Model**: All uploaded PDF and DOCX documents are decoded directly in memory buffers. No temporary files (`/tmp/`) are created on the host filesystem.
- **PyMuPDF In-Memory Safety**: `pymupdf.open(stream=file_bytes, filetype="pdf")` operates on memory arrays, closing and freeing buffers immediately upon text extraction.
- **Malformed PDF Resilience**: Tested against corrupted headers, zero-byte streams, and encrypted PDFs. Appropriate HTTP 400 Bad Request responses are returned with clear error messages.

---

## 3. Cryptographic Immutability Validation
- Executive reports utilize SHA-256 digital digests generated over the canonical JSON payload (`hashlib.sha256`).
- Output verification tests confirm that tampering with a single character in the candidate score or skills matrix alters the resultant cryptographic digest.

**Verified by:**  
**Vishal Patel**  
*QA Lead • Security & Automated Testing*
