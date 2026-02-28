#!/usr/bin/env bash
# scripts/release-version-to-repository.sh
# Usage: ./scripts/release-version-to-repository <tag-version> <repository>
# Example: ./scripts/release-version-to-repository.sh 1.0.0 s3-sqs-bridge
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT
#
# Production source lives in ./src/. This script copies to the consumer repo:
#   src/workflows/  → .github/workflows/
#   src/scripts/    → scripts/
#   src/agents/     → .github/agentic-lib/agents/
#   src/actions/    → .github/agentic-lib/actions/
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
SRC="src"

mkdir -p "${DEST_DIR}"

# Agent workflows

rm -f "${DEST_DIR}/agent-"*".yml"

cp -v "${SRC}/workflows/agent-archive-intentïon.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-archive-intentïon.yml"

cp -v "${SRC}/workflows/agent-discussions-bot.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-discussions-bot.yml"

cp -v "${SRC}/workflows/agent-flow-evolve.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-flow-evolve.yml"

cp -v "${SRC}/workflows/agent-flow-fix-code.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-flow-fix-code.yml"

cp -v "${SRC}/workflows/agent-flow-maintain.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-flow-maintain.yml"

cp -v "${SRC}/workflows/agent-flow-review.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-flow-review.yml"

# CI workflows

cp -v "${SRC}/workflows/ci-automerge.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/ci-automerge.yml"

cp -v "${SRC}/workflows/ci-formating.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/ci-formating.yml"

cp -v "${SRC}/workflows/ci-test.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/ci-test.yml"

cp -v "${SRC}/workflows/ci-update.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/ci-update.yml"

# Publish workflows

cp -v "${SRC}/workflows/publish-packages.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/publish-packages.yml"

cp -v "${SRC}/workflows/publish-web.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/publish-web.yml"

# Operational workflows

cp -v "${SRC}/workflows/agent-supervisor.yml" "${DEST_DIR}/."
sed -i '' "s/@main/@${TAG_VERSION}/g" "${DEST_DIR}/agent-supervisor.yml"

# Scripts (distributed to consumer repos)

mkdir -p "${DEST_DIR}/../../scripts"

cp -v "${SRC}/scripts/accept-release.sh" "${DEST_DIR}/../../scripts/."
cp -v "${SRC}/scripts/activate-schedule.sh" "${DEST_DIR}/../../scripts/."
cp -v "${SRC}/scripts/clean.sh" "${DEST_DIR}/../../scripts/."
cp -v "${SRC}/scripts/initialise.sh" "${DEST_DIR}/../../scripts/."
cp -v "${SRC}/scripts/md-to-html.js" "${DEST_DIR}/../../scripts/."
cp -v "${SRC}/scripts/generate-library-index.js" "${DEST_DIR}/../../scripts/."
cp -v "${SRC}/scripts/update.sh" "${DEST_DIR}/../../scripts/."

# Seed files

mkdir -p "${DEST_DIR}/../../.github/agentic-lib/seeds"
cp -v ${SRC}/seeds/zero-*.js "${DEST_DIR}/../../.github/agentic-lib/seeds/."
cp -v ${SRC}/seeds/zero-*.json "${DEST_DIR}/../../.github/agentic-lib/seeds/."
cp -v ${SRC}/seeds/zero-*.md "${DEST_DIR}/../../.github/agentic-lib/seeds/."
cp -v ${SRC}/seeds/test-*.yml "${DEST_DIR}/../../.github/agentic-lib/seeds/."

# Agent prompt files

mkdir -p "${DEST_DIR}/../../.github/agentic-lib/agents"
cp -v ${SRC}/agents/agent-*.md "${DEST_DIR}/../../.github/agentic-lib/agents/."
cp -v ${SRC}/agents/agentic-lib.yml "${DEST_DIR}/../../.github/agentic-lib/agents/."

# Agentic-step action

mkdir -p "${DEST_DIR}/../../.github/agentic-lib/actions/agentic-step/tasks"
cp -v ${SRC}/actions/agentic-step/action.yml "${DEST_DIR}/../../.github/agentic-lib/actions/agentic-step/."
cp -v ${SRC}/actions/agentic-step/index.js "${DEST_DIR}/../../.github/agentic-lib/actions/agentic-step/."
cp -v ${SRC}/actions/agentic-step/config-loader.js "${DEST_DIR}/../../.github/agentic-lib/actions/agentic-step/."
cp -v ${SRC}/actions/agentic-step/logging.js "${DEST_DIR}/../../.github/agentic-lib/actions/agentic-step/."
cp -v ${SRC}/actions/agentic-step/safety.js "${DEST_DIR}/../../.github/agentic-lib/actions/agentic-step/."
cp -v ${SRC}/actions/agentic-step/tools.js "${DEST_DIR}/../../.github/agentic-lib/actions/agentic-step/."
cp -v ${SRC}/actions/agentic-step/package.json "${DEST_DIR}/../../.github/agentic-lib/actions/agentic-step/."
cp -v ${SRC}/actions/agentic-step/package-lock.json "${DEST_DIR}/../../.github/agentic-lib/actions/agentic-step/."
cp -v ${SRC}/actions/agentic-step/tasks/*.js "${DEST_DIR}/../../.github/agentic-lib/actions/agentic-step/tasks/."
