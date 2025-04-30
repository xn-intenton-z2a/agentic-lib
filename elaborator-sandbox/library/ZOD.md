# ZOD

## Crawl Summary
Zod provides a comprehensive, TypeScript-first schema validation library. Technical details include precise method signatures for schema creation (z.string(), z.number(), etc.), coercion via z.coerce.* methods, extensive object manipulation methods (extend, merge, pick, omit, partial, deepPartial), array and tuple handling (.array(), .nonempty(), .rest), union and discriminated union definitions (z.union(), z.discriminatedUnion()), and function schema definitions with .function(). Key API methods include .parse(input), .parseAsync(input), .safeParse(input), .safeParseAsync(), and .refine(validator, params). Exact configuration options (e.g., date precision, IP version, custom error messages) are provided in each method's signature.

## Normalised Extract
Table of Contents:
  1. Introduction
  2. Installation
  3. Basic Usage
  4. Primitives & Coercion
  5. Strings Validation
  6. Date/Time, Datetime, Date, Time
  7. IP Address & CIDR
  8. Number & BigInt Validations
  9. Booleans & Dates
  10. Enums (Zod and Native)
  11. Optional and Nullable Types
  12. Objects (shape, extend, merge, pick, omit, partial, deepPartial, required, passthrough, strict, strip, catchall)
  13. Arrays, Tuples, Unions, Discriminated Unions
  14. Records, Maps, Sets
  15. Intersections & Recursive Types
  16. Zod Effects (preprocess, refine, transform)
  17. Promises & Instanceof
  18. Function Schemas (args, returns, implement, parameters, returnType)
  19. Schema Methods (.parse, .parseAsync, .safeParse, .safeParseAsync, .spa, .refine)

Each section contains specific implementation details:
- Coercion functions: z.coerce.string() uses String(input), z.coerce.number() calls Number(input), etc.
- String validations include min, max, regex, email, url validations with custom messages.
- Date/Time validations include options such as { offset: true } and { precision: 3 }.
- Object schema methods allow field access via .shape and modifications with .extend, .merge.
- Function schemas enforce types with .args() and .returns(), and wrap with .implement() for auto-validation.
- Core API methods have explicit signatures: parse(input: unknown): T; parseAsync(input: unknown): Promise<T>; safeParse returns discriminated union with success flag and error details.


## Supplementary Details
Installation requires enabling strict mode in tsconfig.json. Method specifications include:
- z.string(): Returns a ZodString instance supporting methods like .min(n, { message }), .max(n, { message }), .regex(pattern).
- z.coerce.string(): Coerces input using String(input) with subsequent chainable validations.
- z.object({ ... }): Creates an object schema with required properties by default; use .partial(), .deepPartial(), .required() to adjust optionality.
- Array schemas: z.array(schema) supports .nonempty({ message }), .min(n), .max(n).
- Function schema: z.function().args(schema1, schema2).returns(schema) and .implement(fn) ensure input and output validation.

Configuration options:
- Date strings: z.string().datetime({ offset: true, precision: 3 })
- IP: z.string().ip({ version: 'v4' })
- Enums: z.enum(["Salmon", "Tuna"]) and z.nativeEnum(SomeEnum)

Troubleshooting:
- Use safeParse methods to debug validation errors.
- For recursive schemas, use z.lazy(() => schema) to avoid infinite loops.
- For function schemas, call .parameters() and .returnType() to inspect validation contracts.

Best practices:
- Define schemas once and reuse them to avoid duplicative type definitions.
- Chain methods for concise schema definitions.
- Use .strict() on objects to catch unexpected keys.


## Reference Details
API Specifications:

1. Zod String:
   - Signature: z.string(options?: { required_error?: string, invalid_type_error?: string }): ZodString
   - Methods:
       .min(n: number, options?: { message?: string }): ZodString
       .max(n: number, options?: { message?: string }): ZodString
       .regex(pattern: RegExp, options?: { message?: string }): ZodString
       .email(options?: { message?: string }): ZodString
       .url(options?: { message?: string }): ZodString
       .trim(): ZodString
       .toLowerCase(): ZodString
       .toUpperCase(): ZodString

