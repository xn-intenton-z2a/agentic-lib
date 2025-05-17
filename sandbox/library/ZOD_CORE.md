# ZOD_CORE

## Crawl Summary
Zod: TypeScript-first schema validation. Installation via npm/yarn/pnpm. Enable tsconfig strict. Core parsing methods: parse, safeParse, parseAsync, safeParseAsync. Primitive schemas: string, number, bigint, boolean, date, any, unknown, never. String validations: min, max, length, email, url, regex, includes, startsWith, endsWith, datetime, uuid, cuid, nanoid. Number validations: int, positive, nonnegative, lt, lte, gt, gte, multipleOf. Coercion on primitives with z.coerce. Object schemas: shape, keyof, extend, merge, pick, omit, partial, deepPartial, required, passthrough, strict, catchall. Arrays: .array, .min, .max, .length, .nonempty. Tuples with fixed length and .rest. Unions (.union, .or), discriminatedUnion, intersections. Record, map, set schemas. Refinements (.refine, superRefine). Transforms (.transform). Preprocessing: z.preprocess. Function schemas with .args, .returns, .implement. Lazy for recursive. Custom schemas. Error handling via ZodError.

## Normalised Extract
Table of Contents:
1 Installation
2 Core Methods
3 Primitives
4 Coercion
5 Object Schemas
6 Arrays & Tuples
7 Unions & Intersections
8 Discriminated Unions
9 Refinements & Transforms
10 Preprocess & Custom Schemas
11 Function Schemas

1 Installation
- tsconfig.json: compilerOptions.strict=true
- npm install zod
- yarn add zod
- pnpm add zod

2 Core Methods
- parse(data: unknown): T  throws ZodError
- safeParse(data: unknown): { success: true; data: T } | { success: false; error: ZodError }
- parseAsync(data: unknown): Promise<T>
- safeParseAsync(data: unknown): Promise<{ success: true; data: T } | { success: false; error: ZodError }>

3 Primitives
- z.string(): .min(n), .max(n), .length(n), .email(), .url(), .uuid(), .regex(r), .includes(s), .startsWith(s), .endsWith(s), .datetime(opts), .date(), .time(), .duration(), .base64()
- z.number(): .int(), .positive(), .nonnegative(), .negative(), .nonpositive(), .gt(n), .gte(n), .lt(n), .lte(n), .multipleOf(n), .finite(), .safe()
- z.bigint(): same as number with BigInt types
- z.boolean(), z.date(), z.undefined(), z.null(), z.any(), z.unknown(), z.never()

4 Coercion
- z.coerce.string(): String(input)
- z.coerce.number(): Number(input)
- z.coerce.boolean(): Boolean(input)
- z.coerce.date(): new Date(input)

5 Object Schemas
- z.object(shape)
- .shape  access properties
- .keyof(): ZodEnum of keys
- .extend({ key: schema })
- .merge(schema)
- .pick({ key: true })
- .omit({ key: true })
- .partial(opts?)
- .deepPartial()
- .required(opts?)
- .passthrough()
- .strict()
- .strip()
- .catchall(schema)

6 Arrays & Tuples
- z.array(elementSchema)
  .min(n), .max(n), .length(n), .nonempty()
- z.tuple([schemas]) .rest(schema)

7 Unions & Intersections
- z.union([schemas])
- schema1.or(schema2)
- z.intersection(A,B) / A.and(B)

8 Discriminated Unions
- z.discriminatedUnion(key, [objectSchemas])

9 Refinements & Transforms
- .refine(checkFn, { message, path, params })
- .superRefine((data, ctx) => { ctx.addIssue({ code, message, path }); })
- .transform(transformFn)
- chaining order: parse then transform

10 Preprocess & Custom Schemas
- z.preprocess(preFn, schema)
- z.custom<Type>(validationFn, errorOpts)

11 Function Schemas
- z.function()
  .args(...schemas)
  .returns(schema)
  .implement(fn)
- .parameters(): ZodTuple of arg schemas
- .returnType(): schema


## Supplementary Details
tsconfig.json must have strict=true. Use exact installation commands per package manager. parse and safeParse deep-clone inputs. refine functions must return truthy on success. superRefine to create multiple issues. z.coerce primitives use built-in constructors. .datetime({ offset, local, precision }) options: offset: boolean, local: boolean, precision: number. .ip({ version: 'v4'|'v6' }), .cidr({ version }). Array .nonempty({ message }). .min(n,{message}), .max(n,{message}), .length(n,{message}). Object unknownKeys policy defaults to strip. .strict() disallows unknown. .passthrough() includes unknown. .strip() resets to strip. .catchall(schema) validates unknown keys. Function schemas validate after invocation. z.promise(schema) wraps Promise input and output validation. z.instanceof(Class) checks instanceof at runtime.

## Reference Details
import { z, ZodError } from "zod";

