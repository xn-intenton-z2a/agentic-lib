#!/usr/bin/env bash
echo ".github/workflows/automerge.yml"
diff .github/workflows/automerge.yml ../repository0/.github/workflows/automerge.yml
#echo ".github/workflows/failing-build.yml"
#diff .github/workflows/fix-failing-build.yml ../repository0/.github/workflows/fix-failing-build.yml
echo ".github/workflows/formating.yml"
diff .github/workflows/formating.yml ../repository0/.github/workflows/formating.yml
echo ".github/workflows/issue-creator.yml"
diff .github/workflows/issue-creator.yml ../repository0/.github/workflows/issue-creator.yml
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
