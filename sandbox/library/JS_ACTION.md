# JS_ACTION

## Crawl Summary
action.yml exact fields: name, description, inputs: who-to-greet(required, default World), outputs: time; runs using node20 main index.js. Install Node.js v20, npm init -y. Install dependencies: npm install @actions/core @actions/github. index.js code uses core.getInput('who-to-greet'), console.log, core.setOutput('time',timestamp), github.context.payload logging, core.setFailed(error.message). Bundle with ncc build index.js --license licenses.txt, update main to dist/index.js. Commit action.yml, index.js, node_modules, package.json, package-lock.json, README.md; tag version; push tags. Example workflow YAML: uses: your-org/action@v1.0, with who-to-greet. Echo output.

## Normalised Extract
Table of Contents:
 1. action.yml metadata syntax
 2. Dependency installation
 3. index.js implementation
 4. Bundling with ncc
 5. Git steps for commit and release
 6. Workflow usage example

1. action.yml metadata syntax
 name: Hello World
 description: Greet someone and record the time
 inputs:
   who-to-greet:
     description: Who to greet
     required: true
     default: World
 outputs:
   time:
     description: The time we greeted you
 runs:
   using: node20
   main: index.js

2. Dependency installation
 Command: npm install @actions/core @actions/github
 Node.js: v20.x
 Optional bundler: npm install -g @vercel/ncc

3. index.js implementation
 const core = require('@actions/core')
 const github = require('@actions/github')
 try {
   const who = core.getInput('who-to-greet', { required: true })
   console.log(`Hello ${who}!`)
   const ts = new Date().toTimeString()
   core.setOutput('time', ts)
   const payload = JSON.stringify(github.context.payload, null, 2)
   console.log(`Event payload:\n${payload}`)
 } catch (e) {
   core.setFailed(e.message)
 }

4. Bundling with ncc
 Command: ncc build index.js --license licenses.txt
 Outputs: dist/index.js, dist/licenses.txt
 action.yml: runs.main: dist/index.js

5. Git steps for commit and release
 git add action.yml index.js node_modules package.json package-lock.json README.md
 git commit -m "release vX.Y"
 git tag -a vX.Y -m "vX.Y"
 git push --follow-tags

6. Workflow usage example
 on: [push]
 jobs:
   greet_job:
     runs-on: ubuntu-latest
     steps:
       - uses: actions/checkout@v4
       - uses: your-org/hello-world-javascript-action@vX.Y
         with:
           who-to-greet: Octocat
       - run: echo "Time: ${{ steps.greet_job.outputs.time }}"


## Supplementary Details
Parameter details:
 - who-to-greet input: required=true, default=World
 - time output: value set to ISO time string via new Date().toTimeString()
 Configuration:
 - runs.using: node20 ensures Node.js v20 runtime
 - runs.main: file path of entry point
 Implementation steps:
 1. npm init -y
 2. Install dependencies
 3. Create action.yml with inputs/outputs/runs
 4. Write index.js with error handling
 5. Optional bundle via ncc, adjust action.yml
 6. Commit files and version tag
 7. Push and use in workflows


## Reference Details
Complete API specs:
 @actions/core
   getInput(name: string, options?: { required?: boolean; trimWhitespace?: boolean; }): string
   setOutput(name: string, value: string): void
   setFailed(message: string): void
 @actions/github.context: object containing properties:
   payload: any (webhook event payload)

Method signatures:
 - core.getInput(name, { required }): retrieves input from action.yml
 - core.setOutput(name, value): sets action output
 - core.setFailed(message): logs error and exits non-zero

Implementation patterns:
 - Wrap main logic in try/catch
 - Log via console.log
 - Use JSON.stringify(context.payload, null,2) for debug

Configuration options:
 - action.yml inputs 'who-to-greet' default World
 - runs.using: node20
 - runs.main: 'index.js' or 'dist/index.js'

Best practices:
 - Always call core.setFailed on exceptions
 - Pin dependencies via package-lock.json
 - Bundle via @vercel/ncc to avoid checking node_modules
 - Tag releases semantically

Troubleshooting:
 Error: Missing input
   Command: core.getInput('who-to-greet', { required: true }) throws if absent
   Fix: Provide 'with: who-to-greet'
 Untracked dependencies
   Git checkout error: Missing node_modules
   Fix: Bundle via ncc or commit node_modules
 Bundling issues
   Command: ncc build index.js --license licenses.txt
   Expected: outputs dist/index.js and dist/licenses.txt
   On error: reinstall @vercel/ncc@latest


