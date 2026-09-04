export default function Header({ isOnline = true }) {
  return (
    <header className="app-header" role="banner">
      <div className="header-brand">
        <div className="brand-icon-wrapper" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
              fill="url(#brand-gradient)"
            />
            <defs>
              <linearGradient id="brand-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="0.5" stopColor="#818cf8" />
                <stop offset="1" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div className="brand-text-group">
          <span className="brand-title">ResumeAI</span>
          <span className="brand-tag">Career Intelligence</span>
        </div>
      </div>

      <nav className="header-nav" aria-label="Main Navigation">
        <div className="backend-status-indicator" title={isOnline ? 'Backend server connected' : 'Backend server offline'}>
          <span className={`status-dot ${isOnline ? 'dot-online' : 'dot-offline'}`} aria-hidden="true" />
          <span className="status-label">{isOnline ? 'API Connected' : 'Connecting...'}</span>
        </div>
        <a
          href="https://github.com/Shivansh-mishraji/AI-Powered-Resume-Analyzer"
          target="_blank"
          rel="noopener noreferrer"
          className="header-link-github"
          aria-label="View source code on GitHub"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span>GitHub</span>
        </a>
      </nav>
    </header>
  );
}
