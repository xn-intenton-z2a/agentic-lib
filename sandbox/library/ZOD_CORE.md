# ZOD_CORE

## Crawl Summary
Installation: TS >=4.5 strict=true; npm|yarn|pnpm|bun commands. Basic Usage: import { z } from "zod"; z.string(), .parse, .safeParse. Primitives: z.string|number|bigint|boolean|date. Coercion: z.coerce.* mapping to JS constructors. String validations: .min, .max, .length, .email, .url, .regex, .datetime(options), .ip(options), .cidr(options). Object schema methods: .extend, .merge, .pick, .omit, .partial, .deepPartial, .required, .strict, .passthrough, .strip, .catchall. Array: .array(), .nonempty, .min, .max, .length. Unions/Intersections: z.union, .or, z.discriminatedUnion, z.intersection/A.and. Effects: .refine, .superRefine, .transform, .preprocess. Schema overrides with z.ZodType<Out,Def,In>. Function schemas: .function().args().returns().implement, Promise schema. Parsing: .parse/.parseAsync, .safeParse/.safeParseAsync/.spa. Errors: ZodError. 

## Normalised Extract
Table of Contents
1 Installation
2 Basic Usage
3 Primitives
4 Coercion
5 Strings
6 Dates & Times
7 Objects
8 Arrays
9 Unions & Intersections
10 Effects & Transformations
11 Parsing Methods

1 Installation
Requirements: TypeScript >=4.5, tsconfig compilerOptions.strict=true
Commands:
npm install zod
pnpm add zod
yarn add zod
bun add zod
canary: npm install zod@canary

2 Basic Usage
import { z } from "zod"
const schema = z.string()
schema.parse("text")      // returns string
schema.safeParse(input)    // { success: boolean; data?; error? }

3 Primitives
z.string(), z.number(), z.bigint(), z.boolean(), z.date()
z.undefined(), z.null(), z.void(), z.any(), z.unknown(), z.never()

4 Coercion
z.coerce.string()    maps to String(input)
z.coerce.number()    maps to Number(input)
z.coerce.boolean()   maps to Boolean(input)
z.coerce.bigint()    maps to BigInt(input)
z.coerce.date()      maps to new Date(input)

5 Strings
z.string().min(n,{message}).max(n,{message}).length(n,{message})
.email({message}).url({message}).emoji().uuid().regex(RegExp,{message})
datetime: z.string().datetime({ offset?: boolean; local?: boolean; precision?: number })
.date() validates YYYY-MM-DD
.time({ precision?: number })
.duration() ISO 8601
.base64()
.ip({ version?: "v4"|"v6" })
.cidr({ version?: "v4"|"v6" })

6 Dates & Times
String-based: .datetime(options), .date(), .time()
Instance-based: z.date().min(Date,{message}).max(Date,{message})
z.coerce.date() accepts string or number coercion

7 Objects
z.object({ key: Schema, ... })
Methods:
.shape.key yields schema for key
.keyof() yields ZodEnum of keys
.extend({ extraKey: Schema })
.merge(otherSchema)
.pick({ key: true })
.omit({ key: true })
.partial({ keys? })
.deepPartial()
.required({ keys? })
.strict() only known keys allowed
.passthrough() include unknown keys
.strip() strip unknown keys
.catchall(Schema) validate unknown keys with Schema

8 Arrays
z.array(ElementSchema)
schema.array()
.nonempty({ message }) yields [T,...T[]]
.min(n,{message}).max(n,{message}).length(n,{message})
.element yields element schema

9 Unions & Intersections
z.union([A,B]) or A.or(B)
z.discriminatedUnion("key", [schemas])
z.intersection(A,B) or A.and(B)

10 Effects & Transformations
.refine((data)=> boolean|Promise<boolean>,{ message, path? })
.superRefine((data,ctx)=> void)
.transform((data)=> U)
.preprocess((input)=> any, schema)
Custom: z.ZodType<Output,ZodTypeDef,Input>

11 Parsing Methods
.parse(data: unknown): T throws on error
.parseAsync(data): Promise<T>
.safeParse(data): { success:boolean; data?:T; error?:ZodError }
.safeParseAsync(data)/.spa(data)


## Supplementary Details
Configuration Steps:
1 Add "strict": true to tsconfig.json compilerOptions.
2 Install zod via preferred package manager.
3 Import using ESModule or CommonJS: import { z } from 'zod'; const { z } = require('zod');

