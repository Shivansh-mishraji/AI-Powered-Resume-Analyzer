"""
AI Resume Analyzer - QA Test Runner
------------------------------------
Author  : Vishal Patel (@patelvishal-ji)
Role    : Testing & Quality Assurance

HOW TO USE:
    Run this script from the project root:
        python testing/run_tests.py

    It will:
    1. Run ALL automated tests in backend/tests/
    2. Save a clean, readable report in testing/reports/
    3. Print a summary in the terminal

WHY WE DO THIS:
    Every test run is permanently saved as a log file.
    This gives us a full audit trail of our testing history,
    so we can prove to anyone what was tested, when, and what passed or failed.
"""

import subprocess
import sys
import os
import re
from datetime import datetime


# ── Config ──────────────────────────────────────────────────────────────────

BACKEND_DIR = os.path.join(os.path.dirname(__file__), "..", "backend")
REPORTS_DIR = os.path.join(os.path.dirname(__file__), "reports")
os.makedirs(REPORTS_DIR, exist_ok=True)


# ── Run pytest ───────────────────────────────────────────────────────────────

def run_tests():
    """Run pytest with verbose output and capture results."""
    result = subprocess.run(
        [sys.executable, "-m", "pytest", "tests/", "-v", "--tb=short", "--no-header"],
        cwd=BACKEND_DIR,
        capture_output=True,
        text=True
    )
    return result


# ── Parse Results ────────────────────────────────────────────────────────────

def parse_results(output):
    """Parse pytest output into structured test results."""
    lines = output.strip().split("\n")
    tests = []
    errors = {}
    current_failed_test = None

    for i, line in enumerate(lines):
        # Match test result lines e.g. "tests/test_main.py::test_health_check PASSED"
        match = re.match(r"(tests/[\w/]+\.py)::([\w]+)\s+(PASSED|FAILED|ERROR|SKIPPED)", line)
        if match:
            file_name = match.group(1).replace("tests/", "").replace(".py", "")
            test_name = match.group(2)
            status    = match.group(3)
            tests.append({
                "file": file_name,
                "name": test_name,
                "status": status
            })
            if status in ("FAILED", "ERROR"):
                current_failed_test = f"{match.group(1)}::{test_name}"
                errors[current_failed_test] = []

    # Extract error details (short traceback section)
    in_failures_block = False
    current_key = None
    for line in lines:
        if line.startswith("FAILED") or line.startswith("ERROR"):
            for key in errors:
                if key.split("::")[-1] in line:
                    current_key = key
        if line.strip().startswith("_ _ _") or line.strip().startswith("E "):
            in_failures_block = True
        if in_failures_block and current_key:
            errors[current_key].append(line)

    # Parse summary line
    summary_line = ""
    for line in reversed(lines):
        if "passed" in line or "failed" in line or "error" in line:
            summary_line = line.strip()
            break

    return tests, errors, summary_line


# ── Generate Markdown Report ─────────────────────────────────────────────────

