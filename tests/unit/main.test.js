// tests/unit/main.test.js

import { describe, test, expect, vi } from 'vitest';
import * as mainModule from '@src/lib/main.js';

// Helper function to capture console output
const captureOutput = (fn) => {
  let output = '';
  const originalLog = console.log;
  console.log = (msg) => {
    output += msg + '\n';
  };
  try {
    fn();
  } finally {
    console.log = originalLog;
  }
  return output;
};

// Tests for module import and exported functions

describe('Main Module Import', () => {
  test('should be non-null', () => {
    expect(mainModule).not.toBeNull();
  });
});

describe('selfTestCommand', () => {
  test('should output self test header', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    mainModule.selfTestCommand();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('=== Self Test: Demonstrating features with expected outputs ==='));
    logSpy.mockRestore();
  });
});

describe('githubScriptCommand', () => {
  test('should log GitHub API not implemented message', () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    mainModule.githubScriptCommand();
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('GitHub API calls, OpenAI integration, and issue comment creation are not implemented'));
    logSpy.mockRestore();
  });
});

// Additional tests for arithmetic commands

describe('Arithmetic Commands', () => {
  test('echoCommand outputs joined string', () => {
    const output = captureOutput(() => {
      mainModule.echoCommand(['Hello', 'World']);
    });
    expect(output).toContain('Hello World');
  });

  test('addCommand sums numbers correctly', () => {
    const output = captureOutput(() => {
      mainModule.addCommand(['1', '2', '3']);
    });
    expect(output).toContain('6');
  });

  test('multiplyCommand multiplies numbers correctly', () => {
    let output = captureOutput(() => {
      mainModule.multiplyCommand(['2', '3', '4']);
    });
    expect(output).toContain('24');
    
    // Test with no arguments
    output = captureOutput(() => {
      mainModule.multiplyCommand([]);
    });
    expect(output).toContain('0');
  });

  test('subtractCommand subtracts numbers correctly', () => {
    const output = captureOutput(() => {
      mainModule.subtractCommand(['10', '3', '2']);
    });
    // 10 - 3 - 2 = 5
    expect(output).toContain('5');
  });

  test('divideCommand divides numbers correctly', () => {
    const output = captureOutput(() => {
      mainModule.divideCommand(['20', '2', '2']);
    });
    // 20 / 2 / 2 = 5
    expect(output).toContain('5');
  });

  test('divideCommand handles division by zero', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    captureOutput(() => {
      mainModule.divideCommand(['10', '0']);
    });
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error: Division by zero encountered with argument 0'));
    errorSpy.mockRestore();
  });

  test('powerCommand computes exponentiation', () => {
    const output = captureOutput(() => {
      mainModule.powerCommand(['2', '3']);
    });
    expect(output).toContain('8');
  });

  test('modCommand computes modulo correctly', () => {
    const output = captureOutput(() => {
      mainModule.modCommand(['10', '3']);
    });
    expect(output).toContain('1');
  });

  test('modCommand handles modulo by zero', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    captureOutput(() => {
      mainModule.modCommand(['10', '0']);
    });
    expect(errorSpy).toHaveBeenCalledWith(expect.stringContaining('Error: Modulo by zero encountered with argument 0'));
    errorSpy.mockRestore();
  });

  test('demoCommand outputs demo info', () => {
    const output = captureOutput(() => {
      mainModule.demoCommand();
    });
    expect(output).toContain('--- Demo: Showcasing available commands ---');
    expect(output).toContain('> Echo Command Demo:');
  });
});
