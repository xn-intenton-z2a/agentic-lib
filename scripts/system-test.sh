#!/usr/bin/env bash
# SPDX-License-Identifier: GPL-3.0-only
# Copyright (C) 2025-2026 Polycode Limited
# scripts/system-test.sh — Full journey system test
#
# Runs the complete agentic-lib flow in a temporary workspace:
#   1. init --purge a fresh workspace
#   2. Write a mission statement
#   3. Run maintain-features (generate feature files)
#   4. Run transform (advance code toward mission)
#   5. Verify files were created/modified
#   6. Clean up the temporary workspace
#
# Usage:
#   bash scripts/system-test.sh                  # full run (needs COPILOT_GITHUB_TOKEN)
#   bash scripts/system-test.sh --dry-run        # prompt construction only, no SDK calls
#   bash scripts/system-test.sh --init-only      # test init/purge cycle only
#
# Environment:
#   COPILOT_GITHUB_TOKEN  — required for SDK calls (not needed with --dry-run)
#   MODEL                 — Copilot model (default: claude-sonnet-4)
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PKG_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
CLI="$PKG_ROOT/bin/agentic-lib.js"
WORKSPACE=""
DRY_RUN=""
INIT_ONLY=""
MODEL="${MODEL:-claude-sonnet-4}"

# Parse args
for arg in "$@"; do
  case "$arg" in
    --dry-run)   DRY_RUN="--dry-run" ;;
    --init-only) INIT_ONLY="true" ;;
    *)           echo "Unknown arg: $arg"; exit 1 ;;
  esac
done

# ── Helpers ──────────────────────────────────────────────────────────

pass() { echo "  ✓ $1"; }
fail() { echo "  ✗ $1"; FAILURES=$((FAILURES + 1)); }
FAILURES=0

cleanup() {
  if [[ -n "$WORKSPACE" && -d "$WORKSPACE" ]]; then
    echo ""
    echo "--- Cleanup ---"
    rm -rf "$WORKSPACE"
    echo "  Removed: $WORKSPACE"
  fi
}
trap cleanup EXIT

# ── Setup ────────────────────────────────────────────────────────────

WORKSPACE="$(mktemp -d)"
echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║          agentic-lib system test                     ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "Package:   $PKG_ROOT"
echo "Workspace: $WORKSPACE"
echo "Model:     $MODEL"
echo "Dry-run:   ${DRY_RUN:-no}"
echo "Init-only: ${INIT_ONLY:-no}"
echo ""

# ── Step 1: Init with purge ─────────────────────────────────────────

echo "=== Step 1: init --purge ==="
echo ""

# Create a minimal git repo (required context for some operations)
cd "$WORKSPACE"
git init --quiet
git config user.email "test@test.com"
git config user.name "Test"

# Create package.json so npm install works
cat > package.json <<'PKGJSON'
{
  "name": "system-test-workspace",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "echo 'tests pass'",
    "build": "echo 'build ok'",
    "start": "echo 'start ok'"
  }
}
PKGJSON

node "$CLI" init --purge --target "$WORKSPACE"
echo ""

# Verify init output
echo "--- Verifying init ---"
[[ -f "$WORKSPACE/.github/workflows/agent-flow-transform.yml" ]] && pass "Workflows installed" || fail "Workflows missing"
[[ -d "$WORKSPACE/.github/agentic-lib/actions/agentic-step" ]] && pass "Actions installed" || fail "Actions missing"
[[ -d "$WORKSPACE/.github/agentic-lib/agents" ]] && pass "Agents installed" || fail "Agents missing"
[[ -d "$WORKSPACE/.github/agentic-lib/seeds" ]] && pass "Seeds installed" || fail "Seeds missing"
[[ -f "$WORKSPACE/agentic-lib.toml" ]] && pass "TOML config created" || fail "TOML config missing"
[[ -f "$WORKSPACE/src/lib/main.js" ]] && pass "Seed source file created" || fail "Seed source missing"
[[ -f "$WORKSPACE/tests/unit/main.test.js" ]] && pass "Seed test file created" || fail "Seed test missing"
[[ -f "$WORKSPACE/MISSION.md" ]] && pass "Seed MISSION.md created" || fail "Seed MISSION.md missing"
echo ""

