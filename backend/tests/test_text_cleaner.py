import pytest
from app.services.text_cleaner import clean_text


def test_clean_text_lowercases():
    result = clean_text("Python Developer With FASTAPI")
    assert result == "python developer with fastapi"


def test_clean_text_removes_extra_whitespace():
    result = clean_text("Python    Developer\n\nFastAPI")
    assert result == "python developer fastapi"


def test_clean_text_removes_special_characters():
    result = clean_text("Skills: Python, React! & Node.js @2024")
    assert "," not in result
    assert "!" not in result
    assert "@" not in result


def test_clean_text_preserves_plus_and_hash():
    result = clean_text("C++ and C# developer")
    assert "c++" in result
    assert "c#" in result


def test_clean_text_empty_string():
    assert clean_text("") == ""


def test_clean_text_none_returns_empty():
    assert clean_text(None) == ""


def test_clean_text_strips_leading_trailing_spaces():
    result = clean_text("   python developer   ")
    assert result == "python developer"
