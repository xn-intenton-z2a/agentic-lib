# Objective

Provide a unified validation tool in sandbox mode to verify that feature definitions, the repository README, and the package manifest meet the mission, documentation, and packaging guidelines. This ensures that new features reference the mission statement, the README includes required links, and package.json contains essential metadata before publishing.

# Specification

Implement the following CLI flags in sandbox/source/main.js:
  • --validate-features    (existing behavior)  
  • --validate-readme      (existing behavior)  
  • --validate-package     (new behavior)

When --validate-package is supplied, the tool should:
  • Locate package.json at the repository root  
  • Read and parse its contents as JSON  
  • Confirm presence of required fields:
    ─ name  
    ─ version  
    ─ scripts.test  
    ─ engines.node  
  • Log an error for each missing or invalid field and exit with status 1 if validation fails  
  • Log an info message and return true if all checks pass

The combined process should return true if any validation flag runs successfully, or false and continue execution when no validation flags are provided.

# Test Scenarios

1. No flags supplied returns false and prints the default message.  
2. --validate-features triggers existing feature validation tests.  
3. --validate-readme with a valid README logs success and returns true.  
4. --validate-readme with missing links logs errors and exits with code 1.  
5. --validate-package with a valid package.json logs success and returns true.  
6. --validate-package with missing fields logs errors for each missing field and exits with code 1.  
7. Supplying multiple flags runs each validation and fails if any fails.

# Updates to Documentation and Files

• Modify sandbox/docs/USAGE.md to include instructions for --validate-package  
• Add sandbox/tests/validate-package.test.js covering success and failure cases  
• Update sandbox/README.md to include validation examples for the new flag  
• Ensure package.json test script picks up the new sandbox test file