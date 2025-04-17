# SERVERLESS_FRAMEWORK

## Crawl Summary
Extracted technical details include concrete plugin functionalities, exact CLI commands, and clear YAML configuration examples. Every plugin is documented with its purpose and available options, such as Serverless Offline (emulating AWS Lambda locally with options like --httpPort), Serverless Prune Plugin (auto-deletion of old deployments with configurable number), and others like Webpack, Domain Manager, Esbuild, HTTP, Dotenv, Step Functions, Datadog, Typescript, IAM Roles, and Python Requirements. Also included are full examples of serverless.yml setups and clear command line invocations.

## Normalised Extract
## Table of Contents
1. Plugins & Tools
   - Serverless Offline
   - Serverless Prune Plugin
   - Serverless Webpack
   - Serverless Domain Manager
   - Serverless Esbuild
   - Serverless HTTP Plugin
   - Serverless Dotenv Plugin
   - Serverless Step Functions Plugin
   - Serverless Plugin Datadog
   - Serverless Plugin Typescript
   - Serverless IAM Roles Per Function Plugin
   - Serverless Python Requirements
2. Example Implementations
   - Node.js HTTP Endpoint Example
   - Python Flask API Example
3. CLI Commands & Configuration

### 1. Plugins & Tools

**Serverless Offline**:
- Command: `serverless offline start`
- Options: `--httpPort` (default: 3000), `--noPrependStageInUrl`

**Serverless Prune Plugin**:
- YAML Configuration:
  ```yaml
  custom:
    prune:
      automatic: true
      number: 3
  ```

**Serverless Webpack**: Bundles lambda code using Webpack; integrates prior to deployment.

**Serverless Domain Manager**: Manages API Gateway custom domains with configurations for domain name, base path, stage, etc.

**Serverless Esbuild**: Provides fast bundling for JavaScript/TypeScript projects.

**Serverless HTTP Plugin**: Wraps existing middleware frameworks for use in Lambda.

**Serverless Dotenv Plugin**: Loads variables from `.env` with `dotenv: './.env'` setting.

**Serverless Step Functions Plugin**: Integrates AWS Step Functions into the service configuration.

**Serverless Plugin Datadog**: Monitors and traces Lambda functions with real-time metrics.

**Serverless Plugin Typescript**: Adds Typescript support without extra configuration.

**Serverless IAM Roles Per Function Plugin**: Allows individual IAM role assignment per function block in serverless.yml.

**Serverless Python Requirements**: Bundles and caches Python packages listed in requirements.txt.

### 2. Example Implementations

#### Node.js HTTP Endpoint Example
```yaml
service: my-service
provider:
  name: aws
  runtime: nodejs14.x
plugins:
  - serverless-offline
  - serverless-webpack
functions:
  hello:
    handler: handler.hello
```

#### Python Flask API Example
```yaml
service: my-python-service
provider:
  name: aws
  runtime: python3.8
plugins:
  - serverless-offline
functions:
  app:
    handler: wsgi_handler
```

### 3. CLI Commands & Configuration

- **Deploy:** `sls deploy`
- **Invoke Function:** `sls invoke -f hello`
- **Start Offline:** `sls offline start`

Additional settings can be defined in the `custom` section of serverless.yml for plugin-specific configurations.

## Supplementary Details
### Sample serverless.yml Configuration
```yaml
service: my-service
provider:
  name: aws
  runtime: nodejs14.x
  stage: dev
  region: us-east-1
custom:
  prune:
    automatic: true
    number: 3
  dotenv: './.env'
  customDomain:
    domainName: "api.example.com"
    basePath: ""
    stage: "${self:provider.stage}"
    createRoute53Record: true
plugins:
  - serverless-offline
  - serverless-prune-plugin
  - serverless-webpack
  - serverless-domain-manager
  - serverless-esbuild
  - serverless-http
  - serverless-dotenv-plugin
  - serverless-step-functions
  - serverless-plugin-datadog
  - serverless-plugin-typescript
  - serverless-iam-roles-per-function
  - serverless-python-requirements
functions:
  hello:
    handler: handler.hello
    events:
      - http:
          path: hello
          method: get
```

