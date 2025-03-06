#!/usr/bin/env node
// convert.js
import fs from "fs";
import MarkdownIt from "markdown-it";
import markdownItGithub from "markdown-it-github";

const md = new MarkdownIt({ html: true }).use(markdownItGithub);

// If STDIN is being piped, read from it and output to STDOUT.
if (!process.stdin.isTTY) {
  let data = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => {
    data += chunk;
  });
  process.stdin.on("end", () => {
    try {
      const result = md.render(data);
      process.stdout.write(result);
    } catch (err) {
      console.error("Error during conversion:", err);
      process.exit(1);
    }
  });
} else {
  // Otherwise, read from the default input file and write to the default output file.
  const inputFile = "README.md";
  const outputFile = "index.html";
  try {
    const data = fs.readFileSync(inputFile, "utf8");
    const result = md.render(data);
    fs.writeFileSync(outputFile, result, "utf8");
    console.log(`Successfully converted ${inputFile} to ${outputFile}`);
  } catch (err) {
    console.error("Error during conversion:", err);
    process.exit(1);
  }
}
