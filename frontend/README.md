# Frontend — AI-Powered Resume Analyzer

React 19 + Vite frontend for the AI-Powered Resume Analyzer project.

## Tech Stack

- **React 19** — UI framework
- **Vite 6** — Build tool & dev server
- **Axios** — HTTP client for backend API calls
- **D3.js** — Data visualization (Radar Chart — Week 6)
- **CSS** — Custom Deep Space glassmorphism design system

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx                  # Root component, layout manager
│   ├── index.css                # Global Deep Space design tokens
│   └── components/
│       ├── TopNavBar.jsx        # Fixed top navbar + hamburger (mobile)
│       ├── Sidebar.jsx          # Desktop sidebar / Mobile slide-out drawer
│       ├── Hero.jsx             # Upload dropzone + JD input panel
│       ├── BYOKHub.jsx          # API key input (Bring Your Own Key)
│       └── ResultsDashboard.jsx # Score gauge, KPI tiles, skill matrix, insights
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── package.json
└── vite.config.js
```

## Running Locally

```bash
npm install
npm run dev
```

Dev server starts at → `http://localhost:5173`

## Build for Production

```bash
npm run build
```

Output goes to `dist/` folder.

## Design System

The app uses a custom **Deep Space** theme defined in `index.css`:

- Background: `#0a0f1e` (Deep Space)
- Primary Accent: Emerald Green `hsl(158, 64%, 52%)`
- Secondary Accent: Amber `hsl(43, 96%, 56%)`
- Cards: Glassmorphism with `backdrop-filter: blur(12px)`
- Font: System sans-serif stack, modern weights

## Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| `< 768px` | Mobile — slide-out navigation drawer via `☰` hamburger |
| `768px – 1024px` | Tablet — collapsed sidebar |
| `> 1024px` | Desktop — fixed `260px` sidebar, dual-column grid |

## API Integration

The frontend communicates with the FastAPI backend at `http://127.0.0.1:8000`:

| Endpoint | Method | Purpose |
|---|---|---|
| `/health` | GET | Check if backend is running |
| `/analyze` | POST | Submit resume + JD for analysis |

The Gemini API key (if provided) is sent via the `X-Gemini-API-Key` request header.
