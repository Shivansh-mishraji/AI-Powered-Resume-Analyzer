// teamData.js — Canonical Team Roster & Architectural Contribution Matrix
// Department of Computer Science & Engineering • BBD University 2026

export const TEAM_MEMBERS = [
  {
    id: 'shivansh',
    number: '01',
    isLeader: true,
    tabLabel: '👑 Shivansh (Lead)',
    badgeText: '👑 Team Leader & Principal Architect',
    name: 'Shivansh Mishra',
    initials: 'SM',
    avatar: '/team/shivansh_circle.png',
    fallbackAvatar: 'https://github.com/Shivansh-mishraji.png',
    role: 'Team Lead • Backend & AI Systems Architect',
    themeColor: '#38bdf8', // Electric Cyan
    glowHex: 'rgba(56, 189, 248, 0.35)',
    accentClass: 'text-sky-400',
    borderClass: 'border-sky-500/50 hover:border-sky-400',
    glowClass: 'shadow-[0_0_35px_rgba(56,189,248,0.25)]',
    ringClass: 'ring-4 ring-sky-400/80 shadow-[0_0_24px_rgba(56,189,248,0.55)]',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    cardGradient: 'from-sky-950/40 via-slate-900/90 to-slate-950/90',
    github: 'https://github.com/Shivansh-mishraji',
    email: 'tgsmishra@gmail.com',
    quote: '"Engineering enterprise resilience via zero-disk in-memory streams and deterministic taxonomy resolution."',
    summary:
      'Conceived, engineered, and steered the complete platform architecture: FastAPI REST Gateway, 5 Enterprise Backend Engines (Taxonomy Graph, ATS Audit, Exporters, Interview Generator), Multi-Provider AI BYOK, and production cloud deployments on Render & Vercel.',
    defenseSlot: {
      time: '0:00 - 2:00',
      phase: 'Opening & AI Backend Architecture',
      topics: [
        'Problem formulation & ATS market gap',
        'FastAPI REST architecture & Zero-Disk RAM streams',
        '440+ Skills Taxonomy Graph & Synonym resolution',
        'Multi-Provider AI BYOK engine (Gemini 3.6, GPT-4o, Claude)'
      ]
    },
    superpowers: [
      { name: 'AI & LLM Orchestration', percent: 99 },
      { name: 'FastAPI Microservices', percent: 98 },
      { name: 'Zero-Disk Architecture', percent: 96 },
    ],
    deliverables: [
      { icon: 'bolt', text: 'FastAPI REST Gateway & 5 Enterprise Engines' },
      { icon: 'psychology', text: 'Multi-Provider AI Engine (Gemini 3.6, GPT-4o, Claude)' },
      { icon: 'account_tree', text: '440+ Skills Taxonomy Graph & Synonym Resolution' },
      { icon: 'memory', text: 'In-Memory Zero-Disk PyMuPDF Stream & Exporters' },
    ],
    techStack: ['Python 3.13', 'FastAPI', 'Gemini 3.6', 'PyMuPDF', 'Pydantic', 'Render Cloud'],
  },
  {
    id: 'harshvardhan',
    number: '02',
    isLeader: false,
    tabLabel: '🎨 Harshvardhan (Frontend)',
    badgeText: '🎨 Frontend Architect & UI/UX Lead',
    name: 'Harshvardhan Sisodiya',
    initials: 'HS',
    avatar: '/team/harshvardhan.png',
    fallbackAvatar: '/team/harshvardhan_circle.png',
    role: 'Frontend Architect • UI/UX Lead',
    themeColor: '#818cf8', // Cosmic Indigo
    glowHex: 'rgba(129, 140, 248, 0.35)',
    accentClass: 'text-indigo-400',
    borderClass: 'border-indigo-500/50 hover:border-indigo-400',
    glowClass: 'shadow-[0_0_35px_rgba(129,140,248,0.25)]',
    ringClass: 'ring-4 ring-indigo-400/80 shadow-[0_0_24px_rgba(129,140,248,0.55)]',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/40',
    cardGradient: 'from-indigo-950/40 via-slate-900/90 to-slate-950/90',
    github: 'https://github.com/harsh123-code',
    email: 'hsisodiya205@bbdu.ac.in',
    quote: '"Crafting high-precision GPU interfaces where visual delight meets hardware-synchronized performance."',
    summary:
      'Architected the React 19 single-page application with GPU-accelerated Nebula Aurora glassmorphism, 60/120 FPS hardware-synchronized score physics, 180px SVG radial match gauge, and BYOK security vault.',
    defenseSlot: {
      time: '2:00 - 3:30',
      phase: 'React 19 Frontend & Live Visualizer',
      topics: [
        'React 19 component hierarchy & reactive state',
        'GPU-accelerated Glassmorphism & SVG Physics',
        'Live X-Ray Streaming SSE Visualizer animation',
        'Multi-Provider BYOK Local Vault & Security'
      ]
    },
    superpowers: [
      { name: 'React 19 & State Architecture', percent: 98 },
      { name: 'GPU Glassmorphism & Physics', percent: 97 },
      { name: 'SVG Radial Mechanics', percent: 95 },
    ],
    deliverables: [
      { icon: 'web', text: 'React 19 + Vite Modular SPA Architecture' },
      { icon: 'auto_awesome', text: 'Nebula Aurora Glassmorphism & 60fps Physics' },
      { icon: 'speed', text: '180px SVG Radial Match Gauge & Count-Up' },
      { icon: 'key', text: 'Multi-Provider BYOK Security Hub & Telemetry' },
    ],
    techStack: ['React 19', 'Vite 6', 'Tailwind CSS', 'SVG Physics', 'Vercel Edge'],
  },
  {
    id: 'vishal',
    number: '03',
    isLeader: false,
    tabLabel: '🛡️ Vishal (Security & QA)',
    badgeText: '🛡️ QA Lead & Security Specialist',
    name: 'Vishal Patel',
    initials: 'VP',
    avatar: '/team/vishal.png',
    fallbackAvatar: '/team/vishal_circle.png',
    role: 'QA Lead • Security & Automated Testing',
    themeColor: '#34d399', // Cyber Emerald
    glowHex: 'rgba(52, 211, 153, 0.35)',
    accentClass: 'text-emerald-400',
    borderClass: 'border-emerald-500/50 hover:border-emerald-400',
    glowClass: 'shadow-[0_0_35px_rgba(52,211,153,0.25)]',
    ringClass: 'ring-4 ring-emerald-400/80 shadow-[0_0_24px_rgba(52,211,153,0.55)]',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
    cardGradient: 'from-emerald-950/40 via-slate-900/90 to-slate-950/90',
    github: 'https://github.com/patelvishal-ji',
    email: 'patelvishal7800023@gmail.com',
    quote: '"Vetting zero-trust security boundaries and driving 100% test reliability under extreme edge cases."',
    summary:
      'Designed and executed automated testing infrastructure: 92/92 passing pytest test suite, concurrency benchmark runner, OWASP security sanitization, and multi-format QA evaluation dataset.',
    defenseSlot: {
      time: '3:30 - 4:45',
      phase: 'Zero-Trust Security & 92/92 Pytest Suite',
      topics: [
        '92/92 automated pytest test suite architecture',
        'OWASP sanitization: Prompt Injection, XSS & SQLi',
        'Concurrent stress testing & latency benchmarks',
        'Synthetic adversarial test cases & fuzzing'
      ]
    },
    superpowers: [
      { name: 'Automated Pytest Coverage', percent: 99 },
      { name: 'OWASP Security Sanitization', percent: 97 },
      { name: 'Concurrency Benchmarking', percent: 94 },
    ],
    deliverables: [
      { icon: 'verified', text: 'Pytest 92/92 Passing Automated Test Suite' },
      { icon: 'speed', text: 'Concurrency & Latency Benchmark Runner' },
      { icon: 'security', text: 'OWASP Sanitization (XSS, SQLi, Prompt Injection)' },
      { icon: 'description', text: 'Synthetic Evaluation Dataset & Audit Logs' },
    ],
    techStack: ['Pytest', 'Python 3.13', 'Benchmark', 'Security Audit', 'CI/CD'],
  },
  {
    id: 'sujeet',
    number: '04',
    isLeader: false,
    tabLabel: '📑 Sujeet (Research & Docs)',
    badgeText: '📑 Research Lead & Technical Writer',
    name: 'Sujeet Kannaujiya',
    initials: 'SK',
    avatar: '/team/sujeet.png',
    fallbackAvatar: '/team/sujeet_circle.png',
    role: 'Research Lead • Technical Documentation',
    themeColor: '#fbbf24', // Solar Amber
    glowHex: 'rgba(251, 191, 36, 0.35)',
    accentClass: 'text-amber-400',
    borderClass: 'border-amber-500/50 hover:border-amber-400',
    glowClass: 'shadow-[0_0_35px_rgba(251,191,36,0.25)]',
    ringClass: 'ring-4 ring-amber-400/80 shadow-[0_0_24px_rgba(251,191,36,0.55)]',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
    cardGradient: 'from-amber-950/40 via-slate-900/90 to-slate-950/90',
    github: 'https://github.com/sujeet-official',
    email: 'sujeetkannaujiya2004@bbdu.ac.in',
    quote: '"Translating complex algorithmic heuristics and AI evaluations into transparent, ethical documentation."',
    summary:
      'Authored academic research and technical documentation: ATS heuristics specification, LLM benchmark study, ethical AI non-bias framework, and Capstone Project Dossier.',
    defenseSlot: {
      time: '4:45 - 6:00',
      phase: 'ATS Research, Ethical AI & Wrap-Up',
      topics: [
        'ATS algorithm heuristics & reverse-engineering findings',
        'Empirical LLM comparison (Gemini 3.6 vs GPT-4o vs Claude)',
        'EEOC non-bias compliance & algorithmic fairness rubric',
        'Comprehensive Project Dossier & academic conclusion'
      ]
    },
    superpowers: [
      { name: 'ATS Heuristics Analysis', percent: 98 },
      { name: 'Empirical LLM Benchmarks', percent: 96 },
      { name: 'Ethical AI & EEOC Rubrics', percent: 95 },
    ],
    deliverables: [
      { icon: 'menu_book', text: 'Deep ATS Parsing Heuristics & Font Specifications' },
      { icon: 'science', text: 'Empirical LLM Benchmarking (Gemini vs GPT vs Claude)' },
      { icon: 'gavel', text: 'EEOC Non-Bias Compliance & Ethical AI Rubric' },
      { icon: 'library_books', text: 'Capstone Project Technical Dossier & Architecture' },
    ],
    techStack: ['Capstone Dossier', 'ATS Specs', 'LLM Benchmarks', 'Ethical AI'],
  },
];

