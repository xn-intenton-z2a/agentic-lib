import { performance } from 'perf_hooks';

// Global invocation counter
globalThis.callCount = globalThis.callCount || 0;

function computeMetrics(times) {
  const totalCommands = times.length;
  const averageTimeMS = totalCommands ? times.reduce((a, b) => a + b, 0) / totalCommands : 0;
  const minTimeMS = totalCommands ? Math.min(...times) : 0;
  const maxTimeMS = totalCommands ? Math.max(...times) : 0;
  const sorted = times.slice().sort((a, b) => a - b);
  let medianTimeMS = 0;
  if (totalCommands) {
    if (totalCommands % 2 === 0) {
      medianTimeMS = (sorted[totalCommands / 2 - 1] + sorted[totalCommands / 2]) / 2;
    } else {
      medianTimeMS = sorted[Math.floor(totalCommands / 2)];
    }
  }
  return { totalCommands, averageTimeMS, minTimeMS, maxTimeMS, medianTimeMS };
}

function processCommand(cmd) {
  // Simulate processing a command
  const start = performance.now();
  // Here we would have real logic; we simulate minimal delay
  const executionTimeMS = Math.floor(performance.now() - start);
  globalThis.callCount++;
  return { status: 'success', processedCommand: cmd, timestamp: new Date().toISOString(), executionTimeMS };
}

export function agenticHandler(payload) {
  let results = [];
  let executionTimes = [];
  if (payload.commands && Array.isArray(payload.commands)) {
    // Check for MAX_BATCH_COMMANDS environment variable enforcement
    const maxBatch = process.env.MAX_BATCH_COMMANDS ? Number(process.env.MAX_BATCH_COMMANDS) : undefined;
    if (maxBatch && payload.commands.length > maxBatch) {
      return { error: `Batch command limit exceeded: maximum ${maxBatch} allowed, received ${payload.commands.length}` };
    }
    for (const cmd of payload.commands) {
      const result = processCommand(cmd);
      results.push(result);
      executionTimes.push(result.executionTimeMS);
    }
    // For chain invocations, create a separate chain summary
    const chainSummary = {
      totalCommands: results.length,
      totalExecutionTimeMS: executionTimes.reduce((a, b) => a + b, 0)
    };
    const metrics = computeMetrics(executionTimes);
    const enhancedMetrics = {
      ...metrics,
      averageExecutionTimeMS: metrics.averageTimeMS,
      minExecutionTimeMS: metrics.minTimeMS,
      maxExecutionTimeMS: metrics.maxTimeMS,
      medianExecutionTimeMS: metrics.medianTimeMS
    };
    return { status: 'success', results, chainSummary, ...enhancedMetrics };
  } else if (payload.command) {
    const result = processCommand(payload.command);
    executionTimes.push(result.executionTimeMS);
    const metrics = computeMetrics(executionTimes);
    const enhancedMetrics = {
      ...metrics,
      averageExecutionTimeMS: metrics.averageTimeMS,
      minExecutionTimeMS: metrics.minTimeMS,
      maxExecutionTimeMS: metrics.maxTimeMS,
      medianExecutionTimeMS: metrics.medianTimeMS
    };
    return { ...result, ...enhancedMetrics };
  } else {
    return { error: 'No valid command provided in payload' };
  }
}

function printHelp() {
  console.log(`Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --agentic <jsonPayload>    Process an agentic command using a JSON payload. Payload may include a 'command' or a 'commands' array for batch processing.
  --version                  Show version information with current timestamp.
  --verbose                  Enable detailed logging for debugging.
  --diagnostics              Output detailed diagnostics including config and environment details.
  --status                   Display runtime health summary in JSON format.
  --dry-run                  Execute a dry run with no side effects.
  --simulate-error           Simulate an error for testing purposes and exit.
  --simulate-delay <ms>      Simulate processing delay for the specified duration in milliseconds.
  --simulate-load <ms>       Simulate a heavy processing load for the specified duration in milliseconds.
  --apply-fix                Apply automated fix and log success message.
  --cli-utils                Display a summary of available CLI commands with their descriptions.
  --workflow-chain <jsonPayload>    Process a chain of workflow commands sequentially. (Payload must have a 'chain' array property)
  --verbose-stats            When used with a valid command, outputs detailed statistics including callCount and uptime in JSON format.
  --perf-metrics             Display aggregated performance metrics for agentic commands and workflow chains in JSON format, including totalCommands, averageTimeMS, averageExecutionTimeMS, minTimeMS, minExecutionTimeMS, maxTimeMS, maxExecutionTimeMS, medianTimeMS, and medianExecutionTimeMS. For workflow chains, a chainSummary is also provided.
`);
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    printHelp();
    return;
  }
  if (args.includes('--version')) {
    const pkg = { version: '4.3.18-0' }; // This would be imported from package.json in a real scenario
    console.log(JSON.stringify({ version: pkg.version, timestamp: new Date().toISOString() }));
    return;
  }
  if (args.includes('--perf-metrics')) {
    const index = args.indexOf('--perf-metrics');
    let payload = {};
    if (args.length > index + 1) {
      try {
        payload = JSON.parse(args[index + 1]);
      } catch (e) {
        console.error('Invalid JSON payload for --perf-metrics');
        process.exit(1);
      }
    } else {
      // Default payload if none provided
      payload = { command: 'defaultCommand' };
    }
    const response = agenticHandler(payload);
    console.log(JSON.stringify(response));
    return;
  }
  if (args.includes('--agentic')) {
    const index = args.indexOf('--agentic');
    if (args.length > index + 1) {
      try {
        const payload = JSON.parse(args[index + 1]);
        const response = agenticHandler(payload);
        console.log(JSON.stringify(response));
        return;
      } catch (e) {
        console.error('Invalid JSON payload for --agentic');
        process.exit(1);
      }
    } else {
      console.error('No payload provided for --agentic');
      process.exit(1);
    }
  }
  // Additional CLI flags can be processed here

  console.log('No command argument supplied.');
  printHelp();
}

if (require.main === module) {
  main();
}
