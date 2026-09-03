import re


def clean_text(text: str) -> str:
    """Normalizes raw text: removes extra whitespace,
    special characters, and lowercases everything."""
    if not text:
        return ""
    # Replace newlines/tabs with spaces
    text = re.sub(r"\s+", " ", text)
    # Remove non-alphanumeric except . + # -
    text = re.sub(r"[^\w\s\.\+\#\-]", "", text)
    return text.strip().lower()
