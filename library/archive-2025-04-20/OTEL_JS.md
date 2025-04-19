# OTEL_JS

## Crawl Summary
The crawled content provides detailed technical information about OpenTelemetry JavaScript with precise status levels; it lists supported versions for Node.js and browsers along with TypeScript support policies. It specifies the repositories (opentelemetry-js and opentelemetry-js-contrib) and outlines instrumentation steps, context propagation via the Context API, resource attachment, sampling options, and reference API signatures. Detailed debugging and troubleshooting instructions with exact commands are included.

## Normalised Extract
## Table of Contents
1. Status and Releases
2. Version Support
3. Repositories
4. Instrumentation & Getting Started
5. Context API & Propagation
6. Resources & Sampling
7. API Reference
8. Troubleshooting

### 1. Status and Releases
- Traces: Stable
- Metrics: Stable
- Logs: Development

Detailed release notes and migration instructions (e.g., upgrading to SDK 2.x) are provided.

### 2. Version Support
- Supports active/maintenance LTS Node.js versions.
- Browser support aims for currently supported major versions.
- TypeScript support follows a strict 2-year policy, with older versions dropped in minor releases.

### 3. Repositories
- Core Repository: `opentelemetry-js` (core API and SDK)
- Contributions: `opentelemetry-js-contrib` (additional instrumentation libraries and exporters)

### 4. Instrumentation & Getting Started
- Import modules and instantiate providers. 
- Register provider to auto-instrument modules.
- Code example provided with explicit commands: instantiate provider, get tracer, start and end spans.

### 5. Context API & Propagation
- Provides functions to get and set context across asynchronous boundaries.
- Propagation is implemented to transmit context via HTTP headers/RPC metadata.

### 6. Resources & Sampling
- Resources attach key-value metadata (e.g., service.name) to telemetry.
- Sampling strategies include fixed probability or constant sampling that can be configured with exact threshold values.

### 7. API Reference
- Detailed API signatures for the Tracer, Span, and related interfaces are provided with input parameter types and return types.
- Example methods include startSpan(name: string, options?: SpanOptions, context?: Context): Span

### 8. Troubleshooting
- Specific commands for Node.js debugging (`node --inspect`) and logging configuration (`OTEL_LOG_LEVEL=debug`).
- Guidance on verifying exporter configurations and connection tests via terminal commands.


## Supplementary Details
### Implementation Details
- **SDK Initialization:**
  - Example: 
    ```javascript
    const { NodeTracerProvider } = require('@opentelemetry/node');
    const provider = new NodeTracerProvider({
      // Configuration options
      resource: new Resource({ 'service.name': 'my-service', 'service.version': '1.0.0' }),
      sampler: new TraceIdRatioBased(0.5) // 50% sampling
    });
    provider.register();
    ```
- **Configuration Options:**
  - `resource`: Object specifying metadata; default is empty.
  - `sampler`: Options include AlwaysOnSampler, AlwaysOffSampler, or TraceIdRatioBased with ratio value (0.0 to 1.0).
- **Exporters:**
  - Exporters are configured with endpoint URLs and authentication tokens as needed. For example, configuring an OTLP exporter:
    ```javascript
    const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
    const exporter = new OTLPTraceExporter({
      url: 'http://localhost:4318/v1/traces',
      headers: { 'api-key': 'your-api-key' }
    });
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
    ```
- **Best Practices:**
  - Always register the provider early in the application startup.
  - Set the logging level to debug during development to capture detailed instrumentation logs by exporting `OTEL_LOG_LEVEL=debug`.
  - Use semantic conventions consistently for resource attributes to ensure observability consistency.


## Reference Details
### Complete API Specifications

#### Tracer API
```typescript
interface Tracer {
  /**
   * Starts a new span with the given name and options
   * @param name - The name of the span
   * @param options - Optional SpanOptions including attributes, startTime, and kind
   * @param context - Optional Context to associate with the span
   * @returns A new Span instance
   */
  startSpan(name: string, options?: SpanOptions, context?: Context): Span;

  /**
   * Returns the current active span if any
   * @returns Span | undefined
   */
  getCurrentSpan(): Span | undefined;
}

interface SpanOptions {
  attributes?: { [key: string]: any };
  startTime?: number;
  kind?: SpanKind;
}

enum SpanKind {
  INTERNAL,
  SERVER,
  CLIENT,
  PRODUCER,
  CONSUMER
}

interface Span {
  /**
   * Ends the span
   * @param endTime - Optional end time in epoch ms
   */
  end(endTime?: number): void;

  /**
   * Sets an attribute on the span
   * @param key - Attribute key
   * @param value - Attribute value
   * @returns The Span for chaining
   */
  setAttribute(key: string, value: unknown): this;

  /**
   * Sets multiple attributes on the span
   * @param attributes - An object with key-value pairs
   * @returns The Span for chaining
   */
  setAttributes(attributes: { [key: string]: unknown }): this;

  /**
   * Adds an event to the span
   * @param name - Event name
   * @param attributes - Optional attributes for the event
   * @returns The Span for chaining
   */
  addEvent(name: string, attributes?: { [key: string]: unknown }): this;
}
```

