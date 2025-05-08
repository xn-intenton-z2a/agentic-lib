import { startConsoleCapture, stopConsoleCapture, getCapturedOutput, clearCapturedOutput } from "../source/consoleCapture.js";
import { beforeEach, afterEach, expect } from "vitest";

const enableCapture = Boolean(process.env.VITEST_CONSOLE_CAPTURE);

beforeEach(() => {
  if (enableCapture) {
    startConsoleCapture();
  }
});

afterEach(() => {
  if (enableCapture) {
    stopConsoleCapture();
    const logs = getCapturedOutput();
    if (logs.length > 0) {
      const testName = expect.getState().currentTestName;
      console.log(`[Console Capture] ${testName}`);
      logs.forEach((entry) => {
        console.log(JSON.stringify(entry));
      });
    }
    clearCapturedOutput();
  }
});