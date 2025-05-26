#!/usr/bin/env node
// sandbox/source/main.js

import { fileURLToPath } from "url";

export async function main(args) {
  // CLI option to crawl a public URL and print JSON response
  if (args[0] === "--crawl" && args[1]) {
    try {
      const response = await fetch(args[1]);
      const data = await response.json();
      console.log(JSON.stringify(data));
    } catch (error) {
      console.error(`Error fetching or parsing JSON: ${error}`);
    }
    return;
  }

  // Default behavior: echo provided arguments
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
