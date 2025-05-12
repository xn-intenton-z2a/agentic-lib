#!/usr/bin/env bash
# scripts/accept-for-every-repository.sh
# Usage: ./scripts/accept-for-every-repository.sh <tag-version>
# Example: ./scripts/accept-for-every-repository.sh 1.0.0
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

# Check for the required tag version argument
if [ -z "$1" ]; then
  echo "Usage: $0 <tag-version>"
  exit 1
fi

# For each repository named in target-repositories.txt run accept-release.sh with the tag version
while IFS= read -r repo; do
  # Check if the directory exists
  if [ -d "../${repo?}" ]; then
    echo "Accepting ${repo?}..."
    cd "../${repo?}" || exit
    ./scripts/accept-release.sh "$1"
    cd ../agentic-lib
  else
    echo "Directory ../${repo?} does not exist. Skipping..."
  fi
  echo ""
done < target-repositories.txt
