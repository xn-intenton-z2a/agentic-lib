# ZOD_SCHEMA

## Crawl Summary
Zod v4.5+ requires TS 4.5+ with strict mode. Installation via npm/yarn/pnpm. Core APIs: z.string(), z.number(), z.boolean(), z.date(), z.bigint(), z.undefined(), z.null(), z.void(), z.any(), z.unknown(), z.never(). Coercion via z.coerce.<type>(). String methods: min, max, length, email, url, uuid, datetime, date, time, regex, trim, case transforms. Object methods: shape, extend, merge, pick, omit, partial, required, passthrough, strict, strip, catchall. Collections: array, tuple, record, map, set with constraints. Composition: union, discriminatedUnion, intersection, functions. Effects: refine, superRefine, transform, preprocess. Parsing: parse, parseAsync, safeParse, spa. Custom schemas: z.literal, z.nativeEnum, z.custom, lazy for recursion.

## Normalised Extract
Table of Contents
1 Installation
2 Schema Creation & Parsing
3 Primitive & Coercion
4 String Validation & Transforms
5 Object Schema Methods
6 Array & Tuple Schemas
7 Unions & Discriminated Unions
8 Record, Map, Set
9 Intersection & Merge
10 Recursive Types
11 Effects: refine, transform, preprocess
12 Function Schemas

1 Installation
Requirements: TS 4.5+, strict mode ("strict": true). Install: npm install zod

2 Schema Creation & Parsing
import { z } from "zod";
const S = z.string();
S.parse(data): throws ZodError or returns string
S.safeParse(data): { success:true,data } or { success:false,error }
S.parseAsync for async effects

3 Primitive & Coercion
z.string(): ZodString
z.number(): ZodNumber
z.boolean(): ZodBoolean
z.date(): ZodDate
z.bigint(): ZodBigInt
z.undefined(), z.null(), z.void(), z.any(), z.unknown(), z.never()
z.coerce.string() -> String(input)
z.coerce.number() -> Number(input)
z.coerce.boolean() -> Boolean(input)
z.coerce.date() -> new Date(input)

4 String Validation & Transforms
z.string().min( min:number, { message } )
z.string().max( max:number, { message } )
z.string().length( len:number )
z.string().email( { message } )
z.string().url()
z.string().uuid()
z.string().regex( regex:RegExp, { message } )
z.string().datetime({ offset:boolean, local:boolean, precision:number })
z.string().date()
z.string().time({ precision:number })
z.string().trim(), .toLowerCase(), .toUpperCase()
Custom error: z.string({ required_error, invalid_type_error })

5 Object Schema Methods
const Obj = z.object({ a:z.string(), b:z.number() });
Obj.shape.a // ZodString
Obj.extend({ c:z.boolean() })
Obj.merge(Other)
Obj.pick({ a:true })
Obj.omit({ b:true })
Obj.partial({ a:true })
Obj.required({ b:true })
Obj.passthrough() // allow extra keys
Obj.strict()      // disallow extra keys
Obj.strip()       // default strip unknown keys
Obj.catchall(z.number()) // validate extra keys

6 Array & Tuple Schemas
z.array(z.string()).min( min:number ).max( max:number ).length( len:number )
z.array(z.string()).nonempty({ message })
z.tuple([z.string(), z.number()]).rest(z.boolean())

7 Unions & Discriminated Unions
z.union([A,B])
A.or(B)
z.discriminatedUnion("tag", [ObjA, ObjB])

8 Record, Map, Set
z.record(keySchema:z.ZodType, valueSchema:z.ZodType)
z.map(keySchema, valueSchema)
z.set(valueSchema).min( min:number ).max( max:number ).size( size:number )

9 Intersection & Merge
z.intersection(A,B)
A.and(B)  // alias
A.merge(B)

10 Recursive Types
const Base = z.object({ name:z.string() });
type Node = { name:string; children:Node[] };
const NodeSchema: z.ZodType<Node> = Base.extend({ children: z.lazy(() => NodeSchema.array()) });

11 Effects: refine, transform, preprocess
.schema.refine((val)=>boolean, { message, path })
.schema.superRefine((val,ctx)=>{ ctx.addIssue({ code, message }) })
.schema.transform((val)=>newVal)
z.preprocess((val)=>any, schema)

