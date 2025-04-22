# GITHUB_PAGES

## Crawl Summary
Repository setup instructions for creating a site with repository name <username>.github.io, setting publishing source via branch or folder, and modifying _config.yml for title and description. GitHub Actions integration requires actions/configure-pages@v5, actions/upload-pages-artifact@v3, and actions/deploy-pages@v4 with specified permissions (pages: write, id-token: write). Custom domain configuration includes updating DNS and repository settings. HTTPS enforcement and custom 404 page creation are detailed. Limits on site size, build duration, bandwidth, and build frequency are specified.

## Normalised Extract
Table of Contents:
1. Repository Setup
   - Create repository with name <username>.github.io
   - Initialize with README; set visibility as required
2. Publishing Source Configuration
   - Access Settings > Pages
   - Set publishing branch and optional folder (e.g., /docs)
3. GitHub Actions Workflow
   - Use actions/configure-pages@v5 to set up Pages
   - Use actions/upload-pages-artifact@v3 to upload build artifact
   - Use actions/deploy-pages@v4 for deployment
   - YAML example provided with checkout, setup, build (Jekyll), upload, and deploy steps
4. Custom Domain and HTTPS
   - Configure DNS records for custom domains
   - Enable Enforce HTTPS in Pages settings
5. Custom 404 Page Creation
   - Add 404.html or 404.md with YAML front matter (permalink: /404.html)
6. Deletion/Unpublishing Procedures
   - Delete repository or change publishing source to None to remove site
   - Use Unpublish option to remove current deployment
7. MIME Types and Site Limits
   - Supports over 750 MIME types
   - Site size limit of 1GB; 10 minute build timeout; 100GB/month bandwidth limit; 10 builds per hour soft cap

Detailed Information:
Repository Setup: Create repository using New Repository button, ensure it is named as <username>.github.io, and initialize with a README.
Publishing Source: In repository Settings > Pages, select 'Deploy from a branch', choose branch (e.g., main) and folder if needed. Save settings to trigger automatic deployment on push.
GitHub Actions: Configure workflows with steps including checkout (actions/checkout@v4), configuration (actions/configure-pages@v5), build using Jekyll (actions/jekyll-build-pages@v1), artifact upload (actions/upload-pages-artifact@v3) and deployment (actions/deploy-pages@v4). Ensure required permissions: pages: write, id-token: write.
Custom Domain: Update domain settings in repository and DNS provider; verify the custom domain through repository settings.
HTTPS: Enforce HTTPS using the toggle in Pages settings to redirect all HTTP requests to HTTPS.
404 Page: Create a file named 404.html or 404.md at the root; include YAML header with permalink to ensure correct routing.
Deletion/Unpublishing: To remove a site, delete the repository or set the publishing source to None in Pages settings.

## Supplementary Details
Repository Settings:
- Repository Name: Must be <username>.github.io for user sites.
- Publishing Source: Branch selection (any branch) with an optional folder (e.g., /docs).
- _config.yml modifications: Add lines 'title: <your title>' and 'description: <your description>'.

GitHub Actions Workflow:
- Actions required:
  * actions/checkout@v4
  * actions/configure-pages@v5
  * actions/jekyll-build-pages@v1 (for Jekyll based builds)
  * actions/upload-pages-artifact@v3
  * actions/deploy-pages@v4
- Workflow Permissions: Set pages: write and id-token: write in job permissions.
- Environment: Use environment name 'github-pages'; set URL output field using ${{steps.deployment.outputs.page_url}}.

Custom Domain and HTTPS:
- Custom domain configuration: Manually update DNS records and set custom domain in repository settings.
- HTTPS: Toggle 'Enforce HTTPS' in the Pages settings; ensure domain name length is less than 64 characters per RFC3280.

Troubleshooting:
- If site changes are not visible within 10 minutes, verify that an admin with a verified email has pushed changes.
- For build errors, inspect workflow run logs and ensure a .nojekyll file is used if not using Jekyll.
- For symbolic link issues in repositories, deploy using a GitHub Actions workflow instead of direct branch publishing.

Site Limits:
- Maximum site size: 1GB
- Build timeout: 10 minutes
- Bandwidth limit: 100GB/month
- Build frequency: 10 builds per hour (unless custom workflow is used)

Additional Best Practices:
- Use a dedicated branch for site source files if repository includes unrelated project files.
- Configure deployment environment with branch protection rules for 'github-pages'.

