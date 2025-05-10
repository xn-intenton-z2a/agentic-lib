sandbox/library/GITHUB_GRAPHQL.md
# sandbox/library/GITHUB_GRAPHQL.md
# GITHUB_GRAPHQL

## Crawl Summary
Endpoint: POST https://api.github.com/graphql with header Authorization: bearer <token> and Content-Type: application/json. Authentication uses OAuth or App tokens with scopes public_repo, repo, read:org, user. Schema introspection via __schema query or downloaded schema.docs.graphql. Rate limit: 5000 points/hour; cost per field=1 point; headers X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset. Pagination: use connection args first, after, last, before; pageInfo returns endCursor, hasNextPage.

## Normalised Extract
Table of Contents:
1. Authentication
2. Endpoint Configuration
3. Schema Introspection
4. Rate Limits
5. Pagination Usage

1. Authentication
- Header: Authorization: bearer <token>
- Token types: OAuth user token, GitHub App installation token
- Required scopes: public_repo, repo, read:org, user

2. Endpoint Configuration
- URL: https://api.github.com/graphql
- HTTP Method: POST
- Headers:
  - Content-Type: application/json
  - Authorization: bearer <token>
- Request body: { "query": <GraphQL query string>, "variables": { ... } }

3. Schema Introspection
- Introspection query: __schema { types { name kind fields { name type { name kind ofType { name kind } } } } queryType { name } mutationType { name } }
- Download schema: GET schema.docs.graphql
- Tooling: use GraphQL Explorer or graphql-cli introspect

4. Rate Limits
- Limit: 5000 points per hour
- Cost calculation: one point per object field returned
- Headers:
  - X-RateLimit-Limit: total points
  - X-RateLimit-Remaining: available points
  - X-RateLimit-Reset: epoch seconds when resets
- Enforcement: queries exceeding points are rejected with error code RATE_LIMITED

5. Pagination Usage
- Connection arguments on fields returning lists:
  - first: Int, after: String
  - last: Int, before: String
- PageInfo fields:
  - hasNextPage: Boolean
  - hasPreviousPage: Boolean
  - startCursor: String
  - endCursor: String
- Example usage: repositories(first:50, after: $cursor)



## Supplementary Details
Authentication Implementation Steps:
1. Generate OAuth token or App installation token with required scopes.
2. Configure GraphQL client header Authorization: bearer <token>.
3. Validate token by running a simple query: { viewer { login } }.

Error Handling:
- 401 Unauthorized: invalid/missing token
- 403 Forbidden: missing scope or rate limit exceed
- Errors returned in JSON under errors array with message, type, path

Default Scopes and Effects:
- public_repo: read/write public repos
- repo: full control private repos
- read:org: read organization data
- user: read/write user profile

Client Configuration Options:
- HTTP timeout default: 30s
- Retries: 3 attempts with exponential backoff
- Logging: request/response logging enabled by setting DEBUG=graphql

Implementation Patterns:
- Persist queries to reduce cost
- Batch smaller queries into single request
- Cache schema locally for offline validation
- Use pagination cursors to traverse large lists


## Reference Details
API Specifications:

Queries:
- viewer: returns User
  signature: viewer: User!
- repository(owner: String!, name: String!): Repository
  signature: repository(owner:String!, name:String!): Repository

Mutations:
- addComment(input: AddCommentInput!): AddCommentPayload
  AddCommentInput fields:
    - subjectId: ID! (issue or pull request)
    - body: String! (comment text)
  AddCommentPayload fields:
    - commentEdge: IssueCommentEdge
    - subject: Node

Connections and Pagination:
- <Type>Connection arguments:
    first: Int
    after: String
    last: Int
    before: String
  PageInfo:
    - hasNextPage: Boolean!
    - hasPreviousPage: Boolean!
    - startCursor: String
    - endCursor: String

Full Code Example (Node.js):
import { GraphQLClient } from 'graphql-request'
const client = new GraphQLClient('https://api.github.com/graphql', {
  headers: { Authorization: `bearer ${process.env.GITHUB_TOKEN}` }
})

