# Features

List of available features and how to retrieve them. Each feature object now includes `name`, `title`, and `description` to provide context about the feature.

## CLI Usage

Retrieve feature list via the CLI:

```bash
node sandbox/source/main.js --features
```

**Response**

```json
{
  "mission": "# Mission Statement\n**agentic-lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.",
  "features": [
    {
      "name": "HTTP_INTERFACE",
      "title": "Objective & Scope",
      "description": "Provide a unified HTTP interface and complementary CLI flags to expose core agentic-lib functionality without adding new files beyond source, tests, README, and package.json. This feature covers service health, digest processing, webhook intake, mission and feature discovery, and in-memory runtime metrics in a single Express application."
    }
  ]
}
```

## HTTP Endpoint

Retrieve feature list via HTTP:

```bash
curl http://localhost:3000/features
```

**Response**

```json
{
  "mission": "# Mission Statement\n**agentic-lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.",
  "features": [
    {
      "name": "HTTP_INTERFACE",
      "title": "Objective & Scope",
      "description": "Provide a unified HTTP interface and complementary CLI flags to expose core agentic-lib functionality without adding new files beyond source, tests, README, and package.json. This feature covers service health, digest processing, webhook intake, mission and feature discovery, and in-memory runtime metrics in a single Express application."
    }
  ]
}
```