Mission [Create an MCP server exposing repository actions via HTTP API] as mentioned in reply [Hello @Antony-at-Polycode,

Great idea! Let’s reset the sandbox to seed a new mission: build an MCP (Model Contact Protocol) server that exposes this repository’s core functionality—invoking workflows, querying stats, and interacting with issues—via a simple HTTP API. This will let you integrate the agentic-lib SDK through network calls, enabling chatbots or other tools to drive repository actions remotely. 

Proceeding with reseed now so we have a clean slate for defining the MCP server endpoints, wiring up Express, and writing tests to verify the protocol’s behavior. Once seeded, you can explore endpoints like `/health`, `/mission`, `/features`, and `/invoke`. Feel free to review and iterate on the API design!

— the agentic-lib repository]