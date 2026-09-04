export default function Hero({ isAiPowered = false }) {
  return (
    <header className="mb-stack-lg animate-fade-in-up" style={{ position: 'relative', zIndex: 1 }}>

      {/* Animated mode pill */}
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 backdrop-blur-md transition-all duration-500 ${
          isAiPowered
            ? 'bg-primary/10 border border-primary/40 animate-pulse-ring'
            : 'bg-match-amber/10 border border-match-amber/30'
        }`}
        id="modePill"
      >
        <span
          className={`w-2 h-2 rounded-full transition-all duration-500 ${
            isAiPowered
              ? 'bg-primary shadow-[0_0_10px_rgba(99,102,241,0.9)] animate-pulse'
              : 'bg-match-amber shadow-[0_0_8px_rgba(245,158,11,0.8)]'
          }`}
          id="modeIndicator"
          aria-hidden="true"
        />
        <span
          className={`font-label-sm text-label-sm tracking-wider font-semibold ${
            isAiPowered ? 'text-primary' : 'text-match-amber'
          }`}
          id="modeText"
        >
          {isAiPowered ? '✦ AI MODE ACTIVE' : '⚙ RULE-BASED ENGINE ACTIVE'}
        </span>
      </div>

      {/* Shimmer gradient heading */}
      <h1
        className="font-display-lg text-display-lg-mobile md:text-display-lg mb-6 leading-tight animate-shimmer-text"
        id="heroHeading"
      >
        Analyze your resume against any job description.
      </h1>

      {/* Feature badges — staggered pop-in */}
      <div className="flex flex-wrap items-center gap-3 font-label-sm text-label-sm text-on-surface-variant">
        {[
          { icon: 'memory',         color: 'text-match-emerald', label: 'RAM-Only Privacy',                  delay: '0.2s' },
          { icon: 'rule_settings',  color: 'text-match-amber',   label: 'Deterministic ATS Rule-Engine',      delay: '0.35s' },
          { icon: 'psychology',     color: 'text-primary',        label: 'Multi-Provider AI Reasoning',        delay: '0.5s' },
        ].map(({ icon, color, label, delay }) => (
          <span
            key={label}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-variant/40 border border-outline-variant/30 animate-badge-pop backdrop-blur-sm hover:border-primary/30 hover:bg-primary/5 transition-colors duration-300"
            style={{ animationDelay: delay }}
          >
            <span className={`material-symbols-outlined text-[16px] ${color}`} aria-hidden="true">
              {icon}
            </span>
            <span>{label}</span>
          </span>
        ))}
      </div>
    </header>
  );
}
