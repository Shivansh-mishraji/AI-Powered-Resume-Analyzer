import { useEffect } from 'react';

const TEAM_MEMBERS = [
  {
    name: 'Shivansh Mishra',
    initials: 'SM',
    role: 'Team Lead • Backend & AI Architect',
    color: 'border-secondary text-secondary bg-secondary/10',
    avatarBg: 'from-cyan-500 to-blue-600',
    github: 'https://github.com/Shivansh-mishraji',
    email: 'tgsmishra@gmail.com',
    modules: [
      'FastAPI REST Gateway, Routing & CORS Architecture',
      'Multi-Provider AI Engine (Gemini 2.5/3.6, GPT-4o, Claude 3.5, Groq)',
      'In-Memory PyMuPDF Document Parsing (sort=True)',
      'Deterministic Rule-Based Fallback Orchestration',
    ],
  },
  {
    name: 'Harshvardhan Sisodiya',
    initials: 'HS',
    role: 'Frontend Architect • UI/UX Lead',
    color: 'border-primary text-primary bg-primary/10',
    avatarBg: 'from-purple-500 to-indigo-600',
    github: 'https://github.com/harsh123-code',
    email: 'hsisodiya205@bbdu.ac.in',
    modules: [
      'React 19 + Vite Modular Single-Page Application (SPA)',
      'Nebula Aurora Glassmorphism & 60fps rAF Animation Engine',
      '180px SVG Radial Match Gauge & Count-Up Physics',
      'Multi-Provider BYOK Security Hub & Live Telemetry',
    ],
  },
  {
    name: 'Vishal Patel',
    initials: 'VP',
    role: 'QA Lead • Security & Automated Testing',
    color: 'border-match-emerald text-match-emerald bg-match-emerald/10',
    avatarBg: 'from-emerald-500 to-teal-600',
    github: 'https://github.com/patelvishal-ji',
    email: 'patelvishal7800023@gmail.com',
    modules: [
      'Pytest Automated Test Suite (39/39 Passing Unit Tests)',
      'Mocked Multi-Provider AI Tests (401, 429, Fallback Recovery)',
      'Text Sanitization & Keyword Extraction Coverage',
      'Automated Markdown Audit Log Generator',
    ],
  },
  {
    name: 'Sujeet Kannaujiya',
    initials: 'SK',
    role: 'Research Lead • Technical Documentation',
    color: 'border-match-amber text-match-amber bg-match-amber/10',
    avatarBg: 'from-amber-500 to-orange-600',
    github: 'https://github.com/sujeet-official',
    email: 'sujeetkannujiya2004@bbdu.ac.in',
    modules: [
      'ATS Parsing Strategies & In-Memory Privacy Studies',
      'FastAPI vs. Flask Comparative Architecture Benchmarking',
      'Academic Research Dossier (RESEARCH.md)',
      'Ethical AI Rubric & Non-Discriminatory Guidelines',
    ],
  },
];

export default function TeamModal({ isOpen, onClose }) {
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
      aria-labelledby="team-modal-title"
    >
      <div
        className="glass-panel w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-2xl relative border border-primary/30 shadow-2xl bg-surface-container/90"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-surface-bright/50 text-on-surface-variant hover:text-on-background hover:bg-surface-bright transition-all"
          aria-label="Close Team Modal"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
        </button>

        {/* Modal Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary font-label-sm text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">school</span>
              <span>BBD University • Academic Capstone 2026</span>
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
          <h2 id="team-modal-title" className="font-display-lg text-2xl md:text-3xl font-bold text-on-background">
            Engineering Team &amp; Technical Attribution
          </h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Designed, developed, tested, and documented for Full-Stack AI Academic Evaluation.
          </p>
        </div>

        {/* Developer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.name}
              className="p-5 rounded-xl bg-surface-container-low/60 border border-outline-variant/40 hover:border-primary/40 transition-all flex flex-col justify-between group/card"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-white font-bold text-base shadow-glow-sm shrink-0`}
                  >
                    {member.initials}
                  </div>
                  <div className="truncate">
                    <h3 className="font-bold text-base text-on-background truncate">{member.name}</h3>
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${member.color} mt-0.5`}>
                      {member.role}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-[11px] uppercase tracking-wider text-outline font-bold block mb-1.5">
                    Core Modules Authored
                  </span>
                  <ul className="space-y-1 text-xs text-on-surface-variant/90">
                    {member.modules.map((mod, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-secondary mt-0.5">•</span>
                        <span>{mod}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-3 border-t border-outline-variant/30 flex items-center gap-3 text-xs">
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary hover:underline flex items-center gap-1 font-medium"
                >
                  <span className="material-symbols-outlined text-[14px]" aria-hidden="true">code</span>
                  <span>GitHub</span>
                </a>
                <span className="text-outline">•</span>
                <a
                  href={`mailto:${member.email}`}
                  className="text-on-surface-variant hover:text-on-background flex items-center gap-1 font-medium"
                >
                  <span className="material-symbols-outlined text-[14px]" aria-hidden="true">mail</span>
                  <span>Email</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
