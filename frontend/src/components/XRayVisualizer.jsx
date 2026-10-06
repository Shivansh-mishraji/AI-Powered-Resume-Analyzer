/**
 * XRayVisualizer — Live Resume Analysis Visualization
 * 
 * Connects to /analyze-stream SSE endpoint and animates:
 *   Phase 1 → Scan lines sweep the document cards
 *   Phase 2 → Skill chips float up from Resume (blue) + JD (amber)
 *   Phase 3 → Taxonomy graph edges draw themselves
 *   Phase 4 → Match lines (green) + Gap pulses (red) appear
 *   Phase 5 → Score counter animates to final value
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { analyzeResume } from '../services/api';
import './XRayVisualizer.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

/* ─── tiny helpers ──────────────────────────────────────────── */
const uid = () => Math.random().toString(36).slice(2, 8);

const DOMAIN_COLORS = {
  'Programming Languages': '#6366f1',
  'Web Frameworks':        '#8b5cf6',
  'Databases & Cloud':     '#0ea5e9',
  'AI & Data Science':     '#f59e0b',
  'DevOps & Infrastructure':'#10b981',
  'Core Tools':            '#ec4899',
  'General':               '#94a3b8',
};

function domainColor(domain) {
  return DOMAIN_COLORS[domain] || DOMAIN_COLORS.General;
}

/* ─── sub-components ────────────────────────────────────────── */

function PhaseLabel({ label }) {
  return (
    <div className="xray-phase-label" key={label}>
      <span className="xray-phase-dot" />
      {label}
    </div>
  );
}

function SkillChip({ skill, domain, source, style }) {
  const color = domainColor(domain);
  return (
    <span
      className={`xray-chip xray-chip--${source}`}
      style={{ '--chip-color': color, ...style }}
      title={domain}
    >
      {skill}
    </span>
  );
}

function GraphEdge({ from, to, domain, label }) {
  return (
    <div className="xray-edge" style={{ '--edge-color': domainColor(domain) }}>
      <span className="xray-edge-node">{from}</span>
      <span className="xray-edge-arrow">→</span>
      <span className="xray-edge-node xray-edge-node--canonical">{to}</span>
      <span className="xray-edge-domain">[{domain}]</span>
    </div>
  );
}

function MatchRow({ skill, type }) {
  return (
    <div className={`xray-match-row xray-match-row--${type}`}>
      {type === 'match' ? (
        <>
          <span className="xray-match-pill xray-match-pill--resume">{skill}</span>
          <span className="xray-match-line" />
          <span className="xray-match-check">✅</span>
          <span className="xray-match-line" />
          <span className="xray-match-pill xray-match-pill--jd">{skill}</span>
        </>
      ) : (
        <>
          <span className="xray-match-gap-spacer" />
          <span className="xray-match-line xray-match-line--gap" />
          <span className="xray-match-check xray-match-check--gap">❌</span>
          <span className="xray-match-line xray-match-line--gap" />
          <span className="xray-match-pill xray-match-pill--jd">{skill}</span>
        </>
      )}
    </div>
  );
}

function ScoreRing({ value, max = 100 }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / max) * circ;
  const color = value >= 80 ? '#10b981' : value >= 60 ? '#f59e0b' : '#ef4444';

  return (
    <div className="xray-score-ring-wrap">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#1e293b" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dashoffset 0.5s ease, stroke 0.3s' }}
        />
      </svg>
      <div className="xray-score-value" style={{ color }}>
        {value}<span className="xray-score-unit">%</span>
      </div>
    </div>
  );
}

