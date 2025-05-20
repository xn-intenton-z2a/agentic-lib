# ZOD_CORE

## Crawl Summary
Version: v4; import path: zod/v4; core bundle size: 2kb gzipped; zero external dependencies; key methods: parse, parseAsync, safeParse, safeParseAsync; error class ZodError with issues array; schema builders: z.string(), z.number(), z.object(); type utilities: z.infer, z.input, z.output; transforms and refinements available.

## Normalised Extract
Table of Contents:
1 Installation
2 Schema Definition
3 Parsing Methods
4 Error Handling
5 Async Methods
6 Type Utilities

1 Installation
  npm install zod

2 Schema Definition
  import { z } from "zod/v4"
  const Player = z.object({ username: z.string(), xp: z.number() })

3 Parsing Methods
  parse(input: unknown): T          // throws ZodError or returns T
  safeParse(input: unknown): SafeParseReturn<T> // { success: true; data: T } | { success: false; error: ZodError }

4 Error Handling
  catch ZodError; inspect err.issues array: each issue has expected, code, path, message

5 Async Methods
  parseAsync(input: unknown): Promise<T>
  safeParseAsync(input: unknown): Promise<SafeParseReturn<T>>

6 Type Utilities
  type In = z.input<typeof schema>
  type Out = z.output<typeof schema>
  type Infer = z.infer<typeof schema>

## Supplementary Details
Schema builders:
  z.string(): ZodString
  z.number(): ZodNumber
  z.boolean(): ZodBoolean
  z.object<Shape>(shape: Shape): ZodObject<Shape>
  z.array(schema: ZodType): ZodArray
  z.union([A, B, ...]): ZodUnion

Transforms and refinements:
  schema.transform<U>(fn: (val: InputType) => U): ZodEffects
  schema.refine(fn: (val: InputType) => boolean | Promise<boolean>, message?: string): ZodEffects

JSON Schema conversion:
  schema.toJSON(): JSONSchemaType


## Reference Details
// z.object
function object<Shape extends ZodRawShape>(shape: Shape): ZodObject<Shape, "strip", ZodTypeAny, { [K in keyof Shape]: infer<Shape[K]> }, { [K in keyof Shape]: output<Shape[K]> }>

// parse
method parse(input: unknown): OutputType
method safeParse(input: unknown): { success: true; data: OutputType } | { success: false; error: ZodError }

// async
method parseAsync(input: unknown): Promise<OutputType>
method safeParseAsync(input: unknown): Promise<{ success: true; data: OutputType } | { success: false; error: ZodError }>

// ZodError
class ZodError extends Error {
  issues: ZodIssue[]
}
interface ZodIssue { code: string; expected?: string; received?: string; path: (string|number)[]; message: string }

// Type utilities
type input<S> = S extends ZodTypeAny ? S["_input"] : never
type output<S> = S extends ZodTypeAny ? S["_output"] : never
function infer<S extends ZodTypeAny>(schema: S): S["_output"]

// Example usage
import { z } from "zod/v4"
const schema = z.string().refine(async val => val.length <= 8, "max length 8").transform(val => val.toUpperCase())

// parseAsync
schema.parseAsync("hello").then(res => console.log(res)) // "HELLO"

// error handling
try { schema.parse("toolongvalue") } catch(e) { if(e instanceof z.ZodError) console.log(e.issues) }

// safeParse
const result = schema.safeParse("toolongvalue")
if(!result.success) console.log(result.error.issues)


## Information Dense Extract
z.object(shape: Record<string,ZodType>)=>ZodObject; z.string()=>ZodString; parse(input:unknown):T throws ZodError; parseAsync(input):Promise<T>; safeParse(input):{success:true;data:T}|{success:false;error:ZodError}; safeParseAsync:Promise<SafeParseReturn>; ZodError.issues:ZodIssue[]{code,expected,received,path,message}; schema.transform(fn):ZodEffects; schema.refine(fn,message?):ZodEffects; z.infer<typeof schema>:output; z.input<typeof schema>:input; z.output<typeof schema>:output; toJSON():JSONSchema

## Sanitised Extract
Table of Contents:
1 Installation
2 Schema Definition
3 Parsing Methods
4 Error Handling
5 Async Methods
6 Type Utilities

1 Installation
  npm install zod

2 Schema Definition
  import { z } from 'zod/v4'
  const Player = z.object({ username: z.string(), xp: z.number() })

3 Parsing Methods
  parse(input: unknown): T          // throws ZodError or returns T
  safeParse(input: unknown): SafeParseReturn<T> // { success: true; data: T } | { success: false; error: ZodError }

4 Error Handling
  catch ZodError; inspect err.issues array: each issue has expected, code, path, message

5 Async Methods
  parseAsync(input: unknown): Promise<T>
  safeParseAsync(input: unknown): Promise<SafeParseReturn<T>>

6 Type Utilities
  type In = z.input<typeof schema>
  type Out = z.output<typeof schema>
  type Infer = z.infer<typeof schema>

## Original Source
Zod: TypeScript-first Schema Validation
https://github.com/colinhacks/zod

## Digest of ZOD_CORE

# Zod v4
Date retrieved: 2024-07-13
Data Size: 589234 bytes

# Installation

npm install zod

# Schema Definition

import { z } from "zod/v4";

const User = z.object({
    name: z.string(),
    age: z.number()
});

# Parsing Methods

User.parse(input: unknown): OutputType
User.parseAsync(input: unknown): Promise<OutputType>
User.safeParse(input: unknown): { success: true; data: OutputType } | { success: false; error: ZodError }
User.safeParseAsync(input: unknown): Promise<{ success: true; data: OutputType } | { success: false; error: ZodError }>

# Error Handling

Thrown error: ZodError instance
err.issues: Array<{ expected: string; code: string; path: (string|number)[]; message: string }>

# Type Utilities

import { z } from "zod/v4";

const schema = z.string().transform(val => val.length);
type SchemaIn = z.input<typeof schema>    // string
type SchemaOut = z.output<typeof schema>  // number

# Key Features

• Zero dependencies
• Core bundle: 2kb (gzipped)
• Immutable API
• Built-in JSON Schema conversion

## Attribution
- Source: Zod: TypeScript-first Schema Validation
- URL: https://github.com/colinhacks/zod
- License: License
- Crawl Date: 2025-05-20T03:37:12.826Z
- Data Size: 589234 bytes
- Links Found: 5162

## Retrieved
2025-05-20
