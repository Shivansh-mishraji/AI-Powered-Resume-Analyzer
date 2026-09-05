import { useState, useEffect } from 'react';

const TEAM_CARDS = [
  {
    id: 'shivansh',
    isLeader: true,
    tabLabel: '👑 Shivansh (Lead)',
    badgeText: '👑 Team Leader & Principal Architect',
    name: 'Shivansh Mishra',
    initials: 'SM',
    avatar: 'https://github.com/Shivansh-mishraji.png',
    role: 'Team Lead • Backend & AI System Architect',
    title: 'Principal System Architect',
    themeColor: 'text-secondary',
    borderClass: 'border-secondary/60',
    glowClass: 'shadow-glow-cyan',
    ringClass: 'ring-4 ring-secondary/50',
    badgeClass: 'bg-secondary/20 border-secondary/60 text-secondary',
    accentGradient: 'from-secondary/20 via-surface-container/95 to-primary/15',
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
    techStack: ['Python 3.13', 'FastAPI', 'Gemini 3.6', 'PyMuPDF', 'Pydantic', 'Render Cloud', 'REST Gateway'],
  },
  {
    id: 'harshvardhan',
    isLeader: false,
    tabLabel: '🎨 Harshvardhan (Frontend)',
    badgeText: '🎨 Frontend Architect & UI/UX Lead',
    name: 'Harshvardhan Sisodiya',
    initials: 'HS',
    avatar: 'https://github.com/harsh123-code.png',
    role: 'Frontend Architect • UI/UX Lead',
    title: 'Frontend & Visual Experience Architect',
    themeColor: 'text-primary',
    borderClass: 'border-primary/60',
    glowClass: 'shadow-glow-indigo',
    ringClass: 'ring-4 ring-primary/50',
    badgeClass: 'bg-primary/20 border-primary/60 text-primary',
    accentGradient: 'from-primary/20 via-surface-container/95 to-secondary/15',
    avatarBg: 'from-purple-500 to-indigo-600',
    github: 'https://github.com/harsh123-code',
    email: 'hsisodiya205@bbdu.ac.in',
    summary:
      'Designed and developed the modular React 19 single-page application: Nebula Aurora glassmorphism, 60/120 FPS hardware-synchronized score physics, interactive 180px SVG radial match gauge, multi-provider BYOK security vault, and responsive mobile drawers.',
    modules: [
      'React 19 + Vite Modular SPA Architecture',
      'Nebula Aurora Glassmorphism & 60fps rAF Physics',
      '180px SVG Radial Match Gauge & Visual Physics',
      'Multi-Provider BYOK Security Hub & Telemetry',
    ],
    techStack: ['React 19', 'Vite 6', 'Tailwind CSS', 'SVG Physics', 'sessionStorage Vault', 'Vercel Edge'],
  },
  {
    id: 'vishal',
    isLeader: false,
    tabLabel: '🛡️ Vishal (QA)',
    badgeText: '🛡️ QA Lead & Security Specialist',
    name: 'Vishal Patel',
    initials: 'VP',
    avatar: 'https://github.com/patelvishal-ji.png',
    role: 'QA Lead • Security & Automated Testing',
    title: 'QA & Security Engineer',
    themeColor: 'text-match-emerald',
    borderClass: 'border-match-emerald/60',
    glowClass: 'shadow-glow-emerald',
    ringClass: 'ring-4 ring-match-emerald/50',
    badgeClass: 'bg-match-emerald/20 border-match-emerald/60 text-match-emerald',
    accentGradient: 'from-emerald-500/20 via-surface-container/95 to-primary/10',
    avatarBg: 'from-emerald-500 to-teal-600',
    github: 'https://github.com/patelvishal-ji',
    email: 'patelvishal7800023@gmail.com',
    summary:
      'Formulated and executed the comprehensive automated testing strategy: 39/39 passing pytest test suite, mocked multi-provider AI failure handling (HTTP 401, 429, timeouts), input boundary sanitization, and automated markdown audit logging.',
    modules: [
      'Pytest Automated Test Suite (39/39 Passing Unit Tests)',
      'Multi-Provider Mock Tests (401/429 Fallback)',
      'Input Sanitization & Keyword Extraction Tests',
      'Automated Markdown Audit Log Generator',
    ],
    techStack: ['Pytest', 'Mock Engine', 'Edge Case Fuzzing', 'Audit Generator', 'CI/CD Pipelines'],
  },
  {
    id: 'sujeet',
    isLeader: false,
    tabLabel: '📑 Sujeet (Docs)',
    badgeText: '📑 Research Lead & Technical Writer',
    name: 'Sujeet Kannaujiya',
    initials: 'SK',
    avatar: 'https://github.com/sujeet-official.png',
    role: 'Research Lead • Technical Documentation',
    title: 'Research Analyst & Documentation Lead',
    themeColor: 'text-match-amber',
    borderClass: 'border-match-amber/60',
    glowClass: 'shadow-glow-amber',
    ringClass: 'ring-4 ring-match-amber/50',
    badgeClass: 'bg-match-amber/20 border-match-amber/60 text-match-amber',
    accentGradient: 'from-amber-500/20 via-surface-container/95 to-secondary/10',
    avatarBg: 'from-amber-500 to-orange-600',
    github: 'https://github.com/sujeet-official',
    email: 'sujeetkannujiya2004@bbdu.ac.in',
    summary:
      'Spearheaded academic research and comprehensive system documentation: investigated ATS text extraction methodologies, benchmarked FastAPI vs Flask throughput, authored the academic research dossier (RESEARCH.md), and codified ethical AI rubrics.',
    modules: [
      'ATS Parsing Strategies & In-Memory Privacy',
      'FastAPI vs. Flask Architecture Benchmarking',
      'Academic Research Dossier (RESEARCH.md)',
      'Ethical AI Rubric & Bias Prevention Specs',
    ],
    techStack: ['Academic Dossier', 'ATS Benchmarks', 'FastAPI vs Flask', 'Ethical AI Specs', 'API Reference'],
  },
];

