export default function TopNavBar({
  isOnline = true,
  onOpenAbout,
  onOpenHowItWorks,
  onOpenTeam,
}) {
  return (
    <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-3xl border-b border-surface-container-highest/50 flex justify-between items-center px-gutter py-4 max-w-7xl mx-auto left-0 right-0">
      <div className="flex items-center gap-4">
        <span className="font-display-lg text-display-lg-mobile tracking-tight text-on-background md:hidden">
          AI Powered Resume Analyzer
        </span>
        <span className="font-display-lg text-headline-md tracking-tight text-on-background hidden md:block">
          AI Powered Resume Analyzer
        </span>
      </div>

      <div className="hidden md:flex items-center gap-stack-md">
        <button
          type="button"
          onClick={onOpenAbout}
          className="text-on-surface-variant font-label-md text-label-md hover:text-on-background transition-colors duration-200"
        >
          About
        </button>
        <button
          type="button"
          onClick={onOpenHowItWorks}
          className="text-on-surface-variant font-label-md text-label-md hover:text-on-background transition-colors duration-200"
        >
          How it works
        </button>
        <a
          href="https://github.com/Shivansh-mishraji/AI-Powered-Resume-Analyzer"
          target="_blank"
          rel="noopener noreferrer"
          className="text-on-surface-variant font-label-md text-label-md hover:text-on-background transition-colors duration-200"
        >
          GitHub
        </a>
        <button
          type="button"
          onClick={onOpenTeam}
          className="text-on-surface-variant font-label-md text-label-md hover:text-on-background transition-colors duration-200 flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">group</span>
          <span>Engineering Team</span>
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`w-2 h-2 rounded-full ${
            isOnline
              ? 'bg-match-emerald shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse'
              : 'bg-match-rose shadow-[0_0_8px_rgba(244,63,94,0.8)]'
          }`}
          aria-hidden="true"
        />
        <span className="font-label-sm text-label-sm text-on-surface-variant">
          {isOnline ? 'API Online' : 'API Offline'}
        </span>
      </div>
    </nav>
  );
}