// z.string signature
interface ZodString extends ZodType<string, ZodStringDef, string> {
  min(min: number, params?: { message?: string }): this;
  max(max: number, params?: { message?: string }): this;
  length(len: number, params?: { message?: string }): this;
  email(params?: { message?: string }): this;
  url(params?: { message?: string }): this;
  uuid(params?: { message?: string }): this;
  regex(regex: RegExp, params?: { message?: string }): this;
  includes(value: string, params?: { message?: string }): this;
  startsWith(value: string, params?: { message?: string }): this;
  endsWith(value: string, params?: { message?: string }): this;
  datetime(opts?: { offset?: boolean; local?: boolean; precision?: number }, params?: { message?: string }): this;
  date(params?: { message?: string }): this;
  time(opts?: { precision?: number }, params?: { message?: string }): this;
}

// z.number signature
interface ZodNumber extends ZodType<number, ZodNumberDef, number> {
  gt(value: number, params?: { message?: string }): this;
  gte(value: number, params?: { message?: string }): this;
  lt(value: number, params?: { message?: string }): this;
  lte(value: number, params?: { message?: string }): this;
  int(params?: { message?: string }): this;
  positive(params?: { message?: string }): this;
  nonnegative(params?: { message?: string }): this;
  negative(params?: { message?: string }): this;
  nonpositive(params?: { message?: string }): this;
  multipleOf(value: number, params?: { message?: string }): this;
  finite(params?: { message?: string }): this;
  safe(params?: { message?: string }): this;
}

// parse methods
parsedValue = schema.parse(input);
parsedAsync = await schema.parseAsync(input);
safe = schema.safeParse(input);
safeAsync = await schema.safeParseAsync(input);

// error code handling
type Issue = { code: string; message: string; path: (string|number)[] };

// Example: object schema implementation
const ConfigSchema = z.object({
  host: z.string().nonempty(),
  port: z.coerce.number().int().positive(),
  debug: z.boolean().default(false),
}).strict();

type Config = z.infer<typeof ConfigSchema>;

function loadConfig(raw: unknown): Config {
  const result = ConfigSchema.safeParse(raw);
  if (!result.success) {
    console.error(result.error.issues);
    process.exit(1);
  }
  return result.data;
}

// Troubleshooting:
// Command: node -e "console.log(JSON.stringify(require('./config.json')))" | node -e "const z=require('zod'); const s=z.string(); try{s.parse(123)}catch(e){console.log(e.issues)}"
// Expected output: [{ code: 'invalid_type', expected: 'string', received: 'number', path: [], message: 'Expected string, received number' }]

## Information Dense Extract
strict Mode TS; install via npm/yarn/pnpm; import {z} from 'zod'; Core: parse(u):T throws, safeParse(u):{success,data}|{success,error}; parseAsync/safeParseAsync for async; Primitives: z.string().min/max/length/email/url/regex/uuid/datetime{offset,local,precision}/date/time{precision}; z.number().int/positive/nonnegative/negative/nonpositive/gt/gte/lt/lte/multipleOf/finite/safe; z.boolean,date,bigint,any,unknown,never; Coercion: z.coerce.{string,number,boolean,date}; Object: z.object(shape).shape,keyof,extend,merge,pick,omit,partial,deepPartial,required,passthrough,strict,strip,catchall; Array: z.array(s).min/max/length/nonempty; Tuple: z.tuple([...]).rest; Union: z.union([...])/.or; Intersection: z.intersection; DiscriminatedUnion(key,[opts]); Refinement: .refine(fn,{message}),.superRefine; Transform: .transform; Preprocess: z.preprocess(fn,s); Function: z.function().args(...).returns(...).implement(fn); Custom: z.custom<Type>(fn); Lazy: z.lazy(()=>schema).

## Sanitised Extract
Table of Contents:
1 Installation
2 Core Methods
3 Primitives
4 Coercion
5 Object Schemas
6 Arrays & Tuples
7 Unions & Intersections
8 Discriminated Unions
9 Refinements & Transforms
10 Preprocess & Custom Schemas
11 Function Schemas

1 Installation
- tsconfig.json: compilerOptions.strict=true
- npm install zod
- yarn add zod
- pnpm add zod

2 Core Methods
- parse(data: unknown): T  throws ZodError
- safeParse(data: unknown): { success: true; data: T } | { success: false; error: ZodError }
- parseAsync(data: unknown): Promise<T>
- safeParseAsync(data: unknown): Promise<{ success: true; data: T } | { success: false; error: ZodError }>

3 Primitives
- z.string(): .min(n), .max(n), .length(n), .email(), .url(), .uuid(), .regex(r), .includes(s), .startsWith(s), .endsWith(s), .datetime(opts), .date(), .time(), .duration(), .base64()
- z.number(): .int(), .positive(), .nonnegative(), .negative(), .nonpositive(), .gt(n), .gte(n), .lt(n), .lte(n), .multipleOf(n), .finite(), .safe()
- z.bigint(): same as number with BigInt types
- z.boolean(), z.date(), z.undefined(), z.null(), z.any(), z.unknown(), z.never()

