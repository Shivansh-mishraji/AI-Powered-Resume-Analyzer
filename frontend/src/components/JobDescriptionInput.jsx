import { useId } from 'react';

const SAMPLE_TEMPLATES = [
  {
    role: '🐍 Python Backend Engineer',
    text: 'Looking for a Senior Python Developer with strong expertise in FastAPI, Django, Docker, PostgreSQL, Redis, and AWS. Experience building REST APIs, CI/CD pipelines, and microservices is required. Knowledge of Kubernetes and Git is a plus.',
  },
  {
    role: '⚛️ Full-Stack Engineer',
    text: 'Hiring a Full-Stack Engineer skilled in React, TypeScript, Node.js, Express, MongoDB, and Tailwind CSS. Must have hands-on experience with GraphQL, Git, Postman, and deploying web applications on GCP or AWS.',
  },
  {
    role: '🧠 AI / ML Engineer',
    text: 'Seeking a Machine Learning Engineer proficient in Python, Pandas, NumPy, Scikit-Learn, PyTorch, TensorFlow, and NLP. Experience with Gemini API, Docker, SQL, and data pipelines is highly desirable.',
  },
];

const MAX_JD_CHARS = 5000;

export default function JobDescriptionInput({ value, onChange, onClear, disabled = false }) {
  const textareaId = useId();

  return (
    <div className="form-field-card jd-field-card">
      <div className="field-header">
        <label htmlFor={textareaId} className="field-label">
          <span className="field-step-pill" aria-hidden="true">02</span>
          <div>
            <span className="field-title">Job Description</span>
            <span className="field-subtitle">Paste target role requirements or pick a template</span>
          </div>
        </label>
      </div>

      <div className="template-chips-bar" aria-label="Sample role templates">
        <span className="chips-caption">Quick Roles:</span>
        <div className="chips-list">
          {SAMPLE_TEMPLATES.map((sample) => (
            <button
              key={sample.role}
              type="button"
              className="template-chip-btn"
              onClick={() => onChange(sample.text)}
              disabled={disabled}
            >
              {sample.role}
            </button>
          ))}
        </div>
      </div>

      <div className="textarea-container">
        <textarea
          id={textareaId}
          rows={6}
          placeholder="Paste the target job description here (responsibilities, required technical skills, qualifications)..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="form-textarea"
          maxLength={MAX_JD_CHARS}
          disabled={disabled}
          aria-describedby="char-count-status"
        />

        <div className="textarea-footer">
          <span id="char-count-status" className="char-count" aria-live="polite">
            {value.length.toLocaleString()} / {MAX_JD_CHARS.toLocaleString()} characters
          </span>
          {value && (
            <button
              type="button"
              onClick={onClear}
              className="btn-clear-text"
              disabled={disabled}
            >
              Clear text
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
