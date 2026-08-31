export default function PrivacyNotice() {
  return (
    <aside className="privacy-notice" aria-label="Privacy information">
      <div className="privacy-icon" aria-hidden="true">🔒</div>
      <p className="privacy-text">
        <strong>Privacy Assurance:</strong> Your resume is processed for analysis. The application is designed not to persist your resume or Gemini API key.
      </p>
    </aside>
  );
}
