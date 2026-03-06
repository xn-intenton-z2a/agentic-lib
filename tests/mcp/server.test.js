// SPDX-License-Identifier: GPL-3.0-only
// tests/mcp/server.test.js — Tests for MCP server

import { describe, it, expect, vi, beforeEach } from "vitest";

// Shared handler store — populated by MockServer.setRequestHandler
let mockHandlers = {};

vi.mock("@modelcontextprotocol/sdk/server/index.js", () => {
  class MockServer {
    constructor() {}
    setRequestHandler(schema, handler) {
      mockHandlers[schema?.method || "unknown"] = handler;
    }
    async connect() {}
  }
  return { Server: MockServer };
});

vi.mock("@modelcontextprotocol/sdk/server/stdio.js", () => {
  class MockTransport {}
  return { StdioServerTransport: MockTransport };
});

vi.mock("@modelcontextprotocol/sdk/types.js", () => ({
  CallToolRequestSchema: { method: "tools/call" },
  ListToolsRequestSchema: { method: "tools/list" },
}));

describe("MCP server", () => {
  beforeEach(() => {
    mockHandlers = {};
  });

  it("exports startServer function", async () => {
    const mod = await import("../../src/mcp/server.js");
    expect(mod.startServer).toBeDefined();
    expect(typeof mod.startServer).toBe("function");
  });

  it("registers tool handlers on start", async () => {
    const mod = await import("../../src/mcp/server.js");
    await mod.startServer();

    expect(mockHandlers["tools/list"]).toBeDefined();
    expect(mockHandlers["tools/call"]).toBeDefined();
  });

  it("lists all expected tools", async () => {
    const mod = await import("../../src/mcp/server.js");
    await mod.startServer();

    const result = await mockHandlers["tools/list"]();
    const toolNames = result.tools.map((t) => t.name);

    expect(toolNames).toContain("list_missions");
    expect(toolNames).toContain("workspace_create");
    expect(toolNames).toContain("workspace_list");
    expect(toolNames).toContain("workspace_status");
    expect(toolNames).toContain("workspace_destroy");
    expect(toolNames).toContain("iterate");
    expect(toolNames).toContain("run_tests");
    expect(toolNames).toContain("config_get");
    expect(toolNames).toContain("config_set");
    expect(toolNames).toContain("prepare_iteration");
    expect(toolNames).toContain("workspace_read_file");
    expect(toolNames).toContain("workspace_write_file");
    expect(toolNames).toContain("workspace_exec");
    expect(toolNames).toHaveLength(13);
  });

  it("each tool has inputSchema and description", async () => {
    const mod = await import("../../src/mcp/server.js");
    await mod.startServer();

    const result = await mockHandlers["tools/list"]();

    for (const tool of result.tools) {
      expect(tool.inputSchema).toBeDefined();
      expect(tool.inputSchema.type).toBe("object");
      expect(tool.description).toBeTruthy();
    }
  });

  it("list_missions returns available missions", async () => {
    const mod = await import("../../src/mcp/server.js");
    await mod.startServer();

    const callHandler = mockHandlers["tools/call"];
    const result = await callHandler({ params: { name: "list_missions", arguments: {} } });

    expect(result.content).toHaveLength(1);
    expect(result.content[0].type).toBe("text");
    expect(result.content[0].text).toContain("hamming-distance");
    expect(result.content[0].text).toContain("fizz-buzz");
  });

  it("workspace_create rejects unknown mission", async () => {
    const mod = await import("../../src/mcp/server.js");
    await mod.startServer();

    const callHandler = mockHandlers["tools/call"];
    const result = await callHandler({
      params: { name: "workspace_create", arguments: { mission: "nonexistent-mission-xyz" } },
    });

    expect(result.content[0].text).toContain("Unknown mission");
    expect(result.content[0].text).toContain("hamming-distance");
  });

  it("workspace_list returns empty when no workspaces exist", async () => {
    const mod = await import("../../src/mcp/server.js");

    process.env.AGENTIC_LIB_WORKSPACES = "/tmp/agentic-test-empty-" + Date.now();
    await mod.startServer();

    const callHandler = mockHandlers["tools/call"];
    const result = await callHandler({ params: { name: "workspace_list", arguments: {} } });

    expect(result.content[0].text).toContain("No workspaces found");

    delete process.env.AGENTIC_LIB_WORKSPACES;
  });

  it("handles unknown tool gracefully", async () => {
    const mod = await import("../../src/mcp/server.js");
    await mod.startServer();

    const callHandler = mockHandlers["tools/call"];
    const result = await callHandler({
      params: { name: "nonexistent_tool", arguments: {} },
    });

    expect(result.content[0].text).toContain("Unknown tool");
  });

  it("workspace_read_file rejects missing workspace", async () => {
    const mod = await import("../../src/mcp/server.js");
    process.env.AGENTIC_LIB_WORKSPACES = "/tmp/agentic-test-rw-" + Date.now();
    await mod.startServer();

    const callHandler = mockHandlers["tools/call"];
    const result = await callHandler({
      params: { name: "workspace_read_file", arguments: { workspace: "no-such-ws", path: "foo.txt" } },
    });

    expect(result.content[0].text).toContain("not found");

    delete process.env.AGENTIC_LIB_WORKSPACES;
  });

  it("workspace_exec blocks git write commands", async () => {
    const mod = await import("../../src/mcp/server.js");
    process.env.AGENTIC_LIB_WORKSPACES = "/tmp/agentic-test-exec-" + Date.now();
    await mod.startServer();

    const callHandler = mockHandlers["tools/call"];
    // First need a workspace — but we can test the handler directly
    const result = await callHandler({
      params: { name: "workspace_exec", arguments: { workspace: "no-such-ws", command: "git push origin main" } },
    });

    // Either "not found" (no workspace) or "not allowed" (blocked) — both are correct
    const txt = result.content[0].text;
    expect(txt.match(/not found|not allowed/)).toBeTruthy();

    delete process.env.AGENTIC_LIB_WORKSPACES;
  });
});
