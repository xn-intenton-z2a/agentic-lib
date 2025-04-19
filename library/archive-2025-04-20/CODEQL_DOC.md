# CODEQL_DOC

## Crawl Summary
The crawled content details CodeQL as a tool for querying code, providing release information, supported languages (such as C/C++, C#, Go, Java, Kotlin, JavaScript, Python, Ruby, Swift) with specific file extensions and compiler details. It includes sections on writing CodeQL queries, QL language reference covering predicates, queries, types, modules, recursion, and detailed standard libraries for multiple languages. Comprehensive change logs outline version history and release dates.

## Normalised Extract
## Table of Contents
1. CodeQL Release Information
2. Supported Languages and Frameworks
3. Writing CodeQL Queries
4. QL Language Reference
5. Standard Libraries & Query Help
6. CodeQL Change Logs

---

### 1. CodeQL Release Information
- **Version List**: CodeQL 2.21.0 (2025-04-03), 2.20.7 (2025-03-18), 2.20.6 (2025-03-06), 2.20.5 (2025-02-20), 2.20.4 (2025-02-06), ...

### 2. Supported Languages and Frameworks
- **C/C++**: Supported standards (C89, C99, C11, C17, C++98, C++03, C++11, C++14, C++17, C++20), compilers: Clang (clang-cl, armclang), GCC, MSVC; extensions: .cpp, .hpp, etc.
- **C#**: Up to C# 13 on Visual Studio and various .NET versions; file types: .csproj, .cs, etc.
- **GitHub Actions**: Workflow YAML file formats provided.
- **Go**: Up to Go 1.24; file extension: .go.
- **Java & Kotlin**: Java versions 7 to 24, Kotlin 1.5.0 to 2.1.2x; file extensions: .java, .kt.
- **JavaScript/TypeScript**: ECMAScript 2022 or lower with file extensions such as .js, .jsx, .ts, .tsx.
- **Python**: Versions 2.7 and 3.5 through 3.13; file extension: .py.
- **Ruby**: Up to 3.3; file extension: .rb, .erb.
- **Swift**: Swift 5.4-6.0; file extension: .swift.

### 3. Writing CodeQL Queries
- **Query Structure**: Queries are written in QL. For example, a basic query may look like:

```ql
/**
 * @name Example Query for Detecting Vulnerabilities
 * @description This query finds calls to dangerous functions.
 */

import javascript

from CallExpr call
where call.getCallee().getName() = "eval"
select call, "Potential risky eval usage."
```

- **Tutorials**: Step-by-step guides and puzzles to enhance query-writing skills.

### 4. QL Language Reference
- **Core Elements**:
  - *Predicates*: Define logical relations.
  - *Types*: Variables have explicit static types.
  - *Modules*: Organize related predicates and types.
  - *Signatures*: Specify parameter types for modular functions.
  - *Expressions and Formulas*: Used in selecting and filtering results.
  - *Recursion*: Supported for iterative data flow analyses.

### 5. Standard Libraries & Query Help
- **Standard Libraries**: Detailed modules are provided per language (e.g. for C/C++: codeql/cpp-all; for C#: codeql/csharp-all; etc.).
- **Query Help**: Each query includes metadata, repository links, vulnerability description, and recommended remediation steps.

### 6. CodeQL Change Logs
- Detailed historical logs of releases, with version numbers and dates.


## Supplementary Details
### Supplementary Technical Specifications

1. **Configuration Options**:
   - CodeQL CLI: Run queries using `codeql query run --database=<DB_PATH> <QUERY_FILE.ql>`.
   - Database creation: `codeql database create <DB_PATH> --language=<lang>` with `<lang>` options: cpp, csharp, java, javascript, python, etc.
   - VS Code Extension: Configure CodeQL path and set query options in settings.json:
     ```json
     {
       "codeQL.executablePath": "/usr/local/bin/codeql",
       "codeQL.databasePath": "./codeql-db"
     }
     ```

2. **Implementation Steps for a Query**:
   1. Create a CodeQL database: `codeql database create my-db --language=javascript`
   2. Write a query file (e.g. query.ql) with a complete predicate structure.
   3. Run the query: `codeql query run --database=my-db query.ql`
   4. Analyze the results: Output will list all instances matching the query's conditions.

3. **Exact Method Signatures (QL DSL Examples)**:
   - Example predicate in QL:
     ```ql
     predicate isDangerous(FunctionCall call) {
       call.getCallee().getName() = "eval"
     }
     ```
   - Query selection example:
     ```ql
     from FunctionCall call
     where isDangerous(call)
     select call, "Dangerous eval usage detected."
     ```

4. **Best Practices**:
   - Always validate input types when writing predicates.
   - Use modular queries to separate concerns (e.g. abstract common patterns into libraries).
   - Maintain up-to-date databases by recreating the CodeQL database before major code changes.

5. **Troubleshooting Procedures**:
   - Run queries in verbose mode: `codeql query run --database=my-db query.ql --log=debug`
   - If a query fails, check the database integrity by re-running the database creation command.
   - Verify that file extensions and language settings match those specified in the CodeQL documentation.


## Reference Details
### Complete API and SDK Specifications

#### CodeQL CLI Commands:
- **Database Creation**:
  ```bash
  codeql database create <DB_PATH> --language=<language>
  # Example:
  codeql database create my-js-db --language=javascript
  ```

- **Query Execution**:
  ```bash
  codeql query run --database=<DB_PATH> <QUERY_FILE.ql> [--additional-flags]
  # Example:
  codeql query run --database=my-js-db query.ql
  ```

#### QL Language SDK Method Signatures and Examples:

- **Predicate Definition**:
  ```ql
  /**
   * Checks if a function call uses eval.
   * @param call The function call expression.
   * @return true if the callee name is eval.
   */
  predicate isEvalCall(FunctionCall call) {
    call.getCallee().getName() = "eval"
  }
  ```

- **Query Selection Pattern**:
  ```ql
  /**
   * Selects all dangerous eval calls in the program.
   */
  from FunctionCall call
  where isEvalCall(call)
  select call, "Found an eval call that might be dangerous."
  ```

#### SDK Method Signatures for CodeQL API (Hypothetical Examples):

- **Query.run(database: Database, query: String) -> QueryResult**
  - Parameters:
    - database: Instance of Database containing the code to analyze.
    - query: A string representing the CodeQL query.
  - Returns: QueryResult object with the list of findings.
  - Example Usage:
    ```javascript
    const result = CodeQL.Query.run(database, 'from FunctionCall call where call.getCallee().getName() = "eval" select call');
    console.log(result.getResults());
    ```

- **Database.create(projectPath: String, language: String) -> Database**
  - Parameters:
    - projectPath: The file system path to the project.
    - language: The programming language (e.g. 'javascript', 'python').
  - Returns: A Database object for subsequent analysis.
  - Example Usage:
    ```javascript
    const db = CodeQL.Database.create('/path/to/project', 'javascript');
    ```

#### Detailed Troubleshooting Commands:

- **Verbose Mode Execution for Debugging**:
  ```bash
  codeql query run --database=my-js-db query.ql --log=debug
  ```
  - Expected Output: Detailed log messages indicating each step of the query execution.

- **Database Integrity Check**:
  ```bash
  codeql database analyze --rerun --format=sarif-latest my-js-db query.ql
  ```
  - Expected Output: SARIF file with full analysis results, useful for identifying database creation issues.

### Configuration Options and Their Effects:

- `codeQL.executablePath`: Specifies the path to the CodeQL CLI executable. Default is typically installed in `/usr/local/bin/codeql`.
- `codeQL.databasePath`: Specifies the default path for CodeQL databases. Can be overridden per project.
- CLI flag `--log=debug`: Enables detailed logging to help troubleshoot query execution issues.

### Best Practice Implementation Code Example:

```bash
# Step 1: Create a database
codeql database create my-db --language=javascript

# Step 2: Run a query in verbose mode
codeql query run --database=my-db my-query.ql --log=debug

# Step 3: Analyze the SARIF output
codeql database analyze my-db my-query.ql --format=sarif-latest > results.sarif
```

This complete API and SDK guide includes all parameters, return types, code examples, configuration options, and step-by-step troubleshooting procedures to directly support developers in using CodeQL for code analysis.


## Original Source
CodeQL Documentation
https://codeql.github.com/docs/

## Digest of CODEQL_DOC

# CodeQL Documentation Overview

**Retrieved on:** 2023-10-07

**Data Size:** 21290805 bytes
**Links Found:** 23708

# CodeQL Release Information

- CodeQL 2.21.0 (2025-04-03)
- CodeQL 2.20.7 (2025-03-18)
- CodeQL 2.20.6 (2025-03-06)
- CodeQL 2.20.5 (2025-02-20)
- CodeQL 2.20.4 (2025-02-06)
- ... (additional releases detailed in the original crawl)

# Supported Languages and Frameworks

The documentation specifies detailed support including:

## Languages and Compilers

- **C/C++**: Variants - C89, C99, C11, C17, C++98, C++03, C++11, C++14, C++17, C++20; Supported compilers include Clang (clang-cl and armclang), GNU (GCC up to 13.2), and Microsoft extensions (VS 2022). File extensions: `.cpp, .c++, .cxx, .hpp, .hh, .h++, .hxx, .c, .cc, .h`
- **C#**: Up to version 13; Supported on Microsoft Visual Studio (up to 2019), .NET (4.8, Core 3.1, .NET 5/6/7/8/9). File extensions: `.sln, .csproj, .cs, .cshtml, .xaml`
- **GitHub Actions**: YAML configuration files located in `.github/workflows/*.yml` or `**/action.yml`
- **Go**: Versions up to 1.24; File extension: `.go`
- **Java**: Java 7 to 24, compiled via javac or ECJ. File extension: `.java`
- **Kotlin**: Versions 1.5.0 to 2.1.2x; File extension: `.kt`
- **JavaScript & TypeScript**: ECMAScript 2022 or lower; File extensions include `.js, .jsx, .mjs, .ts, .tsx`
- **Python**: Versions 2.7, 3.5 to 3.13; File extension: `.py`
- **Ruby**: Up to version 3.3; File extension: `.rb, .erb, .gemspec, Gemfile`
- **Swift**: Swift 5.4-6.0; File extension: `.swift`

## Frameworks and Libraries

Each language has support for numerous frameworks and libraries. For example:

- **Java and Kotlin**: Apache Commons, Hibernate, Jackson, Spring MVC, etc.
- **JavaScript and TypeScript**: Angular, React, Express, Nest.js, etc.
- **Python**: Django, Flask, FastAPI, Tornado, etc.
- **C#**: ASP.NET, EntityFramework, Json.NET, etc.

# Writing CodeQL Queries

- **CodeQL Queries**: Queries are written in the QL language to analyze codebases, detect vulnerabilities, and perform variant analysis.
- **Tutorials and Guides**: Step-by-step tutorials are provided for learning QL basics, writing queries, and applying best practices.

# QL Language Reference

The QL language includes detailed technical constructs:

- **Predicates**: Describe logical relations in QL programs.
- **Queries**: Evaluate to sets of results with precise type checking since QL is statically typed.
- **Modules and Signatures**: Organize code and provide parameter typing.
- **Expressions and Formulas**: Used for evaluating code paths and logical relationships.
- **Recursion and Annotations**: Support recursive predicates and additional meta-data via annotations.

# CodeQL Standard Libraries and Query Help

- **Standard Libraries**: Detailed listings for C/C++, C#, Go, Java, JavaScript, Python, Ruby, and Swift provide predicates, classes, and modules.
- **Query Help**: Each query comes with metadata, links to the repository, and vulnerability descriptions.

# CodeQL Change Logs

A historical record of releases is provided with dates and versions (e.g., CodeQL 2.21.0, CodeQL 2.20.x, etc.).

# Attribution

Content retrieved from: [CodeQL Documentation](https://codeql.github.com/docs/)



## Attribution
- Source: CodeQL Documentation
- URL: https://codeql.github.com/docs/
- License: License: Custom GitHub Docs License
- Crawl Date: 2025-04-17T16:40:51.834Z
- Data Size: 21290805 bytes
- Links Found: 23708

## Retrieved
2025-04-17
