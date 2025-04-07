#!/usr/bin/env bash
# scripts/diff-workflows.sh
# Usage: ./scripts/diff-workflows.sh
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT
#

echo ".github/workflows/apply-fix.yml"
diff .github/workflows/apply-fix.yml ../repository0/.github/workflows/apply-fix.yml
echo ".github/workflows/automerge.yml"
diff .github/workflows/automerge.yml ../repository0/.github/workflows/automerge.yml
echo ".github/workflows/formating.yml"
diff .github/workflows/formating.yml ../repository0/.github/workflows/formating.yml
echo ".github/workflows/issue-creator.yml"
diff .github/workflows/maintenance-issue-creator.yml ../repository0/.github/workflows/maintenance-issue-creator.yml
echo ".github/workflows/issue-for-linting.yml"
diff .github/workflows/issue-for-linting.yml ../repository0/.github/workflows/issue-for-linting.yml
echo ".github/workflows/issue-reviewer.yml"
diff .github/workflows/issue-reviewer.yml ../repository0/.github/workflows/issue-reviewer.yml
echo ".github/workflows/issue-worker.yml"
diff .github/workflows/issue-worker.yml ../repository0/.github/workflows/issue-worker.yml
echo ".github/workflows/publish.yml"
diff .github/workflows/publish.yml ../repository0/.github/workflows/publish.yml
echo ".github/workflows/test.yml"
diff .github/workflows/test.yml ../repository0/.github/workflows/test.yml
echo ".github/workflows/update.yml"
diff .github/workflows/update.yml ../repository0/.github/workflows/update.yml