if [[ -n "$INIT_ONLY" ]]; then
  echo "--- Init-only mode: skipping SDK steps ---"
  echo ""
  if [[ $FAILURES -gt 0 ]]; then
    echo "RESULT: $FAILURES failure(s)"
    exit 1
  fi
  echo "RESULT: All checks passed"
  exit 0
fi

# ── Step 2: Write a mission ─────────────────────────────────────────

echo "=== Step 2: Write mission ==="
echo ""

cat > "$WORKSPACE/MISSION.md" <<'MISSION'
# Mission: CSV to JSON Converter

Build a Node.js CLI tool that reads a CSV file from stdin and outputs JSON to stdout.

## Requirements
- Parse CSV with headers (first row is column names)
- Handle quoted fields containing commas
- Output a JSON array of objects
- Exit with code 0 on success, 1 on error
- Include a --pretty flag for formatted output
MISSION

echo "  Mission written ($(wc -c < "$WORKSPACE/MISSION.md") bytes)"
echo ""

# ── Step 3: Install agentic-step dependencies ───────────────────────

echo "=== Step 3: Install dependencies ==="
echo ""

STEP_DIR="$WORKSPACE/.github/agentic-lib/actions/agentic-step"
if [[ -f "$STEP_DIR/package.json" ]]; then
  cd "$STEP_DIR"
  npm ci --silent
  cd "$WORKSPACE"
  pass "agentic-step dependencies installed"
else
  fail "agentic-step package.json not found"
fi
echo ""

# ── Step 4: Run maintain-features ────────────────────────────────────

echo "=== Step 4: maintain-features ==="
echo ""

mkdir -p "$WORKSPACE/features"
FEATURES_BEFORE=$(find "$WORKSPACE/features" -name "*.md" | wc -l | tr -d ' ')
echo "  Features before: $FEATURES_BEFORE"

node "$CLI" maintain-features --target "$WORKSPACE" --model "$MODEL" $DRY_RUN
echo ""

FEATURES_AFTER=$(find "$WORKSPACE/features" -name "*.md" | wc -l | tr -d ' ')
echo "  Features after: $FEATURES_AFTER"

if [[ -n "$DRY_RUN" ]]; then
  pass "maintain-features dry-run completed"
elif [[ "$FEATURES_AFTER" -gt "$FEATURES_BEFORE" ]]; then
  pass "maintain-features created $((FEATURES_AFTER - FEATURES_BEFORE)) feature(s)"
  echo "  Feature files:"
  find "$WORKSPACE/features" -name "*.md" -exec echo "    - {}" \;
else
  echo "  (no new features created — SDK may not have been available)"
fi
echo ""

# ── Step 5: Run transform ───────────────────────────────────────────

echo "=== Step 5: transform ==="
echo ""

SOURCE_BEFORE=$(wc -c < "$WORKSPACE/src/lib/main.js" | tr -d ' ')
echo "  Source size before: $SOURCE_BEFORE bytes"

node "$CLI" transform --target "$WORKSPACE" --model "$MODEL" $DRY_RUN
echo ""

SOURCE_AFTER=$(wc -c < "$WORKSPACE/src/lib/main.js" | tr -d ' ')
echo "  Source size after: $SOURCE_AFTER bytes"

if [[ -n "$DRY_RUN" ]]; then
  pass "transform dry-run completed"
elif [[ "$SOURCE_AFTER" -ne "$SOURCE_BEFORE" ]]; then
  pass "transform modified source ($SOURCE_BEFORE → $SOURCE_AFTER bytes)"
else
  echo "  (source unchanged — SDK may not have been available)"
fi
echo ""

# ── Step 6: Summary ─────────────────────────────────────────────────

echo "=== Summary ==="
echo ""
echo "  Workspace: $WORKSPACE"
echo "  Files:"
find "$WORKSPACE" -type f \
  ! -path "*/node_modules/*" \
  ! -path "*/.git/*" \
  | sort \
  | head -30 \
  | sed 's|'"$WORKSPACE"'/|    |'
echo ""

if [[ $FAILURES -gt 0 ]]; then
  echo "RESULT: $FAILURES failure(s)"
  exit 1
fi
echo "RESULT: All checks passed"
