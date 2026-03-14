# Mission

A JavaScript library that computes structured diffs between two JSON Schema (Draft-07) documents, helping API developers track and validate schema changes across versions.

## Core Functions

- `diffSchemas(schemaA, schemaB)` — compare two JSON Schema objects and return an array of change records.
- `formatDiff(changes, format?)` — render the change array as human-readable text (`"text"` default) or JSON (`"json"`).
- `classifyChange(change)` — return `"breaking"`, `"compatible"`, or `"informational"` for a single change record.

## Change Record Format

Each element returned by `diffSchemas` is a plain object:

```js
{ path: "/properties/email", changeType: "type-changed", before: "string", after: "number" }
```

Supported `changeType` values:

- `property-added` / `property-removed`
- `type-changed`
- `required-added` / `required-removed`
- `enum-value-added` / `enum-value-removed`
- `description-changed`
- `nested-changed` (recursive diff of sub-schemas)

## Requirements

- Resolve local `$ref` pointers (JSON Pointer within the same document) before diffing. Remote `$ref` is out of scope — throw if encountered.
- Traverse `properties`, `items`, `allOf`, `oneOf`, `anyOf` recursively.
- Export all functions as named exports from `src/lib/main.js`.
- No external runtime dependencies.
- Comprehensive unit tests covering each change type, nested schemas, and `$ref` resolution.
- README with usage examples showing a before/after schema pair.

## Acceptance Criteria

- [ ] `diffSchemas(schemaA, schemaB)` returns an array of change objects
- [ ] Detects added and removed properties
- [ ] Detects type changes (e.g. `"string"` → `"number"`)
- [ ] Detects `required` array changes
- [ ] Handles nested schemas recursively (properties within properties)
- [ ] Resolves local `$ref` before diffing
- [ ] `classifyChange()` returns `"breaking"` for removed required properties and type changes
- [ ] `formatDiff()` produces readable text output
- [ ] All unit tests pass
- [ ] README documents usage with examples
