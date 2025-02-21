#!/usr/bin/env bash

# Check for the required tag version argument
if [ -z "$1" ]; then
  echo "Usage: $0 <tag-version>"
  exit 1
fi

TAG_VERSION="$1"
DEST_DIR="../repository0/.github/workflows"

cp -v .github/workflows/apply-fix.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/apply-fix.yml"

cp -v .github/workflows/automerge.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/automerge.yml"

cp -v .github/workflows/formating.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/formating.yml"

cp -v .github/workflows/issue-creator.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/issue-creator.yml"

cp -v .github/workflows/issue-for-linting.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/issue-for-linting.yml"

cp -v .github/workflows/issue-reviewer.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/issue-reviewer.yml"

cp -v .github/workflows/issue-worker.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/issue-worker.yml"

cp -v .github/workflows/publish.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/publish.yml"

cp -v .github/workflows/test.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/test.yml"

cp -v .github/workflows/update.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/update.yml"
