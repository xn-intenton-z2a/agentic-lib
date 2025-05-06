# FILEURL_UTILS

## Crawl Summary
fileURLToPath(url, options) converts file URL to absolute path, decodes percent-encoding, options.windows toggles Windows/POSIX behavior. pathToFileURL(path, options) converts absolute path to file:// URL object, percent-encodes reserved characters, options.windows toggles path interpretation. urlToHttpOptions(url) maps WHATWG URL to http.request() options: protocol, hostname, hash, search, pathname, path, href, auth, plus enumerable properties.

## Normalised Extract
Table of Contents
1. fileURLToPath
2. pathToFileURL
3. urlToHttpOptions

1. fileURLToPath
Signature: fileURLToPath(url: string|URL, options?: {windows?: boolean}): string
Parameters: url - file URL string or URL object; options.windows - true for Windows output, false for POSIX, undefined system default
Returns: platform-specific absolute path string
Behavior: resolves percent-encoding, converts network paths to \\server\share on Windows

2. pathToFileURL
Signature: pathToFileURL(path: string, options?: {windows?: boolean}): URL
Parameters: path - file system path; options.windows - true to treat input as Windows path, false POSIX, undefined system default
Returns: WHATWG URL object with file:// scheme
Behavior: ensures absolute resolution, percent-encodes control and reserved chars

3. urlToHttpOptions
Signature: urlToHttpOptions(url: URL): Object
Parameters: url - WHATWG URL object
Returns: Options object for HTTP(S) requests
Properties: protocol, hostname (punycode), hash, search, pathname, path (pathname+search), href, auth (user:pass), plus own enumerable URL props

## Supplementary Details
Import patterns:
import { fileURLToPath, pathToFileURL, urlToHttpOptions } from 'node:url';

Implementation steps for fileURLToPath:
1. Ensure url argument is a valid WHATWG URL or file URL string
2. Call fileURLToPath with optional windows flag
3. Use result directly in fs operations

Implementation steps for pathToFileURL:
1. Provide absolute or relative path
2. Call pathToFileURL, optionally specifying windows flag
3. Use returned URL in APIs expecting URL

Implementation steps for urlToHttpOptions:
1. Construct or receive URL object
2. Call urlToHttpOptions(url)
3. Destructure needed fields: protocol, hostname, path, headers

Configuration options:
windows: boolean | undefined; default undefined uses process.platform

Errors thrown:
fileURLToPath: TypeError if input URL is not file URL or invalid
pathToFileURL: none
urlToHttpOptions: none

## Reference Details
Function: fileURLToPath
Signature: fileURLToPath(url: string|URL, options?: {windows?: boolean}): string
Throws: TypeError for non-file URL or invalid URL
Examples:
import { fileURLToPath } from 'node:url';
const p1 = fileURLToPath('file:///C:/test%20dir/file.txt'); // 'C:\test dir\file.txt'
const p2 = fileURLToPath(new URL('file:///home/user/foo')); // '/home/user/foo'
Best practice: wrap in try/catch to handle malformed URLs.
Troubleshooting:
> node -e "const {fileURLToPath} = require('node:url'); console.log(fileURLToPath('http://example.com'))"
TypeError: The URL must be of scheme file but got 'http:'

Function: pathToFileURL
Signature: pathToFileURL(path: string, options?: {windows?: boolean}): URL
Returns: WHATWG URL object
Examples:
import { pathToFileURL } from 'node:url';
const u1 = pathToFileURL('/usr/local/bin'); // file:///usr/local/bin
const u2 = pathToFileURL('C:\Projects\app.js'); // file:///C:/Projects/app.js
Best practice: always absolute path; use path.resolve when uncertain.

Function: urlToHttpOptions
Signature: urlToHttpOptions(url: URL): HttpOptions
HttpOptions fields: protocol:string, hostname:string, hash:string, search:string, pathname:string, path:string, href:string, auth?:string
Examples:
import { urlToHttpOptions } from 'node:url';
const opts = urlToHttpOptions(new URL('https://user:pass@example.com:8080/path?x=1#y'));
// opts: {
//   protocol: 'https:',
//   hostname: 'example.com',
//   hash: '#y',
//   search: '?x=1',
//   pathname: '/path',
//   path: '/path?x=1',
//   href: 'https://user:pass@example.com:8080/path?x=1#y',
//   auth: 'user:pass'
// }
Best practice: pass options to https.request directly: https.request(urlToHttpOptions(url));
Troubleshooting:
Missing auth header: ensure URL includes credentials before calling urlToHttpOptions.


