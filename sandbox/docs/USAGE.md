# CLI Usage

## --validate-features

Validates that all markdown files in `sandbox/features/` include a reference to the mission statement (`MISSION.md` or `# Mission`).
If any files are missing the reference, errors will be logged and the process will exit with a non-zero status.

Example:

```
node sandbox/source/main.js --validate-features
```
