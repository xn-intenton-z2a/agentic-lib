# URL_UTILS

## Crawl Summary
fileURLToPath(url, options.windows?) => string absolute path with percent-decoding and platform rules. pathToFileURL(path, options.windows?) => URL with percent-encoding. url.format(URL, options.{auth,true;fragment,true;search,true;unicode,false}) => string. urlToHttpOptions(URL) => http.request options object. new URL(input[,base]) => WHATWG URL with getters/setters for protocol,username,password,host,hostname,port,pathname,search,hash; static methods createObjectURL, revokeObjectURL, canParse, parse. URLSearchParams constructors from string,obj,iterable; methods append,delete,entries,forEach,get,getAll,has,keys,set,size,sort,toString,values,iterator. domainToASCII/Unicode conversions. URLPattern.experimental with ctor(input[,baseURL,options.ignoreCase]) exec/test. Legacy url.parse(urlString[,parseQueryString,slashesDenoteHost]), format, resolve, UrlObject props auth,hash,host,hostname,href,path,pathname,port,protocol,query,search,slashes

## Normalised Extract
Table of Contents
 1 WHATWG URL Class
 2 URLSearchParams
 3 File and Path URL Conversions
 4 URL Serialization
 5 HTTP Options Conversion
 6 Domain Encoding
 7 URLPattern (Experimental)
 8 Legacy URL API