## Information Dense Extract
action.yml: inputs:who-to-greet(required,true,default='World'), outputs:time(description), runs:using='node20',main='index.js'; install: npm install @actions/core @actions/github; index.js: core.getInput('who-to-greet',{required:true}), console.log, ts=new Date().toTimeString(), core.setOutput('time',ts), payload=JSON.stringify(github.context.payload,null,2), console.log, catch->core.setFailed; bundle: ncc build index.js --license licenses.txt -> dist/index.js; git: add action.yml,index.js,node_modules,package.json,package-lock.json,README.md; commit -m 'vX.Y'; tag -a vX.Y; push --follow-tags; workflow: on:push jobs: greet: runs-on ubuntu-latest steps: uses:actions/checkout@v4, uses:your-org/hello-world-javascript-action@vX.Y with:who-to-greet, run:echo "Time: ${{steps.greet.outputs.time}}"

## Sanitised Extract
Table of Contents:
 1. action.yml metadata syntax
 2. Dependency installation
 3. index.js implementation
 4. Bundling with ncc
 5. Git steps for commit and release
 6. Workflow usage example

1. action.yml metadata syntax
 name: Hello World
 description: Greet someone and record the time
 inputs:
   who-to-greet:
     description: Who to greet
     required: true
     default: World
 outputs:
   time:
     description: The time we greeted you
 runs:
   using: node20
   main: index.js

2. Dependency installation
 Command: npm install @actions/core @actions/github
 Node.js: v20.x
 Optional bundler: npm install -g @vercel/ncc

3. index.js implementation
 const core = require('@actions/core')
 const github = require('@actions/github')
 try {
   const who = core.getInput('who-to-greet', { required: true })
   console.log('Hello ${who}!')
   const ts = new Date().toTimeString()
   core.setOutput('time', ts)
   const payload = JSON.stringify(github.context.payload, null, 2)
   console.log('Event payload:'n${payload}')
 } catch (e) {
   core.setFailed(e.message)
 }

4. Bundling with ncc
 Command: ncc build index.js --license licenses.txt
 Outputs: dist/index.js, dist/licenses.txt
 action.yml: runs.main: dist/index.js

5. Git steps for commit and release
 git add action.yml index.js node_modules package.json package-lock.json README.md
 git commit -m 'release vX.Y'
 git tag -a vX.Y -m 'vX.Y'
 git push --follow-tags

6. Workflow usage example
 on: [push]
 jobs:
   greet_job:
     runs-on: ubuntu-latest
     steps:
       - uses: actions/checkout@v4
       - uses: your-org/hello-world-javascript-action@vX.Y
         with:
           who-to-greet: Octocat
       - run: echo 'Time: ${{ steps.greet_job.outputs.time }}'

## Original Source
GitHub Actions Toolkit
https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action

## Digest of JS_ACTION

# Creating a JavaScript Action (retrieved 2024-06-18)

## Metadata: action.yml
```yaml
name: "Hello World"
description: "Greet someone and record the time"
inputs:
  who-to-greet:
    description: "Who to greet"
    required: true
    default: "World"
outputs:
  time:
    description: "The time we greeted you"
runs:
  using: "node20"
  main: "index.js"
```

## Dependencies
- Node.js v20.x (npm included)
- @actions/core
- @actions/github
- Optional: @vercel/ncc for bundling

Install:
```bash
npm install @actions/core @actions/github
npm install -g @vercel/ncc  # optional
```

## Action Code: index.js
```javascript
const core = require('@actions/core');
const github = require('@actions/github');

try {
  const who = core.getInput('who-to-greet', { required: true });
  console.log(`Hello ${who}!`);
  const timestamp = new Date().toTimeString();
  core.setOutput('time', timestamp);
  const payload = JSON.stringify(github.context.payload, null, 2);
  console.log(`Event payload:\n${payload}`);
} catch (err) {
  core.setFailed(err.message);
}
```

## Bundling (optional)
```bash
ncc build index.js --license licenses.txt
# outputs dist/index.js and dist/licenses.txt
```
Update action.yml `runs.main` to `dist/index.js`.

## Commit & Release
```bash
git add action.yml index.js node_modules package.json package-lock.json README.md
git commit -m "release v1.0"
git tag -a v1.0 -m "v1.0"
git push --follow-tags
```

## Example Workflow (.github/workflows/main.yml)
```yaml
on: [push]
jobs:
  greet:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run JS action
        uses: your-org/hello-world-javascript-action@v1.0
        with:
          who-to-greet: 'Octocat'
      - run: echo "Greeted at ${{ steps.runjs.outputs.time }}"
```


## Attribution
- Source: GitHub Actions Toolkit
- URL: https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
- License: MIT License
- Crawl Date: 2025-05-11T00:12:23.458Z
- Data Size: 1253636 bytes
- Links Found: 19775

## Retrieved
2025-05-11
