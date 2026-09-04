"""
Central Configuration & Boundaries
AI-Powered Resume Analyzer
"""
import os

# Maximum uploaded file size (5 MB)
MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

# Text extraction length boundaries
MAX_RESUME_CHARS = 15000
MAX_JD_CHARS = 5000
MIN_EXTRACTED_CHARS = 50  # Scanned PDF detection threshold

# Page limit for uploaded PDF documents
MAX_PDF_PAGES = 10

# Allowed MIME content types
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
}

# Allowed file extensions
ALLOWED_EXTENSIONS = {".pdf", ".docx"}

# CORS configuration for development and production
ALLOWED_CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]

# Primary Gemini AI Model
DEFAULT_GEMINI_MODEL = "gemini-3.6-flash"

