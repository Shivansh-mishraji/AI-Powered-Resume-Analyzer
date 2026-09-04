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

# Gemini model fallback chain — tries each in order until one works
GEMINI_MODEL_FALLBACK_CHAIN = [
    "gemini-3.6-flash",
    "gemini-2.5-flash",
    "gemini-2.5-flash-preview-05-20",
    "gemini-2.0-flash",
    "gemini-2.0-flash-001",
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
]
# Default (first in chain)
DEFAULT_GEMINI_MODEL = GEMINI_MODEL_FALLBACK_CHAIN[0]