/* ─── Main Component ─────────────────────────────────────────── */
export default function XRayVisualizer({ file, jobDescription, apiKey, onDone, onError, onSkip, onCancel }) {
  const [phase, setPhase]             = useState('init');
  const [phaseLabel, setPhaseLabel]   = useState('🚀 Starting live inspection...');
  const [resumeChips, setResumeChips] = useState([]);
  const [jdChips, setJdChips]         = useState([]);
  const [edges, setEdges]             = useState([]);
  const [matches, setMatches]         = useState([]);
  const [gaps, setGaps]               = useState([]);
  const [score, setScore]             = useState(0);
  const [scanResume, setScanResume]   = useState(false);
  const [scanJd, setScanJd]           = useState(false);
  const [isSkipping, setIsSkipping]   = useState(false);
  const abortRef = useRef(null);
  const resultRef = useRef(null);

  const handleSkip = async () => {
    setIsSkipping(true);
    abortRef.current?.abort();
    if (resultRef.current) {
      onDone?.(resultRef.current);
      return;
    }
    if (onSkip) {
      onSkip();
      return;
    }
    try {
      const res = await analyzeResume(file, jobDescription, apiKey);
      onDone?.(res);
    } catch (e) {
      onError?.(e.message || 'Analysis failed');
    }
  };

  const startStream = useCallback(async () => {
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('job_description', jobDescription);

    const headers = {};
    if (apiKey?.trim()) headers['X-Gemini-API-Key'] = apiKey.trim();

    // Use fetch + ReadableStream for SSE (works with POST + FormData)
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    let res;
    try {
      res = await fetch(`${API_BASE}/analyze-stream`, {
        method: 'POST',
        headers,
        body: formData,
        signal: ctrl.signal,
      });
    } catch (err) {
      if (ctrl.signal.aborted) return;
      // Fallback to standard endpoint if SSE fails
      try {
        const fallbackRes = await analyzeResume(file, jobDescription, apiKey);
        onDone?.(fallbackRes);
        return;
      } catch (fallbackErr) {
        onError?.(fallbackErr.message || err.message || 'Connection failed');
        return;
      }
    }

    if (!res.ok) {
      try {
        const fallbackRes = await analyzeResume(file, jobDescription, apiKey);
        onDone?.(fallbackRes);
        return;
      } catch (fallbackErr) {
        onError?.(`Server error: ${res.status}`);
        return;
      }
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // Split on SSE data lines
      const lines = buffer.split('\n\n');
      buffer = lines.pop() || '';

      for (const chunk of lines) {
        const dataLine = chunk.split('\n').find(l => l.startsWith('data: '));
        if (!dataLine) continue;
        let event;
        try { event = JSON.parse(dataLine.slice(6)); } catch { continue; }

        switch (event.type) {
          case 'phase':
            setPhase(event.phase);
            setPhaseLabel(event.label);
            break;

          case 'scan_line':
            if (event.target === 'resume') { setScanResume(true); setTimeout(() => setScanResume(false), 1200); }
            else                           { setScanJd(true);     setTimeout(() => setScanJd(false), 1200); }
            break;

          case 'skill_chip':
            if (event.source === 'resume')
              setResumeChips(c => [...c, { id: uid(), skill: event.skill, domain: event.domain }]);
            else
              setJdChips(c => [...c, { id: uid(), skill: event.skill, domain: event.domain }]);
            break;

          case 'graph_edge':
            setEdges(e => [...e, { id: uid(), ...event }]);
            break;

          case 'match':
            setMatches(m => [...m, { id: uid(), skill: event.skill }]);
            break;

          case 'gap':
            setGaps(g => [...g, { id: uid(), skill: event.skill }]);
            break;

          case 'score_tick':
            setScore(event.value);
            break;

          case 'done':
            resultRef.current = event.result;
            // Short 600ms pause so user can see final score ring before transitioning
            setTimeout(() => {
              onDone?.(event.result);
            }, 600);
            break;

          case 'error':
            onError?.(event.message);
            break;
        }
      }
    }
  }, [file, jobDescription, apiKey, onDone, onError]);

  useEffect(() => {
    startStream();
    return () => abortRef.current?.abort();
  }, [startStream]);

  return (
    <div className="xray-root" aria-live="polite" aria-label="Resume X-Ray Analysis">
      {/* ── Header ── */}
      <div className="xray-header">
        <div className="xray-header-glow" />
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <span className="xray-title-icon text-2xl">🔬</span>
            <span className="font-mono text-xs uppercase tracking-widest text-indigo-400 font-bold">
              Live AI Pipeline
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSkip}
              disabled={isSkipping}
              className="px-3 py-1 text-xs rounded-lg bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-500/40 text-indigo-200 transition-all font-medium cursor-pointer flex items-center gap-1.5 shadow-sm"
              title="Skip live animation and show final report immediately"
            >
              <span>{isSkipping ? 'Loading Report...' : 'Skip to Results ⏭'}</span>
            </button>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="p-1 text-xs rounded-lg bg-slate-800/60 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all cursor-pointer"
                title="Cancel Analysis"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <h2 className="xray-title">
          Resume X-Ray — Live Entity Matching
        </h2>
        <PhaseLabel label={phaseLabel} />
      </div>

      {/* ── Phase 1 & 2: Document cards + skill chips ── */}
      {(phase === 'parsing' || phase === 'resume_skills' || phase === 'jd_skills' ||
        phase === 'graph' || phase === 'matching' || phase === 'scoring') && (
        <div className="xray-docs-row">
          {/* Resume card */}
          <div className={`xray-doc-card ${scanResume ? 'xray-doc-card--scanning' : ''}`}>
            <div className="xray-doc-label">📄 Your Resume</div>
            {scanResume && <div className="xray-scan-line" />}
            <div className="xray-chips-container">
              {resumeChips.map((c, i) => (
                <SkillChip key={c.id} skill={c.skill} domain={c.domain} source="resume"
                  style={{ animationDelay: `${i * 0.04}s` }} />
              ))}
              {resumeChips.length === 0 && (
                <span className="xray-doc-placeholder">Scanning for skills...</span>
              )}
            </div>
          </div>

          {/* VS divider */}
          <div className="xray-vs">
            <div className="xray-vs-line" />
            <span className="xray-vs-text">VS</span>
            <div className="xray-vs-line" />
          </div>

          {/* JD card */}
          <div className={`xray-doc-card ${scanJd ? 'xray-doc-card--scanning' : ''}`}>
            <div className="xray-doc-label">📋 Job Description</div>
            {scanJd && <div className="xray-scan-line" />}
            <div className="xray-chips-container">
              {jdChips.map((c, i) => (
                <SkillChip key={c.id} skill={c.skill} domain={c.domain} source="jd"
                  style={{ animationDelay: `${i * 0.04}s` }} />
              ))}
              {jdChips.length === 0 && (
                <span className="xray-doc-placeholder">Extracting requirements...</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Phase 3: Taxonomy Graph ── */}
      {edges.length > 0 && (
        <div className="xray-section xray-graph-section">
          <div className="xray-section-title">🧬 Knowledge Graph — Skill Alias Resolution</div>
          <div className="xray-edges-list">
            {edges.map(e => <GraphEdge key={e.id} {...e} />)}
          </div>
        </div>
      )}

      {/* ── Phase 4: Matches & Gaps ── */}
      {(matches.length > 0 || gaps.length > 0) && (
        <div className="xray-section xray-match-section">
          <div className="xray-match-columns">
            {/* Matches */}
            <div className="xray-match-col">
              <div className="xray-section-title" style={{ color: '#10b981' }}>
                ✅ Matched Skills ({matches.length})
              </div>
              <div className="xray-match-list">
                {matches.map(m => <MatchRow key={m.id} skill={m.skill} type="match" />)}
              </div>
            </div>

            {/* Score ring */}
            <div className="xray-score-col">
              <ScoreRing value={score} />
              <div className="xray-score-label">
                {score >= 80 ? '🔥 Strong Match!' : score >= 60 ? '⚠️ Good, few gaps' : '🔴 Needs work'}
              </div>
            </div>

            {/* Gaps */}
            <div className="xray-match-col">
              <div className="xray-section-title" style={{ color: '#ef4444' }}>
                ❌ Missing Skills ({gaps.length})
              </div>
              <div className="xray-match-list">
                {gaps.map(g => <MatchRow key={g.id} skill={g.skill} type="gap" />)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Phase 5: Score counter only (before matches appear) ── */}
      {phase === 'scoring' && matches.length === 0 && (
        <div className="xray-scoring-state">
          <ScoreRing value={score} />
          <div className="xray-scoring-label">Computing final score with AI...</div>
        </div>
      )}
    </div>
  );
}