const GET_REPOS = `query($cursor:String){ viewer{ repositories(first:50, after:$cursor){ edges{ cursor node{ name url } } pageInfo{ endCursor hasNextPage } } } }`

async function listAllRepos(){
  let cursor = null
  let all = []
  do{
    const data = await client.request(GET_REPOS, { cursor })
    data.viewer.repositories.edges.forEach(e=>all.push(e.node))
    cursor = data.viewer.repositories.pageInfo.hasNextPage ? data.viewer.repositories.pageInfo.endCursor : null
  } while(cursor)
  return all
}

Best Practices:
- Persist queries via GraphQL persisted operations to save cost and speed
- Validate queries against local schema before sending
- Use HTTP2 protocol for multiplexing
- Log cost per request by inspecting X-RateLimit-Remaining

Troubleshooting Procedures:
1. Check connectivity: curl -I https://api.github.com/graphql
   Expect: HTTP/2 200
2. Test auth: curl -X POST -H 'Authorization: bearer $TOKEN' -d '{"query":"{viewer{login}}"}' https://api.github.com/graphql
   Expect JSON { data:{ viewer:{ login:"username" } } }
3. Inspect rate limit: curl -H 'Authorization: bearer $TOKEN' https://api.github.com/rate_limit
   Validate limit.core.remaining >0
4. Schema mismatch: run graphql-cli introspect --endpoint https://api.github.com/graphql


## Information Dense Extract
Auth: header Authorization: bearer <token> (scopes: public_repo, repo, read:org, user). Endpoint: POST https://api.github.com/graphql Content-Type: application/json. Introspect: __schema query or download schema.docs.graphql. Rate limit: 5000 points/hour; cost=fields count; headers X-RateLimit-Limit, -Remaining, -Reset. Pagination: connection args first, after, last, before; pageInfo returns hasNextPage, hasPreviousPage, startCursor, endCursor. Node.js client: graphql-request with retries=3, timeout=30s. Signature examples: query viewer: User!, repo(owner:String!,name:String!):Repository, mutation addComment(input:AddCommentInput!):AddCommentPayload(AddCommentInput{subjectId:ID!,body:String!}). Troubleshoot via curl commands. Persist queries for cost reduction.

## Sanitised Extract
Table of Contents:
1. Authentication
2. Endpoint Configuration
3. Schema Introspection
4. Rate Limits
5. Pagination Usage

1. Authentication
- Header: Authorization: bearer <token>
- Token types: OAuth user token, GitHub App installation token
- Required scopes: public_repo, repo, read:org, user

2. Endpoint Configuration
- URL: https://api.github.com/graphql
- HTTP Method: POST
- Headers:
  - Content-Type: application/json
  - Authorization: bearer <token>
- Request body: { 'query': <GraphQL query string>, 'variables': { ... } }

3. Schema Introspection
- Introspection query: __schema { types { name kind fields { name type { name kind ofType { name kind } } } } queryType { name } mutationType { name } }
- Download schema: GET schema.docs.graphql
- Tooling: use GraphQL Explorer or graphql-cli introspect

4. Rate Limits
- Limit: 5000 points per hour
- Cost calculation: one point per object field returned
- Headers:
  - X-RateLimit-Limit: total points
  - X-RateLimit-Remaining: available points
  - X-RateLimit-Reset: epoch seconds when resets
- Enforcement: queries exceeding points are rejected with error code RATE_LIMITED

5. Pagination Usage
- Connection arguments on fields returning lists:
  - first: Int, after: String
  - last: Int, before: String
- PageInfo fields:
  - hasNextPage: Boolean
  - hasPreviousPage: Boolean
  - startCursor: String
  - endCursor: String
- Example usage: repositories(first:50, after: $cursor)

## Original Source
GitHub REST & GraphQL APIs
https://docs.github.com/en/graphql

## Digest of GITHUB_GRAPHQL

# Authentication

Use HTTP header Authorization: bearer <token> with OAuth or GitHub App token. Required scopes: public_repo for public repositories, repo for private, read:org for organization data, user for user data.

