#!/usr/bin/env bash
# demo.sh — Demonstrate intentïon autonomous code evolution
# Usage: ./demo.sh <github-username>
#
# Prerequisites:
#   - GitHub CLI (gh) authenticated
#   - GitHub Copilot subscription enabled
#
# What this does:
#   1. Creates a new repository from the repository0 template
#   2. Writes a MISSION.md with a sample mission
#   3. Enables workflow schedules
#   4. Waits for the first PR to appear
#   5. Shows the PR and intentïon.md activity log

set -euo pipefail

# ── Helpers ──────────────────────────────────────────────────────────────────

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

info()  { echo -e "${CYAN}[info]${NC}  $*"; }
ok()    { echo -e "${GREEN}[ok]${NC}    $*"; }
warn()  { echo -e "${YELLOW}[warn]${NC}  $*"; }
fail()  { echo -e "${RED}[fail]${NC}  $*"; exit 1; }

# ── Preflight checks ────────────────────────────────────────────────────────

command -v gh >/dev/null 2>&1 || fail "GitHub CLI (gh) is not installed. Install from https://cli.github.com"
gh auth status >/dev/null 2>&1 || fail "GitHub CLI is not authenticated. Run: gh auth login"

if [ $# -lt 1 ]; then
  echo "Usage: $0 <github-username>"
  echo ""
  echo "Creates a new repository from the repository0 template under your account,"
  echo "writes a sample MISSION.md, and watches the autonomous evolution begin."
  exit 1
fi

OWNER="$1"
REPO_NAME="intention-demo-$(date +%Y%m%d-%H%M%S)"
FULL_REPO="${OWNER}/${REPO_NAME}"
TEMPLATE="xn-intenton-z2a/repository0"

# ── Step 1: Create repository from template ──────────────────────────────────

info "Creating repository ${FULL_REPO} from template ${TEMPLATE}..."

gh repo create "${FULL_REPO}" \
  --template "${TEMPLATE}" \
  --public \
  --clone=false

ok "Repository created: https://github.com/${FULL_REPO}"

# Wait for GitHub to finish templating
info "Waiting for repository to be ready..."
sleep 5

# ── Step 2: Write MISSION.md ─────────────────────────────────────────────────

MISSION_CONTENT='# Mission

Build a CLI tool called `timebox` that helps developers manage focused work sessions.

## Core Features

- `timebox start <minutes> "<task>"` — Start a timed work session with a named task
- `timebox status` — Show current session progress with a visual progress bar
- `timebox log` — Show history of completed sessions as a formatted table
- `timebox stats` — Show productivity statistics (total hours, average session length, streak)

## Technical Requirements

- Pure Node.js, no external runtime dependencies
- Sessions persisted to `~/.timebox/sessions.json`
- Colorful terminal output using ANSI escape codes
- Proper signal handling (SIGINT gracefully ends session)
- Export to CSV via `timebox export`

## Quality

- Comprehensive unit tests for all commands
- Input validation with helpful error messages
- Works on macOS, Linux, and Windows
'

info "Writing MISSION.md with sample mission (timebox CLI)..."

# Use the GitHub API to create/update the file
ENCODED_CONTENT=$(echo -n "${MISSION_CONTENT}" | base64)

gh api "repos/${FULL_REPO}/contents/MISSION.md" \
  --method PUT \
  --field message="Set mission: timebox CLI tool" \
  --field content="${ENCODED_CONTENT}" \
  --field sha="$(gh api "repos/${FULL_REPO}/contents/MISSION.md" --jq '.sha' 2>/dev/null || echo '')" \
  >/dev/null 2>&1 || {
    # If the file doesn't exist yet, create without sha
    gh api "repos/${FULL_REPO}/contents/MISSION.md" \
      --method PUT \
      --field message="Set mission: timebox CLI tool" \
      --field content="${ENCODED_CONTENT}" \
      >/dev/null
  }

ok "MISSION.md written with timebox CLI mission"

# ── Step 3: Enable workflow schedules ─────────────────────────────────────────

info "Enabling GitHub Actions workflows..."

# Trigger the initial workflow manually to kick things off
gh workflow run "agent-flow-seed-repository-and-feature-development.yml" \
  --repo "${FULL_REPO}" 2>/dev/null || {
    warn "Could not trigger seed workflow — it may need manual activation."
    warn "Go to https://github.com/${FULL_REPO}/actions and enable workflows."
  }

ok "Workflows enabled"

# ── Step 4: Wait for the first PR ─────────────────────────────────────────────

info "Watching for the first pull request..."
info "(This typically takes 3-10 minutes. Press Ctrl+C to stop waiting.)"

MAX_WAIT=600  # 10 minutes
ELAPSED=0
INTERVAL=15

while [ ${ELAPSED} -lt ${MAX_WAIT} ]; do
  PR_COUNT=$(gh pr list --repo "${FULL_REPO}" --state open --json number --jq 'length' 2>/dev/null || echo "0")

  if [ "${PR_COUNT}" -gt 0 ]; then
    ok "Pull request detected!"
    echo ""
    break
  fi

  echo -n "."
  sleep ${INTERVAL}
  ELAPSED=$((ELAPSED + INTERVAL))
done

if [ "${ELAPSED}" -ge ${MAX_WAIT} ]; then
  warn "No PR appeared within 10 minutes. The workflows may still be running."
  warn "Check: https://github.com/${FULL_REPO}/actions"
fi

# ── Step 5: Show results ─────────────────────────────────────────────────────

echo ""
info "=== Demo Results ==="
echo ""

# Show open PRs
info "Open Pull Requests:"
gh pr list --repo "${FULL_REPO}" --state open 2>/dev/null || echo "  (none yet)"
echo ""

# Show the first PR details if available
FIRST_PR=$(gh pr list --repo "${FULL_REPO}" --state open --json number --jq '.[0].number' 2>/dev/null || echo "")
if [ -n "${FIRST_PR}" ]; then
  info "First PR (#${FIRST_PR}) details:"
  gh pr view "${FIRST_PR}" --repo "${FULL_REPO}" 2>/dev/null
  echo ""
fi

# Show the intentïon.md activity log
info "Activity log (intentïon.md):"
gh api "repos/${FULL_REPO}/contents/intenti%C3%B6n.md" --jq '.content' 2>/dev/null \
  | base64 -d 2>/dev/null \
  | head -50 \
  || echo "  (not yet created — will appear after the first workflow run)"

echo ""
ok "Demo repository: https://github.com/${FULL_REPO}"
ok "Actions:         https://github.com/${FULL_REPO}/actions"
ok "Pull Requests:   https://github.com/${FULL_REPO}/pulls"
echo ""
info "The repository will continue evolving autonomously on its schedule."
info "To clean up: gh repo delete ${FULL_REPO} --yes"
