# ZOD

## Crawl Summary
Zod is a zero-dependency, TypeScript-first schema validation library (8kb gzipped) requiring TS>=4.5 with strict mode. Install via npm/yarn/pnpm/bun/deno. Import with import { z } from "zod". Core constructors: z.string, z.number, z.boolean, z.bigint, z.date, z.any, z.unknown, z.never, plus z.coerce.* for input coercion. Schema methods include parse/parseAsync (throws on error), safeParse/safeParseAsync (returns success flag), refine/superRefine, transform, preprocess. Object methods: shape, keyof, extend, merge, pick, omit, partial, deepPartial, required, passthrough, strict, strip, catchall. Composite types: array, tuple, union/or, discriminatedUnion, intersection. Advanced: record, map, set, recursive via z.lazy, function schemas via z.function().args().returns().implement(), promise schemas via z.promise, instance checks via z.instanceof. String validations cover min/max/length/email/url/regex/datetime/date/time/duration/base64 and transforms trim/toLowerCase/toUpperCase. Number validations cover gt/gte/lt/lte/int/positive/nonnegative/negative/nonpositive/multipleOf/finite/safe. Enums via z.enum and z.nativeEnum. Parsing methods signatures and error type ZodError. Utility types: z.infer, z.input, z.output. Key best practices: strict TS config, use safeParse for error handling, avoid coercion pitfalls, use lazy for recursion.

## Normalised Extract
Table of Contents
1 Requirements & Installation
2 Import
3 Core Constructors & Types
4 Primitives & Coercion
5 String Schema Methods
6 Number & BigInt Methods
7 Date & Boolean Methods
8 Enums
9 Optionals, Nullables & Nullish
10 Object Schemas & Methods
11 Arrays & Tuples
12 Unions & Intersections
13 Record, Map, Set
14 Recursive & Lazy Schemas
15 Effects, Transforms & Preprocess
16 Function & Instanceof Schemas
17 Promise Schemas
18 Parsing & Error Handling
19 Troubleshooting & Best Practices

1 Requirements & Installation
TypeScript >=4.5; tsconfig.json must include strict=true. Install with npm/yarn/pnpm/bun/deno. Canary: zod@canary.

2 Import
import { z } from "zod";

3 Core Constructors & Types
z.string(): ZodString; z.number(): ZodNumber; z.boolean(): ZodBoolean; z.bigint(): ZodBigInt; z.date(): ZodDate; z.undefined(): ZodUndefined; z.null(): ZodNull; z.void(): ZodVoid; z.any(): ZodAny; z.unknown(): ZodUnknown; z.never(): ZodNever.

4 Primitives & Coercion
z.coerce.string(): ZodString -> String(input);
z.coerce.number(): ZodNumber -> Number(input);
z.coerce.boolean(): ZodBoolean -> Boolean(input);
z.coerce.bigint(): ZodBigInt -> BigInt(input);
z.coerce.date(): ZodDate -> new Date(input).

5 String Schema Methods
.min(limit:number, params?:{message?:string}): ZodString
.max(limit:number, params?): ZodString
.length(len:number, params?): ZodString
.email(params?): ZodString
.url(params?): ZodString
.regex(regex:RegExp, params?): ZodString
.includes(str:string, params?): ZodString
.startsWith(str:string, params?): ZodString
.endsWith(str:string, params?): ZodString
.datetime(opts?:{offset?:boolean,local?:boolean,precision?:number}, params?): ZodString
.date(params?): ZodString
.time(opts?:{precision:number}, params?): ZodString
.duration(params?): ZodString
.base64(params?): ZodString
Transforms: .trim():ZodString; .toLowerCase():ZodString; .toUpperCase():ZodString.

6 Number & BigInt Methods
.gt(n:number):ZodNumber; .gte(n):ZodNumber; .lt(n):ZodNumber; .lte(n):ZodNumber; .int():ZodNumber; .positive():ZodNumber; .nonnegative():ZodNumber; .negative():ZodNumber; .nonpositive():ZodNumber; .multipleOf(n):ZodNumber; .finite():ZodNumber; .safe():ZodNumber.
Same for z.bigint() with BigInt values.

7 Date & Boolean Methods
z.date():ZodDate; .min(date:Date, params?):ZodDate; .max(date:Date, params?):ZodDate.
z.boolean():ZodBoolean.