### Implementation Steps
1. Install dependencies (e.g., `npm install serverless serverless-offline serverless-webpack ...`).
2. Configure the serverless.yml file with provider details, plugins, and function definitions.
3. Write handler functions, for instance:
   ```javascript
   // handler.js
   'use strict';
   module.exports.hello = async (event, context) => {
     try {
       return {
         statusCode: 200,
         body: JSON.stringify({ message: 'Hello World' })
       };
     } catch (error) {
       return {
         statusCode: 500,
         body: JSON.stringify({ error: error.message })
       };
     }
   };
   ```
4. Deploy using `sls deploy` and test with `sls invoke -f hello` or offline using `sls offline start`.
5. Monitor logs via CloudWatch or local verbose logging if needed.

### Plugin Specifics & Parameters
- **Serverless Offline:** `--httpPort` (default=3000)
- **Prune Plugin:** `number` parameter defaults to 3.
- **Domain Manager:** Requires domainName, basePath, stage, and optionally certificateName.
- **Dotenv Plugin:** Loads from specified path in configuration.

### Best Practices
- Secure environment variables via the dotenv plugin.
- Maintain clear version control by pruning outdated Lambda versions.
- Align IAM roles per function to minimize over-permission issues.

### Troubleshooting
- Start offline with verbose logging: `sls offline start --verbose`
- Use AWS CLI to tail CloudWatch logs:
  ```bash
  aws logs tail /aws/lambda/<function-name> --follow
  ```
- Check plugin order in serverless.yml if bundling issues occur.
- Use debugging flags with Webpack if bundle issues arise, e.g., `sls webpack --debug`.

## Reference Details
## API Specifications and SDK Method Signatures

### Serverless Framework CLI

#### Deploy Command
- **Usage:** `sls deploy --stage <stage> --region <region> [--verbose]`
- **Parameters:**
  - `--stage` (string): Deployment stage (e.g., dev, prod)
  - `--region` (string): AWS region
  - `--verbose` (boolean): Enables detailed logs
- **Returns:** JSON summary of deployment, including endpoints and function ARNs
- **Example:**
  ```bash
  sls deploy --stage prod --region us-east-1
  ```

#### Invoke Command
- **Usage:** `sls invoke -f <functionName> [--data '<JSON>']`
- **Parameters:**
  - `<functionName>` (string): The name of the function to invoke
  - `--data` (JSON string): Input payload for the function
- **Returns:** Response payload from the function invocation
- **Example:**
  ```bash
  sls invoke -f hello --data '{"key": "value"}'
  ```

### AWS Lambda Handler Example (Node.js)

```javascript
'use strict';

/**
 * Lambda function handler
 * @param {Object} event - Event payload
 * @param {Object} context - Lambda context
 * @returns {Promise<Object>} Response object with statusCode and body
 */
module.exports.hello = async (event, context) => {
  try {
    // Process event data
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Hello from Lambda!' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### Serverless Offline Plugin Method (Hypothetical)

```javascript
/**
 * Starts the Serverless Offline simulation.
 * @param {Object} options - Configuration options
 * @param {number} options.httpPort - Port for the HTTP server (default: 3000)
 * @param {boolean} [options.noPrependStageInUrl=false] - Flag to omit stage in URL
 * @returns {Promise<void>}
 */
async function startServerlessOffline(options) {
  // Initialize offline server with provided options
}
```

### Webpack Configuration for Serverless

```javascript
const path = require('path');

module.exports = {
  entry: './handler.js',
  target: 'node',
  mode: 'production',
  output: {
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, '.webpack'),
    filename: 'handler.js'
  }
};
```

### Plugin Configuration Examples in serverless.yml

#### Prune Plugin
```yaml
custom:
  prune:
    automatic: true
    number: 3
```

#### Domain Manager Plugin
```yaml
custom:
  customDomain:
    domainName: "api.example.com"
    basePath: ""
    stage: "${self:provider.stage}"
    createRoute53Record: true
