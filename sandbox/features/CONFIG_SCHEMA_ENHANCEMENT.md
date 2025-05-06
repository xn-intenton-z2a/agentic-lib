# Purpose
Enhance the environment configuration schema to include and enforce the presence of a GitHub access token for authenticated API operations.

# Value Proposition
Centralizes validation of the GITHUB_TOKEN parameter, ensuring all GitHub-related functions have a valid token available at runtime. This reduces repetitive error handling, surfaces misconfiguration early, and improves developer experience by catching missing credentials during startup rather than at API call time.

# Success Criteria & Requirements
* Extend the `configSchema` in `src/lib/main.js` to include a required, non-empty `GITHUB_TOKEN` field.
* On startup, parsing the environment should throw a descriptive error if `GITHUB_TOKEN` is missing or empty.
* Document the new `GITHUB_TOKEN` requirement in the README under the Configuration section.
* Maintain backward compatibility for existing, non–GitHub-authenticated utilities (they can ignore the token). 

# Implementation Details
1. In `src/lib/main.js` update the zod `configSchema` to include:
   ```js
   GITHUB_TOKEN: z.string().nonempty()
   ```
2. Ensure `config = configSchema.parse(process.env)` will fail early when GitHub operations are invoked and token is not provided.
3. In the Configuration subsection of `README.md`, add `GITHUB_TOKEN` as a required environment variable for GitHub API functions, with an example:
   ```env
   GITHUB_TOKEN=your_github_token_here
   ```
4. No new files should be created or deleted; only modify `src/lib/main.js` and `README.md`.

# Verification & Acceptance
* Startup of the CLI (`node src/lib/main.js --help`) should throw a clear zod validation error if `GITHUB_TOKEN` is not set.
* Add a unit test in `tests/unit/main.test.js` mocking `process.env` without `GITHUB_TOKEN` and expect `configSchema.parse` to throw.
* Run `npm test` to confirm no regressions and that the new validation test passes.
