from fastapi import FastAPI

app = FastAPI(
    title = "AI Resume Analyzer",
    description = "Analyze resumes against job descriptions",
    version = "1.0.0"
)

@app.get("/health")
def health_check():
    return {"status": "ok"}
