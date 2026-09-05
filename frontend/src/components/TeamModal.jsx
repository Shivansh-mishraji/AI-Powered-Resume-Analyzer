import { useState, useEffect, useRef } from 'react';

const TEAM_CARDS = [
  {
    id: 'shivansh',
    number: '01',
    isLeader: true,
    tabLabel: '👑 Shivansh',
    badgeText: '👑 Team Leader & Principal Architect',
    name: 'Shivansh Mishra',
    initials: 'SM',
    avatar: 'https://github.com/Shivansh-mishraji.png',
    role: 'Team Lead • Backend & AI System Architect',
    themeColor: 'text-secondary',
    borderClass: 'border-secondary/70',
    glowClass: 'shadow-[0_0_40px_rgba(56,189,248,0.35)]',
    ringClass: 'ring-4 ring-secondary/70 shadow-glow-cyan',
    orbBg: 'bg-secondary',
    badgeClass: 'bg-secondary/20 border-secondary/60 text-secondary',
    verticalBg: 'from-secondary/15 via-surface-card/95 to-primary/10',
    github: 'https://github.com/Shivansh-mishraji',
    email: 'tgsmishra@gmail.com',
    summary:
      'Conceived, engineered, and steered the complete platform architecture: FastAPI REST Gateway, Multi-Provider AI Rubric Engine, in-memory zero-disk document streaming, and production cloud deployments on Render & Vercel.',
    deliverables: [
      { icon: 'bolt', text: 'FastAPI REST Gateway & Routing Architecture' },
      { icon: 'psychology', text: 'Multi-Provider AI Engine (Gemini 3.6, GPT-4o, Claude)' },
      { icon: 'memory', text: 'In-Memory Zero-Disk PyMuPDF Stream (sort=True)' },
      { icon: 'shield', text: 'Deterministic Rule-Based Fallback Orchestration' },
    ],
    techStack: ['Python 3.13', 'FastAPI', 'Gemini 3.6', 'PyMuPDF', 'Pydantic', 'Render Cloud'],
  },
  {
    id: 'harshvardhan',
    number: '02',
    isLeader: false,
    tabLabel: '🎨 Harshvardhan',
    badgeText: '🎨 Frontend Architect & UI/UX Lead',
    name: 'Harshvardhan Sisodiya',
    initials: 'HS',
    avatar: 'https://github.com/harsh123-code.png',
    role: 'Frontend Architect • UI/UX Lead',
    themeColor: 'text-primary',
    borderClass: 'border-primary/70',
    glowClass: 'shadow-[0_0_40px_rgba(99,102,241,0.35)]',
    ringClass: 'ring-4 ring-primary/70 shadow-glow-sm',
    orbBg: 'bg-primary',
    badgeClass: 'bg-primary/20 border-primary/60 text-primary',
    verticalBg: 'from-primary/15 via-surface-card/95 to-secondary/10',
    github: 'https://github.com/harsh123-code',
    email: 'hsisodiya205@bbdu.ac.in',
    summary:
      'Architected the React 19 single-page application with GPU-accelerated Nebula Aurora glassmorphism, 60/120 FPS hardware-synchronized score physics, 180px SVG radial match gauge, and BYOK security vault.',
    deliverables: [
      { icon: 'web', text: 'React 19 + Vite Modular SPA Architecture' },
      { icon: 'auto_awesome', text: 'Nebula Aurora Glassmorphism & 60fps Physics' },
      { icon: 'speed', text: '180px SVG Radial Match Gauge & Count-Up' },
      { icon: 'key', text: 'Multi-Provider BYOK Security Hub & Telemetry' },
    ],
    techStack: ['React 19', 'Vite 6', 'Tailwind CSS', 'SVG Physics', 'Vercel Edge'],
  },
  {
    id: 'vishal',
    number: '03',
    isLeader: false,
    tabLabel: '🛡️ Vishal',
    badgeText: '🛡️ QA Lead & Security Specialist',
    name: 'Vishal Patel',
    initials: 'VP',
    avatar: 'https://github.com/patelvishal-ji.png',
    role: 'QA Lead • Security & Automated Testing',
    themeColor: 'text-match-emerald',
    borderClass: 'border-match-emerald/70',
    glowClass: 'shadow-[0_0_40px_rgba(52,211,153,0.35)]',
    ringClass: 'ring-4 ring-match-emerald/70 shadow-glow-sm',
    orbBg: 'bg-match-emerald',
    badgeClass: 'bg-match-emerald/20 border-match-emerald/60 text-match-emerald',
    verticalBg: 'from-emerald-500/15 via-surface-card/95 to-primary/10',
    github: 'https://github.com/patelvishal-ji',
    email: 'patelvishal7800023@gmail.com',
    summary:
      'Designed and executed automated testing infrastructure: 39/39 passing pytest test suite, mocked multi-provider AI failure handling (HTTP 401, 429, timeouts), input boundary sanitization, and automated markdown audit logging.',
    deliverables: [
      { icon: 'verified', text: 'Pytest 39/39 Passing Automated Test Suite' },
      { icon: 'bug_report', text: 'Mocked Multi-Provider AI Failure Fallbacks' },
      { icon: 'sanitizer', text: 'Input Sanitization & Keyword Extractor Tests' },
      { icon: 'description', text: 'Automated Markdown Audit Log Generator' },
    ],
    techStack: ['Pytest', 'Python 3.13', 'Mock Engine', 'Audit Logs', 'CI/CD'],
  },
  {
    id: 'sujeet',
    number: '04',
    isLeader: false,
    tabLabel: '📑 Sujeet',
    badgeText: '📑 Research Lead & Technical Writer',
    name: 'Sujeet Kannaujiya',
    initials: 'SK',
    avatar: 'https://github.com/sujeet-official.png',
    role: 'Research Lead • Technical Documentation',
    themeColor: 'text-match-amber',
    borderClass: 'border-match-amber/70',
    glowClass: 'shadow-[0_0_40px_rgba(251,191,36,0.35)]',
    ringClass: 'ring-4 ring-match-amber/70 shadow-glow-sm',
    orbBg: 'bg-match-amber',
    badgeClass: 'bg-match-amber/20 border-match-amber/60 text-match-amber',
    verticalBg: 'from-amber-500/15 via-surface-card/95 to-secondary/10',
    github: 'https://github.com/sujeet-official',
    email: 'sujeetkannujiya2004@bbdu.ac.in',
    summary:
      'Authored technical research and academic documentation: ATS text extraction benchmarks, FastAPI vs Flask throughput analysis, academic dossier (RESEARCH.md), and codified ethical AI non-discriminatory rubrics.',
    deliverables: [
      { icon: 'menu_book', text: 'ATS Parsing Strategies & In-Memory Privacy' },
      { icon: 'compare_arrows', text: 'FastAPI vs. Flask Architecture Benchmarking' },
      { icon: 'library_books', text: 'Academic Research Dossier (RESEARCH.md)' },
      { icon: 'gavel', text: 'Ethical AI Rubric & Non-Bias Guidelines' },
    ],
    techStack: ['Research Dossier', 'ATS Specs', 'FastAPI Benchmarks', 'Ethical AI'],
  },
];

