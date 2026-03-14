# Mission

A JavaScript library and CLI tool for generating plots from mathematical expressions and time series data. Produces SVG and PNG output files.

## Core Functions

- `parseExpression(expr)` — parse a mathematical expression string using JavaScript `Math` functions (e.g. `"y=Math.sin(x)"`, `"y=x*x+2*x-1"`). Returns a function `(x) => y`.
- `generateSeries(expression, range)` — evaluate an expression over a range. `range` is `{ start, end, step }` (e.g. `{ start: -3.14, end: 3.14, step: 0.01 }`). Returns an array of `{ x, y }` points.
- `loadCSV(file)` — load time series data from a CSV file with columns `time,value`. Returns an array of `{ x, y }` objects.
- `renderSVG(series, options?)` — render a series to an SVG 1.1 string. Output uses `<polyline>` elements with a `viewBox` attribute. Options: `{ width, height, title }`.
- `renderPNG(series, options?)` — render a series to a PNG Buffer. Uses an SVG-to-PNG conversion (canvas-based or external tool — specify in README which approach).
- `savePlot(series, file, options?)` — render and save to file. Format inferred from extension (`.svg` or `.png`).

## CLI

```
node src/lib/main.js --expression "y=Math.sin(x)" --range "-3.14:0.01:3.14" --file output.svg
node src/lib/main.js --csv data.csv --file output.png
node src/lib/main.js --help
```

Range format: `start:step:end` (e.g. `-3.14:0.01:3.14`).

The `--help` flag prints usage examples and exits.

## Requirements

- Export all functions as named exports from `src/lib/main.js`.
- SVG output must be valid SVG 1.1 with a `viewBox` attribute.
- External dependencies allowed only for PNG rendering (e.g. `canvas`, `sharp`). Expression parsing must use built-in JavaScript `Math` — no external math libraries.
- Comprehensive unit tests covering expression parsing, series generation, SVG structure, and CLI flags.
- README with example commands and sample output descriptions.

## Acceptance Criteria

- [ ] `parseExpression("y=Math.sin(x)")` returns a callable function
- [ ] `generateSeries(expr, { start: -3.14, end: 3.14, step: 0.01 })` returns ~628 points
- [ ] `renderSVG(series)` returns a valid SVG string containing `<polyline>` and `viewBox`
- [ ] `renderPNG(series)` returns a Buffer starting with the PNG magic bytes
- [ ] CLI `--expression "y=Math.sin(x)" --range "-3.14:0.01:3.14" --file output.svg` produces a file
- [ ] CLI `--help` prints usage information
- [ ] All unit tests pass
- [ ] README documents CLI usage with examples
