#!/usr/bin/env bash
# scripts/release-to-and-accept-for-every-repository.sh
# Usage: ./scripts/release-to-and-accept-for-every-repository.sh <tag-version>
# Example: ./scripts/release-to-and-accept-for-every-repository.sh 1.0.0
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT
#

# Check for the required tag version argument
if [ -z "$1" ]; then
  echo "Usage: $0 <tag-version>"
  exit 1
fi

./scripts/release-to-every-repository.sh "$1"
./scripts/accept-for-every-repository.sh "$1"
