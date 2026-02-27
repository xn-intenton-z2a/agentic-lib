# GITHUB_CODESPACES

## Crawl Summary
The GitHub Codespaces documentation provides a detailed guide for setting up, running, and managing codespaces. It includes exact commands such as 'npm run dev', UI steps like clicking 'Open in Browser', and detailed lifecycle processes including container rebuild, timeout settings (default 30 minutes), stopping via VS Code command palette or CLI, and deletion practices. Virtual machine configurations are specified from 2 cores/8GB RAM/32GB storage up to 32 cores/64GB RAM/128GB storage. The documentation also covers advanced configurations within devcontainer.json and troubleshooting steps for issues like port forwarding and connection loss.

## Normalised Extract
## Table of Contents
1. Creating and Configuring a Codespace
2. Running and Debugging Applications
3. Git Operations within Codespaces
4. Dev Container Customization
5. Lifecycle Management and Troubleshooting

### 1. Creating and Configuring a Codespace
- **Repository Template:** Navigate to the repository (e.g., github/haikus-for-codespaces).
- **Steps:** Click 'Use this template' -> 'Open in a codespace'.
- **Result:** The repository is cloned into `/workspaces` and a VM is provisioned.

### 2. Running and Debugging Applications
- **Command Execution:** In the terminal run `npm run dev` to start the Node.js application.
- **Port Forwarding:** Automatic detection and forwarding of the port when the application starts, with a pop-up message for 'Open in Browser'.

### 3. Git Operations within Codespaces
- **Staging Files:** Click the '+' icon in the Source Control view.
- **Committing:** Enter a commit message then press 'Commit'.
- **Publishing:** Choose repository type and click 'Publish Branch'.

### 4. Dev Container Customization
- **Custom Configurations:** Use `devcontainer.json` to define the container environment.
- **Sample Config:**
```json
{
  "name": "My Dev Container",
  "image": "mcr.microsoft.com/vscode/devcontainers/javascript-node:0-14",
  "settings": { "terminal.integrated.shell.linux": "/bin/bash" },
  "postCreateCommand": "npm install"
}
```

### 5. Lifecycle Management and Troubleshooting
- **Lifecycle Stages:** Creation, container setup, connection, post-creation setup.
- **Stopping Codespaces:** Use VS Code Command Palette (`Codespaces: stop`) or CLI (`gh codespace stop`).
- **Timeout Settings:** Default is 30 minutes; auto-save is enabled in web clients.
- **Rebuilding:** Trigger container rebuild to apply new devcontainer.json changes, preserving files in `/workspaces`.

Each section includes precise steps, exact commands, configuration parameters, and troubleshooting instructions that developers can directly follow.

## Supplementary Details
### Dev Container and Machine Configuration
- **VM Specifications:** Configurable from 2 cores/8GB RAM/32GB storage to 32 cores/64GB RAM/128GB storage. 
- **Default OS:** Ubuntu-based Linux image, overrideable via custom images.
- **Configuration File (devcontainer.json):** Supports settings, postCreateCommand, postAttachCommand. Parameters include:
  - "name": string, e.g., "My Dev Container"
  - "image": Docker image string, e.g., "mcr.microsoft.com/vscode/devcontainers/javascript-node:0-14"
  - "settings": JSON object for VS Code settings, e.g., terminal settings.
  - "postCreateCommand": command string executed after container creation (e.g., "npm install")

### Commands and UI Actions
- **Application Startup:** Execute `npm run dev` in terminal.
- **Port Forwarding:** Automatically forwards detected ports; manually accessible via the Ports tab in VS Code.
- **Stopping Codespaces:** VS Code Command Palette command `Codespaces: stop` or CLI command `gh codespace stop`.
- **Git Operations:** Stage, commit, and publish changes using integrated UI controls or terminal Git commands (e.g., `git add .`, `git commit -m 'message'`, `git push`).

### Troubleshooting Procedures
- **Port Forwarding Issues:** Confirm port number from terminal output; if missing, use the Ports tab to manually forward the port.
- **Connection Interruptions:** Check network connectivity; if disconnected, use `gh codespace list` to view and reconnect.
- **Auto Save and Data Persistence:** In browser-based editor auto-save is enabled; in VS Code desktop, enable auto-save to avoid unsaved changes.
- **Rebuild Tips:** When rebuilding a codespace, remember only changes in `/workspaces` persist; reapply configurations as needed via devcontainer.json.

### Best Practices
- Frequently commit and push to backup work.
- Customize your devcontainer for reproducible environments.
- Use Settings Sync in VS Code to mirror your development preferences across devices.

## Reference Details
### Full API and Command Specifications

#### GitHub Codespaces CLI Commands
- **List Codespaces:**
  - Command: `gh codespace list`
  - Output: List of active and stopped codespaces with status, machine type, and creation date.

- **Stop a Codespace:**
  - Command: `gh codespace stop [--codespace <name|id>]`
  - Parameters:
    - `--codespace`: Identifier string of the codespace to stop.
  - Return: Confirmation message and updated status.

#### Visual Studio Code Commands
- **Stop Codespace:**
  - Command Palette: `Codespaces: stop`
  - Execution: Stops the currently connected codespace.

#### Devcontainer.json Specification
- **Required Fields:**
  - "name": string (e.g., "My Dev Container")
  - "image": string specifying the Docker image (e.g., "mcr.microsoft.com/vscode/devcontainers/javascript-node:0-14")
- **Optional Fields:**
  - "settings": Object containing VS Code settings, e.g., { "terminal.integrated.shell.linux": "/bin/bash" }
  - "postCreateCommand": string, command to run after creation (e.g., "npm install")
  - "postAttachCommand": string, command to run when attaching