# Endpoint

Method: POST  
URL: https://api.github.com/graphql  
Headers:  
  Content-Type: application/json  
  Authorization: bearer <token>

# Schema Introspection

Run introspection query:  
```graphql
query IntrospectSchema {
  __schema {
    types {
      name
      kind
      fields { name type { name kind ofType { name kind } } }
    }
    queryType { name }
    mutationType { name }
  }
}
```
Public schema downloadable at schema.docs.graphql.

# Rate Limits

GraphQL rate limit = 5000 points per hour.  
Cost per field: each object field=1 point, nested fields increment cost.  
Response headers:  
  X-RateLimit-Limit: 5000  
  X-RateLimit-Remaining: <points left>  
  X-RateLimit-Reset: <unix epoch>

# Pagination

Use connection arguments on list fields:  
  first: Int (items after cursor)  
  after: String (cursor)  
  last: Int (items before cursor)  
  before: String (cursor)  
Example:
```graphql
query ListRepos($cursor:String) {
  viewer { repositories(first:50, after:$cursor) { edges { cursor node { name } } pageInfo { endCursor hasNextPage } } }
}
```

## Attribution
- Source: GitHub REST & GraphQL APIs
- URL: https://docs.github.com/en/graphql
- License: License: CC BY 4.0
- Crawl Date: 2025-05-10T02:24:30.372Z
- Data Size: 2150579 bytes
- Links Found: 16561

## Retrieved
2025-05-10
sandbox/library/GITHUB_APP_AUTH.md
# sandbox/library/GITHUB_APP_AUTH.md
# GITHUB_APP_AUTH

## Crawl Summary
Three authentication flows with exact token types and use cases:  
1. GitHub App authentication uses RS256 JWT signed with your app’s private key to request installation tokens and manage app resources.  
2. Installation authentication uses an installation access token to act as the app on resources owned by the installing account, ideal for noninteractive automation.  
3. User authentication uses a user access token to act on behalf of a user, constrained by user permissions and ideal when user attribution is required.

## Normalised Extract
Table of Contents:
 1. Authentication Modes
   1.1 As GitHub App
   1.2 As App Installation
   1.3 On Behalf of User

1.1 As GitHub App
  • Token Type: JWT
  • Signing Algorithm: RS256
  • Use Cases: Generate installation access tokens; call REST endpoints to manage app registrations and installations.

1.2 As App Installation
  • Token Type: Installation Access Token
  • Issued For: specific installation_id
  • Use Cases: Automation workflows; resource access under the installing account; attribute actions to the app.

1.3 On Behalf of User
  • Token Type: User Access Token
  • Issued Via: web application or device flow
  • Use Cases: Constrain app actions to those permitted for a particular user; attribute actions to a user.

## Supplementary Details
Authentication as App: JWT header must include alg=RS256, typ=JWT; payload must set iat (issued at), exp (max 10 minutes after iat), iss (GitHub App ID).  
Installation Token: scoped to installation_id; bearer token in Authorization: "token <installation_token>" header.  
User Token: returned via OAuth flow; use in Authorization: "token <user_token>" header; expires or refresh per app config.

## Reference Details
API Endpoints & Patterns:
• Create JWT:
  - Sign header {"alg":"RS256","typ":"JWT"} and payload {"iat":<now>,"exp":<now+600>,"iss":<app_id>} with app private key.
• Request Installation Access Token:
  POST https://api.github.com/app/installations/{installation_id}/access_tokens
  Headers:
    Authorization: Bearer <jwt>
    Accept: application/vnd.github.v3+json
  Response: {"token":string,"expires_at":string}

• Use Installation Token:
  Authorization: token <installation_token>
  Example: GET /repos/{owner}/{repo}/issues with header Authorization: token <installation_token>

• Request User Token (Web Flow):
  1. Redirect user to https://github.com/login/oauth/authorize?client_id=<app_client_id>&scope=<scopes>
  2. Exchange code: POST https://github.com/login/oauth/access_token with client_id, client_secret, code
  3. Receive {access_token:string,token_type:bearer,scope:string}

