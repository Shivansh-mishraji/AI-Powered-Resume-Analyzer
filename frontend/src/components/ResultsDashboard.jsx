import { useState, useEffect } from 'react';

export default function ResultsDashboard({
  result,
  onReset,
  onOpenTeam,
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'matched', 'gaps'
  const [copied, setCopied] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  // Score Count-Up Animation
  useEffect(() => {
    if (result && result.score !== undefined) {
      let current = 0;
      const target = result.score;
      const duration = 1200;
      const steps = 30;
      const increment = target / steps;
      const stepTime = duration / steps;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setAnimatedScore(target);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.round(current));
        }
      }, stepTime);

      return () => clearInterval(timer);
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
    if (score >= 85) return { label: 'Tier 1: High Alignment', class: 'tier-emerald' };
    if (score >= 70) return { label: 'Tier 2: Strong Contender', class: 'tier-cyan' };
    if (score >= 50) return { label: 'Tier 3: Moderate Fit', class: 'tier-amber' };
    return { label: 'Tier 4: Stack Discrepancy', class: 'tier-rose' };
  };

  const tier = getTierInfo(result.score);

  // SVG Gauge calculations
  const radius = 45;
  const circumference = 2 * Math.PI * radius; // ~282.74
  const dashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className="results-dashboard-wrapper animate-fade-in-up">
      {/* Header / Metadata Row */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <span className="px-3 py-1.5 bg-primary-container/20 text-primary border border-primary/30 rounded-full font-label-sm text-label-sm flex items-center gap-1.5 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">smart_toy</span>
              <span>{result.is_ai_powered ? 'AI-Powered Analysis' : 'Rule-Based Fallback'}</span>
            </span>

            <span className="px-3 py-1.5 bg-secondary-container/20 text-secondary border border-secondary/30 rounded-full font-label-sm text-label-sm flex items-center gap-1.5 shadow-glow-cyan">
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">verified</span>
              <span>Confidence: {(result.analysis_confidence || 'HIGH').toUpperCase()}</span>
            </span>

            <span className="px-3 py-1.5 bg-surface-container-high/50 border border-outline/30 rounded-full font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">description</span>
              <span>Audited File: {result.filename || 'resume.pdf'}</span>
            </span>
          </div>

          <div className="font-label-sm text-label-sm text-secondary/80 flex items-center gap-1.5 mb-2">
            <span className="material-symbols-outlined text-[14px]" aria-hidden="true">account_balance_wallet</span>
            <span>Google AI Studio Free Tier: 1,500 free requests/day • $0.00 auto-billing risk.</span>
          </div>

          <h2 className="font-display-lg text-display-lg-mobile md:text-display-lg text-on-background tracking-tight drop-shadow-lg">
            Analysis Results
          </h2>
          <p className="font-body-lg text-body-lg text-primary mt-1">
            Target Job Specification Match Overview
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={onOpenTeam}
            className="px-4 py-2.5 bg-surface-container/50 glassmorphism-refraction border border-primary/30 text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-bright hover:border-primary/60 transition-all flex items-center gap-2 shadow-glow-sm hover:shadow-glow-md"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">group</span>
            <span>Engineering Team</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 bg-surface-container/50 glassmorphism-refraction border border-primary/30 text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-bright hover:border-primary/60 transition-all flex items-center gap-2 shadow-glow-sm hover:shadow-glow-md"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">picture_as_pdf</span>
            <span>Export PDF Report</span>
          </button>

          <button
            type="button"
            onClick={handleCopySummary}
            className="px-4 py-2.5 bg-surface-container/50 glassmorphism-refraction border border-primary/30 text-on-surface rounded-lg font-label-md text-label-md hover:bg-surface-bright hover:border-primary/60 transition-all flex items-center gap-2 relative group shadow-glow-sm hover:shadow-glow-md"
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

      {/* Advisory Warnings if any */}
      {warningsList.length > 0 && (
        <div className="mb-8 p-4 rounded-xl bg-match-amber/15 border border-match-amber/40 text-match-amber flex flex-col gap-1.5">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Match Score Gauge Card (Span 4) */}
        <div className="lg:col-span-4 glass-panel p-7 flex flex-col items-center justify-center min-h-[340px]">
          <div className="ai-accent-bar" />
          <h3 className="font-label-md text-label-md text-secondary mb-6 uppercase tracking-widest self-start w-full text-center font-semibold">
            Match Score
          </h3>

          <div className="relative w-[180px] h-[180px] flex items-center justify-center mb-6 group">
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
              <span className="font-display-lg text-display-lg text-on-background font-bold tracking-tighter drop-shadow-lg">
                {animatedScore}
                <span className="text-secondary text-3xl">%</span>
              </span>
            </div>
          </div>

          <div className="px-4 py-1.5 bg-secondary/10 border border-secondary/30 rounded-full text-secondary font-label-sm text-label-sm font-bold flex items-center gap-2 mb-6 shadow-glow-cyan">
            <span className="w-2 h-2 rounded-full bg-secondary shadow-glow-cyan animate-pulse" />
            <span>{tier.label}</span>
          </div>

          {/* 3 Mini KPI Tiles */}
          <div className="grid grid-cols-3 gap-2.5 w-full mt-auto">
            <div className="bg-surface-container/40 border border-primary/10 rounded-lg p-2.5 flex flex-col items-center text-center hover:bg-surface-container/60 transition-colors">
              <span className="text-secondary font-bold text-lg drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                {matchedList.length}
              </span>
              <span className="text-[10px] text-on-surface-variant uppercase mt-0.5">Verified Skills</span>
            </div>
            <div className="bg-surface-container/40 border border-primary/10 rounded-lg p-2.5 flex flex-col items-center text-center hover:bg-surface-container/60 transition-colors">
              <span className="text-match-rose font-bold text-lg drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">
                {missingList.length}
              </span>
              <span className="text-[10px] text-on-surface-variant uppercase mt-0.5">Missing Gaps</span>
            </div>
            <div className="bg-surface-container/40 border border-primary/10 rounded-lg p-2.5 flex flex-col items-center text-center hover:bg-surface-container/60 transition-colors">
              <span className="material-symbols-outlined text-primary text-[20px] mb-0.5 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" aria-hidden="true">
                verified
              </span>
              <span className="text-[10px] text-on-surface-variant uppercase mt-0.5">High Conf</span>
            </div>
          </div>
        </div>

        {/* Candidate Executive Summary Card (Span 8) */}
        <div className="lg:col-span-8 glass-panel p-7 flex flex-col">
          <div className="ai-accent-bar bg-primary shadow-[0_0_8px_#6366f1]" />
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-primary text-3xl drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" aria-hidden="true">
              summarize
            </span>
            <h3 className="font-headline-md text-headline-md text-on-background drop-shadow-md">
              Candidate Executive Summary
            </h3>
          </div>

          <p className="font-body-lg text-body-lg text-on-surface-variant/90 leading-relaxed flex-1">
            {result.candidate_summary ||
              'Evaluation completed based on document parsing and technical keyword alignment against role specifications.'}
          </p>

          {/* Verified Chips Row */}
          {matchedList.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2.5">
              {matchedList.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  className="px-3.5 py-1.5 bg-surface-container/50 border border-primary/20 rounded-md font-label-sm text-label-sm text-on-surface-variant flex items-center gap-2 hover:border-primary/40 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]" aria-hidden="true">
                    check
                  </span>
                  <span>{skill}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Interactive Skill Matrix (Span 12) */}
        <div className="lg:col-span-12 glass-panel p-7">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-3xl drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" aria-hidden="true">
                  scatter_plot
                </span>
                <h3 className="font-headline-md text-headline-md text-on-background">
                  Interactive Skill Matrix
                </h3>
              </div>
              <p className="text-label-sm text-primary mt-1 text-xs">
                Skills or requirements not sufficiently evidenced in the provided resume document.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-surface-container/40 rounded-lg p-1 border border-primary/20 backdrop-blur-md self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-4 py-1.5 rounded-md font-label-sm text-label-sm transition-all ${
                  activeTab === 'all'
                    ? 'bg-primary-container/30 text-primary border border-primary/40 shadow-glow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-background'
                }`}
              >
                All ({matchedList.length + missingList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('matched')}
                className={`px-4 py-1.5 rounded-md font-label-sm text-label-sm transition-all ${
                  activeTab === 'matched'
                    ? 'bg-primary-container/30 text-primary border border-primary/40 shadow-glow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-background'
                }`}
              >
                Matched ({matchedList.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('gaps')}
                className={`px-4 py-1.5 rounded-md font-label-sm text-label-sm transition-all ${
                  activeTab === 'gaps'
                    ? 'bg-primary-container/30 text-primary border border-primary/40 shadow-glow-sm font-bold'
                    : 'text-on-surface-variant hover:text-on-background'
                }`}
              >
                Gaps ({missingList.length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
            {/* Matched Chips */}
            {(activeTab === 'all' || activeTab === 'matched') &&
              matchedList.map((skill) => (
                <div
                  key={skill}
                  className="flex flex-col p-3.5 bg-secondary/5 border border-secondary/20 rounded-xl hover:bg-secondary/10 transition-colors hover:border-secondary/40 hover:shadow-glow-cyan cursor-default"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-secondary text-[20px] drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" aria-hidden="true">
                      check_circle
                    </span>
                    <span className="font-label-md text-label-md text-on-surface font-medium">{skill}</span>
                  </div>
                </div>
              ))}

            {/* Gap Chips */}
            {(activeTab === 'all' || activeTab === 'gaps') &&
              missingList.map((skill) => (
                <div
                  key={skill}
                  className="flex flex-col gap-1 p-3.5 bg-match-rose/5 border border-match-rose/20 rounded-xl hover:bg-match-rose/10 transition-colors hover:border-match-rose/40 hover:shadow-[0_0_15px_rgba(244,63,94,0.3)] cursor-default"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-match-rose text-[20px] drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]" aria-hidden="true">
                      add_circle
                    </span>
                    <span className="font-label-md text-label-md text-on-surface font-medium">{skill}</span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant/80 pl-7">
                    Missing explicit requirement
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Qualitative Insights Triad (Span 12) */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Strengths */}
          <div className="glass-panel p-6 flex flex-col gap-4 border-t-2 border-t-secondary hover:-translate-y-1 transition-transform">
            <h4 className="font-label-md text-label-md text-secondary uppercase tracking-widest flex items-center gap-2 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)] font-bold">
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">thumb_up</span>
              <span>Strengths</span>
            </h4>
            <ul className="space-y-3 font-body-md text-label-md text-on-surface-variant/90">
              {strengthsList.length > 0 ? (
                strengthsList.map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <span className="material-symbols-outlined text-secondary shrink-0 text-[18px] drop-shadow-[0_0_8px_rgba(34,211,238,0.4)] mt-0.5" aria-hidden="true">
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
          <div className="glass-panel p-6 flex flex-col gap-4 border-t-2 border-t-match-amber hover:-translate-y-1 transition-transform">
            <h4 className="font-label-md text-label-md text-match-amber uppercase tracking-widest flex items-center gap-2 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)] font-bold">
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">warning</span>
              <span>Areas to Improve</span>
            </h4>
            <ul className="space-y-3 font-body-md text-label-md text-on-surface-variant/90">
              {weaknessesList.length > 0 ? (
                weaknessesList.map((item, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <span className="material-symbols-outlined text-match-amber shrink-0 text-[18px] drop-shadow-[0_0_8px_rgba(245,158,11,0.4)] mt-0.5" aria-hidden="true">
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
          <div className="glass-panel p-6 flex flex-col gap-4 border-t-2 border-t-primary hover:-translate-y-1 transition-transform">
            <h4 className="font-label-md text-label-md text-primary uppercase tracking-widest flex items-center gap-2 drop-shadow-[0_0_5px_rgba(139,92,246,0.5)] font-bold">
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">tips_and_updates</span>
              <span>Recommendations</span>
            </h4>
            <ul className="space-y-3 font-body-md text-label-md text-on-surface-variant/90">
              {suggestionsList.length > 0 ? (
                suggestionsList.map((item, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-bold text-xs shrink-0 border border-primary/30">
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

      {/* Bottom Action CTA */}
      <div className="flex justify-center my-8">
        <button
          type="button"
          onClick={onReset}
          className="px-8 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold font-label-md shadow-glow-sm hover:shadow-glow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">refresh</span>
          <span>Analyze Another Resume</span>
        </button>
      </div>

      {/* Footer Strip */}
      <footer className="mt-12 pt-6 border-t border-surface-container-highest/40 flex flex-col md:flex-row justify-between items-center text-xs text-on-surface-variant gap-4">
        <div className="flex items-center gap-2">
          <span className="text-match-emerald">🛡️</span>
          <span>BYOK Security: API keys are RAM-only and transmitted via X-Gemini-API-Key header.</span>
        </div>
        <div>
          <span>© 2026 ResumeAI. Developed by Team Antigravity.</span>
        </div>
      </footer>
    </div>
  );
}
