import { useMemo, useEffect, useState } from 'react';

// Pre-compute particles once at module load — never re-computed on render
const PARTICLE_DATA = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left:     `${(i * 7.3 + 3) % 100}%`,        // deterministic, no Math.random
  bottom:   `${(i * 13.7 + 1) % 8}%`,
  size:     i % 3 === 0 ? '3px' : '2px',
  duration: `${14 + (i * 2.3) % 16}s`,
  delay:    `${(i * 1.7) % 12}s`,
  color:    i % 3 === 0
    ? 'rgba(217,70,239,0.5)'
    : i % 3 === 1
    ? 'rgba(56,189,248,0.5)'
    : 'rgba(99,102,241,0.6)',
}));

// Respect prefers-reduced-motion — if user has motion sensitivity, render nothing
function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (e) => setReduced(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

// Pause all animations when tab is hidden — saves CPU/GPU
function usePageVisibility() {
  useEffect(() => {
    const handleVisibility = () => {
      const els = document.querySelectorAll('.aurora-orb-1,.aurora-orb-2,.aurora-orb-3,.particle');
      els.forEach(el => {
        el.style.animationPlayState = document.hidden ? 'paused' : 'running';
      });
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);
}

export default function AuroraBackground() {
  const reduced = useReducedMotion();
  usePageVisibility();

  // Skip all decorative animations if user prefers reduced motion
  if (reduced) return null;

  return (
    <>
      {/* Floating aurora glow orbs — GPU-composited via will-change */}
      <div className="aurora-orb-1" aria-hidden="true" />
      <div className="aurora-orb-2" aria-hidden="true" />
      <div className="aurora-orb-3" aria-hidden="true" />

      {/* Rising particle dots — pre-computed, never re-rendered */}
      {PARTICLE_DATA.map(p => (
        <span
          key={p.id}
          className="particle"
          style={{
            left:              p.left,
            bottom:            p.bottom,
            width:             p.size,
            height:            p.size,
            animationDuration: p.duration,
            animationDelay:    p.delay,
            background:        p.color,
          }}
        />
      ))}
    </>
  );
}
