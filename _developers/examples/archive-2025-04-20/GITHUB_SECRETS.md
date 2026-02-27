# GITHUB_SECRETS

## Crawl Summary
This document includes detailed technical steps and configuration details for managing GitHub Actions secrets. It covers creation of repository, environment, and organization secrets, usage in workflows with explicit YAML examples, CLI commands (gh secret set, gh secret list), limitations (number of secrets, size limits), encryption of large secrets using GPG, decryption shell scripts, handling of Base64 encoded binary secrets, and redaction best practices. Each section provides exact commands, configuration flags, and code samples for immediate developer use.

## Normalised Extract
## Table of Contents
1. Creating Secrets for a Repository
2. Creating Secrets for an Environment
3. Creating Secrets for an Organization
4. Using Secrets in Workflows
5. Limits for Secrets
6. Storing Large Secrets
7. Storing Base64 Binary Blobs
8. Redacting Secrets from Workflow Logs

---

### 1. Creating Secrets for a Repository
- Steps: Navigate > Settings > Security > Secrets and Variables > Actions > Secrets tab > New repository secret
- CLI:
  - Set secret: `gh secret set SECRET_NAME`
  - Read from file: `gh secret set SECRET_NAME < secret.txt`
  - List secrets: `gh secret list`

### 2. Creating Secrets for an Environment
- Steps: Navigate > Settings > Environments > Select environment > Add secret
- CLI:
  - Set environment secret: `gh secret set --env ENV_NAME SECRET_NAME`
  - List environment secrets: `gh secret list --env ENV_NAME`

### 3. Creating Secrets for an Organization
- Steps: Navigate to organization > Settings > Security > Secrets and Variables > Actions > New organization secret
- Options: Set repository access policy (all, private, or specific repos)
- CLI:
  - Login with scopes: `gh auth login --scopes "admin:org"`
  - Set org secret: `gh secret set --org ORG_NAME SECRET_NAME`
  - With visibility: `gh secret set --org ORG_NAME SECRET_NAME --visibility all`
  - With repo restrictions: `gh secret set --org ORG_NAME SECRET_NAME --repos REPO1,REPO2`
  - List secrets: `gh secret list --org ORG_NAME`

### 4. Using Secrets in Workflows
- Reference in YAML:
  - As input: `${{ secrets.SuperSecret }}`
  - As environment variable: `env:
      super_secret: ${{ secrets.SuperSecret }}`
- Code examples for Bash, PowerShell, Cmd.exe provided with correct quoting.

### 5. Limits for Secrets
- Repository: 100 secrets; Environment: 100 secrets; Organization: up to 1,000 (with first 100 accessible).
- Size limit: 48 KB per secret.

### 6. Storing Large Secrets
- Encrypt using GPG: `gpg --symmetric --cipher-algo AES256 my_secret.json`
- Decrypt with shell script (decrypt_secret.sh) using the LARGE_SECRET_PASSPHRASE secret.
- Workflow integration provided with actions/checkout and decryption step.

### 7. Storing Base64 Binary Blobs
- Convert files to Base64 (e.g., `base64 -w 0 cert.der > cert.base64`)
- Set secret: `gh secret set CERTIFICATE_BASE64 < cert.base64`
- Decode in workflow and output to file.

### 8. Redacting Secrets from Workflow Logs
- GitHub Actions auto-redacts known secrets.
- Use `::add-mask::VALUE` for additional sensitive data.


## Supplementary Details
### Detailed Supplementary Technical Specifications

1. **Exact Command Parameters**:
   - `gh secret set SECRET_NAME`: Prompts for value; can use file redirection.
   - `gh secret list`: Lists existing secrets with no additional parameters by default.
   - For environment secrets: `gh secret set --env ENV_NAME SECRET_NAME` (flag `--env` or `-e` required).
   - For organization secrets: `gh secret set --org ORG_NAME SECRET_NAME` with optional flags `--visibility` (values: all) and `--repos` (comma-separated list).

