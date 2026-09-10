"""
Candidate Technical Interview Question Generator Engine.
Generates structured technical probing questions, architecture scenarios,
and behavioral prompts based on candidate skill alignments, omissions, and weaknesses.
"""

from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict


@dataclass
class InterviewQuestion:
    """Represents a single targeted interview prompt with evaluation criteria."""
    skill: str
    category: str  # "SkillGapProbe" | "CoreCompetencyValidation" | "SystemDesign" | "Behavioral"
    question: str
    difficulty: str  # "Junior" | "Mid-Level" | "Senior" | "Lead"
    rationale: str
    expected_answer_points: List[str]

    def to_dict(self) -> Dict[str, Any]:
        return asdict(self)


# Authoritative question bank keyed by canonical skill or domain archetype
SKILL_QUESTION_BANK: Dict[str, Dict[str, Any]] = {
    "python": {
        "validation": "How does Python's GIL (Global Interpreter Lock) impact CPU-bound vs I/O-bound concurrency, and how would you bypass it using multiprocessing or asyncio?",
        "gap_probe": "Explain the Python object model and memory management (reference counting vs cyclic garbage collector). How would you profile a memory leak in a production service?",
        "difficulty": "Senior",
        "answer_points": [
            "GIL prevents multiple native threads from executing Python bytecodes at once",
            "I/O-bound tasks release GIL during system calls; asyncio utilizes cooperative event loop",
            "CPU-bound tasks require multiprocessing or C-extensions to achieve true parallelism",
            "tracemalloc or objgraph for profiling memory leaks"
        ]
    },
    "fastapi": {
        "validation": "How does FastAPI leverage Pydantic and Starlette under the hood for asynchronous request processing, and how do you implement custom dependency injection scopes?",
        "gap_probe": "What are the trade-offs between `def` and `async def` route handlers in FastAPI, especially regarding Starlette's threadpool execution?",
        "difficulty": "Senior",
        "answer_points": [
            "FastAPI runs synchronous def endpoints in an AnyIO worker threadpool to avoid blocking event loop",
            "async def runs directly on main event loop; blocking calls inside async def freeze the server",
            "Dependency injection via Depends() supports caching and sub-dependencies"
        ]
    },
    "docker": {
        "validation": "Walk through how you design multi-stage Dockerfiles to minimize image size and eliminate build toolchains from production containers.",
        "gap_probe": "What is the difference between Docker bridge and host networking, and how do container cgroups and namespaces isolate kernel resources?",
        "difficulty": "Senior",
        "answer_points": [
            "Multi-stage builds separate build dependencies (compilers, dev packages) from slim runtime",
            "PID, mount, network namespaces isolate processes; cgroups enforce CPU and memory limits",
            "Using non-root USER directive inside container to adhere to security least-privilege"
        ]
    },
    "kubernetes": {
        "validation": "Explain how Kubernetes handles rolling deployments with readiness and liveness probes. What happens when a readiness probe fails under heavy traffic?",
        "gap_probe": "Describe the architecture of Kubernetes control plane components (etcd, kube-scheduler, kube-apiserver, kube-controller-manager) and how node kubelets communicate.",
        "difficulty": "Lead",
        "answer_points": [
            "Failing readiness probe pulls pod from Service Endpoints, stopping traffic without killing pod",
            "Failing liveness probe triggers container restart via kubelet",
            "etcd stores authoritative state; apiserver validates and coordinates all cluster operations"
        ]
    },
    "postgresql": {
        "validation": "How would you diagnose and optimize a slow query in PostgreSQL using EXPLAIN ANALYZE, and when would you choose a GIN index over a B-tree index?",
        "gap_probe": "Explain MVCC (Multi-Version Concurrency Control) in PostgreSQL and the operational impact of autovacuum and table bloat.",
        "difficulty": "Senior",
        "answer_points": [
            "EXPLAIN ANALYZE reveals actual execution time, sequential scans vs index scans, and row estimates",
            "GIN index is optimized for composite items (JSONB, full-text search, arrays); B-tree for scalar comparisons",
            "MVCC writes new row versions on UPDATE; autovacuum cleans dead tuples to prevent table bloat"
        ]
    },
    "redis": {
        "validation": "How do you implement a distributed lock with TTL and idempotency in Redis, and what pitfalls arise when node failover occurs?",
        "gap_probe": "Explain Redis memory eviction policies (LRU, LFU, volatile vs allkeys) and how Redis persistence (RDB snapshots vs AOF) affects latency.",
        "difficulty": "Senior",
        "answer_points": [
            "SET key uuid NX PX 30000 ensures atomic lock acquisition with TTL",
            "Redlock algorithm or Lua scripts ensure safe lock release by validating ownership token",
            "AOF provides high durability but adds disk I/O overhead; RDB provides fast restarts"
        ]
    },
    "aws": {
        "validation": "How do you design a high-availability, multi-AZ VPC architecture with private subnets, NAT gateways, and least-privilege IAM roles for ECS or EKS workloads?",
        "gap_probe": "Compare S3 storage tiers and explain how lifecycle policies, cross-region replication, and KMS envelope encryption protect data at rest.",
        "difficulty": "Senior",
        "answer_points": [
            "VPC spans 2+ AZs; public subnets hold ALBs/NAT Gateways, private subnets hold application instances",
            "IAM roles attached to tasks/pods (IRSA) rather than static long-lived credentials",
            "KMS uses Customer Master Keys to generate ephemeral data encryption keys (envelope encryption)"
        ]
    },
    "react": {
        "validation": "Explain the React 18 Concurrent Renderer, automatic batching, and how `useTransition` / `useDeferredValue` prevent UI blocking during expensive renders.",
        "gap_probe": "How does the virtual DOM reconciliation algorithm (Fiber) work, and how do keys prevent unnecessary DOM node recreation?",
        "difficulty": "Senior",
        "answer_points": [
            "Concurrent features allow React to interrupt, pause, or abandon render passes for urgent user inputs",
            "Fiber tree structure enables incremental rendering and prioritization of updates",
            "Keys provide stable identity across renders to allow fine-grained reconciliation diffs"
        ]
    },
    "typescript": {
        "validation": "How do conditional types, template literal types, and mapped types allow you to build strongly-typed API client SDKs without any runtime overhead?",
        "gap_probe": "Explain structural typing versus nominal typing, and how TypeScript's type narrowing with discriminated unions ensures type safety.",
        "difficulty": "Senior",
        "answer_points": [
            "TypeScript uses structural subtyping ('duck typing'); shape determines compatibility",
            "Discriminated unions with a common literal tag field enable exhaustive compile-time switches",
            "All TypeScript types compile away to zero runtime JavaScript overhead"
        ]
    },
    "machine learning": {
        "validation": "How do you prevent data leakage during feature preprocessing in a cross-validation pipeline, and what metrics would you choose for an imbalanced classification problem?",
        "gap_probe": "Explain the bias-variance trade-off and how regularization (L1 Lasso vs L2 Ridge) affects weight sparsity and collinearity.",
        "difficulty": "Senior",
        "answer_points": [
            "Fit scalers/imputers strictly on training folds inside Pipeline objects, never globally",
            "Accuracy is misleading for imbalanced classes; use PR-AUC, F1-score, Precision@K, or Cohen's Kappa",
            "L1 drives coefficients to absolute zero (feature selection); L2 shrinks weights smoothly"
        ]
    }
}


