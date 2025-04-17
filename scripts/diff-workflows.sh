#!/usr/bin/env bash
# scripts/diff-workflows.sh
# Usage: ./scripts/diff-workflows.sh
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT
#

echo ".github/workflows/apply-fix.yml"
diff .github/workflows/agent-fix-code.yml ../repository0/.github/workflows/agent-fix-code.yml

echo ".github/workflows/automerge.yml"
diff .github/workflows/ci-automerge.yml ../repository0/.github/workflows/ci-automerge.yml

echo ".github/workflows/deploy.yml"
diff .github/workflows/ci-deploy.yml ../repository0/.github/workflows/ci-deploy.yml

echo ".github/workflows/feature-development-issue-creator.yml"
diff .github/workflows/agent-issue-to-code.yml ../repository0/.github/workflows/agent-issue-to-code.yml

echo ".github/workflows/feature-worker.yml"
diff .github/workflows/agent-library-to-feature.yml ../repository0/.github/workflows/agent-library-to-feature.yml

echo ".github/workflows/formating.yml"
diff .github/workflows/ci-formating.yml ../repository0/.github/workflows/ci-formating.yml

echo ".github/workflows/issue-for-linting.yml"
diff .github/workflows/agent-linting-to-issue.yml ../repository0/.github/workflows/agent-linting-to-issue.yml

echo ".github/workflows/issue-reviewer.yml"
diff .github/workflows/agent-code-to-close-issue.yml ../repository0/.github/workflows/agent-code-to-close-issue.yml

echo ".github/workflows/issue-worker.yml"
diff .github/workflows/agent-issue-to-code.yml ../repository0/.github/workflows/agent-issue-to-code.yml

echo ".github/workflows/maintenance-issue-creator.yml"
diff .github/workflows/agent-prompt-to-code.yml ../repository0/.github/workflows/agent-prompt-to-code.yml

echo ".github/workflows/publish.yml"
diff .github/workflows/publish-packages.yml ../repository0/.github/workflows/publish-packages.yml

echo ".github/workflows/stats.yml"
diff .github/workflows/stats.yml ../repository0/.github/workflows/stats.yml

echo ".github/workflows/test.yml"
diff .github/workflows/ci-test.yml ../repository0/.github/workflows/ci-test.yml

echo ".github/workflows/update.yml"
diff .github/workflows/ci-update.yml ../repository0/.github/workflows/ci-update.yml