#### Code Example: Running a Node.js App in Codespaces

```bash
# In the integrated terminal within the codespace:
npm run dev
```

#### Implementation Pattern for Codespace Setup
1. Clone repository into `/workspaces` automatically during codespace creation.
2. Execute setup commands defined in `devcontainer.json` (e.g., install dependencies).
3. Use integrated terminal for commands, and employ UI controls for staging and committing changes.
4. Forward port: Verify terminal output for auto-detected port, then click on the provided URL or manually forward via the Ports tab.

#### Troubleshooting Steps
- **Port Not Forwarding:** 
  1. Check terminal output for port number.
  2. Open Ports tab and click the 'Open in Browser' icon manually.
  3. Verify that the application is listening on the expected port (e.g., using `lsof -i :4000`).

- **Codespace Connection Loss:**
  1. Confirm network settings.
  2. Use `gh codespace list` to check current status.
  3. Reconnect via web interface or VS Code using the command palette.

- **Rebuild Issues:**
  1. Ensure modifications are inside `/workspaces` to persist.
  2. Run a full rebuild if cache issues are suspected: Clear cache and rebuild container.

These detailed API commands, method signatures, configuration parameters, and step-by-step procedures provide developers with the complete technical specifications needed to implement and troubleshoot GitHub Codespaces directly.

## Original Source
GitHub Codespaces Documentation
https://docs.github.com/en/codespaces

## Digest of GITHUB_CODESPACES

# GitHub Codespaces Documentation

**Date Retrieved:** 2023-10-05

## Overview
GitHub Codespaces provides a cloud-hosted development environment with a preconfigured Docker container running on a virtual machine. The environment is highly configurable, enabling you to work in a secure, dedicated development container that supports Node.js, Python, Java, C# (.NET), and more.

## Quickstart and Setup

### Creating a Codespace
- Navigate to the repository (e.g., github/haikus-for-codespaces).
- Click **Use this template** then **Open in a codespace**.

### Running the Application
- When the codespace is created, the repository is cloned automatically into the `/workspaces` directory.
- Open the terminal and run:

```bash
npm run dev
```

- A pop-up message will indicate the port used by the application; click **Open in Browser** to view it.

### Editing and Personalizing
- Open files (e.g., `haikus.json`) in the Explorer to edit content live.
- Refresh the running application tab to see updates.

### Git Operations
- Stage changes by clicking the plus icon next to changed files in the Source Control view.
- Commit changes with a message and click **Commit**.
- Publish the branch by selecting the appropriate repository type (public/private) and clicking **Publish Branch**.

### Adding Extensions
- In the Activity Bar, click **Extensions**.
- Search and install extensions such as **fairyfloss** to personalize your theme.

## Codespace Lifecycle and Management

### Lifecycle Steps
1. **Creation**: A dedicated VM is provisioned and a shallow clone of the repository is mounted into the dev container.
2. **Dev Container Setup**: Container is created based on the `devcontainer.json` and optional Dockerfile. If missing, a default Ubuntu-based image is used.
3. **Connection**: Access the codespace via web browser, VS Code, or GitHub CLI.
4. **Post-Creation Setup**: Commands defined in `postCreateCommand` or `postAttachCommand` execute. Dotfiles can also configure the environment.

### Lifecycle Operations
- **Rebuilding**: Use a rebuild to update container settings. A full rebuild clears the cache. **Note**: Only changes outside `/workspaces` are cleared.
- **Stopping**: Codespaces can be stopped through the UI, Command Palette (`Codespaces: stop`), or CLI (`gh codespace stop`). Stopped codespaces incur storage costs only.
- **Deleting**: Codespaces can be safely deleted once changes are pushed to a remote branch. Automatic deletion occurs after 30 days of inactivity.

### Inactivity and Timeout
- By default, codespaces timeout after 30 minutes of inactivity. Auto-save is enabled in the web version, ensuring unsaved changes are minimized.

## Advanced Configuration

### Dev Container Customization
- Modify the `devcontainer.json` file to set up language runtimes, tools, and post creation scripts.
- Example snippet:

```json
{
  "name": "My Dev Container",
  "image": "mcr.microsoft.com/vscode/devcontainers/javascript-node:0-14",
  "settings": {
    "terminal.integrated.shell.linux": "/bin/bash"
  },
  "postCreateCommand": "npm install"
}
```

### Virtual Machine Specifications
- Available configurations range from 2 cores/8GB RAM/32GB storage to 32 cores/64GB RAM/128GB storage.
- Default image is Ubuntu-based but can be customized to any Linux distribution.

## Troubleshooting and Best Practices

### Common Issues and Commands
- **Port Forwarding**: When the application listens on a port (e.g., 4000), Codespaces auto-detect and forward it. If not, manually forward via the Ports tab.
- **Connection Issues**: Use `gh codespace list` and `gh codespace stop` to manage session drift.
- **Git Operations**: Ensure changes are committed and pushed frequently to prevent data loss during timeouts.

### Best Practices
- Regularly commit changes to remote repositories.
- Use Settings Sync in VS Code to synchronize extensions, settings, and keybindings.
- Customize the dev container to include all necessary dependencies for a consistent development experience across users.

## Attribution
- Crawled Data Size: 775065 bytes
- Links Found: 8517


## Attribution
- Source: GitHub Codespaces Documentation
- URL: https://docs.github.com/en/codespaces
- License: License: Custom GitHub Docs License
- Crawl Date: 2025-04-17T15:28:56.765Z
- Data Size: 775065 bytes
- Links Found: 8517

## Retrieved
2025-04-17
