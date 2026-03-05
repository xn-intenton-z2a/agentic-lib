# Mission Benchmark Report

## Purpose

Track pipeline performance across different missions and LLM models. Each run starts with `init --purge` on repository0 and observes the pipeline until mission accomplished or timeout.

## Run 1: hamming-distance / gpt-5-mini / continuous

| Parameter | Value |
|-----------|-------|
| Mission | hamming-distance (L0 kata) |
| Model | gpt-5-mini (default) |
| Schedule | continuous (*/15 cron) |
| agentic-lib | 7.1.46 |
| Start | 2026-03-05T00:11Z |
| Init run | [#527](https://github.com/xn-intenton-z2a/repository0/actions/runs/22695724027) |
| Init PR | [#2499](https://github.com/xn-intenton-z2a/repository0/pull/2499) |

### Observations

- **00:11** — Init dispatched with `mode=purge schedule=continuous`
- **00:12** — Init PR #2499 created, automerge triggered
- **00:12:01** — Automerge completed. Multiple supervisors fired concurrently (5 supervisors in 30s)
- **00:12:17–00:12:46** — 5 supervisor runs, concurrent reviews cancelled each other
- **00:13** — Flow stabilised: supervisor → transform → review chain completed successfully
- **00:13** — 5 open issues created (#2500-#2504) — all about plot-code-lib (stale context from pre-purge state)
- Waiting for next supervisor cycle to see if it creates hamming-distance issues and works on those

### Issues

| # | Title | Labels | Notes |
|---|-------|--------|-------|
| 2500 | Implement CLI expression parser... | automated, ready | Stale (plot-code-lib) |
| 2501 | Add CLI example... | automated | Stale (plot-code-lib) |
| 2502 | Implement CLI expression parsing... | automated | Stale (plot-code-lib) |
| 2503 | Implement CLI expression parsing... | automated, ready | Stale (plot-code-lib) |
| 2504 | Implement PNG export... | automated | Stale (plot-code-lib) |

### Timeline

_Updating as cycles complete..._

## Planned Runs

| # | Mission | Model | Schedule | Status |
|---|---------|-------|----------|--------|
| 1 | hamming-distance | gpt-5-mini | continuous | **In progress** |
| 2 | hamming-distance | claude-sonnet-4 | continuous | Pending |
| 3 | hamming-distance | gpt-4.1 | continuous | Pending |
