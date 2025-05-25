#!/usr/bin/env node
import { fileURLToPath } from "url";
import express from "express";
import { digestLambdaHandler } from "../../src/lib/main.js";

const app = express();
app.disable("x-powered-by");
app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/metrics", (req, res) => {
  res.json({ metrics: {}, timestamp: Date.now() });
});

app.post("/digest", async (req, res) => {
  const event = req.body;
  const result = await digestLambdaHandler(event);
  res.json({ batchItemFailures: result.batchItemFailures });
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const portIndex = process.argv.indexOf("--port");
  const port =
    portIndex !== -1 && process.argv[portIndex + 1]
      ? Number(process.argv[portIndex + 1])
      : 3000;
  const server = app.listen(port, () => {
    console.log(JSON.stringify({ event: "start", port }));
  });
  const graceful = () => {
    server.close(() => {
      console.log(
        JSON.stringify({ event: "shutdown", message: "Server shut down gracefully" })
      );
      process.exit(0);
    });
  };
  process.on("SIGINT", graceful);
  process.on("SIGTERM", graceful);
}

export { app };