#!/usr/bin/env node
// sandbox/source/main.js

import express from 'express';
import { fileURLToPath } from 'url';
import { createSQSEventFromDigest, digestLambdaHandler } from '../../src/lib/main.js';

// Initialize global callCount
if (typeof globalThis.callCount === 'undefined') {
  globalThis.callCount = 0;
}

/**
 * Start an HTTP server with health, metrics, and digest endpoints.
 * @param {{port?: number|string}} options
 * @returns {import('http').Server}
 */
export async function startHttpServer({ port = process.env.HTTP_PORT || 3000 } = {}) {
  port = Number(port) || 3000;
  const app = express();
  app.use(express.json());

  // Health endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: Math.floor(process.uptime()) });
  });

  // Metrics endpoint
  app.get('/metrics', (req, res) => {
    globalThis.callCount += 1;
    res.json({ callCount: globalThis.callCount, uptime: Math.floor(process.uptime()) });
  });

  // Digest endpoint
  app.post('/digest', async (req, res) => {
    try {
      const digest = req.body;
      const event = createSQSEventFromDigest(digest);
      const result = await digestLambdaHandler(event);
      const failures = result.batchItemFailures.map(
        (f) => (typeof f === 'string' ? f : f.itemIdentifier)
      );
      res.json({ batchItemFailures: failures });
    } catch (err) {
      res.status(500).json({ error: err.toString() });
    }
  });

  // Start server
  const server = app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
  });

  // Graceful shutdown
  const shutdown = () => {
    server.close(() => {
      console.log('Server shut down gracefully');
      process.exit(0);
    });
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  return server;
}

/**
 * Main entry: prints args or starts server.
 * @param {string[]} args
 */
export function main(args = process.argv.slice(2)) {
  if (args.includes('--serve')) {
    const portIndex = args.indexOf('--port');
    const port = portIndex !== -1 ? args[portIndex + 1] : undefined;
    startHttpServer({ port }).catch((err) => {
      console.error(`Error starting server: ${err}`);
      process.exit(1);
    });
  } else {
    console.log(`Run with: ${JSON.stringify(args)}`);
  }
}

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