```

### Troubleshooting Commands

- **Verbose Offline Execution:**
  ```bash
  sls offline start --verbose
  ```
- **Tail CloudWatch Logs:**
  ```bash
  aws logs tail /aws/lambda/<function-name> --follow
  ```
- **Webpack Debug:**
  ```bash
  sls webpack --debug
  ```

This comprehensive specification provides developers with exact commands, configuration settings, full code examples, detailed method signatures, and step-by-step troubleshooting procedures necessary to implement and debug a Serverless Framework based project.

## Original Source
Serverless Framework Documentation
https://www.serverless.com/framework/docs/

## Digest of SERVERLESS_FRAMEWORK

# Serverless Framework Documentation

**Retrieved Date:** 2023-10-17
**Data Size:** 1373498 bytes

## Overview
This document presents concrete technical specifications extracted directly from the Serverless Framework documentation. It includes detailed plugin listings, configuration examples, CLI commands, full code samples, and precise API method signatures.

## Plugins and Tools

### Serverless Offline
- **Purpose:** Emulates AWS Lambda and API Gateway locally.
- **Command:** `serverless offline start`
- **Options:**
  - `--httpPort`: Port number (default: 3000)
  - `--noPrependStageInUrl`: Boolean flag

### Serverless Prune Plugin
- **Purpose:** Deletes old versions of functions from AWS while preserving recent deployments.
- **Configuration Example:**
  ```yaml
  custom:
    prune:
      automatic: true
      number: 3
  ```

### Serverless Webpack
- **Purpose:** Bundles Lambda functions using Webpack to decrease package size.
- **Integration:** Runs pre-deployment to bundle JavaScript code.

### Serverless Domain Manager
- **Purpose:** Manages custom domains for API Gateway integrations.
- **Configuration Options:** Domain name, basePath, stage, certificate details.

### Serverless Esbuild
- **Purpose:** Quickly bundles JavaScript/TypeScript lambdas with minimal configuration.

### Serverless HTTP Plugin
- **Purpose:** Enables the use of existing frameworks (Express, Koa) within AWS Lambda.

### Serverless Dotenv Plugin
- **Purpose:** Loads environment variables from a `.env` file into the Serverless environment.
- **Syntax:** `dotenv: './.env'` within configuration.

### Serverless Step Functions Plugin
- **Purpose:** Integrates AWS Step Functions into the Serverless Framework.
- **Configuration:** Includes state machine definitions under the `functions` section.

### Serverless Plugin Datadog
- **Purpose:** Provides monitoring, tracing, and real-time metrics for Lambda functions.
- **Configuration:** Specify API keys and other Datadog settings in the `custom` section.

### Serverless Plugin Typescript
- **Purpose:** Provides zero-config support for Typescript projects.
- **Integration:** Automatically transpiles TypeScript code during deployment.

### Serverless IAM Roles Per Function Plugin
- **Purpose:** Allows defining IAM roles on a per-function basis.
- **Configuration:** Roles are defined in each function configuration in `serverless.yml`.

### Serverless Python Requirements
- **Purpose:** Bundles Python dependencies for AWS Lambda deployments.
- **Mechanism:** Reads and caches packages from `requirements.txt`.

## Example Implementations

### Node.js HTTP Endpoint Example
```yaml
service: my-service
provider:
  name: aws
  runtime: nodejs14.x
plugins:
  - serverless-offline
  - serverless-webpack
functions:
  hello:
    handler: handler.hello
```

### Python Flask API Example
```yaml
service: my-python-service
provider:
  name: aws
  runtime: python3.8
plugins:
  - serverless-offline
functions:
  app:
    handler: wsgi_handler
```

## CLI Commands

- **Deploy Service:** `sls deploy`
- **Invoke Function:** `sls invoke -f hello`
- **Start Offline Server:** `sls offline start`

## Attribution
Crawled from Serverless Framework Documentation at https://www.serverless.com/framework/docs/ with 4164 links.

## Attribution
- Source: Serverless Framework Documentation
- URL: https://www.serverless.com/framework/docs/
- License: License: Apache License 2.0
- Crawl Date: 2025-04-17T19:50:00.656Z
- Data Size: 1373498 bytes
- Links Found: 4164

## Retrieved
2025-04-17