8 Enums
z.enum(values: readonly string[]): ZodEnum;
z.nativeEnum(enumObj:object): ZodNativeEnum.

9 Optionals, Nullables & Nullish
.optional(): ZodOptional;
.nullable(): ZodNullable;
.nullish(): ZodNullable<ZodOptional>.

10 Object Schemas & Methods
z.object(shape: Record<string,ZodType>): ZodObject;
.shape: access key schemas;
.keyof(): ZodEnum of keys;
.extend(shape2): ZodObject;
.merge(other): ZodObject;
.pick(keysMap): ZodObject;
.omit(keysMap): ZodObject;
.partial(keysMap?): ZodObject;
.deepPartial(): ZodObject;
.required(keysMap?): ZodObject;
.passthrough(): ZodObject;
.strict(): ZodObject;
.strip(): ZodObject;
.catchall(schema: ZodType): ZodObject.

11 Arrays & Tuples
z.array(schema:ZodType): ZodArray;
schema.array(): ZodArray;
.nonempty(params?): ZodArray<[T,...T[]]>;
.min(len:number, params?):ZodArray;
.max(len:number, params?):ZodArray;
.length(len:number, params?):ZodArray;

z.tuple(schemas:ZodType[]): ZodTuple;
.rest(schema:ZodType): ZodTuple.

12 Unions & Intersections
z.union(options:ZodType[]): ZodUnion;
schema.or(other:ZodType): ZodUnion;
z.discriminatedUnion(key:string, options:ZodObject[]): ZodDiscriminatedUnion;
z.intersection(a:ZodType, b:ZodType): ZodIntersection.

13 Record, Map, Set
z.record(keySchema:ZodType, valueSchema:ZodType): ZodRecord;
z.map(keySchema, valueSchema): ZodMap;
z.set(schema): ZodSet; .nonempty(); .min(n); .max(n); .size(n).

14 Recursive & Lazy Schemas
z.lazy(fn:()=>ZodType): ZodLazy.

15 Effects, Transforms & Preprocess
z.preprocess(transformer:(val:any)=>any, schema:ZodType): ZodEffects;
schema.transform(mapper:(val:T)=>U): ZodEffects;
schema.refine(validator:(val:T)=>boolean, params?:{message?:string; path?:Array<string|number>}):ZodEffects;
schema.superRefine((val:T,ctx:{addIssue:(p:{code:string;message:string;path?:Array<string|number>})})=>void):ZodEffects.

16 Function & Instanceof Schemas
z.function(): ZodFunction;
  .args(...argSchemas:ZodType[]):ZodFunction;
  .returns(returnSchema:ZodType):ZodFunction;
  .implement(fn:Function): Function;
z.instanceof(classConstructor:Function): ZodInstanceof.

17 Promise Schemas
z.promise(schema:ZodType): ZodPromise; parsing attaches then/catch.

18 Parsing & Error Handling
.parse(data:unknown): T throws ZodError;
.parseAsync(data:unknown): Promise<T>;
.safeParse(data:unknown): { success:true; data:T } | { success:false; error:ZodError };
.safeParseAsync(data:unknown): Promise<...> alias .spa(data).

19 Troubleshooting & Best Practices
Use strict TS config; prefer safeParse in validations; avoid Boolean coercion pitfalls; use .strict/.passthrough/.catchall for key policies; use z.lazy for recursive/cyclical; chain order matters for .array() vs .optional(); clone semantics: parse returns deep clone.

## Supplementary Details
TypeScript Configuration:
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node"
  }
}

Installation Commands:
npm install zod         # production
npm install --save-dev zod@canary   # canary versions

Supported Environments:
Node.js 12+, Deno, Bun, modern browsers.

Package Size and Dependencies:
8kb minified + gzipped, zero runtime dependencies.

Versioning:
Using semver; canary publishes on every commit; pin via @canary for latest.

Integration Patterns:
• React Hook Form: use zodResolver(schema)
• tRPC: import z from "zod" and use z.object({...}).exportProcedure()
• Fastify: fastifyTypeProviderZod(), .schema({ body: schema })

Common Pitfalls & Workarounds:
• Boolean coercion: use z.preprocess for custom logic.
• Date parsing: prefer z.coerce.date(); older versions: z.preprocess(v=>new Date(v), z.date()).
• DeepPartial only works on object/array/tuple hierarchies.

Editor & Tooling:
• IDE autocompletion via .options and .enum on ZodEnum.
• Type inference: type T = z.infer<typeof schema>;
  input type: z.input<typeof schema>;
  output type: z.output<typeof schema>;

