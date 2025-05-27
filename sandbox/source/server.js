#!/usr/bin/env node
// sandbox/source/server.js

import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import pkg from '../../package.json' assert { type: 'json' };
import {
  createSQSEventFromDigest,
  digestLambdaHandler,
  logInfo,
  logError
} from '../../src/lib/main.js';

const app = express();
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  logInfo(`HTTP ${req.method} ${req.path}`);
  next();
});

// GET /health
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /mission
app.get('/mission', async (req, res) => {
  try {
    const missionPath = path.join(process.cwd(), 'sandbox', 'MISSION.md');
    const content = await fs.readFile(missionPath, 'utf-8');
    res.status(200).json({ mission: content });
  } catch (err) {
    logError('Failed to read mission file', err);
    res.status(404).json({ error: 'Mission file not found' });
  }
});

// GET /features
app.get('/features', (req, res) => {
  res.status(200).json(['digest', 'version', 'help']);
});

// POST /invoke
app.post('/invoke', async (req, res) => {
  const { command, args } = req.body;
  const validCommands = ['digest', 'version', 'help'];
  if (!validCommands.includes(command)) {
    return res.status(400).json({ error: 'Unsupported command' });
  }
  try {
    if (command === 'digest') {
      let payload;
      if (Array.isArray(args) && args[0]) {
        try { payload = JSON.parse(args[0]); } catch { payload = args[0]; }
      } else {
        payload = {};
      }
      const event = createSQSEventFromDigest(payload);
      const result = await digestLambdaHandler(event);
      return res.status(200).json({ result });
    } else if (command === 'version') {
      return res.status(200).json({ version: pkg.version, timestamp: new Date().toISOString() });
    } else if (command === 'help') {
      const usage = `
Usage:
  command: digest | version | help
  args: optional array of arguments to pass
`;
      return res.status(200).send(usage);
    }
  } catch (err) {
    logError(err.message || 'Error processing invoke', err);
    return res.status(500).json({ error: err.message || String(err) });
  }
});

export default app;

// Start server if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    logInfo(`Server listening on port ${port}`);
  });
}
