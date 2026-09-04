# Engineering Guidelines — Frontend Developer
# Member: Harshwardhan Sisodiya
# GitHub Username: harsh123-code
# Git Author Name: Harshvardhan Sisodiya
# Git Email: hsisodiya205@bbdu.ac.in
# Role: Frontend Developer & UI/UX Specialist
# Project: AI-Powered Resume & Job Description Analyzer

---

## Core Frontend Principles
- **In-Memory Security for BYOK:** The user's Gemini API key must be kept strictly in React component memory state (`useState`). Never store the API key in `localStorage` or `sessionStorage` to protect against client-side script inspection.
- **Masked Input:** Always use `type="password"` with a clear "Show/Hide" toggle and a "Clear Key" button.
- **Request Debouncing & Loading Protection:** Immediately disable the "Analyze" button upon submission to prevent accidental duplicate requests or rate-limit violations.
- **Graceful Rendering of Unified Contract:** Handle both `is_ai_powered: true` and `is_ai_powered: false` seamlessly. Always check array lengths before rendering cards (`result.strengths?.length > 0`).
- **Always Render Warnings:** If the response contains items in the `warnings` array, render them prominently in an alert box so the user is informed of truncations or fallback triggers.
- **Glassmorphism Design System:** Maintain visual consistency using CSS variables defined in `index.css` and `App.css` (custom translucent panels, backdrop blur, and smooth gradient badges).

---

## UI Component Map

| Component Area | State / Behavior |
|---|---|
| **API Key Card** | Password input, optional badge, clear button, helper text explaining zero-persistence BYOK. |
| **Dropzone Card** | Drag-and-drop file upload zone supporting `.pdf` and `.docx` with file size validation. |
| **Job Description Card** | Multi-line textarea with character counter and sample prompt pills. |
| **Analyze Action Button** | Triggers analysis, shows animated loading spinner, disabled while loading. |
| **Status Badge** | Displays 🤖 **AI-Powered Analysis** (cyan) or ⚙️ **Rule-Based Analysis** (amber). |
| **Score & Confidence** | Radial score percentage gauge with confidence level badge (`High`, `Medium`, `Low`, `N/A`). |
| **Skill Badges** | Green pill tags for matched skills; red pill tags for missing skills. |
| **AI Insights Grid** | Render Candidate Summary, Strengths, Weaknesses, and Actionable Improvement Suggestions. |
| **Warnings Banner** | Rendered if non-empty, explaining any truncations or fallback reasons. |

---

## Development & Git Workflow

1. Test frontend against the FastAPI backend running on `http://127.0.0.1:8000`.
2. Commit UI updates using `--author="harsh123-code <hsisodiya205@bbdu.ac.in>"`.
3. Verify mobile responsiveness and cross-browser visual rendering before staging.
