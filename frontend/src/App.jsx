import { useState } from 'react'
import './App.css'

function App() {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleAnalyze = () => {
    if (!file) {
      alert('Please upload a resume file (PDF or DOCX).')
      return
    }
    if (!jobDescription.trim()) {
      alert('Please paste a job description.')
      return
    }
    alert(`Ready to analyze: ${file.name} against the provided Job Description!`)
  }

  return (
    <div className="container">
      <header className="header">
        <h1>AI-Powered Resume Analyzer</h1>
        <p className="subtitle">
          Upload your resume and paste a job description to get instant matching insights and improvement tips.
        </p>
      </header>

      <main className="main-content">
        {/* Resume Upload Card */}
        <div className="card">
          <h2>1. Upload Resume</h2>
          <p className="card-description">Accepted formats: PDF, DOCX</p>
          <input
            type="file"
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={handleFileChange}
            className="file-input"
          />
          {file && (
            <div className="file-info">
              <span>Selected file: <strong>{file.name}</strong></span>
              <button onClick={() => setFile(null)} className="btn-remove">Remove</button>
            </div>
          )}
        </div>

        {/* Job Description Card */}
        <div className="card">
          <h2>2. Job Description</h2>
          <p className="card-description">Paste the target job description or requirements below:</p>
          <textarea
            rows={8}
            placeholder="Paste Job Description here (e.g. required skills, qualifications, responsibilities)..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="jd-textarea"
          />
        </div>

        {/* Action Button */}
        <button onClick={handleAnalyze} className="btn-analyze">
          Analyze Resume
        </button>
      </main>
    </div>
  )
}

export default App
