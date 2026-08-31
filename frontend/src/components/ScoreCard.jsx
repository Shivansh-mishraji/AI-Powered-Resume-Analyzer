import { useState, useEffect } from 'react';

export default function ScoreCard({ score = 0 }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let current = 0;
    const target = Math.max(0, Math.min(100, score));
    const duration = 1000;
    const steps = 30;
    const increment = target / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedScore(target);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const getScoreColor = (val) => {
    if (val >= 80) return '#10b981'; // Emerald
    if (val >= 60) return '#38bdf8'; // Cyan
    if (val >= 40) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose
  };

  const getScoreTier = (val) => {
    if (val >= 85) {
      return {
        label: 'High Alignment',
        desc: 'Strong candidate profile with clear evidence for target role requirements.',
        badgeClass: 'tier-badge-emerald',
      };
    }
    if (val >= 70) {
      return {
        label: 'Strong Contender',
        desc: 'Satisfies primary stack requirements with minor secondary gaps.',
        badgeClass: 'tier-badge-cyan',
      };
    }
    if (val >= 50) {
      return {
        label: 'Moderate Match',
        desc: 'Core fundamentals are present, but notable required criteria are missing.',
        badgeClass: 'tier-badge-amber',
      };
    }
    return {
      label: 'Low Match',
      desc: 'Substantial gap between candidate experience and role requirements.',
      badgeClass: 'tier-badge-rose',
    };
  };

  const tier = getScoreTier(score);

  return (
    <div className="results-card score-card" aria-labelledby="score-card-heading">
      <h3 id="score-card-heading" className="sr-only">Resume Match Score</h3>
      <div className="gauge-wrapper">
        <svg className="radial-score-svg" width="168" height="168" aria-hidden="true">
          <circle
            className="radial-gauge-bg"
            cx="84"
            cy="84"
            r={radius}
            strokeWidth="12"
          />
          <circle
            className="radial-gauge-bar"
            cx="84"
            cy="84"
            r={radius}
            strokeWidth="12"
            stroke={getScoreColor(score)}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        <div className="gauge-center-label" aria-live="polite">
          <span className="gauge-number" style={{ color: getScoreColor(score) }}>
            {animatedScore}%
          </span>
          <span className="gauge-title">MATCH SCORE</span>
        </div>
      </div>

      <div className="score-details-column">
        <span className={`tier-pill ${tier.badgeClass}`}>{tier.label}</span>
        <p className="tier-description">{tier.desc}</p>
      </div>
    </div>
  );
}
