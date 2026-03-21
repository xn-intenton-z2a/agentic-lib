#!/usr/bin/env bash
# SPDX-License-Identifier: GPL-3.0-only
# Copyright (C) 2025-2026 Polycode Limited
# scripts/all-repositories-benchmarks-advanced.sh — Run ITERATION_BENCHMARKS_ADVANCED.md scenarios.
# Dispatches agentic-lib-flow which runs: update → init → (test + bot + N×workflow) × rounds → verify → report.
#
# Scenario matrix (from ITERATION_BENCHMARKS_ADVANCED.md):
#   A1: repository0               — 4-kyu-apply-cron-engine          / med
#   A2: repository0-string-utils  — 5-kyu-apply-string-utils         / max
#   A3: repository0-dense-encoder — 4-kyu-apply-dense-encoding       / max
#   A4: repository0-random        — 3-kyu-analyze-lunar-lander       / max
#   A5: repository0-crucible      — 2-kyu-create-markdown-compiler   / max
#   A6: repository0-plot-code-lib — 2-kyu-create-plot-code-lib       / max
#
# agentic-lib-flow workflow_dispatch inputs:
#   mode, mission-seed, model, profile, workflow-runs, schedule,
#   dry-run, message, config-path, generate-report
#

# Common parameters
mode=purge
schedule=off
workflow_runs=8
skipMaintain=false
create_seed_issues=false
generate_report=true

# A1: repository0 — cron-engine / med (target: 3 runs)
date
time gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0 \
  -f mode=${mode?} -f schedule=${schedule?} -f workflow-runs=${workflow_runs?} \
  -f skipMaintain=${skipMaintain} -f create-seed-issues=${create_seed_issues?} -f generate-report=${generate_report?} \
  -f mission-seed=4-kyu-apply-cron-engine -f model=gpt-5-mini -f profile=med

# A2: repository0-string-utils — string-utils / max (target: 3 runs)
date
time gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0-string-utils \
  -f mode=${mode?} -f schedule=${schedule?} -f workflow-runs=${workflow_runs?} \
  -f skipMaintain=${skipMaintain} -f create-seed-issues=${create_seed_issues?} -f generate-report=${generate_report?} \
  -f mission-seed=5-kyu-apply-string-utils -f model=gpt-5-mini -f profile=max

# A3: repository0-dense-encoder — dense-encoding / max (target: 3 runs)
date
time gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0-dense-encoder \
  -f mode=${mode?} -f schedule=${schedule?} -f workflow-runs=${workflow_runs?} \
  -f skipMaintain=${skipMaintain} -f create-seed-issues=${create_seed_issues?} -f generate-report=${generate_report?} \
  -f mission-seed=4-kyu-apply-dense-encoding -f model=gpt-5-mini -f profile=max

# A4: repository0-random — lunar-lander / max (target: 5 runs)
date
time gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0-random \
  -f mode=${mode?} -f schedule=${schedule?} -f workflow-runs=${workflow_runs?} \
  -f skipMaintain=${skipMaintain} -f create-seed-issues=${create_seed_issues?} -f generate-report=${generate_report?} \
  -f mission-seed=3-kyu-analyze-lunar-lander -f model=gpt-5-mini -f profile=max

# A5: repository0-crucible — markdown-compiler / max (target: 5 runs)
date
time gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0-crucible \
  -f mode=${mode?} -f schedule=${schedule?} -f workflow-runs=${workflow_runs?} \
  -f skipMaintain=${skipMaintain} -f create-seed-issues=${create_seed_issues?} -f generate-report=${generate_report?} \
  -f mission-seed=2-kyu-create-markdown-compiler -f model=gpt-5-mini -f profile=max

# A6: repository0-plot-code-lib — plot-code-lib / max (target: 5 runs)
date
time gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0-plot-code-lib \
  -f mode=${mode?} -f schedule=${schedule?} -f workflow-runs=${workflow_runs?} \
  -f skipMaintain=${skipMaintain} -f create-seed-issues=${create_seed_issues?} -f generate-report=${generate_report?} \
  -f mission-seed=2-kyu-create-plot-code-lib -f model=gpt-5-mini -f profile=max