Parameter Options:
- string: { required_error?: string; invalid_type_error?: string }
- string datetime: { offset?: boolean; local?: boolean; precision?: number }
- string ip/cidr: { version?: 'v4' | 'v6' }
- number: .gte(min:number,{message}), .lte(max:number,{message}), .int(), .positive(), .negative(), .multipleOf(step:number)
- date: .min(date:Date,{message}), .max(date:Date,{message})
- object: unknownKeys policy via .strict()/ .passthrough()/ .strip(), catchall schema
- array: .min(length:number,{message}), .max(length:number,{message}), .length(length:number,{message})

Implementation Steps:
1 Define schema with types and methods.
2 Call .parse or .safeParse according to sync/async needs.
3 For transforms/refinements, chain .refine/.transform before parsing.
4 For error handling, inspect ZodError.issues array.



## Reference Details
API Specifications:

Type Constructors:
- z.string(params?:{ required_error?: string; invalid_type_error?: string }): ZodString
- z.number(params?:{ required_error?: string; invalid_type_error?: string }): ZodNumber
- z.boolean(params?): ZodBoolean
- z.bigint(params?): ZodBigInt
- z.date(params?): ZodDate
- z.instanceof(cls: new(...args:any[])=> any, params?): ZodInstanceof
- z.literal(value: any): ZodLiteral
- z.enum(values: readonly string[]): ZodEnum
- z.nativeEnum(enumObj: object): ZodNativeEnum
- z.undefined(), z.null(), z.void(), z.any(), z.unknown(), z.never(), z.nullable(schema), z.optional(schema)
- z.array(item: ZodType): ZodArray
- z.tuple(items: ZodType[]): ZodTuple
- z.record(keyType: ZodType, valueType: ZodType): ZodRecord
- z.map(keyType: ZodType, valueType: ZodType): ZodMap
- z.set(item: ZodType): ZodSet
- z.union(schemas: ZodType[]): ZodUnion
- z.discriminatedUnion(key: string, schemas: ZodObject[]): ZodDiscriminatedUnion
- z.intersection(A: ZodType, B: ZodType): ZodIntersection
- z.ZodType<Out,Def,In>
- z.function(): ZodFunction
- z.promise(item: ZodType): ZodPromise
- z.preprocess(fn:(arg:any)=>any, schema:ZodType): ZodEffects
- z.transform(fn:(arg:any)=>any): ZodEffects
- z.coerce.string(), .number(), .boolean(), .bigint(), .date()

Method Signatures:
- ZodType.parse(data: unknown): OutType
- ZodType.parseAsync(data: unknown): Promise<OutType>
- ZodType.safeParse(data: unknown): ParseResult<OutType>
- ZodType.safeParseAsync(data: unknown): Promise<ParseResult<OutType>>
- ZodType.spa(data: unknown): Promise<ParseResult<OutType>>
- ZodString.min(min: number, params?: { message: string }): ZodString
- ZodString.max(max: number, params?: { message: string }): ZodString
- ZodString.length(len: number, params?:{ message:string }): ZodString
- ZodString.email(params?:{ message:string }), url, regex, datetime, ip, cidr
- ZodNumber.gt(n:number, params?), gte, lt, lte, int, positive, nonnegative, negative, nonpositive, multipleOf, finite, safe
- ZodDate.min(date: Date, params?), max(date, params?)
- ZodEffects.refine(validator:(data:any)=>boolean|Promise<boolean>, params?:RefineParams)
- ZodEffects.superRefine(fn:(data:any, ctx:RefinementCtx)=>void)
- ZodEffects.transform(fn:(data:any)=>any)
- ZodEffects.preprocess(fn:(input:unknown)=>unknown, schema:ZodType)
- ZodFunction.args(...schemas: ZodType[]): ZodFunction
- ZodFunction.returns(schema:ZodType): ZodFunction
- ZodFunction.implement(fn: (...args:any[])=>any): (...args:any[])=>any

Code Examples:
```ts
// Coerce and validate integer
const quantity = z.coerce.number().int().nonnegative()
quantity.parse("5")      // returns 5
quantity.safeParse(-1)    // { success:false; error }

// Extend object
const base = z.object({ id:z.string() })
const extended = base.extend({ name:z.string() })
extended.parse({ id:"1", name:"A" })

// Discriminated union
const result = z.discriminatedUnion("status", [
  z.object({ status:z.literal("ok"), data:z.string() }),
  z.object({ status:z.literal("error"), message:z.string() })
])
result.parse({ status:"ok", data:"hi" })
```

Implementation Patterns:
- Always enable strict TS mode
- Use safeParse in user input flows
- Chain refinements before transforms
- Use discriminatedUnion for tagged payloads

