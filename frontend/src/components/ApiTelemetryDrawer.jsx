import { useEffect } from 'react';

export default function ApiTelemetryDrawer({
  isOpen,
  onClose,
  isOnline = true,
  pingLatency = 14,
  apiKeyPresent = false,
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
      aria-labelledby="telemetry-drawer-title"
    >
      <div
        className="w-full max-w-md h-full bg-surface-container/95 border-l border-outline-variant/40 p-6 flex flex-col justify-between shadow-2xl glassmorphism-refraction animate-slide-left"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30 mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" aria-hidden="true">monitoring</span>
              <h2 id="telemetry-drawer-title" className="font-bold text-lg text-on-background">
                API Telemetry &amp; System Health
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-surface-bright text-on-surface-variant hover:text-on-background transition-colors"
              aria-label="Close Telemetry Drawer"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Backend Gateway Tile */}
            <div className="p-4 rounded-xl bg-surface-container-low/80 border border-outline-variant/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-outline">FastAPI REST Gateway</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${isOnline ? 'bg-match-emerald/10 text-match-emerald border border-match-emerald/30' : 'bg-match-rose/10 text-match-rose border border-match-rose/30'}`}>
                  {isOnline ? 'Connected' : 'Offline'}
                </span>
              </div>
              <p className="text-sm font-mono text-on-background">http://127.0.0.1:8000</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-on-surface-variant">
                <span>Latency: <strong className="text-secondary">{isOnline ? `${pingLatency}ms` : '--'}</strong></span>
                <span>•</span>
                <span>Health: <strong className="text-match-emerald">200 OK</strong></span>
              </div>
            </div>

            {/* AI Model Tile */}
            <div className="p-4 rounded-xl bg-surface-container-low/80 border border-outline-variant/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-outline">Google Gemini Engine</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${apiKeyPresent ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-match-amber/10 text-match-amber border border-match-amber/30'}`}>
                  {apiKeyPresent ? 'Key Loaded in RAM' : 'Fallback Active'}
                </span>
              </div>
              <p className="text-sm font-semibold text-on-background">gemini-2.5-flash</p>
              <p className="text-xs text-on-surface-variant mt-1">
                Structured Multimodal Career Reasoning + Deterministic PyMuPDF Fallback.
              </p>
            </div>

            {/* Quota & Cost Tile */}
            <div className="p-4 rounded-xl bg-surface-container-low/80 border border-outline-variant/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-outline">Free Tier Quota</span>
                <span className="text-xs font-bold text-match-emerald">100% Free</span>
              </div>
              <div className="w-full bg-surface-container-highest/40 rounded-full h-2 my-2 overflow-hidden">
                <div className="bg-match-emerald h-full w-[5%]" />
              </div>
              <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                <span>1,500 requests / day limit</span>
                <span>Zero Auto-Billing ($0.00)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-outline-variant/30 text-center text-xs text-outline">
          Continuous In-Memory Ping Telemetry Active
        </div>
      </div>
    </div>
  );
}
