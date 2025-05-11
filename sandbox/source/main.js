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

  // Extract triggers
  const onField = data.on;
  let triggers = [];
  if (typeof onField === "string") {
    triggers = [onField];
  } else if (Array.isArray(onField)) {
    triggers = onField;
  } else if (typeof onField === "object" && onField !== null) {
    triggers = Object.keys(onField);
  }

  // Extract jobs
  const jobsObj = data.jobs;
  if (!jobsObj || typeof jobsObj !== "object") {
    throw new Error(`No jobs found in workflow ${filePath}`);
  }

  const jobs = [];
  for (const [name, job] of Object.entries(jobsObj)) {
    const needsRaw = job.needs;
    let needs = [];
    if (typeof needsRaw === "string") {
      needs = [needsRaw];
    } else if (Array.isArray(needsRaw)) {
      needs = needsRaw;
    }
    jobs.push({ name, needs });
  }

  // Extract reusable workflow calls
  const callsSet = new Set();
  for (const job of Object.values(jobsObj)) {
    const steps = job.steps;
    if (Array.isArray(steps)) {
      for (const step of steps) {
        if (step.uses && typeof step.uses === "string") {
          callsSet.add(step.uses);
        }
      }
    }
  }

  const calls = Array.from(callsSet);
  return { triggers, jobs, calls };
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