2. **GPG Encryption Details**:
   - Command: `gpg --symmetric --cipher-algo AES256 my_secret.json`
   - Encryption uses AES256; prompts for passphrase. Ensure that the encrypted file retains the `.gpg` extension.
   - Decryption script must use `--quiet`, `--batch`, and `--yes` flags to automate decryption without interaction.

3. **Workflow YAML Specifications**:
   - Each step is defined with a `name`, `uses` or `run`, and `env` where applicable.
   - Example for decryption:
     ```yaml
     - name: Decrypt large secret
       run: ./decrypt_secret.sh
       env:
         LARGE_SECRET_PASSPHRASE: ${{ secrets.LARGE_SECRET_PASSPHRASE }}
     ```

4. **Best Practices**:
   - Never print secrets in logs.
   - Always use environment variables or STDIN for passing secrets.
   - For complex workflows, encapsulate secret decryption in a dedicated script and check permissions on the decryption script and output files.

5. **Troubleshooting Procedures**:
   - If decryption fails, verify that the passphrase stored in `LARGE_SECRET_PASSPHRASE` matches the one used during encryption.
   - Use `chmod +x decrypt_secret.sh` to ensure the script is executable.
   - In workflows, check the runner’s environment variables and file paths.
   - For Base64 decoding issues, verify the encoded string does not include newlines (use `-w 0` option on Linux).


## Reference Details
### Complete Reference API and Usage Specifications

1. **GitHub CLI Secret Commands**:
   - **Repository Secrets**:
     - Set secret:
       ```bash
       gh secret set SECRET_NAME
       ```
       *Prompts user for secret value or accepts input redirect from a file:*
       ```bash
       gh secret set SECRET_NAME < secret.txt
       ```
     - List secrets:
       ```bash
       gh secret list
       ```

   - **Environment Secrets**:
     - Set secret for environment:
       ```bash
       gh secret set --env ENV_NAME SECRET_NAME
       ```
     - List environment secrets:
       ```bash
       gh secret list --env ENV_NAME
       ```

   - **Organization Secrets**:
     - Login with required scopes (admin:org):
       ```bash
       gh auth login --scopes "admin:org"
       ```
     - Set secret (default to private repositories):
       ```bash
       gh secret set --org ORG_NAME SECRET_NAME
       ```
     - Set secret with full visibility:
       ```bash
       gh secret set --org ORG_NAME SECRET_NAME --visibility all
       ```
     - Set secret for specified repositories:
       ```bash
       gh secret set --org ORG_NAME SECRET_NAME --repos REPO-NAME-1,REPO-NAME-2
       ```
     - List organization secrets:
       ```bash
       gh secret list --org ORG_NAME
       ```

2. **SDK/CLI Method Signatures**:
   - Although GitHub CLI commands are executed via terminal, these commands constitute the method signatures with parameters such as:
     - `--env [environment name]`: string
     - `--org [organization name]`: string
     - `--visibility [all]`: string; defaults to private if not specified
     - `--repos [repo names]`: comma-separated string

3. **Code Examples with Comments**:

*Example: Using a secret in a GitHub Actions workflow (Bash)*:

```yaml
steps:
  - name: Execute command with secret
    shell: bash
    env:
      SUPER_SECRET: ${{ secrets.SuperSecret }}  # Inject secret into environment variable
    run: |
      # Use the secret in a command, ensuring proper quoting to handle special characters
      example-command "$SUPER_SECRET"
```

*Example: Decryption Script (decrypt_secret.sh)*:

```bash
#!/bin/sh
# Create a directory for decrypted secrets
mkdir -p $HOME/secrets
# Decrypt the file using GPG in non-interactive mode
gpg --quiet --batch --yes --decrypt --passphrase="$LARGE_SECRET_PASSPHRASE" \
  --output $HOME/secrets/my_secret.json my_secret.json.gpg
```

