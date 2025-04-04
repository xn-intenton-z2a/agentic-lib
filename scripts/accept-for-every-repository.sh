#!/usr/bin/env bash
# scripts/accept-for-every-repository.sh
# Usage: ./scripts/accept-for-every-repository.sh
#
# This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
# This file is licensed under the MIT License. For details, see LICENSE-MIT

cd ..
echo "repository0..."
cd repository0
./scripts/accept-release.sh
cd ..
echo "repository0-crucible..."
cd repository0-crucible
./scripts/accept-release.sh
cd ..
echo "repository0-plot-code-lib..."
cd repository0-plot-code-lib
./scripts/accept-release.sh
cd ..
echo "s3-sqs-bridge..."
cd s3-sqs-bridge
./scripts/accept-release.sh
cd ..
cd agentic-lib
