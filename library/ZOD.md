# ZOD

## Crawl Summary
Zod offers a comprehensive TypeScript-first schema validation system with precise methods for creating scalar, object, array, tuple, union, and function schemas. Key methods include .parse, .safeParse, .parseAsync, .refine, .transform and coercion via .coerce. It supports recursive types with z.lazy(), detailed validations for strings (email, uuid, datetime, etc.), numbers (gt, lt, multipleOf), and complex objects (.extend, .merge, .pick, .omit), delivering actionable specifications and complete API method signatures.

## Normalised Extract
Table of Contents:
1. Installation & Requirements
   - Command: npm install zod | yarn add zod | bun add zod | pnpm add zod
   - tsconfig.json: { "compilerOptions": { "strict": true } }
2. Primitive Schemas & Coercion
   - Schemas: z.string(), z.number(), z.boolean(), etc.
   - Coercion: z.coerce.string() uses String(input), z.coerce.number() uses Number(input), etc.
3. Literal & String Validations
   - z.literal("value"), z.string().min(5, { message: "Min 5 characters" })
   - Methods include .max(), .length(), .email(), .url(), .regex(), .trim(), .toLowerCase(), .toUpperCase()
4. DateTime, Date, Time, and IP Validations
   - z.string().datetime({ offset: true, precision: 3, local: false })
   - z.string().date() and z.string().time({ precision: 3 })
   - IP: z.string().ip({ version: "v4" }), CIDR: z.string().cidr({ version: "v6" })
5. Number & BigInt Validations
   - z.number().gt(5), .gte(5), .lt(5), .lte(5), .int(), .positive()
   - z.bigint().gt(5n), multipleOf(5n)
6. Object Schemas
   - Creation: z.object({ key: z.string() })
   - Extensions: .extend({ extra: z.string() }), .merge(otherSchema)
   - Modifiers: .pick({ key: true }), .omit({ key: true }), .partial(), .deepPartial(), .required(), .passthrough(), .strict(), .strip(), .catchall(z.number())
7. Arrays & Tuples
   - Arrays: z.array(z.string()) or z.string().array() with .nonempty(), .min(5), .max(5), .length(5)
   - Tuples: z.tuple([z.string(), z.number()]) with .rest(z.number())
8. Unions & Discriminated Unions
   - Unions: z.union([z.string(), z.number()]) or z.string().or(z.number())
   - Discriminated: z.discriminatedUnion("status", [z.object({ status: z.literal("success"), data: z.string() }), z.object({ status: z.literal("failed"), error: z.instanceof(Error) })])
9. Recursive Schemas & ZodEffects
   - Recursive: z.lazy(() => schema.array()) with manual type hints
   - Effects: .refine(() => boolean, { message: "Error message" }), .transform()
10. Promise, Instanceof, and Function Schemas
    - Promise: z.promise(z.number())
    - Instance: z.instanceof(ClassName)
    - Function: z.function().args(z.string(), z.number()).returns(z.boolean()).implement(fn)
    - Extract input/output: .parameters(), .returnType()
11. Preprocess & Custom Schemas
    - Preprocess: z.preprocess((val) => String(val), z.string())
    - Custom: z.custom<`${number}px`>((val) => typeof val === "string" ? /^\d+px$/.test(val) : false, "Invalid px format")
12. Schema Methods (API)
    - .parse(data: unknown): T
    - .parseAsync(data: unknown): Promise<T>
    - .safeParse(data: unknown): { success: boolean, data?: T, error?: ZodError }
    - .refine(validator: (data: T) => any, { message?: string, path?: (string | number)[] })
    - .coerce methods for primitives


## Supplementary Details
Configuration Details:
- tsconfig.json must include "strict": true for TypeScript projects.
- Installation commands include: npm install zod, yarn add zod, bun add zod, pnpm add zod.
- Coercion uses built-in JavaScript constructors: String(), Number(), Boolean(), new Date(), BigInt().

API Methods & Parameters:
1. parse(data: unknown): T
   - Throws ZodError on validation failure.
2. parseAsync(data: unknown): Promise<T>
   - Used with async validations and transforms.
3. safeParse(data: unknown): { success: boolean; data?: T; error?: ZodError }
   - Returns a discriminated union for error handling.
