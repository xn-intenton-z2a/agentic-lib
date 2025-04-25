# ZOD_SCHEMA

## Crawl Summary
Crawled content returned no data directly. Extraction relies on established Zod API details: schema creation via z.string, z.number, etc.; validation methods parse and safeParse with detailed error output; advanced schema composition through union, intersection, enum, and refinement functionality including API method signatures and parameter specifics.

## Normalised Extract
Table of Contents:
1. Basic Schemas
   - z.string(): No parameters, returns ZodString instance
   - z.number(): No parameters, returns ZodNumber instance
   - z.boolean(): No parameters, returns ZodBoolean instance
2. Object and Array Schemas
   - z.object({ key: schema, ... }): Accepts object mapping where each key is assigned a schema
   - z.array(schema): Validates all elements in an array using the provided schema
3. Validation Methods
   - parse(input: unknown): Returns type T on success, throws ZodError on failure
   - safeParse(input: unknown): Returns an object { success: boolean, data?: T, error?: ZodError }
4. Advanced Features
   - z.union([schema1, schema2, ...]): Validates input against any schema in list
   - z.intersection(schema1, schema2): Merges two schemas into one unified schema
   - z.enum(["A", "B", ...]): Creates an enum type from string array
   - Refinement using .refine(callback, { message, path }): Implements custom validations with precise error messages
   - Default and Optional Configurations: .default(value), .optional(), .nullable()
Detailed Items:
Basic Schemas: Direct instantiation of type validators
Object and Array Schemas: Structured validation using key-based and list-based schema definitions
Validation Methods: Direct use of parse and safeParse for error handling
Advanced Features: Use union, intersection, enum, and refine for complex scenarios; custom error mapping via setErrorMap method

## Supplementary Details
Technical Specifications and Implementation Details:
1. z.string() - API: z.string() returns a ZodString with prototype methods parse(input: unknown): string and safeParse(input: unknown): { success: boolean, data?: string, error?: ZodError }.
2. z.number() - API: z.number() returns a ZodNumber instance with parse(input: unknown): number and safeParse function.
3. z.object() - API: z.object({ key: schema, ... }) takes an object where each value is a Zod schema; returns a ZodObject with method parse(input: unknown): { key: value } matching schema types.
4. z.array() - API: z.array(schema) creates an array schema; parse(input: unknown): T[] validates input array elements.
5. Validation Methods - parse and safeParse:
   - parse(input: unknown): T; may throw a ZodError that includes detailed error paths and messages.
   - safeParse(input: unknown): returns { success: boolean, data?: T, error?: ZodError } without throwing.
6. Advanced Refinements and Configurations:
   - .refine((val: T) => boolean, { message: string, path: string[] }): adds custom conditional validations
   - .default(value): assigns a default value when input is missing
   - .optional() and .nullable(): marks the schema field as optional (undefined) or nullable (null allowed)
   - .union([...]) and .intersection(a, b): combine multiple schemas; union validates if any schema passes, intersection requires all to pass
7. Error Handling and Best Practices:
   - Use safeParse to maintain flow control
   - Configure custom error responses using .setErrorMap(customMapFunction) where customMapFunction receives a context and returns { message: string }.
   - Recommended to chain .default, .optional when schema field values may be absent.

## Reference Details
Full API Specifications:
- z.string(): Signature: () => ZodString. Methods: parse(input: unknown): string; safeParse(input: unknown): { success: boolean, data?: string, error?: ZodError }.
- z.number(): Signature: () => ZodNumber. Methods: parse(input: unknown): number; safeParse(input: unknown): { success: boolean, data?: number, error?: ZodError }.
- z.boolean(): Signature: () => ZodBoolean. Methods: parse(input: unknown): boolean; safeParse(input: unknown): { success: boolean, data?: boolean, error?: ZodError }.
- z.object(): Signature: <T>(shape: T) => ZodObject<T>. Methods: parse(input: unknown): T; safeParse(input: unknown): { success: boolean, data?: T, error?: ZodError }.
- z.array(): Signature: <T>(schema: ZodType<T>) => ZodArray<T>. Methods: parse(input: unknown): T[]; safeParse(input: unknown): { success: boolean, data?: T[], error?: ZodError }.
- parse(input: unknown): T
  - Throws: ZodError containing error details with path and message.
- safeParse(input: unknown): { success: boolean, data?: T, error?: ZodError }
- Advanced Methods:
  - z.union(schemas: [ZodType<any>, ...]): Validates input against any one of the provided schemas.
  - z.intersection(a: ZodType<any>, b: ZodType<any>): Returns a schema that requires input to pass both validations.
  - z.enum(values: string[]): Returns a ZodEnum; valid values limited to provided array entries.
  - Refinement: refine(callback: (val: T) => boolean, { message?: string, path?: string[] }): Enforces custom validations with specific error messages.
