import { useState, useId } from 'react';

export default function ApiKeyInput({ value, onChange, onClear, disabled = false }) {
  const [showKey, setShowKey] = useState(false);
  const inputId = useId();

  return (
    <div className="form-field-card byok-field-card">
      <div className="byok-header-row">
        <div className="byok-title-group">
          <div className="byok-icon-box" aria-hidden="true">🔑</div>
          <div>
            <div className="byok-title-line">
              <label htmlFor={inputId} className="byok-heading">Gemini API Key</label>
              <span className="byok-badge">Optional • Bring Your Own Key</span>
            </div>
            <p className="byok-supporting-text">
              Your API key is used for the analysis request and is not stored by this application.
            </p>
          </div>
        </div>

        <div className={`byok-mode-pill ${value.trim() ? 'pill-ai-active' : 'pill-rule-active'}`}>
          <span className="mode-indicator-dot" aria-hidden="true" />
          <span>{value.trim() ? 'AI Mode Active' : 'Rule-Based Engine (No Key)'}</span>
        </div>
      </div>

      <div className="byok-input-row">
        <div className="byok-input-wrapper">
          <span className="byok-lock-glyph" aria-hidden="true">🔒</span>
          <input
            id={inputId}
            type={showKey ? 'text' : 'password'}
            placeholder="Paste your Gemini API key (e.g. AIzaSy...)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="byok-text-input"
            autoComplete="off"
            spellCheck="false"
            disabled={disabled}
            aria-describedby="byok-help-desc"
          />

          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="btn-byok-toggle"
            disabled={disabled || !value}
            aria-label={showKey ? 'Hide API key' : 'Show API key in plain text'}
          >
            {showKey ? 'Hide' : 'Show'}
          </button>

          {value && (
            <button
              type="button"
              onClick={onClear}
              className="btn-byok-clear"
              disabled={disabled}
              aria-label="Clear API key from memory"
            >
              Clear
            </button>
          )}
        </div>

        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="byok-help-link"
          id="byok-help-desc"
        >
          <span>How to get a Gemini API key</span>
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </div>
  );
}
