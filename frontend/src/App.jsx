import { useState } from 'react'
import './App.css'

const SAMPLE_JDS = [
  {
    title: 'Python Backend Engineer',
    text: 'Looking for a Senior Python Developer with strong expertise in FastAPI, Django, Docker, PostgreSQL, Redis, and AWS. Experience building REST APIs, CI/CD pipelines, and microservices is required. Knowledge of Kubernetes and Git is a plus.'
  },
  {
    title: 'Full-Stack Developer (React + Node)',
    text: 'Hiring a Full-Stack Engineer skilled in React, TypeScript, Node.js, Express, MongoDB, and Tailwind CSS. Must have hands-on experience with GraphQL, Git, Postman, and deploying web applications on GCP or AWS.'
  },
  {
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
  const [loadingStep, setLoadingStep] = useState('Analyzing...')
  const [error, setError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [copied, setCopied] = useState(false)
  const [filterTab, setFilterTab] = useState('all') // 'all', 'matched', 'missing'

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
      setError('Invalid file format. Please upload a .pdf or .docx resume.')
      return
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File exceeds the 5MB size limit. Please upload a smaller document.')
      return
    }

    setFile(selectedFile)
    setResult(null)
    setError('')
  }

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload your resume file (PDF or DOCX).')
      return
    }
    if (!jobDescription.trim()) {
      setError('Please provide a target job description.')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)
    setLoadingStep('📄 Reading document stream into RAM...')

    const isUsingAI = Boolean(apiKey.trim())

    const stepTimer1 = setTimeout(() => {
      setLoadingStep(isUsingAI ? '🤖 Running Gemini 2.5 Semantic AI Analysis...' : '🔍 Running 50+ skill keyword matching...')
    }, 400)

    const stepTimer2 = setTimeout(() => {
      setLoadingStep('🎯 Generating comprehensive evaluation report...')
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
        setError(data.detail || 'Failed to process resume analysis.')
        return
      }

      setResult(data)
      if (data.is_ai_powered) {
        setSessionAiRequests(prev => prev + 1)
      }
    } catch {
      setError('Could not connect to FastAPI backend on http://127.0.0.1:8000. Please ensure uvicorn is running.')
    } finally {
      clearTimeout(stepTimer1)
      clearTimeout(stepTimer2)
      setLoading(false)
    }
  }

  const handleCopySummary = () => {
    if (!result) return
    const text = `Resume Match Analysis for ${result.filename}
Overall Match Score: ${result.score}%
Mode: ${result.is_ai_powered ? 'Google Gemini AI' : 'Deterministic Rule-Based'}
Confidence: ${result.analysis_confidence}
Candidate Summary: ${result.candidate_summary}
Matched Skills (${result.matched_skills.length}): ${result.matched_skills.join(', ')}
Missing Skills (${result.missing_skills.length}): ${result.missing_skills.join(', ')}`
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

  // Format masked key for preview
  const getMaskedKey = (key) => {
    const trimmed = key.trim()
    if (!trimmed) return 'None'
    if (trimmed.length <= 10) return `${trimmed.slice(0, 3)}•••••`
    return `${trimmed.slice(0, 6)}••••••••${trimmed.slice(-4)}`
  }

  // Calculate score circle stroke
  const radius = 56
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = result ? circumference - (result.score / 100) * circumference : circumference

  const getScoreColor = (score) => {
    if (score >= 75) return '#10b981' // emerald
    if (score >= 50) return '#f59e0b' // amber
    return '#f43f5e' // rose
  }

  const getScoreBadge = (score) => {
    if (score >= 85) return { label: '🔥 Exceptional Match', class: 'badge-emerald' }
    if (score >= 70) return { label: '✅ Strong Qualification', class: 'badge-emerald' }
    if (score >= 50) return { label: '⚠️ Partial Alignment', class: 'badge-amber' }
    return { label: '❌ Critical Skill Gap', class: 'badge-rose' }
  }

  const getConfidenceBadge = (confidence) => {
    switch (confidence) {
      case 'high':
        return { label: 'High AI Confidence', class: 'conf-high' }
      case 'medium':
        return { label: 'Medium AI Confidence', class: 'conf-med' }
      case 'low':
        return { label: 'Low AI Confidence', class: 'conf-low' }
      default:
        return { label: 'Deterministic Engine', class: 'conf-rule' }
    }
  }

  const remainingFreeRequests = Math.max(0, FREE_TIER_DAILY_LIMIT - sessionAiRequests)

  return (
    <div className="app-wrapper">
      {/* Top Brand Header */}
      <header className="brand-header">
        <div className="brand-badge">
          <span className="badge-pulse"></span>
          <span>FastAPI + Google Gemini 2.5 Hybrid</span>
        </div>
        <h1 className="brand-title">
          AI-Powered <span className="gradient-text">Resume Analyzer</span>
        </h1>
        <p className="brand-subtitle">
          Next-generation resume evaluation. Perform deep semantic analysis with Google Gemini or instant deterministic ATS matching in full privacy.
        </p>
      </header>

      {/* BYOK Security & API Key Section with Quota Tracker */}
      <section className="glass-card api-key-card">
        <div className="api-key-header">
          <div className="api-key-title">
            <span className="key-icon">🔑</span>
            <div>
              <h3>Gemini API Key (BYOK — Optional)</h3>
              <p className="privacy-note">
                🔒 <strong>100% In-Memory:</strong> Your key is held only in React RAM and never stored in localStorage, cookies, or databases.
              </p>
            </div>
          </div>
          <div className="mode-indicator-pill">
            <span className={`status-dot ${apiKey.trim() ? 'dot-active' : 'dot-fallback'}`}></span>
            <span>{apiKey.trim() ? 'Gemini 2.5 AI Ready' : 'Deterministic Mode (No Key)'}</span>
          </div>
        </div>

        <div className="api-key-input-wrap">
          <div className="input-group">
            <input
              type={showApiKey ? 'text' : 'password'}
              placeholder="Paste Google Gemini API Key (e.g. AIzaSy...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="modern-key-input"
              autoComplete="off"
              spellCheck="false"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="btn-toggle-key"
              title={showApiKey ? 'Hide API Key' : 'Show API Key'}
            >
              {showApiKey ? '👁️ Hide' : '👁️ Show'}
            </button>
            {apiKey.trim() && (
              <button
                type="button"
                onClick={() => setApiKey('')}
                className="btn-clear-key"
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
            className="get-key-link"
          >
            Get Free Gemini Key ↗
          </a>
        </div>

        {/* Live Quota & Billing Monitor Bar */}
        <div className="quota-monitor-bar">
          <div className="quota-col">
            <span className="quota-label">Current Active Key</span>
            <span className="quota-val key-val">
              {apiKey.trim() ? getMaskedKey(apiKey) : 'None (Using Rule-Based Fallback)'}
            </span>
          </div>

          <div className="quota-col">
            <span className="quota-label">Free Tier Daily Quota</span>
            <span className="quota-val">
              <strong>{remainingFreeRequests}</strong> / {FREE_TIER_DAILY_LIMIT} requests left today
            </span>
          </div>

          <div className="quota-col">
            <span className="quota-label">Rate Limits</span>
            <span className="quota-val">{FREE_TIER_RPM_LIMIT} Requests / Min</span>
          </div>

          <div className="quota-col">
            <span className="quota-label">Billing & Cost Risk</span>
            <span className="quota-val badge-zero-cost">
              $0.00 (100% Free Tier • No Auto-Charge)
            </span>
          </div>
        </div>
      </section>

      {/* Main Input Grid */}
      <main className="input-grid">
        {/* Step 1: Upload Resume Card */}
        <section className="glass-card upload-section">
          <div className="card-header-bar">
            <div className="step-num">01</div>
            <div>
              <h2>Upload Resume</h2>
              <p>Supported: PDF, DOCX (Max 5MB • RAM-Only)</p>
            </div>
          </div>

          <div
            className={`dropzone ${isDragging ? 'dropzone-active' : ''} ${file ? 'dropzone-filled' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="resume-upload"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="hidden-file-input"
            />

            {!file ? (
              <label htmlFor="resume-upload" className="dropzone-label">
                <div className="upload-icon-bubble">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <span className="dropzone-primary-text">
                  <strong>Click to browse</strong> or drag & drop resume
                </span>
                <span className="dropzone-hint">PDF or Word DOCX (Multi-Column Supported)</span>
              </label>
            ) : (
              <div className="file-preview-card">
                <div className="file-icon-box">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <div className="file-details">
                  <span className="file-name">{file.name}</span>
                  <span className="file-meta">{(file.size / 1024).toFixed(1)} KB • Ready for memory parse</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setFile(null)
                    setResult(null)
                  }}
                  className="btn-icon-remove"
                  title="Remove file"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Step 2: Job Description Card */}
        <section className="glass-card jd-section">
          <div className="card-header-bar">
            <div className="step-num">02</div>
            <div>
              <h2>Job Description</h2>
              <p>Paste requirements or choose a sample role</p>
            </div>
          </div>

          {/* Quick Auto-Fill Chips */}
          <div className="sample-chips-bar">
            <span className="chip-label">⚡ Quick Fill:</span>
            {SAMPLE_JDS.map((sample) => (
              <button
                key={sample.title}
                type="button"
                className="sample-chip"
                onClick={() => setJobDescription(sample.text)}
              >
                {sample.title}
              </button>
            ))}
          </div>

          <textarea
            rows={7}
            placeholder="Paste target job responsibilities, skills, and qualifications here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="modern-textarea"
          />
        </section>
      </main>

      {/* Error Alert Box */}
      {error && (
        <div className="error-banner">
          <div className="error-icon">⚠️</div>
          <div>{error}</div>
        </div>
      )}

      {/* Action CTA Bar */}
      <div className="cta-bar">
        <button
          type="button"
          onClick={handleAnalyze}
          className={`btn-primary-action ${loading ? 'btn-loading' : ''}`}
          disabled={loading}
        >
          {loading ? (
            <div className="spinner-wrap">
              <div className="neon-spinner"></div>
              <span>{loadingStep}</span>
            </div>
          ) : (
            <>
              <span>⚡ Analyze Resume Compatibility</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </>
          )}
        </button>

        {result && (
          <button type="button" onClick={handleReset} className="btn-secondary-reset">
            🔄 Reset
          </button>
        )}
      </div>

      {/* Step 3: Analysis Results View */}
      {result && (
        <section className="glass-card results-dashboard">
          {/* Top Status and Header */}
          <div className="results-header-bar">
            <div className="results-header-left">
              <div className="header-badges-row">
                <span className={`engine-badge ${result.is_ai_powered ? 'badge-ai' : 'badge-fallback'}`}>
                  {result.is_ai_powered ? '🤖 Google Gemini 2.5 AI' : '⚡ Deterministic Fallback'}
                </span>
                <span className={`conf-badge ${getConfidenceBadge(result.analysis_confidence).class}`}>
                  {getConfidenceBadge(result.analysis_confidence).label}
                </span>
              </div>
              <h2>Match Performance Breakdown</h2>
              <p className="results-subtitle">Evaluated document: <strong>{result.filename}</strong></p>
            </div>
            <div className="results-header-actions">
              <button type="button" onClick={handlePrintReport} className="btn-print">
                🖨️ Print / Save PDF
              </button>
              <button type="button" onClick={handleCopySummary} className="btn-copy">
                {copied ? '✅ Copied!' : '📋 Copy Summary'}
              </button>
            </div>
          </div>

          {/* Warnings Banner if any */}
          {result.warnings && result.warnings.length > 0 && (
            <div className="warnings-container">
              {result.warnings.map((warn, idx) => (
                <div key={idx} className="warning-item">
                  <span className="warn-icon">ℹ️</span>
                  <span>{warn}</span>
                </div>
              ))}
            </div>
          )}

          {/* Metrics Top Row */}
          <div className="metrics-row">
            {/* Radial Score Gauge Card */}
            <div className="metric-box gauge-box">
              <div className="gauge-svg-wrap">
                <svg className="radial-gauge" width="140" height="140">
                  <circle
                    className="gauge-bg"
                    cx="70"
                    cy="70"
                    r={radius}
                    strokeWidth="12"
                  />
                  <circle
                    className="gauge-progress"
                    cx="70"
                    cy="70"
                    r={radius}
                    strokeWidth="12"
                    stroke={getScoreColor(result.score)}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="gauge-text-overlay">
                  <span className="gauge-number" style={{ color: getScoreColor(result.score) }}>
                    {result.score}%
                  </span>
                  <span className="gauge-caption">MATCH</span>
                </div>
              </div>

              <div className="gauge-info">
                <span className={`status-badge ${getScoreBadge(result.score).class}`}>
                  {getScoreBadge(result.score).label}
                </span>
                <p className="gauge-explanation">
                  Candidate meets <strong>{result.matched_skills.length}</strong> verified qualifications with <strong>{result.missing_skills.length}</strong> identified skill gaps.
                </p>
              </div>
            </div>

            {/* Stat Counter Cards */}
            <div className="stat-card stat-matched">
              <div className="stat-icon-bubble">✅</div>
              <div className="stat-content">
                <span className="stat-big-num">{result.matched_skills.length}</span>
                <span className="stat-label">Matched Skills</span>
                <span className="stat-sub">Verified in resume</span>
              </div>
            </div>

            <div className="stat-card stat-missing">
              <div className="stat-icon-bubble">❌</div>
              <div className="stat-content">
                <span className="stat-big-num">{result.missing_skills.length}</span>
                <span className="stat-label">Missing Skills</span>
                <span className="stat-sub">Required by job</span>
              </div>
            </div>
          </div>

          {/* Executive Candidate Summary Card */}
          {result.candidate_summary && (
            <div className="insight-card summary-card">
              <div className="insight-header">
                <span className="insight-icon">📝</span>
                <h3>Executive Candidate Assessment</h3>
              </div>
              <p className="summary-text">{result.candidate_summary}</p>
            </div>
          )}

          {/* Qualitative AI Cards Grid (Strengths, Weaknesses, Suggestions) */}
          {result.is_ai_powered && (
            <div className="ai-insights-grid">
              {/* Strengths */}
              <div className="insight-card strengths-card">
                <div className="insight-header">
                  <span className="insight-icon">💪</span>
                  <h3>Competitive Strengths</h3>
                </div>
                <ul className="insight-list">
                  {result.strengths && result.strengths.length > 0 ? (
                    result.strengths.map((str, idx) => (
                      <li key={idx} className="strength-item">
                        <span className="bullet-icon">✓</span>
                        <span>{str}</span>
                      </li>
                    ))
                  ) : (
                    <li className="empty-subtext">No distinct competitive strengths highlighted.</li>
                  )}
                </ul>
              </div>

              {/* Weaknesses / Gaps */}
              <div className="insight-card weaknesses-card">
                <div className="insight-header">
                  <span className="insight-icon">🔍</span>
                  <h3>Areas for Alignment</h3>
                </div>
                <ul className="insight-list">
                  {result.weaknesses && result.weaknesses.length > 0 ? (
                    result.weaknesses.map((weak, idx) => (
                      <li key={idx} className="weakness-item">
                        <span className="bullet-icon">!</span>
                        <span>{weak}</span>
                      </li>
                    ))
                  ) : (
                    <li className="empty-subtext">No severe domain mismatches identified.</li>
                  )}
                </ul>
              </div>

              {/* Actionable Suggestions */}
              <div className="insight-card suggestions-card">
                <div className="insight-header">
                  <span className="insight-icon">💡</span>
                  <h3>Resume Optimization Recommendations</h3>
                </div>
                <ul className="insight-list">
                  {result.suggestions && result.suggestions.length > 0 ? (
                    result.suggestions.map((sug, idx) => (
                      <li key={idx} className="suggestion-item">
                        <span className="bullet-icon">➜</span>
                        <span>{sug}</span>
                      </li>
                    ))
                  ) : (
                    <li className="empty-subtext">Resume is well tailored to this job specification.</li>
                  )}
                </ul>
              </div>
            </div>
          )}

          {/* Skill Tag Filters */}
          <div className="skills-filter-nav">
            <button
              className={`filter-btn ${filterTab === 'all' ? 'active' : ''}`}
              onClick={() => setFilterTab('all')}
            >
              All Skills ({result.matched_skills.length + result.missing_skills.length})
            </button>
            <button
              className={`filter-btn ${filterTab === 'matched' ? 'active' : ''}`}
              onClick={() => setFilterTab('matched')}
            >
              ✅ Matched ({result.matched_skills.length})
            </button>
            <button
              className={`filter-btn ${filterTab === 'missing' ? 'active' : ''}`}
              onClick={() => setFilterTab('missing')}
            >
              ❌ Missing Gap ({result.missing_skills.length})
            </button>
          </div>

          {/* Skills Grid */}
          <div className="skills-sections-grid">
            {/* Matched Skills Column */}
            {(filterTab === 'all' || filterTab === 'matched') && (
              <div className="skill-bucket bucket-matched">
                <div className="bucket-title">
                  <div className="bucket-dot dot-emerald"></div>
                  <h3>Verified Matched Skills ({result.matched_skills.length})</h3>
                </div>
                <div className="tags-flex">
                  {result.matched_skills.length > 0 ? (
                    result.matched_skills.map((skill) => (
                      <div key={skill} className="modern-tag tag-verified">
                        <span className="tag-check">✓</span>
                        <span>{skill}</span>
                      </div>
                    ))
                  ) : (
                    <div className="empty-skill-msg">No exact matching technical skills detected yet.</div>
                  )}
                </div>
              </div>
            )}

            {/* Missing Skills Column */}
            {(filterTab === 'all' || filterTab === 'missing') && (
              <div className="skill-bucket bucket-missing">
                <div className="bucket-title">
                  <div className="bucket-dot dot-rose"></div>
                  <h3>Skill Gap Recommendations ({result.missing_skills.length})</h3>
                </div>
                <div className="tags-flex">
                  {result.missing_skills.length > 0 ? (
                    result.missing_skills.map((skill) => (
                      <div key={skill} className="modern-tag tag-gap">
                        <span className="tag-cross">+</span>
                        <span>{skill}</span>
                      </div>
                    ))
                  ) : (
                    <div className="empty-skill-msg success-msg">
                      🎉 Outstanding! Your resume covers all required skills for this job description.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

export default App
