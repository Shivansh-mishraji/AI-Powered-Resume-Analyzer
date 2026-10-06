import { useState } from 'react';

export default function InteractiveWalkthrough({
  hasResume,
  hasJd,
  onLoadSample,
  isLoadingSample,
}) {
  const [activeStepHover, setActiveStepHover] = useState(null);

  const steps = [
    {
      num: '01',
      icon: 'description',
      title: 'Select Resume Document',
      desc: 'Upload PDF/DOCX or use 1-Click Sample. Parsed in RAM only with 0 database storage.',
      isDone: hasResume,
      activeColor: 'text-indigo-400 border-indigo-500/50 bg-indigo-500/10',
      badge: hasResume ? '✓ Ready' : 'Pending',
    },
    {
      num: '02',
      icon: 'target',
      title: 'Target Job Requirements',
      desc: 'Paste any job posting or select an instant role template to match against.',
      isDone: hasJd,
      activeColor: 'text-amber-400 border-amber-500/50 bg-amber-500/10',
      badge: hasJd ? '✓ Ready' : 'Pending',
    },
    {
      num: '03',
      icon: 'radar',
      title: 'Real-Time X-Ray Audit',
      desc: 'Watch the live visual pipeline extract entities, resolve synonyms, and calculate ATS fit.',
      isDone: hasResume && hasJd,
      activeColor: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10',
      badge: hasResume && hasJd ? 'Ready to Run ⚡' : 'Requires Steps 1 & 2',
    },
  ];

  return (
    <div className="w-full mb-8 relative z-10 animate-fade-in">
      {/* 1-Click Instant Demo Action Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/60 border border-indigo-500/30 shadow-[0_0_25px_rgba(99,102,241,0.15)] flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md mb-6">
        <div className="flex items-center gap-3.5 text-center md:text-left">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.3)] animate-pulse">
            <span className="text-2xl" role="img" aria-label="sparkles">✨</span>
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="font-headline-sm text-sm sm:text-base font-bold text-white tracking-wide">
                No Resume File on Hand?
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                1-Click Test
              </span>
            </div>
            <p className="font-body-sm text-xs text-slate-300 mt-0.5">
              Load a verified Full-Stack Engineer resume &amp; matching job description to test every feature instantly.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onLoadSample}
          disabled={isLoadingSample}
          className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-label-md text-xs sm:text-sm font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          id="btn-try-sample"
        >
          {isLoadingSample ? (
            <>
              <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
              <span>Loading Demo Data...</span>
            </>
          ) : (
            <>
              <span className="text-base" role="img" aria-label="lightning">⚡</span>
              <span>Try 1-Click Demo (Sample Data)</span>
            </>
          )}
        </button>
      </div>

      {/* 3-Step Interactive Process Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {steps.map((st, idx) => (
          <div
            key={st.num}
            onMouseEnter={() => setActiveStepHover(idx)}
            onMouseLeave={() => setActiveStepHover(null)}
            className={`p-3.5 sm:p-4 rounded-xl border transition-all duration-300 backdrop-blur-md relative overflow-hidden ${
              st.isDone
                ? 'bg-slate-900/60 border-indigo-500/40 shadow-sm'
                : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            {/* Step Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold text-slate-400 tracking-wider">
                  STEP {st.num}
                </span>
                <span className="material-symbols-outlined text-[16px] text-slate-300" aria-hidden="true">
                  {st.icon}
                </span>
              </div>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  st.isDone
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {st.badge}
              </span>
            </div>

            {/* Step Title & Description */}
            <h4 className="font-headline-sm text-xs sm:text-sm font-semibold text-white mb-1">
              {st.title}
            </h4>
            <p className="font-body-sm text-[11px] text-slate-300 leading-relaxed">
              {st.desc}
            </p>

            {/* Progress underline */}
            <div className="w-full h-1 bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  st.isDone ? 'w-full bg-gradient-to-r from-indigo-500 to-emerald-400' : 'w-0'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