4. **Specific Configuration Options and Their Effects**:
   - `--cipher-algo AES256`: Selects the AES256 algorithm for GPG encryption.
   - `--quiet`, `--batch`, `--yes`: Options to automate decryption without prompts.
   - `base64 -w 0`: Option to encode file without line breaks (essential for secrets that require single line encoding).

5. **Troubleshooting Commands**:
   - Check file permissions:
     ```bash
     ls -l decrypt_secret.sh
     ```
   - Test GPG decryption manually:
     ```bash
     gpg --decrypt --passphrase "your_passphrase" my_secret.json.gpg
     ```
   - Verify environment variables in a workflow by echoing (only in non-production environments):
     ```yaml
     - name: Verify secret presence
       run: echo "Secret Length: ${#SUPER_SECRET}"
       env:
         SUPER_SECRET: ${{ secrets.SuperSecret }}
     ```

This detailed reference section provides the exact commands, parameters, and implementation patterns that developers can integrate directly into their projects without additional modification.


## Original Source
GitHub Actions Secrets Documentation
https://docs.github.com/en/actions/security-guides/encrypted-secrets

## Digest of GITHUB_SECRETS

# GitHub Secrets Documentation Digest

**Date Retrieved**: 2023-10-12

This document contains the complete technical details extracted from the GitHub Actions secrets documentation. It includes exact configuration steps, CLI commands, API method signatures, and detailed code examples to manage secrets for repositories, environments, and organizations.

## Creating Secrets for a Repository

- Navigate to the main page of the repository.
- Click on the **Settings** tab (or via dropdown if not directly visible).
- In the sidebar under **Security**, select **Secrets and variables**, then click **Actions**.
- Click on the **Secrets** tab and then **New repository secret**.
- In the **Name** field, type the secret name.
- In the **Secret** field, enter the secret value.
- Click **Add secret**.

**CLI Commands**:

```bash
# Set a repository secret using GitHub CLI
gh secret set SECRET_NAME
# Alternatively reading the secret from a file
gh secret set SECRET_NAME < secret.txt

# List repository secrets
gh secret list
```

## Creating Secrets for an Environment

- Navigate to the main page of the repository.
- Click **Settings** (from dropdown if needed).
- Click **Environments** in the left sidebar.
- Select the desired environment.
- Under **Environment secrets**, click **Add secret**.
- Enter the secret name and value.
- Click **Add secret**.

**CLI Commands**:

```bash
# Set an environment secret
gh secret set --env ENV_NAME SECRET_NAME
# List environment secrets
gh secret list --env ENV_NAME
```

## Creating Secrets for an Organization

- Navigate to the organization’s main page.
- Click **Settings** (accessible via dropdown if needed).
- Under **Security**, select **Secrets and variables**, then click **Actions**.
- Click on the **Secrets** tab and then **New organization secret**.
- Enter the secret name and value.
- Choose an access policy from the **Repository access** dropdown.
- Click **Add secret**.

**CLI Commands and Scopes**:

```bash
# Ensure admin:org scope is authorized
gh auth login --scopes "admin:org"

# Set an organization secret available to private repos by default
gh secret set --org ORG_NAME SECRET_NAME

# Set secret with visibility options
gh secret set --org ORG_NAME SECRET_NAME --visibility all

# Limit secret to specific repositories
gh secret set --org ORG_NAME SECRET_NAME --repos REPO-NAME-1,REPO-NAME-2

# List organization secrets
gh secret list --org ORG_NAME
```

## Reviewing Access to Organization-Level Secrets

- In the organization’s **Settings** under **Secrets and variables**, review configured permissions and policies on the secrets list. Click **Update** for detail review.

## Using Secrets in a Workflow

To reference a secret in your workflow:

- Use the `secrets` context to provide the secret as an input or environment variable.

**Example Workflow YAML**:

```yaml
steps:
  - name: Hello world action
    with:
      super_secret: ${{ secrets.SuperSecret }}
    env:
      super_secret: ${{ secrets.SuperSecret }}
```

