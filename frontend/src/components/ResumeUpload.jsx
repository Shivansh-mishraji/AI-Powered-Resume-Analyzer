import { useState, useId } from 'react';

export default function ResumeUpload({ file, onFileSelect, onFileRemove, disabled = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputId = useId();

  const handleDragOver = (e) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 KB';
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  return (
    <div className="form-field-card upload-field-card">
      <div className="field-header">
        <label htmlFor={inputId} className="field-label">
          <span className="field-step-pill" aria-hidden="true">01</span>
          <div>
            <span className="field-title">Upload Resume</span>
            <span className="field-subtitle">PDF / DOCX • Maximum 5 MB</span>
          </div>
        </label>
      </div>

      <div
        className={`dropzone-container ${isDragging ? 'dropzone-active' : ''} ${file ? 'dropzone-has-file' : ''} ${disabled ? 'dropzone-disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id={inputId}
          accept=".pdf,.docx"
          onChange={handleInputChange}
          className="sr-only-file-input"
          disabled={disabled}
          aria-describedby="upload-help-text"
        />

        {!file ? (
          <label htmlFor={inputId} className="dropzone-unselected-content">
            <div className="dropzone-icon-circle" aria-hidden="true">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div className="dropzone-text-block">
              <span className="dropzone-primary-text">
                <strong>Click to browse</strong> or drag & drop resume
              </span>
              <span id="upload-help-text" className="dropzone-secondary-text">
                Supports authentic text-based PDF or Word DOCX documents
              </span>
            </div>
          </label>
        ) : (
          <div className="dropzone-selected-content" role="status" aria-live="polite">
            <div className="file-icon-badge" aria-hidden="true">
              {file.name.toLowerCase().endsWith('.pdf') ? '📄 PDF' : '📝 DOCX'}
            </div>
            <div className="file-details">
              <span className="file-name">✓ {file.name}</span>
              <span className="file-meta">
                {formatFileSize(file.size)} • Ready for analysis
              </span>
            </div>
            <div className="file-actions">
              <label htmlFor={inputId} className="btn-replace-file" title="Select a different file">
                Replace
              </label>
              <button
                type="button"
                onClick={onFileRemove}
                className="btn-remove-file"
                aria-label="Remove uploaded resume"
                disabled={disabled}
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
