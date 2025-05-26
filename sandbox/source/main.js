#!/usr/bin/env node
// sandbox/source/main.js

import { fileURLToPath } from "url";
import express from "express";
import { createSQSEventFromDigest, digestLambdaHandler } from "../../src/lib/main.js";

/**
 * Create and configure the Express HTTP server for digest ingestion.
 * @returns {import('express').Express}
 */
export function createHttpServer() {
  const app = express();
  // Parse JSON bodies
  app.use(express.json());

  // POST /digest endpoint
  app.post("/digest", async (req, res) => {
    try {
      const event = createSQSEventFromDigest(req.body);
      const result = await digestLambdaHandler(event);
      return res.status(200).json({ batchItemFailures: result.batchItemFailures });
    } catch (error) {
      // Log handler errors and return 500
      console.error(
        JSON.stringify({
          level: "error",
          message: "Error handling /digest",
          error: error ? error.toString() : undefined,
        }),
      );
      return res.status(500).json({ error: "Internal Server Error" });
    }
  });

  // Middleware to catch invalid JSON parse errors
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res.status(400).json({ error: "Invalid JSON" });
    }
    return next(err);
  });

  return app;
}

/**
 * Main CLI entrypoint: runs HTTP server if no arguments, otherwise echoes args.
 * @param {string[]} args
 */
export function main(args = process.argv.slice(2)) {
  if (args.length === 0) {
    const app = createHttpServer();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
    return;
  }
  console.log(`Run with: ${JSON.stringify(args)}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