**Important Notes**:
- Secrets (except GITHUB_TOKEN) are not passed to runners triggering from forked repos.
- They are not directly available in `if:` conditionals; instead, use job-level environment variables.
- If a secret is unset, referencing it returns an empty string.

**Shell Examples for Quoting Secrets**:

*Bash*:

```yaml
steps:
  - shell: bash
    env:
      SUPER_SECRET: ${{ secrets.SuperSecret }}
    run: |
      example-command "$SUPER_SECRET"
```

*PowerShell*:

```yaml
steps:
  - shell: pwsh
    env:
      SUPER_SECRET: ${{ secrets.SuperSecret }}
    run: |
      example-command "$env:SUPER_SECRET"
```

*Cmd.exe*:

```yaml
steps:
  - shell: cmd
    env:
      SUPER_SECRET: ${{ secrets.SuperSecret }}
    run: |
      example-command "%SUPER_SECRET%"
```

## Limits for Secrets

- Repository: 100 secrets max.
- Organization: Up to 1,000 secrets; workflows can access first 100 alphabetically if over limit.
- Environment: 100 secrets max.
- Maximum size: 48 KB per secret.

## Storing Large Secrets

For secrets larger than 48 KB, use encryption and store the decryption passphrase as a secret.

**GPG Encryption Command**:

```bash
gpg --symmetric --cipher-algo AES256 my_secret.json
```

- Create secret named `LARGE_SECRET_PASSPHRASE` with the passphrase.
- Commit the encrypted file (`my_secret.json.gpg`) to the repository.

**Decryption Script (decrypt_secret.sh)**:

```bash
#!/bin/sh

# Create a directory for secrets
mkdir -p $HOME/secrets
# Decrypt secret file
gpg --quiet --batch --yes --decrypt --passphrase="$LARGE_SECRET_PASSPHRASE" \
  --output $HOME/secrets/my_secret.json my_secret.json.gpg
```

- Ensure the script is executable:

```bash
chmod +x decrypt_secret.sh
```

**Workflow Integration**:

```yaml
name: Workflows with large secrets
on: push
jobs:
  my-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Decrypt large secret
        run: ./decrypt_secret.sh
        env:
          LARGE_SECRET_PASSPHRASE: ${{ secrets.LARGE_SECRET_PASSPHRASE }}
      - name: Test printing your secret (Remove in production)
        run: cat $HOME/secrets/my_secret.json
```

## Storing Base64 Binary Blobs as Secrets

- Convert binary files into a Base64 encoded string.

**Examples**:

*macOS*:

```bash
base64 -i cert.der -o cert.base64
```

*Linux*:

```bash
base64 -w 0 cert.der > cert.base64
```

- Create a secret using the encoded string:

```bash
gh secret set CERTIFICATE_BASE64 < cert.base64
```

- Decode in a workflow:

```yaml
name: Retrieve Base64 secret
on: push
jobs:
  decode-secret:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Decode secret into a file
        env:
          CERTIFICATE_BASE64: ${{ secrets.CERTIFICATE_BASE64 }}
        run: |
          echo $CERTIFICATE_BASE64 | base64 --decode > cert.der
      - name: Show certificate info
        run: |
          openssl x509 -in cert.der -inform DER -text -noout
```

## Redacting Secrets from Workflow Run Logs

- GitHub Actions automatically redacts printed secrets and other recognized sensitive data (e.g., keys, tokens, connection strings).
- Use `::add-mask::VALUE` to mask non-secret sensitive data.

**Note**: Ensure secrets are not exposed via command-line arguments that can be captured by audit events.


## Attribution
- Source: GitHub Actions Secrets Documentation
- URL: https://docs.github.com/en/actions/security-guides/encrypted-secrets
- License: License: GitHub Docs License (CC BY 4.0)
- Crawl Date: 2025-04-17T19:10:41.390Z
- Data Size: 1111360 bytes
- Links Found: 18386

## Retrieved
2025-04-17