Best Practices:
• Rotate JWT every 5 minutes.  
• Limit JWT exp to ≤10 minutes.  
• Use installation tokens for automation, never JWT directly to modify repository content.  
• Store private keys securely (e.g., AWS KMS, Vault).

Troubleshooting:
• Invalid JWT: check system clock skew <30 s.  
• 401 Unauthorized on installation token: verify installation_id and JWT has correct iss claim.  
• 403 Forbidden: ensure requested scopes/pat match installation permissions.

## Information Dense Extract
modes:app(jwtrs256,iat,exp≤600s,iss=app_id)→GET/POST /app/installations;installation(token)→acts on app-owned resources;user(token via OAuth)→acts on behalf. endpoints:POST /app/installations/{installation_id}/access_tokens auth:Bearer<JW T>→returns {token,expires_at}. use:Authorization:token<installation_token>. JWT gen:header{alg:RS256,typ:JWT},payload{iat,exp,iss}. user flow:redirect→/login/oauth/authorize?client_id=&scope=;exchange code→POST /login/oauth/access_token→{access_token}. best:rotate jwt5m,exp≤10m,store keys secure,installation tokens for repo changes. troubleshoot:clock skew<30s,verify iss,install permissions.

## Sanitised Extract
Table of Contents:
 1. Authentication Modes
   1.1 As GitHub App
   1.2 As App Installation
   1.3 On Behalf of User

1.1 As GitHub App
   Token Type: JWT
   Signing Algorithm: RS256
   Use Cases: Generate installation access tokens; call REST endpoints to manage app registrations and installations.

1.2 As App Installation
   Token Type: Installation Access Token
   Issued For: specific installation_id
   Use Cases: Automation workflows; resource access under the installing account; attribute actions to the app.

1.3 On Behalf of User
   Token Type: User Access Token
   Issued Via: web application or device flow
   Use Cases: Constrain app actions to those permitted for a particular user; attribute actions to a user.

## Original Source
GitHub Apps Authentication
https://docs.github.com/en/developers/apps/authenticating-with-github-apps

## Digest of GITHUB_APP_AUTH

# About Authentication with a GitHub App  (retrieved 2023-11-27)

## Authentication Modes

### 1. Authenticate as a GitHub App
Use a JSON Web Token (JWT) signed by your app’s private key (RS256).  
• Purpose: generate installation access tokens; manage app resources (list installations, update settings).  

### 2. Authenticate as an App Installation
Use an installation access token issued for a specific installation.  
• Purpose: attribute activity to the app; access resources owned by the installing account.  

### 3. Authenticate on Behalf of a User
Use a user access token created via the GitHub App user flow.  
• Purpose: attribute activity to an individual user; constrain actions to user permissions.

---

Attribution: GitHub Docs, Data Size: 611482 bytes, Links Found: 7242, Error: None

## Attribution
- Source: GitHub Apps Authentication
- URL: https://docs.github.com/en/developers/apps/authenticating-with-github-apps
- License: License: CC BY 4.0
- Crawl Date: 2025-05-10T03:33:28.520Z
- Data Size: 611482 bytes
- Links Found: 7242

## Retrieved
2025-05-10
sandbox/library/ZOD_SCHEMA.md
# sandbox/library/ZOD_SCHEMA.md
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
sandbox/library/AWS_POWEROOLS_TS.md
# sandbox/library/AWS_POWEROOLS_TS.md
# AWS_POWEROOLS_TS

## Crawl Summary
Installation commands for each Powertools utility and their npm package names. Table of utilities with descriptions. License MIT-0 and security disclosure channel.

## Normalised Extract
Table of Contents

1. Installation Commands
2. Available Utilities
3. License & Security Disclosures

