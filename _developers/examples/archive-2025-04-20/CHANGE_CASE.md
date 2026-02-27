# CHANGE_CASE

## Crawl Summary
The extracted technical details present installation commands, usage examples, a full table of available case transformation methods (camelCase, capitalCase, constantCase, etc.) with exact outputs, supported options with precise types and defaults, and utilities like the split function and change-case/keys module along with API parameters.

## Normalised Extract
# Table of Contents

1. Installation
2. Usage
3. Available Methods & Transformations
4. Options Object Specifications
5. Utility Functions
6. Change Case Keys API

---

## 1. Installation

Command:

    npm install change-case --save

## 2. Usage

Import and usage example:

    import * as changeCase from "change-case";
    console.log(changeCase.camelCase("TEST_VALUE")); // => "testValue"

## 3. Available Methods & Transformations

| Method            | Transformation Example | Output Example   |
|-------------------|------------------------|------------------|
| camelCase         | "TEST_VALUE"         | "testValue"    |
| capitalCase       | "test value"         | "Two Words"    |
| constantCase      | "test_value"         | "TWO_WORDS"    |
| dotCase           | "test_value"         | "two.words"    |
| kebabCase         | "test_value"         | "two-words"    |
| noCase            | "TEST_VALUE"         | "two words"    |
| pascalCase        | "test_value"         | "TwoWords"     |
| pascalSnakeCase   | "test_value"         | "Two_Words"    |
| pathCase          | "test_value"         | "two/words"    |
| sentenceCase      | "test_value"         | "Two words"    |
| snakeCase         | "test_value"         | "two_words"    |
| trainCase         | "test_value"         | "Two-Words"    |

## 4. Options Object Specifications

Each method accepts an options object with parameters:

- delimiter?: string (default varies per method, e.g., '_' for snakeCase)
- locale?: string[] | string | false (default to host environment; false disables locale transformation)
- split?: (value: string) => string[] (default provided by library)
- prefixCharacters?: string (default "")
- suffixCharacters?: string (default "")
- mergeAmbiguousCharacters?: boolean (for pascalCase & snakeCase; if true, merges ambiguous characters)

## 5. Utility Functions

**split Function:**

    import { split } from "change-case";
    const words = split("fooBar");
    const result = words.map(x => x.toLowerCase()).join("_"); // => "foo_bar"

## 6. Change Case Keys API

Usage to transform object keys:

    import * as changeKeys from "change-case/keys";
    const result = changeKeys.camelCase({ TEST_KEY: true });
    // result: { testKey: true }

**API Parameters:**

- input: any
- depth: number (default 1)
- options: object (same as base methods options)

These details provide immediate implementation instructions regarding case transformations with complete examples and exact configuration settings.

## Supplementary Details
### Supplementary Technical Specifications and Implementation Details

1. **Options Object Details:**
   - delimiter?: string
     - Default: Varies by method (e.g., '_' for snakeCase, '-' for kebabCase)
   - locale?: string[] | string | false
     - Default: System locale; set to false to disable case conversion based on locale
   - split?: (value: string) => string[]
     - Default: Uses built-in split function that splits camelCase, PascalCase and other variants into individual words
   - prefixCharacters?: string
     - Default: ""; used to retain specific leading characters (e.g., '_' for __typename)
   - suffixCharacters?: string
     - Default: ""; used for trailing characters preservation
   - mergeAmbiguousCharacters?: boolean
     - Default: false; if set to true, ambiguous characters (such as '.' in "V1.2") are merged resulting in "V12" instead of "V1_2"

2. **Implementation Steps for Transforming a String:**
   - Import the library using ESM syntax:
     ```javascript
     import * as changeCase from "change-case";
     ```
   - Call the desired method with the target string and an optional options object:
     ```javascript
     const result = changeCase.camelCase("TEST_VALUE", { delimiter: "-", locale: "en-US" });
     console.log(result); // Expected: "testValue" (options may not alter camelCase by default)
     ```

3. **Usage of the Split Utility:**
   - Import and use the split method to divide a string into its constituent parts:
     ```javascript
     import { split } from "change-case";
     const words = split("fooBar");
     // Process: Convert all words to lowercase and join them with an underscore
     const finalString = words.map(word => word.toLowerCase()).join("_");
     console.log(finalString); // "foo_bar"
     ```

