# ZOD_LIBRARY

## Crawl Summary
Zod documentation technical details including installation commands, schema creation, primitive types, coercion methods, literal values, string validations and transforms, datetime and date/time validations with precision and offset options, IP address and CIDR validations, number and bigint validations, optional and nullable schemas, object schema methods (shape, keyof, extend, merge, pick, omit, partial, deepPartial, required, passthrough, strict, strip, catchall), array and tuple definitions, union and discriminated union schemas, record, map, set, intersection, recursive types, ZodEffects with refine and transform, JSON schema, promise validations, instance checking, function schemas with args and returns, preprocessing, custom schemas, and complete schema methods (.parse, .parseAsync, .safeParse, .spa, .refine).

## Normalised Extract
Table of Contents:
  1. Installation
     - Requirements: TypeScript 4.5+, strict mode.
     - Commands: npm install zod, yarn add zod, etc. (including canary installations).
  2. Basic Usage
     - String schema: z.string(); parse and safeParse methods.
     - Object schema: z.object({ username: z.string() }); type extraction using z.infer.
  3. Primitives & Coercion
     - Primitive types: z.string(), z.number(), z.bigint(), etc.
     - Coercion: z.coerce.string() uses String(input), similar for number, boolean, bigint, date.
  4. Literals
     - Using z.literal() for fixed values, retrieval using .value.
  5. Strings
     - Validations: max, min, length, email, url, regex, includes, startsWith, endsWith, uuid, nanoid, cuid, cuid2, ulid.
     - Transforms: trim, toLowerCase, toUpperCase.
     - Additional validators: datetime, date, time, duration, base64 with custom error messages.
  6. DateTime, Date, and Time
     - Datetime: z.string().datetime({ offset: optional, local: optional, precision: optional}).
     - Date: z.string().date(); Time: z.string().time({ precision: ... }).
  7. IP Addresses & CIDR
     - z.string().ip({ version: "v4" or "v6" });
     - CIDR: z.string().cidr({ version: "v4" or "v6" }).
  8. Numbers and BigInts
     - Number validations: gt, gte, lt, lte, int, positive, nonnegative, negative, nonpositive, multipleOf, finite, safe.
     - BigInt validations: same as numbers with bigint literals.
  9. Optionals and Nullables
     - z.string().optional(), z.nullable(z.string()), and methods .unwrap().
  10. Objects
      - Create with z.object({ ... }). Methods: .shape, .keyof, .extend, .merge, .pick, .omit, .partial, .deepPartial, .required, .passthrough, .strict, .strip, .catchall.
  11. Arrays and Tuples
      - Arrays: z.array(type) or type.array(), with nonempty, min, max, length.
      - Tuples: z.tuple([...]) with .rest for variadic support.
  12. Unions & Discriminated Unions
      - z.union([...]) and .or; discriminated unions via z.discriminatedUnion using a key.
  13. Records, Maps, Sets, Intersections
      - Record: z.record(keySchema, valueSchema);
      - Maps: z.map(key, value);
      - Sets: z.set(type) with constraints.
      - Intersections: z.intersection(A, B) or merge for objects.
  14. Recursive Types
      - Using z.lazy(() => schema.array()) to define recursive structures.
  15. ZodEffects and JSON
      - Refinements via .refine, transformations with .transform, custom effects with z.ZodType.
      - JSON schema: union of primitives, arrays, and records implemented with z.lazy.
  16. Promises, Instanceof, Functions
      - Promise schemas: z.promise(z.number()); synchronous check and .then validation.
      - Instanceof: z.instanceof(Class).
      - Functions: z.function(), .args(), .returns(), .implement(), and extraction via .parameters(), .returnType().
  17. Preprocess and Custom Schemas
      - z.preprocess for input transformation.
      - z.custom with template literal types.
  18. Schema Methods
      - Core methods: .parse(data), .parseAsync(data), .safeParse(data), .safeParseAsync (spa), and .refine with detailed options.

Each section includes exact code examples, parameter values, configuration options (e.g., { offset: true } for datetime), and method signatures, providing a complete set of implementation details.


## Supplementary Details
Installation requires TypeScript 4.5+ with strict mode enabled. Zod’s coercion uses built-in constructors (e.g., String(), Number(), Boolean(), BigInt(), new Date()). Method examples include:
- z.string().min(5, { message: 'Must be 5 or more characters long' })
- z.date().min(new Date('1900-01-01'), { message: 'Too old' })
- z.string().datetime({ offset: true, precision: 3 })