12 Function Schemas
z.function().args(...schemas).returns(schema).implement(fn)
.schema.parameters() // ZodTuple
.schema.returnType()



## Supplementary Details
TypeScript requirement: 4.5+ with strict mode. Installation: npm/yarn/pnpm. Default bundle size: 8kb minified+gzipped. Zero dependencies. Immutable APIs. parse returns deep clone. All methods return new schema instances. Coercion uses built-in constructors. Boolean coercion: any truthy→true, falsy→false. datetime default no offsets; offset:true to allow; local:true to allow no timezone. time precision default arbitrary; precision:n to constrain. date format YYYY-MM-DD. IP: z.string().ip({ version:'v4'|'v6' }). cidr same signature. number validations: gt, gte(min), lt, lte(max), int(), positive(), nonnegative(), negative(), nonpositive(), multipleOf(step), finite(), safe(). bigint validations same with BigInt. error params: { message:string }. z.nativeEnum(Enum). z.literal(value). z.custom<T>(validator,val?opts). z.JSON via z.lazy union. z.promise(schema) validate promise type then resolved value. z.instanceof(Class). ZodEffects types: ZodEffects<Output,Def,Input>. parseAsync required for async refine/transform. safeParseAsync/.spa alias. unrecognized object keys default strip. .passthrough, .strict, .strip control unknownKeys policy. .catchall overrides other unknownKey policies.


## Reference Details
API Specifications:

z.string(): ZodString
Methods on ZodString:
  min(min: number, params?: { message: string }): ZodString
  max(max: number, params?: { message: string }): ZodString
  length(len: number, params?: { message: string }): ZodString
  email(params?: { message: string }): ZodString
  url(params?: { message: string }): ZodString
  uuid(params?: { message: string }): ZodString
  nanoid(params?: { message: string }): ZodString
  cuid(params?: { message: string }): ZodString
  cuid2(params?: { message: string }): ZodString
  ulid(params?: { message: string }): ZodString
  regex(regex: RegExp, params?: { message: string }): ZodString
  includes(substr: string, params?: { message: string }): ZodString
  startsWith(substr: string, params?: { message: string }): ZodString
  endsWith(substr: string, params?: { message: string }): ZodString
  datetime(opts?: { offset?: boolean; local?: boolean; precision?: number; message?: string }): ZodString
  date(params?: { message: string }): ZodString
  time(opts?: { precision?: number; message?: string }): ZodString
  ip(opts?: { version?: "v4" | "v6"; message?: string }): ZodString
  cidr(opts?: { version?: "v4" | "v6"; message?: string }): ZodString
  trim(): ZodString
  toLowerCase(): ZodString
  toUpperCase(): ZodString
  array(): ZodArray<ZodString>
  optional(): ZodOptional<ZodString>
  nullable(): ZodNullable<ZodString>
  transform<U>(fn: (val: string) => U): ZodEffects<U,ZodTypeDef,string>
  refine(check: (val: string) => boolean | Promise<boolean>, params?: { message?: string; path?: (string|number)[]; params?: object }): ZodEffects<string,ZodTypeDef, string>

z.number(): ZodNumber
Methods on ZodNumber:
  gt(n: number, params?): ZodNumber
  gte(min: number, params?): ZodNumber
  lt(n: number, params?): ZodNumber
  lte(max: number, params?): ZodNumber
  int(params?): ZodNumber
  positive(params?): ZodNumber
  nonnegative(params?): ZodNumber
  negative(params?): ZodNumber
  nonpositive(params?): ZodNumber
  multipleOf(step: number, params?): ZodNumber
  finite(params?): ZodNumber
  safe(params?): ZodNumber
  transform<U>(fn: (val: number) => U)
  refine(...)

z.boolean(), z.bigint() same pattern

z.date(): ZodDate
  min(date: Date, params?): ZodDate
  max(date: Date, params?): ZodDate

z.array<T extends ZodType>(schema: T): ZodArray<T>
  .min(n:number, params?): ZodArray<T>
  .max(n:number, params?): ZodArray<T>
  .length(n:number, params?): ZodArray<T>
  .nonempty(params?): ZodArray<T>
  .element(): T