class InterviewGeneratorService:
    """
    Generates tailored interview kits with targeted technical, architectural,
    and behavioral prompts matching the candidate's exact profile.
    """

    def __init__(self):
        self.question_bank = SKILL_QUESTION_BANK

    def _assess_candidate_level(
        self, matched_skills: List[str], score: Optional[int] = None
    ) -> str:
        """Determines estimated engineering seniority archetype."""
        count = len(matched_skills)
        sc = score or 0

        if count >= 12 or sc >= 85:
            return "Staff / Principal Engineer"
        elif count >= 7 or sc >= 70:
            return "Senior Software Engineer"
        elif count >= 4 or sc >= 50:
            return "Mid-Level Software Engineer"
        else:
            return "Associate / Junior Software Engineer"

    def generate_interview_kit(
        self,
        matched_skills: List[str],
        missing_skills: List[str],
        weaknesses: Optional[List[str]] = None,
        score: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Builds a comprehensive, actionable interview package for hiring panels.
        """
        candidate_level = self._assess_candidate_level(matched_skills, score)
        questions: List[InterviewQuestion] = []

        # 1. Generate Probing Questions for Critical Missing Skills (Skill Gap Probes)
        for skill in missing_skills[:4]:
            key = skill.strip().lower()
            if key in self.question_bank:
                info = self.question_bank[key]
                questions.append(
                    InterviewQuestion(
                        skill=skill,
                        category="SkillGapProbe",
                        question=info["gap_probe"],
                        difficulty=info["difficulty"],
                        rationale=f"Candidate lacked '{skill}' in initial audit. Probing theoretical and conceptual grasp.",
                        expected_answer_points=info["answer_points"]
                    )
                )
            else:
                # Generic fallback for uncataloged missing skills
                questions.append(
                    InterviewQuestion(
                        skill=skill,
                        category="SkillGapProbe",
                        question=f"The job requires hands-on proficiency with {skill}. Can you describe any equivalent technologies or how you would ramp up on {skill} within your first 30 days?",
                        difficulty="Mid-Level",
                        rationale=f"Evaluates adaptability and transferable knowledge for missing skill '{skill}'.",
                        expected_answer_points=[
                            "Demonstrates awareness of core architecture and use cases",
                            "Cites analogous tools or frameworks previously mastered",
                            "Outlines clear structured learning plan"
                        ]
                    )
                )

        # 2. Generate In-Depth Validation Questions for Matched Skills (Core Competency)
        for skill in matched_skills[:4]:
            key = skill.strip().lower()
            if key in self.question_bank:
                info = self.question_bank[key]
                questions.append(
                    InterviewQuestion(
                        skill=skill,
                        category="CoreCompetencyValidation",
                        question=info["validation"],
                        difficulty=info["difficulty"],
                        rationale=f"Validating practical depth for candidate's claimed strength in '{skill}'.",
                        expected_answer_points=info["answer_points"]
                    )
                )
            else:
                questions.append(
                    InterviewQuestion(
                        skill=skill,
                        category="CoreCompetencyValidation",
                        question=f"You have listed {skill} as a core competency. Describe the most complex production issue or performance bottleneck you encountered using {skill} and how you resolved it.",
                        difficulty="Senior",
                        rationale=f"Validates real-world engineering ownership and troubleshooting with '{skill}'.",
                        expected_answer_points=[
                            "Specific root-cause diagnosis using telemetry or profiling",
                            "Concrete architectural or code-level fix implemented",
                            "Measurable impact on latency, throughput, or reliability"
                        ]
                    )
                )

        # 3. Tailored System Design & Behavioral Prompts
        system_design_prompts = [
            {
                "title": "Scalable Microservice Rate Limiter & Caching Layer",
                "scenario": "Design a resilient distributed rate limiter and multi-tier cache to protect backend APIs serving 50k RPS. How do you handle sudden redis outages and cache stampedes?",
                "focus_areas": ["Token bucket algorithm", "Redis cluster failover", "Probabilistic early expiration", "Circuit breakers"]
            },
            {
                "title": "Zero-Downtime Data Migration Architecture",
                "scenario": "The team needs to migrate a critical table with 100M rows to a new schema without taking any service downtime. Walk through the dual-write and backfill strategy.",
                "focus_areas": ["Dual writing", "Idempotent backfilling", "Data validation checksums", "Rollback mechanisms"]
            }
        ]

        behavioral_prompts = [
            {
                "prompt": "Tell me about a high-severity production outage or critical bug you were responsible for resolving under high pressure. What was the root cause and how did you prevent recurrence?",
                "evaluation_criteria": "Blameless post-mortem mindset, communication under pressure, permanent engineering safeguards"
            },
            {
                "prompt": "Describe a scenario where you strongly disagreed with a senior engineer or product manager on a technical architecture trade-off. How did you handle it?",
                "evaluation_criteria": "Objective data-driven arguments, respectful technical compromise, alignment with business goals"
            }
        ]

        return {
            "candidate_assessment": {
                "seniority_tier": candidate_level,
                "matched_skills_count": len(matched_skills),
                "missing_skills_count": len(missing_skills),
                "overall_fit_score": score or 0
            },
            "total_questions": len(questions) + len(system_design_prompts) + len(behavioral_prompts),
            "technical_questions": [q.to_dict() for q in questions],
            "system_design_prompts": system_design_prompts,
            "behavioral_prompts": behavioral_prompts,
            "interview_guidelines": [
                "Probe for specific metrics and trade-offs rather than generic definitions.",
                "Use missing-skill questions to assess learning velocity and engineering fundamentals.",
                "Verify whether claimed achievements match technical depth in validation questions."
            ]
        }


# Singleton accessor
_interview_gen_instance: Optional[InterviewGeneratorService] = None


def get_interview_generator() -> InterviewGeneratorService:
    """Returns singleton InterviewGeneratorService instance."""
    global _interview_gen_instance
    if _interview_gen_instance is None:
        _interview_gen_instance = InterviewGeneratorService()
    return _interview_gen_instance
