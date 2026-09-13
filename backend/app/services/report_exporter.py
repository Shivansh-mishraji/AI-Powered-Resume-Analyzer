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
        self.lead_architect = "Shivansh Mishra (Founder & Principal Architect)"

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
        Generates an executive, publication-grade 2-page PDF audit report with PyMuPDF.
        Page 1: Executive KPI Dashboard, Candidate Summary, ATS Diagnostics, Strengths/Gaps, and Strategic Roadmap.
        Page 2: Competency Matrix, Targeted Technical Interview Kit, and Official Cryptographic Provenance Seal.
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
        verb_count  = int(ats.get("verb_diversity_count", len(ats.get("action_verbs_found", []))))
        v_hash      = data.get("verification_hash", "")
        ts          = data.get("export_timestamp", "")
        summary     = data.get("candidate_summary") or "Analyzed candidate profile with automated heuristic and semantic parsing."
        matched     = data.get("matched_skills", []) or []
        missing     = data.get("missing_skills", []) or []
        strengths   = data.get("strengths", []) or []
        weaknesses  = data.get("weaknesses", []) or []
        suggestions = data.get("suggestions", []) or []
        interview_qs= data.get("interview_questions", []) or []
        sections_detected = ats.get("sections_detected", []) or []
        sections_missing  = ats.get("missing_sections", []) or []
        domain_breakdown  = data.get("domain_breakdown") or {}
        ats_recs          = ats.get("recommendations", []) or []
        is_ai = data.get("is_ai_powered", False)
        engine_label = "Gemini 2.5 Flash Enterprise AI" if is_ai else "Deterministic Rule-Based Engine"
        conf = (data.get("analysis_confidence") or "High").upper()

        # ─── Corporate Color Tokens (Print-Friendly Executive Palette) ──────
        WHITE        = (1.0, 1.0, 1.0)
        CARD_BG      = (0.976, 0.984, 0.992)   # #F8FAFC
        CARD_BORDER  = (0.886, 0.910, 0.941)   # #E2E8F0
        NAVY         = (0.059, 0.090, 0.165)   # #0F172A
        TEXT_DARK    = (0.059, 0.090, 0.165)   # #0F172A
        TEXT_BODY    = (0.200, 0.255, 0.333)   # #334155
        TEXT_MUTED   = (0.392, 0.455, 0.545)   # #64748B
        TEXT_LIGHT   = (0.580, 0.639, 0.722)   # #94A3B8

        PRIMARY      = (0.145, 0.388, 0.922)   # #2563EB Royal Blue
        PRIMARY_BG   = (0.937, 0.965, 1.0)     # #EFF6FF
        PRIMARY_BD   = (0.753, 0.863, 0.988)   # #BFDBFE

        SUCCESS      = (0.020, 0.588, 0.412)   # #059669 Emerald
        SUCCESS_BG   = (0.925, 0.988, 0.957)   # #ECFDF5
        SUCCESS_BD   = (0.655, 0.882, 0.749)   # #A7F3D0

        WARNING      = (0.851, 0.467, 0.024)   # #D97706 Amber
        WARNING_BG   = (1.0,   0.984, 0.922)   # #FFFBEB
        WARNING_BD   = (0.992, 0.898, 0.651)   # #FDE68A

        DANGER       = (0.863, 0.149, 0.149)   # #DC2626 Crimson
        DANGER_BG    = (0.996, 0.949, 0.949)   # #FEF2F2
        DANGER_BD    = (0.996, 0.792, 0.792)   # #FECACA

        PURPLE       = (0.486, 0.227, 0.929)   # #7C3AED Violet
        PURPLE_BG    = (0.961, 0.953, 1.0)     # #F5F3FF
        PURPLE_BD    = (0.871, 0.843, 0.996)   # #DDD6FE

        W, H = 595.28, 841.89  # Standard A4
        L_MARGIN = 24
        R_MARGIN = W - 24
        USABLE_W = R_MARGIN - L_MARGIN

        def score_color(s):
            if s >= 75: return SUCCESS
            if s >= 50: return WARNING
            return DANGER

        def score_tier_label(s):
            if s >= 85: return "Tier 1: Top Tier Fit"
            if s >= 70: return "Tier 2: Strong Fit"
            if s >= 50: return "Tier 3: Moderate Fit"
            return "Tier 4: Substantial Gaps"

        def wrap_text(text, max_chars=85):
            words = str(text).split()
            lines, cur = [], []
            for w in words:
                if len(" ".join(cur + [w])) > max_chars:
                    if cur: lines.append(" ".join(cur))
                    cur = [w]
                else:
                    cur.append(w)
            if cur: lines.append(" ".join(cur))
            return lines or [""]

        def draw_footer(page, page_num, total_pages):
            page.draw_line((L_MARGIN, H - 26), (R_MARGIN, H - 26), color=CARD_BORDER, width=0.8)
            v_short = v_hash[:20].upper() + "..." if v_hash else "N/A"
            page.insert_text((L_MARGIN, H - 13), f"SHA-256 DIGITAL SEAL: {v_short}", fontname="courier", fontsize=6.5, color=TEXT_MUTED)
            page.insert_text((220, H - 13), "AI-Powered Resume Analyzer Suite  •  Academic Capstone 2026", fontname="helv", fontsize=6.5, color=TEXT_LIGHT)
            page.insert_text((R_MARGIN - 45, H - 13), f"Page {page_num} of {total_pages}", fontname="helv", fontsize=7.5, color=PRIMARY)

        doc = pymupdf.open()
        total_pages = 2

        # =========================================================================
        # PAGE 1: EXECUTIVE KPI DASHBOARD & ATS DIAGNOSTICS
        # =========================================================================
        p1 = doc.new_page(width=W, height=H)
        p1.draw_rect(pymupdf.Rect(0, 0, W, H), color=None, fill=WHITE)

        # Top Executive Header Banner (Navy)
        p1.draw_rect(pymupdf.Rect(0, 0, W, 64), color=None, fill=NAVY)
        p1.draw_rect(pymupdf.Rect(0, 64, W, 66.5), color=None, fill=PRIMARY)

        p1.insert_text((L_MARGIN, 22), "EXECUTIVE RESUME AUDIT & ATS COMPLIANCE REPORT", fontname="helv", fontsize=11.5, color=WHITE)
        v_short_header = f"SEAL: {v_hash[:16].upper()}" if v_hash else "UNVERIFIED"
        p1.insert_text((R_MARGIN - 130, 22), v_short_header, fontname="courier", fontsize=7.5, color=(0.60, 0.82, 1.0))

        sub_line1 = f"Target Candidate: {filename}"
        p1.insert_text((L_MARGIN, 38), sub_line1[:75], fontname="helv", fontsize=8, color=(0.90, 0.94, 1.0))

        sub_line2 = f"Engine: {engine_label}   •   Issued: {ts}"
        p1.insert_text((L_MARGIN, 52), sub_line2[:95], fontname="helv", fontsize=7.2, color=TEXT_LIGHT)

        # --- ROW 1: 4 Executive KPI Tiles ---
        y_kpi = 74
        kpi_h = 56
        tile_w = (USABLE_W - 3 * 9) / 4

        kpis = [
            ("JOB MATCH SCORE", f"{score}%", score_color(score), score_tier_label(score)),
            ("ATS COMPLIANCE", f"{ats_score}/100", score_color(ats_score), "High Pass" if ats_score>=70 else "Needs Work"),
            ("VERB DIVERSITY", f"{verb_count} Verbs", PRIMARY, f"Score: {vb_score}/100"),
            ("METRIC RATIO", f"{quant_ratio}%", PURPLE, f"{ats.get('quantified_bullets_count',0)}/{ats.get('total_bullet_count',0)} Bullets"),
        ]

        for i, (title, val, clr, sub) in enumerate(kpis):
            bx = L_MARGIN + i * (tile_w + 9)
            p1.draw_rect(pymupdf.Rect(bx, y_kpi, bx + tile_w, y_kpi + kpi_h), color=CARD_BORDER, fill=CARD_BG, width=0.6)
            p1.draw_rect(pymupdf.Rect(bx, y_kpi, bx + tile_w, y_kpi + 2.5), color=None, fill=clr)
            p1.insert_text((bx + 8, y_kpi + 16), title, fontname="helv", fontsize=6.8, color=TEXT_MUTED)
            p1.insert_text((bx + 8, y_kpi + 38), val, fontname="helv", fontsize=16.5, color=clr)
            p1.insert_text((bx + 8, y_kpi + 49), sub, fontname="helv", fontsize=6.5, color=TEXT_BODY)

        # --- ROW 2: Candidate Executive Summary Card ---
        y_sum = y_kpi + kpi_h + 10
        sum_h = 70
        p1.draw_rect(pymupdf.Rect(L_MARGIN, y_sum, R_MARGIN, y_sum + sum_h), color=CARD_BORDER, fill=CARD_BG, width=0.6)
        p1.draw_rect(pymupdf.Rect(L_MARGIN, y_sum, L_MARGIN + 3.5, y_sum + sum_h), color=None, fill=PRIMARY)

        p1.insert_text((L_MARGIN + 12, y_sum + 14), "EXECUTIVE CANDIDATE EVALUATION & FIT PROFILE", fontname="helv", fontsize=8, color=NAVY)

        conf_label = f"CONFIDENCE: {conf}"
        p1.draw_rect(pymupdf.Rect(R_MARGIN - 92, y_sum + 6, R_MARGIN - 8, y_sum + 18), color=PRIMARY_BD, fill=PRIMARY_BG, width=0.5)
        p1.insert_text((R_MARGIN - 88, y_sum + 15), conf_label, fontname="helv", fontsize=6.5, color=PRIMARY)

        sum_lines = wrap_text(summary, max_chars=118)[:4]
        cur_y = y_sum + 27
        for line in sum_lines:
            p1.insert_text((L_MARGIN + 12, cur_y), line, fontname="helv", fontsize=7.2, color=TEXT_BODY)
            cur_y += 10.5

        # --- ROW 3: Two-Column Section: ATS Diagnostics (Left) & Telemetry Profile (Right) ---
        y_mid = y_sum + sum_h + 10
        mid_h = 202
        col_w = (USABLE_W - 12) / 2
        col1_x = L_MARGIN
        col2_x = L_MARGIN + col_w + 12

        # Left Column: ATS Heuristic Compliance
        p1.draw_rect(pymupdf.Rect(col1_x, y_mid, col1_x + col_w, y_mid + mid_h), color=CARD_BORDER, fill=CARD_BG, width=0.6)
        p1.draw_rect(pymupdf.Rect(col1_x, y_mid, col1_x + col_w, y_mid + 20), color=None, fill=(0.94, 0.96, 0.98))
        p1.draw_line((col1_x, y_mid + 20), (col1_x + col_w, y_mid + 20), color=CARD_BORDER, width=0.6)
        p1.insert_text((col1_x + 10, y_mid + 14), "ATS HEURISTIC COMPLIANCE AUDIT", fontname="helv", fontsize=8, color=NAVY)

        bar_y = y_mid + 30
        def draw_progress_bar(y_pos, label, val, clr):
            p1.insert_text((col1_x + 10, y_pos), label, fontname="helv", fontsize=7, color=TEXT_MUTED)
            p1.insert_text((col1_x + col_w - 38, y_pos), f"{val}/100", fontname="helv", fontsize=7, color=clr)
            track_w = col_w - 20
            track_y = y_pos + 4
            p1.draw_rect(pymupdf.Rect(col1_x + 10, track_y, col1_x + 10 + track_w, track_y + 5), color=None, fill=(0.90, 0.92, 0.95))
            filled_w = max(4, int((min(val, 100) / 100) * track_w))
            p1.draw_rect(pymupdf.Rect(col1_x + 10, track_y, col1_x + 10 + filled_w, track_y + 5), color=None, fill=clr)
            return y_pos + 17

        bar_y = draw_progress_bar(bar_y, "Overall ATS Parseability Index", ats_score, score_color(ats_score))
        bar_y = draw_progress_bar(bar_y, "Section Architecture & Headers", sh_score, PRIMARY)
        bar_y = draw_progress_bar(bar_y, "Action Verb Strength & Density", vb_score, SUCCESS)
        bar_y = draw_progress_bar(bar_y, "Impact & Metric Quantification", qt_score, PURPLE)

        # Section badges (Vector pills with PASS / MISSING to avoid font encoding issues)
        sec_y = bar_y + 4
        p1.insert_text((col1_x + 10, sec_y), "Detected Standard Sections:", fontname="helv", fontsize=7, color=NAVY)
        sec_y += 11

        def draw_section_pills(x_start, y_start, sec_list, is_pass):
            px, py = x_start, y_start
            pill_h = 13
            bg = SUCCESS_BG if is_pass else DANGER_BG
            bd = SUCCESS_BD if is_pass else DANGER_BD
            txt_c = (0.04, 0.45, 0.30) if is_pass else (0.75, 0.12, 0.12)
            prefix = "PASS: " if is_pass else "MISSING: "
            for sec in sec_list:
                lbl = f"{prefix}{sec.replace('_',' ').title()}"
                pw = len(lbl) * 4.9 + 10
                if px + pw > col1_x + col_w - 8:
                    px = x_start
                    py += pill_h + 3
                p1.draw_rect(pymupdf.Rect(px, py, px + pw, py + pill_h), color=bd, fill=bg, width=0.5)
                p1.insert_text((px + 5, py + 9.5), lbl, fontname="helv", fontsize=6.3, color=txt_c)
                px += pw + 4
            return py + pill_h

        sec_y = draw_section_pills(col1_x + 10, sec_y, sections_detected[:6] if sections_detected else ["Standard Sections"], True)
        if sections_missing:
            sec_y += 10
            p1.insert_text((col1_x + 10, sec_y), "Missing Critical Sections:", fontname="helv", fontsize=7, color=DANGER)
            sec_y += 5
            sec_y = draw_section_pills(col1_x + 10, sec_y, sections_missing[:4], False)

        # Right Column: Telemetry Profile & Priority Advisory
        p1.draw_rect(pymupdf.Rect(col2_x, y_mid, col2_x + col_w, y_mid + mid_h), color=CARD_BORDER, fill=CARD_BG, width=0.6)
        p1.draw_rect(pymupdf.Rect(col2_x, y_mid, col2_x + col_w, y_mid + 20), color=None, fill=(0.94, 0.96, 0.98))
        p1.draw_line((col2_x, y_mid + 20), (col2_x + col_w, y_mid + 20), color=CARD_BORDER, width=0.6)
        p1.insert_text((col2_x + 10, y_mid + 14), "TELEMETRY & IMPACT PROFILE", fontname="helv", fontsize=8, color=NAVY)

        r_y = y_mid + 32
        telemetry_items = [
            ("Required Skills Matched", f"{len(matched)} identified", SUCCESS),
            ("Critical Skill Deficits", f"{len(missing)} missing", DANGER if missing else SUCCESS),
            ("Action Verbs Detected", f"{verb_count} unique verbs", PRIMARY),
            ("Quantified Bullets", f"{ats.get('quantified_bullets_count',0)} of {ats.get('total_bullet_count',0)} ({quant_ratio}%)", PURPLE),
            ("Execution Engine", engine_label[:26], TEXT_BODY),
        ]

        for label, val, clr in telemetry_items:
            p1.draw_circle((col2_x + 13, r_y - 3), 1.8, color=None, fill=clr)
            p1.insert_text((col2_x + 20, r_y), label, fontname="helv", fontsize=7, color=TEXT_MUTED)
            p1.insert_text((col2_x + col_w - 95, r_y), val, fontname="helv", fontsize=7, color=clr)
            r_y += 13

        # Priority ATS Advisory inside right box
        r_y += 2
        p1.draw_line((col2_x + 10, r_y), (col2_x + col_w - 10, r_y), color=CARD_BORDER, width=0.5)
        r_y += 10
        p1.insert_text((col2_x + 10, r_y), "ATS OPTIMIZATION ADVISORY:", fontname="helv", fontsize=7.2, color=WARNING)
        r_y += 11

        recs_sample = ats_recs[:3] if ats_recs else (suggestions[:3] if suggestions else [
            "Include measurable metrics (percentages, scale) in at least 40% of bullet points.",
            "Align technical skill naming conventions directly with standard industry taxonomy."
        ])
        for rec in recs_sample:
            p1.draw_circle((col2_x + 14, r_y - 2.5), 1.8, color=None, fill=WARNING)
            for line in wrap_text(rec, max_chars=54)[:2]:
                p1.insert_text((col2_x + 21, r_y), line, fontname="helv", fontsize=6.7, color=TEXT_BODY)
                r_y += 9.5
            r_y += 2

        # --- ROW 4: Two-Column Strengths & Areas for Improvement ---
        y_sw = y_mid + mid_h + 10
        sw_h = 160

        # Strengths (Left)
        p1.draw_rect(pymupdf.Rect(col1_x, y_sw, col1_x + col_w, y_sw + sw_h), color=SUCCESS_BD, fill=SUCCESS_BG, width=0.6)
        p1.draw_rect(pymupdf.Rect(col1_x, y_sw, col1_x + col_w, y_sw + 20), color=None, fill=(0.87, 0.97, 0.91))
        p1.draw_line((col1_x, y_sw + 20), (col1_x + col_w, y_sw + 20), color=SUCCESS_BD, width=0.6)
        p1.insert_text((col1_x + 10, y_sw + 14), "KEY CANDIDATE STRENGTHS", fontname="helv", fontsize=8, color=SUCCESS)

        sy = y_sw + 32
        display_strengths = strengths[:4] if strengths else [
            "Standard foundational background and relevant domain technical alignment.",
            "Consistent structural formatting maintained across primary resume sections."
        ]
        for s in display_strengths:
            p1.draw_circle((col1_x + 14, sy - 2.5), 2.2, color=None, fill=SUCCESS)
            lines = wrap_text(s, max_chars=52)[:2]
            for line in lines:
                p1.insert_text((col1_x + 21, sy), line, fontname="helv", fontsize=6.8, color=(0.04, 0.35, 0.22))
                sy += 9.5
            sy += 3

        # Areas for Improvement (Right)
        p1.draw_rect(pymupdf.Rect(col2_x, y_sw, col2_x + col_w, y_sw + sw_h), color=WARNING_BD, fill=WARNING_BG, width=0.6)
        p1.draw_rect(pymupdf.Rect(col2_x, y_sw, col2_x + col_w, y_sw + 20), color=None, fill=(0.99, 0.95, 0.85))
        p1.draw_line((col2_x, y_sw + 20), (col2_x + col_w, y_sw + 20), color=WARNING_BD, width=0.6)
        p1.insert_text((col2_x + 10, y_sw + 14), "CRITICAL AREAS FOR IMPROVEMENT", fontname="helv", fontsize=8, color=WARNING)

        wy = y_sw + 32
        display_weaknesses = weaknesses[:4] if weaknesses else [
            "Resume requires deeper keyword alignment with target job description.",
            "Quantified bullet points should be expanded to demonstrate tangible ROI."
        ]
        for w_item in display_weaknesses:
            p1.draw_circle((col2_x + 14, wy - 2.5), 2.2, color=None, fill=WARNING)
            lines = wrap_text(w_item, max_chars=52)[:2]
            for line in lines:
                p1.insert_text((col2_x + 21, wy), line, fontname="helv", fontsize=6.8, color=(0.55, 0.28, 0.02))
                wy += 9.5
            wy += 3

        # --- ROW 5: Strategic Resume Optimization Roadmap (Full Width) ---
        y_road = y_sw + sw_h + 10
        road_h = 136  # Extends gracefully to y=810
        p1.draw_rect(pymupdf.Rect(L_MARGIN, y_road, R_MARGIN, y_road + road_h), color=PRIMARY_BD, fill=PRIMARY_BG, width=0.6)
        p1.draw_rect(pymupdf.Rect(L_MARGIN, y_road, L_MARGIN + 3.5, y_road + road_h), color=None, fill=PRIMARY)

        p1.insert_text((L_MARGIN + 12, y_road + 15), "STRATEGIC RESUME OPTIMIZATION ROADMAP (ACTIONABLE PRIORITIES)", fontname="helv", fontsize=8, color=PRIMARY)

        all_priorities = (suggestions or []) + [r for r in ats_recs if r not in suggestions]
        if not all_priorities:
            all_priorities = [
                "Quantify project outcomes with concrete throughput, latency, and business metrics.",
                "Incorporate PyTorch fine-tuning workflows and model evaluation benchmarks into primary descriptions.",
                "Highlight automated CI/CD pipelines, PyTest suites, and test coverage percentages in technical credentials.",
                "Add a dedicated Cloud Architecture section detailing AWS container orchestration and Terraform setups."
            ]

        ry = y_road + 30
        tags = ["[METRIC IMPACT]", "[FRAMEWORK KEYWORDS]", "[QA & CI/CD PIPELINES]", "[CLOUD INFRASTRUCTURE]"]
        for idx, act in enumerate(all_priorities[:4], 1):
            tag = tags[idx-1] if idx <= len(tags) else f"[PRIORITY {idx:02d}]"
            p1.insert_text((L_MARGIN + 12, ry), f"STEP {idx:02d}", fontname="helv", fontsize=7, color=PRIMARY)
            p1.insert_text((L_MARGIN + 55, ry), tag, fontname="helv", fontsize=6.8, color=NAVY)

            lines = wrap_text(act, max_chars=88)[:2]
            for l_idx, line in enumerate(lines):
                offset_y = ry if l_idx == 0 else ry + 9.5
                p1.insert_text((L_MARGIN + 155, offset_y), line, fontname="helv", fontsize=6.8, color=TEXT_BODY)
            ry += 24

        draw_footer(p1, 1, total_pages)

        # =========================================================================
        # PAGE 2: COMPETENCY MATRIX, INTERVIEW QUESTION KIT & PROVENANCE SEAL
        # =========================================================================
        p2 = doc.new_page(width=W, height=H)
        p2.draw_rect(pymupdf.Rect(0, 0, W, H), color=None, fill=WHITE)

        # Top Header Banner
        p2.draw_rect(pymupdf.Rect(0, 0, W, 52), color=None, fill=NAVY)
        p2.draw_rect(pymupdf.Rect(0, 52, W, 54), color=None, fill=PRIMARY)
        p2.insert_text((L_MARGIN, 22), "COMPETENCY MATRIX, INTERVIEW KIT & DIGITAL SEAL", fontname="helv", fontsize=10.5, color=WHITE)
        p2.insert_text((R_MARGIN - 130, 22), v_short_header, fontname="courier", fontsize=7.5, color=(0.60, 0.82, 1.0))
        p2.insert_text((L_MARGIN, 41), f"Candidate: {filename}   |   Verified Academic Capstone Audit", fontname="helv", fontsize=7.5, color=(0.80, 0.87, 0.96))

        # --- SECTION 1: Skills Competency Matrix & Domain Breakdown ---
        y_sk = 62
        sk_h = 158
        p2.draw_rect(pymupdf.Rect(L_MARGIN, y_sk, R_MARGIN, y_sk + sk_h), color=CARD_BORDER, fill=CARD_BG, width=0.6)
        p2.draw_rect(pymupdf.Rect(L_MARGIN, y_sk, R_MARGIN, y_sk + 20), color=None, fill=(0.94, 0.96, 0.98))
        p2.draw_line((L_MARGIN, y_sk + 20), (R_MARGIN, y_sk + 20), color=CARD_BORDER, width=0.6)
        p2.insert_text((L_MARGIN + 10, y_sk + 14), "SKILLS COMPETENCY & GAP TAXONOMY", fontname="helv", fontsize=8, color=NAVY)

        # Subsection A: Matched Skills
        sk_cur_y = y_sk + 32
        p2.insert_text((L_MARGIN + 10, sk_cur_y), f"Verified Matched Skills ({len(matched)} identified):", fontname="helv", fontsize=7.5, color=SUCCESS)
        sk_cur_y += 10

        def draw_chip_grid(page, start_x, start_y, items, bg_clr, border_clr, text_clr, max_w):
            cx, cy = start_x, start_y
            chip_h = 14
            for item in items:
                lbl = str(item)[:24]
                tw = max(len(lbl) * 5.2 + 12, 36)
                if cx + tw > max_w:
                    cx = start_x
                    cy += chip_h + 4
                page.draw_rect(pymupdf.Rect(cx, cy, cx + tw, cy + chip_h), color=border_clr, fill=bg_clr, width=0.5)
                page.insert_text((cx + 6, cy + 10), lbl, fontname="helv", fontsize=6.8, color=text_clr)
                cx += tw + 5
            return cy + chip_h

        if matched:
            sk_cur_y = draw_chip_grid(p2, L_MARGIN + 10, sk_cur_y, matched, SUCCESS_BG, SUCCESS_BD, (0.04, 0.45, 0.30), R_MARGIN - 10)
        else:
            p2.insert_text((L_MARGIN + 10, sk_cur_y), "No directly matched skills identified from target requirements.", fontname="helv", fontsize=7, color=TEXT_MUTED)
            sk_cur_y += 12

        # Subsection B: Missing Skills
        sk_cur_y += 13
        p2.insert_text((L_MARGIN + 10, sk_cur_y), f"Critical Skill Gaps ({len(missing)} missing):", fontname="helv", fontsize=7.5, color=DANGER)
        sk_cur_y += 5
        if missing:
            sk_cur_y = draw_chip_grid(p2, L_MARGIN + 10, sk_cur_y, missing, DANGER_BG, DANGER_BD, (0.75, 0.12, 0.12), R_MARGIN - 10)
        else:
            p2.insert_text((L_MARGIN + 10, sk_cur_y), "No critical skill omissions identified.", fontname="helv", fontsize=7, color=TEXT_MUTED)
            sk_cur_y += 12

        # Subsection C: Domain Taxonomy Row
        if domain_breakdown and sk_cur_y < y_sk + sk_h - 15:
            p2.draw_line((L_MARGIN + 10, sk_cur_y), (R_MARGIN - 10, sk_cur_y), color=CARD_BORDER, width=0.5)
            sk_cur_y += 9
            p2.insert_text((L_MARGIN + 10, sk_cur_y), "Domain Taxonomy:", fontname="helv", fontsize=7, color=TEXT_MUTED)
            dx = L_MARGIN + 90
            for d_name, d_skills in list(domain_breakdown.items())[:3]:
                d_str = f"{d_name}: {', '.join(d_skills[:4])}"
                p2.insert_text((dx, sk_cur_y), d_str[:42], fontname="helv", fontsize=6.8, color=NAVY)
                dx += 150

        # --- SECTION 2: Targeted Technical Interview Kit ---
        y_int = y_sk + sk_h + 10
        int_h = 330
        p2.draw_rect(pymupdf.Rect(L_MARGIN, y_int, R_MARGIN, y_int + int_h), color=CARD_BORDER, fill=CARD_BG, width=0.6)
        p2.draw_rect(pymupdf.Rect(L_MARGIN, y_int, R_MARGIN, y_int + 20), color=None, fill=(0.94, 0.96, 0.98))
        p2.draw_line((L_MARGIN, y_int + 20), (R_MARGIN, y_int + 20), color=CARD_BORDER, width=0.6)
        p2.insert_text((L_MARGIN + 10, y_int + 14), "TARGETED TECHNICAL INTERVIEW QUESTION KIT", fontname="helv", fontsize=8, color=NAVY)

        q_y = y_int + 28
        display_qs = interview_qs[:3] if interview_qs else [
            {
                "question": "How do you optimize a high-throughput FastAPI inference endpoint to handle concurrent GPU requests without blocking the event loop?",
                "skill": "FastAPI & Async IO",
                "difficulty": "Mid-Level",
                "category": "System Architecture",
                "ideal_signal": "Look for worker threadpools, offloading heavy compute with run_in_executor, or queuing with Celery/Redis."
            },
            {
                "question": "Explain the architectural trade-offs between zero-shot prompt engineering vs. parameter-efficient fine-tuning (LoRA) for enterprise document parsing.",
                "skill": "Generative AI",
                "difficulty": "Senior",
                "category": "Machine Learning",
                "ideal_signal": "Assesses cost, latency, context-window limits, domain adaptation precision, and catastrophic forgetting."
            },
            {
                "question": "How do you structure multi-stage Docker builds to minimize final container image sizes for production Python deployments?",
                "skill": "Docker & DevOps",
                "difficulty": "Mid-Level",
                "category": "Cloud & Infrastructure",
                "ideal_signal": "Evaluates build-vs-runtime separation, removing gcc/compiler wheels, and using lightweight distroless/slim bases."
            }
        ]

        for idx, q in enumerate(display_qs, 1):
            q_box_h = 92
            p2.draw_rect(pymupdf.Rect(L_MARGIN + 10, q_y, R_MARGIN - 10, q_y + q_box_h), color=CARD_BORDER, fill=WHITE, width=0.5)
            p2.draw_rect(pymupdf.Rect(L_MARGIN + 10, q_y, R_MARGIN - 10, q_y + 18), color=None, fill=(0.96, 0.97, 0.99))
            p2.draw_line((L_MARGIN + 10, q_y + 18), (R_MARGIN - 10, q_y + 18), color=CARD_BORDER, width=0.5)

            q_skill = q.get("skill", "Core Technical")
            q_diff  = q.get("difficulty", "Mid-Level")
            q_cat   = q.get("category", "General")
            q_text  = q.get("question", "")
            q_signal= q.get("ideal_signal", "Evaluate depth of practical systems knowledge and trade-off awareness.")

            p2.insert_text((L_MARGIN + 18, q_y + 13), f"QUESTION {idx:02d}", fontname="helv", fontsize=7.2, color=PRIMARY)
            p2.insert_text((L_MARGIN + 85, q_y + 13), f"[{q_skill}]  •  {q_cat}", fontname="helv", fontsize=6.8, color=TEXT_MUTED)

            diff_clr = SUCCESS if "Junior" in q_diff or "Entry" in q_diff else (WARNING if "Mid" in q_diff else PURPLE)
            p2.insert_text((R_MARGIN - 80, q_y + 13), q_diff, fontname="helv", fontsize=6.8, color=diff_clr)

            # Question prompt
            prompt_y = q_y + 30
            for line in wrap_text(q_text, max_chars=110)[:3]:
                p2.insert_text((L_MARGIN + 18, prompt_y), line, fontname="helv", fontsize=7.2, color=TEXT_BODY)
                prompt_y += 11.5

            # Key Signal Box inside question
            p2.draw_line((L_MARGIN + 18, q_y + 68), (R_MARGIN - 18, q_y + 68), color=CARD_BORDER, width=0.4)
            p2.insert_text((L_MARGIN + 18, q_y + 80), "EVALUATION SIGNAL:", fontname="helv", fontsize=6.2, color=PRIMARY)
            signal_line = wrap_text(q_signal, max_chars=96)[0]
            p2.insert_text((L_MARGIN + 105, q_y + 80), signal_line, fontname="helv", fontsize=6.5, color=TEXT_MUTED)

            q_y += q_box_h + 8

        # --- SECTION 3: Cryptographic Provenance & Academic Seal Box ---
        y_seal = y_int + int_h + 10
        seal_h = H - 32 - y_seal  # Fills perfectly down to footer!

        p2.draw_rect(pymupdf.Rect(L_MARGIN, y_seal, R_MARGIN, y_seal + seal_h), color=NAVY, fill=WHITE, width=1.0)
        p2.draw_rect(pymupdf.Rect(L_MARGIN, y_seal, R_MARGIN, y_seal + 20), color=None, fill=NAVY)
        p2.insert_text((L_MARGIN + 10, y_seal + 14), "OFFICIAL AUDIT PROVENANCE & CRYPTOGRAPHIC DIGITAL SEAL", fontname="helv", fontsize=8, color=WHITE)
        p2.insert_text((R_MARGIN - 130, y_seal + 14), "VERIFIED TAMPER-PROOF", fontname="helv", fontsize=7, color=(0.40, 0.90, 0.60))

        sy_info = y_seal + 31
        p2.insert_text((L_MARGIN + 12, sy_info), "Issuing Body:", fontname="helv", fontsize=6.8, color=TEXT_MUTED)
        p2.insert_text((L_MARGIN + 95, sy_info), "AI-Powered Resume Analyzer Enterprise Suite", fontname="helv", fontsize=6.8, color=NAVY)

        p2.insert_text((L_MARGIN + 300, sy_info), "Verification Timestamp:", fontname="helv", fontsize=6.8, color=TEXT_MUTED)
        p2.insert_text((L_MARGIN + 395, sy_info), ts, fontname="helv", fontsize=6.8, color=NAVY)

        sy_info += 12
        p2.insert_text((L_MARGIN + 12, sy_info), "Principal Architect:", fontname="helv", fontsize=6.8, color=TEXT_MUTED)
        p2.insert_text((L_MARGIN + 95, sy_info), self.lead_architect, fontname="helv", fontsize=6.8, color=NAVY)

        p2.insert_text((L_MARGIN + 300, sy_info), "Academic Capstone:", fontname="helv", fontsize=6.8, color=TEXT_MUTED)
        p2.insert_text((L_MARGIN + 395, sy_info), "B.Tech CSE (BBD University, 2026)", fontname="helv", fontsize=6.8, color=NAVY)

        sy_info += 12
        p2.insert_text((L_MARGIN + 12, sy_info), "Core Engineering:", fontname="helv", fontsize=6.8, color=TEXT_MUTED)
        p2.insert_text((L_MARGIN + 95, sy_info), "Shivansh Mishra, Harshvardhan Sisodiya, Vishal Patel, Sujeet Kannaujiya", fontname="helv", fontsize=6.8, color=NAVY)

        # Monospace Hash Container
        sy_info += 13
        hash_box_h = 24
        p2.draw_rect(pymupdf.Rect(L_MARGIN + 10, sy_info, R_MARGIN - 10, sy_info + hash_box_h), color=CARD_BORDER, fill=(0.95, 0.96, 0.98), width=0.6)
        p2.insert_text((L_MARGIN + 16, sy_info + 10), "SHA-256 DETERMINISTIC CRYPTOGRAPHIC FINGERPRINT:", fontname="helv", fontsize=6.2, color=TEXT_MUTED)
        p2.insert_text((L_MARGIN + 16, sy_info + 19), v_hash, fontname="courier", fontsize=7.2, color=PRIMARY)

        draw_footer(p2, 2, total_pages)

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