Logging & Debugging:
• Inspect ZodError.issues for detailed validation errors.
• Use safeParse to avoid thrown exceptions in async contexts.

Benchmarking:
• Throughput ~100x faster with zod-accelerator plugin.

Security:
• Schemas are immutable; chain methods return new instances; prevents side effects.

## Reference Details
API Signatures and Examples:

z.string(): ZodString
class ZodString {
  min(limit: number, params?:{message?:string}): ZodString;
  max(limit: number, params?:{message?:string}): ZodString;
  length(len: number, params?): ZodString;
  email(params?:{message?:string}): ZodString;
  url(params?:{message?:string}): ZodString;
  regex(regex: RegExp, params?:{message?:string}): ZodString;
  includes(substr: string, params?): ZodString;
  startsWith(prefix: string, params?): ZodString;
  endsWith(suffix: string, params?): ZodString;
  datetime(opts?:{offset?:boolean,local?:boolean,precision?:number}, params?): ZodString;
  date(params?): ZodString;
  time(opts?:{precision:number}, params?): ZodString;
  duration(params?): ZodString;
  base64(params?): ZodString;
  trim(): ZodString;
  toLowerCase(): ZodString;
  toUpperCase(): ZodString;
}

z.number(): ZodNumber
class ZodNumber {
  gt(n: number, params?): ZodNumber;
  gte(n: number, params?): ZodNumber;
  lt(n: number, params?): ZodNumber;
  lte(n: number, params?): ZodNumber;
  int(params?): ZodNumber;
  positive(params?): ZodNumber;
  nonnegative(params?): ZodNumber;
  negative(params?): ZodNumber;
  nonpositive(params?): ZodNumber;
  multipleOf(n: number, params?): ZodNumber;
  finite(params?): ZodNumber;
  safe(params?): ZodNumber;
}

z.coerce.string(): ZodString applies String(input)
z.coerce.number(): ZodNumber applies Number(input)

Object:
z.object<Shape extends ZodRawShape>(shape: Shape, params?:{unknownKeys?:'strip'|'strict'|'passthrough', catchall?:ZodType}): ZodObject<Shape>

Methods:
.shape: Shape
.keyof(): ZodEnum<keyof Shape[]>
.extend<Ext extends ZodRawShape>(ext: Ext): ZodObject<Shape & Ext>
.merge<Other extends ZodObject<any>>(other: Other): ZodObject<Merge<Shape, Other['shape']>>
.pick<Keys extends keyof Shape>(keys: Record<Keys, true>): ZodObject<Pick<Shape, Keys>>
.omit<Keys extends keyof Shape>(keys: Record<Keys, true>): ZodObject<Omit<Shape, Keys>>
.partial<Keys extends keyof Shape>(keys?: Record<Keys, true>): ZodObject<Partial<Shape>>
.deepPartial(): ZodObject<DeepPartial<Shape>>
.required<Keys extends keyof Shape>(keys?: Record<Keys, true>): ZodObject<Required<Shape>>
.passthrough(): ZodObject<Shape>
.strict(): ZodObject<Shape>
.strip(): ZodObject<Shape>
.catchall(schema: ZodType): ZodObject<Shape>

Arrays:
z.array<T extends ZodType>(schema: T): ZodArray<T>

.min(len: number, params?): ZodArray<T>
.max(len: number, params?): ZodArray<T>
.length(len: number, params?): ZodArray<T>
.nonempty(params?): ZodArray<[T['_output'], ...T['_output'][]]>
.element: T

Tuples:
z.tuple<T extends [ZodType, ...ZodType[]]>(schemas: T): ZodTuple<T>
.rest<S extends ZodType>(schema: S): ZodTuple<[...T, ...S[]]>

Unions:
z.union<Options extends ZodType[]>(options: Options): ZodUnion<Options>
or<Other extends ZodType>(other: Other): ZodUnion<[this, Other]>

Discriminated Unions:
z.discriminatedUnion<Discriminator extends string, Options extends ZodObject<any>[]>(discriminator: Discriminator, options: Options): ZodDiscriminatedUnion<Discriminator, Options>

Intersections:
z.intersection<A extends ZodType, B extends ZodType>(a: A, b: B): ZodIntersection<A, B>
.and<B extends ZodType>(b: B): ZodIntersection<this, B>

