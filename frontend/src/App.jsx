import { useState } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      setResult(null)
      setError('')
    }
  }

  const handleAnalyze = async () => {
    if (!file) { setError('Please upload a resume (PDF or DOCX).'); return }
    if (!jobDescription.trim()) { setError('Please paste a job description.'); return }

    setLoading(true)
    setError('')
    setResult(null)

    const formData = new FormData()
    formData.append('resume', file)
    formData.append('job_description', jobDescription)

    try {
      const response = await fetch('http://127.0.0.1:8000/analyze', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      if (!response.ok) { setError(data.detail || 'Something went wrong.'); return }
      setResult(data)
    } catch {
      setError('Could not connect to the backend. Make sure it is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>AI-Powered Resume Analyzer</h1>
        <p className="subtitle">Upload your resume and paste a job description to get instant matching insights.</p>
      </header>

      <main className="main-content">
        <div className="card">
          <h2>1. Upload Resume</h2>
          <p className="card-description">Accepted formats: PDF, DOCX</p>
          <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="file-input" />
          {file && (
            <div className="file-info">
              <span>Selected: <strong>{file.name}</strong></span>
              <button onClick={() => { setFile(null); setResult(null) }} className="btn-remove">Remove</button>
            </div>
          )}
        </div>

        <div className="card">
          <h2>2. Job Description</h2>
          <p className="card-description">Paste the target job description below:</p>
          <textarea rows={8} placeholder="Paste Job Description here..." value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)} className="jd-textarea" />
        </div>

        {error && <div className="error-box">{error}</div>}

        <button onClick={handleAnalyze} className="btn-analyze" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Resume'}
        </button>

        {result && (
          <div className="results-card">
            <h2>Analysis Results — <em>{result.filename}</em></h2>

            <div className="score-box">
              <span className="score-label">Match Score</span>
              <span className="score-value">{result.score}%</span>
            </div>

            <div className="skills-grid">
              <div className="skills-section matched">
                <h3>✅ Matched Skills ({result.matched_skills.length})</h3>
                <div className="skill-tags">
                  {result.matched_skills.length > 0
                    ? result.matched_skills.map(s => <span key={s} className="tag tag-matched">{s}</span>)
                    : <p>No matching skills found.</p>}
                </div>
              </div>

              <div className="skills-section missing">
                <h3>❌ Missing Skills ({result.missing_skills.length})</h3>
                <div className="skill-tags">
                  {result.missing_skills.length > 0
                    ? result.missing_skills.map(s => <span key={s} className="tag tag-missing">{s}</span>)
                    : <p>Your resume covers all required skills!</p>}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
