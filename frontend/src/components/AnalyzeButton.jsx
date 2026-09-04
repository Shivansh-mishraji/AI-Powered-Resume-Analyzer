import { useState, useEffect } from 'react';

const LOADING_MESSAGES = [
  'Analyzing Resume Compatibility...',
  'Extracting skills & qualifications...',
  'Evaluating ATS rubric & alignment...',
  'Synthesizing match report...',
];

export default function AnalyzeButton({ onClick, loading = false, disabled = false }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!loading) {
      setMsgIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [loading]);

  return (
    <div className="mt-stack-md w-full">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className={`w-full py-4 px-6 rounded-xl bg-primary text-white font-headline-md text-body-lg shadow-glow-sm hover:shadow-glow-md hover:bg-primary/90 transition-all duration-300 transform hover:-translate-y-0.5 flex justify-center items-center gap-2 group relative overflow-hidden ${
          loading || disabled ? 'opacity-60 cursor-not-allowed transform-none' : 'cursor-pointer'
        }`}
        id="analyzeBtn"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />

        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin flex-shrink-0" aria-hidden="true" />
            <span className="transition-opacity duration-300 animate-fade-in">{LOADING_MESSAGES[msgIndex]}</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined" aria-hidden="true">analytics</span>
            <span>Analyze Resume Compatibility</span>
          </>
        )}
      </button>
    </div>
  );
}
