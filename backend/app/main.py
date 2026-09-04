from fastapi import FastAPI, UploadFile, File, Form, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from app.config import (
    ALLOWED_MIME_TYPES,
    ALLOWED_CORS_ORIGINS,
    MAX_FILE_SIZE_BYTES
)
from app.schemas.analysis_schema import AnalysisResult
from app.services.resume_parser import extract_text_from_pdf, extract_text_from_docx
from app.services.analysis_service import analyze_resume_content
from app.services.ai_service import GeminiAuthError, GeminiRateLimitError

app = FastAPI(
    title="AI-Powered Resume Analyzer",
    description="Hybrid AI and Deterministic Resume & Job Description Semantic Analyzer",
    version="2.0.0"
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
