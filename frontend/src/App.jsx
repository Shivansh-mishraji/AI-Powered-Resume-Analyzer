import { useState, useId } from 'react'
import './App.css'

const SAMPLE_JDS = [
  {
    role: '🐍 Python Backend Engineer',
    title: 'Python Backend Engineer',
    text: 'Looking for a Senior Python Developer with strong expertise in FastAPI, Django, Docker, PostgreSQL, Redis, and AWS. Experience building REST APIs, CI/CD pipelines, and microservices is required. Knowledge of Kubernetes and Git is a plus.'
  },
  {
    role: '⚛️ Full-Stack Developer',
    title: 'Full-Stack Developer (React + Node)',
    text: 'Hiring a Full-Stack Engineer skilled in React, TypeScript, Node.js, Express, MongoDB, and Tailwind CSS. Must have hands-on experience with GraphQL, Git, Postman, and deploying web applications on GCP or AWS.'
  },
  {
    role: '🧠 AI / ML Engineer',
    title: 'AI / Data Science Engineer',
    text: 'Seeking a Machine Learning Engineer proficient in Python, Pandas, NumPy, Scikit-Learn, PyTorch, TensorFlow, and NLP. Experience with Gemini API, Docker, SQL, and data pipelines is highly desirable.'
  }
]

const FREE_TIER_DAILY_LIMIT = 1500
const FREE_TIER_RPM_LIMIT = 15

