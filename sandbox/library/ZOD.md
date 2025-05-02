# ZOD

## Crawl Summary
Installation instructions require TypeScript 4.5+ with strict mode enabled; npm, yarn, bun, pnpm install commands are provided. Basic usage includes defining strings, objects, and coercion of primitive types via z.coerce. Detailed API methods include .parse, .safeParse, and .parseAsync with error handling. Comprehensive validations for strings (min, max, email, regex, transforms), numbers, dates, IP addresses, objects (.extend, .merge, .pick, .omit, .partial), arrays, tuples, unions, recursive schemas, and function schemas are specified. Troubleshooting tips include using .refine and .superRefine with custom error messages.

## Normalised Extract
Table of Contents:
1. Installation and Setup
   - Install via npm, yarn, bun, pnpm
   - Enable strict mode in tsconfig.json with "strict": true
2. Basic Schemas and Usage
   - Example: const mySchema = z.string(); mySchema.parse("tuna");
   - Object schema: z.object({ key: z.string() });
3. Primitive Types and Coercion
   - Primitive schemas: z.string(), z.number(), etc.
   - Coercion using z.coerce.string(), z.coerce.number(), with built-in type conversions
4. String Validations and Transformations
   - Methods: .min(), .max(), .email(), .regex(), .trim(), .toLowerCase(), .toUpperCase()
   - Custom error messages with second parameter in validations
5. Date, Time, and Datetime Validations
   - z.string().datetime({ offset: true, precision: 3 })
   - z.string().date() for YYYY-MM-DD and z.string().time({ precision: 3 })
6. Number, BigInt, and Nullable Types
   - z.number().gt(), .gte(), .int(), z.bigint().multipleOf()
   - Optional and nullable types via .optional() and .nullable()
7. Complex Object Schemas
   - Methods: .extend, .merge, .pick, .omit, .partial, .deepPartial, .required, .passthrough, .strict, .catchall
8. Arrays, Tuples and Unions
   - Array schema: z.array(z.string()) with .nonempty(), .min(), .max()
   - Tuple schema: z.tuple([...]) and variadic tuples with .rest()
   - Union schema: z.union([...]) and discriminated unions
9. Function Schemas
   - Define with z.function().args(...).returns(...).implement(fn)
10. Schema Methods
    - .parse(data), .parseAsync(data), .safeParse(data), .safeParseAsync(data)
    - .refine(validator, { message }) and .superRefine(callback)

Detailed Technical Information for Each Table of Contents Topic:
Installation: Set up TypeScript with strict mode; install zod via package managers. Default install command: npm install zod.

Basic Schemas: Define primitive schemas (e.g., z.string(), z.number()) and object schemas (z.object({ field: type })).

Coercion: Use z.coerce.method() to convert inputs; e.g., z.coerce.string() applies String(input).

String Validations: Chain validations like z.string().min(5, { message: "Must be 5 or more characters long" }); supports email(), url(), regex(), and string transforms such as trim and case conversion.

Date & Time: Enforce ISO formats in datetime(), date(), time() methods with configurable options (offset, local, precision).

Numbers: Validate numeric ranges and types using .gt(), .gte(), .lt(), .lte(), .int(), and safe number bounds with .safe().

Objects: Utilize schema methods for property manipulation and key validation. Use .extend() to add fields, .merge() to combine schemas, and .pick/.omit for selective validation.

Arrays & Tuples: Define array items with z.array(schema) and validate non-empty and length constraints. Tuples require fixed element types with z.tuple([...]) and support rest elements via .rest().

Unions: Use z.union([...]) or .or() to allow multiple valid types; discriminated unions enable faster evaluation via a common key.

Function Schemas: Validate function signatures with input and output types; implement using .implement() to auto-validate.

Schema Methods: Core methods include parse, parseAsync, safeParse, safeParseAsync, refine, and preprocess for advanced customization.

Troubleshooting: Use detailed error messages via custom messages in validations and .superRefine to aggregate errors.

## Supplementary Details
Installation Configuration:
- tsconfig.json must include "strict": true
- npm install zod (or equivalent for yarn, bun, pnpm)

Technical Specifications:
- Primitive coercion: z.coerce.string() converts input using String(input); similar methods for Number, Boolean, BigInt, and Date.
- String validations: Methods such as .min(n, { message }), .max(n, { message }), .email({ message }), .regex(pattern, { message })
- DateTime: z.string().datetime() enforces ISO 8601 format; options: { offset: true } to allow timezone offsets, { local: true } for local time, { precision: number } to fix sub-second precision.
- Object manipulation: z.object({}) supports .extend({}), .merge(anotherSchema), .pick({ key: true }), .omit({ key: true }), .partial(), .deepPartial(), .required({ key: true })
- Array constraints: z.array(schema).nonempty({ message }), .min(n), .max(n), .length(n)
- Function schema: z.function().args(...).returns(...).implement(func) validates both parameters and return types.

