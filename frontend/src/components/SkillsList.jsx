import { useState } from 'react';

export default function SkillsList({ matchedSkills = [], missingSkills = [] }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'matched', 'missing'

  const safeMatched = Array.isArray(matchedSkills) ? matchedSkills : [];
  const safeMissing = Array.isArray(missingSkills) ? missingSkills : [];
  const totalCount = safeMatched.length + safeMissing.length;

  return (
    <section className="results-card skills-matrix-card" aria-labelledby="skills-matrix-heading">
      <div className="matrix-header-bar">
        <div>
          <h3 id="skills-matrix-heading" className="card-heading-title">Technical Skill Breakdown</h3>
          <p className="card-heading-subtitle">Comparative evaluation of required vs proven skills</p>
        </div>

        <div className="matrix-filter-tabs" role="tablist" aria-label="Skill category filter">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'all'}
            className={`filter-tab-btn ${activeTab === 'all' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Skills ({totalCount})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'matched'}
            className={`filter-tab-btn ${activeTab === 'matched' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('matched')}
          >
            ✓ Matched ({safeMatched.length})
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'missing'}
            className={`filter-tab-btn ${activeTab === 'missing' ? 'tab-btn-active' : ''}`}
            onClick={() => setActiveTab('missing')}
          >
            ✕ Gaps ({safeMissing.length})
          </button>
        </div>
      </div>

      <div className="matrix-columns-container">
        {/* Matched Skills Column */}
        {(activeTab === 'all' || activeTab === 'matched') && (
          <div className="skills-column column-matched">
            <div className="skills-col-header">
              <span className="col-indicator dot-matched" aria-hidden="true" />
              <h4 className="skills-col-title">Matched Skills ({safeMatched.length})</h4>
            </div>

            {safeMatched.length > 0 ? (
              <ul className="skills-chip-list" aria-label="List of matched skills">
                {safeMatched.map((skill) => (
                  <li key={skill} className="skill-chip chip-matched">
                    <span className="chip-glyph" aria-hidden="true">✓</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-skills-notice">No exact matching skills detected for this job specification.</p>
            )}
          </div>
        )}

        {/* Missing Skills Column */}
        {(activeTab === 'all' || activeTab === 'missing') && (
          <div className="skills-column column-missing">
            <div className="skills-col-header">
              <span className="col-indicator dot-missing" aria-hidden="true" />
              <div>
                <h4 className="skills-col-title">Skill Gaps ({safeMissing.length})</h4>
                <p className="skills-col-explanation">
                  Skills or requirements not sufficiently evidenced in the provided resume.
                </p>
              </div>
            </div>

            {safeMissing.length > 0 ? (
              <ul className="skills-chip-list" aria-label="List of missing skills">
                {safeMissing.map((skill) => (
                  <li key={skill} className="skill-chip chip-missing">
                    <span className="chip-glyph" aria-hidden="true">+</span>
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-skills-notice notice-success">
                🎉 Full Coverage! All detected required technical skills were satisfied.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
