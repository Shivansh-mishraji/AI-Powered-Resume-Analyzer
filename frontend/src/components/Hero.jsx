export default function Hero() {
  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      <div className="hero-badge" role="status">
        <span className="badge-sparkle" aria-hidden="true">✦</span>
        <span>AI-Powered • Privacy-Conscious • BYOK</span>
      </div>

      <h1 id="hero-heading" className="hero-headline">
        Analyze your resume against <span className="hero-gradient-text">any job description.</span>
      </h1>

      <p className="hero-subheadline">
        Get AI-powered semantic insights, identify critical skill gaps, and understand how closely your experience matches the role requirements.
      </p>
    </section>
  );
}
