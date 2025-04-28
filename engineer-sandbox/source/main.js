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
    return { status: 'success', results, chainSummary, ...metrics };
  } else if (payload.command) {
    const result = processCommand(payload.command);
    executionTimes.push(result.executionTimeMS);
    const metrics = computeMetrics(executionTimes);
    return { ...result, ...metrics };
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
  --verbose-stats            Output detailed statistics including callCount and uptime in JSON format.
  --perf-metrics             Display aggregated performance metrics for commands, including totalCommands, averageTimeMS, minTimeMS, maxTimeMS, medianTimeMS. For workflow chains, includes a chainSummary breakdown.
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