Object schema manipulation methods with full examples:
- .extend: Dog.extend({ breed: z.string() })
- .merge: BaseTeacher.merge(HasID)
- .pick/.omit: Recipe.pick({ name: true }), Recipe.omit({ id: true })
- .partial and .deepPartial for optional properties

Function schema example:
const myFunction = z.function().args(z.string(), z.number()).returns(z.boolean());

Coercion and preprocessing with z.preprocess((val) => String(val), z.string()).

Recursive schemas using z.lazy(() => schema.array()).

Detailed troubleshooting: Use .safeParse to obtain error objects with ZodError; for async schemas, use .parseAsync and handle rejections. All validations return cloned and type-inferred objects.


## Reference Details
API Specifications:

1. z.string(): Schema<string>
   - Methods: .min(limit: number, options?: { message?: string }), .max(limit: number, options?: { message?: string }), .regex(pattern: RegExp, options?: { message?: string }), .email(options?: { message?: string }), .url(options?: { message?: string }), .datetime(options?: { offset?: boolean, local?: boolean, precision?: number, message?: string })

2. z.number(): Schema<number>
   - Methods: .gt(value: number), .gte(value: number), .lt(value: number), .lte(value: number, options?: { message?: string }), .int(), .positive(), .nonnegative(), .negative(), .nonpositive(), .multipleOf(value: number)

3. z.object({ ... }): Schema<object>
   - Methods: .shape, .keyof, .extend, .merge, .pick, .omit, .partial, .deepPartial, .required, .passthrough, .strict, .strip, .catchall

4. z.union([schema1, schema2, ...]): Schema<T>
   - Alternative: schema1.or(schema2)

5. z.discriminatedUnion(discriminator: string, options: Array<ZodObject>): Schema<T>

6. z.array(schema): Schema<Array<T>>
   - Methods: .nonempty(options?: { message?: string }), .min(n: number), .max(n: number), .length(n: number)

7. z.tuple([schema, ...]): Schema<[T, ...]>
   - .rest(schema) for variadic tuples

8. z.promise(schema): Schema<Promise<T>>

9. z.function(): Schema<Function>
   - .args(...schemas), .returns(schema), .implement(fn), .parameters(), .returnType()

10. z.coerce.<type>(): Coerced schema using native constructors

11. z.preprocess(preprocessor: (data: unknown) => unknown, schema): Returns ZodEffects instance

12. z.custom<T>(validator: (data: unknown) => boolean, errorMessage?: string): Schema<T>

SDK Method Signatures:
- parse(data: unknown): T
- parseAsync(data: unknown): Promise<T>
- safeParse(data: unknown): { success: true, data: T } | { success: false, error: ZodError }

Code Examples:
// String Schema Example:
import { z } from "zod";
const mySchema = z.string().min(5, { message: "Minimum length is 5" });
mySchema.parse("hello");

// Object Schema Example:
const User = z.object({ username: z.string() });
User.parse({ username: "JohnDoe" });

type User = z.infer<typeof User>;

Configuration Options:
- For datetime: { offset: true } allows timezone offsets; { local: true } allows timezone-less strings; { precision: number } restricts sub-second precision.
- For IP and CIDR: { version: "v4" } or { version: "v6" }.

Troubleshooting Procedures:
- Use safeParse to prevent thrown errors and inspect ZodError details.
- For async validations, attach .catch to handle rejection and log exact error messages.
- Ensure correct input types: parse returns a cloned object; if input type mismatches, customize messages using required_error and invalid_type_error.

Best Practices:
- Always enable strict mode in tsconfig.json.
- Use .partial and .deepPartial for optional properties.
- Use .preprocess for type coercion where needed.

Detailed Command Example:
> npm install zod
> tsc --strict
> node index.js

Expected output: Validated and type-safe data structures with no runtime errors.


