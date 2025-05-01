# Simple Echo Function

The `simpleEcho` function is a utility that takes a non-empty string input, trims it, and returns a greeting message.

## Usage

Import the functions from the source directory:

```js
import { simpleEcho, simpleReverse } from '../../sandbox/source/simpleFunction.js';

const greeting = simpleEcho("World");
console.log(greeting); // "Hello, World"
```

## simpleReverse Function

The `simpleReverse` function takes a non-empty string input, trims it, and returns the input string reversed. This function logs its operations using the standard logging functions.

### Usage Example

```js
import { simpleReverse } from '../../sandbox/source/simpleFunction.js';

const reversedHello = simpleReverse("  Hello  ");
console.log(reversedHello); // "olleH"

const reversedWorld = simpleReverse("  World  ");
console.log(reversedWorld); // "dlroW"
```

### Error Handling

Both functions will throw an error with the message "Invalid input: must be a non-empty string" when the input is not a non-empty string after trimming.

#### Example

```js
try {
  simpleReverse("   ");
} catch (error) {
  console.error(error.message); // "Invalid input: must be a non-empty string"
}
```

## Logging

These functions use the standard logging functions (`logInfo` and `logError`) from the main module to log their operations and any errors encountered.
