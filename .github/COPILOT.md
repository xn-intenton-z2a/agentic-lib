# intentïon agentic-lib - GitHub Copilot Code Review Instructions

**Last Updated:** 2026-02-28

## About This File

This file contains guidelines for **GitHub Copilot** code review agent. The repository also has guidelines for other AI coding assistants:
- `CLAUDE.md` — Guidelines for Claude Code (emphasis on autonomous task execution & implementation)
- `AGENT_COORDINATION.md` — Multi-agent coordination patterns

Each assistant has complementary strengths — GitHub Copilot is optimized for code review, analysis, and providing thoughtful feedback.

## Repository Documentation

**Primary References**:
- `./README.md` — Project overview and architecture
- `./CONTRIBUTING.md` — Contribution guidelines and feature requirements
- `./MISSION.md` — Project mission (if present)
- `./package.json` — Available scripts and dependencies
- `./AGENT_COORDINATION.md` — Multi-agent coordination guide

## What This Repository Is

The **core SDK** of the intentïon project — a collection of reusable GitHub Actions workflows that enable repositories to operate autonomously. Workflows communicate through branches and issues to continuously review, fix, update, and evolve code.

- **Package**: `@xn-intenton-z2a/agentic-lib`
- **License**: GPL (with MIT-licensed examples in `sandbox/`)
- **Entry point**: `sandbox/source/main.js`
- **Consumers**: `repository0`, `repository0-crucible`, `repository0-plot-code-lib`, `repository0-xn--intenton-z2a.com`

## Code Review Philosophy

### Favor Analysis Over Execution

As a code review agent, prioritize **static analysis and code comprehension** over running tests:

1. **Read and understand** code paths by tracing through files
2. **Mentally dry-run** logic to identify potential issues
3. **Validate consistency** with existing patterns and conventions
4. **Check references** against documented scripts and configuration
5. **Suggest tests** when appropriate, but let developers/CI run them

### Analysis Workflow

When reviewing code changes, be as low friction as possible, maintaining current standards for the incoming code.

1. **Understand the context** — What problem is being solved? Which workflows are affected?
2. **Trace code paths** — Follow execution flow through workflow YAML and JavaScript
3. **Validate against patterns** — Does it match existing workflow conventions?
4. **Consider cross-cutting concerns** — Security, OpenAI API usage, workflow permissions
5. **Suggest minimal changes** — Focus on surgical, targeted improvements

## Repository Patterns and Conventions

### Code Style and Formatting

**JavaScript** (ES Modules):
- **Linter**: ESLint (flat config `eslint.config.js`)
- **Formatter**: Prettier (`.prettierrc`)
- **Scripts**: Only run if specifically asked: `npm run linting-fix && npm run formatting-fix`

**General Style Rule**: Match existing local style rather than forcing global rules. Only change style in code you're already modifying. Avoid unnecessary formatting changes.

### Testing

```bash
npm test                  # Unit tests (vitest)
npm run test:unit         # Unit tests with coverage
```

Tests use **Vitest**. Test files are in `tests/unit/` and `sandbox/tests/`.

### Key Architecture

- **Reusable workflows** (`.github/workflows/`) — invoked via `workflow_call`
- **Agent configurations** (`.github/agents/`) — define agent behavior patterns
- **Sandbox** (`sandbox/`) — restricted path for automated code changes
- **Source** (`src/lib/`) — core library code

### Naming Conventions

- Workflow files: `agent-{type}-{action}.yml` or `ci-{purpose}.yml` or `publish-{target}.yml`
- Agent configs: `.github/agents/*.yml`
- npm scripts: colon separator for variants (e.g., `test:unit`)

## Code Review Focus Areas

### Security Considerations

1. **Secrets Management**
   - Never commit API keys (OpenAI, GitHub tokens)
   - GitHub Actions secrets for sensitive values
   - Check workflow permissions follow least privilege

2. **Workflow Permissions**
   - Verify `permissions:` blocks in workflow files
   - Check for overly broad `contents: write` or `issues: write`
   - OIDC trust policies scoped to specific repositories

3. **Sandbox Boundaries**
   - Automated changes should be restricted to `sandbox/` paths
   - Verify agent workflows don't escape sandbox restrictions

### Consistency with Patterns

**Workflow Patterns**:
- Reusable workflows use `workflow_call` trigger
- Agent workflows follow `agent-{flow|transformation}-{description}.yml` naming
- CI workflows follow `ci-{purpose}.yml` naming
- Concurrency groups prevent parallel deployments

**Error Handling**:
- Workflows should handle failure states gracefully
- Agent workflows should not silently fail

### Common Anti-patterns to Flag

- Workflows with `Resource: "*"` in IAM permissions
- Hard-coded secrets or API keys in workflow files
- Missing `permissions:` blocks on workflows
- Workflows that could run unbounded loops (OpenAI API cost risk)
- Unnecessary formatting changes in PRs

## Multi-Agent Coordination

GitHub Copilot works alongside:
- **Claude Code** — Primary implementation agent (uses `claude/*` branches)
- **ChatGPT Discussions Bot** — Community engagement in repository0

See `AGENT_COORDINATION.md` for detailed coordination patterns.

**Key Points:**
- Use `copilot/*` branch naming convention
- Primarily own CI/CD and publishing workflows
- Review code with focus on security and consistency
- Tag other agents when their domain is affected

## Recommended Review Checklist

- [ ] **Read the PR description** — Understand the goal and context
- [ ] **Review changed files** — What workflows or source files are affected?
- [ ] **Trace workflow paths** — Follow the `workflow_call` chain
- [ ] **Check security** — Secrets, permissions, sandbox boundaries
- [ ] **Validate consistency** — Naming, patterns match existing conventions
- [ ] **Consider consumers** — Will this break repository0 or other consumers?
- [ ] **Check tests** — Are appropriate tests included/updated?
- [ ] **Review OpenAI usage** — Is API usage bounded and cost-aware?

## Resources

- **README**: `./README.md`
- **Contributing**: `./CONTRIBUTING.md`
- **Package Scripts**: `./package.json`
- **Workflows**: `./.github/workflows/`
- **Agent Configs**: `./.github/agents/`
- **Coordination**: `./AGENT_COORDINATION.md`

---

**Remember**: Your role as a code review agent is to provide thoughtful, analytical feedback. Leave test execution to developers and CI systems. Focus on pattern recognition, consistency checking, and security guidance.
