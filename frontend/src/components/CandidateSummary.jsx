export default function CandidateSummary({ summary }) {
  if (!summary || !summary.trim()) {
    return null;
  }

  return (
    <section className="results-card candidate-summary-card" aria-labelledby="summary-heading">
      <div className="card-header-row">
        <div className="card-icon-bubble" aria-hidden="true">📝</div>
        <div>
          <h3 id="summary-heading" className="card-heading-title">Candidate Summary</h3>
          <p className="card-heading-subtitle">Overview of candidate qualifications relative to role specifications</p>
        </div>
      </div>
      <div className="summary-body-text">
        <p>{summary}</p>
      </div>
    </section>
  );
}
