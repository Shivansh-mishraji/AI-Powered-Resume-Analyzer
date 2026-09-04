# Frontend — AI-Powered Resume Analyzer

> 🌐 **Live Website:** [https://ai-powered-resume-analyzer-pi.vercel.app](https://ai-powered-resume-analyzer-pi.vercel.app)  
> ⚡ **Production Backend:** [https://resume-analyzer-api.onrender.com](https://resume-analyzer-api.onrender.com)

React 19 + Vite frontend featuring a GPU-accelerated **Nebula Aurora** design system, 60/120 FPS hardware-synced counter animations, and an enterprise **Multi-Provider BYOK** security model.

---

## Tech Stack

- **React 19** — Modern component lifecycle & state management
- **Vite 6 / 8** — Fast ES module bundler
- **Native Fetch API** — Streamlined HTTP client with silent cold-start warmup and 45s request timeout
- **CSS3 / GPU Compositing** — Custom Nebula Aurora glassmorphism with `translateZ(0)` compositing
- **Hardware-Synced Animation** — Cubic ease-out score counters via `requestAnimationFrame`

---

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx                  # Root orchestrator & modal state controller
│   ├── App.css                  # Nebula Aurora glassmorphic theme & micro-animations
│   ├── index.css                # Global CSS resets & design tokens
│   ├── components/
│   │   ├── TopNavBar.jsx        # Fixed top navigation + status indicator
│   │   ├── Sidebar.jsx          # Desktop sidebar & drawer manager
│   │   ├── Hero.jsx             # Headline banner & quick action triggers
│   │   ├── ResumeUploadCard.jsx # Drag-and-drop file upload zone (PDF/DOCX)
│   │   ├── ByokCard.jsx         # Card wrapper for multi-provider API key
│   │   ├── ApiKeyInput.jsx      # Key input with masking, provider detection, & toggles
│   │   ├── JobDescriptionCard.jsx # Target JD textarea + quick role templates
│   │   ├── AnalyzeButton.jsx    # CTA button with cycling progress messages
│   │   ├── ResultsDashboard.jsx # 60/120fps score gauge, KPI tiles, & AI insights
│   │   ├── ScoreCard.jsx        # Radial score meter with ease-out cubic animation
│   │   ├── AuroraBackground.jsx # Lightweight GPU aurora particles with tab-pause
│   │   ├── ApiTelemetryDrawer.jsx # Latency meter & system status drawer
│   │   ├── SessionHistoryDrawer.jsx # Client-side scan history drawer
│   │   └── TeamModal.jsx        # Project team attribution modal
│   ├── hooks/
│   │   └── useSecureApiKey.js   # SessionStorage obfuscation & key validation
│   ├── services/
│   │   └── api.js               # Backend communicator & cold-start warmup
│   └── main.jsx                 # Application entry point with silent pre-warming
├── vercel.json                  # Single-page app rewrite rules
├── package.json
└── vite.config.js
```

---

## Running Locally

```bash
cd frontend
npm install
npm run dev
```

Dev server starts at → `http://localhost:5173`

---

## Build for Production

```bash
npm run build
```

Production bundle compiles into `dist/` in under 800ms.

---

## Design System: Nebula Aurora

The app utilizes a custom **Nebula Aurora** dark theme:

- **Background:** Deep cosmic obsidian (`#080914`)
- **Primary Accent:** Electric Indigo (`#6366f1`)
- **Secondary Accent:** Sky Blue (`#38bdf8`) & Neon Fuchsia (`#d946ef`)
- **Success Accent:** Emerald (`#10b981`)
- **Glassmorphism:** `backdrop-filter: blur(16px)` with GPU compositing (`transform: translateZ(0)`)
- **Accessibility:** Full `prefers-reduced-motion` compliance; auto-pauses decorative particles when tab is hidden (`visibilitychange`).

---

## API Integration

The frontend automatically connects to the FastAPI backend:
- **Local Dev:** `http://127.0.0.1:8000`
- **Cloud Production:** `https://resume-analyzer-api.onrender.com` (configured via `VITE_API_URL` or `VITE_API_BASE_URL`)

The API key (Google Gemini `AQ.`/`AIza`, OpenAI `sk-`, or Claude `sk-ant-`) is sent securely per-session via the `X-Gemini-API-Key` request header.

