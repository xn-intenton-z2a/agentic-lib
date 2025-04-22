# WINSTON

## Crawl Summary
The crawled content provides technical details on configuring and using the winston logging library. It includes API methods like winston.createLogger with options: level, format, defaultMeta, transports, exitOnError, and silent. Detailed usage examples show creation of loggers, adding console and file transports, custom formatting with winston.format.combine, and exception/rejection handling via exceptionHandlers and rejections.handle. Additionally, custom transport creation by inheriting from winston-transport is included, along with advanced methods for dynamic reconfiguration and profiling.

## Normalised Extract
## Table of Contents
1. Motivation
2. Quick Start
3. Usage
4. Logger Configuration Options
   - level (default: 'info')
   - levels (default: winston.config.npm.levels)
   - format (default: winston.format.json())
   - transports (array of logging targets)
   - exitOnError (default: true)
   - silent (default: false)
5. Logging Levels
   - npm levels: { error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6 }
6. Formats & Custom Formats
   - Built-in formats: json, logstash, printf, simple, colorize, splat
   - Example: custom printf format
7. Transports
   - File, Console, Http, and custom transports
   - Example: multiple File transports with different levels
8. Exception & Rejection Handling
   - Using exceptionHandlers and rejections.handle
   - Configuring handleExceptions on transports
9. Profiling & Querying
   - Starting profiles with logger.profile() and logger.startTimer()
   - Querying log entries with logger.query(options, callback)
10. Advanced Logger Methods
    - clear(), add(), remove(), configure()

## Detailed Information
- Create a logger using winston.createLogger with signature:
  createLogger(options: {
    level?: string,                // default 'info'
    levels?: object,               // defaults to winston.config.npm.levels
    format?: Format,
    transports?: Transport[],
    exitOnError?: boolean | (err: Error) => boolean,
    silent?: boolean
  }): Logger;

- Logging calls: logger.log({ level, message, ...meta }) or directly as logger.info(message, meta).

- Transports are instantiated with their own options, e.g., File transport:
  new winston.transports.File({ filename: 'combined.log', level: 'info', format: winston.format.json() });

- Custom formats are created using winston.format(fn) where fn returns modified info or false to filter out logs.

- Exception handling can be specified on logger creation via exceptionHandlers array or later using logger.exceptions.handle(transport).

- Rejection handling is similarly set using logger.rejections.handle(transport) or handleRejections flag on transport.

- Advanced methods include dynamic reconfiguration via logger.configure(newOptions) and removal/addition of transports via logger.clear(), logger.add(), and logger.remove(transport).


## Supplementary Details
### Logger Configuration Details
- level: string, default 'info'. Sets the minimum log level.
- levels: object, default winston.config.npm.levels, e.g., { error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6 }.
- format: must be constructed using winston.format methods. Choices include json(), simple(), prettyPrint(), colorize(), splat(), timestamp(), and custom formats via printf().
- transports: An array of transport instances (File, Console, Http). Each transport can be individually configured with options such as filename (for File), level, and format.
- exitOnError: boolean or function, default true. Use false or a filtering function to prevent process exit on uncaught exceptions.
- silent: boolean, default false. When true, logging is suppressed.

### Implementation Steps for a Custom Logger
1. Import winston: `const winston = require('winston');`
2. Create logger with desired options:
   ```javascript
   const logger = winston.createLogger({
     level: 'info',
     format: winston.format.json(),
     defaultMeta: { service: 'user-service' },
     transports: [
       new winston.transports.File({ filename: 'error.log', level: 'error' }),
       new winston.transports.File({ filename: 'combined.log' })
     ],
     exitOnError: false
   });
   ```
3. Conditionally add Console transport for non-production environments.
4. Use logger.log() or logger.<level>() for logging messages.
5. For exception handling, add exceptionHandlers:
   ```javascript
   logger.exceptions.handle(new winston.transports.File({ filename: 'exceptions.log' }));
   ```

### Troubleshooting Procedures
- If logs are not appearing, verify that transports are added to the logger. For the default logger, manually add transports:
  ```javascript
  winston.add(new winston.transports.Console());
  ```
- If memory usage increases, check that the default logger isn’t used without transports.
- For issues with logging levels, ensure that the level specified in both logger and transport configuration is correct.
- Use events on logger such as 'error' and 'finish' to monitor internal logger errors.
  ```javascript
  logger.on('error', (err) => { console.error('Logger error:', err); });
  logger.on('finish', () => { console.log('All logs flushed'); });
  ```


## Reference Details
### Complete API Specifications and Code Examples

