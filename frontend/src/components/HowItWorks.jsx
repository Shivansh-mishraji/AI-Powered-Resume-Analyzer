export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Upload Resume',
      desc: 'Select your PDF or DOCX file. The document is parsed strictly in runtime memory.',
    },
    {
      num: '02',
      title: 'Add Job Description',
      desc: 'Paste the target job requirements or pick a quick role template to benchmark against.',
    },
    {
      num: '03',
      title: 'Analyze',
      desc: 'Optionally supply your Gemini API key for deep neural evaluation, or use the deterministic engine.',
    },
    {
      num: '04',
      title: 'Get Insights',
      desc: 'Review your overall match score, verified skills, missing criteria, and actionable improvements.',
    },
  ];

  return (
    <section className="how-it-works-section" aria-labelledby="how-it-works-heading">
      <div className="section-label-row">
        <span className="section-tag">Workflow</span>
        <h2 id="how-it-works-heading" className="how-it-works-title">How It Works</h2>
      </div>

      <div className="steps-grid">
        {steps.map((step) => (
          <div key={step.num} className="step-card">
            <div className="step-number" aria-hidden="true">{step.num}</div>
            <h3 className="step-card-title">{step.title}</h3>
            <p className="step-card-desc">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
