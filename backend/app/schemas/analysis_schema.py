from pydantic import BaseModel, Field
from typing import List, Literal, Optional, Dict, Any

class AnalysisResult(BaseModel):
    """
    Unified response contract returned by both Gemini AI and Rule-Based Fallback engines.
    """
    filename: str = Field(
        ..., 
        description="Name of the analyzed resume file."
    )
    score: int = Field(
        ..., 
        ge=0, 
        le=100, 
        description="Overall match percentage between 0 and 100."
    )
    is_ai_powered: bool = Field(
        ..., 
        description="True if analyzed by Gemini AI; False if analyzed by rule-based fallback."
    )
    analysis_confidence: Literal["high", "medium", "low", "not_applicable"] = Field(
        ..., 
        description="Confidence level of analysis. 'not_applicable' for deterministic fallback."
    )
    candidate_summary: str = Field(
        ..., 
        description="Professional summary of candidate profile and role alignment."
    )
    matched_skills: List[str] = Field(
        default_factory=list, 
        description="Skills required by the job that the candidate possesses."
    )
    missing_skills: List[str] = Field(
        default_factory=list, 
        description="Skills required by the job that the candidate lacks."
    )
    strengths: List[str] = Field(
        default_factory=list, 
        description="Key competitive candidate strengths for this role."
    )
    weaknesses: List[str] = Field(
        default_factory=list, 
        description="Critical missing qualifications or gaps for this role."
    )
    suggestions: List[str] = Field(
        default_factory=list, 
        description="Actionable resume optimization recommendations."
    )
    warnings: List[str] = Field(
        default_factory=list, 
        description="Informational alerts regarding truncation, fallback triggers, or file quality."
    )
    ats_audit: Optional[dict] = Field(
        default=None,
        description="Comprehensive ATS parseability, section health, and metric quantification audit."
    )
    domain_breakdown: Optional[dict] = Field(
        default=None,
        description="Skill distribution across 12 tech domains."
    )
    interview_questions: Optional[List[dict]] = Field(
        default=None,
        description="Targeted candidate interview questions based on skill gaps."
    )


class AtsAuditRequest(BaseModel):
    resume_text: str = Field(..., min_length=1, description="Raw or parsed resume text to audit.")


class CategorizeSkillsRequest(BaseModel):
    skills: List[str] = Field(..., description="List of raw or shorthand skills to categorize.")


class ExportRequest(BaseModel):
    analysis: dict = Field(..., description="AnalysisResult data dictionary.")
    ats_audit: Optional[dict] = Field(default=None, description="Optional ATS audit results.")


class InterviewKitRequest(BaseModel):
    matched_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    weaknesses: Optional[List[str]] = Field(default_factory=list)
    score: Optional[int] = Field(default=None)