1. Installation Commands
   - @aws-lambda-powertools/logger: npm install @aws-lambda-powertools/logger
   - @aws-lambda-powertools/metrics: npm install @aws-lambda-powertools/metrics
   - @aws-lambda-powertools/tracer: npm install @aws-lambda-powertools/tracer
   - @aws-lambda-powertools/parameters + @aws-sdk/client-ssm: npm install @aws-lambda-powertools/parameters @aws-sdk/client-ssm
   - @aws-lambda-powertools/idempotency + @aws-sdk/client-dynamodb + @aws-sdk/lib-dynamodb: npm install @aws-lambda-powertools/idempotency @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
   - @aws-lambda-powertools/batch: npm install @aws-lambda-powertools/batch
   - @aws-lambda-powertools/jmespath: npm install @aws-lambda-powertools/jmespath
   - @aws-lambda-powertools/parser + zod@~3: npm install @aws-lambda-powertools/parser zod@~3
   - @aws-lambda-powertools/validation: npm install @aws-lambda-powertools/validation

2. Available Utilities
   Utility             Package                            Description
   Logger              @aws-lambda-powertools/logger      Structured logging with context enrichment
   Metrics             @aws-lambda-powertools/metrics     CloudWatch EMF custom metrics
   Tracer              @aws-lambda-powertools/tracer      Synchronous and asynchronous tracing
   Parameters          @aws-lambda-powertools/parameters  Retrieve SSM, Secrets, AppConfig, DynamoDB parameters
   Idempotency         @aws-lambda-powertools/idempotency Decorator, middleware, wrapper for idempotency
   Batch Processing    @aws-lambda-powertools/batch       Partial failure handling in batch events
   JMESPath Functions  @aws-lambda-powertools/jmespath    JMESPath helpers for JSON decoding
   Parser (Zod)        @aws-lambda-powertools/parser      Event parsing and validation via Zod
   Validation          @aws-lambda-powertools/validation  JSON Schema validation for events/responses

3. License & Security
   License: MIT-0
   Security disclosures: follow AWS security process or aws-powertools-maintainers@amazon.com


## Supplementary Details
- Retrieved Date: 2025-05-06
- License: MIT-0
- Security Disclosure Contact: aws-powertools-maintainers@amazon.com
- Discord Channel: #typescript (invite link available in docs)


## Reference Details
Install commands with exact npm syntax:
npm install @aws-lambda-powertools/logger
npm install @aws-lambda-powertools/metrics
npm install @aws-lambda-powertools/tracer
npm install @aws-lambda-powertools/parameters @aws-sdk/client-ssm
npm install @aws-lambda-powertools/idempotency @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
npm install @aws-lambda-powertools/batch
npm install @aws-lambda-powertools/jmespath
npm install @aws-lambda-powertools/parser zod@~3
npm install @aws-lambda-powertools/validation


## Information Dense Extract
Packages and install commands: logger->@aws-lambda-powertools/logger; metrics->@aws-lambda-powertools/metrics; tracer->@aws-lambda-powertools/tracer; parameters->@aws-lambda-powertools/parameters + @aws-sdk/client-ssm; idempotency->@aws-lambda-powertools/idempotency + @aws-sdk/client-dynamodb + @aws-sdk/lib-dynamodb; batch->@aws-lambda-powertools/batch; jmespath->@aws-lambda-powertools/jmespath; parser->@aws-lambda-powertools/parser + zod@~3; validation->@aws-lambda-powertools/validation; License MIT-0; Security aws-powertools-maintainers@amazon.com

## Sanitised Extract
Table of Contents

1. Installation Commands
2. Available Utilities
3. License & Security Disclosures

1. Installation Commands
   - @aws-lambda-powertools/logger: npm install @aws-lambda-powertools/logger
   - @aws-lambda-powertools/metrics: npm install @aws-lambda-powertools/metrics
   - @aws-lambda-powertools/tracer: npm install @aws-lambda-powertools/tracer
   - @aws-lambda-powertools/parameters + @aws-sdk/client-ssm: npm install @aws-lambda-powertools/parameters @aws-sdk/client-ssm
   - @aws-lambda-powertools/idempotency + @aws-sdk/client-dynamodb + @aws-sdk/lib-dynamodb: npm install @aws-lambda-powertools/idempotency @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
   - @aws-lambda-powertools/batch: npm install @aws-lambda-powertools/batch
   - @aws-lambda-powertools/jmespath: npm install @aws-lambda-powertools/jmespath
   - @aws-lambda-powertools/parser + zod@~3: npm install @aws-lambda-powertools/parser zod@~3
   - @aws-lambda-powertools/validation: npm install @aws-lambda-powertools/validation

