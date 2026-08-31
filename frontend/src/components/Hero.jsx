export default function Hero({ isAiPowered = false }) {
  return (
    <header className="workspace-hero animate-fade-in-up" aria-labelledby="hero-title">
      <div
        className={`hero-mode-pill ${isAiPowered ? 'pill-ai-mode' : 'pill-rule-mode'}`}
        role="status"
        aria-live="polite"
      >
        <span className="mode-pill-dot animate-pulse" aria-hidden="true" />
        <span className="mode-pill-text">
          {isAiPowered ? 'GEMINI AI MODE ACTIVE' : 'DETERMINISTIC FALLBACK ACTIVE'}
        </span>
      </div>

      <h1 id="hero-title" className="hero-main-title">
        Analyze your resume against any job description.
      </h1>

      <div className="hero-badges-row">
        <span className="hero-feature-badge">
          <span className="material-symbols-outlined text-[16px] text-match-emerald" aria-hidden="true">memory</span>
          <span>RAM-Only Privacy</span>
        </span>
        <span className="hero-feature-badge">
          <span className="material-symbols-outlined text-[16px] text-match-amber" aria-hidden="true">rule_settings</span>
          <span>Deterministic ATS Rule-Engine</span>
        </span>
        <span className="hero-feature-badge">
          <span className="material-symbols-outlined text-[16px] text-primary" aria-hidden="true">psychology</span>
          <span>Gemini 2.5 Structured Reasoning</span>
        </span>
      </div>
    </header>
  );
}