// Architecture System Matrix
export const ARCHITECTURE_LAYERS = [
  {
    id: 'backend',
    layer: 'Layer 1: AI & REST Microservice Engine',
    leadName: 'Shivansh Mishra (Team Lead)',
    accent: '#38bdf8',
    icon: 'memory',
    highlights: 'FastAPI Gateway, 5 Engines, 440+ Taxonomy Graph, Zero-Disk PyMuPDF stream, Multi-LLM BYOK',
  },
  {
    id: 'frontend',
    layer: 'Layer 2: GPU-Accelerated UI & Visualizer',
    leadName: 'Harshvardhan Sisodiya',
    accent: '#818cf8',
    icon: 'desktop_windows',
    highlights: 'React 19 SPA, 60fps Glassmorphism, 180px SVG Radial Gauge, Live X-Ray SSE Visualizer',
  },
  {
    id: 'security',
    layer: 'Layer 3: Zero-Trust Security & Automation',
    leadName: 'Vishal Patel',
    accent: '#34d399',
    icon: 'verified_user',
    highlights: '92/92 Pytest Test Suite, OWASP Prompt Injection Defense, Stress Benchmarking',
  },
  {
    id: 'research',
    layer: 'Layer 4: Heuristics & Capstone Research',
    leadName: 'Sujeet Kannaujiya',
    accent: '#fbbf24',
    icon: 'auto_stories',
    highlights: 'ATS Algorithm Reverse-Engineering, LLM Benchmark Study, EEOC Ethical AI Framework',
  },
];

// Ultra-lightweight Web Audio API Sound Synthesizer (0 dependencies, 100% offline)
export function playCyberChime(type = 'hover') {
  try {
    if (typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'hover') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'click') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.07); // G5
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    } else if (type === 'celebrate') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.15); // C6
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
      osc.start(now);
      osc.stop(now + 0.22);
    }
  } catch {
    // Ignore audio errors if blocked by browser policy
  }
}
