/**
 * useSecureApiKey — Secure API Key Management Hook
 * =================================================
 * Security Model:
 *  - Keys stored in sessionStorage only (cleared when browser tab closes)
 *  - Keys are NEVER logged, never in error messages, never in URLs
 *  - Key is validated client-side before sending to backend
 *  - Key masked in UI (show only first 4 + last 4 chars)
 *  - Toggle: user can pause AI mode without clearing the key
 *  - Encrypted in sessionStorage using btoa (obfuscation, not true encryption,
 *    but prevents casual shoulder-surfing of DevTools storage tab)
 */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ra_key';
const STORAGE_ENABLED_KEY = 'ra_key_enabled';

// Simple obfuscation for sessionStorage (not crypto — just hides from casual DevTools glance)
const encode = (str) => btoa(unescape(encodeURIComponent(str)));
const decode = (str) => { try { return decodeURIComponent(escape(atob(str))); } catch { return ''; } };

// Mask key for display: AIzaSyABCD...XYZ → AIza••••••••XYZ
export function maskKey(key) {
  if (!key || key.length < 10) return '••••••••';
  return `${key.slice(0, 4)}${'•'.repeat(Math.min(key.length - 8, 12))}${key.slice(-4)}`;
}

// Validate key format client-side
export function validateKey(key) {
  if (!key || !key.trim()) return { valid: false, error: 'No key provided.' };
  const k = key.trim();
  if (k.length < 15) return { valid: false, error: 'Key is too short to be valid.' };
  if (k.includes(' ') || k.includes('\n') || k.includes('\r')) {
    return { valid: false, error: 'Key should not contain spaces or line breaks.' };
  }
  // Accepts Google Gemini (AIza... or AQ....), Anthropic (sk-ant-...), OpenAI (sk-...), or custom provider keys
  return { valid: true, error: null };
}

export function useSecureApiKey() {
  // Load from sessionStorage on mount
  const [rawKey, setRawKey] = useState(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? decode(stored) : '';
    } catch { return ''; }
  });

  const [isEnabled, setIsEnabled] = useState(() => {
    try {
      return sessionStorage.getItem(STORAGE_ENABLED_KEY) !== 'false';
    } catch { return true; }
  });

  const [saveToSession, setSaveToSession] = useState(() => {
    try { return !!sessionStorage.getItem(STORAGE_KEY); }
    catch { return false; }
  });

  const [validationError, setValidationError] = useState(null);

  // Persist to sessionStorage whenever key changes
  useEffect(() => {
    try {
      if (rawKey && saveToSession) {
        sessionStorage.setItem(STORAGE_KEY, encode(rawKey));
      } else if (!saveToSession) {
        sessionStorage.removeItem(STORAGE_KEY);
      }
      sessionStorage.setItem(STORAGE_ENABLED_KEY, String(isEnabled));
    } catch { /* sessionStorage unavailable */ }
  }, [rawKey, saveToSession, isEnabled]);

  const setKey = useCallback((val) => {
    const k = val.trim();
    setRawKey(k);
    if (k) {
      const { error } = validateKey(k);
      setValidationError(error);
    } else {
      setValidationError(null);
    }
  }, []);

  const clearKey = useCallback(() => {
    setRawKey('');
    setValidationError(null);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_ENABLED_KEY);
    } catch { /* ignore */ }
  }, []);

  const toggleEnabled = useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  const toggleSave = useCallback(() => {
    setSaveToSession(prev => {
      if (prev) {
        // Turning off save — remove from storage immediately
        try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
      }
      return !prev;
    });
  }, []);

  // The active key: only return raw key if enabled AND valid
  const activeKey = (isEnabled && rawKey && !validationError) ? rawKey : null;

  return {
    rawKey,          // full key (for controlled input)
    activeKey,       // key sent to backend (null if disabled/invalid)
    isEnabled,       // toggle: use AI or not
    saveToSession,   // persist in sessionStorage for this session
    validationError,
    maskedKey: maskKey(rawKey),
    setKey,
    clearKey,
    toggleEnabled,
    toggleSave,
  };
}