2. Coercion Methods:
   - z.coerce.string(): returns a ZodString instance, coercing input with String(input)
   - z.coerce.number(): similar, uses Number(input)
   - z.coerce.boolean(), z.coerce.bigint(), z.coerce.date()

3. Object Schemas:
   - Signature: z.object(shape: { [key: string]: ZodTypeAny }): ZodObject
   - Methods: .extend(), .merge(), .pick(), .omit(), .partial(), .deepPartial(), .required(), .passthrough(), .strict(), .strip(), .catchall()

4. Array Schemas:
   - Signature: z.array(elementSchema: ZodTypeAny): ZodArray
   - Methods: .nonempty(options?: { message?: string }), .min(n: number), .max(n: number), .length(n: number)

5. Function Schemas:
   - Creation: z.function()
   - .args(...schemas: ZodTypeAny[]): ZodTuple
   - .returns(schema: ZodTypeAny): ZodFunction
   - .implement(fn: Function): Function with runtime validation
   - .parameters(): ZodTuple
   - .returnType(): ZodTypeAny

6. Core Parsing Methods:
   - parse(input: unknown): T
   - parseAsync(input: unknown): Promise<T>
   - safeParse(input: unknown): { success: true, data: T } | { success: false, error: ZodError }
   - safeParseAsync(input: unknown): Promise<{ success: boolean, data?: T, error?: ZodError }>
   - spa(input: unknown): Alias for safeParseAsync

7. Effects and Refinements:
   - z.preprocess(preprocessor: (data: unknown) => unknown, schema: ZodTypeAny): ZodEffects
   - .refine(validator: (data: T) => any, options?: { message?: string, path?: (string | number)[], code?: string }): ZodType
   - .superRefine(callback: (data: T, ctx: { addIssue(issue: ZodIssue): void }) => void): ZodType

8. Custom Schemas:
   - z.custom<T>(validator?: (val: unknown) => boolean, errorMessage?: string): ZodType<T>

Troubleshooting Procedures:
   - If .parse throws, use .safeParse to capture error details. Example:
       const result = schema.safeParse(input);
       if (!result.success) { console.error(result.error.format()); }
   - For coercion issues, check if input matches expected type after using z.coerce.*
   - For recursive schemas, verify that z.lazy(() => schema) is used to prevent infinite recursion.

Code Examples:
   // String schema with trim and email validation
   const emailSchema = z.string().trim().email({ message: "Invalid email address" });
   emailSchema.parse(" test@example.com ");

   // Object schema with optional field
   const userSchema = z.object({
     username: z.string(),
     age: z.number().optional()
   }).strict();

   // Function schema
   const add = z.function()
     .args(z.number(), z.number())
     .returns(z.number())
     .implement((a, b) => a + b);
   const sum = add(2, 3); // returns 5

Configuration Options:
   - tsconfig.json: "strict": true
   - Datetime: { offset: true } or { local: true, precision: 3 }
   - IP validation: { version: "v4" } or { version: "v6" }


## Information Dense Extract
Zod: TypeScript-first schema validation. Key methods: z.string({options}), z.number(), z.boolean(), z.date(), z.object({}), z.array(), z.tuple([]), z.union([]), z.discriminatedUnion("key", []), z.coerce.string()/number()/boolean()/bigint()/date(). Core parsing: .parse(input): T; .parseAsync(input): Promise<T>; .safeParse(input): { success, data?, error? }; .safeParseAsync()/spa. Object modifications: .extend(), .merge(), .pick(), .omit(), .partial(), .deepPartial(), .required(), .passthrough(), .strict(), .strip(), .catchall(). Function schemas: .function().args(...).returns(...).implement(fn). Effects: .preprocess(fn, schema), .refine(validator, { message, path, code }), .superRefine. API full method signatures provided with exact parameter types and return types. Configuration options include datetime { offset, local, precision }, IP { version }, and custom error messages. Best practices: use safeParse for debugging, z.coerce for type conversion, z.lazy for recursive types, .strict() for object validation.

