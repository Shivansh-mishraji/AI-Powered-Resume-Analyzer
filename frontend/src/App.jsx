import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import PrivacyNotice from './components/PrivacyNotice';
import ResumeUpload from './components/ResumeUpload';
import JobDescriptionInput from './components/JobDescriptionInput';
import ApiKeyInput from './components/ApiKeyInput';
import AnalyzeButton from './components/AnalyzeButton';
import LoadingState from './components/LoadingState';
import ScoreCard from './components/ScoreCard';
import AnalysisStatus from './components/AnalysisStatus';
import CandidateSummary from './components/CandidateSummary';
import SkillsList from './components/SkillsList';
import StrengthsCard from './components/StrengthsCard';
import WeaknessesCard from './components/WeaknessesCard';
import SuggestionsCard from './components/SuggestionsCard';
import WarningCard from './components/WarningCard';
import { analyzeResume, checkBackendHealth } from './services/api';
import './App.css';

export default function App() {
  // Input form state
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [apiKey, setApiKey] = useState('');

  // Application lifecycle state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [copied, setCopied] = useState(false);

  const resultsRef = useRef(null);

  // Initial backend health check
  useEffect(() => {
    checkBackendHealth()
      .then((res) => setIsOnline(res.status === 'ok'))
      .catch(() => setIsOnline(false));
  }, []);

  // Scroll to results when analysis completes
  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const handleFileSelect = (selectedFile) => {
    const validExtensions = ['.pdf', '.docx'];
    const name = selectedFile.name.toLowerCase();
    const isValid = validExtensions.some((ext) => name.endsWith(ext));

    if (!isValid) {
      setError('Unsupported file type. Please upload a PDF or DOCX file.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File exceeds the 5 MB limit. Please upload a smaller document.');
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleFileRemove = () => {
    setFile(null);
  };

  const handleClearApiKey = () => {
    setApiKey('');
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload your resume (PDF or DOCX).');
      return;
    }

    if (!jobDescription.trim()) {
      setError('Please enter a target job description.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await analyzeResume({
        file,
        jobDescription,
        apiKey,
      });

      setResult(data);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobDescription('');
    setResult(null);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCopySummary = () => {
    if (!result) return;
    const text = `=== RESUME COMPATIBILITY EVALUATION ===
File: ${result.filename || 'resume'}
Match Score: ${result.score}%
Mode: ${result.is_ai_powered ? 'AI-Powered Analysis' : 'Rule-Based Analysis'}
Confidence: ${(result.analysis_confidence || 'N/A').toUpperCase()}

CANDIDATE SUMMARY:
${result.candidate_summary || 'N/A'}

MATCHED SKILLS:
${(result.matched_skills || []).join(', ') || 'None detected'}

SKILL GAPS:
${(result.missing_skills || []).join(', ') || 'None'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="app-layout">
      {/* 1. Header */}
      <Header isOnline={isOnline} />

      {/* 2. Hero Section */}
      <Hero />

      {/* 3. Main Workspace */}
      <main className="main-content-container">
        <section className="analysis-workspace-card" aria-label="Resume analysis form">
          <div className="workspace-grid-inputs">
            {/* Step 1: Resume Upload */}
            <ResumeUpload
              file={file}
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              disabled={loading}
            />

            {/* Step 2: Job Description */}
            <JobDescriptionInput
              value={jobDescription}
              onChange={setJobDescription}
              onClear={() => setJobDescription('')}
              disabled={loading}
            />
          </div>

          {/* Step 3: BYOK Gemini Key Input */}
          <ApiKeyInput
            value={apiKey}
            onChange={setApiKey}
            onClear={handleClearApiKey}
            disabled={loading}
          />

          {/* Privacy Note */}
          <PrivacyNotice />

          {/* Error Banner */}
          {error && (
            <div className="error-alert-banner" role="alert">
              <span className="error-icon" aria-hidden="true">⚠️</span>
              <div className="error-message">{error}</div>
              <button
                type="button"
                onClick={() => setError('')}
                className="btn-dismiss-error"
                aria-label="Dismiss error"
              >
                ✕
              </button>
            </div>
          )}

          {/* Step 4: Primary Analyze CTA */}
          <AnalyzeButton
            onClick={handleAnalyze}
            loading={loading}
            disabled={!file || !jobDescription.trim()}
          />
        </section>

        {/* 4. Loading Experience */}
        {loading && <LoadingState isAiPowered={Boolean(apiKey.trim())} />}

        {/* 5. Results Dashboard */}
        {result && (
          <section
            ref={resultsRef}
            className="results-dashboard-container"
            aria-label="Resume analysis results"
          >
            {/* Dashboard Header Bar */}
            <div className="dashboard-header-bar">
              <div className="dashboard-header-left">
                <AnalysisStatus
                  isAiPowered={result.is_ai_powered}
                  confidence={result.analysis_confidence}
                  filename={result.filename}
                />
                <h2 className="dashboard-title">Analysis Evaluation Dashboard</h2>
              </div>

              <div className="dashboard-actions-group">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="btn-dashboard-action btn-print"
                  aria-label="Print or export analysis as PDF"
                >
                  <span>🖨️ Export PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="btn-dashboard-action btn-copy"
                  aria-label="Copy analysis summary to clipboard"
                >
                  <span>{copied ? '✓ Copied' : '📋 Copy Summary'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-dashboard-action btn-reset"
                  aria-label="Analyze another resume"
                >
                  <span>🔄 Analyze Another Resume</span>
                </button>
              </div>
            </div>

            {/* Warnings Card */}
            <WarningCard warnings={result.warnings} />

            {/* Score Card & Quick Metrics */}
            <ScoreCard score={result.score} />

            {/* Candidate Summary */}
            <CandidateSummary summary={result.candidate_summary} />

            {/* Matched & Missing Skills Matrix */}
            <SkillsList
              matchedSkills={result.matched_skills}
              missingSkills={result.missing_skills}
            />

            {/* AI Deep Evaluation Cards (Strengths, Weaknesses, Suggestions) */}
            <div className="triad-cards-grid">
              <StrengthsCard strengths={result.strengths} />
              <WeaknessesCard weaknesses={result.weaknesses} />
              <SuggestionsCard suggestions={result.suggestions} />
            </div>
          </section>
        )}

        {/* 6. Onboarding "How It Works" (Shown when no result and not loading) */}
        {!result && !loading && <HowItWorks />}
      </main>

      {/* Footer */}
      <footer className="app-footer" role="contentinfo">
        <p>
          AI-Powered Resume & Job Description Analyzer • Built with FastAPI & React
        </p>
      </footer>
    </div>
  );
}
