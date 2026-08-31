import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TopNavBar from './components/TopNavBar';
import Hero from './components/Hero';
import ResumeUploadCard from './components/ResumeUploadCard';
import ByokCard from './components/ByokCard';
import JobDescriptionCard from './components/JobDescriptionCard';
import AnalyzeButton from './components/AnalyzeButton';
import ResultsDashboard from './components/ResultsDashboard';
import TeamModal from './components/TeamModal';
import SessionHistoryDrawer from './components/SessionHistoryDrawer';
import ApiTelemetryDrawer from './components/ApiTelemetryDrawer';
import HowItWorksModal from './components/HowItWorksModal';
import AboutModal from './components/AboutModal';
import { analyzeResume, checkHealth } from './services/api';
import './App.css';

export default function App() {
  // State management
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [apiKey, setApiKey] = useState(''); // BYOK in-memory state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const [pingLatency, setPingLatency] = useState(12);

  // Modal and Drawer states
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Health check on mount & periodically
  useEffect(() => {
    let mounted = true;
    const verifyHealth = async () => {
      const start = Date.now();
      const online = await checkHealth();
      const duration = Math.max(1, Date.now() - start);
      if (mounted) {
        setIsBackendOnline(online);
        setPingLatency(duration);
      }
    };

    verifyHealth();
    const interval = setInterval(verifyHealth, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleFileSelect = (file) => {
    setError(null);
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File exceeds the 5MB size limit. Please upload a smaller PDF or DOCX file.');
        return;
      }
      setResumeFile(file);
    }
  };

  const handleAnalyze = async () => {
    if (!resumeFile) {
      setError('Please select or upload a resume file (PDF or DOCX).');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please provide a target job description or click one of the quick templates.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await analyzeResume(resumeFile, jobDescription, apiKey);
      setAnalysisResult(data);

      // Save to in-memory session history
      setSessionHistory((prev) => [
        {
          ...data,
          timestamp: Date.now(),
          jdSnippet: jobDescription.substring(0, 80) + '...',
        },
        ...prev,
      ]);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred during analysis.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app-layout bg-mesh">
      {/* Fixed Top Navigation Bar */}
      <TopNavBar
        isOnline={isBackendOnline}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenTeam={() => setIsTeamOpen(true)}
      />

      {/* Left Sidebar Navigation */}
      <Sidebar
        activeView={analysisResult ? 'dashboard' : 'analyzer'}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
        onOpenTeam={() => setIsTeamOpen(true)}
        isAiPowered={Boolean(apiKey && apiKey.trim())}
      />

      {/* Main Content Area */}
      <main className="main-content-canvas">
        {/* Error Alert Banner */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-match-rose/15 border border-match-rose/40 text-match-rose flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">error</span>
              <span className="text-sm font-medium">{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="p-1 hover:bg-match-rose/20 rounded text-xs font-bold"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* View Switcher: Workspace (Screen 1) vs Dashboard (Screen 2) */}
        {!analysisResult ? (
          <div className="workspace-view-container animate-fade-in">
            <Hero isAiPowered={Boolean(apiKey && apiKey.trim())} />

            {/* 2-Column Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative items-stretch">
              {/* Left Column: File Upload & BYOK Hub */}
              <div className="lg:col-span-5 flex flex-col gap-6">
                <ResumeUploadCard
                  file={resumeFile}
                  onFileSelect={handleFileSelect}
                  onFileRemove={() => setResumeFile(null)}
                  disabled={loading}
                />

                <ByokCard
                  value={apiKey}
                  onChange={setApiKey}
                  onClear={() => setApiKey('')}
                  disabled={loading}
                />
              </div>

              {/* Right Column: Job Description Workspace */}
              <div className="lg:col-span-7 flex flex-col">
                <JobDescriptionCard
                  value={jobDescription}
                  onChange={setJobDescription}
                  onClear={() => setJobDescription('')}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Centered Full-Width Action Button */}
            <AnalyzeButton
              onClick={handleAnalyze}
              loading={loading}
              disabled={!resumeFile || !jobDescription.trim()}
            />

            {/* Workspace Footer */}
            <footer className="mt-16 pt-6 border-t border-surface-container-highest/40 flex flex-col md:flex-row justify-between items-center text-xs text-on-surface-variant gap-4">
              <div>
                © 2026 ResumeAI. Developed by Team Antigravity. All rights reserved.
              </div>
              <div className="flex items-center gap-4">
                <button type="button" onClick={() => setIsAboutOpen(true)} className="hover:text-on-background">
                  Privacy Policy
                </button>
                <span>•</span>
                <button type="button" onClick={() => setIsHowItWorksOpen(true)} className="hover:text-on-background">
                  Architecture
                </button>
                <span>•</span>
                <button type="button" onClick={() => setIsTeamOpen(true)} className="hover:text-on-background">
                  Engineering Team
                </button>
              </div>
            </footer>
          </div>
        ) : (
          <ResultsDashboard
            result={analysisResult}
            onReset={handleReset}
            onOpenTeam={() => setIsTeamOpen(true)}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <TeamModal isOpen={isTeamOpen} onClose={() => setIsTeamOpen(false)} />
      <SessionHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={sessionHistory}
        onSelectHistoryItem={(item) => setAnalysisResult(item)}
        onClearHistory={() => setSessionHistory([])}
      />
      <ApiTelemetryDrawer
        isOpen={isTelemetryOpen}
        onClose={() => setIsTelemetryOpen(false)}
        isOnline={isBackendOnline}
        pingLatency={pingLatency}
        apiKeyPresent={Boolean(apiKey && apiKey.trim())}
      />
      <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
