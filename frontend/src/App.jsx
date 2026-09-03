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

function App() {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
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

    const stepTimer1 = setTimeout(() => {
      setLoadingStep('🔍 Scanning 50+ technical skills...')
    }, 400)

    const stepTimer2 = setTimeout(() => {
      setLoadingStep('🎯 Computing set-intersection match score...')
    }, 800)

    const formData = new FormData()
    formData.append('resume', file)
    formData.append('job_description', jobDescription)

    try {
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()

      if (!response.ok) {
        setError(data.detail || 'Failed to process resume analysis.')
        return
      }

      setResult(data)
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
Match Score: ${result.score}%
Matched Skills (${result.matched_skills.length}): ${result.matched_skills.join(', ')}
Missing Skills (${result.missing_skills.length}): ${result.missing_skills.join(', ')}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setFile(null)
    setJobDescription('')
    setResult(null)
    setError('')
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
    if (score >= 80) return { label: '🔥 Outstanding Match', class: 'badge-emerald' }
    if (score >= 65) return { label: '✅ Strong Potential', class: 'badge-emerald' }
    if (score >= 45) return { label: '⚠️ Moderate Match', class: 'badge-amber' }
    return { label: '❌ Skill Gap Detected', class: 'badge-rose' }
  }

  return (
    <div className="app-wrapper">
      {/* Top Brand Header */}
      <header className="brand-header">
        <div className="brand-badge">
          <span className="badge-pulse"></span>
          <span>FastAPI + React 19 Powered</span>
        </div>
        <h1 className="brand-title">
          AI-Powered <span className="gradient-text">Resume Analyzer</span>
        </h1>
        <p className="brand-subtitle">
          Instantly evaluate your resume against real job descriptions. Identify technical skill matches, discover missing requirements, and beat the ATS.
        </p>
      </header>

      {/* Main Input Grid */}
      <main className="input-grid">
        {/* Step 1: Upload Resume Card */}
        <section className="glass-card upload-section">
          <div className="card-header-bar">
            <div className="step-num">01</div>
            <div>
              <h2>Upload Resume</h2>
              <p>Supported: PDF, DOCX (In-Memory Safe)</p>
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
                <span className="dropzone-hint">PDF or Word DOCX (Max 10MB)</span>
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
                  <span className="file-meta">{(file.size / 1024).toFixed(1)} KB • Ready for extraction</span>
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
          <div className="results-header-bar">
            <div>
              <span className="results-pill">⚡ Analysis Complete</span>
              <h2>Match Performance Breakdown</h2>
              <p className="results-subtitle">Evaluated document: <strong>{result.filename}</strong></p>
            </div>
            <button type="button" onClick={handleCopySummary} className="btn-copy">
              {copied ? '✅ Copied to Clipboard!' : '📋 Copy Summary'}
            </button>
          </div>

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
                  Your resume satisfies <strong>{result.matched_skills.length}</strong> out of <strong>{result.total_jd_skills}</strong> detected key technical requirements.
                </p>
              </div>
            </div>

            {/* Stat Counter Cards */}
            <div className="stat-card stat-matched">
              <div className="stat-icon-bubble">✅</div>
              <div className="stat-content">
                <span className="stat-big-num">{result.matched_skills.length}</span>
                <span className="stat-label">Matched Skills</span>
                <span className="stat-sub">Found in your resume</span>
              </div>
            </div>

            <div className="stat-card stat-missing">
              <div className="stat-icon-bubble">❌</div>
              <div className="stat-content">
                <span className="stat-big-num">{result.missing_skills.length}</span>
                <span className="stat-label">Missing Skills</span>
                <span className="stat-sub">Required by job role</span>
              </div>
            </div>
          </div>

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
