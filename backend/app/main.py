from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from app.services.resume_parser import extract_text_from_pdf, extract_text_from_docx
from app.services.skill_extractor import extract_skills
from app.services.score_calculator import calculate_score

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

#-------------------------------------------------------------

@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    if resume.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Only PDF and DOCX allowed."
        )
    if not job_description.strip():
        raise HTTPException(
            status_code=400,
            detail="Job description cannot be empty."
        )

    file_bytes = await resume.read()

    if resume.content_type == "application/pdf":
        resume_text = extract_text_from_pdf(file_bytes)
    else:
        resume_text = extract_text_from_docx(file_bytes)

    if not resume_text:
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from resume."
        )

    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(job_description)
    score_result = calculate_score(resume_skills, jd_skills)

    return {
        "filename": resume.filename,
        "resume_skills": resume_skills,
        "jd_skills": jd_skills,
        "score": score_result["score"],
        "matched_skills": score_result["matched_skills"],
        "missing_skills": score_result["missing_skills"],
        "total_jd_skills": score_result["total_jd_skills"]
    }
