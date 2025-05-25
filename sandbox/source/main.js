// Sandbox CLI entrypoint

export async function processFetchWikipedia(args = []) {
  const idx = args.indexOf("--fetch-wikipedia");
  if (idx !== -1) {
    const topic = args[idx + 1];
    if (!topic) {
      console.error("Missing topic for --fetch-wikipedia flag");
      return true;
    }
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
      topic
    )}`;
    let response;
    try {
      response = await fetch(url);
    } catch (err) {
      console.error(`Error fetching Wikipedia summary: ${err.message}`);
      return true;
    }
    if (!response.ok) {
      console.error(
        `Error fetching Wikipedia summary: ${response.status} ${response.statusText}`
      );
      return true;
    }
    const data = await response.json();
    console.log(JSON.stringify(data));
    return true;
  }
  return false;
}

export async function main(args = process.argv.slice(2)) {
  const handled = await processFetchWikipedia(args);
  if (handled) {
    return;
  }
  console.log(`Run with: ${JSON.stringify(args)}`);
}

// If run directly, invoke main
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
