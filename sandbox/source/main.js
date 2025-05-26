#!/usr/bin/env node
// sandbox/source/main.js

import { fileURLToPath } from "url";

export async function main(args) {
  // SPARQL crawler CLI command
  if (args[0] === "--sparql" && args[1]) {
    const source = args[1].toLowerCase();
    const endpoints = {
      wikidata: "https://query.wikidata.org/sparql",
      dbpedia: "http://dbpedia.org/sparql"
    };
    if (!endpoints[source]) {
      console.error(`Unsupported SPARQL source: ${source}`);
      return;
    }
    const defaultQueries = {
      wikidata: "SELECT ?item WHERE { ?item wdt:P31 wd:Q5 } LIMIT 10",
      dbpedia: "PREFIX dbo: <http://dbpedia.org/ontology/> SELECT ?item WHERE { ?item a dbo:Person } LIMIT 10"
    };
    const query = args[2] || defaultQueries[source];
    const url = new URL(endpoints[source]);
    url.searchParams.set("query", query);
    try {
      const response = await fetch(url.toString(), {
        headers: { Accept: "application/sparql-results+json" }
      });
      const json = await response.json();
      const bindings =
        json.results && Array.isArray(json.results.bindings)
          ? json.results.bindings
          : [];
      console.log(JSON.stringify(bindings));
    } catch (error) {
      console.error(`Error fetching SPARQL data: ${error}`);
    }
    return;
  }

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