Implementation Steps:
1. Define your schema using the appropriate zod method.
2. Chain validation methods for custom messages.
3. Parse input using .parse for synchronous validation or .parseAsync for asynchronous.
4. Handle errors using try/catch or safeParse returns.

Best Practices:
- Always enforce strict typing by enabling TypeScript strict mode
- Use .safeParse for non-throwing validation in production
- Aggregate errors with .superRefine when multiple fields require validation
- Utilize coercion (z.coerce) for transforming external inputs

Troubleshooting Procedures:
- If input fails validation, check the error details from ZodError; use safeParse to obtain error objects.
- For asynchronous validations, use parseAsync and then .catch() to log error stack traces.
- Validate configuration by ensuring tsconfig includes strict mode and that the input type matches the schema.
- Test schema behavior with unit tests using provided examples.

## Reference Details
API Specifications:

Method Signatures:
- parse(data: unknown): T
    Throws ZodError if data is invalid. Returns deep clone of validated data.

- parseAsync(data: unknown): Promise<T>
    Validates input asynchronously; must be used with async refinements.

- safeParse(data: unknown): { success: true, data: T } | { success: false, error: ZodError }
    Returns a discriminated union containing the result or error details.

- safeParseAsync(data: unknown): Promise<{ success: true, data: T } | { success: false, error: ZodError }>

Function Schema:
  const myFunction = z.function()
      .args(z.string(), z.number())
      .returns(z.boolean());
  // Inferred type: (arg0: string, arg1: number) => boolean
  
  myFunction.implement((arg0: string, arg1: number): boolean => {
      // Implementation logic
      return arg0.length === arg1;
  });

Coercion Methods:
  z.coerce.string(); // Uses String(input)
  z.coerce.number(); // Uses Number(input)
  z.coerce.boolean(); // Uses Boolean(input)
  z.coerce.bigint(); // Uses BigInt(input)
  z.coerce.date(); // Uses new Date(input)

Schema Methods for Object Schemas:
  const schema = z.object({ key: z.string() });
  schema.extend({ extra: z.number() });
  schema.merge(anotherSchema); // Properties in anotherSchema override conflicts
  schema.pick({ key: true });
  schema.omit({ extra: true });
  schema.partial();
  schema.deepPartial();
  schema.required({ key: true });
  schema.passthrough(); // Allow unknown keys
  schema.strict(); // Disallows unknown keys
  schema.catchall(z.number()); // All unknown keys validated as number

String Validation Examples:
  const strSchema = z.string().min(5, { message: "Must be at least 5 characters" })
                              .max(50, { message: "Must be 50 or fewer characters" })
                              .email({ message: "Invalid email address" });

Troubleshooting Commands:
  // Synchronous parsing
  try {
      const result = mySchema.parse(input);
      console.log(result);
  } catch (error) {
      if (error instanceof ZodError) {
          console.error('Validation failed:', error.errors);
      }
  }

  // Asynchronous parsing
  mySchema.parseAsync(input)
      .then(data => console.log(data))
      .catch((error: ZodError) => console.error('Async validation failed:', error.errors));

Configuration Options with Effects:
  - { offset: true } in datetime() allows timezone offsets
  - { local: true } in datetime() permits unqualified date strings
  - { precision: number } sets the required sub-second precision
  - Custom error messages provided as second argument in validation methods override default messages

Complete SDK Method Usage:
  // Example for a function schema
  const trimmedLength = z.function()
      .args(z.string())
      .returns(z.number())
      .implement((x: string): number => x.trim().length);

  // Example for recursive schema
  const baseCategory = z.object({ name: z.string() });
  type Category = z.infer<typeof baseCategory> & { subcategories: Category[] };
  const categorySchema: z.ZodType<Category> = baseCategory.extend({
      subcategories: z.lazy(() => categorySchema.array())
  });

  // Example for custom schema
  const px = z.custom<`${number}px`>((val: unknown) => typeof val === 'string' && /^\d+px$/.test(val), 'Invalid pixel value');

Best Practices:
  - Use safeParse when handling external user inputs
  - Combine .refine and .superRefine for complex validations
  - Validate async transformations with parseAsync

Return Types:
  - ZodError contains error.issues array with path, message, and code for each validation error.

