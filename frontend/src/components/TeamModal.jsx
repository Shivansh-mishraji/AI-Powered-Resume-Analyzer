import { useEffect } from 'react';

const TEAM_LEADER = {
  name: 'Shivansh Mishra',
  initials: 'SM',
  role: 'Team Lead • Backend & AI System Architect',
  title: 'Team Leader & Principal Architect',
  color: 'border-secondary text-secondary bg-secondary/15',
  avatarBg: 'from-cyan-400 via-teal-500 to-blue-600',
  github: 'https://github.com/Shivansh-mishraji',
  email: 'tgsmishra@gmail.com',
  summary:
    'Conceived, engineered, and steered the complete system architecture: FastAPI REST Gateway, Multi-Provider AI Rubric Engine, in-memory PDF/DOCX byte streaming with zero disk persistence, deterministic fallback orchestration, and production deployments on Render & Vercel.',
  modules: [
    'FastAPI REST Gateway, Routing & CORS Security Architecture',
    'Multi-Provider AI Engine (Gemini 2.5/3.6, GPT-4o, Claude 3.5, Groq)',
    'In-Memory PyMuPDF Document Streaming (sort=True) & Zero Disk Retention',
    'Deterministic Rule-Based Fallback Orchestration & System Reliability',
  ],
};

const TEAM_MEMBERS = [
  {
    name: 'Harshvardhan Sisodiya',
    initials: 'HS',
    role: 'Frontend Architect • UI/UX Lead',
    color: 'border-primary text-primary bg-primary/10',
    avatarBg: 'from-purple-500 to-indigo-600',
    github: 'https://github.com/harsh123-code',
    email: 'hsisodiya205@bbdu.ac.in',
    modules: [
      'React 19 + Vite Modular SPA Architecture',
      'Nebula Aurora Glassmorphism & 60fps rAF Physics',
      '180px SVG Radial Match Gauge & Visual Physics',
      'Multi-Provider BYOK Security Hub & Telemetry',
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
      'Pytest Automated Test Suite (39/39 Passing)',
      'Multi-Provider Mock Tests (401/429 Fallback)',
      'Input Sanitization & Keyword Extraction Tests',
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
      'ATS Parsing Strategies & In-Memory Privacy',
      'FastAPI vs. Flask Architecture Benchmarking',
      'Academic Research Dossier (RESEARCH.md)',
      'Ethical AI Rubric & Bias Prevention Specs',
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
        className="glass-panel w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 md:p-8 rounded-2xl relative border border-primary/30 shadow-2xl bg-surface-container/95"
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
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2.5 mb-3 pr-10">
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
            Conceived, architected, developed, tested, and documented for Full-Stack AI Academic Evaluation.
          </p>
        </div>

        {/* Featured Team Leader Spotlight Card */}
        <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-secondary/15 via-surface-container/95 to-primary/10 border-2 border-secondary/50 shadow-glow-cyan relative overflow-hidden group/leader">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-glow-cyan shrink-0 ring-2 ring-secondary/40">
                {TEAM_LEADER.initials}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-display-lg text-xl sm:text-2xl font-bold text-on-background">
                    {TEAM_LEADER.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-secondary/20 border border-secondary/60 text-secondary text-xs font-bold shadow-sm">
                    <span className="material-symbols-outlined text-[14px]" aria-hidden="true">stars</span>
                    <span>Team Leader &amp; Principal Architect</span>
                  </span>
                </div>
                <div className="text-sm font-semibold text-secondary mb-1.5">
                  {TEAM_LEADER.role}
                </div>
                <p className="text-xs text-on-surface-variant max-w-2xl leading-relaxed">
                  {TEAM_LEADER.summary}
                </p>
              </div>
            </div>

            {/* Leader Links */}
            <div className="flex items-center gap-2 shrink-0 self-start md:self-auto">
              <a
                href={TEAM_LEADER.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-secondary/20 hover:bg-secondary/30 border border-secondary/50 text-secondary text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[15px]" aria-hidden="true">code</span>
                <span>GitHub Profile</span>
              </a>
              <a
                href={`mailto:${TEAM_LEADER.email}`}
                className="px-3.5 py-1.5 rounded-lg bg-surface-bright/70 hover:bg-surface-bright text-on-surface-variant hover:text-on-background border border-outline-variant/50 text-xs font-medium flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[15px]" aria-hidden="true">mail</span>
                <span>Contact</span>
              </a>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-secondary/20">
            <span className="text-[11px] uppercase tracking-wider text-secondary font-bold block mb-2">
              Key Architecture &amp; System Deliverables Authored
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {TEAM_LEADER.modules.map((mod, idx) => (
                <div key={idx} className="flex items-start gap-2 bg-surface-container-lowest/60 p-2.5 rounded-lg border border-secondary/20">
                  <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5" aria-hidden="true">check_circle</span>
                  <span className="font-medium text-on-background/90">{mod}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Divider for Core Contributors */}
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-outline">
            Core Engineering &amp; Research Contributors
          </span>
          <div className="h-px bg-outline-variant/30 flex-1" />
        </div>

        {/* 3 Contributor Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.name}
              className="p-5 rounded-xl bg-surface-container-low/60 border border-outline-variant/40 hover:border-primary/40 transition-all flex flex-col justify-between group/card"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${member.avatarBg} flex items-center justify-center text-white font-bold text-sm shadow-glow-sm shrink-0`}
                  >
                    {member.initials}
                  </div>
                  <div className="truncate">
                    <h4 className="font-bold text-sm text-on-background truncate">{member.name}</h4>
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold border ${member.color} mt-0.5`}>
                      {member.role}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-[10px] uppercase tracking-wider text-outline font-bold block mb-1.5">
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
