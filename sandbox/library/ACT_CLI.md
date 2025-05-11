# ACT_CLI

## Crawl Summary
Installation via Go 1.20+, clone repo, make install. CLI subcommands: list events, specify job, event file, working directory, secrets, bind mounts, reuse containers, verbose. Use act [event] to simulate GitHub Actions events. Use -P to map runner labels to Docker images. Create ~/.actrc to persist defaults.

## Normalised Extract
Table of Contents

1. Installation
2. CLI Options
3. Event Simulation
4. Docker Image Mapping
5. Workflow & Job Execution
6. Configuration File

1. Installation
- Prerequisite: Go >=1.20
- Commands:
  git clone git@github.com:nektos/act.git
  cd act
  make test
  make install (installs `act` binary into GOPATH/bin)

2. CLI Options
- -l, --list: list events
- -P label=image: map runner label to image
- -j job: run specific job
- -e eventpath: path to event JSON
- -C dir: working directory
- -s NAME=VALUE: secret variable
- -S NAME=PATH: secret from file
- -b host:container: mount directory
- -B hostfile:containerfile: mount file
- -r, --reuse: reuse existing containers
- --cache path: container cache dir

3. Event Simulation
- List events: act --list
- Simulate push: act push
- Custom event: act -e ./pr.json pull_request

4. Docker Image Mapping
- Default: ubuntu-latest=nektos/act-environments-ubuntu:18.04
- Override: act -P ubuntu-latest=myrepo/ubuntu:20.04
- Pull images: act pull_request

5. Workflow & Job Execution
- Run all jobs: act
- Single job: act -j test
- Change directory: act -C ./repo
- Verbose logs: act -v

6. Configuration File
- File: ~/.actrc
- Fields:
  platform: label=image
  directory: path
  event: default event
  secrets: key: value
  bind: [host:container]
  reuse: true|false
  cache: path