Record, Map, Set:
z.record<K extends ZodType, V extends ZodType>(keySchema: K, valueSchema: V): ZodRecord<K, V>
z.map<K extends ZodType, V extends ZodType>(key: K, value: V): ZodMap<K, V>
z.set<T extends ZodType>(schema: T): ZodSet<T>
  .nonempty(params?): ZodSet<T>
  .min(n: number, params?): ZodSet<T>
  .max(n: number, params?): ZodSet<T>
  .size(n: number, params?): ZodSet<T>

Lazy & Recursive:
z.lazy<T extends ZodType>(getter: ()=>T): ZodLazy<T>

Effects & Transforms:
z.preprocess(transformer:(val:any)=>any, schema: ZodType): ZodEffects<any, any>
schema.transform<U>(mapper:(val:T)=>U): ZodEffects<T, U>
schema.refine(validator:(val:T)=>boolean, params?:{message?:string; path?:(string|number)[]}): ZodEffects<T, T>
schema.superRefine((val:T, ctx:{addIssue:(issue:{code:string; message:string; path?:(string|number)[]})})=>void): ZodEffects<T, T>

Function Schemas:
z.function(): ZodFunction<[], unknown>
  .args<Args extends ZodType[]>(...args: Args): ZodFunction<Args, any>
  .returns<R extends ZodType>(returnSchema: R): ZodFunction<Args, R>
  .implement(fn: (...args: any[])=>any): (...args: InputTypes<Args>)=>OutputType<R>

Instanceof:
z.instanceof<T extends new(...args:any[])=>any>(classRef: T): ZodInstanceof<T>

Promise Schemas:
z.promise<T extends ZodType>(schema: T): ZodPromise<T>

Parsing Methods:
schema.parse(data:unknown): T throws ZodError
schema.parseAsync(data:unknown): Promise<T>
.schema.safeParse(data:unknown):{success:true;data:T}|{success:false;error:ZodError}
.schema.safeParseAsync(data:unknown):Promise<...>
alias .spa(data)

Error Codes & ZodError:
ZodError.issues: Array<{ code:string; message:string; path:(string|number)[] }>.

Concrete Examples:
const even = z.number().refine(n=>n%2===0, { message:"even only" });
even.parse(4); // 4
even.parse(5); // throws ZodError

Troubleshooting:
Strict object: z.object({a:z.string()}).strict().parse({a:"x",b:1}); // throws extra key error
Passthrough: .passthrough() to allow unknown keys
Coercion: z.coerce.boolean().parse(""); // false; use preprocess for "true"/"false" strings
Recursive cycle detection: implement custom cycle check before parse

## Information Dense Extract
TS>=4.5 strict; npm install zod; import {z} from"zod"; core:z.string(),z.number(),z.boolean(),z.bigint(),z.date(),z.any(),z.unknown(),z.never(); z.coerce.{string,number,boolean,bigint,date}; string: .min(n),.max(n),.length(n),.email(),.url(),.regex(rx),.includes(s),.startsWith(s),.endsWith(s),.datetime({offset,local,precision}),.date(),.time({precision}),.duration(),.base64(),.trim(),.toLowerCase(),.toUpperCase(); number: .gt,gte,lt,lte,int,positive,nonnegative,negative,nonpositive,multipleOf,finite,safe; bigint analogous; date: .min,.max; boolean; z.enum(vals),z.nativeEnum(enumObj); .optional(),.nullable(),.nullish(); object: z.object(shape),.shape,.keyof(),.extend(),.merge(),.pick(),.omit(),.partial(),.deepPartial(),.required(),.passthrough(),.strict(),.strip(),.catchall(); array: z.array(schema),schema.array(),.nonempty(),.min(n),.max(n),.length(n); tuple: z.tuple([...]),.rest(); union: z.union([...]),.or(); discriminatedUnion(key,opts); intersection: z.intersection(a,b),.and(); record: z.record(keySchema,valueSchema); map: z.map(); set: z.set(),.nonempty(),.min(),.max(),.size(); recursive: z.lazy(()=>schema); preprocess: z.preprocess(fn,schema); transform: .transform(fn); refine: .refine(fn,{message,path}); superRefine: .superRefine(fn); function: z.function().args(...).returns(...).implement(fn); instanceof: z.instanceof(cls); promise: z.promise(schema); parse: .parse(data):T; .parseAsync(data):Promise<T>; .safeParse(data):{success,data}|{success,error}; .spa(data); error ZodError.issues->[{code,message,path}]. utility types: z.infer,z.input,z.output; best: use safeParse, strict mode tsconfig, lazy for recursion, avoid boolean coercion pitfalls.

