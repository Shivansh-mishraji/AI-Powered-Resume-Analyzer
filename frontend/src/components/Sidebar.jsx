export default function Sidebar({
  activeView = 'analyzer',
  onOpenHistory,
  onOpenTelemetry,
  onOpenTeam,
  isAiPowered = false,
}) {
  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-surface-container/40 backdrop-blur-2xl border-r border-surface-container-highest/50 flex-col p-base gap-stack-sm pt-[100px] z-40">
      {/* Brand Card */}
      <div className="px-4 py-3 mb-4 rounded-xl bg-surface/50 border border-outline-variant/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center border border-outline-variant/50 shadow-glow-sm">
            <span className="material-symbols-outlined text-primary text-[24px]" aria-hidden="true">terminal</span>
          </div>
          <div>
            <h3 className="font-label-md text-label-md text-on-background font-semibold">ResumeAI Engine</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-match-emerald" aria-hidden="true"></span>
              <p className="font-label-sm text-[10px] text-on-surface-variant">Local: 127.0.0.1:8000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1.5" aria-label="Sidebar navigation">
        <button
          type="button"
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium font-label-md text-label-md transition-colors text-left ${
            activeView === 'analyzer'
              ? 'bg-secondary-container/10 border border-secondary/20 text-secondary'
              : 'text-on-surface-variant hover:bg-surface-bright/50'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">troubleshoot</span>
          <span>Resume Analyzer</span>
        </button>

        <button
          type="button"
          onClick={onOpenHistory}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-bright/50 transition-colors font-label-md text-label-md text-left"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">history</span>
          <span>Session History</span>
        </button>

        <button
          type="button"
          onClick={onOpenTelemetry}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-bright/50 transition-colors font-label-md text-label-md text-left"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">monitoring</span>
          <span>API Telemetry</span>
        </button>

        <button
          type="button"
          onClick={onOpenTeam}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-bright/50 transition-colors font-label-md text-label-md w-full text-left"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">groups</span>
          <span>Team &amp; Roles</span>
        </button>
      </nav>

      {/* Engine Status Bottom Telemetry */}
      <div className="mt-auto p-4 border-t border-outline-variant/30">
        <div className="flex flex-col gap-1">
          <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider">Engine Status</span>
          <span className="font-label-md text-label-sm text-on-surface-variant">
            {isAiPowered ? 'Gemini 2.5 Flash + AST' : 'Deterministic AST Engine'}
          </span>
          <span className="font-label-sm text-[11px] text-secondary">
            {isAiPowered ? 'Free Tier Active' : 'Fallback Active'}
          </span>
        </div>
      </div>
    </aside>
  );
}
