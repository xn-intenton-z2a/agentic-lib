import { describe, it, expect } from 'vitest';
import { agenticHandler } from '../../source/main.js';

// Test for single agentic command invocation
describe('CLI Perf Metrics Flag - Single Command', () => {
  it('should include aggregated metrics for a single command', () => {
    const payload = { command: 'ping' };
    const response = agenticHandler(payload);
    expect(response).toHaveProperty('processedCommand', 'ping');
    expect(response).toHaveProperty('totalCommands');
    expect(response).toHaveProperty('averageTimeMS');
    expect(response).toHaveProperty('minTimeMS');
    expect(response).toHaveProperty('maxTimeMS');
    expect(response).toHaveProperty('medianTimeMS');

    // Since our simulated execution time is 0, all metrics should be 0
    expect(response.totalCommands).toBe(1);
    expect(response.averageTimeMS).toBe(0);
    expect(response.minTimeMS).toBe(0);
    expect(response.maxTimeMS).toBe(0);
    expect(response.medianTimeMS).toBe(0);
  });
});

// Test for workflow chain invocation
describe('CLI Perf Metrics Flag - Workflow Chain Invocation', () => {
  it('should include chainSummary and aggregated metrics for a chain of commands', () => {
    const payload = { commands: ['cmdA', 'cmdB'] };
    const response = agenticHandler(payload);
    expect(response).toHaveProperty('results');
    expect(Array.isArray(response.results)).toBe(true);
    expect(response.results.length).toBe(2);
    expect(response).toHaveProperty('chainSummary');
    expect(response.chainSummary).toHaveProperty('totalCommands', 2);
    expect(response.chainSummary).toHaveProperty('totalExecutionTimeMS');

    // All execution times are 0, so aggregated metrics should be 0
    expect(response.totalCommands).toBe(2);
    expect(response.averageTimeMS).toBe(0);
    expect(response.minTimeMS).toBe(0);
    expect(response.maxTimeMS).toBe(0);
    expect(response.medianTimeMS).toBe(0);
  });
});
