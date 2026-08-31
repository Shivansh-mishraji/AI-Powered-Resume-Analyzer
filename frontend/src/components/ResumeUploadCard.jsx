import { useState, useId } from 'react';

export default function ResumeUploadCard({ file, onFileSelect, onFileRemove, disabled = false }) {
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
    return (bytes / 1024).toFixed(0) + ' KB';
  };

  return (
    <div className="glass-panel rounded-xl p-6 relative overflow-hidden group">
      <h2 className="font-headline-md text-body-lg text-on-background mb-4 flex items-center gap-2">
        <span className="material-symbols-outlined text-on-background" aria-hidden="true">description</span>
        <span>Resume Document</span>
      </h2>

      <input
        type="file"
        id={inputId}
        accept=".pdf,.docx"
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {!file ? (
        <label
          htmlFor={inputId}
          className={`border-2 border-dashed border-outline-variant/50 rounded-lg p-8 flex flex-col items-center justify-center text-center bg-surface-container-low/30 hover:bg-surface-container-low/80 hover:border-secondary/50 transition-all duration-300 cursor-pointer group/drop ${
            isDragging ? 'border-secondary bg-surface-container-low/80' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center mb-4 group-hover/drop:scale-110 transition-transform duration-300">
            <span className="material-symbols-outlined text-[24px] text-outline-variant group-hover/drop:text-secondary transition-colors" aria-hidden="true">
              cloud_upload
            </span>
          </div>
          <p className="font-label-md text-label-md text-on-background mb-1">Drag and drop your resume here</p>
          <p className="font-body-md text-label-sm text-on-surface-variant">
            or <span className="text-secondary hover:underline">browse files</span>
          </p>
          <div className="mt-4 flex items-center gap-4 font-label-sm text-[11px] text-outline">
            <span>PDF, DOCX</span>
            <span>Max 5MB</span>
          </div>
        </label>
      ) : (
        <div className="border border-outline-variant/50 rounded-lg p-4 bg-surface-container-low/50 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded bg-match-rose/10 flex items-center justify-center border border-match-rose/20 shrink-0">
              <span className="material-symbols-outlined text-match-rose" aria-hidden="true">
                picture_as_pdf
              </span>
            </div>
            <div className="truncate">
              <p className="font-label-md text-label-md text-on-background truncate max-w-[200px] font-medium">
                {file.name}
              </p>
              <p className="font-label-sm text-[11px] text-on-surface-variant mt-0.5">
                {formatFileSize(file.size)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <label
              htmlFor={inputId}
              className="p-1.5 text-outline hover:text-secondary transition-colors cursor-pointer"
              title="Replace file"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">sync</span>
            </label>
            <button
              type="button"
              onClick={onFileRemove}
              className="p-1.5 text-outline hover:text-match-rose transition-colors"
              title="Remove file"
              disabled={disabled}
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">delete</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