z.tuple<[T1,...]>(schemas: [T1,...Tn]): ZodTuple<[T1,...Tn]>
  .rest(schema: T): ZodTuple<[T1,...Tn],T>

z.object<Shape extends ZodRawShape>(shape: Shape, params?): ZodObject<Shape>
  .shape: Shape
  .keyof(): ZodEnum<string[]>
  .extend<New extends ZodRawShape>(newShape: New): ZodObject<Shape & New>
  .merge<Other extends ZodObject<any>>(other: Other): ZodObject<CombinedShape>
  .pick<Keys extends keyof Shape>(keys: Record<Keys, true>): ZodObject<Pick<Shape, Keys>>
  .omit<Keys extends keyof Shape>(keys: Record<Keys, true>): ZodObject<Omit<Shape, Keys>>
  .partial<Keys extends keyof Shape>(keys?: Record<Keys, true>): ZodObject<Partial<Shape>>
  .deepPartial(): ZodObject<DeepPartialShape>
  .required<Keys extends keyof Shape>(keys?: Record<Keys, true>): ZodObject<RequiredShape>
  .strict(): ZodObject<Shape>
  .passthrough(): ZodObject<Shape>
  .strip(): ZodObject<Shape>
  .catchall(schema: ZodType): ZodObject<Shape>

z.union<T extends ZodType>(schemas: T[]): ZodUnion<T>
z.discriminatedUnion<Tag extends string,T extends ZodObject<any>>(tag: Tag, options: T[]): ZodDiscriminatedUnion<Tag,T>
z.intersection<A extends ZodType,B extends ZodType>(a:A,b:B): ZodIntersection<A,B>
z.record<Key extends ZodType, Value extends ZodType>(keySchema: Key, valueSchema: Value): ZodRecord<Key,Value>
z.map<Key extends ZodType, Value extends ZodType>(keySchema: Key, valueSchema: Value): ZodMap<Key,Value>
z.set<Value extends ZodType>(valueSchema: Value): ZodSet<Value>
z.nativeEnum<T>(e: T): ZodEnum<EnumValues>
z.literal<T extends string|number|boolean|symbol>(value:T): ZodLiteral<T>
z.custom<T>(check?: (val:any)=>boolean, params?): ZodCustom<T>
z.lazy<T>(fn:()=>ZodType<T>): ZodLazy<T>
z.promise<T extends ZodType>(schema:T): ZodPromise<T>
z.instanceof<T>(cls: new (...args:any)=>T): ZodInstanceOf<T>
z.function(): ZodFunction
  .args(...schemas: ZodType[]): ZodFunction
  .returns(schema: ZodType): ZodFunction
  .implement(fn: (...args:any)=>any): (...args:any)=>any
  .parameters(): ZodTuple<any>
  .returnType(): ZodType

Schema Methods:
.parse(data: unknown): Output
.parseAsync(data: unknown): Promise<Output>
.safeParse(data: unknown): { success: true; data: Output } | { success: false; error: ZodError }
.safeParseAsync(data: unknown): Promise<SafeParseReturn>
.refine(check, params)
.superRefine((val, ctx)=>void)
.transform(fn)
.preprocess(fn, schema)

Error Codes and Messages inline with methods. Default unknownKeys policy: strip.

Implementation Patterns:
• Compose schemas for nested data.
• Use .strict or .passthrough to control extra data.
• Use z.coerce for input normalization before validation.
• Use .safeParse for runtime error handling.
• Use .parseAsync for async refinements.

Best Practices:
• Enable TS strict mode.
• Reuse schemas via .extend or merging.
• Leverage discriminated unions for tagged data.
• Use .superRefine for cross-field validation.

Troubleshooting:
Command: node -e "console.log(require('zod').z.string().safeParse(123))"
Expected: { success: false, error: ZodError }
Verify TS config: tsc --showConfig | grep strict


