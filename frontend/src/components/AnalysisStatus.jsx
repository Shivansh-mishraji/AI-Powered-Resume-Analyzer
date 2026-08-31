export default function AnalysisStatus({ isAiPowered = false, confidence = 'high', filename = '' }) {
  const getConfidenceClass = (conf) => {
    switch (conf.toLowerCase()) {
      case 'high':
        return 'conf-high';
      case 'medium':
        return 'conf-medium';
      case 'low':
        return 'conf-low';
      default:
        return 'conf-neutral';
    }
  };

  return (
    <div className="analysis-status-strip" role="region" aria-label="Analysis metadata">
      <div className="status-left-group">
        <div className={`engine-mode-badge ${isAiPowered ? 'mode-ai-badge' : 'mode-rule-badge'}`}>
          <span className="mode-symbol" aria-hidden="true">
            {isAiPowered ? '🤖' : '⚙️'}
          </span>
          <span>{isAiPowered ? 'AI-Powered Analysis' : 'Rule-Based Analysis'}</span>
        </div>

        {confidence && (
          <div className={`confidence-badge ${getConfidenceClass(confidence)}`}>
            <span className="conf-label">Confidence:</span>
            <span className="conf-value">{confidence.toUpperCase()}</span>
          </div>
        )}
      </div>

      {filename && (
        <div className="analyzed-filename" title={filename}>
          <span className="file-doc-glyph" aria-hidden="true">📄</span>
          <span>{filename}</span>
        </div>
      )}
    </div>
  );
}
