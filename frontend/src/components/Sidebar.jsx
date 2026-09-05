import { useEffect } from 'react';

export default function Sidebar({
  activeView = 'analyzer',
  onOpenHistory,
  onOpenTelemetry,
  onOpenTeam,
  onOpenAbout,
  onOpenHowItWorks,
  isAiPowered = false,
  isMobileOpen = false,
  onCloseMobile,
}) {
  // Prevent background scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileOpen]);

  const navContent = (
    <>
      {/* Brand Card */}
      <div className="px-4 py-3 rounded-xl bg-surface/50 border border-outline-variant/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center border border-outline-variant/50 shadow-glow-sm">
              <span className="material-symbols-outlined text-primary text-[24px]" aria-hidden="true">terminal</span>
            </div>
            <div>
              <h3 className="font-label-md text-sm text-on-background font-semibold">ResumeAI Engine</h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-match-emerald" aria-hidden="true" />
                <p className="font-label-sm text-[10px] text-on-surface-variant font-mono">Local: 127.0.0.1:8000</p>
              </div>
            </div>
          </div>

          {/* Close button on mobile */}
          {isMobileOpen && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-background hover:bg-surface-bright/50 md:hidden"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Navigation Links */}
      <nav className="flex-1 flex flex-col gap-1.5 mt-2 overflow-y-auto" aria-label="Sidebar navigation">
        <button
          type="button"
          onClick={() => {
            if (isMobileOpen) onCloseMobile();
          }}
          className={`flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors text-left ${
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
          onClick={() => {
            onOpenHistory();
            if (isMobileOpen) onCloseMobile();
          }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-bright/50 transition-colors text-sm text-left"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">history</span>
          <span>Session History</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onOpenTelemetry();
            if (isMobileOpen) onCloseMobile();
          }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-bright/50 transition-colors text-sm text-left"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">monitoring</span>
          <span>API Telemetry</span>
        </button>

        <button
          type="button"
          onClick={() => {
            onOpenTeam();
            if (isMobileOpen) onCloseMobile();
          }}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-on-surface-variant hover:bg-surface-bright/50 transition-colors text-sm w-full text-left"
        >
          <img
            src="https://github.com/Shivansh-mishraji.png"
            alt="Shivansh Mishra"
            className="w-5 h-5 rounded-full object-cover ring-1 ring-secondary/50"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="text-secondary font-medium">Team (Lead: Shivansh)</span>
        </button>

        {/* Mobile Extra Links */}
        <div className="md:hidden pt-3 mt-2 border-t border-outline-variant/30 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => {
              if (onOpenHowItWorks) onOpenHowItWorks();
              if (isMobileOpen) onCloseMobile();
            }}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-bright/50 text-sm text-left"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">help_outline</span>
            <span>How it works</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (onOpenAbout) onOpenAbout();
              if (isMobileOpen) onCloseMobile();
            }}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-surface-bright/50 text-sm text-left"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">info</span>
            <span>About</span>
          </button>
        </div>
      </nav>

      {/* Engine Status Bottom Telemetry */}
      <div className="mt-auto p-3 border-t border-outline-variant/30 rounded-xl bg-surface-container-low/40">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-outline uppercase tracking-wider font-bold">Engine Status</span>
          <span className="text-xs text-on-surface-variant font-medium">
            {isAiPowered ? 'Gemini 2.5 Flash + AST' : 'Deterministic AST Engine'}
          </span>
          <span className="text-[11px] text-secondary font-semibold">
            {isAiPowered ? 'Free Tier Active' : 'Fallback Active'}
          </span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-[65px] bottom-0 w-64 bg-surface-container/40 backdrop-blur-2xl border-r border-surface-container-highest/50 flex-col p-4 gap-3 z-40">
        {navContent}
      </aside>

      {/* Mobile Slide-Out Drawer */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-50 flex md:hidden bg-black/70 backdrop-blur-md animate-fade-in"
          onClick={onCloseMobile}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-72 h-full bg-surface-container border-r border-outline-variant/40 p-4 flex flex-col gap-3 shadow-2xl animate-slide-right"
            onClick={(e) => e.stopPropagation()}
          >
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