Configuration Options:
- tsconfig.json strict=true
- datetime: offset=false, local=false, precision=undefined
- ip/cidr version default both
- catchall schema overrides strict/passthrough

Best Practices:
- Prefer z.coerce for lightweight type coercion
- Use .nonempty over .min(1) for arrays
- Use .catchall to validate unknown fields
- Compose schemas rather than intersect when merging objects

Troubleshooting:
$ node -e "console.log(require('zod').z.string().parse(123))"  # throws ZodError: Invalid type
$ ts-node script.ts  # ensure tsconfig paths include zod types
Inspect error.issues array for path, message, code


## Information Dense Extract
zod v4 core: TS>=4.5 strict=true; install via npm|pnpm|yarn|bun; import { z } from 'zod';
z.basic Types: string(), number(), bigint(), boolean(), date(), undefined(), null(), any(), unknown(), never();
z.coerce.*: string|number|boolean|bigint|date mapping to JS constructors;
string(): .min(n,{message}), .max(n), .length(n), .email(), .url(), .emoji(), .uuid(), .regex(regexp), .datetime({offset?,local?,precision?}), .date(), .time({precision?}), .duration(), .base64(), .ip({version?}), .cidr({version?});
number(): .gt(n), .gte(n), .lt(n), .lte(n), .int(), .positive(), .nonnegative(), .negative(), .nonpositive(), .multipleOf(n), .finite(), .safe();
object(shape): .extend(shape), .merge(other), .pick(keys), .omit(keys), .partial(keys?), .deepPartial(), .required(keys?), .strict(), .passthrough(), .strip(), .catchall(schema);
array(item): .nonempty(), .min(n), .max(n), .length(n);
tuple(list), record(keySchema,valueSchema), map(k,v), set(item): .nonempty(), .min(), .max(), .size();
union([A,B]), A.or(B), discriminatedUnion(key,[schemas]), intersection(A,B), A.and(B);
z.preprocess(fn,s), .refine(fn), .superRefine((v,ctx)=>), .transform(fn);
function: z.function().args(...schemas).returns(schema).implement(fn); promise: z.promise(schema);
parse(data):T; parseAsync(data):Promise<T>; safeParse(data): {success,data?,error?}; safeParseAsync/spa;
ZodError.issues array: {path[],message,code};
best practices: safeParse for user input; strict TS; discriminatedUnion for tagged types; z.coerce for simple parsing; .nonempty for arrays; .catchall for unknown keys.


## Sanitised Extract
Table of Contents
1 Installation
2 Basic Usage
3 Primitives
4 Coercion
5 Strings
6 Dates & Times
7 Objects
8 Arrays
9 Unions & Intersections
10 Effects & Transformations
11 Parsing Methods

1 Installation
Requirements: TypeScript >=4.5, tsconfig compilerOptions.strict=true
Commands:
npm install zod
pnpm add zod
yarn add zod
bun add zod
canary: npm install zod@canary

2 Basic Usage
import { z } from 'zod'
const schema = z.string()
schema.parse('text')      // returns string
schema.safeParse(input)    // { success: boolean; data?; error? }

3 Primitives
z.string(), z.number(), z.bigint(), z.boolean(), z.date()
z.undefined(), z.null(), z.void(), z.any(), z.unknown(), z.never()

4 Coercion
z.coerce.string()    maps to String(input)
z.coerce.number()    maps to Number(input)
z.coerce.boolean()   maps to Boolean(input)
z.coerce.bigint()    maps to BigInt(input)
z.coerce.date()      maps to new Date(input)

5 Strings
z.string().min(n,{message}).max(n,{message}).length(n,{message})
.email({message}).url({message}).emoji().uuid().regex(RegExp,{message})
datetime: z.string().datetime({ offset?: boolean; local?: boolean; precision?: number })
.date() validates YYYY-MM-DD
.time({ precision?: number })
.duration() ISO 8601
.base64()
.ip({ version?: 'v4'|'v6' })
.cidr({ version?: 'v4'|'v6' })

6 Dates & Times
String-based: .datetime(options), .date(), .time()
Instance-based: z.date().min(Date,{message}).max(Date,{message})
z.coerce.date() accepts string or number coercion

7 Objects
z.object({ key: Schema, ... })
Methods:
.shape.key yields schema for key
.keyof() yields ZodEnum of keys
.extend({ extraKey: Schema })
.merge(otherSchema)
.pick({ key: true })
.omit({ key: true })
.partial({ keys? })
.deepPartial()
.required({ keys? })
.strict() only known keys allowed
.passthrough() include unknown keys
.strip() strip unknown keys
.catchall(Schema) validate unknown keys with Schema

