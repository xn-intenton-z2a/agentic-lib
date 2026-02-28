#!/usr/bin/env bash
# scripts/release-to-every-repository.sh
# Usage: ./scripts/release-to-every-repository.sh <tag-version>
# Example: ./scripts/release-to-every-repository.sh 1.0.0
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT
#

# Check for the required tag version argument
if [ -z "$1" ]; then
  echo "Usage: $0 <tag-version>"
  exit 1
fi

# Deactivate all schedules in the version we copy out to change in situ.
./scripts/deactivate-schedule.sh 1
./scripts/deactivate-schedule.sh 2
./scripts/deactivate-schedule.sh 3
./scripts/deactivate-schedule.sh 4
./scripts/deactivate-schedule.sh 5

# For each repository named in target-repositories.txt run release-version-to-repository.sh and activate-schedule.sh.
while IFS= read -r repo; do
  # Check if the directory exists
  if [ -d "../${repo?}" ]; then
    echo "Releasing ${repo?}..."
    ./scripts/release-version-to-repository.sh "$1" "../${repo?}/.github/workflows"
    cd "../${repo?}" || exit
    ./scripts/accept-release.sh "$1"
    cd ../agentic-lib
  else
    echo "Directory ../${repo?} does not exist. Skipping..."
  fi
  echo ""
done < target-repositories.txt

# Restore the schedule in the local workspace.
schedule=$(grep '^schedule:' .github/agentic-lib/agents/agentic-lib.yml | awk '{print $2}' | sed 's/schedule-//')
if [ -z "${schedule}" ]; then
  echo "No schedule found in .github/agentic-lib/agents/agentic-lib.yml, looking for line of the form 'schedule: schedule-<number>'"
else
  echo "Workflow schedule: schedule-${schedule?}"
  ./src/scripts/activate-schedule.sh "${schedule?}"
fi