## Sanitised Extract
Table of Contents
1 Requirements & Installation
2 Import
3 Core Constructors & Types
4 Primitives & Coercion
5 String Schema Methods
6 Number & BigInt Methods
7 Date & Boolean Methods
8 Enums
9 Optionals, Nullables & Nullish
10 Object Schemas & Methods
11 Arrays & Tuples
12 Unions & Intersections
13 Record, Map, Set
14 Recursive & Lazy Schemas
15 Effects, Transforms & Preprocess
16 Function & Instanceof Schemas
17 Promise Schemas
18 Parsing & Error Handling
19 Troubleshooting & Best Practices

1 Requirements & Installation
TypeScript >=4.5; tsconfig.json must include strict=true. Install with npm/yarn/pnpm/bun/deno. Canary: zod@canary.

2 Import
import { z } from 'zod';

3 Core Constructors & Types
z.string(): ZodString; z.number(): ZodNumber; z.boolean(): ZodBoolean; z.bigint(): ZodBigInt; z.date(): ZodDate; z.undefined(): ZodUndefined; z.null(): ZodNull; z.void(): ZodVoid; z.any(): ZodAny; z.unknown(): ZodUnknown; z.never(): ZodNever.

4 Primitives & Coercion
z.coerce.string(): ZodString -> String(input);
z.coerce.number(): ZodNumber -> Number(input);
z.coerce.boolean(): ZodBoolean -> Boolean(input);
z.coerce.bigint(): ZodBigInt -> BigInt(input);
z.coerce.date(): ZodDate -> new Date(input).

5 String Schema Methods
.min(limit:number, params?:{message?:string}): ZodString
.max(limit:number, params?): ZodString
.length(len:number, params?): ZodString
.email(params?): ZodString
.url(params?): ZodString
.regex(regex:RegExp, params?): ZodString
.includes(str:string, params?): ZodString
.startsWith(str:string, params?): ZodString
.endsWith(str:string, params?): ZodString
.datetime(opts?:{offset?:boolean,local?:boolean,precision?:number}, params?): ZodString
.date(params?): ZodString
.time(opts?:{precision:number}, params?): ZodString
.duration(params?): ZodString
.base64(params?): ZodString
Transforms: .trim():ZodString; .toLowerCase():ZodString; .toUpperCase():ZodString.

6 Number & BigInt Methods
.gt(n:number):ZodNumber; .gte(n):ZodNumber; .lt(n):ZodNumber; .lte(n):ZodNumber; .int():ZodNumber; .positive():ZodNumber; .nonnegative():ZodNumber; .negative():ZodNumber; .nonpositive():ZodNumber; .multipleOf(n):ZodNumber; .finite():ZodNumber; .safe():ZodNumber.
Same for z.bigint() with BigInt values.

7 Date & Boolean Methods
z.date():ZodDate; .min(date:Date, params?):ZodDate; .max(date:Date, params?):ZodDate.
z.boolean():ZodBoolean.

8 Enums
z.enum(values: readonly string[]): ZodEnum;
z.nativeEnum(enumObj:object): ZodNativeEnum.

9 Optionals, Nullables & Nullish
.optional(): ZodOptional;
.nullable(): ZodNullable;
.nullish(): ZodNullable<ZodOptional>.

10 Object Schemas & Methods
z.object(shape: Record<string,ZodType>): ZodObject;
.shape: access key schemas;
.keyof(): ZodEnum of keys;
.extend(shape2): ZodObject;
.merge(other): ZodObject;
.pick(keysMap): ZodObject;
.omit(keysMap): ZodObject;
.partial(keysMap?): ZodObject;
.deepPartial(): ZodObject;
.required(keysMap?): ZodObject;
.passthrough(): ZodObject;
.strict(): ZodObject;
.strip(): ZodObject;
.catchall(schema: ZodType): ZodObject.

11 Arrays & Tuples
z.array(schema:ZodType): ZodArray;
schema.array(): ZodArray;
.nonempty(params?): ZodArray<[T,...T[]]>;
.min(len:number, params?):ZodArray;
.max(len:number, params?):ZodArray;
.length(len:number, params?):ZodArray;

