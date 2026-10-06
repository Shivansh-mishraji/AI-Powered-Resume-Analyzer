"""
Resume X-Ray Stream Service
Streams real-time keyword extraction and matching events for live visualization.
Each step emits JSON-lines via SSE so the frontend can animate the process.
"""

import asyncio
import json
import re
from typing import AsyncGenerator, List, Set, Tuple

from app.services.text_cleaner import clean_text
from app.services.skill_extractor import extract_skills, KNOWN_SKILLS
from app.services.taxonomy_service import get_taxonomy_service
from app.services.resume_parser import extract_text_from_pdf, extract_text_from_docx
from app.services.analysis_service import analyze_resume_content


def _sse(event_type: str, payload: dict) -> str:
    """Format a single SSE data line."""
    return f"data: {json.dumps({'type': event_type, **payload})}\n\n"


async def _emit_skills_stream(
    text: str,
    source: str,          # "resume" | "jd"
    delay: float = 0.07,  # seconds between each skill chip
) -> AsyncGenerator[str, None]:
    """
    Scans text and emits one SSE event per detected skill.
    Uses the real skill_extractor + taxonomy alias resolution.
    """
    taxonomy = get_taxonomy_service()
    cleaned = clean_text(text)
    found_skills: List[Tuple[str, str]] = []  # (display_name, domain)

    for skill in sorted(KNOWN_SKILLS):
        pattern = r"(?<!\w)" + re.escape(skill) + r"(?!\w)"
        if re.search(pattern, cleaned, re.IGNORECASE):
            canonical = taxonomy.resolve_synonym(skill) or skill.title()
            domain = taxonomy.get_domain_for_skill(canonical) or "General"
            found_skills.append((canonical, domain))

    for display, domain in found_skills:
        yield _sse("skill_chip", {
            "skill": display,
            "domain": domain,
            "source": source,
        })
        await asyncio.sleep(delay)


async def xray_stream(
    file_bytes: bytes,
    content_type: str,
    job_description: str,
    api_key: str | None,
    filename: str,
) -> AsyncGenerator[str, None]:
    """
    Main streaming generator for the X-Ray visualization.

    Events emitted (in order):
      phase        – announces which phase is active
      scan_line    – triggers CSS scan animation on the document card
      skill_chip   – one skill extracted (source: "resume" | "jd")
      graph_edge   – a taxonomy relationship to draw
      match        – a matched skill pair
      gap          – a missing skill (in JD but not resume)
      score_tick   – intermediate score value for counter animation
      done         – final full AnalysisResult payload
      error        – any exception message
    """
    try:
        # ── Phase 0: Parse ──────────────────────────────────────────────────
        yield _sse("phase", {"phase": "parsing", "label": "📄 Reading your resume..."})
        await asyncio.sleep(0.1)

        if content_type == "application/pdf":
            resume_text = extract_text_from_pdf(file_bytes)
        else:
            resume_text = extract_text_from_docx(file_bytes)

        yield _sse("scan_line", {"target": "resume"})
        await asyncio.sleep(0.4)

        # ── Phase 1: Resume skill extraction ────────────────────────────────
        yield _sse("phase", {"phase": "resume_skills", "label": "🔍 Extracting skills from resume..."})

        resume_skills: Set[str] = set()
        async for event in _emit_skills_stream(resume_text, "resume"):
            skill_name = json.loads(event.split("data: ")[1])["skill"]
            resume_skills.add(skill_name)
            yield event

        await asyncio.sleep(0.2)

        # ── Phase 2: JD skill extraction ─────────────────────────────────────
        yield _sse("phase", {"phase": "jd_skills", "label": "📋 Analyzing job description requirements..."})
        yield _sse("scan_line", {"target": "jd"})
        await asyncio.sleep(0.3)

        jd_skills: Set[str] = set()
        async for event in _emit_skills_stream(job_description, "jd", delay=0.06):
            skill_name = json.loads(event.split("data: ")[1])["skill"]
            jd_skills.add(skill_name)
            yield event

        await asyncio.sleep(0.2)

        # ── Phase 3: Taxonomy graph edges ────────────────────────────────────
        yield _sse("phase", {"phase": "graph", "label": "🧬 Traversing 440+ skill knowledge graph..."})
        taxonomy = get_taxonomy_service()

        all_skills = list(resume_skills | jd_skills)
        for skill in all_skills[:12]:  # cap at 12 edges for animation clarity
            canonical = taxonomy.resolve_synonym(skill) or skill
            domain = taxonomy.get_domain_for_skill(canonical) or "General"
            if canonical.lower() != skill.lower():
                yield _sse("graph_edge", {
                    "from": skill,
                    "to": canonical,
                    "domain": domain,
                    "label": f"{skill} → {canonical} [{domain}]"
                })
                await asyncio.sleep(0.12)
            else:
                yield _sse("graph_edge", {
                    "from": skill,
                    "to": domain,
                    "domain": domain,
                    "label": f"{skill} → [{domain}]"
                })
                await asyncio.sleep(0.08)

        await asyncio.sleep(0.2)

        # ── Phase 4: Match / gap comparison ─────────────────────────────────
        yield _sse("phase", {"phase": "matching", "label": "⚡ Comparing resume skills vs job requirements..."})

        matched = resume_skills & jd_skills
        gaps = jd_skills - resume_skills

        for skill in sorted(matched):
            yield _sse("match", {"skill": skill})
            await asyncio.sleep(0.09)

        for skill in sorted(gaps):
            yield _sse("gap", {"skill": skill})
            await asyncio.sleep(0.09)

        await asyncio.sleep(0.2)

        # ── Phase 5: Run full analysis (backend) ─────────────────────────────
        yield _sse("phase", {"phase": "scoring", "label": "🤖 AI computing your final score..."})

        # Fake score ticks while real analysis runs
        for tick in [10, 25, 40, 55, 68]:
            yield _sse("score_tick", {"value": tick})
            await asyncio.sleep(0.18)

        # Run actual analysis (sync call in executor to not block event loop)
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(
            None,
            lambda: analyze_resume_content(
                resume_text=resume_text,
                job_description=job_description,
                api_key=api_key,
                filename=filename,
            )
        )

        # Final real score tick
        yield _sse("score_tick", {"value": result.score})
        await asyncio.sleep(0.3)

        # ── Phase 6: Done ────────────────────────────────────────────────────
        yield _sse("done", {"result": result.model_dump()})

    except Exception as exc:
        yield _sse("error", {"message": str(exc)})
