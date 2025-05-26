#!/usr/bin/env node
// sandbox/source/main.js

import { createSQSEventFromDigest, digestLambdaHandler, logInfo, logError } from "../../src/lib/main.js";
import { fileURLToPath } from "url";

/**
 * Process the --sparql flag: execute SPARQL query or preset, wrap results in SQS events, and invoke digest handler.
 * @param {string[]} args - Command-line arguments
 * @returns {Promise<boolean>} - True if --sparql was handled, false otherwise
 */
export async function processSparql(args = []) {
  const idx = args.indexOf("--sparql");
  if (idx === -1) {
    return false;
  }
  const queryOrPreset = args[idx + 1] || "";
  const endpointFlagIndex = args.indexOf("--endpoint");
  const endpoint = endpointFlagIndex !== -1 && args[endpointFlagIndex + 1]
    ? args[endpointFlagIndex + 1]
    : "https://query.wikidata.org/sparql";
  const SPARQL_PRESETS = {
    "wikidata-items": "SELECT ?item WHERE { ?item wdt:P31 wd:Q5 } LIMIT 3",
  };
  const query = SPARQL_PRESETS[queryOrPreset] || queryOrPreset;
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/sparql-query" },
      body: query,
    });
    if (!response.ok) {
      logError(`Error fetching SPARQL from ${endpoint}`, `${response.status}`);
      process.exit(1);
    }
    const data = await response.json();
    const bindings = data.results?.bindings || [];
    for (const binding of bindings) {
      const timestamp = new Date().toISOString();
      const digest = { query, endpoint, binding, timestamp };
      const event = createSQSEventFromDigest(digest);
      await digestLambdaHandler(event);
    }
    logInfo(`SPARQL query processed at ${endpoint}, bindings: ${bindings.length}`);
    return true;
  } catch (error) {
    logError(`Error executing SPARQL query against ${endpoint}`, error.toString());
    process.exit(1);
  }
}

/**
 * Main entry point for sandbox CLI
 * @param {string[]} args - Command-line arguments
 * @returns {Promise<boolean>} - True if a command was handled, false otherwise
 */
export async function main(args = []) {
  if (await processSparql(args)) {
    return true;
  }
  console.log(`Run with: ${JSON.stringify(args)}`);
  return false;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