z.tuple(schemas:ZodType[]): ZodTuple;
.rest(schema:ZodType): ZodTuple.

12 Unions & Intersections
z.union(options:ZodType[]): ZodUnion;
schema.or(other:ZodType): ZodUnion;
z.discriminatedUnion(key:string, options:ZodObject[]): ZodDiscriminatedUnion;
z.intersection(a:ZodType, b:ZodType): ZodIntersection.

13 Record, Map, Set
z.record(keySchema:ZodType, valueSchema:ZodType): ZodRecord;
z.map(keySchema, valueSchema): ZodMap;
z.set(schema): ZodSet; .nonempty(); .min(n); .max(n); .size(n).

14 Recursive & Lazy Schemas
z.lazy(fn:()=>ZodType): ZodLazy.

15 Effects, Transforms & Preprocess
z.preprocess(transformer:(val:any)=>any, schema:ZodType): ZodEffects;
schema.transform(mapper:(val:T)=>U): ZodEffects;
schema.refine(validator:(val:T)=>boolean, params?:{message?:string; path?:Array<string|number>}):ZodEffects;
schema.superRefine((val:T,ctx:{addIssue:(p:{code:string;message:string;path?:Array<string|number>})})=>void):ZodEffects.

16 Function & Instanceof Schemas
z.function(): ZodFunction;
  .args(...argSchemas:ZodType[]):ZodFunction;
  .returns(returnSchema:ZodType):ZodFunction;
  .implement(fn:Function): Function;
z.instanceof(classConstructor:Function): ZodInstanceof.

17 Promise Schemas
z.promise(schema:ZodType): ZodPromise; parsing attaches then/catch.

18 Parsing & Error Handling
.parse(data:unknown): T throws ZodError;
.parseAsync(data:unknown): Promise<T>;
.safeParse(data:unknown): { success:true; data:T } | { success:false; error:ZodError };
.safeParseAsync(data:unknown): Promise<...> alias .spa(data).

19 Troubleshooting & Best Practices
Use strict TS config; prefer safeParse in validations; avoid Boolean coercion pitfalls; use .strict/.passthrough/.catchall for key policies; use z.lazy for recursive/cyclical; chain order matters for .array() vs .optional(); clone semantics: parse returns deep clone.

## Original Source
Node.js Development Tools: ESM, dotenv & Zod
https://github.com/colinhacks/zod

## Digest of ZOD

# Zod Technical Reference

Source: https://github.com/colinhacks/zod
Crawled on: 2024-06-28
Data Size: 771200 bytes, Links Found: 5088

# Installation & Requirements

• TypeScript >= 4.5; tsconfig.json must include:
  {
    "compilerOptions": {
      "strict": true
    }
  }
• npm install zod       
• yarn add zod          
• pnpm add zod          
• bun add zod           
• deno add npm:zod      
• Canary release: npm install zod@canary

# Import

import { z } from "zod";

# Basic Usage

Creating a string schema:

import { z } from "zod";
const mySchema = z.string();
mySchema.parse("tuna");    // returns "tuna"
mySchema.safeParse(12);      // { success: false; error: ZodError }

Object schema:

const User = z.object({ username: z.string() });
User.parse({ username: "Ludwig" });
type User = z.infer<typeof User>;  // { username: string }

# Primitives & Coercion

z.string(); z.number(); z.bigint(); z.boolean(); z.date(); z.symbol();
z.undefined(); z.null(); z.void(); z.any(); z.unknown(); z.never();

Coercion constructors wrap inputs:

z.coerce.string();    // String(input)
z.coerce.number();    // Number(input)
z.coerce.boolean();   // Boolean(input)
z.coerce.bigint();    // BigInt(input)
z.coerce.date();      // new Date(input)

# Literals

z.literal("tuna");
z.literal(12); z.literal(2n); z.literal(true); z.literal(Symbol("x"));

# String Validations

z.string()
  .min(5,   { message: "min 5 chars" })
  .max(10,  { message: "max 10 chars" })
  .length(8)
  .email()
  .url()
  .regex(/^[a-z]+$/)
  .includes("foo")
  .startsWith("bar")
  .endsWith(".com")
  .datetime({ offset: true, local: false, precision: 3 })
  .date()      // YYYY-MM-DD
  .time({ precision: 3 })
  .duration()  // ISO 8601
  .base64();

Transforms:

z.string().trim();
z.string().toLowerCase();
z.string().toUpperCase();

