#!/usr/bin/env bash
# scripts/activate-schedule
#
# Usage: ./scripts/activate-schedule.sh <schedule-number>
# Example: ./scripts/activate-schedule.sh 1
# (activates schedule-2 and comments out all others.)
# Example: ./scripts/activate-schedule.sh 2
# (activates schedule-1 and comments out all others.)
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

echo "Activating schedule-$activeSchedule in all YAML workflow files in $workflow_dir..."

for file in "$workflow_dir"/*.yml; do
  echo "Processing $file..."
  awk -v active="$activeSchedule" '
  {
    # If line contains a cron schedule with a schedule comment
    if ($0 ~ /cron:.*#\s*schedule-[0-9]+/) {
      # Capture leading whitespace
      match($0, /^[[:space:]]*/);
      indent = substr($0, RSTART, RLENGTH);
      if ($0 ~ ("schedule-"active)) {
         # Remove any leading "#" and whitespace
         sub(/^[[:space:]]*#?[[:space:]]*/, "", $0);
         print indent $0;
      } else {
         # Remove leading whitespace and comment the line
         sub(/^[[:space:]]*/, "", $0);
         print indent "# " $0;
      }
    } else {
      print $0;
    }
  }
  ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
done

echo "Schedule-$activeSchedule activated in workflows."
