import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";

let readFileMock;
let consoleLogMock;
let consoleErrorMock;
let exitMock;

describe("processValidatePackage", () => {
  beforeEach(() => {
    vi.resetModules();
    readFileMock = vi.fn();
    vi.doMock("fs/promises", () => ({ readFile: readFileMock }));
    consoleLogMock = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorMock = vi.spyOn(console, "error").mockImplementation(() => {});
    exitMock = vi.spyOn(process, "exit").mockImplementation((code) => {
      throw new Error(`EXIT:${code}`);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("success path: valid package.json", async () => {
    const pkg = {
      name: "test",
      version: "1.2.3",
      description: "desc",
      main: "index.js",
      scripts: { test: "vitest" },
      engines: { node: ">=20.0.0" },
    };
    readFileMock.mockResolvedValue(JSON.stringify(pkg));

    const { processValidatePackage } = await import("../source/main.js");
    await expect(
      processValidatePackage(["--validate-package"]),
    ).rejects.toThrow("EXIT:0");
    expect(consoleLogMock).toHaveBeenCalledWith(
      expect.stringContaining('"message":"Package manifest validation passed"'),
    );
  });

  test("failure path: missing fields", async () => {
    readFileMock.mockResolvedValue("{}");
    const { processValidatePackage } = await import("../source/main.js");
    await expect(
      processValidatePackage(["--validate-package"]),
    ).rejects.toThrow("EXIT:1");
    expect(consoleErrorMock).toHaveBeenCalledTimes(6);
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining('"field":"name"'),
    );
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining('"field":"version"'),
    );
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining('"field":"description"'),
    );
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining('"field":"main"'),
    );
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining('"field":"scripts.test"'),
    );
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining('"field":"engines.node"'),
    );
  });

  test("failure path: invalid version and engines", async () => {
    const pkg = {
      name: "test",
      version: "invalid",
      description: "desc",
      main: "index.js",
      scripts: { test: "vitest" },
      engines: { node: ">=10.0.0" },
    };
    readFileMock.mockResolvedValue(JSON.stringify(pkg));
    const { processValidatePackage } = await import("../source/main.js");
    await expect(
      processValidatePackage(["--validate-package"]),
    ).rejects.toThrow("EXIT:1");
    expect(consoleErrorMock).toHaveBeenCalledTimes(2);
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining('"field":"version"'),
    );
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining('"field":"engines.node"'),
    );
  });

  test("IO error case: readFile fails", async () => {
    readFileMock.mockRejectedValue(new Error("io error"));
    const { processValidatePackage } = await import("../source/main.js");
    await expect(
      processValidatePackage(["--validate-package"]),
    ).rejects.toThrow("EXIT:1");
    expect(consoleErrorMock).toHaveBeenCalledWith(
      expect.stringContaining("Failed to read package.json"),
    );
  });

  test("returns false when flag not provided", async () => {
    const { processValidatePackage } = await import("../source/main.js");
    const result = await processValidatePackage([]);
    expect(result).toBe(false);
  });
});
