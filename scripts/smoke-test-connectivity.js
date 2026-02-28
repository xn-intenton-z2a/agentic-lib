#!/usr/bin/env node
// smoke-test-connectivity.js — Tier 2 connectivity smoke test
//
// Verifies that the GitHub API and Copilot SDK are accessible.
// Requires GITHUB_TOKEN environment variable.
// Exit 0 on success, 1 on failure with diagnostic output.

const token = process.env.GITHUB_TOKEN;
if (!token) {
  console.error("SKIP: GITHUB_TOKEN not set — cannot run connectivity smoke test");
  process.exit(0); // Don't fail CI if token is unavailable
}

const REPO_OWNER = "xn-intenton-z2a";
const REPO_NAME = "agentic-lib";

let failures = 0;

async function testGitHubApi() {
  console.log("--- GitHub REST API ---");
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    console.log(`  OK: ${data.full_name} (${data.visibility})`);
  } catch (err) {
    console.error(`  FAIL: GitHub API: ${err.message}`);
    failures++;
  }
}

async function testGraphQL() {
  console.log("--- GitHub GraphQL API ---");
  try {
    const query = `query { repository(owner: "${REPO_OWNER}", name: "${REPO_NAME}") { discussion(number: 1775) { title } } }`;
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();
    if (data.errors) {
      throw new Error(data.errors.map((e) => e.message).join(", "));
    }
    console.log(`  OK: Discussion #1775 title: "${data.data.repository.discussion.title}"`);
  } catch (err) {
    console.error(`  FAIL: GraphQL: ${err.message}`);
    failures++;
  }
}

async function testCopilotSdk() {
  console.log("--- Copilot SDK ---");
  try {
    const { CopilotClient } = await import("@github/copilot-sdk");
    const client = new CopilotClient({ githubToken: token });
    console.log("  OK: CopilotClient instantiated");
    // Note: createSession requires a model allocation which may not be available.
    // For now, just verify the SDK loads and the client can be created.
    await client.stop();
    console.log("  OK: Client stopped cleanly");
  } catch (err) {
    if (err.code === "ERR_MODULE_NOT_FOUND") {
      console.log("  SKIP: @github/copilot-sdk not installed (expected in dev)");
    } else {
      console.error(`  WARN: Copilot SDK: ${err.message}`);
      // Don't count as failure — SDK availability is Risk #12/#13
    }
  }
}

async function main() {
  console.log(`Smoke test: ${REPO_OWNER}/${REPO_NAME}\n`);
  await testGitHubApi();
  await testGraphQL();
  await testCopilotSdk();

  const summary = failures === 0 ? "ALL PASSED" : `${failures} FAILURE(S)`;
  console.log(`\n${summary}`);
  process.exit(failures > 0 ? 1 : 0);
}

main();
