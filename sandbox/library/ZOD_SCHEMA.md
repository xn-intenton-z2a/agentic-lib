# ZOD_SCHEMA

## Crawl Summary
Installation via npm with strict TypeScript 4.5+; use of z.string, z.number, z.boolean, etc. for primitives with coercion support. Schema creation covers objects, arrays, tuples, unions (including discriminated unions), recursive types via z.lazy, and function schemas with .args and .returns. Advanced API methods (.parse, .safeParse, .parseAsync, .refine) are provided with complete type inference. Includes custom error messages, JSON schema, record, map, set validations, and best practice configurations like enabling strict mode in tsconfig.

## Normalised Extract
Table of Contents:
  1. Installation
    - npm install zod, requirements (TypeScript 4.5+, strict mode).
  2. Basic Usage
    - Creating string schema: z.string(), parse and safeParse methods.
  3. Primitive Schemas & Coercion
    - z.string(), z.number(), etc; coercion methods like z.coerce.string() using String(input).
  4. Literals and String Validations
    - z.literal('tuna'), string validations (.min, .max, .email, .regex).
  5. Date and Time Validations
    - z.string().date(), .time({ precision: N }), .datetime({ offset: true, local: true}).
  6. Number and BigInt Schemas
    - z.number().gt(5), .int(), and similar for z.bigint() with n suffix.
  7. Object Schemas & Transformations
    - z.object({ ... }), with .extend, .merge, .pick, .omit, .partial, .required, .passthrough, .strict, .strip, .catchall.
  8. Array and Tuple Schemas
    - z.array(schema) or schema.array(), tuple: z.tuple([...]) plus .rest for variadic.
  9. Unions and Discriminated Unions
    - z.union, .or, and z.discriminatedUnion with a discriminator key.
  10. Records, Maps, and Sets
    - z.record(keyType, valueType), z.map, z.set with .nonempty, .min, .max, .size.
  11. Intersections & Recursive Types
    - z.intersection(A, B) and recursive definitions using z.lazy.
  12. Advanced Schemas & Effects
    - z.ZodEffects for .refine, .transform, and z.preprocess for input transformation.
  13. Function Schemas
    - z.function().args(...).returns(...), .implement, and methods parameters() and returnType().

Each topic includes method signatures, validation rules, and configuration options. Use these extracted details for immediate implementation of schema validation in TypeScript projects.

## Supplementary Details
Installation requires TypeScript 4.5+ with strict mode enabled in tsconfig.json. Specific configuration options include:
- Coercion: z.coerce.string() calls String(input); similar for number, boolean, bigint, date.
- Date/Time validation parameters: optional offset, local flag, and precision (e.g., z.string().datetime({ offset: true, precision: 3 })).
- Object schema methods: .extend({ newField: z.string() }) adds or overwrites fields; .partial() makes fields optional; .required() reverses optional state; .passthrough() retains unknown keys; .strict() disallows unknown keys; .catchall(schema) validates extra keys.
- Function schema: z.function().args(z.string(), z.number()).returns(z.boolean()) defines a function with input and output types.
- API methods: parse(data: unknown): T, parseAsync(data: unknown): Promise<T>, safeParse(data: unknown): { success: boolean; data?: T; error?: ZodError }.
- Best practices include using safeParse to prevent exceptions, employing z.lazy for recursive schemas, and using .implement() to wrap validated function implementations.


## Reference Details
API Specifications:
1. z.string(): ZodString
   - Methods: .min(n: number, options?: { message?: string }), .max(n: number, options?: { message?: string }), .email(options?: { message?: string }), .regex(pattern: RegExp, options?: { message?: string }), .datetime(options?: { offset?: boolean, local?: boolean, precision?: number, message?: string })
2. z.number(): ZodNumber
   - Methods: .gt(n: number, options?: { message?: string }), .gte(n: number, options?: { message?: string }), .lt(n: number, options?: { message?: string }), .lte(n: number, options?: { message?: string }), .int(), .positive(), .nonnegative(), .negative(), .nonpositive(), .multipleOf(n: number)
3. z.object(schema: { [key: string]: ZodTypeAny }): ZodObject
   - Methods: .extend(extendShape: { [key: string]: ZodTypeAny }), .merge(another: ZodObject), .pick(pickShape: { [key: string]: true }), .omit(omitShape: { [key: string]: true }), .partial(fields?: { [key: string]: true }), .deepPartial(), .required(fields?: { [key: string]: true }), .passthrough(), .strict(), .strip(), .catchall(catchall: ZodTypeAny)
