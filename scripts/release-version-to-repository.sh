#!/usr/bin/env bash
# scripts/release-version-to-repository.sh
# Usage: ./scripts/release-version-to-repository <tag-version> <repository>
# Example: ./scripts/release-version-to-repository.sh 1.0.0 tansu-sqs-bridge
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT
#

# Check for the required tag version argument
if [ -z "$1" ]; then
  echo "Usage: $0 <tag-version> <repository>"
  exit 1
fi
# Check for the required repository argument
if [ -z "$2" ]; then
  echo "Usage: $0 <tag-version> <repository>"
  exit 1
fi

TAG_VERSION="$1"
DEST_DIR="$2"

mkdir -p "${DEST_DIR}"

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

cp -v .github/workflows/stats.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/stats.yml"

cp -v .github/workflows/update.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/update.yml"

cp -v .github/workflows/truncate-workflow-history.yml "${DEST_DIR}/."

mkdir -p "${DEST_DIR}/../../scripts"

cp -v scripts/accept-release.sh "${DEST_DIR}/../../scripts/."
cp -v scripts/activate-schedule.sh "${DEST_DIR}/../../scripts/."
cp -v scripts/archive.sh "${DEST_DIR}/../../scripts/."
cp -v scripts/clean.sh "${DEST_DIR}/../../scripts/."
cp -v scripts/deactivate-schedule.sh "${DEST_DIR}/../../scripts/."
cp -v scripts/export-source.sh "${DEST_DIR}/../../scripts/."
cp -v scripts/initialise.sh "${DEST_DIR}/../../scripts/."
cp -v scripts/md-to-html.js "${DEST_DIR}/../../scripts/."
cp -v scripts/truncate-git-history.sh "${DEST_DIR}/../../scripts/."
cp -v scripts/update.sh "${DEST_DIR}/../../scripts/."

mkdir -p "${DEST_DIR}/../../public"

cp -v public/all.html "${DEST_DIR}/../../public/."
