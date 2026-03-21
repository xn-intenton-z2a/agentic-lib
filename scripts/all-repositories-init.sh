#!/usr/bin/env bash
# SPDX-License-Identifier: GPL-3.0-only
# Copyright (C) 2025-2026 Polycode Limited
# scripts/init-all.sh — Initialize all agentic-lib repos by running the init workflow with purge mode and create-seed-issues=true.
#

# Execution parameters for all repositories
mode=purge
schedule=hourly
model=gpt-5-mini
profile=max
create_seed_issues=true
run_workflow=true

# Run the workflow for each repository with the specified parameters
gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0               -f mission-seed=7-kyu-understand-fizz-buzz -f mode=${mode?} -f schedule=${schedule?} -f model=${model?} -f profile=${profile?} -f create-seed-issues=${create_seed_issues?} -f run-workflow=${run_workflow?}
gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0-string-utils  -f mission-seed=5-kyu-apply-string-utils   -f mode=${mode?} -f schedule=${schedule?} -f model=${model?} -f profile=${profile?} -f create-seed-issues=${create_seed_issues?} -f run-workflow=${run_workflow?}
gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0-dense-encoder -f mission-seed=4-kyu-apply-dense-encoding -f mode=${mode?} -f schedule=${schedule?} -f model=${model?} -f profile=${profile?} -f create-seed-issues=${create_seed_issues?} -f run-workflow=${run_workflow?}
gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0-random        -f mission-seed=random                     -f mode=${mode?} -f schedule=${schedule?} -f model=${model?} -f profile=${profile?} -f create-seed-issues=${create_seed_issues?} -f run-workflow=${run_workflow?}
gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0-crucible      -f mission-seed=generate                   -f mode=${mode?} -f schedule=${schedule?} -f model=${model?} -f profile=${profile?} -f create-seed-issues=${create_seed_issues?} -f run-workflow=${run_workflow?}
gh workflow run agentic-lib-flow -R xn-intenton-z2a/repository0-plot-code-lib -f mission-seed=2-kyu-create-plot-code-lib -f mode=${mode?} -f schedule=${schedule?} -f model=${model?} -f profile=${profile?} -f create-seed-issues=${create_seed_issues?} -f run-workflow=${run_workflow?}
