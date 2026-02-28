#!/usr/bin/env bash
# scripts/release-version-to-repository.sh
# Usage: ./scripts/release-version-to-repository <tag-version> <repository>
# Example: ./scripts/release-version-to-repository.sh 1.0.0 s3-sqs-bridge
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT
#
# Template workflow source files live in ./workflows/ (not .github/workflows/).
# This script copies them to the consumer repo's .github/workflows/ directory
# and stamps version references from @main to @<tag-version>.

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
TEMPLATE_DIR="workflows"

mkdir -p "${DEST_DIR}"

# Agent workflows

rm -f "${DEST_DIR}/agent-"*".yml"

cp -v "${TEMPLATE_DIR}/agent-archive-intentïon.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-archive-intentïon.yml"

cp -v "${TEMPLATE_DIR}/agent-discussions-bot.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-discussions-bot.yml"

cp -v "${TEMPLATE_DIR}/agent-flow-evolve.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-flow-evolve.yml"

cp -v "${TEMPLATE_DIR}/agent-flow-fix-code.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-flow-fix-code.yml"

cp -v "${TEMPLATE_DIR}/agent-flow-maintain.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-flow-maintain.yml"

cp -v "${TEMPLATE_DIR}/agent-flow-review.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-flow-review.yml"

# CI workflows

cp -v "${TEMPLATE_DIR}/ci-automerge.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/ci-automerge.yml"

cp -v "${TEMPLATE_DIR}/ci-deploy.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/ci-deploy.yml"

cp -v "${TEMPLATE_DIR}/ci-formating.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/ci-formating.yml"

cp -v "${TEMPLATE_DIR}/ci-test.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/ci-test.yml"

cp -v "${TEMPLATE_DIR}/ci-update.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/ci-update.yml"

# Publish workflows (only consumer-facing — NOT publish-stats which is internal)

cp -v "${TEMPLATE_DIR}/publish-packages.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/publish-packages.yml"

cp -v "${TEMPLATE_DIR}/publish-web.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/publish-web.yml"

# Utility workflows

cp -v "${TEMPLATE_DIR}/utils-truncate-issue-history.yml" "${DEST_DIR}/."

cp -v "${TEMPLATE_DIR}/utils-truncate-workflow-history.yml" "${DEST_DIR}/."

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
mkdir -p "${DEST_DIR}/../../.github/agentic-lib/agents/."
cp -v .github/agentic-lib/agents/agent-*.md "${DEST_DIR}/../../.github/agentic-lib/agents/."
