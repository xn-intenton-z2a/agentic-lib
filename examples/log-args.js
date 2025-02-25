#!/usr/bin/env node
// src/lib/main.js
//
// This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib
// This file is licensed under the MIT License. For details, see LICENSE-MIT

import { fileURLToPath } from "url";

// -----------------------------------------------------------------------------
// Run main if executed directly.
// -----------------------------------------------------------------------------

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  console.log(`Run with: ${JSON.stringify(args)}`);
}
