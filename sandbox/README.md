# Agentic Lib Sandbox CLI

This sandbox CLI provides utilities to interact with the agentic library in a local environment.

## Usage
  --fetch-wikipedia <topic>   Fetch the summary of `<topic>` from Wikipedia and output JSON.

### Examples

Fetch the summary of "Node.js":
```
npm run sandbox -- --fetch-wikipedia "Node.js"
```

If no supported flag is provided, the CLI will output the received arguments:
```
npm run sandbox -- --foo bar
# Run with: ["--foo","bar"]
```
