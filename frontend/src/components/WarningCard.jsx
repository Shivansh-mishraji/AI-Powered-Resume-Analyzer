export default function WarningCard({ warnings = [] }) {
  const safeWarnings = Array.isArray(warnings) ? warnings : [];

  if (safeWarnings.length === 0) {
    return null;
  }

  return (
    <div className="warning-banner-container" role="alert" aria-live="polite">
      <div className="warning-banner-header">
        <span className="warning-banner-icon" aria-hidden="true">⚠️</span>
        <span className="warning-banner-title">Notice & Advisory</span>
      </div>
      <ul className="warning-items-list">
        {safeWarnings.map((warn, index) => (
          <li key={index} className="warning-item">
            {warn}
          </li>
        ))}
      </ul>
    </div>
  );
}
