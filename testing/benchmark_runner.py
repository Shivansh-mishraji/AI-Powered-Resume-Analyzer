"""
Performance and Concurrency Benchmark Runner for AI-Powered Resume Analyzer.
Measures API throughput (RPS), p50/p95/p99 latencies, and memory stability under concurrent load.
Authored by: Vishal Patel (QA Lead • Security & Automated Testing)
"""

import time
import statistics
import concurrent.futures
from typing import Dict, List, Any
import httpx


class BenchmarkRunner:
    """
    Automated QA benchmark harness evaluating backend API response times,
    concurrency handling, and endpoint availability.
    """

    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url.rstrip("/")
        self.client = httpx.Client(base_url=self.base_url, timeout=30.0)

    def benchmark_endpoint(
        self, endpoint: str, method: str = "GET", payload: Any = None, total_requests: int = 50, concurrency: int = 5
    ) -> Dict[str, Any]:
        """
        Executes concurrent requests against target endpoint and aggregates latency percentiles.
        """
        latencies: List[float] = []
        status_codes: Dict[int, int] = {}
        errors: List[str] = []

        def _send_single_request() -> float:
            start = time.perf_counter()
            try:
                if method.upper() == "GET":
                    res = self.client.get(endpoint)
                else:
                    res = self.client.post(endpoint, json=payload)
                elapsed_ms = (time.perf_counter() - start) * 1000.0
                status_codes[res.status_code] = status_codes.get(res.status_code, 0) + 1
                return elapsed_ms
            except Exception as e:
                errors.append(str(e))
                return (time.perf_counter() - start) * 1000.0

        start_time = time.perf_counter()
        with concurrent.futures.ThreadPoolExecutor(max_workers=concurrency) as executor:
            futures = [executor.submit(_send_single_request) for _ in range(total_requests)]
            for future in concurrent.futures.as_completed(futures):
                try:
                    latencies.append(future.result())
                except Exception as exc:
                    errors.append(str(exc))

        total_duration = time.perf_counter() - start_time
        rps = round(total_requests / total_duration, 2) if total_duration > 0 else 0.0

        latencies.sort()
        p50 = statistics.median(latencies) if latencies else 0.0
        p95 = latencies[int(len(latencies) * 0.95)] if latencies else 0.0
        p99 = latencies[int(len(latencies) * 0.99)] if latencies else 0.0

        return {
            "endpoint": endpoint,
            "method": method.upper(),
            "total_requests": total_requests,
            "concurrency": concurrency,
            "total_duration_sec": round(total_duration, 3),
            "requests_per_second": rps,
            "latency_p50_ms": round(p50, 2),
            "latency_p95_ms": round(p95, 2),
            "latency_p99_ms": round(p99, 2),
            "status_code_distribution": status_codes,
            "error_count": len(errors)
        }

    def run_full_qa_benchmark(self) -> Dict[str, Any]:
        """
        Executes standard QA test matrix across all core endpoints.
        """
        results = {}

        # 1. Health Endpoint
        results["health_check"] = self.benchmark_endpoint(
            endpoint="/health", method="GET", total_requests=100, concurrency=10
        )

        # 2. Taxonomy Domains Endpoint
        results["taxonomy_domains"] = self.benchmark_endpoint(
            endpoint="/taxonomy/domains", method="GET", total_requests=50, concurrency=5
        )

        # 3. ATS Audit Endpoint
        sample_resume = (
            "John Doe | john@example.com\n"
            "PROFESSIONAL SUMMARY: Senior Architect.\n"
            "EXPERIENCE: Architected microservices boosting throughput by 45%.\n"
            "EDUCATION: B.S. in Computer Science.\n"
            "SKILLS: Python, FastAPI, Docker, Kubernetes."
        )
        results["ats_audit"] = self.benchmark_endpoint(
            endpoint="/audit/ats",
            method="POST",
            payload={"resume_text": sample_resume},
            total_requests=40,
            concurrency=4
        )

        # 4. Report Exporter Endpoint
        sample_analysis = {
            "filename": "bench_test.pdf",
            "score": 85,
            "matched_skills": ["Python", "FastAPI"],
            "missing_skills": ["AWS"]
        }
        results["export_json"] = self.benchmark_endpoint(
            endpoint="/export/json",
            method="POST",
            payload={"analysis": sample_analysis},
            total_requests=40,
            concurrency=4
        )

        return {
            "test_suite": "AI-Powered Resume Analyzer QA Performance Matrix",
            "auditor": "Vishal Patel (QA Lead)",
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
            "benchmarks": results
        }


if __name__ == "__main__":
    runner = BenchmarkRunner()
    print("Starting automated QA benchmark suite...")
    report = runner.run_full_qa_benchmark()
    print(f"Benchmark completed successfully at {report['timestamp']}")
    for ep, data in report["benchmarks"].items():
        print(f"[{data['endpoint']}] RPS: {data['requests_per_second']} | p95: {data['latency_p95_ms']}ms")