## Supplementary Details
Exact default mapping: ubuntu-latest=nektos/act-environments-ubuntu:18.04
Default event fixtures stored in bin/event.json for each GitHub Actions event type.
Installation $GOPATH/bin is added to PATH.
act searches .github/workflows/*.yml for workflows.
Containers run with WORKDIR=/github/workspace and GITHUB_WORKSPACE environment variable.
Secret value injection via environment variables inside container.
Bind mounts default to workspace root unless overridden.
Cache directory is mounted as a Docker volume with name act-cache by default.
Reuse flag retains stopped containers by job name; next run skips creation and uses existing containers.


## Reference Details
CLI Specification

Signature:
act [FLAGS] [EVENT_NAME]

Flags:
--list,-l                           bool     List supported events
--platform,-P label=image           string   Map GitHub runner labels to Docker images
--job,-j job_name                   string   Run single job by name
--eventpath,-e path                 string   Specify GitHub event JSON
--directory,-C dir                  string   Change working directory
--secret,-s NAME=VALUE              []string Pass secret as environment variable
--secret-file,-S NAME=FILEPATH      []string Load secret from file content
--bind,-b src:dst                   []string Bind mount host directory
--bind-file,-B srcfile:dstfile      []string Bind mount host file
--reuse,-r                          bool     Reuse existing containers
--cache path                        string   Mount host directory as cache
--verbose,-v                        bool     Enable verbose output
--quiet,-q                          bool     Suppress non-error output
--help,-h                           bool     Show usage

Return Codes:
0 Success
1 Configuration error or invalid flags
2 Workflow parsing error
3 Docker API error

Examples:

1. Run default workflow with push event:
   act

2. Run PR event with custom data:
   act -e events/pull_request.json pull_request

3. Execute only build job:
   act -j build

4. Use custom image for ubuntu-latest label:
   act -P ubuntu-latest=myrepo:20.04

5. Persist cache to /tmp/act-cache and reuse containers:
   act --cache /tmp/act-cache --reuse

Troubleshooting:

Command: act -v
Expected Output Snippet:
  INFO[0000] Checking for workflow files in .github/workflows
  DEBU[0000] Loading event payload from ./.github/events/push.json
  DEBU[0001] Pulling image nektos/act-environments-ubuntu:18.04

If Docker socket connection fails:
  Verify Docker daemon is running: systemctl status docker
  Ensure current user is in docker group: sudo usermod -aG docker $USER

If missing permissions mounting workspace:
  Use sudo or adjust mount propagation flags:
    act --privileged


## Information Dense Extract
Install: Go>=1.20, git clone, make test, make install.
CLI Flags: -l list, -P label=image, -j job, -e event.json, -C dir, -s NAME=VAL, -S NAME=PATH, -b host:cont, -B file, -r reuse, --cache path, -v verbose.
Default image mapping: ubuntu-latest=nektos/act-environments-ubuntu:18.04.
List events: act --list; push: act push; custom: act -e pr.json pull_request.
Run all jobs: act; single job: act -j build; change dir: act -C ./repo.
~/.actrc: platform, directory, event, secrets, bind, reuse, cache.
Reuse retains containers; cache mounts volume; workspace at /github/workspace.
Troubleshoot: act -v logs; Docker socket: systemctl status docker; add user to docker group.

## Sanitised Extract
Table of Contents

1. Installation
2. CLI Options
3. Event Simulation
4. Docker Image Mapping
5. Workflow & Job Execution
6. Configuration File

1. Installation
- Prerequisite: Go >=1.20
- Commands:
  git clone git@github.com:nektos/act.git
  cd act
  make test
  make install (installs 'act' binary into GOPATH/bin)

2. CLI Options
- -l, --list: list events
- -P label=image: map runner label to image
- -j job: run specific job
- -e eventpath: path to event JSON
- -C dir: working directory
- -s NAME=VALUE: secret variable
- -S NAME=PATH: secret from file
- -b host:container: mount directory
- -B hostfile:containerfile: mount file
- -r, --reuse: reuse existing containers
- --cache path: container cache dir

3. Event Simulation
- List events: act --list
- Simulate push: act push
- Custom event: act -e ./pr.json pull_request

4. Docker Image Mapping
- Default: ubuntu-latest=nektos/act-environments-ubuntu:18.04
- Override: act -P ubuntu-latest=myrepo/ubuntu:20.04
- Pull images: act pull_request

5. Workflow & Job Execution
- Run all jobs: act
- Single job: act -j test
- Change directory: act -C ./repo
- Verbose logs: act -v

6. Configuration File
- File: ~/.actrc
- Fields:
  platform: label=image
  directory: path
  event: default event
  secrets: key: value
  bind: [host:container]
  reuse: true|false
  cache: path

## Original Source
act: Run GitHub Actions Locally
https://github.com/nektos/act#readme

## Digest of ACT_CLI

# Installation

Install Go tools 1.20+ from https://golang.org/doc/install

Clone act repository:

    git clone git@github.com:nektos/act.git

Run tests:

    cd act
    make test

Build and install CLI:

    make install

# CLI OPTIONS

Usage: `act [options] [event]`

Options:

  -l, --list                List available GitHub Actions events
  -P, --platform string      Map runner labels to Docker images (default "ubuntu-latest=nektos/act-environments-ubuntu:18.04")
  -j, --job string           Specify a job name to run
  -e, --eventpath string     Path to JSON file that contains the event payload
  -C, --directory string     Working directory (defaults to current directory)
  -s, --secret stringArray   Secret in the form NAME=VALUE (can be specified multiple times)
  -S, --secret-file stringArray   Secret file in form NAME=PATH (can be specified multiple times)
  -v, --verbose              Enable verbose logging
  -q, --quiet                Suppress output
  -b, --bind stringArray     Mount host directory (host_path:container_path)
  -B, --bind-file stringArray   Bind mount a file (host_file:container_file)
  -r, --reuse                Reuse containers
  --cache string             Path to cache directory inside container
  -h, --help                 Display help and exit

# EVENT SIMULATION

Use built-in event fixtures or custom event data. To list events:

    act --list

Simulate `push` event using default fixture:

    act push

Simulate event from file:

    act -e path/to/event.json pull_request

# DOCKER IMAGE MANAGEMENT

Map runner labels to custom images:

    act -P ubuntu-latest=myrepo/ubuntu:20.04

Pull missing images before execution:

    act pull_request --platform ubuntu-latest=myrepo/ubuntu:20.04

# WORKFLOW EXECUTION

Run full workflow defined in .github/workflows:

    act

Run single job:

    act -j build

Override working directory:

    act -C ./projectdir

Enable caching directory `/tmp/cache`:

    act -v --cache /tmp/cache

# ADVANCED CONFIGURATION

Create `~/.actrc` with default options:

    platform: ubuntu-latest=nektos/act-environments-ubuntu:18.04
    directory: project
    secrets:
      FOO: bar
    bind:
      - ".:/github/workspace"
    event: "push"
    reuse: true
    cache: "/tmp/act-cache"


## Attribution
- Source: act: Run GitHub Actions Locally
- URL: https://github.com/nektos/act#readme
- License: License: MIT License
- Crawl Date: 2025-05-11T03:36:07.745Z
- Data Size: 630214 bytes
- Links Found: 5601

## Retrieved
2025-05-11