# Number & BigInt Validations

z.number()
  .gt(0)
  .gte(1)
  .lt(100)
  .lte(99)
  .int()
  .positive()
  .nonnegative()
  .negative()
  .nonpositive()
  .multipleOf(5)
  .finite()
  .safe();

z.bigint()
  .gt(0n)
  .gte(1n)
  .lt(100n)
  .lte(99n)
  .multipleOf(2n);

# Date & Boolean

z.date()
  .min(new Date("1900-01-01"))
  .max(new Date());
z.boolean();

# Enums

Native string enum:

const Colors = z.enum(["Red","Green","Blue"]);
type Colors = z.infer<typeof Colors>; // "Red"|"Green"|"Blue"

Native TS enum:

enum Fruit { Apple="apple", Banana="banana" }
const FE = z.nativeEnum(Fruit);

# Optionals & Nullables

z.string().optional();  // string|undefined
z.string().nullable();  // string|null
z.string().nullish();  // string|null|undefined

# Objects & Methods

const A = z.object({ x: z.string(), y: z.number() });

A.shape.x;  // ZodString
A.keyof();  // ZodEnum<["x","y"]>

A.extend({ z: z.boolean() });
A.merge(z.object({ y: z.bigint(), z: z.boolean() }));
A.pick({ x: true });
A.omit({ y: true });
A.partial();
A.deepPartial();
A.required();
A.passthrough();
A.strict();
A.strip();
A.catchall(z.any());

# Arrays & Tuples

z.array(z.string())      // string[]
z.string().array()
  .nonempty({ message: "empty" })
  .min(2)
  .max(5)
  .length(3);

z.tuple([z.string(), z.number()])   // [string,number]
  .rest(z.boolean());               // [string,boolean[]]

# Unions & Intersections

z.union([z.string(),z.number()]);
z.string().or(z.boolean());

z.discriminatedUnion("status", [
  z.object({ status: z.literal("ok"), data: z.string() }),
  z.object({ status: z.literal("err"), error: z.string() })
]);

z.intersection(z.object({a:z.string()}), z.object({b:z.number()}));

# Record, Map, Set

z.record(z.string(), z.number());      // Record<string,number>
z.map(z.string(), z.number());         // Map<string,number>
z.set(z.string())                      // Set<string>
  .nonempty()
  .min(1)
  .max(5)
  .size(3);

# Recursive & Lazy Schemas

const Base = z.object({ name: z.string() });
type Cat = z.infer<typeof Base> & { children: Cat[] };
const CatSchema: z.ZodType<Cat> = Base.extend({ children: z.lazy(() => CatSchema.array()) });

# Effects, Transforms & Preprocess

z.preprocess(val=>String(val), z.string());

z.string().transform(val=>val.trim());
z.number().refine(val=>val%2===0, { message:"even only" });
z.string().superRefine((val,ctx)=>{ if(val!="x") ctx.addIssue({code:"custom", message:"must be x"}); });

# Function Schemas

const fn = z.function()
  .args(z.string(), z.number())
  .returns(z.boolean())
  .implement((s,n)=>s.length===n);

type Fn = z.infer<typeof fn>;  // (arg0:string,arg1:number)=>boolean

# Promises & Instances

z.promise(z.string());               // Promise<string>
z.instanceof(Date);

# Parsing Methods

.parse(data:unknown): T throws ZodError
.parseAsync(data:unknown): Promise<T>
.safeParse(data:unknown): { success:true;data:T }|{ success:false;error:ZodError }
.safeParseAsync(data:unknown): Promise<...> alias .spa

# Error Handling

ZodError issues contain path, message, code.

# Troubleshooting

• Cyclical data: pre-check with custom cycle detector before parse.
• Strict mode: .strict() to block extra keys; .passthrough() to allow; .strip() to strip.
• Coercion pitfalls: z.coerce.boolean() treats any truthy as true.

# Performance

8kb minified+gzipped; zero dependencies; immutable schemas; functional parse-only interface.

## Attribution
- Source: Node.js Development Tools: ESM, dotenv & Zod
- URL: https://github.com/colinhacks/zod
- License: License: CC BY-SA 3.0 (Node), BSD-2-Clause (dotenv), MIT (Zod)
- Crawl Date: 2025-05-19T06:30:59.761Z
- Data Size: 771200 bytes
- Links Found: 5088

## Retrieved
2025-05-19
