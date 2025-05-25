#!/usr/bin/env node
import { fileURLToPath } from 'url';
import express from 'express';
import { z } from 'zod';
import { digestLambdaHandler, createSQSEventFromDigest } from '../../src/lib/main.js';

/**
 * Create an Express server with health, metrics, and digest endpoints.
 * @param {Object} options
 * @param {boolean} options.statsEnabled - Whether to include stats output (unused here).
 * @returns {import('express').Express}
 */
export function createServer({ statsEnabled = false } = {}) {
  const app = express();
  app.use(express.json());

  // Global request counter middleware
  app.use((req, res, next) => {
    globalThis.callCount = (globalThis.callCount || 0) + 1;
    next();
  });

  // Health endpoint
  app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // Metrics endpoint
  app.get('/metrics', (_req, res) => {
    res.status(200).json({ uptime: process.uptime(), callCount: globalThis.callCount });
  });

  // Schema for digest payload
  const digestSchema = z.object({
    key: z.string(),
    value: z.string(),
    lastModified: z
      .string()
      .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' }),
  });

  // Digest endpoint
  app.post('/digest', async (req, res) => {
    const result = digestSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ errors: result.error.errors });
    }
    try {
      // Invoke the existing digest handler
      await digestLambdaHandler(createSQSEventFromDigest(result.data));
      return res.sendStatus(200);
    } catch (err) {
      return res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
    }
  });

  return app;
}

/**
 * Start the HTTP server on the given port.
 * @param {Object} options
 * @param {number|string} options.port - Port number to listen on.
 * @param {boolean} options.statsEnabled - Whether to include stats output (unused here).
 * @returns {import('express').Express}
 */
export function startServer({ port = process.env.PORT || 3000, statsEnabled = false } = {}) {
  const app = createServer({ statsEnabled });
  app.listen(port, () => {
    console.log(`Server listening on port ${port} with statsEnabled=${statsEnabled}`);
  });
  return app;
}

/**
 * Main CLI entrypoint. Detects --serve flag.
 * @param {string[]} args
 */
export function main(args) {
  const serveIndex = args.indexOf('--serve');
  if (serveIndex !== -1) {
    const statsEnabled = args.includes('--stats');
    let port = process.env.PORT || 3000;
    const portIndex = args.indexOf('--port');
    if (portIndex !== -1 && args[portIndex + 1]) {
      const p = parseInt(args[portIndex + 1], 10);
      if (!isNaN(p)) {
        port = p;
      }
    }
    startServer({ port, statsEnabled });
    return;
  }
  console.log(`Run with: ${JSON.stringify(args)}`);
}

// Auto-run when invoked directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
