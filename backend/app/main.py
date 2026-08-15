from fastapi import FastAPI, UploadFile, File, HTTPException
from app.services.resume_parser import extract_text_from_pdf, extract_text_from_docx

app = FastAPI(
    title = "AI Resume Analyzer",
    description = "Analyze resumes against job descriptions",
    version = "1.0.0"
)

@app.get("/health")
def health_check():
    return {"status": "ok"}


ALLOWED_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}

@app.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...)):
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type {file.content_type}. Only PDF and DOCX files are allowed."
        )
    # Read binary contents of the uploaded file
    file_bytes = await file.read()

    # Extract text based on file type
    if file.content_type == "application/pdf":
        extracted_text = extract_text_from_pdf(file_bytes)
    else:
        extracted_text = extract_text_from_docx(file_bytes)

    if not extracted_text:
        raise HTTPException(
            status_code=400,
            detail="Could not extract any readable text from the file."
        )

    return {
        "filename": file.filename,
        "file_type": file.content_type,
        "text_length": len(extracted_text),
        "preview": extracted_text[:200]
    }
