#!/usr/bin/env node
// sandbox/source/main.js

import { fileURLToPath } from "url";

/**
 * Log an error message to stderr.
 * @param {string} message
 */
function logError(message) {
  console.error(message);
}

/**
 * Process the --fetch-wikipedia flag.
 * @param {string[]} args
 * @returns {Promise<boolean>} true if flag was handled
 */
async function processFetchWikipedia(args) {
  const idx = args.indexOf("--fetch-wikipedia");
  if (idx !== -1) {
    const topic = args[idx + 1];
    if (!topic) {
      logError("Missing topic for --fetch-wikipedia flag");
      return true;
    }
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      topic
    )}`;
    let response;
    try {
      response = await fetch(url);
    } catch (err) {
      logError(`Error fetching Wikipedia summary: ${err}`);
      return true;
    }
    if (!response.ok) {
      logError(`Error fetching Wikipedia summary: ${response.status} ${response.statusText}`);
      return true;
    }
    let data;
    try {
      data = await response.json();
    } catch (err) {
      logError(`Error parsing Wikipedia response: ${err}`);
      return true;
    }
    console.log(JSON.stringify(data));
    return true;
  }
  return false;
}

/**
 * Main entrypoint for sandbox CLI.
 * @param {string[]} args
 */
export async function main(args) {
  if (await processFetchWikipedia(args)) {
    return;
  }
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args).catch((err) => {
    logError(`Fatal error in sandbox CLI: ${err}`);
    process.exit(1);
  });
}
