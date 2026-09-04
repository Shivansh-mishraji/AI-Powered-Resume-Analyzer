from docx import Document
import pymupdf
import io
from app.config import MAX_PDF_PAGES, MIN_EXTRACTED_CHARS

def extract_text_from_pdf(file_bytes: bytes) -> str:
    """
    Extracts text from PDF bytes in memory using PyMuPDF.
    Uses sort=True to preserve natural multi-column reading order.
    """
    if not file_bytes:
        raise ValueError("Uploaded file is empty.")

    try:
        with pymupdf.open(stream=file_bytes, filetype="pdf") as doc:
            if len(doc) == 0:
                raise ValueError("PDF document has 0 pages.")
            if len(doc) > MAX_PDF_PAGES:
                raise ValueError(f"PDF exceeds maximum allowed page limit of {MAX_PDF_PAGES} pages.")
            
            text = ""
            for page in doc:
                text += page.get_text("text", sort=True) + "\n"
    except Exception as e:
        if isinstance(e, ValueError):
            raise e
        raise ValueError(f"Could not parse PDF document: {str(e)}")

    cleaned = text.strip()
    if len(cleaned) < MIN_EXTRACTED_CHARS:
        raise ValueError("Could not extract enough selectable text. The document may be a scanned image.")

    return cleaned

def extract_text_from_docx(file_bytes: bytes) -> str:
    """
    Extracts text from DOCX bytes in memory using python-docx.
    """
    if not file_bytes:
        raise ValueError("Uploaded file is empty.")

    try:
        doc = Document(io.BytesIO(file_bytes))
        text = ""
        for para in doc.paragraphs:
            if para.text.strip():
                text += para.text + "\n"
    except Exception as e:
        raise ValueError(f"Could not parse DOCX document: {str(e)}")

    cleaned = text.strip()
    if len(cleaned) < MIN_EXTRACTED_CHARS:
        raise ValueError("Could not extract enough readable text from the DOCX file.")

    return cleaned