4. **Change Case Keys for Objects:**
   - Import the keys module:
     ```javascript
     import * as changeKeys from "change-case/keys";
     ```
   - Transform object keys:
     ```javascript
     const obj = { TEST_KEY: true, ANOTHER_KEY: 123 };
     const newObj = changeKeys.camelCase(obj);
     // newObj becomes: { testKey: true, anotherKey: 123 }
     console.log(newObj);
     ```

5. **TypeScript and ESM Considerations:**
   - This package is pure ESM. It includes TypeScript definitions but cannot be imported via require in CommonJS.
   - Ensure that your project configuration supports ES modules.


## Reference Details
### Complete API Specifications and Implementation Patterns

1. **Library Import & Basic Usage**

   - **Importing the Library (ESM):**
     ```javascript
     // Import entire module
     import * as changeCase from "change-case";
     
     // Import specific utility
     import { split } from "change-case";
     
     // Import keys transformation module
     import * as changeKeys from "change-case/keys";
     ```

2. **SDK Method Signatures and Options**

   - **camelCase Method:**
     ```typescript
     function camelCase(input: string, options?: {
       delimiter?: string;
       locale?: string[] | string | false;
       split?: (value: string) => string[];
       prefixCharacters?: string;
       suffixCharacters?: string;
       mergeAmbiguousCharacters?: boolean;
     }): string
     ```

   - **Other Methods:**

     The methods `capitalCase`, `constantCase`, `dotCase`, `kebabCase`, `noCase`, `pascalCase`, `pascalSnakeCase`, `pathCase`, `sentenceCase`, `snakeCase`, `trainCase` follow the same signature as above, differing only in the transformation logic applied.

3. **Full Code Examples with Comments**

   - *Example: Converting a string to various cases*

     ```javascript
     // Import change-case module
     import * as changeCase from "change-case";

     // Input string
     const inputString = "TEST_VALUE";

     // Convert using various methods
     const camel = changeCase.camelCase(inputString);
     const pascal = changeCase.pascalCase(inputString);
     const snake = changeCase.snakeCase(inputString, { delimiter: "_", mergeAmbiguousCharacters: true });

     console.log('camelCase:', camel);       // camelCase: testValue
     console.log('pascalCase:', pascal);       // pascalCase: TwoWords
     console.log('snakeCase:', snake);         // snakeCase: two_words
     ```

   - *Example: Using the split utility*

     ```javascript
     import { split } from "change-case";

     // Split a mixed case string
     const wordsArray = split("fooBarBaz");
     // Expected output: ["foo", "Bar", "Baz"] depending on internal splitting logic
     console.log(wordsArray);

     // Custom transformation using the split function
     const customResult = wordsArray.map(word => word.toLowerCase()).join("_");
     console.log(customResult); // e.g., "foo_bar_baz"
     ```

4. **Change Case Keys Detailed API**

   - **Method Signature:**
     ```typescript
     function camelCase(input: any, depth?: number, options?: {
       delimiter?: string;
       locale?: string[] | string | false;
       split?: (value: string) => string[];
       prefixCharacters?: string;
       suffixCharacters?: string;
       mergeAmbiguousCharacters?: boolean;
     }): any
     ```

   - **Usage Example:**
     ```javascript
     import * as changeKeys from "change-case/keys";

     // Sample object with keys in constant case
     const sampleObj = { TEST_KEY: true, EXAMPLE_VALUE: 456 };

     // Transform keys to camelCase
     const transformedObj = changeKeys.camelCase(sampleObj);
     console.log(transformedObj); // { testKey: true, exampleValue: 456 }
     ```

5. **Troubleshooting Procedures**

   - **Common Issue:** "Module not found or incompatible with require"
     - **Command:**
       ```sh
       node -e "import * as changeCase from 'change-case'; console.log(changeCase.camelCase('TEST_VALUE'));"
       ```
     - **Expected Output:**
       ```
       testValue
       ```
     - **Resolution:** Ensure that your project uses ES modules. Adjust your package.json:
       ```json
       { "type": "module" }
       ```

   - **Testing Locale Option:**
     - **Command to Test:**
       ```javascript
       console.log(changeCase.camelCase('TEST_VALUE', { locale: 'tr' }));
       ```
     - **Expected Behavior:** Locale-specific transformation; if issues occur, set locale to false.