4. z.array(itemSchema: ZodTypeAny): ZodArray
   - Methods: .nonempty(options?: { message?: string }), .min(n: number), .max(n: number), .length(n: number)
5. z.tuple([ ... ]): ZodTuple
   - Methods: .rest(schema: ZodTypeAny)
6. z.union([ schemas ]): ZodUnion
   - Alternative: schema.or(anotherSchema)
7. z.discriminatedUnion(discriminator: string, options: ZodObject[]): ZodDiscriminatedUnion
8. z.map(keySchema: ZodTypeAny, valueSchema: ZodTypeAny): ZodMap
9. z.set(valueSchema: ZodTypeAny): ZodSet
   - Methods: .nonempty(), .min(n: number), .max(n: number), .size(n: number)
10. z.intersection(schemaA: ZodTypeAny, schemaB: ZodTypeAny): ZodIntersection
11. z.lazy(getSchema: () => ZodTypeAny): ZodLazy
12. z.function(): ZodFunction
    - Methods: .args(...schemas: ZodTypeAny[]), .returns(returnSchema: ZodTypeAny), .implement(fn: Function), .parameters(), .returnType()
13. Global methods: .parse(data: unknown): T, .parseAsync(data: unknown): Promise<T>, .safeParse(data: unknown): { success: boolean, data?: T, error?: ZodError }, .refine(validator: (data: T) => any, options?: { message?: string, path?: (string|number)[] })

Implementation Patterns:
- Use z.coerce for primitive conversion (e.g., z.coerce.number() converts input using Number(input)).
- Build recursive schemas with z.lazy to prevent circular dependencies.
- Wrap functions using .implement() to auto-validate input and output types.

Code Example:
import { z } from "zod";

const User = z.object({ username: z.string(), age: z.number().int() });

const createUser = z.function()
  .args(User)
  .returns(z.object({ id: z.string(), username: z.string() }))
  .implement((user) => {
    // Unique id generator could be added here
    return { id: "unique-id", username: user.username };
  });

// Calling function with validation
const result = createUser({ username: "Alice", age: 30 });

Troubleshooting Procedures:
- If parse fails: use safeParse and inspect result.error for detailed ZodError object.
- For asynchronous validations: ensure using parseAsync and handling Promise rejections.
- Validate configuration: tsconfig.json must have "strict": true to ensure full type inference.
- Command for testing: npm run test (assuming tests include validation cases).


## Information Dense Extract
TypeScript 4.5+; strict mode required. Use z.string(), z.number(), etc. Coercion via z.coerce.string() calls String(input). API: parse(data: unknown): T, parseAsync, safeParse; object schemas (extend, merge, pick, omit, partial, required, passthrough, strict, catchall); arrays with nonempty/min/max/length; tuples with fixed elements and .rest; unions via z.union or .or; discriminated unions for keyed objects; records with z.record; maps with z.map; sets with z.set and size constraints; intersections via intersection or merge; recursive schemas implemented with z.lazy; advanced effects using .refine, .transform, .preprocess; function schemas defined using function().args(...).returns(...) and .implement(). Detailed method signatures provided for each schema type, with customization (custom error messages, precision options for datetime/time) and best practices (use safeParse and strict mode).

## Sanitised Extract
Table of Contents:
  1. Installation
    - npm install zod, requirements (TypeScript 4.5+, strict mode).
  2. Basic Usage
    - Creating string schema: z.string(), parse and safeParse methods.
  3. Primitive Schemas & Coercion
    - z.string(), z.number(), etc; coercion methods like z.coerce.string() using String(input).
  4. Literals and String Validations
    - z.literal('tuna'), string validations (.min, .max, .email, .regex).
  5. Date and Time Validations
    - z.string().date(), .time({ precision: N }), .datetime({ offset: true, local: true}).
  6. Number and BigInt Schemas
    - z.number().gt(5), .int(), and similar for z.bigint() with n suffix.
  7. Object Schemas & Transformations
    - z.object({ ... }), with .extend, .merge, .pick, .omit, .partial, .required, .passthrough, .strict, .strip, .catchall.
  8. Array and Tuple Schemas
    - z.array(schema) or schema.array(), tuple: z.tuple([...]) plus .rest for variadic.
  9. Unions and Discriminated Unions
    - z.union, .or, and z.discriminatedUnion with a discriminator key.
  10. Records, Maps, and Sets
    - z.record(keyType, valueType), z.map, z.set with .nonempty, .min, .max, .size.
  11. Intersections & Recursive Types
    - z.intersection(A, B) and recursive definitions using z.lazy.
  12. Advanced Schemas & Effects
    - z.ZodEffects for .refine, .transform, and z.preprocess for input transformation.
  13. Function Schemas
    - z.function().args(...).returns(...), .implement, and methods parameters() and returnType().