1 WHATWG URL Class
Constructor: new URL(input: string|{toString()}, base?: string|{toString()})
 Properties (get/set):
  protocol: string (scheme plus colon)
  username: string (percent-encoded characters auto-encoded)
  password: string
  host: string (hostname:port)
  hostname: string
  port: string (0-65535 or empty string for default)
  pathname: string (percent-encoded invalid characters)
  search: string (?query)
  searchParams: URLSearchParams
  hash: string (#fragment)
  href: string (full URL string)
  origin: string (scheme://host)
 Methods:
  toString(): string identical to href
  toJSON(): string used by JSON.stringify
 Static:
  URL.createObjectURL(blob: Blob): string 'blob:nodedata:...'
  URL.revokeObjectURL(id: string): void
  URL.canParse(input: string, base?: string): boolean
  URL.parse(input: string, base?: string): URL|null

2 URLSearchParams
Constructors:
  new URLSearchParams()
  new URLSearchParams(string: string)
  new URLSearchParams(obj: Record<string,string|string[]>)
  new URLSearchParams(iterable: Iterable<[string,string]>)
Methods:
  append(name: string, value: string)
  delete(name: string, value?: string)
  get(name: string): string|null
  getAll(name: string): string[]
  has(name: string, value?: string): boolean
  set(name: string, value: string)
  sort(): void stable by name
  entries(): Iterator<[string,string]>
  keys(): Iterator<string>
  values(): Iterator<string>
  forEach(fn: (value,name,params)=>void, thisArg?)
  toString(): string percent-encoded query
  size: number
  [Symbol.iterator] same as entries

3 File and Path URL Conversions
fileURLToPath(url: URL|string, options?:{windows?:boolean}): string
  windows true=>Windows path, false=>POSIX, undefined=>system default
  decodes percent encodings, UNC paths
pathToFileURL(path: string, options?:{windows?:boolean}): URL
  resolves absolute path, percent-encodes reserved chars

4 URL Serialization
url.format(URL: URL, options?:{auth?:boolean=true, fragment?:boolean=true, search?:boolean=true, unicode?:boolean=false}): string

5 HTTP Options Conversion
urlToHttpOptions(url: URL): {protocol,hostname,hash,search,pathname,path,href,auth}

6 Domain Encoding
domainToASCII(domain: string): string Punycode or '' if invalid
domainToUnicode(domain: string): string Unicode or ''

7 URLPattern (Experimental)
new URLPattern(input: string|object, baseURL?:string, options?:{ignoreCase?:boolean})
exec(input: string|object, baseURL?): PatternResult|null
test(input: string|object, baseURL?): boolean

8 Legacy URL API
parse(urlString: string, parseQueryString?:boolean, slashesDenoteHost?:boolean): UrlObject
 UrlObject props: auth,hash,host,hostname,href,path,pathname,port,protocol,query,search,slashes
format(urlObject: UrlObject): string
resolve(from: string, to: string): string

## Supplementary Details
fileURLToPath and pathToFileURL options.windows default undefined (system). fileURLToPath ensures correct decoding: percent-encoded spaces and Unicode. Windows UNC: fileURLToPath('file://nas/foo.txt') => \\nas\foo.txt. pathToFileURL encodes # and % characters: '/foo#1' => file:///foo%231. url.format unicode:true outputs Unicode host e.g. '測試'. urlToHttpOptions includes original url.href, includes auth only if present. URL constructor base coercion attempts toString; invalid URL or base throws TypeError. URL.host setter ignores invalid values. URL.port setter: string->toString, leading digits accepted, out-of-range ignored. URLSearchParams.delete with optional value removes specific pair. size property added in v19.8.0. sort() uses stable sort. domainToASCII and domainToUnicode require valid domain per DNS rules. URL.canParse returns false if input relative and no base. URL.parse returns null on invalid. URLPattern ignoreCase:true for case-insensitive matching.

## Reference Details
## fileURLToPath
Signature:
import { fileURLToPath } from 'node:url'
function fileURLToPath(url: URL|string, options?: { windows?: boolean }): string
Throws TypeError on invalid URL. Example:
const path = fileURLToPath('file:///C:/path/to/file.txt') // 'C:\path\to\file.txt'

## pathToFileURL
Signature:
import { pathToFileURL } from 'node:url'
function pathToFileURL(path: string, options?: { windows?: boolean }): URL
Example:
const url = pathToFileURL('/var/log/app.log') // URL 'file:///var/log/app.log'

## url.format
Signature:
import { format } from 'node:url'
function format(URL: URL, options?: {
  auth?: boolean;      // default true
  fragment?: boolean;  // default true
  search?: boolean;    // default true
  unicode?: boolean;   // default false
}): string
Example:
const u = new URL('https://a:b@xn--g6w251d/?x=y#z')
format(u, { auth:false, fragment:false, unicode:true }) // 'https://測試/?x=y'

## urlToHttpOptions
Signature:
import { urlToHttpOptions } from 'node:url'
function urlToHttpOptions(url: URL): {
  protocol: string;
  hostname: string;
  hash: string;
  search: string;
  pathname: string;
  path: string;
  href: string;
  auth?: string;
}
Example:
urlToHttpOptions(new URL('https://user:pass@host:443/path?query#hash'))
// Returns object with protocol 'https:', hostname 'host', auth 'user:pass', path '/path?query', ...

## WHATWG URL
Constructor:
new URL(input: string|{toString()}, base?: string|{toString()}): URL
Throws TypeError if invalid. Usage ESM and CommonJS:
import { URL } from 'node:url'
const u1 = new URL('/foo', 'https://example.org/')
const u2 = new URL('https://example.org/')

Getters/Setters:
- protocol: 'https:'
- username, password: percent-encoded
- host: hostname:port
- hostname: without port
- port: '' or '0-65535'
- pathname: begins with '/'
- search: begins with '?'
- hash: begins with '#'
- href: full URL
- origin: read-only scheme://host
- searchParams: URLSearchParams instance

Static Methods:
URL.createObjectURL(blob: Blob): string // generates 'blob:nodedata:' URL
URL.revokeObjectURL(id: string): void
URL.canParse(input: string, base?: string): boolean
URL.parse(input: string, base?: string): URL|null

## URLSearchParams
Constructors and full method signatures as above. Duplicate keys allowed in iterable constructor. Error on invalid tuple length. get returns null if missing. delete(name,value) v20.2.0 supports optional value removal. size property v19.8.0.

## domainToASCII / domainToUnicode
import { domainToASCII, domainToUnicode } from 'node:url'
function domainToASCII(domain: string): string
function domainToUnicode(domain: string): string

## URLPattern (Experimental)
import { URLPattern } from 'node:url'
new URLPattern(input: string|object, baseURL?: string, options?: { ignoreCase?: boolean })
urlPattern.exec(input: string|object, baseURL?: string): PatternResult|null
urlPattern.test(input: string|object, baseURL?: string): boolean

## Legacy
import { parse, format as legacyFormat, resolve } from 'node:url'
parse(urlString: string, parseQueryString?: boolean, slashesDenoteHost?: boolean): UrlObject
UrlObject props: auth,hash,host,hostname,href,path,pathname,port,protocol,query,search,slashes
legacyFormat(urlObject: UrlObject): string
resolve(from: string, to: string): string

## Best Practices
- Validate URL.origin after construction when base may vary.
- Use URLSearchParams.sort() to normalize query order for caching.
- Prefer WHATWG API over legacy.
- Use fileURLToPath for ES modules __filename compatibility.

## Troubleshooting
Command: node -e "import { fileURLToPath } from 'node:url'; console.log(fileURLToPath('file:///tmp/foo%20bar'))"
Expected: /tmp/foo bar
If result incorrect, verify Node version >=10.12.0.

Command: node -e "import { format } from 'node:url'; console.log(format(new URL('https://測試'), { unicode:false }))"
Expected: https://xn--g6w251d/ 

Check URL.parse returning null on invalid: node -e "import { parse } from 'node:url'; console.log(parse('not a url', undefined))"
Expected: null

## Information Dense Extract
fileURLToPath(url,options.windows?):string; pathToFileURL(path,options.windows?):URL; format(URL,options.auth=true,fragment=true,search=true,unicode=false):string; urlToHttpOptions(URL):{protocol,hostname,hash,search,pathname,path,href,auth?}; new URL(input: string|{toString()},base?):URL protocol:string username:string password:string host:string hostname:string port:string pathname:string search:string hash:string href:string origin:string searchParams:URLSearchParams; URL.createObjectURL(blob):string; URL.revokeObjectURL(id):void; URL.canParse(input,base?):boolean; URL.parse(input,base?):URL|null; URLSearchParams():params; URLSearchParams(string|obj|iterable) methods append(name,value),delete(name,value?),get(name):string|null,getAll(name):string[],has(name,value?):boolean,set(name,value),sort(),entries(),keys(),values(),forEach(fn),toString(),size; domainToASCII(domain):string; domainToUnicode(domain):string; new URLPattern(input[,base,options.ignoreCase]):URLPattern; URLPattern.exec(input[,base]):PatternResult|null; URLPattern.test(input[,base]):boolean; legacy parse(urlString,parseQueryString?,slashesDenoteHost?):UrlObject; legacy format(urlObject):string; resolve(from,to):string UrlObject props auth,hash,host,hostname,href,path,pathname,port,protocol,query,search,slashes

## Sanitised Extract
Table of Contents
 1 WHATWG URL Class
 2 URLSearchParams
 3 File and Path URL Conversions
 4 URL Serialization
 5 HTTP Options Conversion
 6 Domain Encoding
 7 URLPattern (Experimental)
 8 Legacy URL API

1 WHATWG URL Class
Constructor: new URL(input: string|{toString()}, base?: string|{toString()})
 Properties (get/set):
  protocol: string (scheme plus colon)
  username: string (percent-encoded characters auto-encoded)
  password: string
  host: string (hostname:port)
  hostname: string
  port: string (0-65535 or empty string for default)
  pathname: string (percent-encoded invalid characters)
  search: string (?query)
  searchParams: URLSearchParams
  hash: string (#fragment)
  href: string (full URL string)
  origin: string (scheme://host)
 Methods:
  toString(): string identical to href
  toJSON(): string used by JSON.stringify
 Static:
  URL.createObjectURL(blob: Blob): string 'blob:nodedata:...'
  URL.revokeObjectURL(id: string): void
  URL.canParse(input: string, base?: string): boolean
  URL.parse(input: string, base?: string): URL|null

2 URLSearchParams
Constructors:
  new URLSearchParams()
  new URLSearchParams(string: string)
  new URLSearchParams(obj: Record<string,string|string[]>)
  new URLSearchParams(iterable: Iterable<[string,string]>)
Methods:
  append(name: string, value: string)
  delete(name: string, value?: string)
  get(name: string): string|null
  getAll(name: string): string[]
  has(name: string, value?: string): boolean
  set(name: string, value: string)
  sort(): void stable by name
  entries(): Iterator<[string,string]>
  keys(): Iterator<string>
  values(): Iterator<string>
  forEach(fn: (value,name,params)=>void, thisArg?)
  toString(): string percent-encoded query
  size: number
  [Symbol.iterator] same as entries

3 File and Path URL Conversions
fileURLToPath(url: URL|string, options?:{windows?:boolean}): string
  windows true=>Windows path, false=>POSIX, undefined=>system default
  decodes percent encodings, UNC paths
pathToFileURL(path: string, options?:{windows?:boolean}): URL
  resolves absolute path, percent-encodes reserved chars

4 URL Serialization
url.format(URL: URL, options?:{auth?:boolean=true, fragment?:boolean=true, search?:boolean=true, unicode?:boolean=false}): string

5 HTTP Options Conversion
urlToHttpOptions(url: URL): {protocol,hostname,hash,search,pathname,path,href,auth}

6 Domain Encoding
domainToASCII(domain: string): string Punycode or '' if invalid
domainToUnicode(domain: string): string Unicode or ''

7 URLPattern (Experimental)
new URLPattern(input: string|object, baseURL?:string, options?:{ignoreCase?:boolean})
exec(input: string|object, baseURL?): PatternResult|null
test(input: string|object, baseURL?): boolean

8 Legacy URL API
parse(urlString: string, parseQueryString?:boolean, slashesDenoteHost?:boolean): UrlObject
 UrlObject props: auth,hash,host,hostname,href,path,pathname,port,protocol,query,search,slashes
format(urlObject: UrlObject): string
resolve(from: string, to: string): string

## Original Source
Node.js ESM Utilities
https://nodejs.org/api/url.html#url_fileurltopath_url

## Digest of URL_UTILS

# URL Module Documentation
Date Retrieved: 2024-06-15
Data Size: 4238143 bytes

# fileURLToPath(url, options)
Signature
  fileURLToPath(url: URL | string, options?: { windows?: boolean }): string
Parameters
  url         A WHATWG File URL object or file URL string to convert.
  options     Object
    windows   true for returning Windows filepath, false for POSIX, undefined for system default.
Returns
  string      Fully-resolved, platform-specific absolute file path.
Behavior
  Decodes percent-encoded characters, resolves UNC and drive-letter paths on Windows.
Examples
  import { fileURLToPath } from 'node:url'
  const file = fileURLToPath(import.meta.url)
  // Windows: fileURLToPath('file:///C:/path/') => C:\path\
  // POSIX: fileURLToPath('file:///你好.txt') => /你好.txt

# pathToFileURL(path, options)
Signature
  pathToFileURL(path: string, options?: { windows?: boolean }): URL
Parameters
  path        A filesystem path to convert to a file URL.
  options     Object
    windows   true treats path as Windows, false for POSIX, undefined for system default.
Returns
  URL         A fully-encoded WHATWG File URL.
Behavior
  Resolves path absolutely, percent-encodes control characters and reserved URL chars.
Examples
  import { pathToFileURL } from 'node:url'
  pathToFileURL('/foo#1')      // file:///foo%231
  pathToFileURL(__filename)    // file:///... (absolute)

# url.format(URL, options)
Signature
  format(URL: URL, options?: { auth?: boolean, fragment?: boolean, search?: boolean, unicode?: boolean }): string
Parameters
  URL         A WHATWG URL instance.
  options     Object
    auth      Include username:password (default: true)
    fragment  Include hash fragment (default: true)
    search    Include search/query (default: true)
    unicode   Allow Unicode in host rather than Punycode (default: false)
Returns
  string      Serialized URL string with specified components.
Examples
  import { format } from 'node:url'
  format(myURL, { fragment:false, unicode:true, auth:false })

# urlToHttpOptions(url)
Signature
  urlToHttpOptions(url: URL): { protocol, hostname, hash, search, pathname, path, href, auth }
Parameters
  url         A WHATWG URL object.
Returns
  Object      Options for http.request/https.request APIs.
Examples
  import { urlToHttpOptions } from 'node:url'
  urlToHttpOptions(new URL('https://a:b@xn--g6w251d/?abc#foo'))

# WHATWG URL Class
Signature
  new URL(input: string | { toString(): string }, base?: string | { toString(): string }): URL
Properties (get/set)
  hash, host, hostname, href, origin, password, pathname, port, protocol, search, searchParams, username
Methods
  toString(): string
  toJSON(): string
Static Methods
  URL.createObjectURL(blob: Blob): string
  URL.revokeObjectURL(id: string): void
  URL.canParse(input: string, base?: string): boolean
  URL.parse(input: string, base?: string): URL | null
Examples
  new URL('/foo','https://example.org/')
  URL.canParse('/foo','https://example.org/')

# URLSearchParams Class
Constructors
  new URLSearchParams()
  new URLSearchParams(string: string)
  new URLSearchParams(obj: Record<string,string|string[]>)
  new URLSearchParams(iterable: Iterable<[string,string]>)
Methods
  append(name: string, value: string): void
  delete(name: string, value?: string): void
  entries(): Iterator<[string,string]>
  forEach(fn: (value,name,searchParams)=>void, thisArg?): void
  get(name: string): string | null
  getAll(name: string): string[]
  has(name: string, value?: string): boolean
  keys(): Iterator<string>
  set(name: string, value: string): void
  size: number
  sort(): void
  toString(): string
  values(): Iterator<string>
  [Symbol.iterator](): Iterator<[string,string>]

# domainToASCII(domain)
Signature
  domainToASCII(domain: string): string
Returns
  Punycode ASCII serialization or '' if invalid.

# domainToUnicode(domain)
Signature
  domainToUnicode(domain: string): string
Returns
  Unicode serialization or '' if invalid.

# URLPattern Class (Experimental)
Signature
  new URLPattern(input: string|object, baseURL?: string, options?: { ignoreCase?: boolean })
Methods
  exec(input: string|object, baseURL?: string): PatternResult | null
  test(input: string|object, baseURL?: string): boolean

# Legacy URL API
Functions
  parse(urlString: string, parseQueryString?: boolean, slashesDenoteHost?: boolean): UrlObject
  format(urlObject: UrlObject): string
  resolve(from: string, to: string): string
Properties on UrlObject
  auth, hash, host, hostname, href, path, pathname, port, protocol, query, search, slashes


## Attribution
- Source: Node.js ESM Utilities
- URL: https://nodejs.org/api/url.html#url_fileurltopath_url
- License: License: CC BY 4.0
- Crawl Date: 2025-05-06T14:28:57.661Z
- Data Size: 4238143 bytes
- Links Found: 3240

## Retrieved
2025-05-06
