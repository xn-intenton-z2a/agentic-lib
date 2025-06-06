#!/usr/bin/env bash
# scripts/release-version-to-repository.sh
# Usage: ./scripts/release-version-to-repository <tag-version> <repository>
# Example: ./scripts/release-version-to-repository.sh 1.0.0 s3-sqs-bridge
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

# Agent workflows

rm -f "${DEST_DIR}/agent-"*".yml"

cp -v .github/workflows/agent-archive-intentïon.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-archive-intentïon.yml"

cp -v .github/workflows/agent-discussions-bot.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-discussions-bot.yml"

cp -v .github/workflows/agent-flow-feature-development.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-flow-feature-development.yml"

cp -v .github/workflows/agent-flow-feature-maintenance.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-flow-feature-maintenance.yml"

cp -v .github/workflows/agent-flow-fix-code.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-flow-fix-code.yml"

cp -v .github/workflows/agent-flow-linting.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-flow-linting.yml"

cp -v .github/workflows/agent-flow-maintenance-activity.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-flow-maintenance-activity.yml"

cp -v .github/workflows/agent-flow-update-readme.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-flow-update-readme.yml"

cp -v .github/workflows/agent-flow-seed-repository-and-feature-development.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-seed-repository.yml"

cp -v .github/workflows/agent-transformation-feature-to-issue.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-transformation-feature-to-issue.yml"

cp -v .github/workflows/agent-transformation-in-progress-issue-to-ready-issue.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-transformation-in-progress-issue-to-ready-issue.yml"

cp -v .github/workflows/agent-transformation-issue-to-code.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-transformation-issue-to-code.yml"

cp -v .github/workflows/agent-transformation-issue-to-ready-issue.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-transformation-issue-to-ready-issue.yml"

cp -v .github/workflows/agent-transformation-library-to-feature.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-transformation-library-to-feature.yml"

cp -v .github/workflows/agent-transformation-linting-to-issue.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-transformation-linting-to-issue.yml"

cp -v .github/workflows/agent-transformation-maintenance-activity-to-issue.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-transformation-maintenance-activity-to-issue.yml"

cp -v .github/workflows/agent-transformation-merged-issue-to-closed-issue.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-transformation-merged-issue-to-closed-issue.yml"

cp -v .github/workflows/agent-transformation-mission-to-source.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-transformation-mission-to-source.yml"

cp -v .github/workflows/agent-transformation-source-to-library.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-transformation-source-to-library.yml"

# CI workflows

cp -v .github/workflows/ci-automerge.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/ci-automerge.yml"

cp -v .github/workflows/ci-deploy.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/ci-deploy.yml"

cp -v .github/workflows/ci-formating.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/ci-formating.yml"

cp -v .github/workflows/ci-test.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/ci-test.yml"

cp -v .github/workflows/ci-update.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/ci-update.yml"

# Publish workflows

cp -v .github/workflows/publish-packages.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/publish-packages.yml"

cp -v .github/workflows/publish-web.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/publish-web.yml"

cp -v .github/workflows/publish-stats.yml "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/publish-stats.yml"

# Utility workflows

cp -v .github/workflows/utils-truncate-issue-history.yml "${DEST_DIR}/."

cp -v .github/workflows/utils-truncate-workflow-history.yml "${DEST_DIR}/."

mkdir -p "${DEST_DIR}/../../scripts"

cp -v scripts/accept-release.sh "${DEST_DIR}/../../scripts/."
cp -v scripts/activate-schedule.sh "${DEST_DIR}/../../scripts/."
cp -v scripts/archive.sh "${DEST_DIR}/../../scripts/."
cp -v scripts/aws-assume-agentic-lib-deployment-role.sh "${DEST_DIR}/../../scripts/."
cp -v scripts/aws-unset-iam-session.sh "${DEST_DIR}/../../scripts/."
cp -v scripts/clean.sh "${DEST_DIR}/../../scripts/."
cp -v scripts/deactivate-schedule.sh "${DEST_DIR}/../../scripts/."
cp -v scripts/export-source.sh "${DEST_DIR}/../../scripts/."
cp -v scripts/generate-npmrc.sh "${DEST_DIR}/../../scripts/."
cp -v scripts/generate-settings-xml.sh "${DEST_DIR}/../../scripts/."
cp -v scripts/initialise.sh "${DEST_DIR}/../../scripts/."
cp -v scripts/md-to-html.js "${DEST_DIR}/../../scripts/."
cp -v scripts/truncate-git-history.sh "${DEST_DIR}/../../scripts/."
cp -v scripts/update.sh "${DEST_DIR}/../../scripts/."

mkdir -p "${DEST_DIR}/../../public"

cp -v public/all.html "${DEST_DIR}/../../public/."
cp -v public/stats.html "${DEST_DIR}/../../public/."

# Copy the agent prompt files
mkdir -p "${DEST_DIR}/../../.github/agents/."
cp -v .github/agents/agent-*.md "${DEST_DIR}/../../.github/agents/."