## Information Dense Extract
TS 4.5+ strict enabled; npm install zod. Schemas: z.string(), z.number(), z.boolean(), z.date(), etc. Coercion: z.coerce.string() => String(input), similar for number, boolean, bigint, date. Object: z.object({ key: z.string() }) with methods .extend(), .merge(), .pick(), .omit(), .partial(), .deepPartial(), .required(), .passthrough(), .strict(), .catchall(). Arrays: z.array(schema) with .nonempty(), .min(n), .max(n), .length(n). Tuples: z.tuple([...]) and .rest(). Unions: z.union([...]) or .or(); discriminated using common key. Function schema: z.function().args(...).returns(...).implement(fn). Core methods: parse(data: unknown): T; parseAsync(data): Promise<T>; safeParse(data): {success, data|error}; safeParseAsync(data). String methods: .min(n, {message}), .max(n), .email(), .regex(), .trim(), .toLowerCase(), .toUpperCase(). Date/time validations: datetime({offset, local, precision}), date(), time({precision}). API methods include full SDK signatures with exact parameters and error returns (ZodError with issues array). Best practices include using safeParse and custom refinements with detailed error messages, async parsing for async validations, and coercion for external data.

## Sanitised Extract
Table of Contents:
1. Installation and Setup
   - Install via npm, yarn, bun, pnpm
   - Enable strict mode in tsconfig.json with 'strict': true
2. Basic Schemas and Usage
   - Example: const mySchema = z.string(); mySchema.parse('tuna');
   - Object schema: z.object({ key: z.string() });
3. Primitive Types and Coercion
   - Primitive schemas: z.string(), z.number(), etc.
   - Coercion using z.coerce.string(), z.coerce.number(), with built-in type conversions
4. String Validations and Transformations
   - Methods: .min(), .max(), .email(), .regex(), .trim(), .toLowerCase(), .toUpperCase()
   - Custom error messages with second parameter in validations
5. Date, Time, and Datetime Validations
   - z.string().datetime({ offset: true, precision: 3 })
   - z.string().date() for YYYY-MM-DD and z.string().time({ precision: 3 })
6. Number, BigInt, and Nullable Types
   - z.number().gt(), .gte(), .int(), z.bigint().multipleOf()
   - Optional and nullable types via .optional() and .nullable()
7. Complex Object Schemas
   - Methods: .extend, .merge, .pick, .omit, .partial, .deepPartial, .required, .passthrough, .strict, .catchall
8. Arrays, Tuples and Unions
   - Array schema: z.array(z.string()) with .nonempty(), .min(), .max()
   - Tuple schema: z.tuple([...]) and variadic tuples with .rest()
   - Union schema: z.union([...]) and discriminated unions
9. Function Schemas
   - Define with z.function().args(...).returns(...).implement(fn)
10. Schema Methods
    - .parse(data), .parseAsync(data), .safeParse(data), .safeParseAsync(data)
    - .refine(validator, { message }) and .superRefine(callback)

Detailed Technical Information for Each Table of Contents Topic:
Installation: Set up TypeScript with strict mode; install zod via package managers. Default install command: npm install zod.

Basic Schemas: Define primitive schemas (e.g., z.string(), z.number()) and object schemas (z.object({ field: type })).

Coercion: Use z.coerce.method() to convert inputs; e.g., z.coerce.string() applies String(input).

String Validations: Chain validations like z.string().min(5, { message: 'Must be 5 or more characters long' }); supports email(), url(), regex(), and string transforms such as trim and case conversion.

Date & Time: Enforce ISO formats in datetime(), date(), time() methods with configurable options (offset, local, precision).

Numbers: Validate numeric ranges and types using .gt(), .gte(), .lt(), .lte(), .int(), and safe number bounds with .safe().

Objects: Utilize schema methods for property manipulation and key validation. Use .extend() to add fields, .merge() to combine schemas, and .pick/.omit for selective validation.

Arrays & Tuples: Define array items with z.array(schema) and validate non-empty and length constraints. Tuples require fixed element types with z.tuple([...]) and support rest elements via .rest().

Unions: Use z.union([...]) or .or() to allow multiple valid types; discriminated unions enable faster evaluation via a common key.

Function Schemas: Validate function signatures with input and output types; implement using .implement() to auto-validate.

Schema Methods: Core methods include parse, parseAsync, safeParse, safeParseAsync, refine, and preprocess for advanced customization.

Troubleshooting: Use detailed error messages via custom messages in validations and .superRefine to aggregate errors.

## Original Source
Zod Documentation
https://github.com/colinhacks/zod