4. refine(validator: (data: T) => any, params?: { message?: string; path?: (string | number)[] })
   - Use to add custom validation logic, must return truthy value.
5. Coercion: z.coerce.string(), z.coerce.number(), etc, automatically convert inputs.

Implementation Patterns:
- Object schema extension: Use .extend() to add or overwrite fields.
- Array validations: Use .nonempty() and .min(n) for length constraints.
- Function schemas: Define inputs and outputs using .args(...).returns(...) and implement with .implement(fn) for automatic validation on call.
- Recursive schemas: Use z.lazy(() => schema) to defer schema resolution and manually define types.

Troubleshooting Procedures:
- Use safeParse() instead of parse() to capture validation errors without exceptions.
- Inspect ZodError issues array for detailed error paths and custom messages.
- In recursive scenarios, ensure proper type hints are provided to avoid TypeScript inference issues.
- Validate configuration: Confirm tsconfig.json strict mode and correct dependency installations.


## Reference Details
API Specifications and SDK Method Signatures:

1. Basic Schemas:
   - z.string(): Returns ZodString
       Methods: .min(min: number, options?: { message?: string }), .max(max: number, options?: { message?: string }), .email(options?: { message?: string }), .url(options?: { message?: string }), .regex(pattern: RegExp, options?: { message?: string })
   - z.number(): Returns ZodNumber
       Methods: .gt(n: number), .gte(n: number), .lt(n: number), .lte(n: number), .int(), .positive(), .nonnegative(), .multipleOf(step: number, options?: { message?: string })
   - z.boolean(), z.date(), z.bigint(), z.symbol(), z.undefined(), z.null(), z.void()

2. Coercion:
   - z.coerce.string(), z.coerce.number(), z.coerce.boolean(), z.coerce.date(), z.coerce.bigint()
   Each converts input using respective constructor (e.g., Number(input))

3. Object Schemas:
   - z.object({ key: ZodType, ... })
       Methods: .extend({ additionalKey: ZodType }), .merge(anotherSchema), .pick({ key: true }), .omit({ key: true }), .partial(), .deepPartial(), .required(), .passthrough(), .strict(), .strip(), .catchall(ZodType)

4. Arrays & Tuples:
   - z.array(ZodType) or ZodType.array()
       Methods: .nonempty(options?: { message?: string }), .min(n: number), .max(n: number), .length(n: number)
   - z.tuple([ZodType, ZodType, ...])
       Use .rest(ZodType) to add variadic elements

5. Unions & Discriminated Unions:
   - z.union([schema1, schema2, ...])
       Alternatively: schema1.or(schema2)
   - z.discriminatedUnion(discriminator: string, options: ZodObject[]): Efficient union using discriminator field

6. Promises & Instances:
   - z.promise(ZodType): Validates an input Promise that resolves to T
   - z.instanceof(Class): Validates instance of a given class

7. Function Schemas:
   - z.function(): Returns a function schema
       Chain with .args(...ZodTypes) and .returns(ZodType)
       Implement with .implement((...args) => { ... })
       Extract types using .parameters() and .returnType()

8. Preprocess and Custom Schemas:
   - z.preprocess((input: unknown) => transformedInput, ZodType)
   - z.custom<Type>((input: unknown) => boolean, "custom error message")

9. Schema Methods:
   - .parse(data: unknown): T
   - .parseAsync(data: unknown): Promise<T>
   - .safeParse(data: unknown): { success: true, data: T } | { success: false, error: ZodError }
   - .refine(validator: (data: T) => any, params?: { message?: string, path?: (string|number)[] })

Code Example:
--------------------------------------------------
import { z } from "zod";

const userSchema = z.object({
  username: z.string(),
  email: z.string().email({ message: "Invalid email address" })
});

const result = userSchema.safeParse({ username: "alice", email: "alice@example.com" });
if (!result.success) {
  console.error(result.error.format());
} else {
  console.log(result.data);
}
--------------------------------------------------

Troubleshooting:
- For validation errors, use .safeParse to prevent exceptions and inspect result.error.issues for detailed messages.
- Ensure TypeScript tsconfig.json has strict mode enabled.
- In recursive schemas, use z.lazy and provide manual type annotations to overcome inference limitations.


