import { useEffect } from 'react';

export default function AboutModal({ isOpen, onClose }) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-modal-title"
    >
      <div
        className="glass-panel w-full max-w-2xl p-6 md:p-8 rounded-2xl relative border border-primary/30 shadow-2xl bg-surface-container/95"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-surface-bright/50 text-on-surface-variant hover:text-on-background transition-colors"
          aria-label="Close Modal"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
        </button>

        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2.5 mb-3 pr-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-label-sm text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">info</span>
              <span>Project Architecture</span>
            </div>
            <a
              href="https://ai-powered-resume-analyzer-pi.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-label-sm text-xs font-semibold hover:bg-emerald-500/20 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Website</span>
              <span className="material-symbols-outlined text-[12px]" aria-hidden="true">open_in_new</span>
            </a>
          </div>
          <h2 id="about-modal-title" className="font-display-lg text-2xl font-bold text-on-background">
            About AI Powered Resume Analyzer
          </h2>
        </div>

        <div className="space-y-4 text-xs text-on-surface-variant leading-relaxed">
          <p>
            The <strong>AI-Powered Resume &amp; Job Description Analyzer</strong> is an end-to-end full-stack platform built for academic evaluation, viva presentation, and modern career intelligence.
          </p>

          <div className="p-4 rounded-xl bg-surface-container-low/80 border border-outline-variant/40 space-y-2">
            <h3 className="font-bold text-sm text-on-background">Core Architectural Pillars:</h3>
            <ul className="space-y-1.5 list-disc pl-5">
              <li><strong>Zero-Persistence Privacy:</strong> No database, no local cookies, and no disk logging. Resume byte streams and API keys reside exclusively in transient memory.</li>
              <li><strong>Multi-Provider AI &amp; Fallback Reliability:</strong> Supports Google Gemini (AQ./AIza), OpenAI GPT-4o, Anthropic Claude, Groq, and DeepSeek with automatic fallback to a deterministic keyword matching algorithm if offline or unkeyed.</li>
              <li><strong>Hermetic Verification:</strong> 39/39 automated pytest test suite ensuring zero hallucination, strict schema validation, and 100% test pass rate.</li>
            </ul>
          </div>

          <p className="text-outline">
            Developed by Shivansh Mishra, Harshvardhan Sisodiya, Vishal Patel, and Sujeet Kannaujiya (BBD University).
          </p>
        </div>
      </div>
    </div>
  );
}