## Information Dense Extract
TS 4.5+ required; strict tsconfig. Install: npm install zod/yarn add zod; Usage: z.string(), z.number(), z.object({...}), z.union, z.discriminatedUnion; Methods: .min, .max, .regex, .email, .url, .datetime({offset,local,precision}); Object methods: .shape, .keyof, .extend, .merge, .pick, .omit, .partial, .deepPartial, .required, .passthrough, .strict, .strip, .catchall; Arrays: z.array(type) with .nonempty, .min, .max, .length; Tuples: z.tuple([...]).rest; Recursion: z.lazy(() => schema.array()); Functions: z.function().args(...).returns(...).implement(fn); Promises: z.promise(schema); Preprocess: z.preprocess(fn, schema); Custom: z.custom<T>(validator, message); API Signature: parse(data:unknown):T, parseAsync(data:unknown):Promise<T>, safeParse(data:unknown):{success, data|error}; Coercion: z.coerce.string() uses String(input); IP: z.string().ip({version:'v4'|'v6'}), CIDR similarly. Best practices include using safeParse and detailed error messages.

## Sanitised Extract
Table of Contents:
  1. Installation
     - Requirements: TypeScript 4.5+, strict mode.
     - Commands: npm install zod, yarn add zod, etc. (including canary installations).
  2. Basic Usage
     - String schema: z.string(); parse and safeParse methods.
     - Object schema: z.object({ username: z.string() }); type extraction using z.infer.
  3. Primitives & Coercion
     - Primitive types: z.string(), z.number(), z.bigint(), etc.
     - Coercion: z.coerce.string() uses String(input), similar for number, boolean, bigint, date.
  4. Literals
     - Using z.literal() for fixed values, retrieval using .value.
  5. Strings
     - Validations: max, min, length, email, url, regex, includes, startsWith, endsWith, uuid, nanoid, cuid, cuid2, ulid.
     - Transforms: trim, toLowerCase, toUpperCase.
     - Additional validators: datetime, date, time, duration, base64 with custom error messages.
  6. DateTime, Date, and Time
     - Datetime: z.string().datetime({ offset: optional, local: optional, precision: optional}).
     - Date: z.string().date(); Time: z.string().time({ precision: ... }).
  7. IP Addresses & CIDR
     - z.string().ip({ version: 'v4' or 'v6' });
     - CIDR: z.string().cidr({ version: 'v4' or 'v6' }).
  8. Numbers and BigInts
     - Number validations: gt, gte, lt, lte, int, positive, nonnegative, negative, nonpositive, multipleOf, finite, safe.
     - BigInt validations: same as numbers with bigint literals.
  9. Optionals and Nullables
     - z.string().optional(), z.nullable(z.string()), and methods .unwrap().
  10. Objects
      - Create with z.object({ ... }). Methods: .shape, .keyof, .extend, .merge, .pick, .omit, .partial, .deepPartial, .required, .passthrough, .strict, .strip, .catchall.
  11. Arrays and Tuples
      - Arrays: z.array(type) or type.array(), with nonempty, min, max, length.
      - Tuples: z.tuple([...]) with .rest for variadic support.
  12. Unions & Discriminated Unions
      - z.union([...]) and .or; discriminated unions via z.discriminatedUnion using a key.
  13. Records, Maps, Sets, Intersections
      - Record: z.record(keySchema, valueSchema);
      - Maps: z.map(key, value);
      - Sets: z.set(type) with constraints.
      - Intersections: z.intersection(A, B) or merge for objects.
  14. Recursive Types
      - Using z.lazy(() => schema.array()) to define recursive structures.
  15. ZodEffects and JSON
      - Refinements via .refine, transformations with .transform, custom effects with z.ZodType.
      - JSON schema: union of primitives, arrays, and records implemented with z.lazy.
  16. Promises, Instanceof, Functions
      - Promise schemas: z.promise(z.number()); synchronous check and .then validation.
      - Instanceof: z.instanceof(Class).
      - Functions: z.function(), .args(), .returns(), .implement(), and extraction via .parameters(), .returnType().
  17. Preprocess and Custom Schemas
      - z.preprocess for input transformation.
      - z.custom with template literal types.
  18. Schema Methods
      - Core methods: .parse(data), .parseAsync(data), .safeParse(data), .safeParseAsync (spa), and .refine with detailed options.

Each section includes exact code examples, parameter values, configuration options (e.g., { offset: true } for datetime), and method signatures, providing a complete set of implementation details.

## Original Source
Zod Validation Library Documentation
https://github.com/colinhacks/zod

## Digest of ZOD_LIBRARY

# Zod Library Documentation

