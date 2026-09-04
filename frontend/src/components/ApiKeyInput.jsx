import { useState, useId } from 'react';

// Auto-detect provider from key prefix
function detectProvider(key) {
  if (!key || !key.trim()) return null;
  const k = key.trim();
  if (k.startsWith('AIza'))    return { name: 'Google Gemini', emoji: '🤖', model: 'gemini-3.6-flash', color: '#4285F4', link: 'https://aistudio.google.com/app/apikey' };
  if (k.startsWith('sk-ant-')) return { name: 'Anthropic Claude', emoji: '🧠', model: 'claude-opus-4', color: '#D4A574', link: 'https://console.anthropic.com/keys' };
  if (k.startsWith('sk-'))    return { name: 'OpenAI GPT', emoji: '⚡', model: 'gpt-4o', color: '#10A37F', link: 'https://platform.openai.com/api-keys' };
  return { name: 'Unknown Key', emoji: '❓', model: 'detecting...', color: '#888', link: null };
}

export default function ApiKeyInput({ value, onChange, onClear, disabled = false }) {
  const [showKey, setShowKey] = useState(false);
  const inputId = useId();
  const provider = detectProvider(value);

  return (
    <div className="form-field-card byok-field-card">
      <div className="byok-header-row">
        <div className="byok-title-group">
          <div className="byok-icon-box" aria-hidden="true">🔑</div>
          <div>
            <div className="byok-title-line">
              <label htmlFor={inputId} className="byok-heading">AI API Key</label>
              <span className="byok-badge">Optional • Bring Your Own Key</span>
            </div>
            <p className="byok-supporting-text">
              Works with <strong>Gemini</strong> (AIza...), <strong>OpenAI</strong> (sk-...), or <strong>Claude</strong> (sk-ant-...) keys.
              Better key = better AI model = richer analysis.
            </p>
          </div>
        </div>

        {/* Provider detection pill */}
        <div className={`byok-mode-pill ${value.trim() ? 'pill-ai-active' : 'pill-rule-active'}`}>
          <span className="mode-indicator-dot" aria-hidden="true" />
          <span>
            {provider
              ? `${provider.emoji} ${provider.name} · ${provider.model}`
              : 'Rule-Based Engine (No Key)'}
          </span>
        </div>
      </div>

      {/* Provider quality indicator */}
      {provider && (
        <div style={{
          display: 'flex', gap: '8px', alignItems: 'center',
          padding: '8px 12px', borderRadius: '8px', marginBottom: '8px',
          background: `${provider.color}15`, border: `1px solid ${provider.color}40`,
          fontSize: '12px', color: provider.color
        }}>
          <span>{provider.emoji}</span>
          <span>
            <strong>{provider.name}</strong> detected — using best available model:{' '}
            <strong>{provider.model}</strong> with automatic fallback chain
          </span>
        </div>
      )}

      <div className="byok-input-row">
        <div className="byok-input-wrapper">
          <span className="byok-lock-glyph" aria-hidden="true">🔒</span>
          <input
            id={inputId}
            type={showKey ? 'text' : 'password'}
            placeholder="Paste Gemini (AIza...), OpenAI (sk-...) or Claude (sk-ant-...) key"
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

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="byok-help-link" id="byok-help-desc">
            <span>Get Gemini Key</span><span aria-hidden="true">↗</span>
          </a>
          <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="byok-help-link">
            <span>Get OpenAI Key</span><span aria-hidden="true">↗</span>
          </a>
          <a href="https://console.anthropic.com/keys" target="_blank" rel="noopener noreferrer" className="byok-help-link">
            <span>Get Claude Key</span><span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