#### 1. winston.createLogger(options): Logger
- Parameters:
  - options.level: string (default 'info')
  - options.levels: object (log level mapping, default winston.config.npm.levels)
  - options.format: Format object from winston.format (default winston.format.json())
  - options.transports: Array of Transport instances
  - options.defaultMeta: object (metadata to include with every log)
  - options.exitOnError: boolean | (err: Error) => boolean (default true)
  - options.silent: boolean (default false)
- Returns: A Logger instance with helper methods: log(), error(), warn(), info(), http(), verbose(), debug(), and silly().

Example:

```javascript
const winston = require('library/archive-2025-04-20/WINSTON');

const logger = winston.createLogger({
  level: 'info',
  levels: winston.config.npm.levels,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ],
  exitOnError: false
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

logger.info('Logger initialized successfully');
```

#### 2. Custom Transport Specification
- Extend winston-transport to create custom transports.

Example:
```javascript
const Transport = require('winston-transport');

class YourCustomTransport extends Transport {
  constructor(opts) {
    super(opts);
    // Custom initialization: e.g., connection settings
    this.customOption = opts.customOption || 'default';
  }

  log(info, callback) {
    setImmediate(() => this.emit('logged', info));
    // Write log message to external service
    // For example: send HTTP request using this.customOption
    callback();
  }
}

module.exports = YourCustomTransport;
```

#### 3. Exception and Rejection Handling
- Exception Handling:
```javascript
const logger = winston.createLogger({
  transports: [new winston.transports.File({ filename: 'combined.log' })],
  exceptionHandlers: [new winston.transports.File({ filename: 'exceptions.log' })]
});

// Alternative using handleExceptions flag
winston.add(new winston.transports.File({
  filename: 'combined.log',
  handleExceptions: true
}));
```
- Rejection Handling:
```javascript
logger.rejections.handle(new winston.transports.File({ filename: 'rejections.log' }));

// Or using handleRejections flag
winston.add(new winston.transports.File({
  filename: 'combined.log',
  handleRejections: true
}));
```

#### 4. Dynamic Reconfiguration
- Use logger.configure(options) to completely reconfigure transports and levels.

Example:
```javascript
const DailyRotateFile = require('winston-daily-rotate-file');
logger.configure({
  level: 'verbose',
  transports: [new DailyRotateFile({
    datePattern: 'YYYY-MM-DD',
    filename: 'app-%DATE%.log'
  })]
});
```

#### 5. Profiling
- Start a profile using logger.profile(label) and stop by calling the same method:
```javascript
logger.profile('test');
setTimeout(() => {
  logger.profile('test');
}, 1000);
```

- Alternatively, use startTimer()/done() pattern:
```javascript
const profiler = logger.startTimer();
setTimeout(() => {
  profiler.done({ message: 'Task completed' });
}, 1000);
```

#### 6. Querying Logs
- The logger.query method:
```javascript
const options = {
  from: new Date() - (24*60*60*1000), // last 24 hours
  until: new Date(),
  limit: 10,
  start: 0,
  order: 'desc',
  fields: ['message', 'timestamp']
};

logger.query(options, (err, results) => {
  if (err) {
    console.error('Query error:', err);
  } else {
    console.log('Query results:', results);
  }
});
```

### Best Practices
- Always add at least one transport to avoid high memory usage in the default logger.
- For production, log to files or remote services instead of console.
- Use custom formats to standardize log output.
- Handle exceptions and promise rejections explicitly to prevent unexpected process termination.

### Troubleshooting Commands
- To test logging at different levels:
```bash
node -e "require('./app').logger.info('Test info'); require('./app').logger.error('Test error');"
```
- Monitor logs continuously:
```bash
tail -f combined.log
```
- Verify exitOnError behavior by simulating an error:
```javascript
logger.exitOnError = false;
throw new Error('Test error');
```
Expected output: Log the error without process termination.


## Original Source
Winston Logging Documentation
https://github.com/winstonjs/winston

## Digest of WINSTON

# WINSTON

Retrieved on: 2023-10-XX

## Motivation
Winston is a universal logging library for Node.js that supports multiple transports, each configured with its logging levels and formats. It provides a high degree of flexibility by decoupling log formatting, level filtering, and actual transport mechanisms.

## Quick Start
Refer to examples in the `./examples/` folder.

## Usage
The recommended way is to create your own logger:

