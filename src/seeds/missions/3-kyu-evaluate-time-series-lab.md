# Mission

A JavaScript library for generating, normalising, forecasting, and correlating time series data. Uses deterministic data generators rather than external APIs, making results reproducible.

## Core Functions

- `generateSineWave(periods, noise, sampleRate)` — generate a sine wave dataset with optional Gaussian noise. Returns an array of `{ time, value }` objects.
- `generateRandomWalk(steps, seed)` — generate a seeded random walk. Returns an array of `{ time, value }` objects.
- `load(file)` — load a CSV dataset with columns `time,value`. Auto-detect ISO 8601 and Unix timestamp date formats.
- `normalise(dataset, interval)` — resample to uniform intervals using linear interpolation for missing values. `interval` is in milliseconds.
- `forecast(dataset, method, options)` — predict future values. Supported methods:
  - `"sma"` — simple moving average. Options: `{ window: N, horizon: M }`.
  - `"ema"` — exponential smoothing. Options: `{ alpha: 0.0-1.0, horizon: M }`.
- `correlate(datasetA, datasetB, maxLag?)` — compute Pearson cross-correlation coefficient for lags from `-maxLag` to `+maxLag` (default 20). Returns an array of `{ lag, r }` objects.
- `report(datasets)` — generate a markdown string summarising datasets (row count, min, max, mean, trend direction).

## Requirements

- Export all functions as named exports from `src/lib/main.js`.
- No external runtime dependencies.
- All random generators must accept a seed for deterministic output.
- Comprehensive unit tests covering generation, normalisation, forecasting accuracy, and correlation.
- README with usage examples.

## Acceptance Criteria

- [ ] `generateSineWave(2, 0, 100)` produces 200 data points tracing a clean sine wave
- [ ] `generateRandomWalk(100, 42)` produces identical output on repeated calls (deterministic)
- [ ] `normalise()` fills gaps with linearly interpolated values
- [ ] `forecast(sineData, "sma", { window: 10, horizon: 20 })` returns 20 predicted values
- [ ] Forecast of a known sine wave has RMSE < 0.5 for a 10-point horizon
- [ ] `correlate(sineA, sineB)` returns peak correlation at the correct lag offset
- [ ] `report()` produces a markdown string with dataset summaries
- [ ] All unit tests pass
- [ ] README documents the API with examples
