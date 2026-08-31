const SAMPLE_TEMPLATES = [
  {
    label: 'Python Backend',
    text: 'Looking for a Senior Python Developer with strong expertise in FastAPI, Django, Docker, PostgreSQL, Redis, and AWS. Experience building REST APIs, CI/CD pipelines, and microservices is required. Knowledge of Kubernetes and Git is a plus.',
  },
  {
    label: 'Full-Stack',
    text: 'We are seeking a Senior Full-Stack Engineer to join our core product team. You will be responsible for designing and implementing scalable backend services in Node.js and building responsive frontends using React and Tailwind CSS. Experience with PostgreSQL and cloud deployments (AWS/GCP) is required.',
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
  return (
    <div className="glass-panel rounded-xl p-6 flex flex-col h-full relative">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="font-headline-md text-body-lg text-on-background flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary" aria-hidden="true">work</span>
          <span>Target Job Description</span>
        </h2>

        {/* Quick Templates */}
        <div className="flex items-center gap-1.5">
          {SAMPLE_TEMPLATES.map((tmpl) => (
            <button
              key={tmpl.label}
              type="button"
              onClick={() => onChange(tmpl.text)}
              disabled={disabled}
              className="px-2.5 py-1 rounded-md bg-surface border border-outline-variant/50 font-label-sm text-[11px] text-on-surface-variant hover:text-on-background hover:border-secondary/50 transition-colors"
            >
              {tmpl.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 focus-glow rounded-lg transition-all duration-300 bg-surface border border-outline-variant relative flex flex-col min-h-[300px]">
        <textarea
          rows={10}
          placeholder="Paste the full job description here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={MAX_JD_CHARS}
          disabled={disabled}
          className="w-full h-full min-h-[250px] bg-transparent border-none text-on-background font-body-md text-body-md p-4 pb-10 focus:ring-0 resize-none placeholder:text-outline/50 focus:outline-none"
        />

        <div className="absolute bottom-3 left-4">
          {value ? (
            <button
              type="button"
              onClick={onClear}
              disabled={disabled}
              className="font-label-sm text-label-sm text-outline hover:text-match-rose transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]" aria-hidden="true">delete_sweep</span>
              <span>Clear text</span>
            </button>
          ) : null}
        </div>

        <div className="absolute bottom-3 right-4 font-label-sm text-label-sm text-outline tabular-nums">
          {value.length.toLocaleString()} / {MAX_JD_CHARS.toLocaleString()}
        </div>
      </div>
    </div>
  );
}
