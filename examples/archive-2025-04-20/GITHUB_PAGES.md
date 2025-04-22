# GITHUB_PAGES

## Crawl Summary
The documentation details the steps to create and deploy a GitHub Pages site including repository setup, branch selection, custom domain and HTTPS configurations, and GitHub Actions workflow integration. It includes specific configuration options: repository naming (<username>.github.io), branch publishing settings, use of .nojekyll to disable Jekyll builds, and full YAML examples for custom workflows that include steps for checkout, building with Jekyll, uploading artifacts, and deploying with deploy-pages action. Additionally, it outlines procedures to delete or unpublish a site, and methods to create a custom 404 error page.

## Normalised Extract
## Table of Contents

1. Quickstart and Repository Setup
   - Create repository: `<username>.github.io`
   - Initialize with README
   - Configure Pages via Settings > Pages

2. Custom Domain Configuration
   - Update DNS records
   - Set custom domain in repository settings
   - API endpoint usage for custom domains

3. HTTPS Enforcement
   - Enforce HTTPS via Settings > Pages
   - Certificate prerequisites (domain length < 64 characters)

4. Custom GitHub Actions Workflow
   - Workflow sample for build and deploy
   - YAML configuration for multi-job and single-job workflows

5. Publishing Source Configuration
   - Select branch and folder (root or `/docs`)
   - Use of `.nojekyll` for bypassing Jekyll build
   - Entry file requirement (index.html / index.md / README.md)

6. Deleting and Unpublishing Site
   - Options: delete repository or change publishing source
   - Unpublishing steps via Settings

7. Custom 404 Page
   - Creating custom 404 page with YAML front matter and commit steps

## Detailed Technical Information

1. Quickstart: Execute steps by clicking "New repository" in GitHub and naming it `<username>.github.io`. Initialize with a README; then navigate to Settings > Pages, select "Deploy from a branch", choose branch and source folder. Changes may take up to 10 minutes to show.

2. Custom Domain: After setting up the site, update DNS records and set the custom domain. Verify the domain using the repository’s Pages section.

3. HTTPS Enforcement: In the Pages settings, tick "Enforce HTTPS". GitHub automatically provisions SSL certificates, provided the domain meets RFC3280 restrictions.

4. GitHub Actions Workflow: Use predefined actions:
   - checkout: `actions/checkout@v4`
   - configure-pages: `actions/configure-pages@v5`
   - Jekyll build: `actions/jekyll-build-pages@v1` (with parameters source and destination)
   - upload artifact: `actions/upload-pages-artifact@v3`
   - deploy: `actions/deploy-pages@v4`

5. Publishing Configuration: For non-Jekyll sites, add a `.nojekyll` file. The publishing branch must exist and contain an entry file at the correct folder level.

6. Deletion/Unpublishing: Change publishing source to 'None' via Settings to remove the site without deleting the repository, or delete the repository entirely.

7. Custom 404 Page: Create `404.html` or `404.md`. If using markdown, include YAML front matter:

```yaml
---
permalink: /404.html
---
```

Commit the file with a proper commit message.


## Supplementary Details
### Detailed Implementation Steps and Config Options

- Repository Name: Must follow `<username>.github.io`. Replace `<username>` with your GitHub username in lowercase if necessary.
- Branch Selection: Default branch (e.g., 'main') or a dedicated branch for pages (e.g., 'gh-pages').
- Source Folder: Options include '/' (root) or '/docs'.
- .nojekyll File: Create an empty file named `.nojekyll` in the root of your publishing source if using non-Jekyll static generators.
- GitHub Actions Workflow Parameters:
  - **actions/configure-pages@v5**: No additional parameters required.
  - **actions/jekyll-build-pages@v1**:
    - Parameters: `source` (string, path to site source), `destination` (string, path to output directory).
  - **actions/upload-pages-artifact@v3**:
    - Parameter: `path` (string, directory to package).
  - **actions/deploy-pages@v4**:
    - Requires job permissions: `contents: read`, `pages: write`, `id-token: write`.
    - Environment must set `name: github-pages` and output `url` can be captured via `${{steps.deployment.outputs.page_url}}`.
- Custom Domain and HTTPS:
  - In Settings > Pages, set custom domain and enforce HTTPS. Domain must be less than 64 characters (RFC3280).
- 404 Page Setup:
  - File name: `404.md` or `404.html`, with YAML front matter if markdown is used.

### Exact Configuration Options with Defaults

- Repository visibility: Public (default for GitHub Free accounts).
- Build timeout: 10 minutes max for GitHub Pages deployments.
- Bandwidth limit: Soft limit of 100 GB/month.
- Build frequency: Soft limit of 10 builds per hour unless using custom workflows.


## Reference Details
### Full API and SDK Method Examples

#### GitHub Actions Workflow YAML Example (Multi-Job):

