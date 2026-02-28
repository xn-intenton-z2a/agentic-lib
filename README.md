# intentïon `agentic-lib`

**Autonomous code evolution powered by GitHub Copilot.** Write a mission statement, and the agentic workflows will generate issues, write code, run tests, and open pull requests -- continuously evolving your repository toward its goal.

## How It Works

```
MISSION.md           Your project goals in plain English
    |
    v
[agentic-step]       GitHub Action wrapping the Copilot SDK
    |
    v
Issue -> Code -> Test -> PR -> Merge -> Next Issue
    ^                                       |
    +---------------------------------------+
              Autonomous cycle
```

The pipeline runs as GitHub Actions workflows on a schedule. Each step uses the `agentic-step` action to call the Copilot SDK with context from your repository (mission, contributing guidelines, existing code, test results) and produce targeted changes.

## Getting Started

1. Create a repository from the [repository0 template](https://github.com/xn-intenton-z2a/repository0)
2. Write your `MISSION.md`
3. Enable GitHub Copilot and activate the workflows

See the [Getting Started Guide](https://github.com/xn-intenton-z2a/repository0/blob/main/GETTING-STARTED.md) for detailed setup instructions.

## The `agentic-step` Action

The core of the system is a single GitHub Action at `.github/actions/agentic-step/` that handles all autonomous tasks:

| Task | Purpose |
|------|---------|
| `resolve-issue` | Read an issue and generate code to resolve it |
| `fix-code` | Fix failing tests or lint errors |
| `evolve` | Evolve the codebase toward the mission |
| `maintain-features` | Generate and maintain feature definitions |
| `maintain-library` | Update library documentation and sources |
| `enhance-issue` | Add detail and acceptance criteria to issues |
| `review-issue` | Review and close resolved issues |
| `discussions` | Respond to GitHub Discussions |

See [API.md](API.md) for full input/output documentation.

## Safety

The system includes built-in safety mechanisms:

- **WIP limits** -- maximum concurrent issues to prevent runaway generation
- **Attempt limits** -- maximum retries per branch and per issue
- **Path enforcement** -- writable and read-only path separation
- **TDD mode** -- optionally require tests before implementation
- **Mission protection** -- MISSION.md is read-only to the agent

## Demo

Run the interactive demo to see the system in action:

```bash
./demo.sh <your-github-username>
```

See [DEMO.md](DEMO.md) for what to expect.

## Showcase

View live experiment stats at the [stats dashboard](https://agentic-lib-public-website-stats-bucket.s3.eu-west-2.amazonaws.com/all.html).

## Licensing

- Core SDK: [GPL-3.0](LICENSE)
- Examples in `_developers/examples/`: [MIT](LICENSE-MIT)

## Links

- [repository0 template](https://github.com/xn-intenton-z2a/repository0) -- start here
- [Getting Started Guide](https://github.com/xn-intenton-z2a/repository0/blob/main/GETTING-STARTED.md)
- [API Reference](API.md)
- [Demo](DEMO.md)
- [Website](https://xn--intenton-z2a.com)