## Information Dense Extract
Zod v4.5+ TS4.5+strict. import {z}from'zod'; z.string():ZodString; .parse(input):Output; .safeParse(input):{success,data}|{success,error}; z.number(),z.boolean(),z.bigint(),z.date(),z.undefined(),z.null(),z.void(),z.any(),z.unknown(),z.never(); z.coerce.<type>() uses JS constructors; String,Number,Boolean,BigInt,new Date; z.string().min(n,{msg}),.max(n),.length(n),.email(),.url(),.uuid(),.regex(rx),.datetime({offset,bool,precision}),.date(),.time({precision}); .trim(),.toLowerCase(),.toUpperCase(); z.object(shape).extend(),.merge(),.pick(),.omit(),.partial(),.required(),.passthrough(),.strict(),.strip(),.catchall(schema); z.array(schema).min(n),.max(n),.length(n),.nonempty(); z.tuple([...]).rest(schema); z.union([...]),.or(); z.discriminatedUnion(key,options); z.intersection(a,b),.and(); z.record(keySchema,valueSchema); z.map(),z.set().min(),.max(),.size(); z.literal(val),z.nativeEnum(Enum),z.custom<T>(fn),z.lazy(fn),z.promise(),z.instanceof(Class),z.function().args(...).returns(schema).implement(fn); Effects: .refine(check,params),.superRefine((v,ctx)=>),.transform(fn),z.preprocess(fn,schema); Async: .parseAsync(),.safeParseAsync(); Default unknownKeys=strip; .strict to error, .passthrough to keep. Deep clone returned. Best practices: strict TS, reuse schemas, discriminated unions, cross-field .superRefine. Troubleshoot via node eval and tsc strict check.

## Sanitised Extract
Table of Contents
1 Installation
2 Schema Creation & Parsing
3 Primitive & Coercion
4 String Validation & Transforms
5 Object Schema Methods
6 Array & Tuple Schemas
7 Unions & Discriminated Unions
8 Record, Map, Set
9 Intersection & Merge
10 Recursive Types
11 Effects: refine, transform, preprocess
12 Function Schemas

1 Installation
Requirements: TS 4.5+, strict mode ('strict': true). Install: npm install zod

2 Schema Creation & Parsing
import { z } from 'zod';
const S = z.string();
S.parse(data): throws ZodError or returns string
S.safeParse(data): { success:true,data } or { success:false,error }
S.parseAsync for async effects

3 Primitive & Coercion
z.string(): ZodString
z.number(): ZodNumber
z.boolean(): ZodBoolean
z.date(): ZodDate
z.bigint(): ZodBigInt
z.undefined(), z.null(), z.void(), z.any(), z.unknown(), z.never()
z.coerce.string() -> String(input)
z.coerce.number() -> Number(input)
z.coerce.boolean() -> Boolean(input)
z.coerce.date() -> new Date(input)

4 String Validation & Transforms
z.string().min( min:number, { message } )
z.string().max( max:number, { message } )
z.string().length( len:number )
z.string().email( { message } )
z.string().url()
z.string().uuid()
z.string().regex( regex:RegExp, { message } )
z.string().datetime({ offset:boolean, local:boolean, precision:number })
z.string().date()
z.string().time({ precision:number })
z.string().trim(), .toLowerCase(), .toUpperCase()
Custom error: z.string({ required_error, invalid_type_error })

5 Object Schema Methods
const Obj = z.object({ a:z.string(), b:z.number() });
Obj.shape.a // ZodString
Obj.extend({ c:z.boolean() })
Obj.merge(Other)
Obj.pick({ a:true })
Obj.omit({ b:true })
Obj.partial({ a:true })
Obj.required({ b:true })
Obj.passthrough() // allow extra keys
Obj.strict()      // disallow extra keys
Obj.strip()       // default strip unknown keys
Obj.catchall(z.number()) // validate extra keys

6 Array & Tuple Schemas
z.array(z.string()).min( min:number ).max( max:number ).length( len:number )
z.array(z.string()).nonempty({ message })
z.tuple([z.string(), z.number()]).rest(z.boolean())

7 Unions & Discriminated Unions
z.union([A,B])
A.or(B)
z.discriminatedUnion('tag', [ObjA, ObjB])

8 Record, Map, Set
z.record(keySchema:z.ZodType, valueSchema:z.ZodType)
z.map(keySchema, valueSchema)
z.set(valueSchema).min( min:number ).max( max:number ).size( size:number )

9 Intersection & Merge
z.intersection(A,B)
A.and(B)  // alias
A.merge(B)

10 Recursive Types
const Base = z.object({ name:z.string() });
type Node = { name:string; children:Node[] };
const NodeSchema: z.ZodType<Node> = Base.extend({ children: z.lazy(() => NodeSchema.array()) });

