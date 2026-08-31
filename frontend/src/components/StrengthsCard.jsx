export default function StrengthsCard({ strengths = [] }) {
  const safeStrengths = Array.isArray(strengths) ? strengths : [];

  if (safeStrengths.length === 0) {
    return null;
  }

  return (
    <section className="results-card triad-card card-strengths" aria-labelledby="strengths-heading">
      <div className="triad-card-header">
        <div className="triad-icon-box" aria-hidden="true">💪</div>
        <h3 id="strengths-heading" className="triad-card-title">Strengths</h3>
      </div>

      <ul className="triad-items-list" aria-label="Candidate strengths">
        {safeStrengths.map((item, index) => (
          <li key={index} className="triad-list-item item-strength">
            <span className="item-bullet-glyph glyph-strength" aria-hidden="true">✓</span>
            <span className="item-text">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