Retrieved on 2023-10-06

# Introduction
Zod is a TypeScript-first schema declaration and validation library with static type inference. It is designed for developer-friendly usage with features such as zero dependencies, immutability, and a concise, chainable interface. It supports plain JavaScript as well as TypeScript.

# Installation

## Requirements
- TypeScript 4.5+ with "strict": true in tsconfig.json

## Installation Commands
- npm: npm install zod
- deno: deno add npm:zod
- yarn: yarn add zod
- bun: bun add zod
- pnpm: pnpm add zod

For canary: npm install zod@canary, etc.

# Basic Usage

## Creating Schemas

Example for string schema:

import { z } from "zod";

const mySchema = z.string();

// Parsing
mySchema.parse("tuna"); // returns "tuna"
mySchema.parse(12); // throws ZodError

// Safe parsing
mySchema.safeParse("tuna"); // { success: true, data: "tuna" }
mySchema.safeParse(12); // { success: false, error: ZodError }

## Object Schema

import { z } from "zod";

const User = z.object({
  username: z.string(),
});

User.parse({ username: "Ludwig" });

type User = z.infer<typeof User>; // { username: string }

# Primitives

z.string();
z.number();
z.bigint();
z.boolean();
z.date();
z.symbol();

z.undefined();
z.null();
z.void();

z.any();
z.unknown();
z.never();

# Coercion for Primitives

const schema = z.coerce.string();

schema.parse("tuna"); // "tuna"
schema.parse(12); // "12"

// Coercion uses built-in constructors
z.coerce.string(); // String(input)
z.coerce.number(); // Number(input)
z.coerce.boolean(); // Boolean(input)
z.coerce.bigint(); // BigInt(input)
z.coerce.date(); // new Date(input)

# Literals

const tuna = z.literal("tuna");
const twelve = z.literal(12);
const twobig = z.literal(2n);
const tru = z.literal(true);

// Retrieve literal value
// tuna.value returns "tuna"

# Strings

// Validations
z.string().max(5);
z.string().min(5);
z.string().length(5);
z.string().email();
z.string().url();
z.string().emoji();
z.string().uuid();
z.string().nanoid();
z.string().cuid();
z.string().cuid2();
z.string().ulid();
z.string().regex(regex);
z.string().includes(string);
z.string().startsWith(string);
z.string().endsWith(string);
z.string().datetime();
z.string().ip();
z.string().cidr();

// Transforms
z.string().trim();
z.string().toLowerCase();
z.string().toUpperCase();

// Additional validations in Zod 3.23
z.string().date();
z.string().time();
z.string().duration();
z.string().base64();

// Custom error messages
const name = z.string({
  required_error: "Name is required",
  invalid_type_error: "Name must be a string"
});

z.string().min(5, { message: "Must be 5 or more characters long" });

# Datetimes

// ISO 8601 validation, no offsets by default
const datetime = z.string().datetime();

datetime.parse("2020-01-01T00:00:00Z");
datetime.parse("2020-01-01T00:00:00.123Z");

datetime.parse("2020-01-01T00:00:00+02:00"); // fails unless offset allowed

// Allow offsets
const datetimeWithOffset = z.string().datetime({ offset: true });

datetimeWithOffset.parse("2020-01-01T00:00:00+02:00");

datetimeWithOffset.parse("2020-01-01T00:00:00.123+02:00");

// Local datetime
const localDatetime = z.string().datetime({ local: true });
localDatetime.parse("2020-01-01T00:00:00");

// Constrain precision
const preciseDatetime = z.string().datetime({ precision: 3 });

preciseDatetime.parse("2020-01-01T00:00:00.123Z");

# Dates and Times

// Date format YYYY-MM-DD
const dateSchema = z.string().date();
dateSchema.parse("2020-01-01");

// Time format HH:MM:SS[.s+]
const timeSchema = z.string().time();
timeSchema.parse("23:59:59.9999999");

// Time with precision
const timePrecise = z.string().time({ precision: 3 });

timePrecise.parse("00:00:00.123");

# IP Addresses and CIDR

const ip = z.string().ip();
ip.parse("192.168.1.1");

// Specify version
const ipv4 = z.string().ip({ version: "v4" });
const ipv6 = z.string().ip({ version: "v6" });

// CIDR validations
const cidr = z.string().cidr();
cidr.parse("192.168.0.0/24");

