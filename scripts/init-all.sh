#!/usr/bin/env bash
# SPDX-License-Identifier: GPL-3.0-only
# Copyright (C) 2025-2026 Polycode Limited
# scripts/init-all.sh — Initialize all agentic-lib repos by running the init workflow with purge mode and create-seed-issues=true.
#

gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0               -f mode=purge -f mission-seed=7-kyu-understand-fizz-buzz -f schedule=hourly -f model=gpt-5-mini -f profile=max -f create-seed-issues=true -f run-workflow=true
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0-string-utils  -f mode=purge -f mission-seed=5-kyu-apply-string-utils   -f schedule=hourly -f model=gpt-5-mini -f profile=max -f create-seed-issues=true -f run-workflow=true
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0-dense-encoder -f mode=purge -f mission-seed=4-kyu-apply-dense-encoding -f schedule=hourly -f model=gpt-5-mini -f profile=max -f create-seed-issues=true -f run-workflow=true
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0-random        -f mode=purge -f mission-seed=random                     -f schedule=hourly -f model=gpt-5-mini -f profile=max -f create-seed-issues=true -f run-workflow=true
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0-crucible      -f mode=purge -f mission-seed=generate                   -f schedule=hourly -f model=gpt-5-mini -f profile=max -f create-seed-issues=true -f run-workflow=true
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0-plot-code-lib -f mode=purge -f mission-seed=2-kyu-create-plot-code-lib -f schedule=hourly -f model=gpt-5-mini -f profile=max -f create-seed-issues=true -f run-workflow=true
