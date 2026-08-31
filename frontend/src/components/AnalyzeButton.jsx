export default function AnalyzeButton({ onClick, loading = false, disabled = false }) {
  return (
    <div className="w-full mt-6">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className={`w-full py-4 px-6 rounded-xl font-label-md text-body-md font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg active:scale-[0.99] ${
          loading || disabled
            ? 'bg-primary/50 cursor-not-allowed opacity-70'
            : 'bg-primary hover:bg-primary/90 shadow-glow-sm hover:shadow-glow-md cursor-pointer'
        }`}
      >
        {loading ? (
          <>
            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
            <span>Analyzing Resume Compatibility...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">analytics</span>
            <span>Analyze Resume Compatibility</span>
          </>
        )}
      </button>
    </div>
  );
}
