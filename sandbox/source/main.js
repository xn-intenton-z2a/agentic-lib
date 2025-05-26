#!/usr/bin/env node
// sandbox/source/main.js

import fs from "fs";

export async function main(args = process.argv.slice(2)) {
  const usage = `Usage: node sandbox/source/main.js [--help] [--source wikidata|dbpedia] --crawl <SPARQL_QUERY> [--output <file>]`;

  if (args.includes("--help")) {
    console.log(usage);
    return;
  }

  // Default source is wikidata
  let source = "wikidata";
  let idx = args.indexOf("--source");
  if (idx !== -1) {
    if (idx + 1 >= args.length) {
      console.error("Missing source identifier after --source");
      throw new Error("Missing source identifier");
    }
    source = args[idx + 1];
    const validSources = ["wikidata", "dbpedia"];
    if (!validSources.includes(source)) {
      console.error(`Unknown source: ${source}`);
      throw new Error(`Unknown source: ${source}`);
    }
  }

  // Ensure --crawl flag is present
  const crawlIdx = args.indexOf("--crawl");
  if (crawlIdx === -1) {
    console.log("No --crawl flag supplied.");
    console.log(usage);
    return;
  }

  if (crawlIdx + 1 >= args.length) {
    console.error("Missing SPARQL query after --crawl");
    throw new Error("Missing SPARQL query");
  }
  const query = args[crawlIdx + 1];
  if (!query) {
    console.error("Empty SPARQL query");
    throw new Error("Empty SPARQL query");
  }

  // SPARQL endpoints
  const endpoints = {
    wikidata: "https://query.wikidata.org/sparql",
    dbpedia: "https://dbpedia.org/sparql",
  };
  const endpoint = endpoints[source];
  const url = `${endpoint}?query=${encodeURIComponent(query)}`;

  // Fetch SPARQL results
  let response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/sparql-results+json" },
    });
  } catch (err) {
    console.error(`Fetch error: ${err}`);
    throw err;
  }
  if (!response.ok) {
    console.error(`HTTP error: ${response.status}`);
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data = await response.json();
  const bindings = (data.results && data.results.bindings) || [];
  const nodes = bindings.map((binding) => {
    const { item, itemLabel, ...rest } = binding;
    const key = item.value;
    const label = itemLabel.value;
    const properties = {};
    for (const [k, v] of Object.entries(rest)) {
      properties[k] = v.value;
    }
    return { key, label, properties };
  });

  const outputStr = JSON.stringify(nodes, null, 2);

  const outIdx = args.indexOf("--output");
  if (outIdx !== -1) {
    if (outIdx + 1 >= args.length) {
      console.error("Missing output file path after --output");
      throw new Error("Missing output file path");
    }
    const outPath = args[outIdx + 1];
    fs.writeFileSync(outPath, outputStr, "utf8");
  } else {
    console.log(outputStr);
  }
}

// Execute when run directly
if (import.meta.url.endsWith("/sandbox/source/main.js") && require.main === undefined) {
  main().catch(() => process.exit(1));
}
