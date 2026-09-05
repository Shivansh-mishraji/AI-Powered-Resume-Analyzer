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
import { useSecureApiKey } from './hooks/useSecureApiKey';
import AuroraBackground from './components/AuroraBackground';
import './App.css';

export default function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState(
    'We are seeking a Senior Full-Stack Engineer to join our core product team. You will be responsible for designing and implementing scalable backend services in Node.js and building responsive frontends using React and Tailwind CSS. Experience with PostgreSQL and cloud deployments (AWS/GCP) is required.'
  );
  const {
    rawKey, activeKey, isEnabled, saveToSession,
    setKey, clearKey, toggleEnabled, toggleSave
  } = useSecureApiKey();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [isBackendOnline, setIsBackendOnline] = useState(true);
  const [pingLatency, setPingLatency] = useState(14);

  // Modals & Drawers
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isTeamOpen, setIsTeamOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isTelemetryOpen, setIsTelemetryOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  // Health check on mount and interval
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
        setError('File exceeds the 5MB maximum size limit. Please upload a smaller PDF or DOCX file.');
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
      const data = await analyzeResume(resumeFile, jobDescription, activeKey);
      setAnalysisResult(data);

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
    <div className="bg-mesh text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden" style={{ position: 'relative' }}>
      {/* Animated aurora orbs + particles */}
      <AuroraBackground />
      {/* Top Navigation Bar */}
      <TopNavBar
        isOnline={isBackendOnline}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        onOpenTeam={() => setIsTeamOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Side Navigation Bar (Desktop fixed & Mobile drawer) */}
      <Sidebar
        activeView={analysisResult ? 'dashboard' : 'analyzer'}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenTelemetry={() => setIsTelemetryOpen(true)}
        onOpenTeam={() => setIsTeamOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenHowItWorks={() => setIsHowItWorksOpen(true)}
        isAiPowered={Boolean(activeKey)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-64 pt-[80px] md:pt-[90px] px-4 sm:px-6 md:px-12 pb-12 w-auto min-h-screen">
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
              className="p-1 hover:bg-match-rose/20 rounded text-xs font-bold cursor-pointer"
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* View Switcher */}
        {!analysisResult ? (
          <div className="workspace-container">
            {/* Hero Section */}
            <Hero isAiPowered={Boolean(activeKey)} />

            {/* Workspace Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-stack-md relative items-stretch" style={{ position: 'relative', zIndex: 1 }}>
              {/* Left Column: Upload & BYOK Hub */}
              <div className="lg:col-span-5 flex flex-col gap-4 md:gap-stack-md z-10 animate-stagger-2">
                <ResumeUploadCard
                  file={resumeFile}
                  onFileSelect={handleFileSelect}
                  onFileRemove={() => setResumeFile(null)}
                  disabled={loading}
                />

                <ByokCard
                  value={rawKey}
                  onChange={setKey}
                  onClear={clearKey}
                  isEnabled={isEnabled}
                  saveToSession={saveToSession}
                  onToggleEnabled={toggleEnabled}
                  onToggleSave={toggleSave}
                  disabled={loading}
                />
              </div>

              {/* Right Column: Job Description Card */}
              <div className="lg:col-span-7 flex flex-col gap-4 md:gap-stack-md z-10 animate-stagger-3">
                <JobDescriptionCard
                  value={jobDescription}
                  onChange={setJobDescription}
                  onClear={() => setJobDescription('')}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Full-Width Analyze CTA */}
            <AnalyzeButton
              onClick={handleAnalyze}
              loading={loading}
              disabled={!resumeFile || !jobDescription.trim()}
            />
          </div>
        ) : (
          <div className="animate-dashboard-reveal">
          <ResultsDashboard
            result={analysisResult}
            onReset={handleReset}
            onOpenTeam={() => setIsTeamOpen(true)}
          />
          </div>
        )}

      </main>

      {/* Footer for Workspace View */}
      {!analysisResult && (
        <footer className="w-auto md:ml-64 py-6 border-t border-surface-container-highest/50 bg-background/50 backdrop-blur-md relative z-10 flex flex-col md:flex-row justify-between items-center px-4 sm:px-6 md:px-12 text-xs text-outline gap-3">
          <div className="text-center md:text-left">
            © 2026 ResumeAI. All rights reserved.
            <span className="mx-2 hidden sm:inline">•</span>
            <button
              type="button"
              className="hover:text-secondary transition-colors block sm:inline mt-1 sm:mt-0 font-medium"
              onClick={() => setIsTeamOpen(true)}
            >
              Project Lead: Shivansh Mishra &amp; Team
            </button>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <button type="button" onClick={() => setIsAboutOpen(true)} className="hover:text-on-background transition-colors">
              Privacy
            </button>
            <button type="button" onClick={() => setIsHowItWorksOpen(true)} className="hover:text-on-background transition-colors">
              Architecture
            </button>
            <button type="button" onClick={() => setIsTeamOpen(true)} className="hover:text-on-background transition-colors">
              Security
            </button>
          </div>
        </footer>
      )}

      {/* Progressive Loading State Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-background/90 backdrop-blur-sm z-[100] flex flex-col items-center justify-center p-4 animate-fade-in">
          <div className="glass-panel rounded-2xl p-6 sm:p-8 max-w-md w-full border-secondary/30 shadow-glow-cyan relative">
            <h3 className="font-headline-md text-xl sm:text-2xl text-on-background mb-6 text-center font-semibold">
              Analyzing Compatibility
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-match-emerald">
                <span className="material-symbols-outlined text-[20px]" aria-hidden="true">check_circle</span>
                <span className="font-label-md text-sm sm:text-base">Extracting resume entities...</span>
              </div>
              <div className="flex items-center gap-3 text-secondary animate-pulse">
                <div className="w-5 h-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" aria-hidden="true" />
                <span className="font-label-md text-sm sm:text-base font-medium">Mapping JD requirements...</span>
              </div>
              <div className="flex items-center gap-3 text-outline">
                <span className="material-symbols-outlined text-[20px] opacity-50" aria-hidden="true">pending</span>
                <span className="font-label-md text-sm sm:text-base opacity-50">Running ATS AST rules...</span>
              </div>
              <div className="flex items-center gap-3 text-outline">
                <span className="material-symbols-outlined text-[20px] opacity-50" aria-hidden="true">pending</span>
                <span className="font-label-md text-sm sm:text-base opacity-50">Generating AI insights...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modals & Drawers */}
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
        apiKeyPresent={Boolean(activeKey && activeKey.trim())}
      />
      <HowItWorksModal isOpen={isHowItWorksOpen} onClose={() => setIsHowItWorksOpen(false)} />
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
