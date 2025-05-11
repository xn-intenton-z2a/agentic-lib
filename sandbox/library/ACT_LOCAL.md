# ACT_LOCAL

## Crawl Summary
act reads .github/workflows, builds/pulls container images via Docker API, executes steps in container environments matching GitHub Actions. Requires Go ≥1.20, Docker. Install by cloning repo and running make test and make install. VS Code extension available.

## Normalised Extract
Table of Contents:
1. Prerequisites
2. Repository Clone
3. Build Targets
4. Installation Path
5. Execution Flow

1. Prerequisites
   - Go version: 1.20+
   - Docker daemon: running and accessible via Docker API socket

2. Repository Clone
   - Command: git clone git@github.com:nektos/act.git
   - Default branch: master

3. Build Targets
   - make test: invokes go test ./...  with codecov flags
   - make install: go build -o act main.go; installs to $GOPATH/bin

4. Installation Path
   - Binary installed at: $GOPATH/bin/act (or $HOME/go/bin/act)
   - Version file: ./VERSION contains semantic version tag

5. Execution Flow
   - act [options] [event] invokes workflow runner
   - Reads all YAML under .github/workflows
   - Pulls images: docker pull <image> or docker build <Dockerfile>
   - Sets environment: GITHUB_* variables per action context
   - Runs steps in containers in dependency order


## Supplementary Details
Prerequisites:
  Go 1.20+  (check via go version)
  Docker Engine 20.10+ (check via docker version)

Clone parameters:
  URL: git@github.com:nektos/act.git
  Depth: full history required for tags

Makefile targets:
  test:
    runs: go test -v ./... -coverprofile=coverage.out
    environment: requires GOPATH and module support
  install:
    runs: go install ./cmd/act
    output: binary 'act'

Configuration directory:
  .actrc: place CLI default flags (not shown in readme)

VS Code extension:
  Name: GitHub Local Actions
  Commands: Run Workflow, Debug Step


## Reference Details
Step-by-step Installation:

1. Verify prerequisites:
   - go version output contains 'go1.20'
   - docker version output contains 'Engine:'

2. Clone the repository:

    git clone git@github.com:nektos/act.git
    cd act

3. Run unit tests:

    make test

   Expected output snippet:
    PASS
    coverage: 85.2% of statements
    ok   github.com/nektos/act/pkg/action  0.345s

4. Build and install CLI:

    make install

   Expected binary at $GOPATH/bin/act
   Verify via:
    act --version
    version: v0.2.77

Usage Example:

    cd path/to/repo-with-workflows
    act push -P ubuntu-latest=nektos/act-environments-ubuntu:18.04

Flags:
  -l, --list
        list all available events
  -P, --platform string
        override default image for an OS (format label=image)
  --secret stringArray
        set secret key=value
  --reuse
        reuse previously created containers

Best Practices:
  - Keep workflow files under 100 lines for performance
  - Pin Docker images via digest to ensure repeatability

Troubleshooting:
  - If Docker API error, run:
      sudo systemctl start docker
  - To clear stale containers:
      docker rm -f $(docker ps -aq)


## Information Dense Extract
Prerequisites: Go>=1.20, Docker Engine>=20.10. Clone: git clone git@github.com:nektos/act.git; cd act. Test: make test (go test -coverprofile). Install: make install (binary at $GOPATH/bin/act). Workflow files: .github/workflows/*.yml. Execution: act [event] pulls uses:image or builds Dockerfile; injects GITHUB_* env; executes steps in dependency order. Flags: -l list events; -P platform=label=image override; --secret key=value; --reuse containers. Example: act push -P ubuntu-latest=nektos/act-environments-ubuntu:18.04. Troubleshoot: ensure Docker daemon active; clear stale containers with docker rm -f $(docker ps -aq). Version test: act --version => v0.2.77.

## Sanitised Extract
Table of Contents:
1. Prerequisites
2. Repository Clone
3. Build Targets
4. Installation Path
5. Execution Flow

1. Prerequisites
   - Go version: 1.20+
   - Docker daemon: running and accessible via Docker API socket

2. Repository Clone
   - Command: git clone git@github.com:nektos/act.git
   - Default branch: master

3. Build Targets
   - make test: invokes go test ./...  with codecov flags
   - make install: go build -o act main.go; installs to $GOPATH/bin

4. Installation Path
   - Binary installed at: $GOPATH/bin/act (or $HOME/go/bin/act)
   - Version file: ./VERSION contains semantic version tag

5. Execution Flow
   - act [options] [event] invokes workflow runner
   - Reads all YAML under .github/workflows
   - Pulls images: docker pull <image> or docker build <Dockerfile>
   - Sets environment: GITHUB_* variables per action context
   - Runs steps in containers in dependency order

## Original Source
act: Run GitHub Actions Locally
https://github.com/nektos/act#readme

## Digest of ACT_LOCAL

# Overview

Think globally, act locally

Run your GitHub Actions locally using the act CLI. Fast Feedback: test changes to .github/workflows/ without commit/push. Local Task Runner: use GitHub Actions as a Makefile replacement.

# How It Works

1. Reads workflow YAML files from .github/workflows/
2. Parses actions, steps, dependencies, and container images
3. Uses Docker API to pull or build images defined under uses: or image:
4. Resolves execution path per workflow dependencies
5. Launches containers for each action with environment variables and filesystem matching GitHub

# Manual Build and Install (Retrieved on 2024-06-15)

Prerequisites:
- Go tools version 1.20 or later
- Docker daemon running

Commands:

    git clone git@github.com:nektos/act.git
    cd act
    make test        # runs unit tests via go test and codecov integration
    make install     # compiles main.go, installs binary 'act' into $GOPATH/bin


## Attribution
- Source: act: Run GitHub Actions Locally
- URL: https://github.com/nektos/act#readme
- License: License: MIT License
- Crawl Date: 2025-05-11T03:20:14.733Z
- Data Size: 567858 bytes
- Links Found: 5125

## Retrieved
2025-05-11
