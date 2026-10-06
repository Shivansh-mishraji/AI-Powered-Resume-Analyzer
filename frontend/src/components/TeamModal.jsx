import { useState, useEffect, useRef, useCallback } from 'react';
import { TEAM_MEMBERS, playCyberChime } from '../data/teamData';
import './TeamModal.css';

export default function TeamModal({ isOpen, onClose, initialMemberId = null }) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'spotlight'
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(null);
  const [loadedPhotos, setLoadedPhotos] = useState({});
  const touchStartX = useRef(null);

  const markLoaded = useCallback((src) => {
    setLoadedPhotos((prev) => ({ ...prev, [src]: true }));
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (initialMemberId) {
        const foundIdx = TEAM_MEMBERS.findIndex((m) => m.id === initialMemberId);
        if (foundIdx !== -1) {
          setActiveCardIndex(foundIdx);
          setViewMode('spotlight');
        }
      } else {
        setActiveCardIndex(0);
      }
      setCopiedEmail(null);
    }
  }, [isOpen, initialMemberId]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (viewMode === 'spotlight') {
        if (e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault();
          playCyberChime('hover');
          setActiveCardIndex((prev) => (prev + 1) % TEAM_MEMBERS.length);
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          playCyberChime('hover');
          setActiveCardIndex((prev) => (prev - 1 + TEAM_MEMBERS.length) % TEAM_MEMBERS.length);
        }
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
  }, [isOpen, onClose, viewMode]);

  // Touch swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) {
      playCyberChime('hover');
      setActiveCardIndex((prev) => (prev + 1) % TEAM_MEMBERS.length);
    } else if (diff < -40) {
      playCyberChime('hover');
      setActiveCardIndex((prev) => (prev - 1 + TEAM_MEMBERS.length) % TEAM_MEMBERS.length);
    }
    touchStartX.current = null;
  };

  const handleCopyEmail = (email) => {
    playCyberChime('celebrate');
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2200);
  };

  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  if (!isOpen) return null;

  const currentMember = TEAM_MEMBERS[activeCardIndex];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/85 backdrop-blur-xl animate-fade-in overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="team-modal-title"
    >
      <div
        className="w-full max-w-6xl flex flex-col bg-slate-900/90 border border-slate-700/60 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden my-auto max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Top Header Navigation Bar ── */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-glow-sm">
              <span className="material-symbols-outlined text-[20px]">groups</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="team-modal-title" className="font-headline-md text-base sm:text-lg font-bold text-white tracking-tight">
                  Core Engineering Roster &amp; Defense Dossier
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-500/20 text-sky-300 border border-sky-400/30 font-semibold">
                  BBD University 2026
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Architects &amp; Authors of the AI-Powered Resume &amp; ATS Compatibility Analyzer
              </p>
            </div>
          </div>

          {/* Center / Right Controls: View Switcher & Close */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
            {/* View Mode Toggle Pill */}
            <div className="flex items-center bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  playCyberChime('click');
                  setViewMode('grid');
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="View All 4 Members Side-by-Side"
              >
                <span className="material-symbols-outlined text-[16px]">grid_view</span>
                <span>All Roster (4)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playCyberChime('click');
                  setViewMode('spotlight');
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'spotlight'
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="View Focused Spotlight Presentation Deck"
              >
                <span className="material-symbols-outlined text-[16px]">style</span>
                <span>Spotlight Deck</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700/60"
              aria-label="Close Modal"
              title="Close (Esc)"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* ── Main Modal Body: Scrollable ── */}
        <div className="p-4 sm:p-6 overflow-y-auto team-modal-scroll flex-1">
          {/* =========================================================
              VIEW MODE A: 3D HOLOGRAPHIC GRID (ALL 4 MEMBERS)
             ========================================================= */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 team-perspective-container">
              {TEAM_MEMBERS.map((m, idx) => (
                <div
                  key={m.id}
                  onMouseMove={handleCardMouseMove}
                  onMouseLeave={handleCardMouseLeave}
                  className={`team-holo-card roster-card-enter-${idx} rounded-2xl p-5 bg-gradient-to-b ${m.cardGradient} border ${m.borderClass} ${m.glowClass} flex flex-col justify-between relative overflow-hidden backdrop-blur-md transition-all duration-300`}
                >
                  <div className="team-card-shine" />

                  {/* Top Badge & Number */}
                  <div>
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${m.badgeBg} flex items-center gap-1`}>
                        <span className="material-symbols-outlined text-[12px]">
                          {m.isLeader ? 'crown' : 'verified'}
                        </span>
                        <span>{m.isLeader ? 'Lead Architect' : 'Core Contributor'}</span>
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-500">
                        {m.number}
                      </span>
                    </div>

                    {/* Centered Avatar with Ring */}
                    <div className="flex flex-col items-center text-center relative z-10 mb-4">
                      <div className="relative group">
                        <img
                          src={m.avatar}
                          alt={m.name}
                          width="112"
                          height="112"
                          className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-xl ${m.ringClass} bg-slate-800 transition-transform duration-300 group-hover:scale-105`}
                          onLoad={() => markLoaded(m.avatar)}
                          onError={(e) => {
                            if (m.fallbackAvatar && e.currentTarget.src !== m.fallbackAvatar) {
                              e.currentTarget.src = m.fallbackAvatar;
                            } else {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling;
                              if (fallback) fallback.style.display = 'flex';
                            }
                          }}
                        />
                        <div
                          style={{ display: 'none' }}
                          className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 items-center justify-center text-white font-black text-2xl shadow-xl ${m.ringClass}`}
                        >
                          {m.initials}
                        </div>

                        {m.isLeader && (
                          <span className="team-crown-float absolute -top-2 -right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-bold shadow-md border border-white/60">
                            👑
                          </span>
                        )}
                      </div>

                      <h3 className="font-headline-sm text-base font-bold text-white mt-3 tracking-tight">
                        {m.name}
                      </h3>
                      <p className={`text-xs font-semibold ${m.accentClass} mt-0.5`}>
                        {m.role.split('•')[0].trim()}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {m.role.split('•')[1]?.trim() || 'Software Engineer'}
                      </p>
                    </div>

                    {/* Superpower Metrics Progress Bars */}
                    <div className="space-y-2 mb-4 relative z-10 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between font-bold">
                        <span>Core Metrics</span>
                        <span className={m.accentClass}>Live Stats</span>
                      </div>
                      {m.superpowers.map((sp, sIdx) => (
                        <div key={sIdx}>
                          <div className="flex justify-between text-[10px] text-slate-300 mb-0.5 font-medium">
                            <span className="truncate pr-1">{sp.name}</span>
                            <span className="font-mono text-slate-400">{sp.percent}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-1000"
                              style={{
                                width: `${sp.percent}%`,
                                backgroundColor: m.themeColor,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Deliverables Snippet */}
                    <div className="space-y-1.5 mb-4 relative z-10">
                      {m.deliverables.slice(0, 2).map((del, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-900/50 p-1.5 rounded-lg border border-slate-800/60"
                        >
                          <span className={`material-symbols-outlined text-[14px] ${m.accentClass} shrink-0`}>
                            {del.icon}
                          </span>
                          <span className="truncate text-[10px] font-medium">{del.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom Actions: Deep-Dive, GitHub, Email */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-1.5 relative z-10">
                    <button
                      type="button"
                      onClick={() => {
                        playCyberChime('click');
                        setActiveCardIndex(idx);
                        setViewMode('spotlight');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-300 text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer"
                      title="View Detailed Spotlight Dossier"
                    >
                      <span className="material-symbols-outlined text-[13px]">visibility</span>
                      <span>Details</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <a
                        href={m.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/60"
                        title="GitHub Profile"
                      >
                        <span className="material-symbols-outlined text-[14px]">code</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => handleCopyEmail(m.email)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/60 relative cursor-pointer"
                        title="Copy Email Address"
                      >
                        <span className="material-symbols-outlined text-[14px]">
                          {copiedEmail === m.email ? 'done' : 'mail'}
                        </span>
                        {copiedEmail === m.email && (
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[9px] shadow-sm whitespace-nowrap">
                            Copied!
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* =========================================================
              VIEW MODE B: 3D SPOTLIGHT DECK (CINEMATIC FOCUS)
             ========================================================= */}
          {viewMode === 'spotlight' && (
            <div
              className="max-w-2xl mx-auto flex flex-col items-center relative py-2"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              {/* Stack Depth Layers */}
              <div className="absolute top-4 w-[92%] h-[92%] rounded-3xl bg-slate-800/40 border border-slate-700/30 team-deck-shadow-2 pointer-events-none" />
              <div className="absolute top-2 w-[96%] h-[96%] rounded-3xl bg-slate-800/60 border border-slate-700/50 team-deck-shadow-1 pointer-events-none" />

              {/* Main Spotlight Card */}
              <div
                className={`relative w-full rounded-3xl p-6 sm:p-8 bg-gradient-to-b ${currentMember.cardGradient} border-2 ${currentMember.borderClass} ${currentMember.glowClass} shadow-2xl backdrop-blur-xl transition-all duration-300 z-10`}
              >
                {/* Header Row */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${currentMember.badgeBg} flex items-center gap-1.5 shadow-sm`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {currentMember.isLeader ? 'crown' : 'verified'}
                    </span>
                    <span>{currentMember.badgeText}</span>
                  </span>

                  <span className="font-mono text-sm font-bold text-slate-400">
                    {currentMember.number} / 04
                  </span>
                </div>

                {/* Avatar & Center Identity */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 my-2">
                  <div className="relative shrink-0">
                    <img
                      src={currentMember.avatar}
                      alt={currentMember.name}
                      width="140"
                      height="140"
                      className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full object-cover shadow-2xl ${currentMember.ringClass} bg-slate-800`}
                      onError={(e) => {
                        if (currentMember.fallbackAvatar && e.currentTarget.src !== currentMember.fallbackAvatar) {
                          e.currentTarget.src = currentMember.fallbackAvatar;
                        }
                      }}
                    />
                    {currentMember.isLeader && (
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-lg border border-white/60 whitespace-nowrap">
                        👑 Team Leader
                      </span>
                    )}
                  </div>

                  <div className="text-center sm:text-left flex-1">
                    <h3 className="font-headline-lg text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {currentMember.name}
                    </h3>
                    <p className={`text-sm sm:text-base font-bold ${currentMember.accentClass} mt-0.5`}>
                      {currentMember.role}
                    </p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      BBD University • Academic Capstone 2026
                    </p>
                    <p className="text-xs text-slate-300 italic mt-3 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                      {currentMember.quote}
                    </p>
                  </div>
                </div>

                {/* Defense Presentation Slot (5-7 Min Pitch Guide) */}
                {currentMember.defenseSlot && (
                  <div className="mt-4 p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-xs">
                    <div className="flex items-center justify-between text-amber-300 font-bold mb-1.5 font-mono">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">timer</span>
                        <span>Defense Slot: {currentMember.defenseSlot.phase}</span>
                      </span>
                      <span>{currentMember.defenseSlot.time}</span>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-slate-300">
                      {currentMember.defenseSlot.topics.map((top, tIdx) => (
                        <li key={tIdx} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                          <span className="truncate">{top}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Architecture Summary */}
                <div className="mt-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <span className="font-mono uppercase text-[10px] font-bold text-slate-400 block mb-1">
                    Platform Contribution Summary
                  </span>
                  {currentMember.summary}
                </div>

                {/* Authored Deliverables Grid */}
                <div className="mt-4">
                  <span className={`font-mono uppercase text-[10px] font-bold ${currentMember.accentClass} block mb-2`}>
                    Core Technical Deliverables Authored
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentMember.deliverables.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-200"
                      >
                        <span className={`material-symbols-outlined text-[16px] ${currentMember.accentClass} shrink-0`}>
                          {item.icon}
                        </span>
                        <span className="text-[11px] font-medium">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Badges */}
                <div className="mt-4 flex flex-wrap gap-1.5 justify-center sm:justify-start">
                  {currentMember.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[10px] font-mono"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* External Action Buttons */}
                <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                  <a
                    href={currentMember.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-all border border-slate-700"
                  >
                    <span className="material-symbols-outlined text-[15px]">code</span>
                    <span>GitHub Profile</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopyEmail(currentMember.email)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-medium text-xs flex items-center justify-center gap-1.5 transition-all border border-slate-800 cursor-pointer relative"
                  >
                    <span className="material-symbols-outlined text-[15px]">
                      {copiedEmail === currentMember.email ? 'done' : 'mail'}
                    </span>
                    <span>{copiedEmail === currentMember.email ? 'Email Copied!' : 'Copy Email'}</span>
                  </button>
                </div>
              </div>

              {/* Spotlight Carousel Navigation Toolbar */}
              <div className="flex items-center gap-3 mt-4 z-10">
                <button
                  type="button"
                  onClick={() => {
                    playCyberChime('hover');
                    setActiveCardIndex((prev) => (prev - 1 + TEAM_MEMBERS.length) % TEAM_MEMBERS.length);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                  <span>Previous</span>
                </button>

                {/* Pill Member Selectors */}
                <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                  {TEAM_MEMBERS.map((m, idx) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        playCyberChime('hover');
                        setActiveCardIndex(idx);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeCardIndex === idx
                          ? 'bg-sky-500 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {m.tabLabel.split('(')[0].trim()}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playCyberChime('hover');
                    setActiveCardIndex((prev) => (prev + 1) % TEAM_MEMBERS.length);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>Next</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Modal Footer Banner ── */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-slate-300">
              92/92 Automated Tests Passing • Zero-Disk RAM Privacy • Free AI BYOK
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                playCyberChime('click');
                setViewMode(viewMode === 'grid' ? 'spotlight' : 'grid');
              }}
              className="text-sky-400 hover:text-sky-300 hover:underline font-medium text-[11px] cursor-pointer"
            >
              Switch to {viewMode === 'grid' ? 'Spotlight Deck' : 'Roster Grid'}
            </button>
            <span className="text-slate-600">•</span>
            <span className="text-[10px] font-mono text-slate-500">
              Press Esc or click outside to dismiss
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