export default function TeamModal({ isOpen, onClose }) {
  // Always reset to Card 0 (Shivansh Mishra) whenever modal opens
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setActiveCardIndex(0);
    }
  }, [isOpen]);

  // Keyboard navigation: Escape closes modal, Left/Right arrow keys navigate cards
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') {
        setActiveCardIndex((prev) => (prev + 1) % TEAM_CARDS.length);
      }
      if (e.key === 'ArrowLeft') {
        setActiveCardIndex((prev) => (prev - 1 + TEAM_CARDS.length) % TEAM_CARDS.length);
      }
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

  const currentCard = TEAM_CARDS[activeCardIndex];

  const handlePrev = () => {
    setActiveCardIndex((prev) => (prev - 1 + TEAM_CARDS.length) % TEAM_CARDS.length);
  };

  const handleNext = () => {
    setActiveCardIndex((prev) => (prev + 1) % TEAM_CARDS.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-modal-title"
    >
      <div
        className="glass-panel w-full max-w-5xl max-h-[94vh] overflow-y-auto p-5 sm:p-7 md:p-8 rounded-2xl relative border border-primary/30 shadow-2xl bg-surface-container/95 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg bg-surface-bright/50 text-on-surface-variant hover:text-on-background hover:bg-surface-bright transition-all z-20"
          aria-label="Close Team Modal"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">close</span>
        </button>

        {/* Modal Top Header */}
        <div className="mb-4 pr-12">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-primary font-label-sm text-xs font-semibold">
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">school</span>
              <span>BBD University • Academic Capstone 2026</span>
            </div>
            <a
              href="https://ai-powered-resume-analyzer-pi.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-label-sm text-xs font-semibold hover:bg-emerald-500/20 transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Website</span>
              <span className="material-symbols-outlined text-[12px]" aria-hidden="true">open_in_new</span>
            </a>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h2 id="team-modal-title" className="font-display-lg text-xl sm:text-2xl md:text-3xl font-bold text-on-background">
                Engineering Team Flashcards
              </h2>
              <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
                Conceived &amp; Directed by <strong className="text-secondary font-semibold">Shivansh Mishra</strong> • Use arrow keys or click tabs to explore.
              </p>
            </div>

            {/* Flashcard Quick Deck Navigator Pills */}
            <div className="flex items-center gap-1 bg-surface-container-low/90 p-1 rounded-xl border border-outline-variant/40 self-start sm:self-auto overflow-x-auto max-w-full">
              {TEAM_CARDS.map((card, idx) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setActiveCardIndex(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeCardIndex === idx
                      ? card.isLeader
                        ? 'bg-secondary text-surface font-bold shadow-glow-cyan'
                        : 'bg-primary text-white font-bold shadow-glow-sm'
                      : 'text-on-surface-variant hover:text-on-background hover:bg-surface-bright/40'
                  }`}
                >
                  <span>{card.tabLabel}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Carousel Control Bar */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/30 mb-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-secondary">
              Flash Card {activeCardIndex + 1} of {TEAM_CARDS.length}
            </span>
            <span className="text-outline">•</span>
            <span className="text-on-surface-variant hidden sm:inline">
              {currentCard.isLeader ? '⭐ Primary Project Focus' : 'Core Contributor'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-outline font-mono hidden md:inline">
              Use ← / → keys
            </span>
            <button
              type="button"
              onClick={handlePrev}
              className="p-1.5 rounded-lg bg-surface-bright/60 hover:bg-surface-bright text-on-surface-variant hover:text-on-background transition-all flex items-center gap-1"
              aria-label="Previous Flashcard"
            >
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">chevron_left</span>
              <span className="hidden sm:inline text-[11px] font-medium pr-1">Prev</span>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="p-1.5 rounded-lg bg-surface-bright/60 hover:bg-surface-bright text-on-surface-variant hover:text-on-background transition-all flex items-center gap-1"
              aria-label="Next Flashcard"
            >
              <span className="hidden sm:inline text-[11px] font-medium pl-1">Next</span>
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">chevron_right</span>
            </button>
          </div>
        </div>

        {/* 🌟 THE ACTIVE FLASHCARD 🌟 */}
        <div
          key={currentCard.id}
          className={`p-5 sm:p-7 rounded-2xl bg-gradient-to-br ${currentCard.accentGradient} border-2 ${currentCard.borderClass} ${currentCard.glowClass} relative overflow-hidden transition-all duration-300 animate-fade-in`}
        >
          {/* Ambient Glow in background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
            {/* Left Column: Large Clear Avatar Photo & Profile Badges */}
            <div className="flex flex-col items-center shrink-0 text-center w-full md:w-52">
              <div className="relative">
                <img
                  src={currentCard.avatar}
                  alt={currentCard.name}
                  className={`w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-2xl object-cover shadow-2xl ${currentCard.ringClass} bg-surface-container-high`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }
                  }}
                />
                <div
                  style={{ display: 'none' }}
                  className={`w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-2xl bg-gradient-to-br ${currentCard.avatarBg} items-center justify-center text-white font-black text-4xl shadow-2xl ${currentCard.ringClass}`}
                >
                  {currentCard.initials}
                </div>

                {currentCard.isLeader && (
                  <span className="absolute -top-2.5 -right-2.5 px-2.5 py-1 rounded-full bg-secondary text-surface text-[11px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 border border-white/20">
                    <span className="material-symbols-outlined text-[14px]" aria-hidden="true">stars</span>
                    <span>Lead</span>
                  </span>
                )}
              </div>

              {/* Verified Attribution Badge under Photo */}
              <div className="mt-3.5 w-full">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${currentCard.badgeClass} shadow-sm`}>
                  <span className="material-symbols-outlined text-[14px]" aria-hidden="true">
                    {currentCard.isLeader ? 'stars' : 'verified'}
                  </span>
                  <span>{currentCard.isLeader ? 'Team Leader' : 'Core Engineer'}</span>
                </span>
              </div>

              {/* Direct Profile Action Buttons */}
              <div className="mt-3 flex flex-col gap-1.5 w-full max-w-[180px]">
                <a
                  href={currentCard.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-bright/70 hover:bg-surface-bright text-on-surface-variant hover:text-on-background border border-outline-variant/60 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined text-[15px]" aria-hidden="true">code</span>
                  <span>GitHub Profile</span>
                </a>
                <a
                  href={`mailto:${currentCard.email}`}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface-container-lowest/70 hover:bg-surface-container-lowest text-on-surface-variant hover:text-on-background border border-outline-variant/40 text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                >
                  <span className="material-symbols-outlined text-[15px]" aria-hidden="true">mail</span>
                  <span>Direct Contact</span>
                </a>
              </div>
            </div>

            {/* Right Column: Title, Full Mission Summary, Deliverables & Tech Stack */}
            <div className="flex-1 w-full text-left">
              {/* Header Title & Role */}
              <div className="mb-3">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-display-lg text-2xl sm:text-3xl font-extrabold text-on-background">
                    {currentCard.name}
                  </h3>
                  <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold border ${currentCard.badgeClass}`}>
                    <span>{currentCard.badgeText}</span>
                  </span>
                </div>
                <div className={`text-sm sm:text-base font-semibold ${currentCard.themeColor}`}>
                  {currentCard.role}
                </div>
              </div>

              {/* Executive Architecture Summary */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/40 mb-4">
                <span className="text-[11px] uppercase tracking-wider text-outline font-bold block mb-1">
                  Role Overview &amp; Architectural Ownership
                </span>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {currentCard.summary}
                </p>
              </div>

              {/* Authored Modules & Deliverables */}
              <div className="mb-4">
                <span className="text-[11px] uppercase tracking-wider text-secondary font-bold block mb-2">
                  Core Modules &amp; Deliverables Authored
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {currentCard.modules.map((mod, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 bg-surface-container-low/70 p-2.5 rounded-lg border border-outline-variant/30"
                    >
                      <span className="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5" aria-hidden="true">
                        check_circle
                      </span>
                      <span className="font-medium text-on-background/90">{mod}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Technologies Tag Strip */}
              <div>
                <span className="text-[10px] uppercase tracking-wider text-outline font-bold block mb-1.5">
                  Technologies &amp; Frameworks Leveraged
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentCard.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md bg-surface-bright/50 border border-outline-variant/50 text-on-surface-variant text-[11px] font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Thumbnail Switcher (Flashcard Deck Overview) */}
        <div className="mt-5 pt-4 border-t border-outline-variant/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-outline font-bold">
              Team Flashcard Deck ({TEAM_CARDS.length} Members)
            </span>
            <span className="text-[11px] text-outline">
              Click any card to flip directly
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            {TEAM_CARDS.map((card, idx) => {
              const isActive = activeCardIndex === idx;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setActiveCardIndex(idx)}
                  className={`p-2.5 rounded-xl text-left transition-all flex items-center gap-2.5 border ${
                    isActive
                      ? card.isLeader
                        ? 'bg-secondary/15 border-secondary shadow-glow-cyan scale-[1.02]'
                        : 'bg-primary/15 border-primary shadow-glow-sm scale-[1.02]'
                      : 'bg-surface-container-low/60 border-outline-variant/40 hover:border-outline-variant hover:bg-surface-bright/30'
                  }`}
                >
                  <img
                    src={card.avatar}
                    alt={card.name}
                    className={`w-9 h-9 rounded-lg object-cover shrink-0 ${
                      isActive ? (card.isLeader ? 'ring-2 ring-secondary' : 'ring-2 ring-primary') : 'opacity-70'
                    }`}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextElementSibling) {
                        e.currentTarget.nextElementSibling.style.display = 'flex';
                      }
                    }}
                  />
                  <div
                    style={{ display: 'none' }}
                    className={`w-9 h-9 rounded-lg bg-gradient-to-br ${card.avatarBg} items-center justify-center text-white font-bold text-xs shrink-0`}
                  >
                    {card.initials}
                  </div>

                  <div className="truncate">
                    <div className="flex items-center gap-1">
                      <span className={`font-bold text-xs truncate ${isActive ? 'text-on-background' : 'text-on-surface-variant'}`}>
                        {card.name.split(' ')[0]} {card.name.split(' ')[1] ? card.name.split(' ')[1][0] + '.' : ''}
                      </span>
                      {card.isLeader && <span className="text-[11px]">👑</span>}
                    </div>
                    <span className="text-[10px] text-outline block truncate">
                      {card.isLeader ? 'Team Leader' : card.title.split(' ')[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

