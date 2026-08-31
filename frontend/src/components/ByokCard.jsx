import { useState } from 'react';

export default function ByokCard({ value, onChange, onClear, disabled = false }) {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="glass-panel rounded-xl p-6 relative">
      <h2 className="font-headline-md text-body-lg text-on-background mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-tertiary" aria-hidden="true">key</span>
        <span>Bring Your Own Key (BYOK)</span>
      </h2>

      <p className="font-body-md text-label-sm text-on-surface-variant mb-4">
        Provide your Gemini API key for local analysis. Your key never leaves your browser.
      </p>

      <div className="relative focus-glow rounded-lg transition-all duration-300 bg-surface border border-outline-variant flex items-center overflow-hidden group">
        <div className="pl-3 text-outline group-focus-within:text-secondary transition-colors">
          <span className="material-symbols-outlined text-[18px]" aria-hidden="true">password</span>
        </div>
        <input
          id="apiKeyInput"
          type={showKey ? 'text' : 'password'}
          placeholder="AIzaSy..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          autoComplete="off"
          spellCheck="false"
          className="w-full bg-transparent border-none text-on-background font-body-md text-label-md py-2.5 px-3 focus:ring-0 placeholder:text-outline/50 focus:outline-none"
        />
        <div className="pr-2 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={onClear}
              disabled={disabled}
              className="p-1 text-outline hover:text-on-background transition-colors"
              title="Clear"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">close</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            disabled={disabled}
            className="p-1 text-outline hover:text-on-background transition-colors"
            title="Toggle visibility"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
              {showKey ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center flex-wrap gap-2">
        <p className="font-label-sm text-[11px] text-match-emerald flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]" aria-hidden="true">money_off</span>
          <span>Zero billing expected on Free Tier</span>
        </p>
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="font-label-sm text-label-sm text-tertiary hover:text-tertiary-fixed transition-colors flex items-center gap-1"
        >
          <span>Google AI Studio</span>
          <span className="material-symbols-outlined text-[14px]" aria-hidden="true">open_in_new</span>
        </a>
      </div>
    </div>
  );
}
