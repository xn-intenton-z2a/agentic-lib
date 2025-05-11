#!/usr/bin/env node
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";
import yaml from "js-yaml";

/**
 * Parses a GitHub Actions workflow YAML file and returns its triggers, jobs, and reusable calls.
 * @param {string} filePath - Path to the workflow YAML file
 * @returns {Promise<{ triggers: string[], jobs: { name: string, needs: string[] }[], calls: string[] }>} Parsed workflow summary
 */
export async function simulateWorkflow(filePath) {
  let content;
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    content = await readFile(filePath, "utf8");
  } catch (err) {
    throw new Error(`Failed to read file ${filePath}: ${err.message}`);
  }

  let data;
  try {
    data = yaml.load(content);
  } catch (err) {
    throw new Error(`Failed to parse YAML: ${err.message}`);
  }

  if (!data || typeof data !== "object") {
    throw new Error(`Invalid workflow format in ${filePath}`);
  }

  const triggers = extractTriggers(data.on);
  const jobs = extractJobs(data.jobs, filePath);
  const calls = extractCalls(data.jobs);

  return { triggers, jobs, calls };
}

function extractTriggers(onField) {
  if (typeof onField === "string") {
    return [onField];
  }
  if (Array.isArray(onField)) {
    return onField;
  }
  if (onField && typeof onField === "object") {
    return Object.keys(onField);
  }
  return [];
}

function extractJobs(jobsObj, filePath) {
  if (!jobsObj || typeof jobsObj !== "object") {
    throw new Error(`No jobs found in workflow ${filePath}`);
  }
  return Object.entries(jobsObj).map(([name, job]) => {
    const needsRaw = job.needs;
    let needs = [];
    if (typeof needsRaw === "string") {
      needs = [needsRaw];
    } else if (Array.isArray(needsRaw)) {
      needs = needsRaw;
    }
    return { name, needs };
  });
}

function extractCalls(jobsObj) {
  const callsSet = new Set();
  if (!jobsObj || typeof jobsObj !== "object") {
    return [];
  }
  Object.values(jobsObj).forEach((job) => {
    const steps = job.steps;
    if (Array.isArray(steps)) {
      steps.forEach((step) => {
        if (step.uses && typeof step.uses === "string") {
          callsSet.add(step.uses);
        }
      });
    }
  });
  return Array.from(callsSet);
}

/**
 * CLI entrypoint processing for --simulate-workflow flag
 */
async function main(args = process.argv.slice(2)) {
  const idx = args.indexOf("--simulate-workflow");
  if (idx !== -1) {
    const filePath = args[idx + 1];
    if (!filePath) {
      console.error("Error: No workflow file specified for --simulate-workflow");
      process.exit(1);
    }
    try {
      const result = await simulateWorkflow(filePath);
      console.log(JSON.stringify(result, null, 2));
      process.exit(0);
    } catch (err) {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    }
  }

  console.log("No command argument supplied.");
  console.log("Usage: npx agentic-lib --simulate-workflow <workflow.yml>");
}

// Execute main if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