4 Coercion
- z.coerce.string(): String(input)
- z.coerce.number(): Number(input)
- z.coerce.boolean(): Boolean(input)
- z.coerce.date(): new Date(input)

5 Object Schemas
- z.object(shape)
- .shape  access properties
- .keyof(): ZodEnum of keys
- .extend({ key: schema })
- .merge(schema)
- .pick({ key: true })
- .omit({ key: true })
- .partial(opts?)
- .deepPartial()
- .required(opts?)
- .passthrough()
- .strict()
- .strip()
- .catchall(schema)

6 Arrays & Tuples
- z.array(elementSchema)
  .min(n), .max(n), .length(n), .nonempty()
- z.tuple([schemas]) .rest(schema)

7 Unions & Intersections
- z.union([schemas])
- schema1.or(schema2)
- z.intersection(A,B) / A.and(B)

8 Discriminated Unions
- z.discriminatedUnion(key, [objectSchemas])

9 Refinements & Transforms
- .refine(checkFn, { message, path, params })
- .superRefine((data, ctx) => { ctx.addIssue({ code, message, path }); })
- .transform(transformFn)
- chaining order: parse then transform

10 Preprocess & Custom Schemas
- z.preprocess(preFn, schema)
- z.custom<Type>(validationFn, errorOpts)

11 Function Schemas
- z.function()
  .args(...schemas)
  .returns(schema)
  .implement(fn)
- .parameters(): ZodTuple of arg schemas
- .returnType(): schema

## Original Source
Zod – TypeScript Schema Validation
https://github.com/colinhacks/zod

## Digest of ZOD_CORE

# Zod Core Technical Digest

Date Retrieved: 2023-10-07
Data Size: 903094 bytes
Source: https://github.com/colinhacks/zod README

# Installation

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    // ... other options ...
  }
}
```

```bash
# npm
tnpm install zod
# yarn
yarn add zod
# pnpm
pnpm add zod
# canary version
npm install zod@canary
```  

# Basic Usage

```ts
import { z } from "zod";

// string schema
enumSchema = z.string();
enumSchema.parse("hello");         // returns "hello"
enumSchema.safeParse(123);         // { success: false, error: ZodError }
```  

# Core Methods

- .parse(data: unknown): T  
- .safeParse(data: unknown): { success: true; data: T } | { success: false; error: ZodError }
- .parseAsync(data: unknown): Promise<T>  
- .safeParseAsync(data: unknown): Promise<...>

# Primitives

```ts
z.string()
  .min(1, { message: "Required" })
  .max(100)
  .email();

z.number()
  .int()
  .positive()
  .lte(100, { message: "Too large" });

z.boolean();
z.date();
z.bigint();
z.undefined();
z.null();
z.any();
z.unknown();
z.never();
```  

# Coercion

```ts
z.coerce.string();    // String(input)
z.coerce.number();    // Number(input)
z.coerce.boolean();   // Boolean(input)
z.coerce.date();      // new Date(input)
```  

# Object Schemas

```ts
const User = z.object({
  id: z.string(),
  age: z.number().int().nonnegative(),
});

User.shape.id;             // ZodString
User.keyof();              // ZodEnum<["id","age"]>
User.extend({ name: z.string() });
User.merge(z.object({ active: z.boolean() }));
User.pick({ id: true });
User.omit({ age: true });
User.partial();
User.required({ id: true });
User.strict();
User.passthrough();
User.catchall(z.any());
```  

# Arrays & Tuples

```ts
z.array(z.string())
  .min(1)
  .max(10);

z.tuple([z.string(), z.number()])
  .rest(z.any());
```  

# Unions & Intersections

```ts
z.union([z.string(), z.number()]);
z.string().or(z.number());

z.intersection(A, B);
```  

# Discriminated Unions

```ts
const DU = z.discriminatedUnion("type", [
  z.object({ type: z.literal("a"), a: z.string() }),
  z.object({ type: z.literal("b"), b: z.number() }),
]);
```  

# Refinements & Transforms

```ts
z.string()
  .refine(val => val.length < 10, { message: "Too long" })
  .transform(val => val.trim());

z.preprocess(val => String(val), z.string());
```  

# Functions

```ts
const fn = z.function()
  .args(z.string(), z.number())
  .returns(z.boolean())
  .implement((s, n) => s.length === n);
```  

# Custom & Lazy Schemas

```ts
z.custom<`${number}px`>(val => typeof val === "string" && /^\d+px$/.test(val));

const Node: z.ZodType<Tree> = z.lazy(() => z.object({
  value: z.string(),
  children: z.array(Node),
}));
```

## Attribution
- Source: Zod – TypeScript Schema Validation
- URL: https://github.com/colinhacks/zod
- License: License
- Crawl Date: 2025-05-17T00:21:35.025Z
- Data Size: 903094 bytes
- Links Found: 6147

## Retrieved
2025-05-17