## Information Dense Extract
Zod; npm install zod; TS strict mode required; APIs: z.string(), z.number(), z.boolean(), z.date(), z.object({}), z.array(), z.tuple([]), z.union([]), z.discriminatedUnion(), z.promise(), z.function().args(...).returns(...).implement(); Methods: .parse(data:unknown):T, .parseAsync(data:unknown):Promise<T>, .safeParse(data:unknown):{success, data?, error?}, .refine(fn, {message, path}), .coerce.string()/number()/boolean(); Object modifiers: .extend(), .merge(), .pick(), .omit(), .partial(), .deepPartial(), .required(), .passthrough(), .strict(), .strip(), .catchall(); Function schema extraction: .parameters(), .returnType(); Preprocess using z.preprocess(fn, schema); Custom schema via z.custom<Type>(fn, "error"); Code pattern: import { z } from 'zod'; const schema = z.object({ key: z.string() }); schema.safeParse(data); Troubleshoot using safeParse and inspect ZodError. Recursive schemas via z.lazy(() => schema);

## Sanitised Extract
Table of Contents:
1. Installation & Requirements
   - Command: npm install zod | yarn add zod | bun add zod | pnpm add zod
   - tsconfig.json: { 'compilerOptions': { 'strict': true } }
2. Primitive Schemas & Coercion
   - Schemas: z.string(), z.number(), z.boolean(), etc.
   - Coercion: z.coerce.string() uses String(input), z.coerce.number() uses Number(input), etc.
3. Literal & String Validations
   - z.literal('value'), z.string().min(5, { message: 'Min 5 characters' })
   - Methods include .max(), .length(), .email(), .url(), .regex(), .trim(), .toLowerCase(), .toUpperCase()
4. DateTime, Date, Time, and IP Validations
   - z.string().datetime({ offset: true, precision: 3, local: false })
   - z.string().date() and z.string().time({ precision: 3 })
   - IP: z.string().ip({ version: 'v4' }), CIDR: z.string().cidr({ version: 'v6' })
5. Number & BigInt Validations
   - z.number().gt(5), .gte(5), .lt(5), .lte(5), .int(), .positive()
   - z.bigint().gt(5n), multipleOf(5n)
6. Object Schemas
   - Creation: z.object({ key: z.string() })
   - Extensions: .extend({ extra: z.string() }), .merge(otherSchema)
   - Modifiers: .pick({ key: true }), .omit({ key: true }), .partial(), .deepPartial(), .required(), .passthrough(), .strict(), .strip(), .catchall(z.number())
7. Arrays & Tuples
   - Arrays: z.array(z.string()) or z.string().array() with .nonempty(), .min(5), .max(5), .length(5)
   - Tuples: z.tuple([z.string(), z.number()]) with .rest(z.number())
8. Unions & Discriminated Unions
   - Unions: z.union([z.string(), z.number()]) or z.string().or(z.number())
   - Discriminated: z.discriminatedUnion('status', [z.object({ status: z.literal('success'), data: z.string() }), z.object({ status: z.literal('failed'), error: z.instanceof(Error) })])
9. Recursive Schemas & ZodEffects
   - Recursive: z.lazy(() => schema.array()) with manual type hints
   - Effects: .refine(() => boolean, { message: 'Error message' }), .transform()
10. Promise, Instanceof, and Function Schemas
    - Promise: z.promise(z.number())
    - Instance: z.instanceof(ClassName)
    - Function: z.function().args(z.string(), z.number()).returns(z.boolean()).implement(fn)
    - Extract input/output: .parameters(), .returnType()
