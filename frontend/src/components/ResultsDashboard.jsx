import { useState, useEffect } from 'react';

export default function ResultsDashboard({
  result,
  onReset,
  onOpenTeam,
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'matched', 'gaps'
  const [copied, setCopied] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Score Count-Up Animation (60/120fps hardware synced)
  useEffect(() => {
    if (result && result.score !== undefined) {
      let animId;
      const start = performance.now();
      const duration = 1000;
      const target = Math.max(0, Math.min(100, Number(result.score) || 0));

      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedScore(Math.round(eased * target));
        if (progress < 1) {
          animId = requestAnimationFrame(step);
        }
      };

      animId = requestAnimationFrame(step);
      return () => cancelAnimationFrame(animId);
    }
  }, [result]);

  if (!result) return null;

  const handleCopySummary = () => {
    const text = `=== RESUME COMPATIBILITY AUDIT ===
Target File: ${result.filename || 'resume.pdf'}
Match Score: ${result.score}%
Mode: ${result.is_ai_powered ? 'Google Gemini AI' : 'Deterministic Rule Engine'}
Confidence: ${(result.analysis_confidence || 'HIGH').toUpperCase()}

EXECUTIVE SUMMARY:
${result.candidate_summary || 'N/A'}

MATCHED SKILLS:
${(result.matched_skills || []).join(', ') || 'None'}

SKILL GAPS:
${(result.missing_skills || []).join(', ') || 'None'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const matchedList = Array.isArray(result.matched_skills) ? result.matched_skills : [];
  const missingList = Array.isArray(result.missing_skills) ? result.missing_skills : [];
  const strengthsList = Array.isArray(result.strengths) ? result.strengths : [];
  const weaknessesList = Array.isArray(result.weaknesses) ? result.weaknesses : [];
  const suggestionsList = Array.isArray(result.suggestions) ? result.suggestions : [];
  const warningsList = Array.isArray(result.warnings) ? result.warnings : [];

  const getTierInfo = (score) => {
    if (score >= 85) return 'Tier 1: High Alignment';
    if (score >= 70) return 'Tier 2: Strong Contender';
    if (score >= 50) return 'Tier 3: Moderate Fit';
    return 'Tier 4: Stack Discrepancy';
  };

  const tierLabel = getTierInfo(result.score);

  // SVG Gauge calculations
  const radius = 45;
  const circumference = 2 * Math.PI * radius; // ~282.74
  const dashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="results-dashboard-wrapper">
      {/* Header / Metadata Row */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12 animate-stagger-1">
        <div>
          <div className="flex items-center gap-2 sm:gap-3 mb-3 flex-wrap">
            <span className="px-3 py-1 bg-primary-container/20 text-primary border border-primary/30 rounded-full font-label-sm text-xs flex items-center gap-1 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">smart_toy</span>
              <span>{result.is_ai_powered ? 'AI/Rule-Based' : 'Rule-Based Fallback'}</span>
            </span>

            <span className="px-3 py-1 bg-secondary-container/20 text-secondary border border-secondary/30 rounded-full font-label-sm text-xs flex items-center gap-1 shadow-glow-cyan">
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">verified</span>
              <span>Confidence: {(result.analysis_confidence || 'HIGH').toUpperCase()}</span>
            </span>

            <span className="px-3 py-1 bg-surface-container-high/50 border border-outline/30 rounded-full font-label-sm text-xs text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">description</span>
              <span>Audited: {result.filename || 'resume.pdf'}</span>
            </span>
          </div>

          <div className="font-label-sm text-xs text-secondary/80 flex items-center gap-1 mb-2">
            <span className="material-symbols-outlined text-[14px]" aria-hidden="true">account_balance_wallet</span>
            <span>Google AI Studio Free Tier: 1,500 free requests/day • $0.00 auto-billing risk.</span>
          </div>

          <h2 className="font-display-lg text-2xl sm:text-3xl md:text-display-lg text-on-background tracking-tight drop-shadow-lg">
            Analysis Results
          </h2>
          <p className="font-body-lg text-sm sm:text-base text-primary mt-1">
            Target Job Specification Match Overview
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 sm:gap-3 flex-wrap w-full md:w-auto">
          <button
            type="button"
            onClick={onOpenTeam}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-surface-container/50 glassmorphism-refraction border border-primary/30 text-on-surface rounded-lg font-label-md text-xs sm:text-sm hover:bg-surface-bright hover:border-primary/60 transition-all flex items-center justify-center gap-2 shadow-glow-sm hover:shadow-glow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">group</span>
            <span>Engineering Team</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-surface-container/50 glassmorphism-refraction border border-primary/30 text-on-surface rounded-lg font-label-md text-xs sm:text-sm hover:bg-surface-bright hover:border-primary/60 transition-all flex items-center justify-center gap-2 shadow-glow-sm hover:shadow-glow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">picture_as_pdf</span>
            <span>Export PDF Report</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="w-full sm:w-auto px-4 py-2.5 bg-surface-container/50 glassmorphism-refraction border border-primary/30 text-on-surface rounded-lg font-label-md text-xs sm:text-sm hover:bg-surface-bright hover:border-primary/60 transition-all flex items-center justify-center gap-2 relative group shadow-glow-sm hover:shadow-glow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">content_copy</span>
            <span>Copy Summary</span>
            {copied && (
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary-container px-3 py-1 rounded text-xs transition-opacity whitespace-nowrap border border-primary/50 font-bold">
                Copied!
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Advisory Warnings */}
      {warningsList.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-match-amber/15 border border-match-amber/40 text-match-amber flex flex-col gap-1.5 animate-stagger-1">
          <div className="flex items-center gap-2 font-bold text-sm">
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">warning</span>
            <span>Advisory Notice</span>
          </div>
          <ul className="list-disc pl-6 text-xs text-on-surface-variant/90 space-y-1">
            {warningsList.map((warn, idx) => (
              <li key={idx}>{warn}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-gutter-desktop">
        {/* Match Score Gauge (Span 4) */}
        <div className="lg:col-span-4 glass-panel p-6 sm:p-8 flex flex-col items-center justify-center min-h-[320px] animate-stagger-2">
          <div className="ai-accent-bar" />
          <h3 className="font-label-md text-sm text-secondary mb-6 uppercase tracking-widest self-start w-full text-center font-semibold">
            Match Score
          </h3>

          <div className="relative w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] flex items-center justify-center mb-6 group">
            {/* SVG Radial Gauge */}
            <svg
              className="w-full h-full transform -rotate-90 absolute inset-0 filter drop-shadow-[0_0_15px_rgba(34,211,238,0.3)] group-hover:drop-shadow-[0_0_25px_rgba(34,211,238,0.5)] transition-all duration-500"
              viewBox="0 0 100 100"
            >
              <circle
                className="text-surface-container-high/50"
                cx="50"
                cy="50"
                fill="none"
                r={radius}
                stroke="currentColor"
                strokeWidth="6"
              />
              <circle
                className="text-secondary gauge-circle drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]"
                cx="50"
                cy="50"
                fill="none"
                r={radius}
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="6"
                strokeDasharray={circumference}
                strokeDashoffset={dashoffset}
              />
            </svg>
            <div className="text-center flex flex-col items-center">
              <span className="font-display-lg text-4xl sm:text-display-lg text-on-background font-bold tracking-tighter drop-shadow-lg">
                {animatedScore}
                <span className="text-secondary text-3xl sm:text-4xl">%</span>
              </span>
            </div>
          </div>

          <div className="px-4 py-1.5 bg-secondary/10 border border-secondary/30 rounded-full text-secondary font-label-sm text-xs sm:text-sm font-bold flex items-center gap-2 mb-6 shadow-glow-cyan">
            <span className="w-2 h-2 rounded-full bg-secondary shadow-glow-cyan animate-pulse" />
            <span>{tierLabel}</span>
          </div>

          {/* 3 Mini KPI Tiles */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full mt-auto">
            <div className="bg-surface-container/40 border border-primary/10 rounded-lg p-2.5 sm:p-3 flex flex-col items-center text-center hover:bg-surface-container/60 transition-colors">
              <span className="text-secondary font-bold text-lg sm:text-xl drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                {matchedList.length}
              </span>
              <span className="text-[10px] text-on-surface-variant uppercase mt-1">Verified</span>
            </div>
            <div className="bg-surface-container/40 border border-primary/10 rounded-lg p-2.5 sm:p-3 flex flex-col items-center text-center hover:bg-surface-container/60 transition-colors">
              <span className="text-match-rose font-bold text-lg sm:text-xl drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">
                {missingList.length}
              </span>
              <span className="text-[10px] text-on-surface-variant uppercase mt-1">Gaps</span>
            </div>
            <div className="bg-surface-container/40 border border-primary/10 rounded-lg p-2.5 sm:p-3 flex flex-col items-center text-center hover:bg-surface-container/60 transition-colors">
              <span className="material-symbols-outlined text-primary text-[20px] sm:text-[22px] mb-0.5 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" aria-hidden="true">
                verified
              </span>
              <span className="text-[10px] text-on-surface-variant uppercase mt-1">High Conf</span>
            </div>
          </div>
        </div>

        {/* Executive Summary (Span 8) */}
        <div className="lg:col-span-8 glass-panel p-6 sm:p-8 flex flex-col animate-stagger-3">
          <div className="ai-accent-bar bg-primary shadow-[0_0_8px_#6366f1]" />
          <div className="flex items-center gap-3 mb-4 sm:mb-6">
            <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" aria-hidden="true">
              summarize
            </span>
            <h3 className="font-headline-md text-lg sm:text-headline-md text-on-background drop-shadow-md">
              Candidate Executive Summary
            </h3>
          </div>

          <p className="font-body-lg text-sm sm:text-body-lg text-on-surface-variant/90 leading-relaxed flex-1">
            {result.candidate_summary ||
              'Evaluation completed based on document parsing and technical keyword alignment against role specifications.'}
          </p>

          {/* Verified Chips Row */}
          {matchedList.length > 0 && (
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-2 sm:gap-3">
              {matchedList.slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="px-3 sm:px-4 py-1 sm:py-1.5 bg-surface-container/50 border border-primary/20 rounded-md font-label-sm text-xs sm:text-sm text-on-surface-variant flex items-center gap-1.5 sm:gap-2 hover:border-primary/40 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px] sm:text-[16px] text-secondary drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" aria-hidden="true">
                    check
                  </span>
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Skill Matrix (Span 12) */}
        <div className="lg:col-span-12 glass-panel p-6 sm:p-8 animate-stagger-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                <span className="material-symbols-outlined text-secondary text-2xl sm:text-3xl drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" aria-hidden="true">
                  scatter_plot
                </span>
                <h3 className="font-headline-md text-lg sm:text-headline-md text-on-background">
                  Interactive Skill Matrix
                </h3>
              </div>
              <p className="text-xs sm:text-label-sm text-primary mt-1 sm:ml-4">
                Skills or requirements not sufficiently evidenced in the provided resume document.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-surface-container/40 rounded-lg p-1 border border-primary/20 backdrop-blur-md self-start sm:self-auto flex-wrap">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-md font-label-sm text-xs sm:text-sm transition-all ${
                  activeTab === 'all'
                    ? 'bg-primary-container/30 text-primary border border-primary/40 shadow-glow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-background'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('matched')}
                className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-md font-label-sm text-xs sm:text-sm transition-all ${
                  activeTab === 'matched'
                    ? 'bg-primary-container/30 text-primary border border-primary/40 shadow-glow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-background'
                }`}
              >
                Matched
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('gaps')}
                className={`px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-md font-label-sm text-xs sm:text-sm transition-all ${
                  activeTab === 'gaps'
                    ? 'bg-primary-container/30 text-primary border border-primary/40 shadow-glow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-background'
                }`}
              >
                Gaps
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {/* Matched Chips */}
            {(activeTab === 'all' || activeTab === 'matched') &&
              matchedList.map((skill) => (
                <div
                  key={skill}
                  className="flex flex-col p-3.5 sm:p-4 bg-secondary/5 border border-secondary/20 rounded-xl hover:bg-secondary/10 transition-colors hover:border-secondary/40 hover:shadow-glow-cyan cursor-default"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="material-symbols-outlined text-secondary text-[18px] sm:text-[20px] drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" aria-hidden="true">
                      check_circle
                    </span>
                    <span className="font-label-md text-xs sm:text-sm text-on-surface font-medium">{skill}</span>
                  </div>
                </div>
              ))}

            {/* Gap Chips */}
            {(activeTab === 'all' || activeTab === 'gaps') &&
              missingList.map((skill) => (
                <div
                  key={skill}
                  className="flex flex-col gap-1 sm:gap-1.5 p-3.5 sm:p-4 bg-match-rose/5 border border-match-rose/20 rounded-xl hover:bg-match-rose/10 transition-colors hover:border-match-rose/40 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] cursor-default"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <span className="material-symbols-outlined text-match-rose text-[18px] sm:text-[20px] drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" aria-hidden="true">
                      add_circle
                    </span>
                    <span className="font-label-md text-xs sm:text-sm text-on-surface font-medium">{skill}</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant/80 pl-6 sm:pl-8">
                    Missing explicit requirement
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Qualitative Insights (Span 12, Grid inner) */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-gutter-desktop animate-stagger-5">
          {/* Strengths */}
          <div className="glass-panel p-5 sm:p-6 flex flex-col gap-4 sm:gap-5 border-t-2 border-t-secondary hover:-translate-y-1 transition-transform">
            <h4 className="font-label-md text-xs sm:text-sm text-secondary uppercase tracking-widest flex items-center gap-2 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)] font-bold">
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]" aria-hidden="true">thumb_up</span>
              <span>Strengths</span>
            </h4>
            <ul className="space-y-3 sm:space-y-4 font-body-md text-xs sm:text-sm text-on-surface-variant/90">
              {strengthsList.length > 0 ? (
                strengthsList.map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 sm:gap-3 items-start">
                    <span className="material-symbols-outlined text-secondary shrink-0 text-[18px] sm:text-[22px] drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] mt-0.5" aria-hidden="true">
                      check
                    </span>
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-outline text-xs italic">No specific strengths returned.</li>
              )}
            </ul>
          </div>

          {/* Areas to Improve */}
          <div className="glass-panel p-5 sm:p-6 flex flex-col gap-4 sm:gap-5 border-t-2 border-t-match-amber hover:-translate-y-1 transition-transform">
            <h4 className="font-label-md text-xs sm:text-sm text-match-amber uppercase tracking-widest flex items-center gap-2 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)] font-bold">
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]" aria-hidden="true">warning</span>
              <span>Areas to Improve</span>
            </h4>
            <ul className="space-y-3 sm:space-y-4 font-body-md text-xs sm:text-sm text-on-surface-variant/90">
              {weaknessesList.length > 0 ? (
                weaknessesList.map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 sm:gap-3 items-start">
                    <span className="material-symbols-outlined text-match-amber shrink-0 text-[18px] sm:text-[22px] drop-shadow-[0_0_8px_rgba(245,158,11,0.4)] mt-0.5" aria-hidden="true">
                      horizontal_rule
                    </span>
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-outline text-xs italic">No critical discrepancy detected.</li>
              )}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="glass-panel p-5 sm:p-6 flex flex-col gap-4 sm:gap-5 border-t-2 border-t-primary hover:-translate-y-1 transition-transform">
            <h4 className="font-label-md text-xs sm:text-sm text-primary uppercase tracking-widest flex items-center gap-2 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)] font-bold">
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]" aria-hidden="true">tips_and_updates</span>
              <span>Recommendations</span>
            </h4>
            <ul className="space-y-4 sm:space-y-5 font-body-md text-xs sm:text-sm text-on-surface-variant/90">
              {suggestionsList.length > 0 ? (
                suggestionsList.map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 sm:gap-3 items-start">
                    <span className="font-label-sm text-xs text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0 border border-primary/20 shadow-glow-sm font-bold">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span>{item}</span>
                  </li>
                ))
              ) : (
                <li className="text-outline text-xs italic">Resume is well tailored to requirements.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* ── ATS Audit Panel ───────────────────────────────────────────── */}
      {result.ats_audit && (
        <div className="lg:col-span-12 glass-panel p-6 sm:p-8 animate-stagger-5 mt-4 md:mt-gutter-desktop">
          <div className="ai-accent-bar bg-match-amber shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-match-amber text-2xl sm:text-3xl drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" aria-hidden="true">
              fact_check
            </span>
            <div>
              <h3 className="font-headline-md text-lg sm:text-headline-md text-on-background">ATS Parseability Audit</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Automated Tracking System structural compliance report</p>
            </div>
          </div>

          {/* Score Meters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
            {[
              { label: 'ATS Score', value: result.ats_audit.overall_score ?? 0, color: 'text-match-amber', glow: 'rgba(245,158,11,0.5)' },
              { label: 'Section Health', value: result.ats_audit.section_health_score ?? 0, color: 'text-secondary', glow: 'rgba(34,211,238,0.5)' },
              { label: 'Verb Strength', value: result.ats_audit.verb_density_score ?? 0, color: 'text-primary', glow: 'rgba(99,102,241,0.5)' },
              { label: 'Metric Impact', value: result.ats_audit.quantification_score ?? 0, color: 'text-match-rose', glow: 'rgba(244,63,94,0.5)' },
            ].map(({ label, value, color, glow }) => (
              <div key={label} className="bg-surface-container/40 border border-primary/10 rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-surface-container/60 transition-colors">
                <span className={`font-bold text-3xl sm:text-4xl ${color}`} style={{ filter: `drop-shadow(0 0 8px ${glow})` }}>
                  {value}
                </span>
                <div className="w-full bg-surface-container-high/40 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-700 ${color.replace('text-', 'bg-')}`}
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="text-[11px] text-on-surface-variant uppercase tracking-wider text-center">{label}</span>
              </div>
            ))}
          </div>

          {/* Sections Detected / Missing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {(result.ats_audit.sections_detected ?? []).length > 0 && (
              <div>
                <p className="text-xs text-secondary font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">check_circle</span> Detected Sections
                </p>
                <div className="flex flex-wrap gap-2">
                  {(result.ats_audit.sections_detected ?? []).map((s) => (
                    <span key={s} className="px-2.5 py-1 bg-secondary/10 border border-secondary/25 text-secondary rounded-md text-[11px] capitalize">
                      {s.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {(result.ats_audit.missing_sections ?? []).length > 0 && (
              <div>
                <p className="text-xs text-match-rose font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">cancel</span> Missing Sections
                </p>
                <div className="flex flex-wrap gap-2">
                  {(result.ats_audit.missing_sections ?? []).map((s) => (
                    <span key={s} className="px-2.5 py-1 bg-match-rose/10 border border-match-rose/25 text-match-rose rounded-md text-[11px] capitalize">
                      {s.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Verbs Found */}
          {(result.ats_audit.action_verbs_found ?? []).length > 0 && (
            <div className="mb-6">
              <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">electric_bolt</span>
                Action Verbs Detected ({result.ats_audit.verb_diversity_count ?? 0} unique)
              </p>
              <div className="flex flex-wrap gap-2">
                {(result.ats_audit.action_verbs_found ?? []).map((v) => (
                  <span key={v} className="px-2.5 py-1 bg-primary/10 border border-primary/20 text-primary rounded-md text-[11px] font-medium capitalize">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ATS Recommendations */}
          {(result.ats_audit.recommendations ?? []).length > 0 && (
            <div className="bg-match-amber/5 border border-match-amber/20 rounded-xl p-4">
              <p className="text-xs text-match-amber font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px]">tips_and_updates</span> ATS Recommendations
              </p>
              <ul className="space-y-2">
                {(result.ats_audit.recommendations ?? []).map((rec, i) => (
                  <li key={i} className="text-xs text-on-surface-variant/90 flex gap-2.5 items-start">
                    <span className="text-match-amber font-bold shrink-0 mt-0.5">›</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ── Domain Taxonomy Breakdown ─────────────────────────────────── */}
      {result.domain_breakdown && Object.keys(result.domain_breakdown).length > 0 && (
        <div className="lg:col-span-12 glass-panel p-6 sm:p-8 animate-stagger-5 mt-4 md:mt-gutter-desktop">
          <div className="ai-accent-bar bg-secondary shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-secondary text-2xl sm:text-3xl drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" aria-hidden="true">
              hub
            </span>
            <div>
              <h3 className="font-headline-md text-lg sm:text-headline-md text-on-background">Skill Domain Taxonomy</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Matched skills categorized across engineering domains</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Object.entries(result.domain_breakdown).map(([domain, skills]) => (
              <div key={domain} className="bg-surface-container/40 border border-secondary/15 rounded-xl p-4 hover:border-secondary/35 hover:bg-surface-container/60 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] text-secondary font-bold uppercase tracking-widest capitalize">
                    {domain.replace(/_/g, ' ')}
                  </p>
                  <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full border border-secondary/20 font-bold">
                    {Array.isArray(skills) ? skills.length : 0}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(skills) ? skills : []).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 bg-secondary/8 text-on-surface-variant rounded text-[11px] border border-secondary/10">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Interview Question Kit ────────────────────────────────────── */}
      {Array.isArray(result.interview_questions) && result.interview_questions.length > 0 && (
        <div className="lg:col-span-12 glass-panel p-6 sm:p-8 animate-stagger-5 mt-4 md:mt-gutter-desktop">
          <div className="ai-accent-bar bg-primary shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" aria-hidden="true">
              quiz
            </span>
            <div>
              <h3 className="font-headline-md text-lg sm:text-headline-md text-on-background">Interview Question Kit</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Targeted technical questions based on your skill alignment</p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {result.interview_questions.map((q, idx) => (
              <div key={idx} className="bg-surface-container/40 border border-primary/15 rounded-xl p-5 hover:border-primary/35 hover:bg-surface-container/60 transition-colors group">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold bg-primary/15 text-primary px-2.5 py-1 rounded-full border border-primary/25 uppercase tracking-wider">
                      {q?.skill ?? 'General'}
                    </span>
                    <span className="text-[10px] font-bold bg-surface-container-high/60 text-on-surface-variant px-2.5 py-1 rounded-full border border-outline/20 uppercase tracking-wider">
                      {q?.difficulty ?? 'Mid-Level'}
                    </span>
                    <span className="text-[10px] font-bold bg-secondary/10 text-secondary px-2.5 py-1 rounded-full border border-secondary/20 uppercase tracking-wider">
                      {q?.category ?? 'Technical'}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-outline shrink-0">Q{String(idx + 1).padStart(2, '0')}</span>
                </div>

                <p className="text-sm sm:text-base text-on-surface font-medium leading-relaxed mb-3">
                  {q?.question ?? ''}
                </p>

                {q?.rationale && (
                  <p className="text-xs text-on-surface-variant/70 italic mb-3">
                    <span className="font-semibold not-italic text-primary">Why asked:</span> {q.rationale}
                  </p>
                )}

                {Array.isArray(q?.expected_answer_points) && q.expected_answer_points.length > 0 && (
                  <details className="group/details">
                    <summary className="text-xs text-primary cursor-pointer hover:text-primary/80 flex items-center gap-1.5 font-semibold select-none list-none">
                      <span className="material-symbols-outlined text-[14px] group-open/details:rotate-180 transition-transform">expand_more</span>
                      Expected Answer Points
                    </summary>
                    <ul className="mt-3 space-y-1.5 pl-4 border-l-2 border-primary/20">
                      {q.expected_answer_points.map((pt, pi) => (
                        <li key={pi} className="text-xs text-on-surface-variant/85 flex gap-2 items-start">
                          <span className="text-primary shrink-0 mt-0.5">›</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset CTA */}
      <div className="mt-12 sm:mt-16 flex justify-center animate-stagger-5">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-primary text-on-primary rounded-xl font-label-md text-sm sm:text-base font-semibold hover:bg-primary-container transition-all duration-300 shadow-glow-md hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center justify-center gap-3 group hover:-translate-y-1 cursor-pointer"
        >
          <span className="material-symbols-outlined group-hover:-rotate-180 transition-transform duration-700 text-2xl" aria-hidden="true">
            refresh
          </span>
          <span>Analyze Another Resume</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="w-full py-6 mt-16 bg-surface-container-lowest/50 backdrop-blur-md border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-xs text-on-surface-variant gap-4 text-center md:text-left">
        <div>
          © 2026 Neural Systems. Encrypted Connection Active. Developed by{' '}
          <button type="button" onClick={onOpenTeam} className="text-secondary hover:underline font-semibold">
            Team Antigravity
          </button>.
        </div>
        <div className="flex gap-4 sm:gap-6 font-label-sm text-xs justify-center flex-wrap">
          <span>Privacy Protocol</span>
          <span>•</span>
          <span>Security Whitepaper</span>
          <span>•</span>
          <span>GDPR Compliance</span>
        </div>
      </footer>
    </div>
  );
}
