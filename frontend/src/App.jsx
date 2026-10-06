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
import XRayVisualizer from './components/XRayVisualizer';
import InteractiveWalkthrough from './components/InteractiveWalkthrough';
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
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const [error, setError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('demo=true')) {
      return {
        score: 88,
        filename: 'Senior_FullStack_Engineer_Resume.pdf',
        is_ai_powered: true,
        analysis_confidence: 'high',
        candidate_summary:
          'High-caliber Full-Stack & AI Systems candidate with proven mastery over FastAPI backend microservices, React 19 single-page applications, PyMuPDF stream processing, and multi-provider LLM orchestration.',
        matched_skills: [
          'Python',
          'FastAPI',
          'React 19',
          'Tailwind CSS',
          'Docker',
          'REST APIs',
          'PostgreSQL',
          'PyMuPDF',
          'Google Gemini AI',
          'Vercel Edge',
          'Render Cloud'
        ],
        missing_skills: [
          'Kubernetes Clustering',
          'GraphQL Subscriptions',
          'AWS ECS IaC'
        ],
        strengths: [
          'Enterprise-grade zero-persistence in-memory streaming with strict 5MB boundaries',
          'Hardware-synchronized 60/120 FPS score count-up physics and GPU-accelerated glassmorphism',
          'Automated multi-tier fallback architecture ensuring 100% uptime resilience'
        ],
        weaknesses: [
          'Could document multi-region Kubernetes cluster deployment configurations',
          'Add automated load benchmarking metrics for sustained concurrent uploads'
        ],
        suggestions: [
          'Include production throughput benchmarks (requests/second under concurrent traffic)',
          'Highlight Terraform or CloudFormation Infrastructure-as-Code scripts in deployment section'
        ],
        warnings: []
      };
    }
    return null;
  });
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

  const handleLoadSample = async () => {
    try {
      setIsLoadingSample(true);
      setError(null);
      const res = await fetch('/sample_resume.pdf');
      if (!res.ok) throw new Error('Could not fetch sample resume file');
      const blob = await res.blob();
      const sampleFile = new File([blob], 'Alex_Rivera_Senior_FullStack_Resume.pdf', {
        type: 'application/pdf',
      });
      setResumeFile(sampleFile);
      setJobDescription(
`Senior Full Stack & AI Software Engineer
TechCorp Innovations | San Francisco, CA (Hybrid / Remote)

About the Role:
We are seeking a versatile Senior Full Stack & AI Engineer to design and scale our cloud-native platforms. You will develop backend microservices, build sleek React frontends, and integrate generative AI pipelines.

Key Qualifications & Responsibilities:
• 4+ years of professional experience with Python, FastAPI, and PostgreSQL.
• Strong frontend development experience with React, TypeScript, and Tailwind CSS.
• Hands-on experience containerizing services with Docker and deploying cloud workloads on AWS/Kubernetes.
• Familiarity with AI/ML concepts (PyTorch, LLMs, NLP) and Redis caching is a strong plus.
• Solid background in building high-throughput REST APIs and CI/CD pipelines.`
      );
    } catch (err) {
      setError('Could not load sample resume. Please upload your own PDF/DOCX file.');
    } finally {
      setIsLoadingSample(false);
    }
  };

  const handleAnalyze = () => {
    if (!resumeFile) {
      setError('Please select or upload a resume file (PDF or DOCX), or click "Try 1-Click Demo".');
      return;
    }
    if (!jobDescription.trim()) {
      setError('Please provide a target job description or click one of the quick templates.');
      return;
    }

    setError(null);
    setLoading(true);
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

            {/* 1-Click Interactive Demo & Step Walkthrough */}
            <InteractiveWalkthrough
              hasResume={Boolean(resumeFile)}
              hasJd={Boolean(jobDescription && jobDescription.trim())}
              onLoadSample={handleLoadSample}
              isLoadingSample={isLoadingSample}
            />

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

      {/* Live X-Ray Streaming Visualizer Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-[120] flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="max-w-4xl w-full my-auto">
            <XRayVisualizer
              file={resumeFile}
              jobDescription={jobDescription}
              apiKey={activeKey}
              onDone={(data) => {
                setAnalysisResult(data);
                setSessionHistory((prev) => [
                  {
                    ...data,
                    timestamp: Date.now(),
                    jdSnippet: jobDescription.substring(0, 80) + '...',
                  },
                  ...prev,
                ]);
                setLoading(false);
              }}
              onError={(err) => {
                setError(err || 'Analysis encountered an issue. Please try again.');
                setLoading(false);
              }}
              onCancel={() => setLoading(false)}
            />
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
