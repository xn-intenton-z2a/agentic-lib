#!/usr/bin/env node
// sandbox/source/main.js

import { fileURLToPath } from "url";

export async function main(args) {
  const crawlIndex = args.indexOf("--crawl");
  if (crawlIndex !== -1) {
    const url = args[crawlIndex + 1];
    if (!url) {
      console.error(
        JSON.stringify({ error: "FetchError", message: "No URL provided", url: null })
      );
      process.exit(1);
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(JSON.stringify(data));
    } catch (err) {
      const errorType = err.name === "SyntaxError" ? "JSONParseError" : "FetchError";
      console.error(
        JSON.stringify({ error: errorType, message: err.message, url })
      );
      process.exit(1);
    }
    return;
  }

  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args).catch((err) => {
    console.error(JSON.stringify({ error: "FetchError", message: err.message, url: null }));
    process.exit(1);
  });
}