```yaml
name: GitHub Pages Deployment

on:
  push:
    branches: 
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Pages
        id: setup
        uses: actions/configure-pages@v5

      - name: Build with Jekyll
        id: jekyll_build
        uses: actions/jekyll-build-pages@v1
        with:
          source: './'
          destination: './_site'

      - name: Upload artifact
        id: upload
        uses: actions/upload-pages-artifact@v3
        with:
          path: './_site'

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    permissions:
      contents: read
      pages: write
      id-token: write
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### Single-Job Deployment Workflow Example:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

#### _config.yml Example for Customizing Site Title and Description:

```yaml
theme: jekyll-theme-minimal
Title: "Octocat's homepage"
description: "Bookmark this to keep an eye on my project updates!"
```

#### Custom 404 Page Example in Markdown:

Filename: 404.md

```markdown
---
permalink: /404.html
---

# Page Not Found

The page you are looking for does not exist. Please check the URL or return to the homepage.
```

### Troubleshooting Procedures

1. If the site does not publish after pushing changes:
   - Confirm that the publishing branch/folder exists and contains an entry file (e.g., README.md, index.html).
   - Verify that GitHub Actions is enabled and that a verified email address has pushed to the branch.
   - Check workflow run logs via the "Actions" tab in GitHub repository for errors.

2. If custom domain issues occur:
   - Ensure DNS records are correctly configured (A or CNAME records pointing to GitHub Pages servers).
   - Use the repository Settings > Pages to verify domain and check for certificate provisioning errors.
   - Confirm that the domain name is less than 64 characters.

3. For HTTPS enforcement problems:
   - Ensure the "Enforce HTTPS" option is enabled in Settings > Pages.
   - Verify that the site’s domain meets the necessary criteria for SSL certificate issuance.

4. Action Workflow Failures:
   - Check permissions: The job must have `contents: read`, `pages: write`, and `id-token: write`.
   - Confirm the workflow YAML syntax and that all referenced actions are available (e.g., actions/checkout@v4, actions/deploy-pages@v4).
   - Re-run the workflow from the Actions tab if a transient error is suspected.


## Original Source
GitHub Pages Documentation
https://docs.github.com/en/pages

## Digest of GITHUB_PAGES

# GitHub Pages Documentation

Retrieved on: 2023-11-24

## Quickstart and Setup

- **Repository Creation**:
  - New repository name must be `<username>.github.io` (e.g., octocat.github.io).
  - Initialize with README.
  - Set repository visibility (public for GitHub Free accounts).

- **Configuration Steps**:
  - Navigate to repository Settings > Pages.
  - Under "Build and deployment", select "Deploy from a branch".
  - Choose branch and source folder (root `/` or `/docs`).
  - Wait up to 10 minutes for the changes to reflect.

## Custom Domain Configuration

- **DNS Setup**:
  - Update DNS records to point to your GitHub Pages site.
  - Verify the custom domain via repository settings.

- **Configuration**:
  - Set up custom domain in Pages settings
  - Use API endpoints if needed for custom configuration.

## HTTPS and Security

- **Enable HTTPS**:
  - In Settings > Pages, select the "Enforce HTTPS" checkbox.
  - GitHub automatically provisions certificates for github.io domains.
  - Note: The full domain name must be less than 64 characters.

## Custom GitHub Actions Workflow

- **Workflow Sample**:

```yaml
name: GitHub Pages Deployment

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Build with Jekyll
        uses: actions/jekyll-build-pages@v1
        with:
          source: ./
          destination: ./_site
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- **Alternative Single Job Deployment**:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        uses: actions/configure-pages@v5
      - name: Upload Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Publishing Configuration

- **Publishing from Branch**:
  - Choose the branch and optionally a folder (e.g., `/docs`).
  - For non-Jekyll sites, add an empty `.nojekyll` file in the root.

- **Entry File Requirements**:
  - Must have an `index.html`, `index.md`, or `README.md` at the top level of the source folder.

## Deletion and Unpublishing

- **Deleting the Site**:
  - Option 1: Delete the repository.
  - Option 2: Change the publishing source to "None" in Settings > Pages.

- **Unpublishing**:
  - Use the "Unpublish site" option next to the live site message in Pages settings.

## Custom 404 Page

- **Creation**:
  - Create a file named `404.html` or `404.md` in the repository.
  - For markdown, add the YAML front matter:

```yaml
---
permalink: /404.html
---
```

- **Commit**: Provide a meaningful commit message and push to publishing branch.


## Attribution
- Source: GitHub Pages Documentation
- URL: https://docs.github.com/en/pages
- License: License: GitHub Docs Terms
- Crawl Date: 2025-04-17T22:09:12.814Z
- Data Size: 540644 bytes
- Links Found: 9971

## Retrieved
2025-04-17
