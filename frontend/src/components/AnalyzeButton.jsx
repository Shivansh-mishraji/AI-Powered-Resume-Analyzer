export default function AnalyzeButton({ onClick, loading = false, disabled = false }) {
  return (
    <div className="analyze-action-wrapper">
      <button
        type="button"
        onClick={onClick}
        className={`btn-primary-analyze ${loading ? 'btn-is-loading' : ''}`}
        disabled={disabled || loading}
        aria-busy={loading}
      >
        {loading ? (
          <span className="btn-loading-content">
            <span className="spinner-circle" aria-hidden="true" />
            <span>Analyzing Resume...</span>
          </span>
        ) : (
          <span className="btn-idle-content">
            <span className="btn-glyph" aria-hidden="true">✦</span>
            <span>Analyze Resume</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </span>
        )}
      </button>
    </div>
  );
}
