# GITHUB_CLI

## Crawl Summary
Installation: brew install gh, download options for Mac/Windows/Linux. Configuration: gh auth login uses GitHub account or GITHUB_TOKEN; set editor with gh config set editor <editor>; define aliases with gh alias set. Enterprise: gh auth login --hostname <hostname> and export GH_HOST, export GH_ENTERPRISE_TOKEN. Support: use Discussions and issue tracker. Core commands include gh auth, gh browse, gh pr, gh repo, etc. Alias commands: gh alias set, delete, import, list. API command: gh api with options --method, -f, -F, --header, --paginate, --jq, --template. Attestation commands: gh attestation download, trusted-root, verify with flags -d, -L, --hostname, -o, -R, --predicate-type.

## Normalised Extract
Table of Contents:
1. Installation
2. Configuration
3. GitHub Enterprise
4. Support
5. Core Commands
6. Alias Commands
7. API Command
8. Attestation Commands

1. Installation:
- Use command: brew install gh
- Alternative downloads: Download for Mac, Windows, Linux
- Reference: README for detailed instructions

2. Configuration:
- Authenticate: gh auth login (uses GitHub account or GITHUB_TOKEN)
- Set editor: gh config set editor <editor>
- Configure aliases: gh alias set <alias> <expansion>

3. GitHub Enterprise:
- Authenticate with enterprise host: gh auth login --hostname <hostname>
- Set default enterprise host: export GH_HOST=<hostname>
- For automation, set: export GH_ENTERPRISE_TOKEN=<access-token>

4. Support:
- Engage via Discussions for usage queries
- Report bugs and feature requests via issue tracker

5. Core Commands:
- Commands include: gh auth, gh browse, gh codespace, gh gist, gh issue, gh org, gh pr, gh project, gh release, gh repo
- GitHub Actions commands: gh cache, gh run, gh workflow
- Additional commands: gh alias, gh api, gh attestation, gh completion, gh config, etc.

6. Alias Commands:
- Define alias: gh alias set <alias> <expansion> [--clobber] [--shell]
- Delete alias: gh alias delete {<alias> | --all}
- Import alias from YAML: gh alias import [<filename> | -] [--clobber]
- List aliases: gh alias list (alias: gh alias ls)

7. API Command:
- Basic usage: gh api <endpoint> [flags]
- Default method: GET, switches to POST when parameters added
- Options:
  --method <string> (default "GET")
  -f/--raw-field <key=value> (string parameters)
  -F/--field <key=value> (typed parameters)
  --header <key:value>
  --input <file>
  --jq <string>
  --paginate, --slurp, --template, --verbose

