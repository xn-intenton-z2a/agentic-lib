# Objective

Provide a unified validation tool in sandbox mode to verify that both feature definitions and the repository README meet the mission and documentation guidelines. This ensures that new features reference the mission statement and that the README includes required links and structure as defined in CONTRIBUTING.md.

# Specification

Implement two new CLI flags in sandbox/source/main.js:  
  • --validate-features  (existing behavior)  
  • --validate-readme    (new behavior)  

When --validate-readme is supplied, the tool should:
  • Locate sandbox/README.md
  • Read its contents and confirm presence of links or references to MISSION.md, CONTRIBUTING.md, LICENSE.md, and the agentic-lib GitHub repository URL
  • Log errors for any missing references and exit with status 1 if validation fails
  • Log an info message and return true if all checks pass

The combined process should return a true result if either validation runs successfully, or false and continue execution when no validation flags are provided.

# Test Scenarios

1. No flags supplied returns false and prints the default message.  
2. --validate-features flag triggers existing feature validation tests.  
3. --validate-readme flag with a valid README logs success and returns true.  
4. --validate-readme flag with missing one or more required links logs error messages for each missing link and exits with code 1.  
5. Supplying both flags runs both validations and fails if either fails.

# Updates to Documentation and Files

• Modify sandbox/docs/USAGE.md to include instructions for --validate-readme  
• Add sandbox/tests/validate-readme.test.js covering success and failure cases  
• Update sandbox/README.md to include validation examples in usage section  
• Ensure package.json test script includes the new test file