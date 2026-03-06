#!/usr/bin/env node
// SPDX-License-Identifier: GPL-3.0-only
// scripts/test-mcp-server.js — Integration test for the MCP server
//
// Spawns the MCP server, sends initialize + tools/list via JSON-RPC over stdio,
// validates the response, and exits. No Copilot token needed.

import { spawn } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const binPath = resolve(__dirname, "../bin/agentic-lib.js");

const TIMEOUT_MS = 15000;

async function main() {
  console.log("Starting MCP server...");

  const server = spawn("node", [binPath, "mcp"], {
    stdio: ["pipe", "pipe", "pipe"],
    env: { ...process.env },
  });

  const responses = new Map();
  let buffer = "";

  server.stdout.on("data", (chunk) => {
    buffer += chunk.toString();
    // Parse newline-delimited JSON
    const lines = buffer.split("\n");
    buffer = lines.pop(); // keep incomplete last line
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const msg = JSON.parse(line);
        if (msg.id !== undefined) {
          responses.set(msg.id, msg);
        }
      } catch {
        // skip non-JSON lines
      }
    }
  });

  let stderr = "";
  server.stderr.on("data", (chunk) => {
    stderr += chunk.toString();
  });

  const timer = setTimeout(() => {
    console.error("TIMEOUT: MCP server did not respond in time");
    console.error("stderr:", stderr);
    server.kill();
    process.exit(1);
  }, TIMEOUT_MS);

  // Wait for server to start
  await sleep(500);

  // Step 1: Initialize
  console.log("Sending initialize...");
  send({
    jsonrpc: "2.0",
    id: 1,
    method: "initialize",
    params: {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "test-mcp-client", version: "1.0.0" },
    },
  });
  await waitFor(1);
  console.log("  -> initialized OK");

  // Step 2: Notify initialized
  send({ jsonrpc: "2.0", method: "notifications/initialized" });
  await sleep(200);

  // Step 3: List tools
  console.log("Sending tools/list...");
  send({ jsonrpc: "2.0", id: 2, method: "tools/list" });
  const toolsMsg = await waitFor(2);

  const tools = toolsMsg?.result?.tools;
  if (!tools || !Array.isArray(tools)) {
    fail("tools/list did not return tools array", toolsMsg);
  }

  const toolNames = tools.map((t) => t.name);
  console.log(`  -> ${tools.length} tools: ${toolNames.join(", ")}`);

  const expectedTools = [
    "list_missions",
    "workspace_create",
    "workspace_list",
    "workspace_status",
    "workspace_destroy",
    "iterate",
    "run_tests",
    "config_get",
    "config_set",
  ];

  let failures = 0;
  for (const name of expectedTools) {
    if (!toolNames.includes(name)) {
      console.error(`  MISSING: "${name}"`);
      failures++;
    }
  }

  if (tools.length !== expectedTools.length) {
    console.error(`  COUNT: expected ${expectedTools.length}, got ${tools.length}`);
    failures++;
  }

  for (const tool of tools) {
    if (!tool.inputSchema || tool.inputSchema.type !== "object") {
      console.error(`  SCHEMA: "${tool.name}" missing inputSchema`);
      failures++;
    }
    if (!tool.description) {
      console.error(`  DESC: "${tool.name}" missing description`);
      failures++;
    }
  }

  // Step 4: Call list_missions
  console.log("Calling list_missions...");
  send({
    jsonrpc: "2.0",
    id: 3,
    method: "tools/call",
    params: { name: "list_missions", arguments: {} },
  });
  const missionsMsg = await waitFor(3);
  const missionsText = missionsMsg?.result?.content?.[0]?.text || "";

  if (!missionsText.includes("hamming-distance")) {
    console.error("  MISSIONS: did not include hamming-distance");
    failures++;
  } else {
    const count = (missionsText.match(/^- \*\*/gm) || []).length;
    console.log(`  -> ${count} missions listed`);
  }

  // Step 5: Call workspace_create with bad mission
  console.log("Calling workspace_create (bad mission)...");
  send({
    jsonrpc: "2.0",
    id: 4,
    method: "tools/call",
    params: { name: "workspace_create", arguments: { mission: "nonexistent-xyz" } },
  });
  const badMissionMsg = await waitFor(4);
  const badText = badMissionMsg?.result?.content?.[0]?.text || "";

  if (!badText.includes("Unknown mission")) {
    console.error("  BAD_MISSION: did not reject unknown mission");
    failures++;
  } else {
    console.log("  -> correctly rejected unknown mission");
  }

  // Results
  if (failures > 0) {
    console.error(`\nFAILED: ${failures} check(s)`);
    cleanup(1);
  }

  console.log("\nAll MCP server integration checks passed.");
  cleanup(0);

  // ─── Helpers ──────────────────────────────────────────────────────

  function send(obj) {
    server.stdin.write(JSON.stringify(obj) + "\n");
  }

  function waitFor(id) {
    return new Promise((resolve) => {
      const check = setInterval(() => {
        if (responses.has(id)) {
          clearInterval(check);
          resolve(responses.get(id));
        }
      }, 50);
    });
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function fail(msg, data) {
    console.error(`ERROR: ${msg}`);
    if (data) console.error(JSON.stringify(data, null, 2));
    cleanup(1);
  }

  function cleanup(code) {
    clearTimeout(timer);
    server.kill();
    process.exit(code);
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