def generate_report(tests, errors, summary_line, raw_output, return_code):
    """Generate a narrative, human-readable test report."""
    now        = datetime.now()
    file_stamp = now.strftime("%Y-%m-%d_%H-%M")

    # Human-readable date: "Aug 23 at 7:34 PM"
    human_date = now.strftime("%b %-d at %-I:%M %p") if os.name != "nt" \
                 else now.strftime("%b {d} at {t}").format(
                     d=str(now.day), t=now.strftime("%I:%M %p").lstrip("0"))

    passed  = [t for t in tests if t["status"] == "PASSED"]
    failed  = [t for t in tests if t["status"] in ("FAILED", "ERROR")]
    total   = len(tests)

    lines = []

    # ── Story-style opening ──────────────────────────────────────────────────
    if return_code == 0:
        headline = f"On {human_date}, we ran {total} tests. All {total} passed. Safe to commit."
    else:
        headline = (f"On {human_date}, we ran {total} tests. "
                    f"{len(failed)} failed. "
                    f"Here's exactly what broke, what the error was, and how we fixed it.")

    lines.append("# Test Run Log")
    lines.append("")
    lines.append(f"**{headline}**")
    lines.append("")
    lines.append(f"- **Run by:** Vishal Patel (@patelvishal-ji) — QA & Testing")
    lines.append(f"- **Project:** AI-Powered Resume Analyzer")
    lines.append(f"- **Environment:** Python 3.13 · pytest · FastAPI TestClient")
    lines.append("")
    lines.append("---")
    lines.append("")

    # ── Score card ──────────────────────────────────────────────────────────
    lines.append("## The Numbers")
    lines.append("")
    lines.append(f"| | Count |")
    lines.append(f"|---|---|")
    lines.append(f"| Passed | {len(passed)} |")
    lines.append(f"| Failed | {len(failed)} |")
    lines.append(f"| Total  | {total} |")
    lines.append("")

    if return_code == 0:
        lines.append("> **Result: Everything is green. This code is tested and verified.**")
    else:
        lines.append(f"> **Result: {len(failed)} test(s) failed. Do NOT commit until fixed.**")
    lines.append("")
    lines.append("---")
    lines.append("")

    # ── What passed ─────────────────────────────────────────────────────────
    lines.append("## What Passed")
    lines.append("")
    lines.append("Every one of these tests confirmed the code is doing exactly what it should:")
    lines.append("")
    for t in passed:
        human_name = t["name"].replace("test_", "").replace("_", " ").capitalize()
        lines.append(f"- **{human_name}** — `{t['file']}.py`")
    lines.append("")
    lines.append("---")
    lines.append("")

    # ── What failed (only shown if there are failures) ───────────────────────
    if failed:
        lines.append("## What Failed — And What We Did About It")
        lines.append("")
        lines.append("These are the tests that caught real bugs in our code.")
        lines.append("Each one is documented with the exact error, root cause, and the fix.")
        lines.append("")

        for t in failed:
            human_name = t["name"].replace("test_", "").replace("_", " ").capitalize()
            test_key   = f"{t['file']}::{t['name']}"
            err_lines  = errors.get(test_key, [])

            lines.append(f"### {human_name}")
            lines.append("")
            lines.append(f"**Test file:** `{t['file']}.py`  ")
            lines.append(f"**Status:** FAILED")
            lines.append("")
            lines.append("**What the error said:**")
            lines.append("```")
            lines.append("\n".join(err_lines[:12]) if err_lines else "No traceback captured — check raw output below.")
            lines.append("```")
            lines.append("")
            lines.append("**Root Cause:** _Fill in — what was wrong in the code?_")
            lines.append("")
            lines.append("**Fix Applied:** _Fill in — what was changed, and in which file?_")
            lines.append("")
            lines.append("**Fixed by:** _Fill in — team member name_")
            lines.append("")

        lines.append("---")
        lines.append("")

    # ── Raw output (collapsed) ───────────────────────────────────────────────
    lines.append("## Full Raw Output")
    lines.append("")
    lines.append("<details>")
    lines.append("<summary>Click to expand full pytest terminal output</summary>")
    lines.append("")
    lines.append("```")
    lines.append(raw_output[:3000] if len(raw_output) > 3000 else raw_output)
    lines.append("```")
    lines.append("")
    lines.append("</details>")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("*Auto-generated by `testing/run_tests.py`*")
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("*Report auto-generated by `testing/run_tests.py`*")

    content   = "\n".join(lines)
    file_name = f"test_log_{file_stamp}.md"
    file_path = os.path.join(REPORTS_DIR, file_name)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

    return file_path, file_name


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    print("=" * 60)
    print("  AI Resume Analyzer - QA Test Runner")
    print("  Triggered by: Vishal Patel (@patelvishal-ji)")
    print("=" * 60)
    print()
    print(">> Running all test cases in backend/tests/ ...")
    print()

    result       = run_tests()
    raw_output   = result.stdout + result.stderr
    tests, errors, summary_line = parse_results(result.stdout)

    file_path, file_name = generate_report(
        tests, errors, summary_line, raw_output, result.returncode
    )

    # Terminal Summary
    passed_count = len([t for t in tests if t["status"] == "PASSED"])
    failed_count = len([t for t in tests if t["status"] in ("FAILED", "ERROR")])

    print(raw_output)
    print()
    print("=" * 60)
    print(f"  ✅ Passed : {passed_count}")
    print(f"  ❌ Failed : {failed_count}")
    print(f"  📄 Report : testing/reports/{file_name}")
    print("=" * 60)

    if result.returncode == 0:
        print("\n  🏆 ALL TESTS PASSED — Safe to commit and push!\n")
    else:
        print("\n  ⛔ TESTS FAILED — Do NOT commit until all tests pass!\n")

    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