Each topic includes method signatures, validation rules, and configuration options. Use these extracted details for immediate implementation of schema validation in TypeScript projects.

## Original Source
Zod Schema Validation
https://github.com/colinhacks/zod

## Digest of ZOD_SCHEMA

# Zod Schema

Date Retrieved: 2023-10-06

This document contains the complete technical details for Zod, a TypeScript-first schema declaration and validation library. The content includes exact method signatures, configuration details, code examples, and API specifications as provided in the source. Developers can use these details for high-impact implementation scenarios.

## Installation
- Prerequisite: TypeScript 4.5+ and strict mode enabled in tsconfig.json.
- NPM: npm install zod
- Canary Version: npm install zod@canary

## Basic Usage
- Create a simple string schema:
  - Code: import { z } from "zod";
  - Schema: const mySchema = z.string();
  - Parse Example: mySchema.parse("tuna");
  - Safe Parse Example: mySchema.safeParse(12) returns error details.

## Primitives and Coercion
- Primitive schemas: z.string(), z.number(), z.boolean(), etc.
- Coercion usage: const schema = z.coerce.string();
  - Underlying call: String(input)

## Literal and String Validations
- Literal: const tuna = z.literal("tuna");
- String validations: .min, .max, .email, .url, .regex, .datetime, etc.
- Custom error messages can be provided as an options object.

## Date/Time, Numbers, and BigInts
- Date and Time validations: z.string().date(), z.string().time({ precision: 3 }), z.string().datetime({ offset: true })
- Numbers: z.number().gt(5), .lt(5), .int(), etc. Custom error messages available.
- BigInts: Similar methods with n suffix like 5n.

## Objects and Transformations
- Object schema creation: z.object({ name: z.string(), age: z.number() });
- Methods: .shape, .keyof, .extend, .merge, .pick, .omit, .partial, .deepPartial, .required, .passthrough, .strict, .strip, .catchall.

## Arrays and Tuples
- Arrays: z.array(z.string()) or z.string().array(), with validations like .nonempty, .min, .max, .length.
- Tuples: z.tuple([z.string(), z.number(), ...]) and support for variadic with .rest.

## Unions and Discriminated Unions
- Union Usage: const unionSchema = z.union([z.string(), z.number()]); or z.string().or(z.number());
- Discriminated unions: z.discriminatedUnion("status", [ ... ]) for fast evaluation.

## Records, Maps, and Sets
- Records: z.record(z.string(), User) with inferred type Record<string, User>.
- Maps: z.map(z.string(), z.number())
- Sets: z.set(z.string()) with methods .nonempty, .min, .max, .size.

## Intersections and Recursive Schemas
- Intersection: z.intersection(schemaA, schemaB) or A.merge(B)
- Recursive types: use z.lazy(() => schema.array()) pattern with manual type hinting.

## Advanced Schema Types
- Effects: z.ZodEffects with .refine, .transform, and .preprocess.
- Custom Schemas: z.custom<T>(validatorFunction, errorMessage)
- JSON schema: Implementation for validating JSON data with z.lazy and union of supported types.

## Function Schemas
- Declaration: z.function().args(z.string(), z.number()).returns(z.boolean());
- Method .implement to wrap functions with input/output validation.
- Retrieve parameters: myFunction.parameters() returns tuple schema.

## API Methods
- parse(data: unknown): T
- parseAsync(data: unknown): Promise<T>
- safeParse(data: unknown): { success: boolean; data?: T; error?: ZodError }
- refine(validator: (data: T) => any, options?: { message?: string, path?: (string | number)[] })

## Troubleshooting & Best Practices
- Use safeParse for non-throwing validation.
- Enable strict mode in tsconfig for optimal type inference.
- For asynchronous validations, always use parseAsync or spa for chain validations.

## Attribution & Data Size
- Data Size: 772371 bytes
- URL: https://github.com/colinhacks/zod


## Attribution
- Source: Zod Schema Validation
- URL: https://github.com/colinhacks/zod
- License: License: MIT
- Crawl Date: 2025-05-01T19:18:33.387Z
- Data Size: 772371 bytes
- Links Found: 5144

## Retrieved
2025-05-01
