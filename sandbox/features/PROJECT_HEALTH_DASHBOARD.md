# Objective

Add a project health dashboard to the README to display key project metrics at a glance including version, license, downloads, and Node.js support.

# Value Proposition

Provides immediate visibility into project status and health, improving user confidence and easing maintenance by surfacing critical metrics directly in the repository.

# Scope

- Update sandbox/README.md to insert a new section titled Project Health Dashboard immediately after the repository header.
- Add shields badges for:
  - npm version using https://img.shields.io/npm/v/@xn-intenton-z2a/agentic-lib
  - license using https://img.shields.io/npm/l/@xn-intenton-z2a/agentic-lib
  - monthly downloads using https://img.shields.io/npm/dm/@xn-intenton-z2a/agentic-lib
  - Node.js support using https://img.shields.io/node/v/@xn-intenton-z2a/agentic-lib
- Ensure each badge links to the appropriate resource on npm or Node.js website.

# Success Criteria

1. README contains a new Project Health Dashboard section with all specified badges in the correct order.
2. Badges render correctly when viewed on GitHub with valid links.
3. No existing content in README is removed or altered outside the new section.
4. Automated tests remain unaffected and all CI checks pass.
