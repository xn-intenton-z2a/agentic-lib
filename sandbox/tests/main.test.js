import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import * as CLI from '../source/main.js';

describe('createSQSEventFromDigest', () => {
  test('constructs valid SQS event from digest object', () => {
    const digest = { foo: 'bar', num: 123 };
    const event = CLI.createSQSEventFromDigest(digest);
    expect(event).toHaveProperty('Records');
    expect(Array.isArray(event.Records)).toBe(true);
    expect(event.Records).toHaveLength(1);
    const record = event.Records[0];
    expect(record.eventVersion).toBe('2.0');
    expect(record.eventSource).toBe('aws:sqs');
    expect(record.eventName).toBe('SendMessage');
    expect(record.body).toBe(JSON.stringify(digest));
  });
});

describe('digestLambdaHandler', () => {
  let logSpy;
  let errorSpy;
  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('returns no failures for valid JSON records and logs info', async () => {
    const digest = { a: 1 };
    const event = { Records: [{ body: JSON.stringify(digest) }] };
    const result = await CLI.digestLambdaHandler(event);
    expect(result).toEqual({ batchItemFailures: [], handler: 'sandbox/source/main.digestLambdaHandler' });
    expect(logSpy).toHaveBeenCalled();
    const calls = logSpy.mock.calls.map(args => JSON.parse(args[0]));
    expect(calls[0].message.startsWith('Digest Lambda received event')).toBe(true);
    expect(calls[1].message).toMatch(/^Record 0: Received digest:/);
  });

  test('returns failure for invalid JSON and logs errors with fallback ID', async () => {
    const event = { Records: [{ body: 'not-valid-json' }] };
    const result = await CLI.digestLambdaHandler(event);
    expect(result.batchItemFailures).toHaveLength(1);
    const id = result.batchItemFailures[0].itemIdentifier;
    expect(id).toMatch(/^fallback-0-\d+-[A-Za-z0-9]+$/);
    expect(errorSpy).toHaveBeenCalledTimes(2);
    const errors = errorSpy.mock.calls.map(args => JSON.parse(args[0]));
    expect(errors[0].message).toMatch(/^Error processing record/);
    expect(errors[1].message).toMatch(/^Invalid JSON payload/);
  });
});

describe('CLI main flags', () => {
  let logSpy;
  let errorSpy;
  beforeEach(() => {
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('--help prints usage and returns', async () => {
    await CLI.main(['--help']);
    expect(logSpy).toHaveBeenCalledTimes(1);
    const output = logSpy.mock.calls[0][0];
    expect(output).toContain('--help');
    expect(output).toContain('--version');
    expect(output).toContain('--digest');
  });

  test('--version prints JSON with version and timestamp', async () => {
    await CLI.main(['--version']);
    expect(logSpy).toHaveBeenCalledTimes(1);
    const out = logSpy.mock.calls[0][0];
    const obj = JSON.parse(out);
    expect(obj).toHaveProperty('version');
    expect(typeof obj.version).toBe('string');
    expect(obj).toHaveProperty('timestamp');
    expect(!isNaN(Date.parse(obj.timestamp))).toBe(true);
    expect(errorSpy).not.toHaveBeenCalled();
  });

  test('--digest triggers handler and logs info', async () => {
    await CLI.main(['--digest']);
    const calls = logSpy.mock.calls.map(args => args[0]);
    const found = calls.some(c => c.includes('Record 0: Received digest:'));
    expect(found).toBe(true);
  });
});
