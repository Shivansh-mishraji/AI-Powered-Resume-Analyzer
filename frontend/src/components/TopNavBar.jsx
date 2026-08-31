export default function TopNavBar({
  isOnline = true,
  onOpenAbout,
  onOpenHowItWorks,
  onOpenTeam,
}) {
  return (
    <nav className="top-nav-bar-fixed" role="navigation" aria-label="Main Navigation">
      <div className="nav-brand-group">
        <h1 className="nav-brand-title">AI Powered Resume Analyzer</h1>
      </div>

      <div className="nav-actions-group">
        <button
          type="button"
          onClick={onOpenAbout}
          className="nav-action-link"
        >
          About
        </button>
        <button
          type="button"
          onClick={onOpenHowItWorks}
          className="nav-action-link"
        >
          How it works
        </button>
        <a
          href="https://github.com/Shivansh-mishraji/AI-Powered-Resume-Analyzer"
          target="_blank"
          rel="noopener noreferrer"
          className="nav-action-link"
          aria-label="View source code on GitHub"
        >
          GitHub
        </a>
        <button
          type="button"
          onClick={onOpenTeam}
          className="nav-action-link nav-btn-team"
        >
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">group</span>
          <span>Engineering Team</span>
        </button>
      </div>

      <div className="nav-status-pill" title={isOnline ? 'FastAPI Backend Online' : 'FastAPI Backend Disconnected'}>
        <span className={`nav-pulse-dot ${isOnline ? 'dot-online' : 'dot-offline'}`} aria-hidden="true" />
        <span className="nav-status-text">{isOnline ? 'API Online' : 'Offline'}</span>
      </div>
    </nav>
  );
}