function App() {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [sessionAiRequests, setSessionAiRequests] = useState(0)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState('Initializing...')
  const [loadingProgress, setLoadingProgress] = useState(10)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [copied, setCopied] = useState(false)
  const [filterTab, setFilterTab] = useState('all') // 'all', 'matched', 'missing'

  const fileInputId = useId()

  // Handle Drag and Drop
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const validateAndSetFile = (selectedFile) => {
    const validExtensions = ['.pdf', '.docx']
    const name = selectedFile.name.toLowerCase()
    const isValid = validExtensions.some(ext => name.endsWith(ext))

    if (!isValid) {
      setError('Unsupported file type. Please upload an authentic .pdf or .docx resume.')
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File exceeds maximum allowed size of 5MB. Please upload a smaller document.')
      return
    }

    setFile(selectedFile)
    setResult(null)
    setError('')
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload your resume file (PDF or DOCX) to begin analysis.')
      return
    }
    if (!jobDescription.trim()) {
      setError('Please provide a target job description or select one of the quick templates.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)
    setLoadingProgress(20)
    setLoadingStep('📄 Reading document stream into secure RAM...')

    const isUsingAI = Boolean(apiKey.trim())

    const t1 = setTimeout(() => {
      setLoadingProgress(55)
      setLoadingStep(isUsingAI ? '🤖 Running Gemini 2.5 deep semantic reasoning...' : '🔍 Parsing 50+ technical skill patterns...')
    }, 400)

    const t2 = setTimeout(() => {
      setLoadingProgress(85)
      setLoadingStep('🎯 Generating comprehensive evaluation breakdown...')
    }, 1200)

    const formData = new FormData()
    formData.append('resume', file)
    formData.append('job_description', jobDescription)

    const headers = {}
    if (isUsingAI) {
      headers['X-Gemini-API-Key'] = apiKey.trim()
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        headers: headers,
        body: formData
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.detail || 'Analysis request failed. Please check input parameters.')
        return
      }

      setLoadingProgress(100)
      setResult(data)
      if (data.is_ai_powered) {
        setSessionAiRequests(prev => prev + 1)
      }
    } catch {
      setError('Could not connect to FastAPI backend on http://127.0.0.1:8000. Ensure uvicorn server is active.')
    } finally {
      clearTimeout(t1)
      clearTimeout(t2)
      setLoading(false)
    }
  }

  const handleCopySummary = () => {
    if (!result) return
    const text = `=== RESUME COMPATIBILITY AUDIT ===
Target File: ${result.filename}
Match Score: ${result.score}%
Mode: ${result.is_ai_powered ? 'Google Gemini 2.5 AI' : 'Deterministic Keyword Engine'}
Confidence: ${result.analysis_confidence.toUpperCase()}

CANDIDATE SUMMARY:
${result.candidate_summary}

VERIFIED SKILLS (${result.matched_skills.length}):
${result.matched_skills.join(', ')}

MISSING GAPS (${result.missing_skills.length}):
${result.missing_skills.join(', ')}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrintReport = () => {
    window.print()
  }

  const handleReset = () => {
    setFile(null)
    setJobDescription('')
    setResult(null)
    setError('')
  }

  const getMaskedKey = (key) => {
    const trimmed = key.trim()
    if (!trimmed) return 'None (Fallback active)'
    if (trimmed.length <= 10) return `${trimmed.slice(0, 3)}•••••`
    return `${trimmed.slice(0, 6)}••••••••${trimmed.slice(-4)}`
  }

  // Radial Gauge Calculations
  const radius = 62
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = result ? circumference - (result.score / 100) * circumference : circumference

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981' // emerald
    if (score >= 60) return '#06b6d4' // cyan
    if (score >= 40) return '#f59e0b' // amber
    return '#f43f5e' // rose
  }

  const getScoreTier = (score) => {
    if (score >= 85) return { tier: 'Tier 1: Exceptional Fit', label: 'Top Candidate Profile', class: 'tier-top' }
    if (score >= 70) return { tier: 'Tier 2: Strong Candidate', label: 'High Alignment with Minor Gaps', class: 'tier-high' }
    if (score >= 50) return { tier: 'Tier 3: Moderate Fit', label: 'Core Fundamentals with Notable Gaps', class: 'tier-med' }
    return { tier: 'Tier 4: Stack Discrepancy', label: 'Major Skill / Domain Mismatch', class: 'tier-low' }
  }

  const remainingFree = Math.max(0, FREE_TIER_DAILY_LIMIT - sessionAiRequests)

  return (
    <div className="app-container">
      {/* Top Floating Glass Navigation */}
      <nav className="top-nav-bar">
        <div className="nav-brand">
          <div className="gemini-sparkle-logo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="url(#sparkle-grad)" />
              <defs>
                <linearGradient id="sparkle-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38bdf8" />
                  <stop offset="0.5" stopColor="#818cf8" />
                  <stop offset="1" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="nav-title">ResumeAI Studio</span>
          <span className="nav-version-tag">v2.0 Hybrid</span>
        </div>

        <div className="nav-badges-group">
          <div className="nav-status-pill">
            <span className="live-pulse-dot"></span>
            <span>API Online • 127.0.0.1:8000</span>
          </div>
          <a
            href="https://github.com/Shivansh-mishraji/AI-Powered-Resume-Analyzer"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-github-link"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </nav>

      {/* Main Hero Header */}
      <header className="hero-section">
        <div className="hero-highlight-tag">
          <span className="sparkle-icon">✨</span>
          <span>Next-Gen ATS Semantic Evaluation Engine</span>
        </div>
        <h1 className="hero-title">
          Smart Resume Intelligence & <span className="hero-gradient-text">Skill Matching</span>
        </h1>
        <p className="hero-subtitle">
          Benchmark technical resumes against real-world job specifications. Leverage Google Gemini 2.5 multimodal semantic reasoning with an in-memory deterministic fallback engine.
        </p>

        <div className="hero-features-bar">
          <div className="hero-feature-item">
            <span className="feature-icon">🔒</span>
            <span>RAM-Only Privacy</span>
          </div>
          <div className="hero-feature-item">
            <span className="feature-icon">⚡</span>
            <span>Deterministic ATS Rule-Engine</span>
          </div>
          <div className="hero-feature-item">
            <span className="feature-icon">🤖</span>
            <span>Gemini 2.5 Structured Reasoning</span>
          </div>
        </div>
      </header>

      {/* BYOK Google Gemini Security Hub */}
      <section className="glass-panel api-hub-panel">
        <div className="api-hub-glow"></div>
        <div className="api-hub-content">
          <div className="api-hub-header">
            <div className="api-hub-title-group">
              <div className="key-shield-badge">🔑</div>
              <div>
                <h2>Gemini API Key (BYOK — Bring Your Own Key)</h2>
                <p className="api-hub-subtext">
                  Your key is held strictly in browser memory for this session. It is never persisted, logged, or saved to localStorage.
                </p>
              </div>
            </div>
            <div className={`engine-mode-tag ${apiKey.trim() ? 'mode-ai' : 'mode-rule'}`}>
              <span className="mode-dot"></span>
              <span>{apiKey.trim() ? 'Google Gemini 2.5 Mode' : 'Deterministic Mode (No Key)'}</span>
            </div>
          </div>

          <div className="api-hub-input-row">
            <div className="key-input-container">
              <span className="input-lock-icon">🔐</span>
              <input
                type={showApiKey ? 'text' : 'password'}
                placeholder="Paste Gemini API Key (e.g. AIzaSy...)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="sleek-key-input"
                autoComplete="off"
                spellCheck="false"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="btn-key-action"
                title={showApiKey ? 'Hide Key' : 'Show Key'}
              >
                {showApiKey ? 'Hide' : 'Show'}
              </button>
              {apiKey.trim() && (
                <button
                  type="button"
                  onClick={() => setApiKey('')}
                  className="btn-key-clear"
                  title="Clear Key"
                >
                  ✕ Clear
                </button>
              )}
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-get-key"
            >
              <span>Get Free Key at Google AI Studio</span>
              <span className="external-arrow">↗</span>
            </a>
          </div>

          {/* Real-time Free Tier Monitor Strip */}
          <div className="quota-strip">
            <div className="quota-metric">
              <span className="q-label">Current Key</span>
              <span className="q-value mono-val">{getMaskedKey(apiKey)}</span>
            </div>
            <div className="quota-metric">
              <span className="q-label">Free Tier Daily Quota</span>
              <span className="q-value highlight-cyan">
                <strong>{remainingFree}</strong> / {FREE_TIER_DAILY_LIMIT} free requests left today
              </span>
            </div>
            <div className="quota-metric">
              <span className="q-label">Rate Limit</span>
              <span className="q-value">{FREE_TIER_RPM_LIMIT} Requests / Min</span>
            </div>
            <div className="quota-metric">
              <span className="q-label">Cost & Billing Protection</span>
              <span className="q-value zero-risk-badge">
                $0.00 (Zero Auto-Billing Risk)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace (Upload & Job Description) */}
      <main className="workspace-grid">
        {/* Step 1: Upload Card */}
        <section className="glass-panel workspace-card">
          <div className="panel-header">
            <div className="step-pill">01</div>
            <div>
              <h3>Upload Candidate Resume</h3>
              <p>Supported: PDF, DOCX (Up to 5MB • RAM-Only)</p>
            </div>
          </div>

          <div
            className={`dropzone-box ${isDragging ? 'dropzone-dragover' : ''} ${file ? 'dropzone-has-file' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id={fileInputId}
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="sr-only-input"
            />

            {!file ? (
              <label htmlFor={fileInputId} className="dropzone-inner-label">
                <div className="upload-icon-sphere">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div className="dropzone-text-group">
                  <span className="dropzone-headline">
                    <strong>Click to upload</strong> or drag & drop resume
                  </span>
                  <span className="dropzone-meta">PDF or Word DOCX (Multi-Column Layouts Supported)</span>
                </div>
              </label>
            ) : (
              <div className="file-active-card">
                <div className="file-type-icon">
                  {file.name.endsWith('.pdf') ? '📄 PDF' : '📝 DOCX'}
                </div>
                <div className="file-info-group">
                  <span className="active-file-name">{file.name}</span>
                  <span className="active-file-meta">
                    {(file.size / 1024).toFixed(1)} KB • In-Memory Safe
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                    setResult(null)
                  }}
                  className="btn-remove-active-file"
                  title="Remove uploaded resume"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Step 2: Job Description Card */}
        <section className="glass-panel workspace-card">
          <div className="panel-header">
            <div className="step-pill">02</div>
            <div>
              <h3>Target Job Description</h3>
              <p>Paste role requirements or use a quick template</p>
            </div>
          </div>

          <div className="sample-template-bar">
            <span className="template-label">⚡ Quick Roles:</span>
            {SAMPLE_JDS.map((sample) => (
              <button
                key={sample.title}
                type="button"
                className="template-chip"
                onClick={() => setJobDescription(sample.text)}
              >
                {sample.role}
              </button>
            ))}
          </div>

          <div className="textarea-wrap">
            <textarea
              rows={7}
              placeholder="Paste responsibilities, required technical skills, and experience criteria here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="sleek-textarea"
            />
            <div className="textarea-footer">
              <span>{jobDescription.length} / 5,000 characters</span>
              {jobDescription && (
                <button
                  type="button"
                  onClick={() => setJobDescription('')}
                  className="btn-clear-textarea"
                >
                  Clear Text
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Error Notification */}
      {error && (
        <div className="alert-error-card">
          <span className="alert-icon">⚠️</span>
          <div className="alert-text">{error}</div>
        </div>
      )}

      {/* Action Execution Hub */}
      <div className="action-hub-bar">
        <button
          type="button"
          onClick={handleAnalyze}
          className={`btn-execute-analysis ${loading ? 'btn-executing' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <div className="loading-execution-state">
              <div className="cyber-spinner"></div>
              <span>{loadingStep}</span>
              <span className="progress-num">[{loadingProgress}%]</span>
            </div>
          ) : (
            <>
              <span className="btn-lightning-icon">⚡</span>
              <span>Analyze Resume Compatibility</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </>
          )}
        </button>

        {result && (
          <button type="button" onClick={handleReset} className="btn-reset-workspace">
            <span>🔄 New Audit</span>
          </button>
        )}
      </div>

      {/* Results Executive Analytics Dashboard */}
      {result && (
        <section className="glass-panel results-studio">
          {/* Studio Header Bar */}
          <div className="studio-header">
            <div className="studio-header-left">
              <div className="studio-badge-row">
                <span className={`engine-flag ${result.is_ai_powered ? 'flag-ai' : 'flag-rule'}`}>
                  {result.is_ai_powered ? '🤖 Google Gemini 2.5 Semantic AI' : '⚡ Deterministic Keyword Engine'}
                </span>
                <span className="confidence-flag">
                  Confidence: <strong>{result.analysis_confidence.toUpperCase()}</strong>
                </span>
              </div>
              <h2 className="studio-title">Candidate Evaluation Breakdown</h2>
              <p className="studio-doc-name">Audited File: <strong>{result.filename}</strong></p>
            </div>

            <div className="studio-header-actions">
              <button type="button" onClick={handlePrintReport} className="btn-action-outline">
                <span>🖨️ Export PDF Report</span>
              </button>
              <button type="button" onClick={handleCopySummary} className="btn-action-primary">
                <span>{copied ? '✅ Copied to Clipboard!' : '📋 Copy Summary'}</span>
              </button>
            </div>
          </div>

          {/* Warnings Alert Banner if any */}
          {result.warnings && result.warnings.length > 0 && (
            <div className="studio-warnings-box">
              {result.warnings.map((warn, i) => (
                <div key={i} className="warning-line">
                  <span className="warning-icon">ℹ️</span>
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          )}

          {/* Top Score & Metric Pillars */}
          <div className="metric-pillars-grid">
            {/* Radial Score Gauge Card */}
            <div className="score-pillar-card">
              <div className="gauge-container">
                <svg className="radial-svg" width="160" height="160">
                  <circle
                    className="radial-track"
                    cx="80"
                    cy="80"
                    r={radius}
                    strokeWidth="14"
                  />
                  <circle
                    className="radial-bar"
                    cx="80"
                    cy="80"
                    r={radius}
                    strokeWidth="14"
                    stroke={getScoreColor(result.score)}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="radial-center-text">
                  <span className="radial-score-num" style={{ color: getScoreColor(result.score) }}>
                    {result.score}%
                  </span>
                  <span className="radial-score-label">MATCH SCORE</span>
                </div>
              </div>

              <div className="score-pillar-info">
                <div className={`score-tier-badge ${getScoreTier(result.score).class}`}>
                  {getScoreTier(result.score).tier}
                </div>
                <p className="tier-explanation">
                  {getScoreTier(result.score).label}
                </p>
              </div>
            </div>

            {/* Stat Counter Pillar 1 */}
            <div className="stat-pillar-card pillar-matched">
              <div className="stat-pillar-header">
                <span className="stat-symbol">✅</span>
                <span className="stat-heading">Verified Skills</span>
              </div>
              <div className="stat-pillar-big">{result.matched_skills.length}</div>
              <p className="stat-pillar-desc">Technical qualifications proven in resume</p>
            </div>

            {/* Stat Counter Pillar 2 */}
            <div className="stat-pillar-card pillar-missing">
              <div className="stat-pillar-header">
                <span className="stat-symbol">❌</span>
                <span className="stat-heading">Skill Gaps</span>
              </div>
              <div className="stat-pillar-big">{result.missing_skills.length}</div>
              <p className="stat-pillar-desc">Required qualifications with missing evidence</p>
            </div>
          </div>

          {/* Executive Candidate Assessment Card */}
          {result.candidate_summary && (
            <div className="qualitative-assessment-card">
              <div className="qualitative-header">
                <div className="qualitative-icon-box">📝</div>
                <div>
                  <h3>Executive Candidate Assessment</h3>
                  <p>Comprehensive qualitative evaluation against role criteria</p>
                </div>
              </div>
              <div className="assessment-body">
                <p>{result.candidate_summary}</p>
              </div>
            </div>
          )}

          {/* Deep Qualitative AI Cards (Strengths, Weaknesses, Suggestions) */}
          {result.is_ai_powered && (
            <div className="qualitative-triad-grid">
              {/* Strengths */}
              <div className="triad-card triad-strengths">
                <div className="triad-header">
                  <span className="triad-icon">💪</span>
                  <h4>Competitive Strengths</h4>
                </div>
                <ul className="triad-list">
                  {result.strengths && result.strengths.length > 0 ? (
                    result.strengths.map((str, idx) => (
                      <li key={idx} className="triad-item-strength">
                        <span className="bullet-glow">✓</span>
                        <span>{str}</span>
                      </li>
                    ))
                  ) : (
                    <li className="triad-empty">No stand-out competitive strengths noted.</li>
                  )}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="triad-card triad-weaknesses">
                <div className="triad-header">
                  <span className="triad-icon">🔍</span>
                  <h4>Skill Gaps & Discrepancies</h4>
                </div>
                <ul className="triad-list">
                  {result.weaknesses && result.weaknesses.length > 0 ? (
                    result.weaknesses.map((weak, idx) => (
                      <li key={idx} className="triad-item-weakness">
                        <span className="bullet-glow">!</span>
                        <span>{weak}</span>
                      </li>
                    ))
                  ) : (
                    <li className="triad-empty">No major domain conflicts detected.</li>
                  )}
                </ul>
              </div>

              {/* Suggestions */}
              <div className="triad-card triad-suggestions">
                <div className="triad-header">
                  <span className="triad-icon">💡</span>
                  <h4>Actionable ATS Improvements</h4>
                </div>
                <ul className="triad-list">
                  {result.suggestions && result.suggestions.length > 0 ? (
                    result.suggestions.map((sug, idx) => (
                      <li key={idx} className="triad-item-suggestion">
                        <span className="bullet-glow">➜</span>
                        <span>{sug}</span>
                      </li>
                    ))
                  ) : (
                    <li className="triad-empty">Resume is tightly aligned with role specifications.</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Interactive Skill Breakdown Filter Matrix */}
          <div className="skill-matrix-section">
            <div className="matrix-nav-bar">
              <div className="matrix-nav-title">
                <h4>Technical Skill Breakdown Matrix</h4>
              </div>
              <div className="matrix-tabs">
                <button
                  className={`matrix-tab ${filterTab === 'all' ? 'tab-active' : ''}`}
                  onClick={() => setFilterTab('all')}
                >
                  All Skills ({result.matched_skills.length + result.missing_skills.length})
                </button>
                <button
                  className={`matrix-tab ${filterTab === 'matched' ? 'tab-active' : ''}`}
                  onClick={() => setFilterTab('matched')}
                >
                  ✅ Matched ({result.matched_skills.length})
                </button>
                <button
                  className={`matrix-tab ${filterTab === 'missing' ? 'tab-active' : ''}`}
                  onClick={() => setFilterTab('missing')}
                >
                  ❌ Missing ({result.missing_skills.length})
                </button>
              </div>
            </div>

            <div className="matrix-grid">
              {/* Matched Column */}
              {(filterTab === 'all' || filterTab === 'matched') && (
                <div className="matrix-column col-matched">
                  <div className="column-header">
                    <span className="col-indicator-dot dot-green"></span>
                    <h5>Verified Qualifications ({result.matched_skills.length})</h5>
                  </div>
                  <div className="tags-cloud">
                    {result.matched_skills.length > 0 ? (
                      result.matched_skills.map((skill) => (
                        <div key={skill} className="cloud-tag tag-verified">
                          <span className="tag-glyph">✓</span>
                          <span>{skill}</span>
                        </div>
                      ))
                    ) : (
                      <div className="cloud-empty-msg">No exact matching skills detected.</div>
                    )}
                  </div>
                </div>
              )}

              {/* Missing Column */}
              {(filterTab === 'all' || filterTab === 'missing') && (
                <div className="matrix-column col-missing">
                  <div className="column-header">
                    <span className="col-indicator-dot dot-red"></span>
                    <h5>Unmatched Requirements ({result.missing_skills.length})</h5>
                  </div>
                  <div className="tags-cloud">
                    {result.missing_skills.length > 0 ? (
                      result.missing_skills.map((skill) => (
                        <div key={skill} className="cloud-tag tag-missing">
                          <span className="tag-glyph">+</span>
                          <span>{skill}</span>
                        </div>
                      ))
                    ) : (
                      <div className="cloud-empty-msg success-highlight">
                        🎉 Full Coverage! All detected required skills were satisfied.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default App
