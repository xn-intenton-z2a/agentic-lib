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
model=gpt-5-mini
workflow_runs=8

# A1: repository0 — cron-engine / med (target: 3 runs)
gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0 \
  -f mission-seed=4-kyu-apply-cron-engine \
  -f mode=${mode?} -f schedule=${schedule?} -f model=${model?} -f generate-report=true -f profile=med -f workflow-runs=${workflow_runs?}

# A2: repository0-string-utils — string-utils / max (target: 3 runs)
gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0-string-utils \
  -f mission-seed=5-kyu-apply-string-utils \
  -f mode=${mode?} -f schedule=${schedule?} -f model=${model?} -f generate-report=true -f profile=max -f workflow-runs=${workflow_runs?}

# A3: repository0-dense-encoder — dense-encoding / max (target: 3 runs)
gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0-dense-encoder \
  -f mission-seed=4-kyu-apply-dense-encoding \
  -f mode=${mode?} -f schedule=${schedule?} -f model=${model?} -f generate-report=true -f profile=max -f workflow-runs=${workflow_runs?}

# A4: repository0-random — lunar-lander / max (target: 5 runs)
gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0-random \
  -f mission-seed=3-kyu-analyze-lunar-lander \
  -f mode=${mode?} -f schedule=${schedule?} -f model=${model?} -f generate-report=true -f profile=max -f workflow-runs=${workflow_runs?}

# A5: repository0-crucible — markdown-compiler / max (target: 5 runs)
gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0-crucible \
  -f mission-seed=2-kyu-create-markdown-compiler \
  -f mode=${mode?} -f schedule=${schedule?} -f model=${model?} -f generate-report=true -f profile=max -f workflow-runs=${workflow_runs?}

# A6: repository0-plot-code-lib — plot-code-lib / max (target: 5 runs)
gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0-plot-code-lib \
  -f mission-seed=2-kyu-create-plot-code-lib \
  -f mode=${mode?} -f schedule=${schedule?} -f model=${model?} -f generate-report=true -f profile=max -f workflow-runs=${workflow_runs?}
