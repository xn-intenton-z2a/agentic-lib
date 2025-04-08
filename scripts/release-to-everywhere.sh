#!/usr/bin/env bash
# scripts/release-to-everywhere.sh
# Usage: ./scripts/release-to-everywhere.sh <tag-version>
# Example: ./scripts/release-to-everywhere.sh 1.0.0
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT
#

# Check for the required tag version argument
if [ -z "$1" ]; then
  echo "Usage: $0 <tag-version>"
  exit 1
fi

./scripts/deactivate-schedule.sh 1
./scripts/deactivate-schedule.sh 2
./scripts/deactivate-schedule.sh 3
./scripts/release-to-s3-sqs-bridge.sh "${1?}"
./scripts/release-to-repository0.sh "${1?}"
./scripts/release-to-repository0-crucible.sh "${1?}"
./scripts/release-to-repository0-plot-code-lib.sh "${1?}"
schedule=$(grep '^schedule:' .github/agentic-lib.yml | awk '{print $2}' | sed 's/schedule-//')
if [ -z "${schedule}" ]; then
  echo "No schedule found in .github/agentic-lib.yml, looking for line of the form 'schedule: schedule-<number>'"
else
  echo "Workflow schedule: schedule-${schedule?}"
  ./scripts/activate-schedule.sh "${schedule?}"
fi
