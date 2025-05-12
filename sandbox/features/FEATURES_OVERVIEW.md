# FEATURES_OVERVIEW

## Overview
Generates a markdown summary of all sandbox CLI flags and writes it to sandbox/docs/FEATURES_OVERVIEW.md. Additionally integrates this overview into sandbox/docs/USAGE.md and sandbox/README.md to keep all documentation in sync.

## CLI Behavior
• On --features-overview, build a markdown table of flags and descriptions identical to existing behavior.
• Write or overwrite sandbox/docs/FEATURES_OVERVIEW.md with complete markdown content.
• Log a JSON info entry with fields level: 'info' and featuresOverview containing the markdown string.
• Exit status 0 on success, 1 on write or integration errors.

## Documentation Integration
• Read sandbox/docs/USAGE.md and locate the section for --features-overview under CLI Usage.
• Replace or append a line pointing to FEATURES_OVERVIEW.md, for example: 'For full flag list see sandbox/docs/FEATURES_OVERVIEW.md'.
• Read sandbox/README.md and insert under Links a bullet '- Features Overview' linking to sandbox/docs/FEATURES_OVERVIEW.md if not present.
• Ensure idempotent updates so running twice does not duplicate entries.

## Implementation
• Extend the existing processFeaturesOverview function in sandbox/source/main.js.
• After writing the overview file, perform read, modify, and write operations on USAGE.md and README.md.

## Testing and Validation
• Update sandbox/tests/features-overview.test.js to mock fs/promises for readFile and writeFile to all three files.
• Verify writeFile is called for FEATURES_OVERVIEW.md, USAGE.md, and README.md.
• Verify console.log outputs JSON info and exit code 0 on success.
• Simulate write errors for USAGE.md or README.md to verify console.error logs and exit status 1.