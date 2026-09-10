from fastapi import FastAPI, UploadFile, File, Form, Header, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from app.config import (
    ALLOWED_MIME_TYPES,
    ALLOWED_CORS_ORIGINS,
    MAX_FILE_SIZE_BYTES
)
from app.schemas.analysis_schema import (
    AnalysisResult,
    AtsAuditRequest,
    CategorizeSkillsRequest,
    ExportRequest,
    InterviewKitRequest
)
from app.services.resume_parser import extract_text_from_pdf, extract_text_from_docx
from app.services.analysis_service import analyze_resume_content
from app.services.ai_service import GeminiAuthError, GeminiRateLimitError
from app.services.ats_audit_service import get_ats_audit_service
from app.services.taxonomy_service import get_taxonomy_service
from app.services.report_exporter import get_report_exporter
from app.services.interview_generator import get_interview_generator

app = FastAPI(
    title="AI-Powered Resume Analyzer",
    description="Hybrid AI and Deterministic Resume & Job Description Semantic Analyzer with Deep ATS Diagnostics",
    version="2.1.0"
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*", "X-Gemini-API-Key"],
)

@app.get("/health")
def health_check():
    """Health check endpoint to verify backend operational status."""
    return {"status": "ok"}

@app.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...)):
    """Extracts raw text from an uploaded resume file in memory."""
    if file.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file.content_type}'. Only PDF and DOCX files are allowed."
        )

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="Uploaded file exceeds the maximum allowed size of 5 MB."
        )

    try:
        if file.content_type == "application/pdf":
            extracted_text = extract_text_from_pdf(file_bytes)
        else:
            extracted_text = extract_text_from_docx(file_bytes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    return {
        "filename": file.filename,
        "file_type": file.content_type,
        "text_length": len(extracted_text),
        "preview": extracted_text[:200]
    }

@app.post("/analyze", response_model=AnalysisResult)
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    x_gemini_api_key: Optional[str] = Header(None, alias="X-Gemini-API-Key")
):
    """
    Analyzes an uploaded resume against a job description.
    Uses Gemini AI if X-Gemini-API-Key is provided, with graceful fallback to rule-based engine.
    Returns composite match score, ATS heuristic diagnostics, and domain breakdown.
    """
    if resume.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Only PDF and DOCX documents are allowed."
        )

    if not job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty."
        )

    file_bytes = await resume.read()
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=413,
            detail="Uploaded file exceeds the maximum allowed size of 5 MB."
        )

    try:
        if resume.content_type == "application/pdf":
            resume_text = extract_text_from_pdf(file_bytes)
        else:
            resume_text = extract_text_from_docx(file_bytes)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    try:
        result = analyze_resume_content(
            resume_text=resume_text,
            job_description=job_description,
            api_key=x_gemini_api_key,
            filename=resume.filename or "resume.pdf"
        )
        return result
    except GeminiAuthError as e:
        raise HTTPException(status_code=401, detail=str(e))
    except GeminiRateLimitError as e:
        raise HTTPException(status_code=429, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis processing error: {str(e)}")


# -----------------------------------------------------------------------------
# Module 1: Enterprise Skills Taxonomy Endpoints
# -----------------------------------------------------------------------------
@app.get("/taxonomy/domains")
@app.get("/api/taxonomy/domains")
def get_taxonomy_domains():
    """Returns list of all cataloged engineering domains and skill count."""
    taxonomy = get_taxonomy_service()
    return {
        "domains": taxonomy.get_all_domains(),
        "total_canonical_skills": len(taxonomy._canonical_skills),
        "total_synonyms": len(taxonomy.synonyms)
    }


@app.post("/taxonomy/categorize")
@app.post("/api/taxonomy/categorize")
def categorize_skills_endpoint(req: CategorizeSkillsRequest):
    """Categorizes input skills across engineering domains and resolves synonyms."""
    taxonomy = get_taxonomy_service()
    categorized = taxonomy.categorize_skills(req.skills)
    resolved = {s: taxonomy.resolve_synonym(s) for s in req.skills}
    return {
        "categorized": categorized,
        "resolved_synonyms": resolved
    }


# -----------------------------------------------------------------------------
# Module 2: Deep ATS Heuristic & Quantification Endpoints
# -----------------------------------------------------------------------------
@app.post("/audit/ats")
@app.post("/api/audit/ats")
def audit_ats_endpoint(req: AtsAuditRequest):
    """Audits raw resume text for ATS parseability, section headers, and metric quantification."""
    service = get_ats_audit_service()
    result = service.audit_resume(req.resume_text)
    return result.to_dict()


# -----------------------------------------------------------------------------
# Module 3: Executive Report Exporter Endpoints (Markdown, JSON, HTML, PDF)
# -----------------------------------------------------------------------------
@app.post("/export/markdown")
@app.post("/api/export/markdown")
def export_markdown_endpoint(req: ExportRequest):
    """Generates an executive Markdown audit report with cryptographic SHA-256 seal."""
    exporter = get_report_exporter()
    md_content = exporter.export_to_markdown(req.analysis, req.ats_audit)
    v_hash = exporter.generate_verification_hash(req.analysis)
    return {
        "markdown": md_content,
        "verification_hash": v_hash,
        "status": "success"
    }


@app.post("/export/json")
@app.post("/api/export/json")
def export_json_endpoint(req: ExportRequest):
    """Generates structured canonical JSON audit with verification block."""
    exporter = get_report_exporter()
    return exporter.export_to_json(req.analysis, req.ats_audit)


@app.post("/export/html")
@app.post("/api/export/html")
def export_html_endpoint(req: ExportRequest):
    """Generates standalone printable HTML report."""
    exporter = get_report_exporter()
    html_content = exporter.export_to_html(req.analysis, req.ats_audit)
    v_hash = exporter.generate_verification_hash(req.analysis)
    return {
        "html": html_content,
        "verification_hash": v_hash,
        "status": "success"
    }


@app.post("/export/pdf")
@app.post("/api/export/pdf")
def export_pdf_endpoint(req: ExportRequest):
    """Generates a publication-grade PDF audit document with PyMuPDF."""
    exporter = get_report_exporter()
    pdf_bytes = exporter.export_to_pdf(req.analysis, req.ats_audit)
    v_hash = exporter.generate_verification_hash(req.analysis)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=resume_audit_report.pdf",
            "X-Verification-Hash": v_hash
        }
    )


# -----------------------------------------------------------------------------
# Module 4: Candidate Interview Question Generator Endpoints
# -----------------------------------------------------------------------------
@app.post("/interview/generate")
@app.post("/api/interview/generate")
def generate_interview_kit_endpoint(req: InterviewKitRequest):
    """Generates targeted technical interview questions and behavioral prompts."""
    generator = get_interview_generator()
    kit = generator.generate_interview_kit(
        matched_skills=req.matched_skills,
        missing_skills=req.missing_skills,
        weaknesses=req.weaknesses,
        score=req.score
    )
    return kit