## Reference Details
API and Workflow Specifications:
1. Checkout Action:
   Method: actions/checkout@v4
   Usage: { name: 'Checkout', uses: 'actions/checkout@v4' }

2. Configure Pages Action:
   Method: actions/configure-pages@v5
   Usage: { name: 'Setup Pages', id: 'pages', uses: 'actions/configure-pages@v5' }

3. Jekyll Build Action:
   Method: actions/jekyll-build-pages@v1
   Parameters:
     - source: string (path to source, e.g., './')
     - destination: string (path to output directory, e.g., './_site')
   Usage: { name: 'Build with Jekyll', uses: 'actions/jekyll-build-pages@v1', with: { source: './', destination: './_site' } }

4. Upload Pages Artifact Action:
   Method: actions/upload-pages-artifact@v3
   Parameters:
     - path: string (directory to compress and upload; default is '.' if entire directory)
   Usage: { name: 'Upload Artifact', uses: 'actions/upload-pages-artifact@v3' }

5. Deploy Pages Action:
   Method: actions/deploy-pages@v4
   Parameters:
     - id: string (identifier for deployment step)
     - environment: object { name: 'github-pages', url: string output from deployment step }
   Usage: { name: 'Deploy to GitHub Pages', id: 'deployment', uses: 'actions/deploy-pages@v4' }

Complete Deployment YAML Example:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5
      - name: Build with Jekyll
        uses: actions/jekyll-build-pages@v1
        with:
          source: './'
          destination: './_site'
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
  deploy:
    environment:
      name: github-pages
      url: ${{steps.deployment.outputs.page_url}}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

Configuration Options and Effects:
- _config.yml: Modify 'title' and 'description' to change site metadata.
- .nojekyll file: Presence disables Jekyll build for non-Jekyll static site generators.
- Publishing Source: Selecting a branch and folder triggers GitHub Actions workflow on push.
- Custom Domain: Must update repository settings and DNS. A valid certificate is issued if domain length < 64 characters.

Troubleshooting Procedures:
- Verify admin push with verified email if deployment does not trigger.
- Check GitHub Actions workflow logs for errors in build or deployment.
- Use .nojekyll to bypass unwanted build steps if using alternative static site generators.
- For MIME type issues, refer to mime-db supported list (~750 types).
- Confirm environment permissions: pages must be set with 'write' permissions and id-token access using repository secrets.

Exception Handling:
- If GitHub Actions fails with HTTP 429, review rate limits and adjust build frequency.
- Jekyll build errors: Inspect error messages, check for missing /docs folder if selected as publishing source.
- Certificate errors: Ensure custom domain meets RFC3280 requirements.

## Information Dense Extract
Repo: <username>.github.io; Visibility: public/private per plan; Publish source: branch (e.g., main) or /docs; _config.yml: title, description; Actions: checkout@v4, configure-pages@v5, jekyll-build-pages@v1, upload-pages-artifact@v3, deploy-pages@v4; Permissions: pages: write, id-token: write; Environment: github-pages; Custom Domain: DNS update, certificate if domain <64 chars; HTTPS: enforce toggle; 404 page: 404.html/_md with YAML (permalink: /404.html); Limits: 1GB size, 10min build, 100GB/month, 10 builds/hour; Troubleshooting: check workflow logs, admin push, .nojekyll for non-Jekyll; MIME: supports 750+ types.

## Sanitised Extract
Table of Contents:
1. Repository Setup
   - Create repository with name <username>.github.io
   - Initialize with README; set visibility as required
2. Publishing Source Configuration
   - Access Settings > Pages
   - Set publishing branch and optional folder (e.g., /docs)
3. GitHub Actions Workflow
   - Use actions/configure-pages@v5 to set up Pages
   - Use actions/upload-pages-artifact@v3 to upload build artifact
   - Use actions/deploy-pages@v4 for deployment
   - YAML example provided with checkout, setup, build (Jekyll), upload, and deploy steps
4. Custom Domain and HTTPS
   - Configure DNS records for custom domains
   - Enable Enforce HTTPS in Pages settings
5. Custom 404 Page Creation
   - Add 404.html or 404.md with YAML front matter (permalink: /404.html)
6. Deletion/Unpublishing Procedures
   - Delete repository or change publishing source to None to remove site
   - Use Unpublish option to remove current deployment