```javascript
const winston = require('library/archive-2025-04-20/WINSTON');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    // Log error level or higher to error.log
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // Log info level or higher to combined.log
    new winston.transports.File({ filename: 'combined.log' })
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

## Table of Contents
1. Motivation
2. Quick Start
3. Usage
4. Logger Configuration Options
5. Logging Levels
6. Formats and Custom Formats
7. Transports (Built-in and Custom)
8. Exception and Rejection Handling
9. Profiling and Querying
10. Advanced Logger Methods

## Logger Configuration Options
- **level** (default: 'info'): Filters logs by level.
- **levels** (default: winston.config.npm.levels): Defines log priorities.
- **format** (default: winston.format.json()): Defines the message formatting.
- **transports** (default: []): Array of transport objects (e.g., File, Console).
- **exitOnError** (default: true): Determines whether exceptions cause exit.
- **silent** (default: false): If true, no logs are produced.

## Logging Levels
RFC5424 and npm levels are supported. Example for npm:

```javascript
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};
```

## Formats and Custom Formats
Formats are composed using `winston.format.combine`. Basic examples:

```javascript
const { createLogger, format, transports } = require('library/archive-2025-04-20/WINSTON');
const { combine, timestamp, label, printf } = format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  format: combine(
    label({ label: 'right meow!' }),
    timestamp(),
    myFormat
  ),
  transports: [new transports.Console()]
});
```

Custom format example with modifications:

```javascript
const volume = format((info, opts) => {
  if (opts.yell) {
    info.message = info.message.toUpperCase();
  } else if (opts.whisper) {
    info.message = info.message.toLowerCase();
  }
  return info;
});

const scream = volume({ yell: true });
console.dir(scream.transform({ level: 'info', message: 'please quiet down' }, scream.options));
```

## Transports
### Built-in Transports
- **File**: Write logs to a file. Example:

```javascript
new winston.transports.File({ filename: 'combined.log', level: 'info' });
```

- **Console**: Write logs to stdout/stderr. Optionally force `console.log` usage:

```javascript
new winston.transports.Console({ forceConsole: true, format: winston.format.simple() });
```

### Custom Transports
Custom transports extend `winston-transport` and implement a `log(info, callback)` method:

```javascript
const Transport = require('winston-transport');

class YourCustomTransport extends Transport {
  constructor(opts) {
    super(opts);
    // Process custom options such as connection details
  }
  log(info, callback) {
    setImmediate(() => this.emit('logged', info));
    // Write info to remote service
    callback();
  }
}

module.exports = YourCustomTransport;
```

## Exception and Rejection Handling
Enable exception handling by specifying `exceptionHandlers` or using `handleExceptions` on transports:

```javascript
const logger = winston.createLogger({
  transports: [new winston.transports.File({ filename: 'combined.log' })],
  exceptionHandlers: [new winston.transports.File({ filename: 'exceptions.log' })]
});

// For promise rejections
logger.rejections.handle(new winston.transports.File({ filename: 'rejections.log' }));
```

Set `exitOnError` to false to prevent process exit:

```javascript
const logger = winston.createLogger({ exitOnError: false });
// or
logger.exitOnError = (err) => err.code !== 'EPIPE';
```

## Profiling and Querying
### Profiling
Profile logging can be started and stopped:

```javascript
logger.profile('test');
setTimeout(() => {
  logger.profile('test');
}, 1000);

const profiler = logger.startTimer();
setTimeout(() => {
  profiler.done({ message: 'completed profiling' });
}, 1000);
```

### Querying
Logs can be queried with options:

```javascript
const options = {
  from: new Date() - (24 * 60 * 60 * 1000),
  until: new Date(),
  limit: 10,
  start: 0,
  order: 'desc',
  fields: ['message']
};

logger.query(options, (err, results) => {
  if (err) throw err;
  console.log(results);
});
```

## Advanced Logger Methods
- **clear()**: Remove all transports.
- **add(transport)**: Add a transport.
- **remove(transport)**: Remove a transport.
- **configure(options)**: Reconfigure the logger entirely.

Example of reconfiguration:

```javascript
const DailyRotateFile = require('winston-daily-rotate-file');
logger.configure({
  level: 'verbose',
  transports: [new DailyRotateFile({ datePattern: 'YYYY-MM-DD', filename: 'app-%DATE%.log' })]
});
```

Attribution: Data crawled from https://github.com/winstonjs/winston, Data Size: 706452 bytes, Links: 5006.

## Attribution
- Source: Winston Logging Documentation
- URL: https://github.com/winstonjs/winston
- License: License: MIT License
- Crawl Date: 2025-04-17T15:02:05.128Z
- Data Size: 706452 bytes
- Links Found: 5006

## Retrieved
2025-04-17
