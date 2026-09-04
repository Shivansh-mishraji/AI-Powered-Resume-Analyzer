export default function TopNavBar({
  isOnline = true,
  onOpenAbout,
  onOpenHowItWorks,
  onOpenTeam,
  onToggleMobileMenu,
}) {
  return (
    <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-background/80 backdrop-blur-3xl border-b border-surface-container-highest/50">
      <div className="w-full px-4 md:px-8 py-3.5 flex justify-between items-center">
        {/* Left: Mobile Menu Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-on-surface-variant hover:text-on-background hover:bg-surface-bright/50 transition-colors flex items-center justify-center"
            aria-label="Toggle Navigation Menu"
          >
            <span className="material-symbols-outlined text-[24px]" aria-hidden="true">menu</span>
          </button>

          <span className="font-display-lg text-lg sm:text-xl font-bold tracking-tight text-on-background">
            AI Powered Resume Analyzer
          </span>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-6">
          <button
            type="button"
            onClick={onOpenAbout}
            className="text-on-surface-variant font-label-md text-sm hover:text-on-background transition-colors duration-200"
          >
            About
          </button>
          <button
            type="button"
            onClick={onOpenHowItWorks}
            className="text-on-surface-variant font-label-md text-sm hover:text-on-background transition-colors duration-200"
          >
            How it works
          </button>
          <a
            href="https://github.com/Shivansh-mishraji/AI-Powered-Resume-Analyzer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-on-surface-variant font-label-md text-sm hover:text-on-background transition-colors duration-200"
          >
            GitHub
          </a>
          <button
            type="button"
            onClick={onOpenTeam}
            className="text-on-surface-variant font-label-md text-sm hover:text-on-background transition-colors duration-200 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">group</span>
            <span>Engineering Team</span>
          </button>
        </div>

        {/* Right: API Health Status */}
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline
                ? 'bg-match-emerald shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse'
                : 'bg-match-rose shadow-[0_0_8px_rgba(244,63,94,0.8)]'
            }`}
            aria-hidden="true"
          />
          <span className="font-label-sm text-xs text-on-surface-variant hidden sm:inline-block">
            {isOnline ? 'API Online' : 'API Offline'}
          </span>
        </div>
      </div>
    </nav>
  );
}
