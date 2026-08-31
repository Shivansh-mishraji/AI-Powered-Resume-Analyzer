export default function SuggestionsCard({ suggestions = [] }) {
  const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];

  if (safeSuggestions.length === 0) {
    return null;
  }

  return (
    <section className="results-card triad-card card-suggestions" aria-labelledby="suggestions-heading">
      <div className="triad-card-header">
        <div className="triad-icon-box" aria-hidden="true">💡</div>
        <h3 id="suggestions-heading" className="triad-card-title">Recommended Improvements</h3>
      </div>

      <ol className="triad-suggestions-list" aria-label="Actionable recommendations">
        {safeSuggestions.map((item, index) => {
          const stepNum = String(index + 1).padStart(2, '0');
          return (
            <li key={index} className="triad-suggestion-item">
              <span className="suggestion-step-num" aria-hidden="true">{stepNum}</span>
              <p className="suggestion-text">{item}</p>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