const ipv4Cidr = z.string().cidr({ version: "v4" });
const ipv6Cidr = z.string().cidr({ version: "v6" });

# Numbers

const age = z.number({
  required_error: "Age is required",
  invalid_type_error: "Age must be a number"
});

z.number().gt(5);
z.number().gte(5);
z.number().lt(5);
z.number().lte(5);
z.number().int();
z.number().positive();
z.number().nonnegative();
z.number().negative();
z.number().nonpositive();
z.number().multipleOf(5);
z.number().finite();
z.number().safe();

z.number().lte(5, { message: "this👏is👏too👏big" });

# BigInts

z.bigint().gt(5n);
z.bigint().gte(5n);
z.bigint().lt(5n);
z.bigint().lte(5n);
z.bigint().positive();
z.bigint().nonnegative();
z.bigint().negative();
z.bigint().nonpositive();
z.bigint().multipleOf(5n);

# NaNs

const isNaN = z.nan({
  required_error: "isNaN is required",
  invalid_type_error: "isNaN must be 'not a number'"
});

# Booleans

const isActive = z.boolean({
  required_error: "isActive is required",
  invalid_type_error: "isActive must be a boolean"
});

# Dates (z.date and coercion)

z.date().safeParse(new Date());

const myDateSchema = z.date({
  required_error: "Please select a date and time",
  invalid_type_error: "That's not a date!"
});

z.date().min(new Date("1900-01-01"), { message: "Too old" });
z.date().max(new Date(), { message: "Too young!" });

// Coercion to Date
const dateCoerceSchema = z.coerce.date();

# Enums

const FishEnum = z.enum(["Salmon", "Tuna", "Trout"]);

type FishEnum = z.infer<typeof FishEnum>; // 'Salmon' | 'Tuna' | 'Trout'

// Native enums

enum Fruits {
  Apple,
  Banana,
}

const FruitEnum = z.nativeEnum(Fruits);

// Using const objects
const ConstFruits = {
  Apple: "apple",
  Banana: "banana",
  Cantaloupe: 3
} as const;

const FruitEnumConst = z.nativeEnum(ConstFruits);

# Optionals and Nullables

const optionalString = z.string().optional();

const user = z.object({
  username: z.string().optional(),
});

type C = z.infer<typeof user>;

const nullableString = z.nullable(z.string());
const E = z.string().nullable();

# Objects

const Dog = z.object({
  name: z.string(),
  age: z.number()
});

type Dog = z.infer<typeof Dog>;

// Methods:
// .shape
Dog.shape.name;
Dog.shape.age;

// .keyof
const keySchema = Dog.keyof();

// .extend
const DogWithBreed = Dog.extend({
  breed: z.string()
});

// .merge
const BaseTeacher = z.object({ students: z.array(z.string()) });
const HasID = z.object({ id: z.string() });
const Teacher = BaseTeacher.merge(HasID);

type Teacher = z.infer<typeof Teacher>;

// .pick / .omit
const Recipe = z.object({
  id: z.string(),
  name: z.string(),
  ingredients: z.array(z.string())
});

const JustTheName = Recipe.pick({ name: true });
const NoIDRecipe = Recipe.omit({ id: true });

// .partial and .deepPartial
const userPartial = z.object({
  email: z.string(),
  username: z.string()
}).partial();

const userDeep = z.object({
  username: z.string(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number()
  }),
  strings: z.array(z.object({ value: z.string() }))
});

const deepPartialUser = userDeep.deepPartial();

// .required
const requiredUser = userPartial.required();

// .passthrough, .strict, .strip, .catchall
const person = z.object({
  name: z.string()
});

person.passthrough().parse({ name: "bob dylan", extraKey: 61 });

const strictPerson = z.object({ name: z.string() }).strict();

strictPerson.parse({ name: "bob dylan", extraKey: 61 }); // throws ZodError

const personCatchall = z.object({ name: z.string() }).catchall(z.number());

# Arrays

const stringArray = z.array(z.string());
const altStringArray = z.string().array();

// .element
stringArray.element;

// .nonempty
const nonEmptyStrings = z.string().array().nonempty({ message: "Can't be empty!" });

// .min, .max, .length
z.string().array().min(5);
z.string().array().max(5);
z.string().array().length(5);

# Tuples

