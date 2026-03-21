#!/usr/bin/env bash
# SPDX-License-Identifier: GPL-3.0-only
# Copyright (C) 2025-2026 Polycode Limited
# scripts/all-repositories-benchmarks-simple.sh — Run ITERATION_BENCHMARKS_SIMPLE.md scenarios.
# Dispatches agentic-lib-flow which runs: update → init → (test + bot + N×workflow) × rounds → verify → report.
#
# Scenario matrix (from ITERATION_BENCHMARKS_SIMPLE.md):
#   S1: repository0               — 7-kyu-understand-fizz-buzz       / min
#   S2: repository0-string-utils  — 5-kyu-apply-string-utils         / med
#   S3: repository0-dense-encoder — 6-kyu-understand-hamming-distance / min
#   S4: repository0-random        — 6-kyu-understand-hamming-distance / med
#   S5: repository0-crucible      — 6-kyu-understand-roman-numerals   / med
#   S6: repository0-plot-code-lib — 6-kyu-understand-roman-numerals   / max
#
# agentic-lib-flow workflow_dispatch inputs:
#   mode, mission-seed, model, profile, workflow-runs, schedule,
#   dry-run, message, config-path, generate-report
#

# Common parameters
mode=purge
schedule=off
model=gpt-5-mini
workflow_runs=4

# S1: repository0 — fizz-buzz / min (target: 1 run)
date
time gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0 \
  -f mission-seed=7-kyu-understand-fizz-buzz \
  -f mode=${mode?} -f schedule=${schedule?} -f model=${model?} -f generate-report=true -f profile=min -f workflow-runs=${workflow_runs?}

# S2: repository0-string-utils — string-utils / med (target: 3 runs)
date
time gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0-string-utils \
  -f mission-seed=5-kyu-apply-string-utils \
  -f mode=${mode?} -f schedule=${schedule?} -f model=${model?} -f generate-report=true -f profile=med -f workflow-runs=${workflow_runs?}

# S3: repository0-dense-encoder — hamming-distance / min (target: 1 run)
date
time gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0-dense-encoder \
  -f mission-seed=6-kyu-understand-hamming-distance \
  -f mode=${mode?} -f schedule=${schedule?} -f model=${model?} -f generate-report=true -f profile=min -f workflow-runs=${workflow_runs?}

# S4: repository0-random — hamming-distance / med (target: 1 run)
date
time gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0-random \
  -f mission-seed=6-kyu-understand-hamming-distance \
  -f mode=${mode?} -f schedule=${schedule?} -f model=${model?} -f generate-report=true -f profile=med -f workflow-runs=${workflow_runs?}

# S5: repository0-crucible — roman-numerals / med (target: 1 run)
date
time gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0-crucible \
  -f mission-seed=6-kyu-understand-roman-numerals \
  -f mode=${mode?} -f schedule=${schedule?} -f model=${model?} -f generate-report=true -f profile=med -f workflow-runs=${workflow_runs?}

# S6: repository0-plot-code-lib — roman-numerals / max (target: 1 run)
date
time gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0-plot-code-lib \
  -f mission-seed=6-kyu-understand-roman-numerals \
  -f mode=${mode?} -f schedule=${schedule?} -f model=${model?} -f generate-report=true -f profile=max -f workflow-runs=${workflow_runs?}