## Information Dense Extract
fileURLToPath(url,options)→string; decodes % chars, handles UNC on windows; throws TypeError for non-file URLs. pathToFileURL(path,options)→URL; percent-encodes reserved chars, resolves absolute path. urlToHttpOptions(url)→{protocol,hostname,hash,search,pathname,path,href,auth,...}; map URL to http request options.

## Sanitised Extract
Table of Contents
1. fileURLToPath
2. pathToFileURL
3. urlToHttpOptions

1. fileURLToPath
Signature: fileURLToPath(url: string|URL, options?: {windows?: boolean}): string
Parameters: url - file URL string or URL object; options.windows - true for Windows output, false for POSIX, undefined system default
Returns: platform-specific absolute path string
Behavior: resolves percent-encoding, converts network paths to ''server'share on Windows

2. pathToFileURL
Signature: pathToFileURL(path: string, options?: {windows?: boolean}): URL
Parameters: path - file system path; options.windows - true to treat input as Windows path, false POSIX, undefined system default
Returns: WHATWG URL object with file:// scheme
Behavior: ensures absolute resolution, percent-encodes control and reserved chars

3. urlToHttpOptions
Signature: urlToHttpOptions(url: URL): Object
Parameters: url - WHATWG URL object
Returns: Options object for HTTP(S) requests
Properties: protocol, hostname (punycode), hash, search, pathname, path (pathname+search), href, auth (user:pass), plus own enumerable URL props

## Original Source
Node.js ESM Utilities
https://nodejs.org/api/url.html#url_fileurltopath_url

## Digest of FILEURL_UTILS

# Node.js URL File Utilities (retrieved 2024-06-20)

Source: Node.js v23.11.0 documentation (Data Size: 4394530 bytes, Links: 5381)

## url.fileURLToPath(url, options)

Signature:

    fileURLToPath(url: string | URL, options?: { windows?: boolean }): string

Parameters:

- url: A file URL string or WHATWG URL object.
- options.windows: true to return a Windows filepath, false for POSIX, undefined for system default.

Returns:

- Fully-resolved platform-specific absolute file path string.

Behavior:

- Decodes percent-encoded characters.
- On Windows: prefixes network paths with \\\\ for UNC shares.

Examples:

    import { fileURLToPath } from 'node:url';

    // Windows output: C:\path\
    fileURLToPath('file:///C:/path/');

    // POSIX output: /你好.txt
    fileURLToPath('file:///你好.txt');


## url.pathToFileURL(path, options)

Signature:

    pathToFileURL(path: string, options?: { windows?: boolean }): URL

Parameters:

- path: File system path string.
- options.windows: true if path is Windows, false for POSIX, undefined system default.

Returns:

- A WHATWG URL object with file:// scheme.

Behavior:

- Resolves path absolutely.
- Encodes control and reserved characters with percent-encoding.

Examples:

    import { pathToFileURL } from 'node:url';

    // Correct POSIX: file:///foo%231
    pathToFileURL('/foo#1');

    // Correct Windows: file:///C:/path/%25file.c
    pathToFileURL('C:\path\%file.c');


## url.urlToHttpOptions(url)

Signature:

    urlToHttpOptions(url: URL): {
      protocol: string;
      hostname: string;
      hash: string;
      search: string;
      pathname: string;
      path: string;
      href: string;
      auth?: string;
      [key: string]: any;
    }

Parameters:

- url: A WHATWG URL object.

Returns:

- Options object for http.request() and https.request().

Fields:

- protocol: e.g. 'https:'
- hostname: punycode-encoded host
- hash: fragment
- search: serialized query
- pathname: path
- path: pathname + search
- href: full URL string
- auth: 'user:pass' if credentials present
- includes other enumerable properties of URL object

Example:

    import { urlToHttpOptions } from 'node:url';
    const opts = urlToHttpOptions(new URL('https://a:b@測試?x=1#z'));
    // opts.protocol --> 'https:'
    // opts.auth --> 'a:b'



## Attribution
- Source: Node.js ESM Utilities
- URL: https://nodejs.org/api/url.html#url_fileurltopath_url
- License: License: CC BY 4.0
- Crawl Date: 2025-05-06T10:29:37.638Z
- Data Size: 4394530 bytes
- Links Found: 5381

## Retrieved
2025-05-06
