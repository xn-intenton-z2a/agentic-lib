#!/usr/bin/env node
// Simple utility function module

import { logInfo, logError } from "../../src/lib/main.js";

/**
 * simpleEcho takes a non-empty string input, trims it, and returns a greeting message.
 * Logs the input and any error using the standard logging functions.
 * 
 * @param {string} input - The input string that will be used in the greeting.
 * @returns {string} A greeting message.
 * @throws Will throw an error if the input is not a non-empty string.
 */
export function simpleEcho(input) {
  try {
    if (typeof input !== 'string' || input.trim() === '') {
      throw new Error("Invalid input: must be a non-empty string");
    }
    const trimmed = input.trim();
    logInfo(`simpleEcho called with input: ${trimmed}`);
    return `Hello, ${trimmed}`;
  } catch (error) {
    logError("Error in simpleEcho", error);
    throw error;
  }
}

/**
 * simpleReverse takes a non-empty string input, trims it, and returns the reversed string.
 * Logs the input and any error using the standard logging functions.
 * 
 * @param {string} input - The input string to be reversed.
 * @returns {string} The reversed string.
 * @throws Will throw an error if the input is not a non-empty string.
 */
export function simpleReverse(input) {
  try {
    if (typeof input !== 'string' || input.trim() === '') {
      throw new Error("Invalid input: must be a non-empty string");
    }
    const trimmed = input.trim();
    logInfo(`simpleReverse called with input: ${trimmed}`);
    const reversed = trimmed.split('').reverse().join('');
    return reversed;
  } catch (error) {
    logError("Error in simpleReverse", error);
    throw error;
  }
}
