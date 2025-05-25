#!/usr/bin/env node
// sandbox/source/main.js

import { fileURLToPath } from "url";
import express from "express";
import { createSQSEventFromDigest, digestLambdaHandler } from "../../src/lib/main.js";

// Create Express app
export const app = express();
app.use(express.json());

// Health endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

// Version endpoint
app.get("/version", async (req, res) => {
  try {
    const { readFileSync } = await import("fs");
    const pkgPath = new URL("../../package.json", import.meta.url);
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
    res.json({ version: pkg.version, timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Digest endpoint
app.post("/digest", async (req, res) => {
  try {
    const digest = req.body;
    const sqsEvent = createSQSEventFromDigest(digest);
    await digestLambdaHandler(sqsEvent);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

let server;
// Function to start the HTTP server
e��export async function startServer(port = 3000) {
  return new Promise((resolve, reject) => {
    server = app.listen(port, () => {
      console.log(`Server started on port ${port}`);
      resolve(server);
    });
    server.on("error", reject);
  });
}

// Function to stop the HTTP server
export async function stopServer() {
  return new Promise((resolve, reject) => {
    if (!server) {
      resolve();
      return;
    }
    server.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// CLI entrypoint
export function main(args = process.argv.slice(2)) {
  const serveIndex = args.indexOf("--serve");
  if (serveIndex !== -1) {
    let port = process.env.HTTP_PORT ? Number(process.env.HTTP_PORT) : 3000;
    const portIndex = args.indexOf("--port");
    if (portIndex !== -1 && args.length > portIndex + 1) {
      port = Number(args[portIndex + 1]);
    }
    startServer(port).catch((err) => {
      console.error(err);
      process.exit(1);
    });
    const gracefulShutdown = async () => {
      await stopServer();
      process.exit(0);
    };
    process.on("SIGINT", gracefulShutdown);
    process.on("SIGTERM", gracefulShutdown);
    return;
  }
  console.log("Usage: --serve [--port <number>]");
}

// Auto-execute if script is run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main(process.argv.slice(2));
}
