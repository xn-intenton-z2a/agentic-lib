#!/usr/bin/env node
// sandbox/source/main.js

import { readFileSync } from "fs";
import { fileURLToPath } from "url";

export function main(args) {
  if (args.includes("--hello") || args.length === 0) {
    console.log("Hello World!");
    return;
  }
  if (args.includes("--mission")) {
    try {
      const missionPath = fileURLToPath(new URL("../MISSION.md", import.meta.url));
      const missionText = readFileSync(missionPath, "utf-8");
      console.log(missionText);
    } catch (error) {
      console.error("Failed to read mission file:", error);
    }
    return;
  }
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
