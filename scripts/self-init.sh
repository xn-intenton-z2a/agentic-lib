#!/usr/bin/env bash
# scripts/self-init.sh — Copy src/ content into .github/agentic-lib/ for testing.
#
# This is the same operation that `npx @xn-intenton-z2a/agentic-lib init` performs
# for consumers, but done locally within the repo for self-testing.
#
# NOTE: Template workflows (src/workflows/*.yml) are NOT copied to .github/workflows/
# — that would activate their schedule triggers. Only actions, agents, and seeds are copied.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC_DIR="${REPO_ROOT}/src"
AGENTIC_DIR="${REPO_ROOT}/.github/agentic-lib"

echo "=== Self-init: copying src/ → .github/agentic-lib/ ==="
echo "Source:  ${SRC_DIR}"
echo "Target:  ${AGENTIC_DIR}"
echo ""

# 1. Actions → .github/agentic-lib/actions/ (skip node_modules)
echo "--- Actions ---"
for action_dir in "${SRC_DIR}/actions"/*/; do
  action_name=$(basename "$action_dir")
  dst="${AGENTIC_DIR}/actions/${action_name}"
  mkdir -p "$dst"
  # Copy all files except node_modules
  rsync -a --exclude='node_modules' "${action_dir}" "${dst}/"
  echo "  COPY: actions/${action_name}"
done

# 2. Agents → .github/agentic-lib/agents/
echo ""
echo "--- Agents ---"
mkdir -p "${AGENTIC_DIR}/agents"
for f in "${SRC_DIR}/agents"/*; do
  cp "$f" "${AGENTIC_DIR}/agents/$(basename "$f")"
  echo "  COPY: agents/$(basename "$f")"
done

# 3. Seeds → .github/agentic-lib/seeds/
echo ""
echo "--- Seeds ---"
mkdir -p "${AGENTIC_DIR}/seeds"
for f in "${SRC_DIR}/seeds"/*; do
  cp "$f" "${AGENTIC_DIR}/seeds/$(basename "$f")"
  echo "  COPY: seeds/$(basename "$f")"
done

# 4. Scripts → .github/agentic-lib/scripts/ (selected only)
echo ""
echo "--- Scripts ---"
mkdir -p "${AGENTIC_DIR}/scripts"
DISTRIBUTED_SCRIPTS="accept-release.sh activate-schedule.sh clean.sh initialise.sh md-to-html.js update.sh"
for name in $DISTRIBUTED_SCRIPTS; do
  src="${SRC_DIR}/scripts/${name}"
  if [ -f "$src" ]; then
    cp "$src" "${AGENTIC_DIR}/scripts/${name}"
    echo "  COPY: scripts/${name}"
  fi
done

# 5. Install action dependencies
echo ""
echo "--- Install action dependencies ---"
cd "${AGENTIC_DIR}/actions/agentic-step"
npm ci
echo "  DONE: agentic-step dependencies installed"

echo ""
echo "=== Self-init complete ==="
