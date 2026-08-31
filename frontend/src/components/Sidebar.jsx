export default function Sidebar({
  activeView = 'analyzer',
  onOpenHistory,
  onOpenTelemetry,
  onOpenTeam,
  isAiPowered = false,
}) {
  return (
    <aside className="app-sidebar" aria-label="Main Sidebar Navigation">
      {/* Brand Card */}
      <div className="sidebar-brand-card">
        <div className="sidebar-brand-content">
          <div className="sidebar-brand-icon" aria-hidden="true">
            <span className="material-symbols-outlined text-[24px]">terminal</span>
          </div>
          <div className="sidebar-brand-text">
            <h2 className="sidebar-brand-name">ResumeAI Engine</h2>
            <div className="sidebar-engine-status">
              <span className="status-indicator-dot online" aria-hidden="true" />
              <p className="sidebar-engine-host">Local: 127.0.0.1:8000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav-list" aria-label="Sidebar Links">
        <button
          type="button"
          className={`sidebar-nav-btn ${activeView === 'analyzer' ? 'nav-btn-active' : ''}`}
          aria-current={activeView === 'analyzer' ? 'page' : undefined}
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">troubleshoot</span>
          <span>Resume Analyzer</span>
        </button>

        <button
          type="button"
          onClick={onOpenHistory}
          className="sidebar-nav-btn"
          aria-label="View In-Memory Session History"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">history</span>
          <span>Session History</span>
        </button>

        <button
          type="button"
          onClick={onOpenTelemetry}
          className="sidebar-nav-btn"
          aria-label="View Live API Telemetry & Health"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">monitoring</span>
          <span>API Telemetry</span>
        </button>

        <button
          type="button"
          onClick={onOpenTeam}
          className="sidebar-nav-btn"
          aria-label="View Engineering Team & Roles"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">groups</span>
          <span>Team &amp; Roles</span>
        </button>
      </nav>

      {/* Engine Status Bottom Telemetry */}
      <div className="sidebar-footer-telemetry">
        <div className="telemetry-box">
          <div className="telemetry-header-row">
            <span className="telemetry-label">Engine Status</span>
            <span className="status-indicator-dot online shadow-glow-cyan" aria-hidden="true" />
          </div>
          <div className="telemetry-body-row">
            <span className="telemetry-model-name">
              {isAiPowered ? 'Gemini 2.5 Flash + AST' : 'Deterministic AST Rule Engine'}
            </span>
            <span className="telemetry-plan-status">
              {isAiPowered ? 'Free Tier Active • $0.00 Risk' : 'In-Memory Fallback Active'}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
