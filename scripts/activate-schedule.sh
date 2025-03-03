#!/usr/bin/env bash
# scripts/activate-schedule
#
# Usage: ./scripts/activate-schedule.sh <schedule-number>
# Example: ./scripts/activate-schedule.sh 2
# (activates schedule-2 and comments out all others.)
#
# This script processes all .yml files in the .github/workflows directory.
# It looks for lines with cron schedule definitions ending with a comment like "# schedule-N"
# and then ensures that only the chosen schedule is uncommented.

set -euo pipefail

if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <schedule-number>"
  exit 1
fi

activeSchedule="$1"
workflow_dir=".github/workflows"

if [ ! -d "$workflow_dir" ]; then
  echo "Error: Directory $workflow_dir not found."
  exit 1
fi

echo "Activating schedule-$activeSchedule in all YAML workflow files..."

for file in "$workflow_dir"/*.yml; do
  echo "Processing $file..."

  # 1. Uncomment lines that contain the active schedule comment (e.g. "# schedule-2")
  sed -i.bak -E "s/^([[:space:]]*)#\s*(.*#\s*schedule-$activeSchedule.*)/\1\2/" "$file"

  # 2. For lines that contain any schedule comment, if they are not the active schedule,
  #    ensure they are commented out.
  sed -i.bak -E "/cron:.*#\s*schedule-[0-9]+/{
    /schedule-$activeSchedule/!{
      s/^([[:space:]]*)(-?[[:space:]]*cron:)/\1# \2/
    }
  }" "$file"

  rm "$file.bak"
done

echo "Schedule-$activeSchedule activated in workflows."