export default function TeamModal({ isOpen, onClose }) {
  // Always reset to Card 0 (Shivansh Mishra) whenever modal opens
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [animClass, setAnimClass] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setActiveCardIndex(0);
      setAnimClass('');
      setIsBusy(false);
    }
  }, [isOpen]);

  const swapCard = (newIndex, direction = 'next') => {
    if (isBusy || newIndex === activeCardIndex) return;
    setIsBusy(true);

    // Phase 1: Animate current card out
    setAnimClass(direction === 'next' ? 'flashcard-swap-out-next' : 'flashcard-swap-out-prev');

    setTimeout(() => {
      // Phase 2: Switch index and animate new card in
      setActiveCardIndex(newIndex);
      setAnimClass(direction === 'next' ? 'flashcard-swap-in-next' : 'flashcard-swap-in-prev');

      setTimeout(() => {
        setAnimClass('');
        setIsBusy(false);
      }, 260);
    }, 220);
  };

  const handleNext = () => {
    const nextIdx = (activeCardIndex + 1) % TEAM_CARDS.length;
    swapCard(nextIdx, 'next');
  };

  const handlePrev = () => {
    const prevIdx = (activeCardIndex - 1 + TEAM_CARDS.length) % TEAM_CARDS.length;
    swapCard(prevIdx, 'prev');
  };

  // Keyboard navigation: Escape closes modal, Left/Right arrow keys / Space swap cards
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
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
  }, [isOpen, onClose, activeCardIndex, isBusy]);

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      handleNext();
    } else if (diff < -40) {
      handlePrev();
    }
    touchStartX.current = null;
  };

  if (!isOpen) return null;

  const currentCard = TEAM_CARDS[activeCardIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-modal-title"
    >
      {/* Outer Centered Wrapper */}
      <div
        className="w-full max-w-[430px] flex flex-col items-center relative my-auto max-h-[96vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Controls Header */}
        <div className="w-full flex items-center justify-between px-2 mb-2 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-secondary text-[16px]" aria-hidden="true">
              style
            </span>
            <span className="font-bold text-on-background tracking-wide">
              Engineering Flashcard
            </span>
            <span className="text-outline">•</span>
            <span className="font-mono text-secondary font-bold">
              {currentCard.number} / 04
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://ai-powered-resume-analyzer-pi.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-medium hover:bg-emerald-500/20 transition-all"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live App</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-surface-bright/70 text-on-surface-variant hover:text-on-background hover:bg-surface-bright transition-all"
              aria-label="Close Modal"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">close</span>
            </button>
          </div>
        </div>

        {/* 🎴 3D STACKED DECK CONTAINER 🎴 */}
        <div
          className="relative w-full flex justify-center py-1"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Stacked Deck Shadow Layer 2 (Furthest behind) */}
          <div className="absolute top-4 w-[90%] h-[94%] rounded-3xl bg-surface-container-high/40 border border-outline-variant/30 pointer-events-none transform translate-y-3 scale-[0.93] opacity-40 shadow-xl" />

          {/* Stacked Deck Shadow Layer 1 (Directly behind) */}
          <div className="absolute top-2 w-[95%] h-[97%] rounded-3xl bg-surface-container-high/60 border border-outline-variant/50 pointer-events-none transform translate-y-1.5 scale-[0.97] opacity-70 shadow-xl" />

          {/* 🌟 ACTIVE VERTICAL FLASHCARD 🌟 */}
          <div
            onClick={handleNext}
            className={`relative w-full rounded-3xl p-5 sm:p-6 bg-gradient-to-b ${currentCard.verticalBg} border-2 ${currentCard.borderClass} ${currentCard.glowClass} shadow-2xl overflow-hidden cursor-pointer select-none transition-all ${animClass}`}
            title="Click card or use buttons to swap"
          >
            {/* Ambient Background Glow Orb */}
            <div
              className={`absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-3xl opacity-25 pointer-events-none ${currentCard.orbBg}`}
            />

            {/* Card Header Pill Row */}
            <div className="relative z-10 flex items-center justify-between mb-3">
              <span className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold border ${currentCard.badgeClass} shadow-sm`}>
                <span className="material-symbols-outlined text-[13px]" aria-hidden="true">
                  {currentCard.isLeader ? 'stars' : 'verified'}
                </span>
                <span>{currentCard.isLeader ? 'Team Leader' : 'Core Contributor'}</span>
              </span>

              <div className="flex items-center gap-1 text-[11px] font-mono text-outline bg-surface-container-lowest/60 px-2 py-0.5 rounded-full border border-outline-variant/40">
                <span className="material-symbols-outlined text-[13px] text-secondary animate-spin-slow" aria-hidden="true">
                  cached
                </span>
                <span>Tap to Swap</span>
              </div>
            </div>

            {/* 📸 Large Clear Centerpiece Avatar Photo 📸 */}
            <div className="relative z-10 flex flex-col items-center text-center my-1">
              <div className="relative">
                <img
                  src={currentCard.avatar}
                  alt={currentCard.name}
                  className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full object-cover shadow-2xl ${currentCard.ringClass} bg-surface-container-high transition-transform duration-300 hover:scale-105`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    if (e.currentTarget.nextElementSibling) {
                      e.currentTarget.nextElementSibling.style.display = 'flex';
                    }
                  }}
                />
                <div
                  style={{ display: 'none' }}
                  className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 items-center justify-center text-white font-black text-4xl shadow-2xl ${currentCard.ringClass}`}
                >
                  {currentCard.initials}
                </div>

                {currentCard.isLeader && (
                  <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-secondary text-surface text-[10px] font-black uppercase tracking-wider shadow-lg border border-white/30 flex items-center gap-1 whitespace-nowrap">
                    <span className="material-symbols-outlined text-[13px]" aria-hidden="true">crown</span>
                    <span>Team Leader</span>
                  </span>
                )}
              </div>

              {/* Name & Role Title */}
              <div className="mt-4">
                <h3 className="font-display-lg text-2xl sm:text-3xl font-extrabold text-on-background tracking-tight">
                  {currentCard.name}
                </h3>
                <p className={`text-xs sm:text-sm font-bold ${currentCard.themeColor} mt-0.5`}>
                  {currentCard.role}
                </p>
                <p className="text-[11px] text-outline font-medium mt-0.5">
                  BBD University • Academic Capstone 2026
                </p>
              </div>
            </div>

            {/* Mission / Architecture Summary Box */}
            <div className="relative z-10 mt-3 p-3 rounded-xl bg-surface-container-lowest/80 border border-outline-variant/40 text-left">
              <span className="text-[10px] uppercase tracking-wider text-outline font-bold block mb-1">
                Executive Contribution
              </span>
              <p className="text-[11px] sm:text-xs text-on-surface-variant leading-relaxed">
                {currentCard.summary}
              </p>
            </div>

            {/* Authored Deliverables Stack */}
            <div className="relative z-10 mt-3 text-left">
              <span className="text-[10px] uppercase tracking-wider text-secondary font-bold block mb-1.5">
                Core Deliverables Authored
              </span>
              <div className="space-y-1.5">
                {currentCard.deliverables.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface-container-low/70 border border-outline-variant/30 text-xs"
                  >
                    <span className="material-symbols-outlined text-secondary text-[15px] shrink-0" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="font-medium text-on-background/90 text-[11px] truncate">
                      {item.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Strip */}
            <div className="relative z-10 mt-3 flex flex-wrap gap-1 justify-center">
              {currentCard.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-surface-bright/50 border border-outline-variant/40 text-on-surface-variant text-[10px] font-mono"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Card Action Buttons */}
            <div className="relative z-10 mt-3 pt-2.5 border-t border-outline-variant/30 flex items-center justify-center gap-2">
              <a
                href={currentCard.github}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-1.5 rounded-lg bg-surface-bright/70 hover:bg-surface-bright text-on-surface-variant hover:text-on-background border border-outline-variant/60 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[14px]" aria-hidden="true">code</span>
                <span>GitHub Profile</span>
              </a>
              <a
                href={`mailto:${currentCard.email}`}
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-1.5 rounded-lg bg-surface-container-lowest/70 hover:bg-surface-container-lowest text-on-surface-variant hover:text-on-background border border-outline-variant/40 text-xs font-medium flex items-center gap-1.5 transition-all"
              >
                <span className="material-symbols-outlined text-[14px]" aria-hidden="true">mail</span>
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>

        {/* 🔄 SWAP DECK CONTROLS (Below Card) 🔄 */}
        <div className="w-full flex flex-col items-center gap-2 mt-3">
          {/* Main Swap & Navigation Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              disabled={isBusy}
              className="px-3 py-1.5 rounded-xl bg-surface-container-high/80 hover:bg-surface-bright text-on-surface-variant hover:text-on-background border border-outline-variant/50 text-xs font-medium flex items-center gap-1 transition-all disabled:opacity-50"
              aria-label="Previous Flashcard"
            >
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_back</span>
              <span>Prev</span>
            </button>

            {/* Big Glow Swap Button */}
            <button
              type="button"
              onClick={handleNext}
              disabled={isBusy}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-secondary to-primary text-surface font-black text-xs flex items-center gap-2 shadow-glow-cyan hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              aria-label="Swap Flashcard"
            >
              <span className="material-symbols-outlined text-[16px] animate-spin-slow" aria-hidden="true">
                swap_horiz
              </span>
              <span>Swap Next Card</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={isBusy}
              className="px-3 py-1.5 rounded-xl bg-surface-container-high/80 hover:bg-surface-bright text-on-surface-variant hover:text-on-background border border-outline-variant/50 text-xs font-medium flex items-center gap-1 transition-all disabled:opacity-50"
              aria-label="Next Flashcard"
            >
              <span>Next</span>
              <span className="material-symbols-outlined text-[16px]" aria-hidden="true">arrow_forward</span>
            </button>
          </div>

          {/* Quick Pill Dots */}
          <div className="flex items-center gap-1.5 bg-surface-container-low/80 px-2.5 py-1 rounded-full border border-outline-variant/40">
            {TEAM_CARDS.map((card, idx) => {
              const isActive = activeCardIndex === idx;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => swapCard(idx, idx > activeCardIndex ? 'next' : 'prev')}
                  disabled={isBusy}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${
                    isActive
                      ? card.isLeader
                        ? 'bg-secondary text-surface shadow-glow-cyan scale-105'
                        : 'bg-primary text-white shadow-glow-sm scale-105'
                      : 'text-on-surface-variant hover:text-on-background hover:bg-surface-bright/40'
                  }`}
                >
                  <span>{card.tabLabel}</span>
                </button>
              );
            })}
          </div>

          <span className="text-[10px] text-outline font-mono">
            Click card, use swipe, or press ← / → keys to swap
          </span>
        </div>
      </div>
    </div>
  );
}


