import { useId } from 'react';

const SAMPLE_TEMPLATES = [
  {
    label: 'Python Backend',
    text: 'Looking for a Senior Python Developer with strong expertise in FastAPI, Django, Docker, PostgreSQL, Redis, and AWS. Experience building REST APIs, CI/CD pipelines, and microservices is required. Knowledge of Kubernetes and Git is a plus.',
  },
  {
    label: 'Full-Stack',
    text: 'We are seeking a Senior Full-Stack Engineer to join our core product team. You will be responsible for designing and implementing scalable backend services in Node.js/Python and building responsive frontends using React and Tailwind CSS. Experience with PostgreSQL and cloud deployments (AWS/GCP) is required.',
  },
  {
    label: 'AI/ML',
    text: 'Seeking a Machine Learning Engineer proficient in Python, Pandas, NumPy, Scikit-Learn, PyTorch, TensorFlow, and NLP. Experience with Gemini API, Docker, SQL, and data pipelines is highly desirable.',
  },
];

const MAX_JD_CHARS = 5000;

export default function JobDescriptionCard({
  value,
  onChange,
  onClear,
  disabled = false,
}) {
  const textareaId = useId();

  return (
    <div className="glass-panel rounded-xl p-6 relative overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="font-headline-md text-body-lg text-on-background flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary" aria-hidden="true">work</span>
          <span>Target Job Description</span>
        </h2>

        {/* Template Buttons */}
        <div className="flex items-center gap-1.5 font-label-sm text-[11px]">
          {SAMPLE_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.label}
              type="button"
              onClick={() => onChange(tmpl.text)}
              disabled={disabled}
              className="px-2.5 py-1 rounded-md bg-surface-container/60 hover:bg-surface-bright border border-outline-variant/40 text-on-surface-variant hover:text-on-background transition-all"
            >
              {tmpl.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative flex-1 flex flex-col">
        <textarea
          id={textareaId}
          rows={10}
          placeholder="Paste the full job description here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={MAX_JD_CHARS}
          disabled={disabled}
          className="w-full flex-1 bg-surface-container-low/40 border border-outline-variant/50 rounded-lg p-4 text-on-background font-body-md text-label-md placeholder-outline/70 focus:outline-none focus:border-secondary/50 focus:ring-1 focus:ring-secondary/50 focus-glow transition-all resize-none min-h-[220px]"
        />

        <div className="flex items-center justify-between mt-3 font-label-sm text-[12px] text-outline">
          {value ? (
            <button
              type="button"
              onClick={onClear}
              disabled={disabled}
              className="hover:text-match-rose transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">backspace</span>
              <span>Clear text</span>
            </button>
          ) : (
            <span />
          )}
          <span className="tabular-nums">
            {value.length.toLocaleString()} / {MAX_JD_CHARS.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