Example Implementation Pattern:
  const schema = z.object({
    name: z.string(),
    age: z.number().optional(),
  });
  const result = schema.safeParse(input);
  if (!result.success) {
    // Handle errors by inspecting result.error.errors for field-specific issues
  }
Configuration Options:
  - .default(value): sets a fallback default when data is undefined
  - .optional() and .nullable(): flag property as not strictly required
  - .setErrorMap(customMap): customizes the mapping of error contexts to error messages.
Troubleshooting Procedures:
  - Use try-catch around parse() to capture thrown ZodError.
  - Inspect error.errors array for detailed validation errors including paths and custom messages.
  - Validate schema configuration and chaining order if default values and optional flags do not work as expected.

## Information Dense Extract
z.string(): ZodString; z.number(): ZodNumber; z.boolean(); z.object({}); z.array(schema); parse(input:unknown): T throws ZodError; safeParse(input:unknown):{success:boolean,data?:T,error?:ZodError}; z.union([...]); z.intersection(a,b); z.enum([...]); refine(callback, {message, path}); .default(value), .optional(), .nullable(); setErrorMap(customMap); API: full method signatures with parameter types and error details; implementation pattern: schema creation, parse vs safeParse, error handling via try-catch and error.errors inspection

## Sanitised Extract
Table of Contents:
1. Basic Schemas
   - z.string(): No parameters, returns ZodString instance
   - z.number(): No parameters, returns ZodNumber instance
   - z.boolean(): No parameters, returns ZodBoolean instance
2. Object and Array Schemas
   - z.object({ key: schema, ... }): Accepts object mapping where each key is assigned a schema
   - z.array(schema): Validates all elements in an array using the provided schema
3. Validation Methods
   - parse(input: unknown): Returns type T on success, throws ZodError on failure
   - safeParse(input: unknown): Returns an object { success: boolean, data?: T, error?: ZodError }
4. Advanced Features
   - z.union([schema1, schema2, ...]): Validates input against any schema in list
   - z.intersection(schema1, schema2): Merges two schemas into one unified schema
   - z.enum(['A', 'B', ...]): Creates an enum type from string array
   - Refinement using .refine(callback, { message, path }): Implements custom validations with precise error messages
   - Default and Optional Configurations: .default(value), .optional(), .nullable()
Detailed Items:
Basic Schemas: Direct instantiation of type validators
Object and Array Schemas: Structured validation using key-based and list-based schema definitions
Validation Methods: Direct use of parse and safeParse for error handling
Advanced Features: Use union, intersection, enum, and refine for complex scenarios; custom error mapping via setErrorMap method

## Original Source
Environment and Schema Management Documentation
https://zod.dev

## Digest of ZOD_SCHEMA

# ZOD DOCUMENTATION
Retrieved: 2023-10-16

# Overview
This document details the Zod environment and schema management library as defined on https://zod.dev. It provides complete API method signatures, configuration options, and implementation patterns.

# Technical Specifications

## Schema Creation
- z.string()  -> returns a ZodString instance
- z.number()  -> returns a ZodNumber instance
- z.boolean() -> returns a ZodBoolean instance
- z.object({ key: schema, ... }) -> creates an object schema with required key validations
- z.array(schema) -> validates arrays where each element is validated against the provided schema

## Validation Methods
- parse(input: unknown): T
  - Description: Parses and validates the input; throws an error if invalid
  - Returns: Parsed type T
- safeParse(input: unknown): { success: boolean, data?: T, error?: ZodError }
  - Description: Safely parses the input; returns success flag along with data or error

## Advanced Features & Compositions
- z.union([schema1, schema2, ...]) -> validates against multiple schemas
- z.intersection(schema1, schema2) -> combines two schemas into one
- z.enum(["Value1", "Value2", ...]) -> defines an enum based on provided string array
- .default(value) -> assigns a default value if input is undefined
- .optional() and .nullable() -> designate fields as optional or nullable
- .refine((val: T) => boolean, { message?: string, path?: string[] }) -> adds custom validation logic with specific error messaging

# Attribution
Source: https://zod.dev
Data Size: 0 bytes


## Attribution
- Source: Environment and Schema Management Documentation
- URL: https://zod.dev
- License: License: MIT License
- Crawl Date: 2025-04-25T00:00:40.241Z
- Data Size: 0 bytes
- Links Found: 0

## Retrieved
2025-04-25