2. Available Utilities
   Utility             Package                            Description
   Logger              @aws-lambda-powertools/logger      Structured logging with context enrichment
   Metrics             @aws-lambda-powertools/metrics     CloudWatch EMF custom metrics
   Tracer              @aws-lambda-powertools/tracer      Synchronous and asynchronous tracing
   Parameters          @aws-lambda-powertools/parameters  Retrieve SSM, Secrets, AppConfig, DynamoDB parameters
   Idempotency         @aws-lambda-powertools/idempotency Decorator, middleware, wrapper for idempotency
   Batch Processing    @aws-lambda-powertools/batch       Partial failure handling in batch events
   JMESPath Functions  @aws-lambda-powertools/jmespath    JMESPath helpers for JSON decoding
   Parser (Zod)        @aws-lambda-powertools/parser      Event parsing and validation via Zod
   Validation          @aws-lambda-powertools/validation  JSON Schema validation for events/responses

3. License & Security
   License: MIT-0
   Security disclosures: follow AWS security process or aws-powertools-maintainers@amazon.com

## Original Source
AWS Lambda Powertools for TypeScript
https://docs.powertools.aws.dev/lambda-typescript/latest/

## Digest of AWS_POWEROOLS_TS

# AWS Lambda Powertools for TypeScript

## Retrieved: 2025-05-06

## Installation Commands

- Logger: npm install @aws-lambda-powertools/logger
- Metrics: npm install @aws-lambda-powertools/metrics
- Tracer: npm install @aws-lambda-powertools/tracer
- Parameters (SSM): npm install @aws-lambda-powertools/parameters @aws-sdk/client-ssm
- Idempotency (DynamoDB): npm install @aws-lambda-powertools/idempotency @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
- Batch Processing: npm install @aws-lambda-powertools/batch
- JMESPath Functions: npm install @aws-lambda-powertools/jmespath
- Parser (Zod): npm install @aws-lambda-powertools/parser zod@~3
- Validation: npm install @aws-lambda-powertools/validation

## Available Utilities

| Utility              | Package Name                         | Description                                                       |
|----------------------|--------------------------------------|-------------------------------------------------------------------|
| Logger               | @aws-lambda-powertools/logger        | Structured logging and middleware for Lambda context enrichment   |
| Metrics              | @aws-lambda-powertools/metrics       | Asynchronous custom metrics via CloudWatch EMF                    |
| Tracer               | @aws-lambda-powertools/tracer        | Decorators and utilities for synchronous and asynchronous tracing |
| Parameters           | @aws-lambda-powertools/parameters    | Retrieve parameters from SSM, Secrets Manager, AppConfig, DynamoDB|
| Idempotency          | @aws-lambda-powertools/idempotency   | Decorator, middleware, wrapper for idempotent Lambda execution    |
| Batch Processing     | @aws-lambda-powertools/batch         | Handle partial failures in SQS, Kinesis, DynamoDB Streams batches |
| JMESPath Functions   | @aws-lambda-powertools/jmespath      | Deserialize common encoded JSON payloads via JMESPath functions    |
| Parser (Zod)         | @aws-lambda-powertools/parser        | Validate and parse events using Zod schemas                       |
| Validation           | @aws-lambda-powertools/validation    | JSON Schema validation for events and responses                   |

## License

MIT-0

## Security Disclosures

Report issues via AWS security instructions or email aws-powertools-maintainers@amazon.com


## Attribution
- Source: AWS Lambda Powertools for TypeScript
- URL: https://docs.powertools.aws.dev/lambda-typescript/latest/
- License: License: Apache-2.0
- Crawl Date: 2025-05-10T03:14:52.853Z
- Data Size: 6780602 bytes
- Links Found: 6421

## Retrieved
2025-05-10
