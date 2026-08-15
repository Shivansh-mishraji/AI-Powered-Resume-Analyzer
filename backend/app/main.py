from fastapi import FastAPI, UploadFile, File, HTTPException

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
    return {"filename": file.filename, 
    "file_type": file.content_type, 
    "message": "Resume uploaded successfully."}


    