#### SDK Method Signature Example
```javascript
// Sample initialization of the OpenTelemetry Node SDK
const { NodeTracerProvider } = require('@opentelemetry/node');
const { SimpleSpanProcessor } = require('@opentelemetry/tracing');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

// Initialize provider with resource and sampler configuration
const provider = new NodeTracerProvider({
  resource: new Resource({
    'service.name': 'my-service',
    'service.version': '1.0.0'
  }),
  sampler: new TraceIdRatioBased(0.5) // 50% sampling rate
});

// Create and configure the OTLP exporter
const exporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces',
  headers: {
    'api-key': 'your-api-key'
  }
});

// Add the exporter to the provider
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

// Register provider
provider.register();

// Using the tracer in the application
const tracer = provider.getTracer('example-tracer');
const span = tracer.startSpan('operation-name');
// ... perform operations ...
span.end();
```

#### Configuration Options
- Provider Options:
  - resource: An instance of Resource with values such as 'service.name' and 'service.version'.
  - sampler: Instance of AlwaysOnSampler, AlwaysOffSampler, or TraceIdRatioBased with a numeric ratio (e.g., 0.5).
- Exporter Options:
  - url: Endpoint URL for trace data export (e.g., 'http://localhost:4318/v1/traces').
  - headers: Object containing header key-value pairs for authentication.

#### Best Practices & Troubleshooting
- **Best Practices:**
  - Initialize and register the tracer provider at the very beginning of your application's lifecycle.
  - Use semantic conventions when setting resource attributes.
  - Configure sampling to balance observability with performance overhead.

- **Troubleshooting Commands:**
  - Run Node.js with debugging: `node --inspect your-app.js`
  - Enable verbose logging by exporting: `export OTEL_LOG_LEVEL=debug`
  - Use diagnostic tools to verify that spans are created and ended correctly. Example output should indicate span start and end timestamps along with attributes and events.


## Original Source
OpenTelemetry for Node.js
https://opentelemetry.io/docs/instrumentation/js/

## Digest of OTEL_JS

# OpenTelemetry JavaScript Documentation

**Retrieved:** 2023-10-05

## Overview
This document contains the complete technical content extracted directly from the OpenTelemetry JavaScript documentation. It covers the status of components, version support, repositories, instrumentation details, context APIs, propagation mechanisms, resource configuration, sampling strategies, and API references with concrete examples.

## Status and Releases
- **Traces:** Stable
- **Metrics:** Stable
- **Logs:** Development

Latest release information is available on the Releases page. Note: Client instrumentation for browsers is still experimental.

## Version Support
- Supports all active or maintenance LTS versions of Node.js. Previous versions may work but are not officially tested.
- No official supported list of browsers; intended for currently supported versions of major browsers.
- Follows DefinitelyTyped support policy for TypeScript with a 2-year support window.

## Repositories
- **Core:** `opentelemetry-js` — Contains core distribution API and SDK.
- **Contrib:** `opentelemetry-js-contrib` — Contains additional instrumentation and exporter contributions.

## Instrumentation and Usage
### Getting Started
- Instrument your application in Node.js or the browser.
- Use instrumentation libraries to auto-instrument dependencies.
- Configure exporters to process and send telemetry data.

### Example Code:
```javascript
// Import the Node Tracer Provider from OpenTelemetry
const { NodeTracerProvider } = require('@opentelemetry/node');

// Instantiate the tracer provider
const provider = new NodeTracerProvider();

// Register the provider to begin tracing
provider.register();

// Example of starting a span
const tracer = provider.getTracer('example-tracer');
const span = tracer.startSpan('operation-name');

// Do work here...

// End the span when work is complete
span.end();
```

## Context API & Propagation
- Provides a Context API to carry trace context across asynchronous boundaries.
- Supports propagation mechanisms to ensure context is passed through HTTP headers or RPC metadata.

## Resources and Sampling
- **Resources:** Attach environment and service-specific metadata to telemetry data.
- **Sampling:** Reduce telemetry load with configurable strategies. Options typically include constant sampling, probabilistic sampling, etc.

## API Reference
Developers can refer to the OpenTelemetry JavaScript API reference for all classes and methods. For example, key API methods include:

**Tracer API Signature:**
```typescript
interface Tracer {
  startSpan(name: string, options?: SpanOptions, context?: Context): Span;
  getCurrentSpan(): Span | undefined;
}

interface SpanOptions {
  attributes?: { [key: string]: any };
  startTime?: number;
  kind?: SpanKind;
}

interface Span {
  end(endTime?: number): void;
  setAttribute(key: string, value: unknown): this;
  setAttributes(attributes: { [key: string]: unknown }): this;
  addEvent(name: string, attributes?: { [key: string]: unknown }): this;
}
```

## Troubleshooting
- **Debugging Node.js Instrumentation:**
  - Run with inspector: `node --inspect index.js`
  - Enable diagnostic logging by setting relevant environment variables (e.g., `OTEL_LOG_LEVEL=debug`).
- **Verifying Exporter Configuration:**
  - Check connectivity and configuration errors in the exporter settings.

---
*Data Size:* 626992 bytes
*Links Found:* 50769


## Attribution
- Source: OpenTelemetry for Node.js
- URL: https://opentelemetry.io/docs/instrumentation/js/
- License: License: Apache License 2.0
- Crawl Date: 2025-04-17T15:39:51.601Z
- Data Size: 626992 bytes
- Links Found: 50769

## Retrieved
2025-04-17
