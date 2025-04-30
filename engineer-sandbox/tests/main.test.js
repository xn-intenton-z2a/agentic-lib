import { describe, it, expect, afterEach } from 'vitest';
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
    
    // Additional enhanced metric properties
    expect(response).toHaveProperty('averageExecutionTimeMS', response.averageTimeMS);
    expect(response).toHaveProperty('minExecutionTimeMS', response.minTimeMS);
    expect(response).toHaveProperty('maxExecutionTimeMS', response.maxTimeMS);
    expect(response).toHaveProperty('medianExecutionTimeMS', response.medianTimeMS);
    expect(response).toHaveProperty('standardDeviationTimeMS', response.standardDeviationTimeMS);
    expect(response).toHaveProperty('90thPercentileTimeMS', response["90thPercentileTimeMS"]);
    
    // Since our simulated execution time is 0, all metrics should be 0
    expect(response.totalCommands).toBe(1);
    expect(response.averageTimeMS).toBe(0);
    expect(response.minTimeMS).toBe(0);
    expect(response.maxTimeMS).toBe(0);
    expect(response.medianTimeMS).toBe(0);
    expect(response.standardDeviationTimeMS).toBe(0);
    expect(response["90thPercentileTimeMS"]).toBe(0);
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
    
    // Additional enhanced metric properties for chain
    expect(response).toHaveProperty('averageExecutionTimeMS', response.averageTimeMS);
    expect(response).toHaveProperty('minExecutionTimeMS', response.minTimeMS);
    expect(response).toHaveProperty('maxExecutionTimeMS', response.maxTimeMS);
    expect(response).toHaveProperty('medianExecutionTimeMS', response.medianTimeMS);
    expect(response).toHaveProperty('standardDeviationTimeMS', response.standardDeviationTimeMS);
    expect(response).toHaveProperty('90thPercentileTimeMS', response["90thPercentileTimeMS"]);
    
    // All execution times are 0, so aggregated metrics should be 0
    expect(response.totalCommands).toBe(2);
    expect(response.averageTimeMS).toBe(0);
    expect(response.minTimeMS).toBe(0);
    expect(response.maxTimeMS).toBe(0);
    expect(response.medianTimeMS).toBe(0);
    expect(response.standardDeviationTimeMS).toBe(0);
    expect(response["90thPercentileTimeMS"]).toBe(0);
  });
});

// New tests for MAX_BATCH_COMMANDS enforcement
describe('Batch command limit enforcement', () => {
  afterEach(() => {
    delete process.env.MAX_BATCH_COMMANDS;
  });

  it('should return an error when batch limit is exceeded', () => {
    process.env.MAX_BATCH_COMMANDS = '2';
    const payload = { commands: ['cmd1', 'cmd2', 'cmd3'] };
    const response = agenticHandler(payload);
    expect(response).toEqual({ error: 'Batch command limit exceeded: maximum 2 allowed, received 3' });
  });

  it('should process batch normally when within limit', () => {
    process.env.MAX_BATCH_COMMANDS = '3';
    const payload = { commands: ['cmd1', 'cmd2'] };
    const response = agenticHandler(payload);
    expect(response).toHaveProperty('results');
    expect(response.results.length).toBe(2);
    expect(response).toHaveProperty('averageExecutionTimeMS', response.averageTimeMS);
  });
});