6. **Best Practices**

   - Always provide an options object to fine-tune transformations according to project requirements.
   - Use the split utility for custom transformations when the default logic does not suit your input.
   - For object key transformation, prefer using change-case/keys to maintain consistency across datasets.
   - Confirm ESM compatibility in your project to avoid module resolution issues.

These API specifications, full examples, and detailed troubleshooting steps are intended to provide developers with a comprehensive, ready-to-use guide for implementing case transformations with the change-case library.


## Original Source
Change Case Documentation
https://www.npmjs.com/package/change-case

## Digest of CHANGE_CASE

# CHANGE_CASE Documentation

**Retrieved Date:** 2023-10-11

## Installation

```sh
npm install change-case --save
```

## Usage

```javascript
import * as changeCase from "change-case";

console.log(changeCase.camelCase("TEST_VALUE")); // => "testValue"
```

## Available Methods and Transformations

| Method            | Input         | Output      |
|-------------------|---------------|-------------|
| camelCase         | TEST_VALUE    | testValue   |
| capitalCase       | TEST_VALUE    | Two Words   |
| constantCase      | TEST_VALUE    | TWO_WORDS   |
| dotCase           | TEST_VALUE    | two.words   |
| kebabCase         | TEST_VALUE    | two-words   |
| noCase            | TEST_VALUE    | two words   |
| pascalCase        | TEST_VALUE    | TwoWords    |
| pascalSnakeCase   | TEST_VALUE    | Two_Words   |
| pathCase          | TEST_VALUE    | two/words   |
| sentenceCase      | TEST_VALUE    | Two words   |
| snakeCase         | TEST_VALUE    | two_words   |
| trainCase         | TEST_VALUE    | Two-Words   |

## Options Object

All methods accept an options object as the second argument with the following properties:

- `delimiter?: string` : Character used between words. Default depends on method (e.g., `_` in snakeCase).
- `locale?: string[] | string | false` : For locale-specific casing. Defaults to host environment. Set to `false` to disable.
- `split?: (value: string) => string[]` : Function to determine how the input string is split into words. Defaults to the package's split function.
- `prefixCharacters?: string` : Characters to retain at the beginning of the string. Default is "". Example: use "_" to keep underscores in __typename.
- `suffixCharacters?: string` : Characters to retain at the end of the string. Default is "". Example: use "_" to keep trailing underscores in type_.
- `mergeAmbiguousCharacters?: boolean` : For `pascalCase` and `snakeCase` methods. When set to true, ambiguous characters (like in "V1.2") are merged (result: V12) instead of separated (result: V1_2).

## Utility Function - split

`change-case` provides a `split` utility function that splits a string into an array of words. 

**Example:**

```javascript
import { split } from "change-case";

const words = split("fooBar");
const result = words.map(x => x.toLowerCase()).join("_");
console.log(result); // => "foo_bar"
```

## Change Case Keys

Transform object keys to any case using the `change-case/keys` module.

**Example:**

```javascript
import * as changeKeys from "change-case/keys";

const transformed = changeKeys.camelCase({ TEST_KEY: true });
console.log(transformed); // => { testKey: true }
```

## API Specifications for Change Case Keys

**Parameters:**

- `input: any` - Any JavaScript value to be transformed.
- `depth?: number` - Depth for the transformation. Default is `1`.
- `options?: object` - Same as the options available in the base case functions.

## Attribution and Data Details

- **Data Size:** 566689 bytes
- **Links Found:** 3439
- **Source:** https://www.npmjs.com/package/change-case



## Attribution
- Source: Change Case Documentation
- URL: https://www.npmjs.com/package/change-case
- License: License: MIT License
- Crawl Date: 2025-04-17T21:30:31.246Z
- Data Size: 566689 bytes
- Links Found: 3439

## Retrieved
2025-04-17
