# intentïon agentic-lib

You probably want to start with the workflow documentation here: [WORKFLOWS-README.md](WORKFLOWS-README.md)

The **intentïon `agentic-lib`** is a collection of reusable GitHub Actions workflows that enable your
repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and
issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using
GitHub’s `workflow_call` event, so they can be composed together like an SDK.

[Start using the Repository Template](https://github.com/xn-intenton-z2a/repository0)

Mixed licensing:
* This project is licensed under the GNU General Public License (GPL).
* This file is part of the example suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
* This file is licensed under the MIT License. For details, see LICENSE-MIT

This README file will evolve as the test experiment within this repository evolves.

---
---

## Quick Start Guide: 20 Detailed Steps to Evolve This Repository

1. Fork the repository and clone it to your local machine.
2. Ensure you have Node 20 or higher installed.
3. Run `npm ci` to install all dependencies.
4. Explore the source code in `src/lib/main.js`, which now features an updated transformation pipeline that sequentially applies CLI flag modifications. New functionality includes:
   - **--sort**: Sorts non-flag arguments alphabetically.
   - **--duplicate**: Duplicates each argument.
   - **--count**: Displays the count of non-flag arguments.
   - **--shuffle**: Randomly shuffles the order of non-flag arguments.
5. A new wrapper function, **openaiChatCompletions**, has been added to simplify calls to the OpenAI API.
6. **New Exported Utility Functions:**
   The source file now exports several new utility functions to aid in common text and issue processing tasks:
   - `generateUsage()`: Returns a usage message string.
   - `reverseArgs(args)`: Returns a reversed copy of an arguments array.
   - `toUpperCaseArgs(args)`: Converts all arguments to uppercase.
   - `toLowerCaseArgs(args)`: Converts all arguments to lowercase.
   - `shuffleArgs(args)`: Returns a new array with elements shuffled randomly.
   - `sortArgs(args)`: Returns a sorted copy of the arguments array.
   - `duplicateArgs(args)`: Returns a new array with each argument duplicated.
   - `countArgs(args)`: Returns the count of arguments.
   - `getIssueNumberFromBranch(branch, prefix)`: Extracts a numeric issue from a branch name given a specific prefix.
   - `sanitizeCommitMessage(message)`: Sanitizes a commit message to remove unwanted characters.
7. Review the test suite in `tests/unit/` for current functionality. New tests have been added for these utility functions.
8. Examine the workflows in `.github/workflows/` to understand automated improvements.
9. Read through the contributing guidelines below.
10. Execute `npm run start` to observe the CLI output. **Note:** In production, the program terminates automatically after displaying usage and demo output.
11. Run `npm test` to ensure that all tests pass.
12. Use the updated transformation logic and API wrappers as a baseline and suggest further enhancements if needed.
13. Identify areas for improvement in error messaging, interactive command suggestions, and flag conflict resolution.
14. Leverage automated tools and LLM feedback to propose one enhancement at a time.
15. Validate changes by running the full test suite and build scripts.
16. Update documentation as new features are added or existing behavior evolves.
17. Create a feature branch and submit a pull request with your improvements.
18. Engage with automated workflows that test and merge your contributions.
19. Monitor CI/CD pipelines for further iterative suggestions.
20. Enjoy the evolution, one automated update at a time.

---
---

## Future Features

- Enhanced CLI argument parsing with conflict detection and suggestion capabilities.
- Improved error messaging and logging for clearer user guidance.
- Interactive command suggestions to assist in flag usage.
- Extended automated tests covering additional edge cases.
- Integration of advanced GitHub Actions workflows for deeper automation.
- **Upcoming Feature:** Real-time validation of flag combinations and immediate user feedback.
- **Upcoming Feature:** Interactive prompt mode for enhanced user experience.
- **Upcoming Feature:** Additional flag functionalities to further enhance text transformation.

---
---

## New Exported Utility Functions

The source file now exports the following utility functions to help with various operations:
- `generateUsage()`: Provides a standardized usage message.
- `reverseArgs(args)`, `toUpperCaseArgs(args)`, `toLowerCaseArgs(args)`: Basic text transformations.
- `shuffleArgs(args)`, `sortArgs(args)`, `duplicateArgs(args)`, `countArgs(args)`: Array manipulation utilities.
- `getIssueNumberFromBranch(branch, prefix)`: Extracts an issue number from a branch name based on a prefix.
- `sanitizeCommitMessage(message)`: Cleans commit messages for consistency in version control.

## License

This project is licensed under the GNU General Public License (GPL). See [LICENSE](LICENSE) for details.

License notice:
```
agentic-lib
Copyright (C) 2025 Polycode Limited

agentic-lib is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
along with this program. If not, see <https://www.gnu.org/licenses/>

IMPORTANT: Any derived work must include the following attribution:
"This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"
```

---
---

## Contributing Guidelines

Thank you for your interest in contributing to **agentic‑lib**! This document outlines our guidelines for human and automated contributions, ensuring that our core library remains robust, testable, and efficient in powering our reusable GitHub Workflows.

### Mission Statement

**agentic‑lib** is a JavaScript library which can be used as a drop-in JS implementation or wholesale replacement for the steps, jobs, and reusable workflows in this repository. It is designed to be used in a GitHub Actions workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.

Concatenated source from the GitHub workflow files to implement as JavaScript (Node 20 / ESM) functions in a library:
START_OF_CONCATENATED_WORKFLOW_FILES
```
./.github/FUNDING.yml
==== Content of ./.github/FUNDING.yml ====
github: Antony-at-Polycode
# paypal: https://www.paypal.com/donate/?hosted_button_id=Y8PK8XP3EJLWG
./.github/workflows/wfr-review-issue.yml
==== Content of ./.github/workflows/wfr-review-issue.yml ====
# .github/workflows/wfr-review-issue.yml

#
# agentic-lib
# Copyright (C) 2025 Polycode Limited
#
# This file is part of agentic-lib.
#
# agentic-lib is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License v3.0 (GPL‑3).
# along with this program. If not, see <https://www.gnu.org/licenses/>
#
# IMPORTANT: Any derived work must include the following attribution:
# "This work is derived from https://github.com/xn-intenton-z2a/agentic-lib"

name: ∞ Review issue

on:
  workflow_call:
    inputs:
      issueNumber:
        description: 'The issue number to review. e.g. "123"'
        type: string
        required: true
      target:
        description: 'The target file to review. e.g. "src/lib/main.js"'
        type: string
        required: false
        default: 'src/lib/main.js'
      testFile:
        description: 'The test file to review. e.g. "tests/unit/main.test.js"'
        type: string
        required: false
        default: 'tests/unit/main.test.js'
      readmeFile:
        description: 'The README file to review. e.g. "README.md"'
        type: string
        required: false
        default: 'README.md'
      contributingFile:
        description: 'The CONTRIBUTING file to review. e.g. "CONTRIBUTING.md"'
        type: string
        required: false
        default: 'CONTRIBUTING.md'
      dependenciesFile:
        description: 'The dependencies file to review. e.g. "package.json"'
        type: string
        required: false
        default: 'package.json'
      buildScript:
        description: 'The script must be runnable as: `npm ci ; <script>` and succeed with a zero exit code. e.g. `npm run build`'
        type: string
        required: false
        default: 'echo "No build script specified."'
      testScript:
        description: 'The script must be runnable as: `npm ci ; <script>` and succeed with a zero exit code. e.g. `npm test`'
        type: string
        required: false
        default: 'npm test'
      mainScript:
        description: 'The script must be runnable as: `npm ci ; <script>` and succeed with a zero exit code. e.g. `npm run start`'
        type: string
        required: false
        default: 'npm run start'
      model:
        description: 'The OpenAI model to use. e.g. "o3-mini"'
        type: string
        required: false
        default: ${{ vars.CHATGPT_API_MODEL || 'o3-mini' }}
    secrets:
      PERSONAL_ACCESS_TOKEN:
        required: false
      CHATGPT_API_SECRET_KEY:
        required: true
    outputs:
      fixed:
        value: ${{ jobs.review-issue.outputs.fixed }}

jobs:
  review-issue:
    runs-on: ubuntu-latest

    env:
      issueNumber: ${{ inputs.issueNumber }}
      target: ${{ inputs.target || 'src/lib/main.js' }}
      testFile: ${{ inputs.testFile || 'tests/unit/main.test.js' }}
      readmeFile: ${{ inputs.readmeFile || 'README.md' }}
      contributingFile: ${{ inputs.contributingFile || 'CONTRIBUTING.md' }}
      dependenciesFile: ${{ inputs.dependenciesFile || 'package.json' }}
      buildScript: ${{ inputs.buildScript || 'npm run build' }}
      testScript: ${{ inputs.testScript || 'npm test' }}
      mainScript: ${{ inputs.mainScript || 'npm run start' }}
      mainScriptTimeout: '5m'
      model: ${{ inputs.model || vars.CHATGPT_API_MODEL || 'o3-mini' }}
      chatgptApiSecretKey: ${{ secrets.CHATGPT_API_SECRET_KEY }}

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Check GitHub authentication
        if: ${{ env.npmAuthOrganisation != '' }}
        shell: bash
        run: |
          curl --include --header "Authorization: token ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}" https://api.github.com/user

      - name: Set up .npmrc
        if: ${{ env.npmAuthOrganisation != '' }}
        shell: bash
        run: |
          echo "${{ env.npmAuthOrganisation }}:registry=https://npm.pkg.github.com" >> .npmrc
          echo "//npm.pkg.github.com/:_authToken=${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}" >> .npmrc
          echo "always-auth=true" >> .npmrc

      - run: npm ci

      - name: List dependencies
        id: list
        shell: bash
        run: |
          output=$(npm list 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"

      - name: Build project
        id: build
        shell: bash
        run: |
          output=$(${{ env.buildScript }} 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"

      - name: Tear down .npmrc
        if: ${{ env.npmAuthOrganisation != '' }}
        shell: bash
        run: rm -f .npmrc

      - name: Run tests
        id: test
        shell: bash
        run: |
          output=$(${{ env.testScript }} 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"

      - name: Run main
        id: main
        shell: bash
        run: |
          output=$(timeout ${{ env.mainScriptTimeout }} ${{ env.mainScript }} 2>&1)
          echo "output<<EOF" >> "$GITHUB_OUTPUT"
          echo "$output" >> "$GITHUB_OUTPUT"
          echo "EOF" >> "$GITHUB_OUTPUT"
          echo "output=${output}"

      - name: update-target
        id: update-target
        uses: actions/github-script@v7
        env:
          dependenciesListOutput: ${{ steps.list.outputs.output }}
          buildOutput: ${{ steps.build.outputs.output }}
          testOutput: ${{ steps.test.outputs.output }}
          mainOutput: ${{ steps.main.outputs.output }}
        with:
          github-token: ${{ secrets.PERSONAL_ACCESS_TOKEN || secrets.GITHUB_TOKEN }}
          script: |
            const target = process.env.target;
            const testFile = process.env.testFile;
            const readmeFile = process.env.readmeFile;
            const contributingFile = process.env.contributingFile;
            const dependenciesFile = process.env.dependenciesFile;
            const formattingFile = process.env.formattingFile;
            const lintingFile = process.env.lintingFile;
            const model = process.env.model;
            const apiKey = process.env.chatgptApiSecretKey;
            const issueNumber = parseInt(process.env.issueNumber);
            const dependenciesListOutput = process.env.dependenciesListOutput;
            const buildScript = process.env.buildScript;
            const buildOutput = process.env.buildOutput;
            const testScript = process.env.testScript;
            const testOutput = process.env.testOutput;
            const mainScript = process.env.mainScript;
            const mainOutput = process.env.mainOutput;
            
            const fs = require('fs');
            const OpenAI = require('openai').default;
            const { z } = require('zod');
            require('dotenv').config();
            
            if (!apiKey) { 
              core.setFailed("Missing CHATGPT_API_SECRET_KEY"); 
            }
            const openai = new OpenAI({ apiKey });
            
            core.info(`target: "${target}"`);
            core.info(`testFile: "${testFile}"`);
            core.info(`readmeFile: "${readmeFile}"`);
            core.info(`contributingFile: "${contributingFile}"`);
            core.info(`dependenciesFile: "${dependenciesFile}"`);
            const sourceFileContent = fs.readFileSync(target, 'utf8');
            const testFileContent = fs.readFileSync(testFile, 'utf8');
            const readmeFileContent = fs.readFileSync(readmeFile, 'utf8');
            const contributingFileContent = fs.readFileSync(contributingFile, 'utf8');
            const dependenciesFileContent = fs.readFileSync(dependenciesFile, 'utf8');
            core.info(`Target file '${target}' has been loaded (length ${sourceFileContent.length}).`);
            core.info(`Test file '${testFile}' has been loaded (length ${testFileContent.length}).`);
            core.info(`Readme file '${readmeFile}' has been loaded (length ${readmeFileContent.length}).`);
            core.info(`Dependencies file '${dependenciesFile}' has been loaded (length ${dependenciesFileContent.length}).`);
            
            const issue = await github.rest.issues.get({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: issueNumber
            });
            const issueTitle = issue.data.title;
            const issueDescription = issue.data.body;
            const issueComments = await github.rest.issues.listComments({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: issueNumber
            });
            const issueCommentsText = issueComments.data
              .map(comment => `Author:${comment.user.login}, Created:${comment.created_at}, Comment: ${comment.body}`)
              .join('\n');
            
            const prompt = `
            You are providing the entire new content of the source file, test file and README file with all necessary changes applied to resolve an issue.
            Consider the following when refining your response:
            * Source file content
            * Test file content
            * README file content issue
            * Contributing file content
            * Dependencies file content
            * Formatting file content
            * Linting file content
            * Issue details
            * Dependency list
            * Build output
            * Test output
            * Main execution output
            
            Apply the contributing guidelines to your response and when suggesting enhancements consider the tone and direction of the contributing guidelines.
            
            Source file: ${target}
            SOURCE_FILE_START
            ${sourceFileContent}
            SOURCE_FILE_END
            
            Test file: ${testFile}
            TEST_FILE_START
            ${testFileContent}
            TEST_FILE_END

            README file: ${readmeFile}
            README_FILE_START
            ${readmeFileContent}
            README_FILE_END

            Contributing file: ${contributingFile}
            CONTRIBUTING_FILE_START
            ${contributingFileContent}
            CONTRIBUTING_FILE_END
            
            Dependencies file: ${dependenciesFile}
            DEPENDENCIES_FILE_START
            ${dependenciesFileContent}
            DEPENDENCIES_FILE_END
            
            Formatting file: ${formattingFile}
            FORMATTING_FILE_START
            ${formattingFileContent}
            FORMATTING_FILE_END
            
            Linting file: ${lintingFile}
            LINTING_FILE_START
            ${lintingFileContent}
            LINTING_FILE_END        

            Dependencies list from command: npm list
            DEPENDENCIES_LIST_START
            ${dependenciesListOutput}
            DEPENDENCIES_LIST_END    
            
            Build output from command: ${buildScript}
            BUILD_OUTPUT_START
            ${buildOutput}
            BUILD_OUTPUT_END      
            
            Test output from command: ${testScript}
            TEST_OUTPUT_START
            ${testOutput}
            TEST_OUTPUT_END            

            Main execution output from command: ${mainScript}
            MAIN_OUTPUT_START
            ${mainOutput}
            MAIN_OUTPUT_END    
            
            Please produce an updated version of the source file, and test file, and README and dependencies file that resolves the issue.
            Answer strictly with a JSON object following this schema:
            
            {
              "updatedSourceFileContent": "The entire new content of the source file, with all necessary changes applied.",
              "updatedTestFileContent": "The entire new content of the test file, with all necessary changes applied.",
              "updatedReadmeFileContent": "The entire new content of the README file, with all necessary changes applied.",
              "updatedDependenciesFileContent": "The entire new content of the dependencies file, with all necessary changes applied.",
              "message": "A short sentence explaining the change applied suitable for a commit message."
            }
            Ensure valid JSON.
            `;
            
            const ResponseSchema = z.object({ updatedSourceFileContent: z.string(), updatedTestFileContent: z.string(), updatedReadmeFileContent: z.string(), updatedDependenciesFileContent: z.string(), message: z.string() });
            
            // Define the function schema for functional calling
            const applyIssueResolutionToSource = [{
              type: "function",
              function: {
                name: "applyIssueResolutionToSource",
                description: "Return an updated version of the source file content along with a commit message. Use the provided source file content and supporting context to generate the update.",
                parameters: {
                  type: "object",
                  properties: {
                    updatedSourceFileContent: {
                      type: "string",
                      description: "The entire new content of the source file, with all necessary changes applied."
                    },
                    updatedTestFileContent: {
                      type: "string",
                      description: "The entire new content of the test file, with all necessary changes applied."
                    },
                    updatedReadmeFileContent: {
                      type: "string",
                      description: "The entire new content of the README file, with all necessary changes applied."
                    },
                    updatedDependenciesFileContent: {
                      type: "string",
                      description: "The entire new content of the dependencies file, with all necessary changes applied."
                    },
                    message: {
                      type: "string",
                      description: "A short sentence explaining the change applied suitable for a commit message."
                    }
                  },
                  required: ["updatedSourceFileContent", "updatedTestFileContent", "updatedReadmeFileContent", "updatedDependenciesFileContent", "message"],
                  additionalProperties: false
                },
                strict: true
              }
            }];
            
            // Call OpenAI using the function calling format via the tools parameter
            const response = await openai.chat.completions.create({
              model,
              messages: [
                { role: "system", content: "You are a code fixer that returns an updated source file content, test file content, README file content and dependencies file content to resolve an issue. Answer strictly with a JSON object that adheres to the provided function schema." },
                { role: "user", content: prompt }
              ],
              tools: applyIssueResolutionToSource
            });
            
            let fixApplied;
            let result;
            // Check if the model made a function call; if so, parse its arguments.
            if (response.choices[0].message.tool_calls && response.choices[0].message.tool_calls.length > 0) {
              try {
                result = JSON.parse(response.choices[0].message.tool_calls[0].function.arguments);
              } catch (e) {
                fixApplied = false;
                core.setFailed(`Failed to parse function call arguments: ${e.message}`);
              }
            } else if (response.choices[0].message.content) {
              try {
                result = JSON.parse(response.choices[0].message.content);
              } catch (e) {
                fixApplied = false;
                core.setFailed(`Failed to parse response content: ${e.message}`);
              }
            } else {
              fixApplied = false;
              core.setFailed("No valid response received from OpenAI.");
            }
            
            try {
              const parsed = ResponseSchema.parse(result);
              // Sanitize commit message: retain only alphanumerics, spaces, and basic URL-safe punctuation (-, _, ., ~)
              const sanitizedMessage = parsed.message.replace(/[^A-Za-z0-9 \-\_\.\~]/g, '').replace(/\s+/g, ' ').trim();
              core.setOutput("message", sanitizedMessage);
              core.info(`message: "${sanitizedMessage}"`);
            
              if(parsed.updatedSourceFileContent && parsed.updatedSourceFileContent.length > 1 && parsed.updatedSourceFileContent !== sourceFileContent) {
                fs.writeFileSync(target, parsed.updatedSourceFileContent, 'utf8');
                fixApplied = true;
                core.info(`Target file '${target}' has been updated (length ${parsed.updatedSourceFileContent.length}).`);
              }
              if(parsed.updatedTestFileContent && parsed.updatedTestFileContent.length > 1 && parsed.updatedTestFileContent !== testFileContent) {
                fs.writeFileSync(testFile, parsed.updatedTestFileContent, 'utf8');
                fixApplied = true;
                core.info(`Test file '${testFile}' has been updated (length ${parsed.updatedTestFileContent.length}).`);
              }
              if(parsed.updatedReadmeFileContent && parsed.updatedReadmeFileContent.length > 1 && parsed.updatedReadmeFileContent !== readmeFileContent) {
                fs.writeFileSync(readmeFile, parsed.updatedReadmeFileContent, 'utf8');
                fixApplied = true;
                core.info(`Readme file '${readmeFile}' has been updated (length ${parsed.updatedReadmeFileContent.length}).`);
              }
              if(parsed.updatedDependenciesFileContent && parsed.updatedDependenciesFileContent.length > 1 && parsed.updatedDependenciesFileContent !== dependenciesFileContent) {
                fs.writeFileSync(dependenciesFile, parsed.updatedDependenciesFileContent, 'utf8');
                fixApplied = true;
                core.info(`Dependencies file '${dependenciesFile}' has been updated (length ${parsed.updatedDependenciesFileContent.length}).`);
              }

              await github.rest.issues.createComment({
                owner: context.repo.owner,
                repo: context.repo.repo,
                issue_number: issueNumber,
                body: parsed.message
              });
            } catch (e) {
              fixApplied = false;
              core.setFailed(`Failed to validate or process the response: ${e.message}`);
            }
            
            core.setOutput("fixApplied", fixApplied);
            core.setOutput("usage", JSON.stringify(response.usage));
            core.info(`fixApplied: "${fixApplied}"`);
            core.info(`usage: "${JSON.stringify(response.usage)}"`);
            core.info(`response: "${JSON.stringify(response)}"`);

      - run: cat ${{ env.target }}

      - name: Examine the git working copy
        shell: bash
        run: |
          git config --local user.email '${{ env.gitUserEmail }}'
          git config --local user.name '${{ env.gitUserName }}'
          git status -v
          git diff ${{ env.target }}

      - run: |
          set +e
          npm install
          exit 0

      - name: Test after update
        shell: bash
        run: |
          set +e
          ${{ env.testScript }}
          exit 0

      - name: Run main after update
        shell: bash
        run: |
          set +e
          timeout ${{ env.mainScriptTimeout }} ${{ env.mainScript }}
          exit 0

      - name: Commit changes
        id: commit
        continue-on-error: true
        run: |
          git config --local user.email '${{ env.gitUserEmail }}'
          git config --local user.name '${{ env.gitUserName }}'
          git status -v
          git add -v --all
          git diff '${{ env.target }}'
          git commit -m '${{ steps.update-target.outputs.message }}'
          git status -v

    outputs:
      fixApplied: ${{ steps.update-target.outputs.fixApplied }}
      message: ${{ steps.update-target.outputs.message }}
