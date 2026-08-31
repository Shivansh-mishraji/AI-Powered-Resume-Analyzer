import { useState, useId } from 'react';

export default function ByokCard({ value, onChange, onClear, disabled = false }) {
  const [showKey, setShowKey] = useState(false);
  const inputId = useId();

  return (
    <div className="glass-panel rounded-xl p-6 relative overflow-hidden group">
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-primary" aria-hidden="true">vpn_key</span>
        <h2 className="font-headline-md text-body-lg text-on-background">Bring Your Own Key (BYOK)</h2>
      </div>

      <p className="font-body-md text-label-sm text-on-surface-variant mb-4">
        Provide your Gemini API key for local analysis. Your key is stored in memory and never leaves your browser.
      </p>

      <div className="relative flex items-center mb-3">
        <input
          id={inputId}
          type={showKey ? 'text' : 'password'}
          placeholder="AIzaSy..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoComplete="off"
          spellCheck="false"
          className="w-full bg-surface-container-low/40 border border-outline-variant/50 rounded-lg px-4 py-2.5 text-on-background font-mono text-label-md placeholder-outline focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 focus-glow transition-all"
        />

        <div className="absolute right-2 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={onClear}
              disabled={disabled}
              className="p-1 hover:bg-surface-bright/50 rounded text-on-surface-variant hover:text-match-rose transition-colors text-xs font-bold"
              title="Clear API Key"
            >
              ✕
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            disabled={disabled || !value}
            className="p-1 hover:bg-surface-bright/50 rounded text-on-surface-variant hover:text-on-background transition-colors"
            title={showKey ? 'Hide Key' : 'Show Key'}
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              {showKey ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-label-sm text-[12px] flex-wrap gap-2">
        <span className="text-match-emerald/90 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]" aria-hidden="true">eco</span>
          <span>Zero billing expected on Free Tier</span>
        </span>
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary hover:underline flex items-center gap-1 font-medium"
        >
          <span>Get key from Google AI Studio</span>
          <span className="material-symbols-outlined text-[14px]" aria-hidden="true">open_in_new</span>
        </a>
      </div>
    </div>
  );
}
