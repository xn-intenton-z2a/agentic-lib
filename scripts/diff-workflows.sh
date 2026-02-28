#!/bin/bash
# diff-workflows.sh — Show what changed in src/workflows/ since a given tag
#
# Usage: ./scripts/diff-workflows.sh v6.10.2

if [ -z "$1" ]; then
  echo "Usage: $0 <version-tag>"
  echo "Example: $0 v6.10.2"
  exit 1
fi

TAG="$1"

echo "Diff of src/workflows/ between $TAG and HEAD:"
echo "================================================"
git diff "$TAG"..HEAD -- src/workflows/