7. MIME Types and Site Limits
   - Supports over 750 MIME types
   - Site size limit of 1GB; 10 minute build timeout; 100GB/month bandwidth limit; 10 builds per hour soft cap

Detailed Information:
Repository Setup: Create repository using New Repository button, ensure it is named as <username>.github.io, and initialize with a README.
Publishing Source: In repository Settings > Pages, select 'Deploy from a branch', choose branch (e.g., main) and folder if needed. Save settings to trigger automatic deployment on push.
GitHub Actions: Configure workflows with steps including checkout (actions/checkout@v4), configuration (actions/configure-pages@v5), build using Jekyll (actions/jekyll-build-pages@v1), artifact upload (actions/upload-pages-artifact@v3) and deployment (actions/deploy-pages@v4). Ensure required permissions: pages: write, id-token: write.
Custom Domain: Update domain settings in repository and DNS provider; verify the custom domain through repository settings.
HTTPS: Enforce HTTPS using the toggle in Pages settings to redirect all HTTP requests to HTTPS.
404 Page: Create a file named 404.html or 404.md at the root; include YAML header with permalink to ensure correct routing.
Deletion/Unpublishing: To remove a site, delete the repository or set the publishing source to None in Pages settings.

## Original Source
GitHub Pages Documentation
https://docs.github.com/en/pages

## Digest of GITHUB_PAGES

# Quickstart Overview
Retrieved Date: 2023-10-12

This section covers the step-by-step process to create a user site at <username>.github.io by creating a new repository, setting the repository visibility, and initializing with a README. Navigate to Settings and then to the Pages section to select the publishing source from a specific branch or folder. 

# Creating Your Website
1. In the upper-right corner, click New repository.
2. Name the repository as <username>.github.io (replace <username> with your GitHub username).
3. Choose the repository visibility (public or private depending on your plan).
4. Initialize the repository with a README.
5. In the repository, select Settings > Pages.
6. Under Build and Deployment, choose 'Deploy from a branch' and select the publishing branch and optionally a folder.

# Changing Title and Description
1. Open the _config.yml file in the repository.
2. Add a new line with 'title: Your Site Title'.
3. Add a new line with 'description: Your description here'.
4. Commit changes to update the site.

# GitHub Actions Integration and Workflow Setup
This section describes how GitHub Actions automates the Jekyll build and deployment process. It includes the usage of the following actions:
- actions/configure-pages@v5 for setting up GitHub Pages.
- actions/upload-pages-artifact@v3 for packaging the build artifact (a gzip compressed tar file).
- actions/deploy-pages@v4 for deploying the artifact.

Example YAML configuration:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5
      - name: Build with Jekyll
        uses: actions/jekyll-build-pages@v1
        with:
          source: ./
          destination: ./_site
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3

  deploy:
    environment:
      name: github-pages
      url: ${{steps.deployment.outputs.page_url}}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

# Configuring a Publishing Source
1. Ensure that the branch specified as the publishing source exists.
2. Within the repository Settings > Pages, select the branch and, optionally, a folder (e.g., /docs) as the publishing source.
3. Save the settings to activate publishing with automatic deployment triggered on push.

# Custom Domain and HTTPS Settings
- Custom Domain: Update DNS records and repository settings to point a custom domain to your GitHub Pages site. Changes require manual verification.
- HTTPS Enforcement: In Settings > Pages, select 'Enforce HTTPS' to ensure all HTTP requests are redirected to HTTPS.

# Handling 404 and Custom Error Pages

To create a custom 404 page, add a 404.html or 404.md file in the repository. For markdown files, include the YAML front matter:

---
permalink: /404.html
---

Then add the desired content and commit the change.

# Deleting and Unpublishing a Site

To delete a site, you can either delete the repository or change the publishing source to 'None'. To unpublish without deletion, use the unpublish option in the Pages settings.

# MIME Types and Limits
- GitHub Pages supports over 750 MIME types based on the mime-db project.
- Limits include a site size of up to 1GB, a build timeout of 10 minutes, a soft bandwidth limit of 100GB/month, and a limit of 10 builds per hour (unless using custom workflows).

## Attribution
- Source: GitHub Pages Documentation
- URL: https://docs.github.com/en/pages
- License: License: Not specified
- Crawl Date: 2025-04-22T04:49:52.497Z
- Data Size: 545885 bytes
- Links Found: 9983

## Retrieved
2025-04-22
