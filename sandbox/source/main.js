import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createSQSEventFromDigest, digestLambdaHandler } from '../../src/lib/main.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Express app setup
export const app = express();
app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Version endpoint
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgPath = path.resolve(__dirname, '../../package.json');
let version = '';
try {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  version = pkg.version;
} catch {
  version = '';
}

app.get('/version', (req, res) => {
  res.status(200).json({ version, timestamp: new Date().toISOString() });
});

// Digest endpoint
app.post('/digest', async (req, res) => {
  try {
    const event = createSQSEventFromDigest(req.body);
    await digestLambdaHandler(event);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server control
let serverInstance;
export async function startServer(port = process.env.HTTP_PORT ? Number(process.env.HTTP_PORT) : 3000) {
  const listenPort = typeof port === 'number' ? port : Number(port);
  return new Promise((resolve, reject) => {
    serverInstance = app.listen(listenPort, () => {
      resolve(serverInstance);
    });
    serverInstance.on('error', (err) => {
      reject(err);
    });
  });
}

export async function stopServer() {
  return new Promise((resolve, reject) => {
    if (serverInstance) {
      serverInstance.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    } else {
      resolve();
    }
  });
}