11. Preprocess & Custom Schemas
    - Preprocess: z.preprocess((val) => String(val), z.string())
    - Custom: z.custom<'${number}px'>((val) => typeof val === 'string' ? /^'d+px$/.test(val) : false, 'Invalid px format')
12. Schema Methods (API)
    - .parse(data: unknown): T
    - .parseAsync(data: unknown): Promise<T>
    - .safeParse(data: unknown): { success: boolean, data?: T, error?: ZodError }
    - .refine(validator: (data: T) => any, { message?: string, path?: (string | number)[] })
    - .coerce methods for primitives

## Original Source
Zod Validation Library Documentation
https://github.com/colinhacks/zod

## Digest of ZOD

# ZOD

Retrieved Date: 2023-10-06

## Overview
Zod is a TypeScript-first schema declaration and validation library that provides a concise, chainable, and functional interface for building and validating data schemas at runtime. It is designed to eliminate duplicative type declarations by automatically inferring static types from a single schema declaration.

## Installation & Requirements
- Install via npm, yarn, bun, or pnpm (e.g., npm install zod or npm install zod@canary for canary builds).
- Requires TypeScript 4.5+ and enabling strict mode in tsconfig.json ("strict": true).

## Basic Usage Examples

### Creating a Simple String Schema

import { z } from "zod";

// Create a string schema
const mySchema = z.string();

// Parsing
mySchema.parse("tuna");  // returns "tuna"
mySchema.safeParse(12);    // returns { success: false, error: ZodError }

### Creating an Object Schema

import { z } from "zod";

const User = z.object({
  username: z.string()
});

User.parse({ username: "Ludwig" });

type User = z.infer<typeof User>;  // { username: string }

## Technical Topics

1. Installation & Requirements
   - npm install zod
   - tsconfig.json must include "strict": true

2. Primitive Schemas & Coercion
   - Schemas: z.string(), z.number(), z.bigint(), z.boolean(), z.date(), etc.
   - Coercion: z.coerce.string(), z.coerce.number(), z.coerce.boolean(), etc. Use built-in constructors (String(), Number(), Boolean(), new Date()) for coercion.

3. Literals & String Validations
   - Literal schemas: z.literal("tuna"), z.literal(12)
   - String validations include: .min(), .max(), .length(), .email(), .url(), .regex(), .trim(), .toLowerCase(), .toUpperCase()
   - Custom error messages can be passed as second argument to validation methods.

4. Datetime, Date, and Time Validations
   - Datetime: z.string().datetime({ offset: true, precision: <number>, local: true })
   - Date: z.string().date() validates YYYY-MM-DD
   - Time: z.string().time({ precision: <number> }) validates HH:MM:SS[.s+]

5. IP Address and CIDR Validations
   - IP: z.string().ip({ version: "v4" or "v6" })
   - CIDR: z.string().cidr({ version: "v4" or "v6" })

6. Number and BigInt Validations
   - Number: z.number() supports .gt(), .gte(), .lt(), .lte(), .int(), .positive(), .nonnegative(), .multipleOf()
   - BigInt: z.bigint() supports analogous methods using bigint literals (e.g., 5n)

7. Object Schemas
   - Create objects: z.object({ key: z.string(), ... })
   - Methods: .extend(), .merge(), .pick(), .omit(), .partial(), .deepPartial(), .required(), .passthrough(), .strict(), .strip(), .catchall()

8. Arrays, Tuples, and Unions
   - Arrays: z.array(type) or type.array(); supports .nonempty(), .min(), .max(), .length()
   - Tuples: z.tuple([types]) with .rest() for variadic elements
   - Unions: z.union([schemas]) or using .or(); discriminated unions via z.discriminatedUnion(discriminator, options)

9. Recursive Schemas & ZodEffects
   - Recursive Types: Use z.lazy(() => schema.array()) with manual type hints
   - ZodEffects: Wraps methods like .refine, .transform, and supports preprocessing

10. Promises, Instanceof, and Function Schemas
    - Promise validation: z.promise(innerType)
    - Instance validation: z.instanceof(Class)
    - Function schemas: Create with z.function(), chain .args(...).returns(...).implement(fn); extract types with .parameters() and .returnType()

11. Preprocess and Custom Schemas
    - Preprocess: z.preprocess((val) => transformedVal, schema);
    - Custom schemas: z.custom<Type>((val) => <boolean>, "error message")

12. Schema Methods (API Specifications)
    - .parse(data: unknown): T
    - .parseAsync(data: unknown): Promise<T>
    - .safeParse(data: unknown): { success: true; data: T; } | { success: false; error: ZodError }
    - .safeParseAsync / .spa(data: unknown)
    - .refine(validator: (data: T) => any, params?: { message?: string, path?: (string | number)[] })


## Attribution
- Source: Zod Validation Library Documentation
- URL: https://github.com/colinhacks/zod
- License: License: MIT
- Crawl Date: 2025-04-27T17:31:19.585Z
- Data Size: 1046416 bytes
- Links Found: 6658

## Retrieved
2025-04-27