const athleteSchema = z.tuple([
  z.string(),
  z.number(),
  z.object({ pointsScored: z.number() })
]);

type Athlete = z.infer<typeof athleteSchema>;

const variadicTuple = z.tuple([z.string()]).rest(z.number());

# Unions

const stringOrNumber = z.union([z.string(), z.number()]);

// Using .or
const altStringOrNumber = z.string().or(z.number());

// Optional string URL
const optionalUrl = z.union([
  z.string().url().nullish(),
  z.literal("")
]);

# Discriminated Unions

const myUnion = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success"), data: z.string() }),
  z.object({ status: z.literal("failed"), error: z.instanceof(Error) })
]);

# Records

const UserRecord = z.object({ name: z.string() });
const UserStore = z.record(z.string(), UserRecord);

type UserStore = z.infer<typeof UserStore>;

# Maps and Sets

const stringNumberMap = z.map(z.string(), z.number());
const numberSet = z.set(z.number());

// Set constraints
z.set(z.string()).nonempty();
z.set(z.string()).min(5);
z.set(z.string()).max(5);
z.set(z.string()).size(5);

# Intersections

const Person = z.object({ name: z.string() });
const Employee = z.object({ role: z.string() });
const EmployedPerson = z.intersection(Person, Employee);

// Alternatively
const combined = Person.merge(Employee);

# Recursive Types

const baseCategorySchema = z.object({ name: z.string() });

type Category = z.infer<typeof baseCategorySchema> & { subcategories: Category[] };

const categorySchema = baseCategorySchema.extend({
  subcategories: z.lazy(() => categorySchema.array())
});

categorySchema.parse({
  name: "People",
  subcategories: [
    {
      name: "Politicians",
      subcategories: [
        { name: "Presidents", subcategories: [] }
      ]
    }
  ]
});

# ZodEffects and Transformations

// ZodEffects used with .refine, .transform, etc.
const isValidId = (id: string): id is `${string}/${string}` => id.split("/").length === 2;

const baseSchema = z.object({
  id: z.string().refine(isValidId)
});

type Input = z.input<typeof baseSchema> & { children: Input[] };
type Output = z.output<typeof baseSchema> & { children: Output[] };

const effectSchema: z.ZodType<Output, z.ZodTypeDef, Input> = baseSchema.extend({
  children: z.lazy(() => effectSchema.array())
});

// JSON Schema
const literalSchema = z.union([
  z.string(), z.number(), z.boolean(), z.null()
]);

type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];

const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

# Promises

const numberPromise = z.promise(z.number());

numberPromise.parse(Promise.resolve(3.14));

// Example async validation
const test = async () => {
  await numberPromise.parse(Promise.resolve(3.14));
  // Throws error if non-number
};

# Instanceof

class Test {
  name: string;
}

const TestSchema = z.instanceof(Test);

TestSchema.parse(new Test());

# Functions

// Basic function schema
const funcSchema = z.function();

// Define inputs and outputs
const myFunction = z.function()
  .args(z.string(), z.number())
  .returns(z.boolean());

type myFunctionType = z.infer<typeof myFunction>; // (arg0: string, arg1: number) => boolean

// Implement with validation
const trimmedLength = z.function()
  .args(z.string())
  .returns(z.number())
  .implement((x) => x.trim().length);

// Extract parameter and return schemas
const params = myFunction.parameters();
const returnType = myFunction.returnType();

# Preprocess

const castToString = z.preprocess((val) => String(val), z.string());

# Custom Schemas

const px = z.custom<`${number}px`>((val) => {
  return typeof val === "string" ? /^\d+px$/.test(val) : false;
});

px.parse("42px"); // returns "42px"

# Schema Methods

// .parse(data: unknown): T
// .parseAsync(data: unknown): Promise<T>
// .safeParse(data: unknown): { success: true, data: T } | { success: false, error: ZodError }
// .safeParseAsync (.spa)
// .refine for custom validation

const customSchema = z.string().refine(
  (val) => val.length <= 255,
  { message: "String can't be more than 255 characters" }
);


## Attribution
- Source: Zod Validation Library Documentation
- URL: https://github.com/colinhacks/zod
- License: License: MIT
- Crawl Date: 2025-04-25T19:42:44.709Z
- Data Size: 859946 bytes
- Links Found: 5868

## Retrieved
2025-04-25
