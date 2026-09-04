import { useEffect } from 'react';

// Generates random floating particle dots
function Particles({ count = 18 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            bottom: `${Math.random() * 10}%`,
            width: `${Math.random() > 0.6 ? 3 : 2}px`,
            height: `${Math.random() > 0.6 ? 3 : 2}px`,
            animationDuration: `${12 + Math.random() * 18}s`,
            animationDelay: `${Math.random() * 12}s`,
            background: i % 3 === 0
              ? 'rgba(217,70,239,0.6)'
              : i % 3 === 1
              ? 'rgba(56,189,248,0.6)'
              : 'rgba(99,102,241,0.7)',
          }}
        />
      ))}
    </>
  );
}

export default function AuroraBackground() {
  return (
    <>
      {/* Floating aurora glow orbs */}
      <div className="aurora-orb-1" aria-hidden="true" />
      <div className="aurora-orb-2" aria-hidden="true" />
      <div className="aurora-orb-3" aria-hidden="true" />

      {/* Rising particle dots */}
      <Particles count={20} />
    </>
  );
}