8. Attestation Commands:
- Download: gh attestation download [<file-path> | oci://<image-uri>] with options:
  -d, --digest-alg <string> (default "sha256")
  -L, --limit <int> (default 30)
  --hostname <string>
  -o, --owner <string>
  -R, --repo <string>
  --predicate-type <string>
- Trusted-root: gh attestation trusted-root [--tuf-url <url> --tuf-root <file-path>] [--verify-only]
- Verify: gh attestation verify [<file-path> | oci://<image-uri>] [--owner | --repo] [additional flags]

## Supplementary Details
Installation Options:
- Command: brew install gh, Download links provided in README

Configuration Details:
- Authentication command: gh auth login
- Editor setting: gh config set editor <editor>
- Alias configuration: gh alias set <alias> <expansion>

Enterprise Configuration:
- Command: gh auth login --hostname <hostname>
- Environment variables: export GH_HOST=<hostname> and export GH_ENTERPRISE_TOKEN=<access-token>

API Command Specifications:
- Endpoint string format: repos/{owner}/{repo}/issues etc.
- Method override: --method with default GET
- Field parameters: -F for typed conversion (true, false, null, integers, and file input with @)
- Query filtering: --jq with jq syntax
- Pagination: --paginate with --slurp to combine pages

Alias command specifications:
- Set alias: gh alias set <alias> <expansion> [flags] (--clobber to overwrite, --shell for shell evaluation)
- Delete alias: gh alias delete {<alias>|--all}
- Import aliases from YAML: file structure as key: value mapping

Attestation command specifications:
- Download command: gh attestation download with parameters -d (default sha256), -L (default 30), --hostname, -o, -R, --predicate-type
- Trusted-root command: gh attestation trusted-root with options --tuf-url, --tuf-root, --verify-only
- Verification command: gh attestation verify with artifact file path or OCI URI and flags for owner/repo

Troubleshooting Procedures:
- For authentication issues, verify GITHUB_TOKEN environment variable and use gh auth login
- For alias errors, run gh alias list to check current alias definitions
- For API errors, use --verbose flag to print full HTTP request/response and check header settings
- If pagination fails, ensure --paginate and --slurp flags are correctly applied and endpoint supports pagination

## Reference Details
API and SDK Specifications:
1. gh auth login
   - Signature: gh auth login [--with-token]
   - Parameters: none required; supports environment variable GITHUB_TOKEN for auth
   - Returns: Authentication success message or error

2. gh config set editor <editor>
   - Signature: gh config set editor <editor>
   - Parameters: <editor> (string)
   - Returns: Confirmation of editor set

3. gh alias set <alias> <expansion> [flags]
   - Signature: gh alias set <alias> <expansion> [--clobber] [--shell]
   - Parameters: <alias> (string), <expansion> (command string, may include positional placeholders like $1)
   - Returns: Confirmation message; error if alias exists and --clobber not specified
   - Example: gh alias set pv 'pr view'

4. gh api <endpoint> [flags]
   - Signature: gh api <endpoint> [flags]
   - Parameters:
       --method <string> (default "GET")
       -f, --raw-field <key=value>
       -F, --field <key=value>
       --header <key:value>
       --input <file>
       --jq <string>
       --paginate
       --slurp
       --template <string>
       --verbose
   - Returns: JSON output of the API response
   - Example: gh api repos/{owner}/{repo}/issues --jq '.[].title'

5. gh attestation download [<file-path> | oci://<image-uri>] [--owner | --repo] [flags]
   - Signature: gh attestation download <artifact> [--owner <org>] [--repo <owner/repo>] [flags]
   - Parameters:
       -d, --digest-alg <string> default: "sha256"
       -L, --limit <int> default: 30
       --hostname <string>
       -o, --owner <string>
       -R, --repo <string>
       --predicate-type <string>
   - Returns: Artifact digest file named using digest algorithm (e.g., sha256-1234.jsonl) or error
   - Example: gh attestation download oci://example.com/foo/bar:latest -o github

6. gh attestation trusted-root [--tuf-url <url> --tuf-root <file-path>] [--verify-only]
   - Signature: gh attestation trusted-root [--tuf-url <url>] [--tuf-root <file-path>] [--verify-only]
   - Parameters: as specified; returns trusted_root.jsonl contents or verification only status

7. gh attestation verify [<file-path> | oci://<image-uri>] [--owner | --repo] [flags]
   - Signature: gh attestation verify <artifact> [--owner <org>] [--repo <owner/repo>] [additional flags]
   - Parameters: file path or OCI URI, flag options for identity enforcement (--signer-workflow, --cert-identity)
   - Returns: JSON array of verified attestations with verificationResult details

Best Practices:
- Always set up environment variables (GITHUB_TOKEN, GH_HOST, GH_ENTERPRISE_TOKEN) for secure authentication.
- Use --clobber when updating aliases to avoid conflicts.
- For API calls, verify output with --verbose in case of errors.
- When using attestation commands, confirm file naming conventions and handle special characters on Windows by expecting dashes instead of colons.

Troubleshooting:
- Authentication errors: run gh auth login and check GITHUB_TOKEN
- Alias failures: run gh alias list to verify current settings
- API call errors: use --verbose and check HTTP headers
- Attestation issues: verify artifact file path and owner/repo flags, and check network connectivity


## Information Dense Extract
Installation: brew install gh; Download for Mac/Windows/Linux; Configuration: gh auth login (GITHUB_TOKEN), gh config set editor <editor>, gh alias set; Enterprise: gh auth login --hostname <hostname>, export GH_HOST, export GH_ENTERPRISE_TOKEN; Core Commands: gh auth, gh browse, gh pr, gh repo, etc; Alias: gh alias set/delete/import/list with flags --clobber, --shell; API: gh api <endpoint> with --method, -f, -F, --header, --input, --jq, --paginate, --slurp, --template, --verbose; Attestation: gh attestation download (flags: -d (sha256), -L (30), --hostname, -o, -R, --predicate-type), trusted-root (flags: --tuf-url, --tuf-root, --verify-only), verify (artifact file/oci uri, --owner, --repo)

## Sanitised Extract
Table of Contents:
1. Installation
2. Configuration
3. GitHub Enterprise
4. Support
5. Core Commands
6. Alias Commands
7. API Command
8. Attestation Commands

1. Installation:
- Use command: brew install gh
- Alternative downloads: Download for Mac, Windows, Linux
- Reference: README for detailed instructions

2. Configuration:
- Authenticate: gh auth login (uses GitHub account or GITHUB_TOKEN)
- Set editor: gh config set editor <editor>
- Configure aliases: gh alias set <alias> <expansion>

3. GitHub Enterprise:
- Authenticate with enterprise host: gh auth login --hostname <hostname>
- Set default enterprise host: export GH_HOST=<hostname>
- For automation, set: export GH_ENTERPRISE_TOKEN=<access-token>

4. Support:
- Engage via Discussions for usage queries
- Report bugs and feature requests via issue tracker

5. Core Commands:
- Commands include: gh auth, gh browse, gh codespace, gh gist, gh issue, gh org, gh pr, gh project, gh release, gh repo
- GitHub Actions commands: gh cache, gh run, gh workflow
- Additional commands: gh alias, gh api, gh attestation, gh completion, gh config, etc.

6. Alias Commands:
- Define alias: gh alias set <alias> <expansion> [--clobber] [--shell]
- Delete alias: gh alias delete {<alias> | --all}
- Import alias from YAML: gh alias import [<filename> | -] [--clobber]
- List aliases: gh alias list (alias: gh alias ls)

7. API Command:
- Basic usage: gh api <endpoint> [flags]
- Default method: GET, switches to POST when parameters added
- Options:
  --method <string> (default 'GET')
  -f/--raw-field <key=value> (string parameters)
  -F/--field <key=value> (typed parameters)
  --header <key:value>
  --input <file>
  --jq <string>
  --paginate, --slurp, --template, --verbose

8. Attestation Commands:
- Download: gh attestation download [<file-path> | oci://<image-uri>] with options:
  -d, --digest-alg <string> (default 'sha256')
  -L, --limit <int> (default 30)
  --hostname <string>
  -o, --owner <string>
  -R, --repo <string>
  --predicate-type <string>
- Trusted-root: gh attestation trusted-root [--tuf-url <url> --tuf-root <file-path>] [--verify-only]
- Verify: gh attestation verify [<file-path> | oci://<image-uri>] [--owner | --repo] [additional flags]

## Original Source
GitHub CLI Documentation
https://cli.github.com/manual/

## Digest of GITHUB_CLI

# GitHub CLI Manual

Date Retrieved: 2023-10-12

## Installation

- Install using Homebrew: brew install gh
- Download options available for Mac, Windows, and Linux
- Installation instructions are provided in the README

## Configuration

- Authentication: Run gh auth login to authenticate with your GitHub account
- Environment variable: GITHUB_TOKEN is also recognized for authentication
- Editor configuration: gh config set editor <editor>
- Alias declarations: gh alias set <alias> <expansion>

## GitHub Enterprise

- Supported on GitHub Enterprise Server 2.20 and above
- Authenticate with a specific host: gh auth login --hostname <hostname>
- Set default host for commands: export GH_HOST=<hostname>
- Automation token: export GH_ENTERPRISE_TOKEN=<access-token>

## Support

- Usage questions and feedback through Discussions
- Report bugs or feature requests via the issue tracker

## Core Commands

- Basic commands include: gh auth, gh browse, gh codespace, gh gist, gh issue, gh org, gh pr, gh project, gh release, gh repo
- GitHub Actions related commands: gh cache, gh run, gh workflow
- Additional commands: gh alias, gh api, gh attestation, gh completion, gh config, gh extension, gh gpg-key, gh label, gh ruleset, gh search, gh secret, gh ssh-key, gh status, gh variable

## Alias Commands

- Create alias: gh alias set <alias> <expansion> [flags]
- Delete alias: gh alias delete {<alias> | --all} [flags]
- Import aliases from YAML: gh alias import [<filename> | -] [flags]
- List aliases: gh alias list

## API Command

- General usage: gh api <endpoint> [flags]
- Supports GET (default) and POST (when parameters are provided)
- Flags and parameters:
  --method <string> (default "GET")
  -f/--raw-field <key=value>
  -F/--field <key=value>
  --header <key:value>
  --input <file>
  --jq <string>
  --paginate, --slurp, --template, and --verbose

## Attestation Commands

- Download attestations: gh attestation download [<file-path> | oci://<image-uri>] [--owner | --repo] [flags]
  Options:
    -d, --digest-alg <string> (default "sha256")
    -L, --limit <int> (default 30)
    --hostname <string>
    -o, --owner <string>
    -R, --repo <string>
    --predicate-type <string>
- Trusted-root retrieval: gh attestation trusted-root [--tuf-url <url> --tuf-root <file-path>] [--verify-only] [flags]
- Attestation verification: gh attestation verify [<file-path> | oci://<image-uri>] [--owner | --repo] [flags]

## Examples

- Creating an issue: gh issue create
- Cloning a repository: gh repo clone cli/cli
- Checking out a pull request: gh pr checkout 12
- Setting an alias: gh alias set pv 'pr view'
- API usage: gh api repos/{owner}/{repo}/issues --jq '.[].title'

## Attribution

Data Size: 425800 bytes, Links Found: 38049, Error: None

## Attribution
- Source: GitHub CLI Documentation
- URL: https://cli.github.com/manual/
- License: License: Not specified
- Crawl Date: 2025-04-25T18:34:17.821Z
- Data Size: 425800 bytes
- Links Found: 38049

## Retrieved
2025-04-25