## Sanitised Extract
Table of Contents:
  1. Introduction
  2. Installation
  3. Basic Usage
  4. Primitives & Coercion
  5. Strings Validation
  6. Date/Time, Datetime, Date, Time
  7. IP Address & CIDR
  8. Number & BigInt Validations
  9. Booleans & Dates
  10. Enums (Zod and Native)
  11. Optional and Nullable Types
  12. Objects (shape, extend, merge, pick, omit, partial, deepPartial, required, passthrough, strict, strip, catchall)
  13. Arrays, Tuples, Unions, Discriminated Unions
  14. Records, Maps, Sets
  15. Intersections & Recursive Types
  16. Zod Effects (preprocess, refine, transform)
  17. Promises & Instanceof
  18. Function Schemas (args, returns, implement, parameters, returnType)
  19. Schema Methods (.parse, .parseAsync, .safeParse, .safeParseAsync, .spa, .refine)

Each section contains specific implementation details:
- Coercion functions: z.coerce.string() uses String(input), z.coerce.number() calls Number(input), etc.
- String validations include min, max, regex, email, url validations with custom messages.
- Date/Time validations include options such as { offset: true } and { precision: 3 }.
- Object schema methods allow field access via .shape and modifications with .extend, .merge.
- Function schemas enforce types with .args() and .returns(), and wrap with .implement() for auto-validation.
- Core API methods have explicit signatures: parse(input: unknown): T; parseAsync(input: unknown): Promise<T>; safeParse returns discriminated union with success flag and error details.

## Original Source
Zod Validation Library Documentation
https://github.com/colinhacks/zod

## Digest of ZOD

# ZOD

Date Retrieved: 2023-10-06

## Introduction
Zod is a TypeScript-first schema declaration and validation library. It provides a functional, chainable API to build schemas, automatically inferring static TypeScript types. It supports primitives, objects, arrays, unions, discriminated unions, recursive types, and more, with zero dependencies and full runtime validation.

## Installation

Requirements:
  - TypeScript 4.5+
  - tsconfig.json must have "strict": true

Installation commands:
  npm install zod
  yarn add zod
  deno add npm:zod
  bun add zod
  pnpm add zod

To install the canary version:
  npm install zod@canary

## Basic Usage

### Creating Schemas

Example: Create a string schema.

  import { z } from "zod";
  const mySchema = z.string();
  mySchema.parse("tuna"); // returns "tuna"
  mySchema.safeParse(12); // returns { success: false, error: ZodError }

Example: Object schema for a User.

  const User = z.object({ username: z.string() });
  User.parse({ username: "Ludwig" });
  type User = z.infer<typeof User>; // { username: string }

## Primitives and Coercion

Define primitives:
  z.string(), z.number(), z.bigint(), z.boolean(), z.date(), z.symbol(), z.undefined(), z.null(), z.void(), z.any(), z.unknown(), z.never()

Coercion:
  const schema = z.coerce.string();
  // Uses String(input) internally

## Strings Validation

String methods include:
  .max(n), .min(n), .length(n), .email(), .url(), .emoji(), .uuid(), .nanoid(), .cuid(), .cuid2(), .ulid(), .regex(regexp), .includes(substr), .startsWith(substr), .endsWith(substr), .datetime(), .ip(), .cidr(), .trim(), .toLowerCase(), .toUpperCase(), .date(), .time(), .duration(), .base64()

Custom error messages:
  z.string({ required_error: "Name is required", invalid_type_error: "Must be a string" });
  z.string().min(5, { message: "Must be 5 or more characters long" });

## Date and Time Validations

Datetime:
  z.string().datetime({ offset: false, local: false, precision: 'arbitrary' });
  Options: { offset: true }, { local: true }, { precision: 3 }

Date:
  z.string().date(); // Format: YYYY-MM-DD

Time:
  z.string().time({ precision: 3 }); // Format: HH:MM:SS[.s+]

## IP Addresses and Ranges

IP validation:
  z.string().ip({ version: "v4" | "v6" });

CIDR validation:
  z.string().cidr({ version: "v4" | "v6" });

## Numbers and BigInts

Number validations:
  z.number().gt(n), .gte(n), .lt(n), .lte(n), .int(), .positive(), .nonnegative(), .negative(), .nonpositive(), .multipleOf(n), .finite(), .safe()
  Custom messages can be provided as second parameter