## Digest of ZOD

# ZOD DOCUMENTATION DIGEST

Retrieved on: 2023-10-12

# Installation

Requirements:
- TypeScript 4.5+
- tsconfig.json must have "strict": true in compilerOptions

NPM Install Commands:
- npm install zod
- yarn add zod
- bun add zod
- pnpm add zod

Canary Version:
- npm install zod@canary

# Basic Usage

Example: Creating a string schema

  import { z } from "zod";

  const mySchema = z.string();
  mySchema.parse("tuna");
  // Throws ZodError if invalid

Example: Object schema

  const User = z.object({
    username: z.string()
  });

  User.parse({ username: "Ludwig" });
  type User = z.infer<typeof User>;

# Primitives & Coercion

Primitive schemas:
  z.string(), z.number(), z.boolean(), z.date(), etc.

Coercion:
  const schema = z.coerce.string();
  schema.parse(12); // returns "12"

For all primitives, coercion uses built-ins: String(), Number(), Boolean(), new Date(), BigInt().

# Literals & Strings

Literals:
  z.literal("tuna"), z.literal(12), z.literal(2n)

String validations:
  z.string().min(5, { message: "Must be 5 or more characters long" });
  z.string().max(5);
  z.string().email();
  z.string().url();
  z.string().regex(/regex/);

String transforms:
  .trim(), .toLowerCase(), .toUpperCase()

# Datetimes, Dates & Times

Datetimes:
  z.string().datetime(); // ISO 8601 without offsets by default
  Options include: { offset: true } or { local: true }, { precision: 3 }

Dates:
  z.string().date(); // format YYYY-MM-DD

Times:
  z.string().time({ precision: 3 });

# Numbers & BigInts

Numbers:
  z.number().gt(5);
  z.number().gte(5);
  z.number().int();
  z.number().positive();
  z.number().multipleOf(5);

BigInts:
  z.bigint().gt(5n);
  z.bigint().multipleOf(5n);

# Object Schemas

Manipulation methods:
  .shape, .keyof, .extend, .merge, .pick, .omit, .partial, .deepPartial, .required, .passthrough, .strict, .strip, .catchall

Example using .extend:
  const Dog = z.object({ name: z.string(), age: z.number() });
  const DogWithBreed = Dog.extend({ breed: z.string() });

# Arrays, Tuples & Unions

Arrays:
  z.array(z.string());
  Methods: .nonempty(), .min(), .max(), .length()

Tuples:
  z.tuple([z.string(), z.number(), z.object({ pointsScored: z.number() })]);
  Variadic using .rest()

Unions:
  z.union([z.string(), z.number()]);
  Also .or() method

Discriminated Unions:
  z.discriminatedUnion("status", [
    z.object({ status: z.literal("success"), data: z.string() }),
    z.object({ status: z.literal("failed"), error: z.instanceof(Error) })
  ]);

# Recursive Types & Custom Schemas

Recursive schemas using z.lazy(), e.g. for recursive category structures.

Custom Schemas using z.custom<T>() with validation functions.

# Function Schemas

Defining function schemas:

  const func = z.function().args(z.string(), z.number()).returns(z.boolean());
  // Method .implement() validates inputs/outputs

Example:
  const trimmedLength = z.function()
      .args(z.string())
      .returns(z.number())
      .implement((x) => x.trim().length);

# Schema Methods

Key methods include:
  .parse(data: unknown): T
  .parseAsync(data: unknown): Promise<T>
  .safeParse(data: unknown): { success: boolean; data?: T; error?: ZodError }
  .safeParseAsync(data: unknown): Promise<{ success: boolean; data?: T; error?: ZodError }>

Other methods:
  .refine(validator, { message, path })
  .superRefine(callback)
  .preprocess(transformFn, schema)

# Coercion & Preprocess

Using z.coerce and z.preprocess to transform inputs before validation.

# Troubleshooting & Best Practices

- Always use strict mode in tsconfig.json
- For asynchronous validations use .parseAsync() and .safeParseAsync()
- Use .optional() and .nullable() to handle missing or null values
- Utilize .passthrough() if extra keys must be preserved
- Wrap complex validations in .refine or .superRefine with detailed error messages

# Attribution

Data Size: 827461 bytes; Links found: 5643; Source: https://github.com/colinhacks/zod

## Attribution
- Source: Zod Documentation
- URL: https://github.com/colinhacks/zod
- License: License: MIT
- Crawl Date: 2025-05-02T20:38:52.768Z
- Data Size: 827461 bytes
- Links Found: 5643

## Retrieved
2025-05-02