11 Effects: refine, transform, preprocess
.schema.refine((val)=>boolean, { message, path })
.schema.superRefine((val,ctx)=>{ ctx.addIssue({ code, message }) })
.schema.transform((val)=>newVal)
z.preprocess((val)=>any, schema)

12 Function Schemas
z.function().args(...schemas).returns(schema).implement(fn)
.schema.parameters() // ZodTuple
.schema.returnType()

## Original Source
Zod Schema Validation
https://github.com/colinhacks/zod

## Digest of ZOD_SCHEMA

# Zod Schema Validation  (retrieved 2024-06-10)

## Installation

Requirements:
• TypeScript 4.5 or higher with strict mode enabled in tsconfig.json.

tsconfig.json
{
  "compilerOptions": {
    "strict": true
  }
}

From npm:
• npm install zod
• yarn add zod
• pnpm add zod

## Basic Usage

Import:
import { z } from "zod";

Create and parse:
const schema = z.string();
schema.parse("hello");      // returns "hello"
schema.safeParse(123);      // { success: false, error: ZodError }

## Primitive Schemas

z.string(): ZodString
z.number(): ZodNumber
z.boolean(): ZodBoolean
z.date(): ZodDate
z.bigint(): ZodBigInt
z.undefined(), z.null(), z.void(), z.any(), z.unknown(), z.never()

### Coercion

z.coerce.string()  // String(input)
z.coerce.number()  // Number(input)
z.coerce.boolean() // Boolean(input)
z.coerce.date()    // new Date(input)

## String Validations

z.string().min(5)    // length ≥5
z.string().max(10)   // length ≤10
z.string().length(8) // length ==8
z.string().email()
z.string().url()
z.string().uuid()
z.string().regex(/[A-Z]/)
z.string().datetime({ offset:true, precision:3, message:"…" })
z.string().date(), z.string().time()
Transforms: .trim(), .toLowerCase(), .toUpperCase()
Custom messages: z.string({ required_error:"…", invalid_type_error:"…" })

## Object Schemas

z.object({ key: z.string(), count: z.number() })
Methods:
• .shape    Access inner schemas
• .extend   Add/overwrite fields
• .merge    Combine objects
• .pick     Select keys
• .omit     Remove keys
• .partial  Make optional
• .required Make required
• .passthrough / .strict / .strip   Control unknown keys
• .catchall Validate all unknown keys

## Array & Tuple

z.array(z.string()).min(1).max(5).length(3).nonempty()
z.tuple([z.string(), z.number()]).rest(z.boolean())

## Unions & Discriminated Unions

z.union([z.string(), z.number()])
z.string().or(z.number())
z.discriminatedUnion("type", [z.object({ type: z.literal("a"), a: z.string() }), z.object({ type: z.literal("b"), b: z.number() })])

## Record, Map, Set

z.record(z.string(), z.number())
z.map(z.string(), z.number())
z.set(z.string()).min(1).max(3).size(2)

## Intersection & Merge

z.intersection(A, B)
A.and(B)
A.merge(B)

## Recursive Types

const Base = z.object({ name: z.string() });
type Node = z.infer<typeof Base> & { children: Node[] };
const NodeSchema: z.ZodType<Node> = Base.extend({ children: z.lazy(() => NodeSchema.array()) });

## Effects & Transforms

.refine(fn, { message, path, params })
.superRefine((val, ctx) => { ctx.addIssue({ code:"custom", message:"…" }); })
.transform(fn)
.preprocess(fn, schema)

## Function Schemas

z.function().args(z.string(), z.number()).returns(z.boolean()).implement((s, n) => s.length > n)
.parse, .parseAsync, .safeParse, .spa

## Error Handling

.parse throws ZodError
.safeParse returns { success, data } or { success, error }

## Utilities

z.literal(value), z.nativeEnum(Enum), z.any(), z.unknown(), z.never(), z.jsonType via z.lazy union



## Attribution
- Source: Zod Schema Validation
- URL: https://github.com/colinhacks/zod
- License: License: MIT
- Crawl Date: 2025-05-09T23:10:44.876Z
- Data Size: 895806 bytes
- Links Found: 6138

## Retrieved
2025-05-09