BigInt validations:
  z.bigint().gt(5n), .gte(5n), .lt(5n), .lte(5n), .positive(), .nonnegative(), .negative(), .nonpositive(), .multipleOf(5n)

## Booleans and Dates

Booleans:
  z.boolean() with custom errors

Date objects:
  z.date().min(new Date("1900-01-01"), { message: "Too old" })
  z.date().max(new Date(), { message: "Too young!" })

Coercion to Date:
  const dateSchema = z.coerce.date();

## Enums

Zod enums:
  const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]);
  Use .enum to access autocompletion and .options to retrieve tuple.

Native enums:
  const FruitEnum = z.nativeEnum(Fruits);
  Supports numeric, string, and as const objects.

## Optional and Nullable Types

Optional:
  z.optional(schema) or schema.optional()
  Retrieve underlying type with .unwrap()

Nullable:
  z.nullable(schema) or schema.nullable()

## Objects

Object schema methods:
  .shape, .keyof, .extend, .merge, .pick, .omit, .partial, .deepPartial, .required, .passthrough, .strict, .strip, .catchall

Example:
  const Dog = z.object({ name: z.string(), age: z.number() });
  Dog.extend({ breed: z.string() });

## Arrays, Tuples, and Unions

Arrays:
  z.array(schema) or schema.array()
  Methods: .nonempty(), .min(n), .max(n), .length(n), .element

Tuples:
  z.tuple([z.string(), z.number(), ...])
  With variadic: .rest(schema)

Unions:
  z.union([schema1, schema2]) or schema.or(otherSchema)
  Discriminated unions with z.discriminatedUnion("key", [ ... ])

## Records, Maps, and Sets

Records:
  z.record(z.string(), schema)

Maps:
  z.map(keySchema, valueSchema)

Sets:
  z.set(schema); Methods: .nonempty(), .min(n), .max(n), .size(n)

## Intersections and Recursive Types

Intersections:
  z.intersection(schemaA, schemaB) or schemaA.and(schemaB)

Recursive types:
  Define recursively with z.lazy(() => schema) and extend base schemas

## Zod Effects and JSON Types

ZodEffects for transforms, preprocess, and refine:
  z.preprocess(fn, schema)
  Example: const castToString = z.preprocess(val => String(val), z.string());

JSON validation snippet provided using z.lazy for recursive union of literal, array and record

## Promises and Instanceof

Promises:
  z.promise(schema) validates instance of Promise and chains .then validations.

Instanceof:
  z.instanceof(ClassName) ensures instance of a given class.

## Functions

Function schemas:
  z.function() creates a function schema.
  .args(...schemas) sets parameter schemas.
  .returns(schema) sets return schema.
  .implement(fn) wraps function with runtime validation.

Example:
  const trimmedLength = z.function().args(z.string()).returns(z.number()).implement((x) => x.trim().length);

Extract parameters:
  .parameters() returns tuple of parameter schemas
  .returnType() returns output schema

## Schema Methods

.parse(input: unknown): T
.parseAsync(input: unknown): Promise<T>
.safeParse(input: unknown): { success: boolean, data?: T, error?: ZodError }
.safeParseAsync(input: unknown): Promise<{ success: boolean, data?: T, error?: ZodError }>
.spa(input: unknown): Alias to safeParseAsync
.refine(validator: (data: T) => any, params?: { message?: string, path?: (string | number)[], code?: string }): returns same schema

## Custom Schemas

z.custom<T>(validator?: (val: unknown) => boolean, errorMessage?: string) creates a schema for types not built-in.

## Troubleshooting and Best Practices

- Use .safeParse for error handling without try-catch.
- For coercion, prefer z.coerce.* methods over z.preprocess when possible.
- Validate unknown keys with .strict() to enforce schema integrity.
- For recursive types, manually define type hints and use z.lazy.
- For functions, use .implement() to auto-validate inputs and outputs.

## Attribution

Data Size: 826021 bytes
Found Links: 5644
Source: https://github.com/colinhacks/zod


## Attribution
- Source: Zod Validation Library Documentation
- URL: https://github.com/colinhacks/zod
- License: License: MIT
- Crawl Date: 2025-04-30T23:24:05.365Z
- Data Size: 826021 bytes
- Links Found: 5644

## Retrieved
2025-04-30
