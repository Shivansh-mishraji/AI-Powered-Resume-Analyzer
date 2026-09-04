export default function WeaknessesCard({ weaknesses = [] }) {
  const safeWeaknesses = Array.isArray(weaknesses) ? weaknesses : [];

  if (safeWeaknesses.length === 0) {
    return null;
  }

  return (
    <section className="results-card triad-card card-weaknesses" aria-labelledby="weaknesses-heading">
      <div className="triad-card-header">
        <div className="triad-icon-box" aria-hidden="true">🔍</div>
        <h3 id="weaknesses-heading" className="triad-card-title">Areas to Improve</h3>
      </div>

      <ul className="triad-items-list" aria-label="Areas to improve">
        {safeWeaknesses.map((item, index) => (
          <li key={index} className="triad-list-item item-weakness">
            <span className="item-bullet-glyph glyph-weakness" aria-hidden="true">!</span>
            <span className="item-text">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
