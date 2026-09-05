import { useEffect } from 'react';

const STEPS = [
  {
    step: '01',
    title: 'Upload Resume Document',
    desc: 'Drag and drop your PDF or DOCX file (up to 5MB). PyMuPDF parses the raw byte stream in RAM with zero disk persistence.',
    icon: 'upload_file',
  },
  {
    step: '02',
    title: 'Provide Target Job Description',
    desc: 'Paste the target job description or choose a quick template (Python Backend, Full-Stack, AI/ML).',
    icon: 'text_snippet',
  },
  {
    step: '03',
    title: 'Multi-Provider BYOK Key (Optional)',
    desc: 'Use Google Gemini (free tier), OpenAI GPT-4o, Anthropic Claude, Groq, or DeepSeek. Keys stay in RAM only, zero disk storage.',
    icon: 'vpn_key',
  },
  {
    step: '04',
    title: 'Comprehensive Career Intelligence',
    desc: 'Receive match score, verified skills, skill gaps, executive summary, and actionable recommendations in under 3 seconds.',
    icon: 'insights',
  },
];

export default function HowItWorksModal({ isOpen, onClose }) {
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
      aria-labelledby="how-it-works-title"
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/30 text-secondary font-label-sm text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">psychology_alt</span>
              <span>4-Step Workflow</span>
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
          <h2 id="how-it-works-title" className="font-display-lg text-2xl font-bold text-on-background">
            How ResumeAI Operates
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {STEPS.map((s) => (
            <div key={s.step} className="p-4 rounded-xl bg-surface-container-low/80 border border-outline-variant/40">
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 text-primary font-bold text-xs flex items-center justify-center">
                  {s.step}
                </span>
                <span className="material-symbols-outlined text-secondary text-[20px]" aria-hidden="true">
                  {s.icon}
                </span>
              </div>
              <h3 className="font-bold text-sm text-on-background mb-1">{s.title}</h3>
              <p className="text-xs text-on-surface-variant/90 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
