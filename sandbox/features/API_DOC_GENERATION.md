# Objective
Enable automated generation of up-to-date API documentation from source code comments and exports, reducing manual drift and improving developer discoverability.

# Value Proposition
Automating API doc generation ensures that published reference material always matches the codebase, lowering maintenance overhead and improving user confidence in the library’s public interfaces.

# Scope
- Modify package.json to add a new devDependency for the documentation CLI tool (documentation).
- Update package.json scripts to include a generate-docs command that invokes documentation on src/lib/main.js and other exported modules.
- Enhance root README.md and sandbox/README.md to include an “API Documentation” section describing how to run the generate-docs script and where to find generated output.

# Requirements
- In package.json devDependencies, add documentation at a stable version.
- In package.json scripts, add:
    "generate-docs": "documentation build src/lib/main.js --shallow -f md -o sandbox/docs/API.md"
- Ensure documentation CLI is installed and runnable without additional configuration.
- In root README.md, under a new “## API Documentation” heading, include instructions:
    - Run npm install --save-dev documentation
    - Run npm run generate-docs
    - Locate generated API reference at sandbox/docs/API.md
- Mirror the same “API Documentation” section in sandbox/README.md, linking to the generated file.

# Success Criteria
- Running npm run generate-docs produces sandbox/docs/API.md containing markdown sections for each exported function with signatures and doc comments.
- README files display the new “API Documentation” section with correct commands and links.
- No lint or test failures after installing the documentation tool and running scripts.

# Verification
1. Install dev dependencies and run npm run generate-docs.
2. Open sandbox/docs/API.md in Markdown preview to verify contents match source exports.
3. Open README.md and sandbox/README.md to confirm new API documentation sections render correctly.
4. Execute npm test to ensure all existing tests still pass.