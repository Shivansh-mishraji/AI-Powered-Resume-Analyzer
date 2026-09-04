import { useState, useId } from 'react';
import { maskKey, validateKey } from '../hooks/useSecureApiKey';

function detectProvider(key) {
  if (!key || !key.trim()) return null;
  const k = key.trim();
  if (k.startsWith('AIza') || k.startsWith('AQ.')) return { name: 'Google Gemini', emoji: '🤖', model: 'gemini-3.6-flash', color: '#4285F4', link: 'https://aistudio.google.com/app/apikey' };
  if (k.startsWith('sk-ant-')) return { name: 'Anthropic Claude', emoji: '🧠', model: 'claude-opus-4', color: '#D4A574', link: 'https://console.anthropic.com/keys' };
  if (k.startsWith('sk-'))    return { name: 'OpenAI GPT-4o', emoji: '⚡', model: 'gpt-4o', color: '#10A37F', link: 'https://platform.openai.com/api-keys' };
  if (k.length >= 15)         return { name: 'AI Key (BYOK)', emoji: '✨', model: 'Auto-Routing', color: '#A855F7', link: 'https://aistudio.google.com/app/apikey' };
  return null;
}

export default function ApiKeyInput({ value, onChange, onClear, isEnabled, saveToSession, onToggleEnabled, onToggleSave, disabled = false }) {
  const [showKey, setShowKey] = useState(false);
  const inputId = useId();
  const provider = detectProvider(value);
  const { error: validationError } = value ? validateKey(value) : { error: null };
  const isValid = value && !validationError;

  return (
    <div className="form-field-card byok-field-card" style={{ border: isEnabled && isValid ? '1px solid #22c55e40' : undefined }}>

      {/* ── Header Row ── */}
      <div className="byok-header-row">
        <div className="byok-title-group">
          <div className="byok-icon-box" aria-hidden="true">🔑</div>
          <div>
            <div className="byok-title-line">
              <label htmlFor={inputId} className="byok-heading">AI API Key</label>
              <span className="byok-badge">Gemini · OpenAI · Claude</span>
            </div>
            <p className="byok-supporting-text">
              Key never stored server-side. Cleared automatically when tab closes.
            </p>
          </div>
        </div>

        {/* Status pill */}
        <div className={`byok-mode-pill ${isEnabled && isValid ? 'pill-ai-active' : 'pill-rule-active'}`}>
          <span className="mode-indicator-dot" aria-hidden="true" />
          <span>
            {isEnabled && isValid && provider
              ? `${provider.emoji} ${provider.name}`
              : isEnabled && value && validationError
              ? '⚠️ Invalid Key'
              : '⚙️ Rule-Based (No Key)'}
          </span>
        </div>
      </div>

      {/* ── Provider Badge ── */}
      {provider && isValid && (
        <div style={{
          display: 'flex', gap: '8px', alignItems: 'center',
          padding: '8px 12px', borderRadius: '8px', marginBottom: '10px',
          background: `${provider.color}15`, border: `1px solid ${provider.color}40`,
          fontSize: '12px', color: provider.color, fontWeight: 500
        }}>
          <span>{provider.emoji}</span>
          <span>
            <strong>{provider.name}</strong> · Best model: <strong>{provider.model}</strong> with auto-fallback chain
          </span>
          <span style={{ marginLeft: 'auto', opacity: 0.6, fontSize: '11px' }}>🔒 Secured</span>
        </div>
      )}

      {/* ── Validation Error ── */}
      {value && validationError && (
        <div style={{
          padding: '8px 12px', borderRadius: '8px', marginBottom: '10px',
          background: '#ef444415', border: '1px solid #ef444440',
          fontSize: '12px', color: '#ef4444'
        }}>
          ⚠️ {validationError}
        </div>
      )}

      {/* ── Input Row ── */}
      <div className="byok-input-row">
        <div className="byok-input-wrapper">
          <span className="byok-lock-glyph" aria-hidden="true">🔒</span>
          <input
            id={inputId}
            type={showKey ? 'text' : 'password'}
            placeholder="AQ... / AIza... (Gemini)  ·  sk-... (OpenAI)  ·  sk-ant-... (Claude)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="byok-text-input"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            disabled={disabled}
            style={{ borderColor: validationError && value ? '#ef4444' : undefined }}
          />
          <button type="button" onClick={() => setShowKey(p => !p)}
            className="btn-byok-toggle" disabled={disabled || !value}
            aria-label={showKey ? 'Hide key' : 'Reveal key'}>
            {showKey ? 'Hide' : 'Show'}
          </button>
          {value && (
            <button type="button" onClick={onClear} className="btn-byok-clear"
              disabled={disabled} aria-label="Erase key from memory">
              Erase
            </button>
          )}
        </div>

        {/* Masked key preview */}
        {isValid && !showKey && (
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', letterSpacing: '1px' }}>
            Stored: <code style={{ color: '#94a3b8' }}>{maskKey(value)}</code>
          </div>
        )}
      </div>

      {/* ── Security Controls ── */}
      <div style={{
        display: 'flex', gap: '12px', marginTop: '12px', flexWrap: 'wrap',
        paddingTop: '12px', borderTop: '1px solid #1e293b'
      }}>

        {/* Toggle: Use AI / Pause */}
        <button
          type="button"
          onClick={onToggleEnabled}
          disabled={disabled || !isValid}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '7px 14px', borderRadius: '8px', cursor: isValid ? 'pointer' : 'not-allowed',
            border: `1px solid ${isEnabled && isValid ? '#22c55e60' : '#334155'}`,
            background: isEnabled && isValid ? '#22c55e15' : '#0f172a',
            color: isEnabled && isValid ? '#22c55e' : '#64748b',
            fontSize: '12px', fontWeight: 600, transition: 'all 0.2s'
          }}
        >
          <span style={{
            width: '32px', height: '18px', borderRadius: '9px', display: 'flex',
            alignItems: 'center', padding: '2px',
            background: isEnabled && isValid ? '#22c55e' : '#334155',
            transition: 'background 0.2s'
          }}>
            <span style={{
              width: '14px', height: '14px', borderRadius: '50%', background: 'white',
              transform: isEnabled && isValid ? 'translateX(14px)' : 'translateX(0)',
              transition: 'transform 0.2s'
            }} />
          </span>
          {isEnabled && isValid ? '🤖 AI Mode ON' : '⚙️ AI Mode OFF'}
        </button>

        {/* Toggle: Save for session */}
        <button
          type="button"
          onClick={onToggleSave}
          disabled={disabled || !isValid}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '7px 14px', borderRadius: '8px', cursor: isValid ? 'pointer' : 'not-allowed',
            border: `1px solid ${saveToSession ? '#3b82f660' : '#334155'}`,
            background: saveToSession ? '#3b82f615' : '#0f172a',
            color: saveToSession ? '#3b82f6' : '#64748b',
            fontSize: '12px', fontWeight: 600, transition: 'all 0.2s'
          }}
        >
          <span style={{
            width: '32px', height: '18px', borderRadius: '9px', display: 'flex',
            alignItems: 'center', padding: '2px',
            background: saveToSession ? '#3b82f6' : '#334155',
            transition: 'background 0.2s'
          }}>
            <span style={{
              width: '14px', height: '14px', borderRadius: '50%', background: 'white',
              transform: saveToSession ? 'translateX(14px)' : 'translateX(0)',
              transition: 'transform 0.2s'
            }} />
          </span>
          {saveToSession ? '💾 Remember this session' : '🚫 Don\'t remember'}
        </button>

        {/* Security notice */}
        <div style={{ marginLeft: 'auto', fontSize: '11px', color: '#475569', display: 'flex', alignItems: 'center', gap: '4px' }}>
          🛡️ Never sent to our servers unencrypted · Cleared on tab close
        </div>
      </div>

      {/* ── Get Key Links ── */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="byok-help-link">
          🤖 Get Gemini Key ↗
        </a>
        <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="byok-help-link">
          ⚡ Get OpenAI Key ↗
        </a>
        <a href="https://console.anthropic.com/keys" target="_blank" rel="noopener noreferrer" className="byok-help-link">
          🧠 Get Claude Key ↗
        </a>
      </div>
    </div>
  );
}
