#!/usr/bin/env node

/**
 * Sandbox CLI main entry point.
 * Usage: node sandbox/source/main.js --crawl <url>
 */
export async function main(args = process.argv.slice(2)) {
  const crawlIndex = args.indexOf("--crawl");
  if (crawlIndex !== -1) {
    const url = args[crawlIndex + 1];
    try {
      const response = await fetch(url);
      let jsonData;
      try {
        jsonData = await response.json();
      } catch (err) {
        console.error(JSON.stringify({
          error: "JSONParseError",
          message: err.message,
          url,
        }));
        process.exit(1);
      }
      console.log(JSON.stringify(jsonData));
      return;
    } catch (err) {
      console.error(JSON.stringify({
        error: "FetchError",
        message: err.message,
        url,
      }));
      process.exit(1);
    }
  }

  // Default: show usage
  console.log("Usage: --crawl <url>");
}