8 Arrays
z.array(ElementSchema)
schema.array()
.nonempty({ message }) yields [T,...T[]]
.min(n,{message}).max(n,{message}).length(n,{message})
.element yields element schema

9 Unions & Intersections
z.union([A,B]) or A.or(B)
z.discriminatedUnion('key', [schemas])
z.intersection(A,B) or A.and(B)

10 Effects & Transformations
.refine((data)=> boolean|Promise<boolean>,{ message, path? })
.superRefine((data,ctx)=> void)
.transform((data)=> U)
.preprocess((input)=> any, schema)
Custom: z.ZodType<Output,ZodTypeDef,Input>

11 Parsing Methods
.parse(data: unknown): T throws on error
.parseAsync(data): Promise<T>
.safeParse(data): { success:boolean; data?:T; error?:ZodError }
.safeParseAsync(data)/.spa(data)

## Original Source
Zod Schema Validation Library
https://github.com/colinhacks/zod

## Digest of ZOD_CORE

# Zod Core Schema Validation Library

## Retrieved: 2024-06-10  
**Source:** GitHub colinhacks/zod README (Entry 8)
**Data Size:** 898019 bytes  

# Installation

## Requirements
- TypeScript >= 4.5
- tsconfig.json:  {  "compilerOptions": {  "strict": true  }}

## From npm
- npm install zod  
- pnpm add zod  
- yarn add zod  
- bun add zod
- canary: npm install zod@canary

# Basic Usage

## Import
```ts
import { z } from "zod";
```

## Parse
- `.parse(input: unknown): T`  throws ZodError on invalid input
- `.safeParse(input: unknown): { success: true; data: T } | { success: false; error: ZodError }`

```ts
const schema = z.string();
schema.parse("hello");         // returns "hello"
schema.safeParse(123);         // { success: false; error: ZodError }
```

# Schema Types

## Primitives
- z.string(): ZodString
- z.number(): ZodNumber
- z.bigint(): ZodBigInt
- z.boolean(): ZodBoolean
- z.date(): ZodDate
- z.undefined(), z.null(), z.void(), z.any(), z.unknown(), z.never()

## Coercion
- z.coerce.string(): String(input)
- z.coerce.number(): Number(input)
- z.coerce.bigint(): BigInt(input)
- z.coerce.boolean(): Boolean(input)
- z.coerce.date(): new Date(input)

## Strings
- Methods: .min(n), .max(n), .length(n), .email(), .url(), .regex(regexp)
- Transforms: .trim(), .toLowerCase(), .toUpperCase()
- Date/Time: .datetime({ offset?: boolean; local?: boolean; precision?: number }), .date(), .time(), .duration()
- IP: .ip({ version: "v4" | "v6" }), .cidr({ version: "v4" | "v6" })
- Custom errors: z.string({ required_error, invalid_type_error }), .min(n, { message }), .email({ message })

## Objects
- z.object({ key: Schema, ... })
- Methods: .extend(shape), .merge(other), .pick({ keys }), .omit({ keys }), .partial({ keys? }), .deepPartial(), .required({ keys? }), .strict(), .passthrough(), .strip(), .catchall(schema)
- Access: .shape.key, .keyof()

## Arrays
- z.array(elementSchema) or schema.array()
- Methods: .nonempty({ message? }), .min(n), .max(n), .length(n)
- Access: .element

## Unions & Intersections
- z.union([A, B]), A.or(B)
- z.discriminatedUnion(key, [schemas])
- z.intersection(A, B) or A.and(B)

# Effects & Transformations
- .refine(validator: (data: T)=> boolean | Promise<boolean>, { message, path? })
- .superRefine((data: T, ctx) => void)
- .transform(fn: (data: T)=> U)
- .preprocess(fn: (input: unknown)=> unknown, schema)
- Input/output hints: z.ZodType<Output, Def, Input>

# Function & Promise Schemas
- z.function().args(argSchemas...).returns(returnSchema).implement(fn)
- z.promise(itemSchema)

# Parsing
- `.parse(data)`, `.parseAsync(data)`: Promise<T>
- `.safeParse(data)`, `.safeParseAsync(data)`, alias: `.spa(data)`

# Error Handling
- ZodError contains `issues`: array of { path: (string|number)[]; message: string; code: string }



## Attribution
- Source: Zod Schema Validation Library
- URL: https://github.com/colinhacks/zod
- License: License: MIT
- Crawl Date: 2025-05-15T04:30:06.580Z
- Data Size: 898019 bytes
- Links Found: 6125

## Retrieved
2025-05-15
