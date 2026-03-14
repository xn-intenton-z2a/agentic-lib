# Mission

A JavaScript library of string utility functions. This is a bag-of-functions problem — each function is independent.

## Core Functions

Export each as a named function from `src/lib/main.js`:

- `slugify(str)` — convert to URL-friendly slug (lowercase, hyphens, strip non-alphanumeric)
- `truncate(str, maxLength, suffix?)` — truncate with suffix (default "…"), don't break mid-word
- `camelCase(str)` — convert to camelCase
- `kebabCase(str)` — convert to kebab-case
- `titleCase(str)` — capitalise first letter of each word
- `wordWrap(str, width)` — soft wrap text at word boundaries. Never break a word. If a single word exceeds `width`, place it on its own line unbroken. Line separator is `\n`.
- `stripHtml(str)` — remove HTML tags, decode common entities
- `escapeRegex(str)` — escape special regex characters
- `pluralize(word, count)` — basic English pluralisation. Rules: words ending in s/x/z/ch/sh add "es"; consonant+"y" changes to "ies"; "f"/"fe" changes to "ves"; all others add "s". Irregular plurals (mouse/mice, child/children) are out of scope.
- `levenshteinDistance(a, b)` — compute edit distance between two strings

## Requirements

- Handle edge cases: empty strings, null/undefined (return empty string), Unicode characters.
- No external runtime dependencies.
- Comprehensive unit tests for each function including edge cases.
- README with usage examples for each function.

## Acceptance Criteria

- [ ] All 10 functions are exported and work correctly
- [ ] `slugify("Hello World!")` returns `"hello-world"`
- [ ] `truncate("Hello World", 8)` returns `"Hello…"`
- [ ] `camelCase("foo-bar-baz")` returns `"fooBarBaz"`
- [ ] `levenshteinDistance("kitten", "sitting")` returns `3`
- [ ] Edge cases (empty string, null, Unicode) handled gracefully
- [ ] All unit tests pass
- [ ] README documents all functions with examples
