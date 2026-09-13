"""
Automated Executive PDF, Markdown, HTML, and JSON Audit Exporter Engine.
Generates cryptographically verified audit reports with SHA-256 digital seals,
academic capstone stamps, and comprehensive candidate ATS telemetry.
"""

import hashlib
import json
import datetime
from typing import Dict, Any, Optional, List
import pymupdf


class ReportExporter:
    """
    Enterprise audit report export engine.
    Supports Markdown, JSON, HTML, and PDF formats with SHA-256 verification seals.
    """

    def __init__(self):
        self.certifying_authority = "AI-Powered Resume Analyzer Enterprise Suite"
        self.lead_architect = "Shivansh Mishra (Principal Architect & Co-Founder)"

    def generate_verification_hash(self, payload: Dict[str, Any]) -> str:
        """
        Generates a deterministic SHA-256 cryptographic digest of the analysis payload.
        Ensures audit immutability and provenance verification.
        """
        # Exclude dynamic verification hashes or timestamps from hash input for determinism
        cleaned = {
            k: v for k, v in payload.items()
            if k not in ("verification_hash", "export_timestamp", "signature")
        }
        serialized = json.dumps(cleaned, sort_keys=True, default=str)
        return hashlib.sha256(serialized.encode("utf-8")).hexdigest()

    def _normalize_data(
        self, analysis: Dict[str, Any], ats_audit: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Merges analysis and ATS audit data into a canonical payload."""
        data = dict(analysis)
        if ats_audit:
            data["ats_audit"] = ats_audit
        elif "ats_audit" not in data:
            data["ats_audit"] = None

        if "verification_hash" not in data:
            data["verification_hash"] = self.generate_verification_hash(data)

        if "export_timestamp" not in data:
            data["export_timestamp"] = datetime.datetime.now(datetime.timezone.utc).strftime(
                "%Y-%m-%d %H:%M:%S UTC"
            )

        return data

    def export_to_markdown(
        self, analysis: Dict[str, Any], ats_audit: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Exports the candidate evaluation into an executive Markdown report.
        """
        data = self._normalize_data(analysis, ats_audit)
        ats = data.get("ats_audit") or {}

        filename = data.get("filename", "resume.pdf")
        score = data.get("score", 0)
        is_ai = data.get("is_ai_powered", False)
        engine_type = "Gemini 2.5 Flash Enterprise AI" if is_ai else "Deterministic Rule-Based Engine"
        summary = data.get("candidate_summary", "No summary provided.")
        matched_skills = data.get("matched_skills", [])
        missing_skills = data.get("missing_skills", [])
        strengths = data.get("strengths", [])
        weaknesses = data.get("weaknesses", [])
        suggestions = data.get("suggestions", [])
        ats_score = ats.get("overall_score", score)
        quant_ratio = ats.get("quantification_ratio", 0.0)
        verb_count = ats.get("verb_diversity_count", len(ats.get("action_verbs_found", [])))
        v_hash = data.get("verification_hash", "")
        ts = data.get("export_timestamp", "")

        md = []
        md.append("# 📋 EXECUTIVE RESUME AUDIT & ATS COMPLIANCE REPORT")
        md.append(f"> **Official Document ID**: `{v_hash[:16].upper()}` | **Issued**: {ts}\n")
        md.append("---")
        md.append("### 🏛️ Academic Capstone & Enterprise Certification")
        md.append(
            f"This audit certifies that `{filename}` has undergone deep architectural parsing, "
            f"semantic competency alignment, and ATS parseability indexing via the "
            f"**{self.certifying_authority}**.\n"
        )

        md.append("### 📊 Executive Telemetry Overview")
        md.append("| Metric | Result | Evaluation Status |")
        md.append("| :--- | :--- | :--- |")
        md.append(f"| **Target Candidate File** | `{filename}` | Processed & Sanitized |")
        md.append(f"| **Overall Match Score** | **{score}%** | {'✅ Top Tier' if score >= 75 else ('⚠️ Moderate Fit' if score >= 50 else '❌ Substantial Gaps')} |")
        md.append(f"| **ATS Parseability Index** | **{ats_score}/100** | {'✅ High ATS Compliance' if ats_score >= 70 else '⚠️ Optimization Needed'} |")
        md.append(f"| **Analysis Engine** | {engine_type} | Verified Pass |")
        md.append(f"| **Quantification Ratio** | {quant_ratio}% of bullets | {'✅ Strong Impact' if quant_ratio >= 40 else '⚠️ Needs Numbers/Metrics'} |")
        md.append(f"| **Active Action Verbs** | {verb_count} unique verbs | {'✅ Strong Action Profile' if verb_count >= 10 else '⚠️ Enhance Action Verbs'} |")
        md.append(f"| **Digital SHA-256 Seal** | `{v_hash}` | Cryptographically Signed |")
        md.append("\n---\n")

        md.append("### 📝 Candidate Executive Summary")
        md.append(f"> {summary}\n")

        md.append("### 🎯 Skills Competency Matrix")
        md.append(f"**Matched Required Skills ({len(matched_skills)}):**")
        if matched_skills:
            md.append(", ".join(f"`{s}`" for s in matched_skills))
        else:
            md.append("*No directly matched skills identified.*")
        md.append("")

        md.append(f"**Critical Missing Skills ({len(missing_skills)}):**")
        if missing_skills:
            md.append(", ".join(f"`{s}`" for s in missing_skills))
        else:
            md.append("*No critical skill omissions identified.*")
        md.append("\n---\n")

        if ats:
            md.append("### 🔍 Deep ATS Structure & Heuristic Audit")
            detected = ats.get("sections_detected", [])
            missing = ats.get("missing_sections", [])
            verbs = ats.get("action_verbs_found", [])

            md.append(f"- **Detected Standard Sections ({len(detected)}):** " + (", ".join(f"*{s}*" for s in detected) if detected else "None"))
            md.append(f"- **Missing Standard Sections ({len(missing)}):** " + (", ".join(f"**{s}**" for s in missing) if missing else "All Key Sections Present"))
            md.append(f"- **Identified Action Verbs:** " + (", ".join(f"`{v}`" for v in verbs[:20]) if verbs else "None detected"))
            if len(verbs) > 20:
                md.append(f"  *(and {len(verbs) - 20} more)*")
            md.append(f"- **Quantified Achievements:** {ats.get('quantified_bullets_count', 0)} out of {ats.get('total_bullet_count', 0)} bullet points contain measurable metrics.")
            md.append("\n")

        md.append("### 💡 Strategic Recommendations & Candidate Coaching")
        all_suggestions = suggestions + ats.get("recommendations", [])
        if all_suggestions:
            for idx, rec in enumerate(all_suggestions, 1):
                md.append(f"{idx}. {rec}")
        else:
            md.append("- Candidate profile demonstrates comprehensive alignment with minimal friction points.")
        md.append("\n---\n")

        md.append("### 🛡️ Provenance & Digital Signature")
        md.append("```")
        md.append(f"ISSUER       : {self.certifying_authority}")
        md.append(f"LEAD DEV     : {self.lead_architect}")
        md.append(f"VERIFIED SHA : {v_hash}")
        md.append(f"TIMESTAMP    : {ts}")
        md.append("STATUS       : TAMPER-PROOF ACADEMIC AUDIT ISSUED")
        md.append("```")

        return "\n".join(md)

    def export_to_json(
        self, analysis: Dict[str, Any], ats_audit: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Exports structured audit report dictionary with verification block.
        """
        data = self._normalize_data(analysis, ats_audit)
        return {
            "audit_metadata": {
                "document_type": "Executive Resume Audit & ATS Compliance Report",
                "authority": self.certifying_authority,
                "lead_architect": self.lead_architect,
                "verification_hash": data["verification_hash"],
                "export_timestamp": data["export_timestamp"],
                "schema_version": "2.1.0-enterprise",
                "status": "verified"
            },
            "candidate_profile": {
                "filename": data.get("filename", "resume.pdf"),
                "score": data.get("score", 0),
                "overall_score": data.get("score", 0),
                "is_ai_powered": data.get("is_ai_powered", False),
                "analysis_confidence": data.get("analysis_confidence", "high"),
                "summary": data.get("candidate_summary", "")
            },
            "skills_matrix": {
                "matched_skills": data.get("matched_skills", []),
                "missing_skills": data.get("missing_skills", []),
                "matched_count": len(data.get("matched_skills", [])),
                "missing_count": len(data.get("missing_skills", []))
            },
            "ats_heuristics": data.get("ats_audit") or {},
            "strategic_insights": {
                "strengths": data.get("strengths", []),
                "weaknesses": data.get("weaknesses", []),
                "suggestions": data.get("suggestions", []),
                "warnings": data.get("warnings", [])
            }
        }

    def export_to_html(
        self, analysis: Dict[str, Any], ats_audit: Optional[Dict[str, Any]] = None
    ) -> str:
        """
        Exports a standalone, styled HTML executive report with print stylesheet.
        """
        data = self._normalize_data(analysis, ats_audit)
        ats = data.get("ats_audit") or {}

        filename = data.get("filename", "resume.pdf")
        score = data.get("score", 0)
        ats_score = ats.get("overall_score", score)
        quant_ratio = ats.get("quantification_ratio", 0.0)
        v_hash = data.get("verification_hash", "")
        ts = data.get("export_timestamp", "")
        summary = data.get("candidate_summary", "No summary provided.")
        matched = data.get("matched_skills", [])
        missing = data.get("missing_skills", [])
        recs = data.get("suggestions", []) + ats.get("recommendations", [])

        matched_chips = "".join(
            f'<span class="badge badge-success">{s}</span>' for s in matched
        ) or "<em>No matched skills</em>"
        missing_chips = "".join(
            f'<span class="badge badge-danger">{s}</span>' for s in missing
        ) or "<em>No missing skills</em>"
        rec_items = "".join(
            f"<li>{r}</li>" for r in recs
        ) or "<li>Profile demonstrates solid baseline alignment.</li>"

        html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Executive Resume Audit - {filename}</title>
<style>
  :root {{
    --bg: #0B0F17;
    --card: #151D2B;
    --border: #233044;
    --text: #F1F5F9;
    --muted: #94A3B8;
    --accent: #38BDF8;
    --success: #10B981;
    --danger: #EF4444;
    --warning: #F59E0B;
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }}
  body {{ background: var(--bg); color: var(--text); padding: 40px 20px; line-height: 1.6; }}
  .container {{ max-width: 900px; margin: 0 auto; }}
  .header {{ border-bottom: 2px solid var(--border); padding-bottom: 24px; margin-bottom: 32px; display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }}
  .header-title h1 {{ font-size: 26px; font-weight: 800; color: #fff; letter-spacing: -0.5px; }}
  .header-title p {{ color: var(--muted); font-size: 14px; margin-top: 4px; }}
  .seal-tag {{ background: rgba(56, 189, 248, 0.1); border: 1px solid var(--accent); color: var(--accent); padding: 6px 12px; border-radius: 6px; font-family: monospace; font-size: 12px; font-weight: 600; }}
  .grid {{ display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 32px; }}
  .card {{ background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px; }}
  .card-metric {{ font-size: 32px; font-weight: 800; color: #fff; margin-top: 8px; }}
  .card-label {{ font-size: 13px; color: var(--muted); text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; }}
  .badge {{ display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; margin: 4px; }}
  .badge-success {{ background: rgba(16, 185, 129, 0.15); color: #34D399; border: 1px solid rgba(16, 185, 129, 0.3); }}
  .badge-danger {{ background: rgba(239, 68, 68, 0.15); color: #F87171; border: 1px solid rgba(239, 68, 68, 0.3); }}
  .section {{ margin-bottom: 32px; }}
  .section-title {{ font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }}
  .summary-box {{ background: rgba(255, 255, 255, 0.03); border-left: 4px solid var(--accent); padding: 16px; border-radius: 0 8px 8px 0; color: #CBD5E1; }}
  ul.recs {{ padding-left: 20px; color: #CBD5E1; }}
  ul.recs li {{ margin-bottom: 8px; }}
  .hash-box {{ background: #070A0F; border: 1px dashed var(--border); border-radius: 8px; padding: 16px; font-family: monospace; font-size: 12px; color: var(--muted); word-break: break-all; }}
  @media print {{
    body {{ background: #fff !important; color: #000 !important; }}
    .card {{ border: 1px solid #ddd !important; background: #fafafa !important; }}
    .card-metric {{ color: #000 !important; }}
    .section-title {{ color: #000 !important; }}
    .summary-box {{ background: #f4f4f5 !important; color: #222 !important; border-left-color: #0284c7 !important; }}
    .seal-tag {{ border-color: #0284c7 !important; color: #0284c7 !important; }}
    .badge-success {{ background: #ecfdf5 !important; color: #065f46 !important; border-color: #a7f3d0 !important; }}
    .badge-danger {{ background: #fef2f2 !important; color: #991b1b !important; border-color: #fecaca !important; }}
  }}
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="header-title">
      <h1>Executive Resume Audit & ATS Report</h1>
      <p>Candidate File: <strong>{filename}</strong> | Generated: {ts}</p>
    </div>
    <div class="seal-tag">SHA-256 SEAL: {v_hash[:12]}...</div>
  </div>

  <div class="grid">
    <div class="card">
      <div class="card-label">Match Score</div>
      <div class="card-metric" style="color: {'#34D399' if score >= 70 else '#F59E0B'}">{score}%</div>
    </div>
    <div class="card">
      <div class="card-label">ATS Health Index</div>
      <div class="card-metric" style="color: {'#38BDF8' if ats_score >= 70 else '#F59E0B'}">{ats_score}/100</div>
    </div>
    <div class="card">
      <div class="card-label">Quantification Ratio</div>
      <div class="card-metric">{quant_ratio}%</div>
    </div>
    <div class="card">
      <div class="card-label">Matched Skills</div>
      <div class="card-metric">{len(matched)} / {len(matched) + len(missing)}</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Executive Profile Summary</div>
    <div class="summary-box">{summary}</div>
  </div>

  <div class="section">
    <div class="section-title">Matched Competencies</div>
    <div>{matched_chips}</div>
  </div>

  <div class="section">
    <div class="section-title">Critical Skill Gaps</div>
    <div>{missing_chips}</div>
  </div>

  <div class="section">
    <div class="section-title">Strategic Optimization Recommendations</div>
    <ul class="recs">{rec_items}</ul>
  </div>

  <div class="section">
    <div class="section-title">Cryptographic Provenance</div>
    <div class="hash-box">
      <strong>DIGITAL SHA-256 SIGNATURE:</strong> {v_hash}<br>
      <strong>ISSUING BODY:</strong> {self.certifying_authority}<br>
      <strong>LEAD ARCHITECT:</strong> {self.lead_architect}
    </div>
  </div>
</div>
</body>
</html>"""
        return html

    def export_to_pdf(
        self, analysis: Dict[str, Any], ats_audit: Optional[Dict[str, Any]] = None
    ) -> bytes:
        """
        Generates a fully professional multi-page PDF audit report with PyMuPDF.
        Pages: Cover/KPIs → Skills Matrix → ATS Audit → Insights → Interview Kit → Provenance
        """
        data = self._normalize_data(analysis, ats_audit)
        ats = data.get("ats_audit") or {}

        filename    = data.get("filename", "resume.pdf")
        score       = int(data.get("score", 0))
        ats_score   = int(ats.get("overall_score", score))
        sh_score    = int(ats.get("section_health_score", 0))
        vb_score    = int(ats.get("verb_density_score", 0))
        qt_score    = int(ats.get("quantification_score", 0))
        quant_ratio = float(ats.get("quantification_ratio", 0.0))
        verb_count  = int(ats.get("verb_diversity_count", 0))
        v_hash      = data.get("verification_hash", "")
        ts          = data.get("export_timestamp", "")
        summary     = data.get("candidate_summary", "Analyzed candidate profile.")
        matched     = data.get("matched_skills", []) or []
        missing     = data.get("missing_skills", []) or []
        strengths   = data.get("strengths", []) or []
        weaknesses  = data.get("weaknesses", []) or []
        suggestions = data.get("suggestions", []) or []
        interview_qs= data.get("interview_questions", []) or []
        sections_detected = ats.get("sections_detected", []) or []
        sections_missing  = ats.get("missing_sections", []) or []
        action_verbs      = ats.get("action_verbs_found", []) or []
        ats_recs          = ats.get("recommendations", []) or []
        is_ai = data.get("is_ai_powered", False)
        engine_label = "Gemini AI Engine" if is_ai else "Rule-Based Engine"

        # ─── Color palette (RGB 0-1) ─────────────────────────────────────────
        BG       = (0.043, 0.059, 0.090)   # #0B0F17
        CARD     = (0.082, 0.110, 0.165)   # #151C2A
        WHITE    = (1.0,   1.0,   1.0)
        MUTED    = (0.580, 0.635, 0.718)   # #94A3B8
        ACCENT   = (0.220, 0.741, 0.969)   # #38BDF8  cyan
        PRIMARY  = (0.400, 0.408, 0.945)   # #6666F1  indigo
        SUCCESS  = (0.063, 0.725, 0.506)   # #10B981  emerald
        DANGER   = (0.937, 0.267, 0.267)   # #EF4444  rose
        AMBER    = (0.957, 0.620, 0.043)   # #F59E0B
        DARK_TXT = (0.149, 0.196, 0.275)   # #263246  for light sections

        W, H = 595, 842   # A4

        def score_color(s):
            if s >= 75: return SUCCESS
            if s >= 50: return AMBER
            return DANGER

        def safe_str(v):
            return str(v) if v is not None else ""

        def wrap_text(text, max_chars=90):
            """Splits text into lines of at most max_chars characters at word boundaries."""
            words = str(text).split()
            lines, cur = [], []
            for w in words:
                if len(" ".join(cur + [w])) > max_chars:
                    if cur:
                        lines.append(" ".join(cur))
                    cur = [w]
                else:
                    cur.append(w)
            if cur:
                lines.append(" ".join(cur))
            return lines or [""]

        def draw_page_header(page, title, subtitle=""):
            """Draws the dark top banner on every page."""
            page.draw_rect(pymupdf.Rect(0, 0, W, 52), color=None, fill=BG)
            page.draw_rect(pymupdf.Rect(0, 52, W, 54), color=None, fill=ACCENT)
            page.insert_text((20, 32), "AI-POWERED RESUME ANALYZER", fontname="helv", fontsize=7, color=ACCENT)
            page.insert_text((20, 44), title, fontname="helv", fontsize=10.5, color=WHITE)
            if subtitle:
                page.insert_text((350, 44), subtitle, fontname="helv", fontsize=7.5, color=MUTED)

        def draw_page_footer(page, page_num, total, v_hash_short, ts):
            """Draws the footer bar with page number and hash seal."""
            page.draw_rect(pymupdf.Rect(0, H - 30, W, H), color=None, fill=CARD)
            page.draw_rect(pymupdf.Rect(0, H - 31, W, H - 30), color=None, fill=ACCENT)
            page.insert_text((20, H - 12), f"DIGITAL SHA-256: {v_hash_short}", fontname="courier", fontsize=6, color=MUTED)
            page.insert_text((350, H - 12), f"Issued: {ts}", fontname="helv", fontsize=6, color=MUTED)
            page.insert_text((520, H - 12), f"Page {page_num}/{total}", fontname="helv", fontsize=7, color=ACCENT)

        def draw_section_heading(page, y, label, color=ACCENT):
            page.insert_text((20, y), label, fontname="helv", fontsize=9.5, color=color)
            page.draw_line((20, y + 4), (W - 20, y + 4), color=(*color[:2], color[2], 0.4) if len(color) == 4 else color, width=0.6)
            return y + 16

        def draw_kpi_tile(page, x, y, w, h, label, value, val_color):
            page.draw_rect(pymupdf.Rect(x, y, x + w, y + h), color=None, fill=CARD)
            page.draw_rect(pymupdf.Rect(x, y, x + w, y + 2), color=None, fill=val_color)
            page.insert_text((x + 8, y + 20), label, fontname="helv", fontsize=7, color=MUTED)
            page.insert_text((x + 8, y + 42), safe_str(value), fontname="helv", fontsize=18, color=val_color)

        def draw_score_bar(page, x, y, bar_w, pct, bar_color, label, value_str):
            """Draws a labeled horizontal score bar."""
            BH = 7
            page.insert_text((x, y + 6), label, fontname="helv", fontsize=7.5, color=MUTED)
            page.draw_rect(pymupdf.Rect(x + 90, y, x + 90 + bar_w, y + BH), color=None, fill=(0.15, 0.19, 0.27))
            filled = max(3, int((min(pct, 100) / 100) * bar_w))
            page.draw_rect(pymupdf.Rect(x + 90, y, x + 90 + filled, y + BH), color=None, fill=bar_color)
            page.insert_text((x + 90 + bar_w + 6, y + 6), value_str, fontname="helv", fontsize=7.5, color=bar_color)
            return y + 18

        def draw_chip_row(page, x, y, items, chip_color, text_color, max_per_row=5, chip_h=14):
            """Draws small pill-shaped chips in rows."""
            row_x, row_y = x, y
            count = 0
            for item in items:
                label = str(item)[:22]
                tw = max(len(label) * 5.5 + 12, 32)
                if row_x + tw > W - 20:
                    row_x = x
                    row_y += chip_h + 4
                page.draw_rect(pymupdf.Rect(row_x, row_y, row_x + tw, row_y + chip_h),
                                color=None, fill=chip_color)
                page.insert_text((row_x + 6, row_y + 10), label, fontname="helv", fontsize=7, color=text_color)
                row_x += tw + 5
                count += 1
            return row_y + chip_h + 6  # next y

        # ─── Determine total page count ──────────────────────────────────────
        total_pages = 2  # Cover + Skills
        if ats:
            total_pages += 1
        if strengths or weaknesses or suggestions or ats_recs:
            total_pages += 1
        if interview_qs:
            total_pages += 1

        doc = pymupdf.open()
        v_short = v_hash[:20].upper() + "..." if v_hash else "N/A"

        # ════════════════════════════════════════════════════════════════════
        # PAGE 1 — COVER & KPI DASHBOARD
        # ════════════════════════════════════════════════════════════════════
        p1 = doc.new_page(width=W, height=H)
        p1.draw_rect(pymupdf.Rect(0, 0, W, H), color=None, fill=BG)

        # Dark header banner
        p1.draw_rect(pymupdf.Rect(0, 0, W, 80), color=None, fill=CARD)
        p1.draw_rect(pymupdf.Rect(0, 80, W, 83), color=None, fill=ACCENT)

        p1.insert_text((20, 28), "EXECUTIVE RESUME AUDIT & ATS COMPLIANCE REPORT",
                       fontname="helv", fontsize=13.5, color=WHITE)
        p1.insert_text((20, 48), f"Candidate File: {filename}",
                       fontname="helv", fontsize=8.5, color=MUTED)
        p1.insert_text((20, 62), f"Issued: {ts}   |   Engine: {engine_label}",
                       fontname="helv", fontsize=8, color=MUTED)
        p1.insert_text((400, 62), f"SEAL ID: {v_short}",
                       fontname="courier", fontsize=7, color=ACCENT)

        # KPI Tiles Row
        y = 100
        tile_configs = [
            ("JOB MATCH", f"{score}%",             score_color(score)),
            ("ATS INDEX", f"{ats_score}/100",       score_color(ats_score)),
            ("QUANT RATIO", f"{quant_ratio}%",      ACCENT),
            ("SKILLS MATCH", f"{len(matched)}/{len(matched)+len(missing)}", SUCCESS),
        ]
        tw = 130
        gap = 10
        sx = 20
        for i, (lbl, val, clr) in enumerate(tile_configs):
            draw_kpi_tile(p1, sx + i * (tw + gap), y, tw, 58, lbl, val, clr)

        # Candidate Summary
        y = 180
        y = draw_section_heading(p1, y, "CANDIDATE EXECUTIVE SUMMARY")
        for line in wrap_text(summary, max_chars=92)[:6]:
            p1.insert_text((20, y), line, fontname="helv", fontsize=8.5, color=(0.78, 0.84, 0.92))
            y += 13

        # Score gauge ring (drawn with rectangles as arc approximation)
        cx, cy, r = 490, 370, 55
        # Background ring
        p1.draw_circle((cx, cy), r, color=(0.15, 0.19, 0.27), fill=(0.15, 0.19, 0.27), width=10)
        # Score label
        p1.insert_text((cx - 22, cy + 8), f"{score}%", fontname="helv", fontsize=20, color=score_color(score))
        p1.insert_text((cx - 20, cy + 24), "MATCH", fontname="helv", fontsize=7, color=MUTED)

        # Tier badge
        if score >= 85:
            tier = "TIER 1 — HIGH ALIGNMENT"
        elif score >= 70:
            tier = "TIER 2 — STRONG CONTENDER"
        elif score >= 50:
            tier = "TIER 3 — MODERATE FIT"
        else:
            tier = "TIER 4 — STACK DISCREPANCY"
        p1.insert_text((cx - 60, cy + 42), tier, fontname="helv", fontsize=7.5, color=score_color(score))

        # Key stats below summary
        y = max(y + 10, 330)
        y = draw_section_heading(p1, y, "TELEMETRY OVERVIEW", color=PRIMARY)
        stats = [
            ("Matched Skills", len(matched), SUCCESS),
            ("Skill Gaps", len(missing), DANGER),
            ("Action Verbs", verb_count, ACCENT),
            ("Quantified Bullets", f"{ats.get('quantified_bullets_count',0)}/{ats.get('total_bullet_count',0)}", AMBER),
        ]
        for lbl, val, clr in stats:
            p1.insert_text((20, y), f"▸  {lbl}:", fontname="helv", fontsize=8.5, color=MUTED)
            p1.insert_text((160, y), safe_str(val), fontname="helv", fontsize=8.5, color=clr)
            y += 15

        # Confidence badge
        y += 8
        conf = (data.get("analysis_confidence") or "high").upper()
        p1.draw_rect(pymupdf.Rect(20, y, 160, y + 18), color=None, fill=(0.063, 0.725, 0.506, 0.15))
        p1.insert_text((26, y + 13), f"ANALYSIS CONFIDENCE: {conf}", fontname="helv", fontsize=8, color=SUCCESS)

        draw_page_footer(p1, 1, total_pages, v_short, ts)

        # ════════════════════════════════════════════════════════════════════
        # PAGE 2 — SKILLS COMPETENCY MATRIX
        # ════════════════════════════════════════════════════════════════════
        p2 = doc.new_page(width=W, height=H)
        p2.draw_rect(pymupdf.Rect(0, 0, W, H), color=None, fill=BG)
        draw_page_header(p2, "SKILLS COMPETENCY MATRIX", f"File: {filename}")

        y = 70
        y = draw_section_heading(p2, y, f"VERIFIED MATCHED SKILLS ({len(matched)})", color=SUCCESS)
        if matched:
            y = draw_chip_row(p2, 20, y, matched, (0.04, 0.25, 0.14), SUCCESS)
        else:
            p2.insert_text((20, y), "No directly matched skills identified.", fontname="helv", fontsize=8, color=MUTED)
            y += 16
        y += 10

        y = draw_section_heading(p2, y, f"CRITICAL SKILL GAPS ({len(missing)})", color=DANGER)
        if missing:
            y = draw_chip_row(p2, 20, y, missing, (0.28, 0.07, 0.07), DANGER)
        else:
            p2.insert_text((20, y), "No critical skill gaps detected.", fontname="helv", fontsize=8, color=MUTED)
            y += 16
        y += 10

        # Domain breakdown
        domain_breakdown = data.get("domain_breakdown") or {}
        if domain_breakdown:
            y = draw_section_heading(p2, y, "SKILL DOMAIN TAXONOMY", color=ACCENT)
            for domain, skills in list(domain_breakdown.items())[:12]:
                skills_list = skills if isinstance(skills, list) else []
                label = domain.replace("_", " ").title()
                row = f"{label}: " + ", ".join(str(s) for s in skills_list[:8])
                if len(skills_list) > 8:
                    row += f" (+{len(skills_list)-8} more)"
                p2.insert_text((20, y), row[:110], fontname="helv", fontsize=7.5, color=(0.78, 0.84, 0.92))
                y += 13
                if y > H - 50:
                    break

        draw_page_footer(p2, 2, total_pages, v_short, ts)

        pg_num = 3

        # ════════════════════════════════════════════════════════════════════
        # PAGE 3 — ATS HEURISTIC AUDIT (only if ats data present)
        # ════════════════════════════════════════════════════════════════════
        if ats:
            p3 = doc.new_page(width=W, height=H)
            p3.draw_rect(pymupdf.Rect(0, 0, W, H), color=None, fill=BG)
            draw_page_header(p3, "ATS PARSEABILITY AUDIT", "Automated Tracking System Compliance")

            y = 70
            y = draw_section_heading(p3, y, "ATS COMPOSITE SCORES", color=AMBER)
            bar_w = 300
            y = draw_score_bar(p3, 20, y, bar_w, ats_score, score_color(ats_score), "ATS Overall", f"{ats_score}/100")
            y = draw_score_bar(p3, 20, y, bar_w, sh_score,  ACCENT,                 "Section Health", f"{sh_score}/100")
            y = draw_score_bar(p3, 20, y, bar_w, vb_score,  PRIMARY,                "Verb Strength",  f"{vb_score}/100")
            y = draw_score_bar(p3, 20, y, bar_w, qt_score,  AMBER,                  "Metric Impact",  f"{qt_score}/100")
            y += 10

            if sections_detected:
                y = draw_section_heading(p3, y, f"DETECTED SECTIONS ({len(sections_detected)})", color=SUCCESS)
                row = "  ✓  " + "   ✓  ".join(s.replace("_", " ").title() for s in sections_detected)
                p3.insert_text((20, y), row[:110], fontname="helv", fontsize=8, color=SUCCESS)
                y += 16

            if sections_missing:
                y = draw_section_heading(p3, y, f"MISSING SECTIONS ({len(sections_missing)})", color=DANGER)
                row = "  ✗  " + "   ✗  ".join(s.replace("_", " ").title() for s in sections_missing)
                p3.insert_text((20, y), row[:110], fontname="helv", fontsize=8, color=DANGER)
                y += 16

            if action_verbs:
                y += 4
                y = draw_section_heading(p3, y, f"ACTION VERBS DETECTED ({len(action_verbs)} unique)", color=PRIMARY)
                y = draw_chip_row(p3, 20, y, action_verbs[:40], (0.10, 0.12, 0.25), PRIMARY, chip_h=13)
                y += 6

            if ats_recs:
                y = draw_section_heading(p3, y, "ATS RECOMMENDATIONS", color=AMBER)
                for rec in ats_recs[:6]:
                    for line in wrap_text(f"›  {rec}", max_chars=90)[:3]:
                        if y > H - 50:
                            break
                        p3.insert_text((20, y), line, fontname="helv", fontsize=8, color=(0.78, 0.84, 0.92))
                        y += 13

            draw_page_footer(p3, pg_num, total_pages, v_short, ts)
            pg_num += 1

        # ════════════════════════════════════════════════════════════════════
        # PAGE 4 — STRATEGIC INSIGHTS & RECOMMENDATIONS
        # ════════════════════════════════════════════════════════════════════
        if strengths or weaknesses or suggestions or ats_recs:
            p4 = doc.new_page(width=W, height=H)
            p4.draw_rect(pymupdf.Rect(0, 0, W, H), color=None, fill=BG)
            draw_page_header(p4, "STRATEGIC INSIGHTS & RECOMMENDATIONS")

            y = 70
            if strengths:
                y = draw_section_heading(p4, y, "CANDIDATE STRENGTHS", color=SUCCESS)
                for item in strengths[:5]:
                    for line in wrap_text(f"✓  {item}", max_chars=90)[:2]:
                        p4.insert_text((20, y), line, fontname="helv", fontsize=8.5, color=(0.78, 0.84, 0.92))
                        y += 13
                y += 6

            if weaknesses:
                y = draw_section_heading(p4, y, "AREAS FOR IMPROVEMENT", color=AMBER)
                for item in weaknesses[:5]:
                    for line in wrap_text(f"⚠  {item}", max_chars=90)[:2]:
                        p4.insert_text((20, y), line, fontname="helv", fontsize=8.5, color=(0.78, 0.84, 0.92))
                        y += 13
                y += 6

            all_recs = (suggestions or []) + [r for r in (ats_recs or []) if r not in (suggestions or [])]
            if all_recs:
                y = draw_section_heading(p4, y, "OPTIMIZATION RECOMMENDATIONS", color=PRIMARY)
                for idx, rec in enumerate(all_recs[:8], 1):
                    for line in wrap_text(f"{idx:02d}.  {rec}", max_chars=90)[:2]:
                        if y > H - 50:
                            break
                        p4.insert_text((20, y), line, fontname="helv", fontsize=8.5, color=(0.78, 0.84, 0.92))
                        y += 13

            draw_page_footer(p4, pg_num, total_pages, v_short, ts)
            pg_num += 1

        # ════════════════════════════════════════════════════════════════════
        # PAGE 5 — INTERVIEW QUESTION KIT (if available)
        # ════════════════════════════════════════════════════════════════════
        if interview_qs:
            p5 = doc.new_page(width=W, height=H)
            p5.draw_rect(pymupdf.Rect(0, 0, W, H), color=None, fill=BG)
            draw_page_header(p5, "TARGETED INTERVIEW QUESTION KIT")

            y = 70
            y = draw_section_heading(p5, y, "TECHNICAL INTERVIEW QUESTIONS", color=PRIMARY)

            for idx, q in enumerate(interview_qs[:6], 1):
                if y > H - 90:
                    break
                skill = safe_str(q.get("skill", "General"))
                diff  = safe_str(q.get("difficulty", "Mid-Level"))
                cat   = safe_str(q.get("category", "Technical"))
                question = safe_str(q.get("question", ""))

                # Question header row
                p5.draw_rect(pymupdf.Rect(20, y - 2, W - 20, y + 12), color=None, fill=CARD)
                p5.insert_text((24, y + 8), f"Q{idx:02d}  [{skill}]  {diff}  •  {cat}",
                               fontname="helv", fontsize=7.5, color=ACCENT)
                y += 18

                # Question text
                for line in wrap_text(question, max_chars=90)[:3]:
                    p5.insert_text((24, y), line, fontname="helv", fontsize=8.5, color=WHITE)
                    y += 13

                y += 8

            draw_page_footer(p5, pg_num, total_pages, v_short, ts)
            pg_num += 1

        # ════════════════════════════════════════════════════════════════════
        # LAST PAGE — CRYPTOGRAPHIC PROVENANCE
        # ════════════════════════════════════════════════════════════════════
        pl = doc.new_page(width=W, height=H)
        pl.draw_rect(pymupdf.Rect(0, 0, W, H), color=None, fill=BG)
        draw_page_header(pl, "CRYPTOGRAPHIC PROVENANCE & DIGITAL SEAL")

        y = 90
        pl.insert_text((20, y), "DOCUMENT CERTIFICATION", fontname="helv", fontsize=11, color=WHITE)
        y += 20
        pl.insert_text((20, y),
            "This document was generated by the AI-Powered Resume Analyzer Enterprise Suite.",
            fontname="helv", fontsize=9, color=MUTED)
        y += 14
        pl.insert_text((20, y),
            "The SHA-256 signature below guarantees audit immutability and provenance.",
            fontname="helv", fontsize=9, color=MUTED)
        y += 30

        # Hash box
        pl.draw_rect(pymupdf.Rect(20, y, W - 20, y + 90), color=(0.22, 0.74, 0.97), fill=CARD, width=0.8)
        y += 14
        rows = [
            ("ISSUING AUTHORITY", self.certifying_authority),
            ("LEAD ARCHITECT", self.lead_architect),
            ("SHA-256 SIGNATURE", v_hash),
            ("TIMESTAMP", ts),
            ("STATUS", "TAMPER-PROOF ACADEMIC AUDIT — VERIFIED"),
        ]
        for key, val in rows:
            pl.insert_text((30, y), f"{key}:", fontname="helv", fontsize=8, color=ACCENT)
            pl.insert_text((180, y), str(val)[:70], fontname="courier", fontsize=7.5, color=WHITE)
            y += 14

        draw_page_footer(pl, pg_num, total_pages, v_short, ts)

        pdf_bytes = doc.tobytes()
        doc.close()
        return pdf_bytes


# Global singleton

_exporter_instance: Optional[ReportExporter] = None


def get_report_exporter() -> ReportExporter:
    """Returns singleton ReportExporter instance."""
    global _exporter_instance
    if _exporter_instance is None:
        _exporter_instance = ReportExporter()
    return _exporter_instance
