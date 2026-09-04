export default function Hero({ isAiPowered = false }) {
  return (
    <header className="mb-stack-lg animate-fade-in-up">
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 backdrop-blur-md transition-colors ${
          isAiPowered
            ? 'bg-match-emerald/10 border border-match-emerald/30'
            : 'bg-match-amber/10 border border-match-amber/30'
        }`}
        id="modePill"
      >
        <span
          className={`w-2 h-2 rounded-full ${
            isAiPowered
              ? 'bg-match-emerald shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse'
              : 'bg-match-amber shadow-[0_0_8px_rgba(245,158,11,0.8)]'
          }`}
          id="modeIndicator"
          aria-hidden="true"
        />
        <span
          className={`font-label-sm text-label-sm tracking-wider font-semibold ${
            isAiPowered ? 'text-match-emerald' : 'text-match-amber'
          }`}
          id="modeText"
        >
          {isAiPowered ? 'GEMINI AI MODE ACTIVE' : 'DETERMINISTIC FALLBACK ACTIVE'}
        </span>
      </div>

      <h1 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-background mb-6">
        Analyze your resume against any job description.
      </h1>

      <div className="flex flex-wrap items-center gap-3 font-label-sm text-label-sm text-on-surface-variant">
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-variant/50 border border-outline-variant/30">
          <span className="material-symbols-outlined text-[16px] text-match-emerald" aria-hidden="true">
            memory
          </span>
          <span>RAM-Only Privacy</span>
        </span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-variant/50 border border-outline-variant/30">
          <span className="material-symbols-outlined text-[16px] text-match-amber" aria-hidden="true">
            rule_settings
          </span>
          <span>Deterministic ATS Rule-Engine</span>
        </span>
        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-surface-variant/50 border border-outline-variant/30">
          <span className="material-symbols-outlined text-[16px] text-primary" aria-hidden="true">
            psychology
          </span>
          <span>Gemini 2.5 Structured Reasoning</span>
        </span>
      </div>
    </header>
  );
}
