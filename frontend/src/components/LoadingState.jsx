import { useState, useEffect } from 'react';

export default function LoadingState({ isAiPowered = false }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStepIndex(1), 500);
    const timer2 = setTimeout(() => setStepIndex(2), 1200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const steps = [
    { label: 'Reading resume document stream in memory' },
    { label: isAiPowered ? 'Prompting Google Gemini 2.5 deep neural evaluation' : 'Matching 50+ technical keywords & requirements' },
    { label: 'Synthesizing candidate match breakdown' },
  ];

  return (
    <div className="loading-state-card" role="status" aria-live="polite">
      <div className="loading-spinner-large" aria-hidden="true" />
      <h2 className="loading-heading">Analyzing your resume...</h2>
      <p className="loading-subheading">Evaluating experience, skills, and qualifications against the role description.</p>

      <ul className="loading-steps-list">
        {steps.map((step, idx) => {
          const isDone = idx < stepIndex;
          const isCurrent = idx === stepIndex;

          return (
            <li
              key={step.label}
              className={`loading-step-item ${isDone ? 'step-done' : ''} ${isCurrent ? 'step-current' : 'step-pending'}`}
            >
              <span className="step-icon" aria-hidden="true">
                {isDone ? '✓' : isCurrent ? '●' : '○'}
              </span>
              <span className="step-label-text">{step.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
