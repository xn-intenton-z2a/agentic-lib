# Purpose
Enhance the CLI to allow the --digest option to accept a file path containing a JSON payload. This enables developers and automated workflows to simulate real SQS events from arbitrary JSON files instead of a hard-coded example.

# Specification

1. Update Usage Instructions
   • Modify the usage section to show:
     --digest [<path>]
   • Explain that the optional path argument points to a JSON file containing the event digest object.

2. ProcessDigest Implementation
   • When --digest is supplied with a file path:
     - Read the file synchronously using fs.readFileSync
     - Parse the file content as JSON; report and exit on parse errors
     - Use the parsed object to create an SQS event via createSQSEventFromDigest
     - Invoke digestLambdaHandler on the resulting event
   • When --digest is supplied without an argument:
     - Retain existing behavior with the exampleDigest fallback

3. Error Handling
   • If file reading fails (file not found or permission denied):
     - Log an error with logError and exit process with non-zero code
   • If JSON parsing fails:
     - Log an error with logError including raw file content and error
     - Exit process with non-zero code

4. Tests and Validation
   • Create unit tests to cover:
     - Valid file path and proper dispatch to digestLambdaHandler
     - Missing file path argument (fallback to default behavior)
     - File not found or read error scenario
     - Invalid JSON content scenario
   • Use vitest mocks for fs and ensure logError is invoked correctly

# Success Criteria & Acceptance

- All new tests pass under npm test
- generateUsage output mentions the optional file path
- processDigest reads and parses external JSON files correctly
- Errors in reading or parsing are surfaced and cause non-zero exit
- Existing behavior without file argument remains unchanged
