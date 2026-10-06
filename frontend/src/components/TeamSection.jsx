import { useState, useEffect, useRef } from 'react';
import { TEAM_MEMBERS, ARCHITECTURE_LAYERS, playCyberChime } from '../data/teamData';
import './TeamSection.css';

export default function TeamSection({ onOpenModal, onSelectMember }) {
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all' | 'shivansh' | 'harshvardhan' | 'vishal' | 'sujeet' | 'matrix'
  const [copiedEmail, setCopiedEmail] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isDefenseMode, setIsDefenseMode] = useState(false);
  const [defenseSeconds, setDefenseSeconds] = useState(360); // 6:00 default
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerIntervalRef = useRef(null);

  // Sound helper wrapper
  const triggerSfx = (type) => {
    if (soundEnabled) {
      playCyberChime(type);
    }
  };

  // Defense timer logic
  useEffect(() => {
    if (isDefenseMode && isTimerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setDefenseSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [isDefenseMode, isTimerRunning]);

  // Determine current presenter based on elapsed seconds (360 total)
  const elapsed = 360 - defenseSeconds;
  let activeSpeakerId = 'shivansh';
  if (elapsed < 120) activeSpeakerId = 'shivansh'; // 0 - 2:00
  else if (elapsed < 210) activeSpeakerId = 'harshvardhan'; // 2:00 - 3:30
  else if (elapsed < 285) activeSpeakerId = 'vishal'; // 3:30 - 4:45
  else activeSpeakerId = 'sujeet'; // 4:45 - 6:00

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // 3D Parallax Tilt Handler
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
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  };

  const handleCopyEmail = (email) => {
    triggerSfx('celebrate');
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  const filteredMembers =
    selectedFilter === 'all' || selectedFilter === 'matrix'
      ? TEAM_MEMBERS
      : TEAM_MEMBERS.filter((m) => m.id === selectedFilter);

  return (
    <section
      id="team-section"
      className="relative w-full mt-16 pt-12 pb-16 px-4 sm:px-6 md:px-10 rounded-3xl bg-slate-950/70 border border-slate-800/80 backdrop-blur-xl overflow-hidden scroll-mt-24 shadow-[0_10px_50px_rgba(0,0,0,0.5)]"
    >
      {/* Background ambient light */}
      <div className="team-sec-bg-glow" />

      {/* ── Section Header ── */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-mono font-bold tracking-wide mb-3 shadow-glow-sm">
          <span className="material-symbols-outlined text-[16px]">school</span>
          <span>BBD UNIVERSITY CAPSTONE 2026 • CSE DEPARTMENT</span>
        </div>

        <h2 className="font-headline-lg text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
          Core Engineering Architects &amp; Authors
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl leading-relaxed">
          Conceived, designed, and engineered from first principles — combining zero-disk Python microservices, GPU-accelerated React 19 glassmorphism, 92/92 automated Pytest verification, and ethical ATS heuristics.
        </p>

        {/* ── Innovative Control Toolbar ── */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {/* Persona / Mode Filters */}
          <div className="flex flex-wrap items-center bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
            <button
              type="button"
              onClick={() => {
                triggerSfx('click');
                setSelectedFilter('all');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ✨ All 4 Architects
            </button>

            {TEAM_MEMBERS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  triggerSfx('click');
                  setSelectedFilter(m.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedFilter === m.id
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m.tabLabel}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                triggerSfx('click');
                setSelectedFilter('matrix');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                selectedFilter === 'matrix'
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">account_tree</span>
              <span>System Matrix</span>
            </button>
          </div>

          {/* Quick Action Tools: 5-7 Min Defense Mode, Sound FX, 3D Deck */}
          <div className="flex items-center gap-2">
            {/* 5-7 Min Presentation Defense Mode Toggle */}
            <button
              type="button"
              onClick={() => {
                triggerSfx('click');
                setIsDefenseMode(!isDefenseMode);
                if (!isDefenseMode) setIsTimerRunning(true);
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
                isDefenseMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800'
              }`}
              title="Toggle 5-7 Minute Presentation Defense Timer & Cue Tracker"
            >
              <span className="material-symbols-outlined text-[15px]">timer</span>
              <span>{isDefenseMode ? `Defense Mode (${formatTimer(defenseSeconds)})` : '5-7m Defense Mode'}</span>
            </button>

            {/* Sound FX Toggle */}
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) playCyberChime('click');
              }}
              className={`p-2 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center gap-1 ${
                soundEnabled
                  ? 'bg-sky-500/20 border-sky-400/40 text-sky-300'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title={soundEnabled ? 'Cyber SFX Enabled' : 'Enable Cyber Audio Feedback'}
              aria-label="Toggle Sound Effects"
            >
              <span className="material-symbols-outlined text-[16px]">
                {soundEnabled ? 'volume_up' : 'volume_off'}
              </span>
            </button>

            {/* Launch Fullscreen 3D Spotlight Deck Modal */}
            <button
              type="button"
              onClick={() => {
                triggerSfx('click');
                if (onOpenModal) onOpenModal();
              }}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white text-xs font-bold shadow-glow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              title="Open Full 3D Cinematic Spotlight Presentation Deck"
            >
              <span className="material-symbols-outlined text-[16px]">style</span>
              <span className="hidden sm:inline">3D Presentation Deck</span>
              <span className="sm:hidden">Deck</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 5-7 Min Presentation Defense Mode Tracker Banner ── */}
      {isDefenseMode && (
        <div className="relative z-10 mb-8 p-4 sm:p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 shadow-xl backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Timer Controls */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex flex-col items-center justify-center text-amber-300 font-mono font-black text-xl shadow-inner">
                {formatTimer(defenseSeconds)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    5-7 Minute Capstone Defense Timer
                  </span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Live pacing guide: ensures all 4 members complete technical defense within university limits.
                </p>
              </div>
            </div>

            {/* Timer Actions & Active Speaker Cue */}
            <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
              <button
                type="button"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all cursor-pointer"
              >
                {isTimerRunning ? 'Pause' : 'Resume'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setDefenseSeconds(360);
                  setIsTimerRunning(false);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700 transition-all cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Active Presenter Agenda Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-amber-500/20">
            {TEAM_MEMBERS.map((m) => {
              const isCurrent = activeSpeakerId === m.id;
              return (
                <div
                  key={m.id}
                  className={`p-2.5 rounded-xl border text-xs transition-all ${
                    isCurrent
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 defense-active-speaker font-semibold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[11px] truncate">{m.name}</span>
                    <span className="font-mono text-[10px] text-amber-400">{m.defenseSlot.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-300 line-clamp-1">{m.defenseSlot.phase}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── System Architecture Matrix View (when 'matrix' selected) ── */}
      {selectedFilter === 'matrix' && (
        <div className="relative z-10 max-w-4xl mx-auto mb-10 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
          {ARCHITECTURE_LAYERS.map((layer) => (
            <div
              key={layer.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all backdrop-blur-md relative overflow-hidden group shadow-lg"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: `${layer.accent}25`, color: layer.accent }}
                >
                  <span className="material-symbols-outlined text-[20px]">{layer.icon}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{layer.layer}</h4>
                  <p className="text-xs font-semibold" style={{ color: layer.accent }}>
                    {layer.leadName}
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                {layer.highlights}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── 3D Holographic Team Roster Cards Grid ── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 team-sec-perspective">
        {filteredMembers.map((m) => {
          const isDefenseActive = isDefenseMode && activeSpeakerId === m.id;
          return (
            <div
              key={m.id}
              onMouseEnter={() => triggerSfx('hover')}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              className={`team-sec-card ${
                m.isLeader ? 'team-sec-card-lead' : ''
              } ${isDefenseActive ? 'defense-active-speaker ring-2 ring-amber-400' : ''} rounded-3xl p-5 bg-gradient-to-b ${
                m.cardGradient
              } border ${m.borderClass} ${m.glowClass} flex flex-col justify-between relative overflow-hidden backdrop-blur-xl shadow-2xl transition-all duration-300`}
              style={{
                '--beam-color': m.themeColor,
              }}
            >
              {/* Animated Conic Border Beam */}
              <div className="team-sec-beam-container">
                <div className="team-sec-beam-spin" />
              </div>

              {/* Specular Glare Reflection */}
              <div className="team-sec-shine" />

              {/* Card Main Content */}
              <div className="relative z-10">
                {/* Header Row: Role Badge & Academic Number */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${m.badgeBg} flex items-center gap-1 shadow-sm`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {m.isLeader ? 'crown' : 'verified'}
                    </span>
                    <span>{m.isLeader ? 'Lead Architect' : 'Core Contributor'}</span>
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {m.number} / 04
                  </span>
                </div>

                {/* Avatar with Floating Crown & Glowing Ring */}
                <div className="flex flex-col items-center text-center mb-4">
                  <div className="relative group/avatar cursor-pointer" onClick={() => onSelectMember && onSelectMember(m.id)}>
                    <img
                      src={m.avatar}
                      alt={m.name}
                      width="112"
                      height="112"
                      className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover shadow-2xl ${m.ringClass} bg-slate-800 transition-transform duration-300 group-hover/avatar:scale-105`}
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
                      <span className="team-sec-float absolute -top-2 -right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs font-bold shadow-md border border-white/60">
                        👑
                      </span>
                    )}
                  </div>

                  <h3 className="font-headline-sm text-base sm:text-lg font-bold text-white mt-3 tracking-tight">
                    {m.name}
                  </h3>
                  <p className={`text-xs font-bold ${m.accentClass} mt-0.5`}>
                    {m.role.split('•')[0].trim()}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {m.role.split('•')[1]?.trim() || 'Software Engineer'}
                  </p>
                </div>

                {/* Quote Snippet */}
                <p className="text-[11px] text-slate-300 italic mb-4 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/80 text-center leading-snug">
                  {m.quote}
                </p>

                {/* Live Superpower Progression Meters */}
                <div className="space-y-2 mb-4 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between font-bold">
                    <span>Superpowers</span>
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
                          className="h-full rounded-full team-sec-skill-bar"
                          style={{
                            '--skill-w': `${sp.percent}%`,
                            backgroundColor: m.themeColor,
                            boxShadow: `0 0 8px ${m.glowHex}`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Deliverables Snippet */}
                <div className="space-y-1.5 mb-4">
                  {m.deliverables.slice(0, 2).map((del, dIdx) => (
                    <div
                      key={dIdx}
                      className="flex items-center gap-1.5 text-[11px] text-slate-300 bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/60"
                    >
                      <span className={`material-symbols-outlined text-[14px] ${m.accentClass} shrink-0`}>
                        {del.icon}
                      </span>
                      <span className="truncate text-[10px] font-medium">{del.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer Actions: Details, GitHub, Email */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-1.5 relative z-10">
                <button
                  type="button"
                  onClick={() => {
                    triggerSfx('click');
                    if (onSelectMember) onSelectMember(m.id);
                    if (onOpenModal) onOpenModal();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/30 text-sky-300 text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer"
                  title="View Complete Architectural Dossier"
                >
                  <span className="material-symbols-outlined text-[13px]">visibility</span>
                  <span>Dossier</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <a
                    href={m.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/60"
                    title={`${m.name}'s GitHub Profile`}
                  >
                    <span className="material-symbols-outlined text-[14px]">code</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopyEmail(m.email)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/60 relative cursor-pointer"
                    title={`Copy ${m.name}'s Email Address`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {copiedEmail === m.email ? 'done' : 'mail'}
                    </span>
                    {copiedEmail === m.email && (
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold text-[9px] shadow-sm whitespace-nowrap">
                        Copied!
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Section Bottom Accreditation Bar ── */}
      <div className="relative z-10 mt-10 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px] text-slate-300">
            92/92 Automated Pytest Tests Passing • Zero-Disk In-Memory Privacy • Multi-LLM BYOK
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            triggerSfx('click');
            if (onOpenModal) onOpenModal();
          }}
          className="text-sky-400 hover:text-sky-300 hover:underline font-semibold text-xs flex items-center gap-1 cursor-pointer"
        >
          <span>Launch Fullscreen 3D Presentation Deck</span>
          <span className="material-symbols-outlined text-[14px]">open_in_new</span>
        </button>
      </div>
    </section>
  );
}
