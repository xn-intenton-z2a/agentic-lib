import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { agenticHandler } from "../source/main.js";

// Mock OpenAI
const fakeSuggestions = [{ action: "Test suggestion" }];
vi.mock("openai", () => {
  return {
    Configuration: (config) => config,
    OpenAIApi: class {
      async createChatCompletion() {
        return {
          data: {
            choices: [
              { message: { content: JSON.stringify(fakeSuggestions) } }
            ]
          }
        };
      }
    }
  };
});

beforeEach(() => {
  vi.restoreAllMocks();
  // Mock fetch
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("agenticHandler success path", () => {
  test("returns suggestions for valid issueUrl", async () => {
    // Mock GitHub API response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ title: "Issue Title", body: "Issue Body" }),
    });

    const result = await agenticHandler({ issueUrl: "https://github.com/owner/repo/issues/123" });
    expect(result).toEqual({ suggestions: fakeSuggestions });
    expect(global.fetch).toHaveBeenCalled();
  });
});

describe("agenticHandler error path", () => {
  test("throws on GitHub 404 error", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 404, statusText: "Not Found" });
    await expect(
      agenticHandler({ issueUrl: "https://github.com/owner/repo/issues/999" })
    ).rejects.toThrow("GitHub API error: 404 Not Found");
  });

  test("throws on malformed OpenAI JSON", async () => {
    // GitHub OK
    global.fetch.mockResolvedValueOnce({ ok: true, json: async () => ({ title: "T", body: "B" }) });
    // OpenAI returns invalid JSON
    vi.mocked(OpenAIApi, true).mockImplementationOnce(() => {
      return {
        createChatCompletion: async () => ({ data: { choices: [{ message: { content: "not-json" } }] } })
      };
    });
    await expect(
      agenticHandler({ issueUrl: "https://github.com/owner/repo/issues/123" })
    ).rejects.toThrow("Invalid JSON from OpenAI");
  });
});
