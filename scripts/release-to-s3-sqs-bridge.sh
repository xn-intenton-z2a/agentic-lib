#!/usr/bin/env bash
# scripts/release-to-s3-sqs-bridge.sh
# Usage: ./scripts/release-to-s3-sqs-bridge.sh <tag-version>
# Example: ./scripts/release-to-s3-sqs-bridge.sh 1.0.0
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT
#

# Check for the required tag version argument
if [ -z "$1" ]; then
  echo "Usage: $0 <tag-version>"
  exit 1
fi

# Call the common script to copy the workflows and scripts
./scripts/release-version-to-repository.sh "$1" "../s3-sqs-bridge/.github/workflows"
