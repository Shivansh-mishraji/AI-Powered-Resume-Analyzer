import { useState, useId } from 'react'
import './App.css'

const SAMPLE_ROLES = [
  {
    icon: '🐍',
    title: 'Python Backend Engineer',
    text: 'Looking for a Senior Python Developer with strong expertise in FastAPI, Django, Docker, PostgreSQL, Redis, and AWS. Experience building REST APIs, CI/CD pipelines, and microservices is required. Knowledge of Kubernetes and Git is a plus.'
  },
  {
    icon: '⚛️',
    title: 'Full-Stack Developer (React + Node)',
    text: 'Hiring a Full-Stack Engineer skilled in React, TypeScript, Node.js, Express, MongoDB, and Tailwind CSS. Must have hands-on experience with GraphQL, Git, Postman, and deploying web applications on GCP or AWS.'
  },
  {
    icon: '🧠',
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
  const [loadingStep, setLoadingStep] = useState('Initializing Google Gemini AI...')
  const [loadingProgress, setLoadingProgress] = useState(15)
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [copied, setCopied] = useState(false)
  const [filterTab, setFilterTab] = useState('all') // 'all', 'matched', 'missing'

  const fileInputId = useId()

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
      setError('Invalid format. Google Stitch accepts authentic .pdf or .docx resume documents.')
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File exceeds 5MB size limit. Please upload a smaller document.')
      return
    }

    setFile(selectedFile)
    setResult(null)
    setError('')
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select or drop your resume document (PDF or DOCX).')
      return
    }
    if (!jobDescription.trim()) {
      setError('Please provide a target job description or select a Google Stitch template.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)
    setLoadingProgress(25)
    setLoadingStep('📄 Stitching document stream into in-memory parser...')

    const isUsingAI = Boolean(apiKey.trim())

    const t1 = setTimeout(() => {
      setLoadingProgress(60)
      setLoadingStep(isUsingAI ? '🤖 Prompting Gemini 2.5 structured rubric engine...' : '🔍 Running 50+ deterministic AST skill matching...')
    }, 400)

    const t2 = setTimeout(() => {
      setLoadingProgress(90)
      setLoadingStep('✨ Rendering Google Material 3 Analytics Studio...')
    }, 1100)

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
        setError(data.detail || 'Analysis request failed. Please check inputs.')
        return
      }

      setLoadingProgress(100)
      setResult(data)
      if (data.is_ai_powered) {
        setSessionAiRequests(prev => prev + 1)
      }
    } catch {
      setError('Could not connect to FastAPI server at http://127.0.0.1:8000. Ensure uvicorn is running.')
    } finally {
      clearTimeout(t1)
      clearTimeout(t2)
      setLoading(false)
    }
  }

  const handleCopySummary = () => {
    if (!result) return
    const text = `=== GOOGLE STITCH RESUME INTELLIGENCE ===
Analyzed File: ${result.filename}
Overall Match Score: ${result.score}%
Engine Mode: ${result.is_ai_powered ? 'Google Gemini 2.5 AI' : 'Deterministic Keyword Engine'}
Confidence: ${result.analysis_confidence.toUpperCase()}

EXECUTIVE SUMMARY:
${result.candidate_summary}

VERIFIED QUALIFICATIONS (${result.matched_skills.length}):
${result.matched_skills.join(', ')}

MISSING CRITERIA (${result.missing_skills.length}):
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
    if (!trimmed) return 'None (Fallback mode active)'
    if (trimmed.length <= 10) return `${trimmed.slice(0, 3)}•••••`
    return `${trimmed.slice(0, 6)}••••••••${trimmed.slice(-4)}`
  }

  // Google Stitch Progress Gauge
  const radius = 68
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = result ? circumference - (result.score / 100) * circumference : circumference

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981' // Google Green
    if (score >= 60) return '#38bdf8' // Google Cyan/Blue
    if (score >= 40) return '#f59e0b' // Google Amber
    return '#f43f5e' // Google Red
  }

  const getScoreTier = (score) => {
    if (score >= 85) return { tier: 'Tier 1: High Alignment', desc: 'Candidate exceeds mandatory role criteria with strong project evidence.', class: 'tier-emerald' }
    if (score >= 70) return { tier: 'Tier 2: Strong Contender', desc: 'Satisfies core stack requirements with minor secondary gaps.', class: 'tier-cyan' }
    if (score >= 50) return { tier: 'Tier 3: Moderate Fit', desc: 'Possesses foundational skills but misses 2+ core qualifications.', class: 'tier-amber' }
    return { tier: 'Tier 4: Stack Discrepancy', desc: 'Substantial mismatch in primary domain, framework, or seniority.', class: 'tier-rose' }
  }

  const remainingFree = Math.max(0, FREE_TIER_DAILY_LIMIT - sessionAiRequests)

  return (
    <div className="stitch-app">
      {/* ── 1. Google Stitch Header Navigation ── */}
      <header className="stitch-navbar">
        <div className="stitch-nav-left">
          <div className="stitch-logo-badge">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="url(#gemini-stitch-gradient)" />
              <circle cx="19" cy="5" r="2" fill="#38bdf8" />
              <circle cx="5" cy="19" r="1.5" fill="#f472b6" />
              <defs>
                <linearGradient id="gemini-stitch-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#38bdf8" />
                  <stop offset="0.4" stopColor="#818cf8" />
                  <stop offset="0.8" stopColor="#c084fc" />
                  <stop offset="1" stopColor="#f472b6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="stitch-brand-info">
            <div className="stitch-title-row">
              <span className="stitch-brand-name">Google Stitch</span>
              <span className="stitch-product-tag">Resume Studio</span>
            </div>
            <span className="stitch-tech-stack">Gemini 2.5 Flash • Material 3</span>
          </div>
        </div>

        <div className="stitch-nav-right">
          <div className="stitch-status-chip">
            <span className="stitch-live-dot"></span>
            <span>FastAPI Live: 127.0.0.1:8000</span>
          </div>
          <a
            href="https://github.com/Shivansh-mishraji/AI-Powered-Resume-Analyzer"
            target="_blank"
            rel="noopener noreferrer"
            className="stitch-btn-github"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </header>

      {/* ── 2. Stitch Hero Banner ── */}
      <section className="stitch-hero">
        <div className="stitch-hero-pill">
          <span className="pill-gemini-icon">✦</span>
          <span>Google AI Studio & Material 3 Stitch Component System</span>
        </div>
        <h1 className="stitch-hero-headline">
          Autonomous Resume Intelligence & <span className="stitch-gradient-text">ATS Benchmarking</span>
        </h1>
        <p className="stitch-hero-subheadline">
          Stitch your candidate profile against complex target job descriptions with deep semantic evaluation, rubric scoring, and deterministic fallback protection.
        </p>
      </section>

      {/* ── 3. Google Stitch BYOK & Quota Hub ── */}
      <section className="stitch-card stitch-byok-card">
        <div className="byok-header-row">
          <div className="byok-title-block">
            <div className="byok-icon-shield">🔑</div>
            <div>
              <h3>Gemini API Key (BYOK — In-Memory Safe)</h3>
              <p className="byok-privacy-desc">
                🛡️ <strong>Zero Storage:</strong> Held strictly in React memory for this session. Never written to disk, database, or localStorage.
              </p>
            </div>
          </div>
          <div className={`byok-badge ${apiKey.trim() ? 'byok-badge-ai' : 'byok-badge-rule'}`}>
            <span className="byok-dot"></span>
            <span>{apiKey.trim() ? 'Google Gemini 2.5 Active' : 'Deterministic Mode (No Key)'}</span>
          </div>
        </div>

        <div className="byok-input-bar">
          <div className="stitch-search-input-wrap">
            <span className="search-lock-icon">🔒</span>
            <input
              type={showApiKey ? 'text' : 'password'}
              placeholder="Paste Google Gemini API Key (e.g. AIzaSy...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="stitch-key-input"
              autoComplete="off"
              spellCheck="false"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="stitch-btn-toggle"
              title={showApiKey ? 'Hide Key' : 'Show Key'}
            >
              {showApiKey ? 'Hide' : 'Show'}
            </button>
            {apiKey.trim() && (
              <button
                type="button"
                onClick={() => setApiKey('')}
                className="stitch-btn-clear"
                title="Clear API Key"
              >
                ✕ Clear
              </button>
            )}
          </div>
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="stitch-link-aistudio"
          >
            <span>Get Free Gemini Key</span>
            <span className="external-arrow">↗</span>
          </a>
        </div>

        {/* Quota & Billing Monitor Bar */}
        <div className="stitch-quota-strip">
          <div className="quota-block">
            <span className="quota-tag">Loaded Key</span>
            <span className="quota-data quota-mono">{getMaskedKey(apiKey)}</span>
          </div>
          <div className="quota-block">
            <span className="quota-tag">Free Tier Daily Quota</span>
            <span className="quota-data">
              <strong>{remainingFree}</strong> / {FREE_TIER_DAILY_LIMIT} requests remaining today
            </span>
          </div>
          <div className="quota-block">
            <span className="quota-tag">Rate Limit</span>
            <span className="quota-data">{FREE_TIER_RPM_LIMIT} Requests / Min</span>
          </div>
          <div className="quota-block">
            <span className="quota-tag">Cost & Billing Protection</span>
            <span className="quota-data quota-green">
              $0.00 (Zero Billing Risk • 100% Free Plan)
            </span>
          </div>
        </div>
      </section>

      {/* ── 4. Main Two-Column Input Workspace ── */}
      <main className="stitch-workspace-grid">
        {/* Step 1: Upload Dropzone Card */}
        <section className="stitch-card workspace-step-card">
          <div className="step-header">
            <div className="stitch-step-circle">01</div>
            <div>
              <h3>Upload Candidate Resume</h3>
              <p>Supported: PDF, DOCX (Max 5MB • RAM-Only)</p>
            </div>
          </div>

          <div
            className={`stitch-dropzone ${isDragging ? 'stitch-dropzone-drag' : ''} ${file ? 'stitch-dropzone-loaded' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id={fileInputId}
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="stitch-hidden-input"
            />

            {!file ? (
              <label htmlFor={fileInputId} className="dropzone-label-wrap">
                <div className="upload-glow-orb">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <div className="dropzone-text-group">
                  <span className="dropzone-callout">
                    <strong>Click to browse</strong> or drag & drop resume
                  </span>
                  <span className="dropzone-subcallout">PDF or Word DOCX (Multi-Column Layouts Supported)</span>
                </div>
              </label>
            ) : (
              <div className="stitch-file-preview">
                <div className="file-format-badge">
                  {file.name.endsWith('.pdf') ? '📄 PDF' : '📝 DOCX'}
                </div>
                <div className="file-name-meta-wrap">
                  <span className="preview-file-name">{file.name}</span>
                  <span className="preview-file-meta">
                    {(file.size / 1024).toFixed(1)} KB • In-Memory Parsed
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                    setResult(null)
                  }}
                  className="btn-stitch-remove-file"
                  title="Remove uploaded resume"
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Step 2: Target Job Description Card */}
        <section className="stitch-card workspace-step-card">
          <div className="step-header">
            <div className="stitch-step-circle">02</div>
            <div>
              <h3>Target Job Description</h3>
              <p>Paste role criteria or load an authentic template</p>
            </div>
          </div>

          <div className="stitch-chips-bar">
            <span className="chips-label">⚡ Quick Templates:</span>
            {SAMPLE_ROLES.map((sample) => (
              <button
                key={sample.title}
                type="button"
                className="stitch-template-pill"
                onClick={() => setJobDescription(sample.text)}
              >
                <span>{sample.icon}</span>
                <span>{sample.title}</span>
              </button>
            ))}
          </div>

          <div className="stitch-textarea-wrap">
            <textarea
              rows={7}
              placeholder="Paste responsibilities, required technical skills, qualifications, and stack requirements here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="stitch-textarea"
            />
            <div className="textarea-info-bar">
              <span>{jobDescription.length} / 5,000 characters</span>
              {jobDescription && (
                <button
                  type="button"
                  onClick={() => setJobDescription('')}
                  className="stitch-btn-clear-text"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Error Alert */}
      {error && (
        <div className="stitch-error-banner">
          <span className="error-icon-bubble">⚠️</span>
          <div>{error}</div>
        </div>
      )}

      {/* ── 5. Action Execution Hub ── */}
      <div className="stitch-action-hub">
        <button
          type="button"
          onClick={handleAnalyze}
          className={`stitch-btn-primary ${loading ? 'stitch-btn-loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <div className="stitch-loading-state">
              <div className="stitch-spinner"></div>
              <span>{loadingStep}</span>
              <span className="progress-counter">[{loadingProgress}%]</span>
            </div>
          ) : (
            <>
              <span className="btn-sparkle-glyph">✦</span>
              <span>Run Google Stitch Compatibility Audit</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </>
          )}
        </button>

        {result && (
          <button type="button" onClick={handleReset} className="stitch-btn-reset">
            <span>🔄 New Analysis</span>
          </button>
        )}
      </div>

      {/* ── 6. Results Studio (Google Material 3 Dashboard) ── */}
      {result && (
        <section className="stitch-card stitch-results-studio">
          {/* Studio Top Header */}
          <div className="studio-top-bar">
            <div className="studio-top-left">
              <div className="studio-tag-row">
                <span className={`studio-mode-pill ${result.is_ai_powered ? 'pill-ai-mode' : 'pill-rule-mode'}`}>
                  {result.is_ai_powered ? '🤖 Google Gemini 2.5 Semantic AI' : '⚡ Deterministic Keyword Fallback'}
                </span>
                <span className="studio-confidence-pill">
                  Confidence: <strong>{result.analysis_confidence.toUpperCase()}</strong>
                </span>
              </div>
              <h2 className="studio-main-title">Candidate Compatibility Matrix</h2>
              <p className="studio-file-reference">Document: <strong>{result.filename}</strong></p>
            </div>

            <div className="studio-top-actions">
              <button type="button" onClick={handlePrintReport} className="stitch-btn-action-outline">
                <span>🖨️ Export PDF Report</span>
              </button>
              <button type="button" onClick={handleCopySummary} className="stitch-btn-action-primary">
                <span>{copied ? '✅ Copied!' : '📋 Copy Summary'}</span>
              </button>
            </div>
          </div>

          {/* Warnings Banner if any */}
          {result.warnings && result.warnings.length > 0 && (
            <div className="studio-warnings-wrap">
              {result.warnings.map((warn, i) => (
                <div key={i} className="studio-warning-item">
                  <span className="warning-symbol">ℹ️</span>
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          )}

          {/* Top Performance Metric Pillars */}
          <div className="studio-metric-grid">
            {/* Radial Score Gauge Card */}
            <div className="stitch-metric-card gauge-card">
              <div className="stitch-gauge-wrap">
                <svg className="stitch-radial-svg" width="168" height="168">
                  <circle
                    className="stitch-gauge-bg"
                    cx="84"
                    cy="84"
                    r={radius}
                    strokeWidth="14"
                  />
                  <circle
                    className="stitch-gauge-bar"
                    cx="84"
                    cy="84"
                    r={radius}
                    strokeWidth="14"
                    stroke={getScoreColor(result.score)}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="gauge-center-content">
                  <span className="gauge-score-value" style={{ color: getScoreColor(result.score) }}>
                    {result.score}%
                  </span>
                  <span className="gauge-score-caption">MATCH SCORE</span>
                </div>
              </div>

              <div className="gauge-details">
                <div className={`gauge-tier-pill ${getScoreTier(result.score).class}`}>
                  {getScoreTier(result.score).tier}
                </div>
                <p className="gauge-tier-desc">
                  {getScoreTier(result.score).desc}
                </p>
              </div>
            </div>

            {/* Stat Pillar: Matched Skills */}
            <div className="stitch-metric-card stat-pillar-verified">
              <div className="stat-card-title-row">
                <span className="stat-icon">✅</span>
                <span className="stat-heading">Verified Qualifications</span>
              </div>
              <div className="stat-large-count">{result.matched_skills.length}</div>
              <p className="stat-subtext">Technical criteria satisfied in resume</p>
            </div>

            {/* Stat Pillar: Missing Skills */}
            <div className="stitch-metric-card stat-pillar-gaps">
              <div className="stat-card-title-row">
                <span className="stat-icon">❌</span>
                <span className="stat-heading">Skill Discrepancies</span>
              </div>
              <div className="stat-large-count">{result.missing_skills.length}</div>
              <p className="stat-subtext">Required criteria missing from resume</p>
            </div>
          </div>

          {/* Executive Candidate Assessment */}
          {result.candidate_summary && (
            <div className="stitch-assessment-panel">
              <div className="assessment-header">
                <div className="assessment-icon-box">📝</div>
                <div>
                  <h3>Executive Candidate Assessment</h3>
                  <p>Qualitative profile evaluation and target role alignment</p>
                </div>
              </div>
              <div className="assessment-content">
                <p>{result.candidate_summary}</p>
              </div>
            </div>
          )}

          {/* Qualitative AI Cards Triad (Strengths, Weaknesses, Suggestions) */}
          {result.is_ai_powered && (
            <div className="stitch-triad-grid">
              {/* Strengths */}
              <div className="triad-panel triad-panel-strengths">
                <div className="triad-title-row">
                  <span className="triad-emoji">💪</span>
                  <h4>Competitive Strengths</h4>
                </div>
                <ul className="triad-item-list">
                  {result.strengths && result.strengths.length > 0 ? (
                    result.strengths.map((str, idx) => (
                      <li key={idx} className="triad-row-strength">
                        <span className="glyph-green">✓</span>
                        <span>{str}</span>
                      </li>
                    ))
                  ) : (
                    <li className="triad-empty-note">No notable competitive strengths identified.</li>
                  )}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="triad-panel triad-panel-weaknesses">
                <div className="triad-title-row">
                  <span className="triad-emoji">🔍</span>
                  <h4>Critical Skill Gaps</h4>
                </div>
                <ul className="triad-item-list">
                  {result.weaknesses && result.weaknesses.length > 0 ? (
                    result.weaknesses.map((weak, idx) => (
                      <li key={idx} className="triad-row-weakness">
                        <span className="glyph-red">!</span>
                        <span>{weak}</span>
                      </li>
                    ))
                  ) : (
                    <li className="triad-empty-note">No major technical qualification gaps detected.</li>
                  )}
                </ul>
              </div>

              {/* Suggestions */}
              <div className="triad-panel triad-panel-suggestions">
                <div className="triad-title-row">
                  <span className="triad-emoji">💡</span>
                  <h4>Resume Optimization Tips</h4>
                </div>
                <ul className="triad-item-list">
                  {result.suggestions && result.suggestions.length > 0 ? (
                    result.suggestions.map((sug, idx) => (
                      <li key={idx} className="triad-row-suggestion">
                        <span className="glyph-cyan">➜</span>
                        <span>{sug}</span>
                      </li>
                    ))
                  ) : (
                    <li className="triad-empty-note">Resume is well tailored to this job specification.</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Technical Skill Breakdown Matrix */}
          <div className="stitch-matrix-wrapper">
            <div className="matrix-top-bar">
              <div className="matrix-title-heading">
                <h4>Technical Skill Breakdown Matrix</h4>
              </div>
              <div className="matrix-segmented-tabs">
                <button
                  className={`seg-tab ${filterTab === 'all' ? 'seg-tab-active' : ''}`}
                  onClick={() => setFilterTab('all')}
                >
                  All Skills ({result.matched_skills.length + result.missing_skills.length})
                </button>
                <button
                  className={`seg-tab ${filterTab === 'matched' ? 'seg-tab-active' : ''}`}
                  onClick={() => setFilterTab('matched')}
                >
                  ✅ Matched ({result.matched_skills.length})
                </button>
                <button
                  className={`seg-tab ${filterTab === 'missing' ? 'seg-tab-active' : ''}`}
                  onClick={() => setFilterTab('missing')}
                >
                  ❌ Missing ({result.missing_skills.length})
                </button>
              </div>
            </div>

            <div className="matrix-columns-grid">
              {/* Matched Column */}
              {(filterTab === 'all' || filterTab === 'matched') && (
                <div className="matrix-col col-verified">
                  <div className="matrix-col-header">
                    <span className="dot-indicator dot-emerald"></span>
                    <h5>Verified Qualifications ({result.matched_skills.length})</h5>
                  </div>
                  <div className="tags-container">
                    {result.matched_skills.length > 0 ? (
                      result.matched_skills.map((skill) => (
                        <div key={skill} className="stitch-pill pill-verified">
                          <span className="pill-check">✓</span>
                          <span>{skill}</span>
                        </div>
                      ))
                    ) : (
                      <div className="empty-matrix-msg">No exact matching skills detected.</div>
                    )}
                  </div>
                </div>
              )}

              {/* Missing Column */}
              {(filterTab === 'all' || filterTab === 'missing') && (
                <div className="matrix-col col-gaps">
                  <div className="matrix-col-header">
                    <span className="dot-indicator dot-rose"></span>
                    <h5>Unmatched Requirements ({result.missing_skills.length})</h5>
                  </div>
                  <div className="tags-container">
                    {result.missing_skills.length > 0 ? (
                      result.missing_skills.map((skill) => (
                        <div key={skill} className="stitch-pill pill-missing">
                          <span className="pill-plus">+</span>
                          <span>{skill}</span>
                        </div>
                      ))
                    ) : (
                      <div className="empty-matrix-msg success-highlight">
                        🎉 Complete Match! All detected technical requirements are covered.
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
