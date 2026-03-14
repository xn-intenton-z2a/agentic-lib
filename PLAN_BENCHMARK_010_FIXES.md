# Plan: Benchmark Report 010 Fixes

**Source**: BENCHMARK_REPORT_010.md (in progress)
**Created**: 2026-03-14
**Status**: in progress

---

## Fixes Found During Benchmark 010

### W1: Supervisor inline params not parsed from action string (CRITICAL — S1 iteration 1-2)

**Problem**: The LLM returns actions as pipe-delimited strings like `github:create-issue | title: foo | body: bar` instead of using the structured `{action, params}` format from the tool schema. The `executeAction` function only checks the full action string against `ACTION_HANDLERS`, so `github:create-issue | title: foo | body: bar` doesn't match `github:create-issue`.

**Evidence**: S1 iterations 1 and 2 both logged:
```
Action result: unknown:github:create-issue | title: Implement fizzBuzz library...
```
The issue was never created. The dev job had nothing to work on. 2 full workflow runs (341K + 384K tokens) produced zero code transforms.

**Fix**: Added inline param parsing to `executeAction()`. When the action string contains ` | `, split on it, extract the clean action name from the first part, and parse remaining parts as `key: value` pairs into the params object. Explicit params from the tool schema take precedence over inline params.

**Files**: `src/actions/agentic-step/tasks/supervise.js` (executeAction)

### W2: Dispatch accepts placeholder issue numbers (MEDIUM — S1 iteration 1-2)

**Problem**: When the supervisor dispatches `dispatch:agentic-lib-workflow | mode: dev-only | issue-number: <created_issue_number>`, the literal placeholder `<created_issue_number>` is passed as the issue number. The dispatch fails with "Not Found".

**Fix**: Added validation in `executeDispatch` — `issue-number` must be numeric (regex `/^\d+$/`). Non-numeric values are logged as warnings and ignored.

**Files**: `src/actions/agentic-step/tasks/supervise.js` (executeDispatch)

### W3: Dispatch ignores mode parameter (MINOR — S1)

**Problem**: The supervisor sends `mode: dev-only` in dispatch params, but `executeDispatch` only forwards `pr-number` and `issue-number` to the workflow inputs. The `mode` parameter is silently dropped.

**Fix**: Added `if (params.mode) inputs.mode = String(params.mode)` to `executeDispatch`.

**Files**: `src/actions/agentic-step/tasks/supervise.js` (executeDispatch)

---

## Verification

- [x] All 568 unit tests pass after W1/W2/W3 fixes
- [ ] After release + init: supervisor creates issues successfully in S1
- [ ] After release + init: dev transform runs on the created issue
- [ ] Mission-complete declared within budget

---

## Implementation Notes

### W1: Inline param parsing — DONE
Added to `executeAction()`: when `action` contains ` | `, split and parse. First part is the clean action name, remaining parts are `key: value` pairs merged into params (explicit params take precedence). Logs the parsing for visibility.

### W2: Placeholder issue validation — DONE
Added to `executeDispatch()`: `issue-number` must pass `/^\d+$/` test. Placeholder strings like `<created_issue_number>` are logged as warnings and not forwarded.

### W3: Mode passthrough — DONE
Added to `executeDispatch()`: `params.mode` is forwarded as a workflow input if present.
