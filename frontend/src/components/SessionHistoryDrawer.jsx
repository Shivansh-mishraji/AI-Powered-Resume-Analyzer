import { useEffect } from 'react';

export default function SessionHistoryDrawer({
  isOpen,
  onClose,
  history = [],
  onSelectHistoryItem,
  onClearHistory,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-drawer-title"
    >
      <div
        className="w-full max-w-md h-full bg-surface-container/95 border-l border-outline-variant/40 p-6 flex flex-col justify-between shadow-2xl glassmorphism-refraction animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary" aria-hidden="true">history</span>
              <h2 id="history-drawer-title" className="font-bold text-lg text-on-background">
                Session History
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-surface-bright text-on-surface-variant hover:text-on-background transition-colors"
              aria-label="Close History Drawer"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
            </button>
          </div>

          <p className="text-xs text-on-surface-variant mb-4">
            Audits performed during your active browser tab session (RAM-only).
          </p>

          {history.length === 0 ? (
            <div className="text-center py-12 text-outline">
              <span className="material-symbols-outlined text-4xl mb-2" aria-hidden="true">folder_open</span>
              <p className="text-sm">No resumes audited yet in this session.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
              {history.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onSelectHistoryItem(item);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl bg-surface-container-low/80 border border-outline-variant/40 hover:border-secondary/50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-sm text-on-background truncate max-w-[200px]">
                      {item.filename || 'resume.pdf'}
                    </span>
                    <span className="font-bold text-sm text-secondary">{item.score}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                    <span>{item.is_ai_powered ? '🤖 Gemini AI' : '⚙️ Rule-Engine'}</span>
                    <span>{new Date(item.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={onClearHistory}
            className="w-full py-2.5 rounded-lg border border-match-rose/40 text-match-rose hover:bg-match-rose/10 font-label-sm text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden="true">delete_sweep</span>
            <span>Clear Session History</span>
          </button>
        )}
      </div>
    </div>
  );
}
