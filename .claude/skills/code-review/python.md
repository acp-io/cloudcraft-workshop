---
description: "Python-specific code review checklist. Load alongside the code-reviewer agent when reviewing Python code."
---

# Python Review Checklist

Supplement the core 4-pass review protocol with these Python-specific checks.

---

## Type Safety & Annotations

- Missing type hints on public function signatures
- `Any` used where a concrete type is known
- Incorrect `Optional` usage — `Optional[X]` means `X | None`, not "this parameter is optional"
- Mutable default arguments (`def f(items=[])`) — use `None` sentinel + assignment in body
- `TypeVar` constraints that are too broad or too narrow
- Missing `@overload` for functions with different return types based on input

## Pythonic Patterns

- Manual index loops where `enumerate()`, `zip()`, or comprehensions apply
- `dict.keys()` iteration when direct `dict` iteration suffices
- Manual file handling without `with` (context manager) — applies to files, locks, DB connections
- String concatenation in loops — use `join()` or f-strings
- Bare `assert` in production code (stripped by `python -O`)
- `isinstance()` cascades that should be polymorphism or `match` statements (3.10+)
- Using `type()` for comparison instead of `isinstance()`

## Error Handling (Python-Specific)

- Bare `except:` or `except Exception:` that swallows errors silently
- Missing `from` in exception chaining (`raise NewError(...) from original`)
- `finally` blocks that can themselves raise, masking the original exception
- `except` blocks that catch and re-raise without adding context
- Missing `contextlib.suppress()` for intentionally ignored exceptions

## Testing (pytest)

- Tests that don't assert anything meaningful (just "no exception = pass")
- Missing parametrize for repetitive test cases
- Fixtures that do too much setup — should be focused and composable
- Missing `conftest.py` for shared fixtures
- Tests coupled to implementation details (mocking internals instead of boundaries)
- Missing edge case tests: empty inputs, None, boundary values, Unicode, large inputs

## Dependencies & Imports

- Circular imports (usually a design smell — restructure modules)
- Star imports (`from module import *`) outside `__init__.py`
- Import side effects at module level
- Unpinned or overly broad version specifiers in requirements
- Use of deprecated stdlib modules (`optparse`, `imp`, `distutils`)

## Concurrency

- Shared mutable state without locks in threaded code
- `asyncio` patterns: blocking calls in async functions, missing `await`, unawaited coroutines
- GIL assumptions — CPU-bound work won't parallelize with threads
- Missing `async with` / `async for` where needed

## Performance (Python-Specific)

- Repeated `.append()` in a loop where a list comprehension works
- `in` checks on lists where a set would be O(1)
- Unnecessary `list()` wrapping of generators when iteration-only is needed
- Large string formatting in hot loops
- Missing `__slots__` on data-heavy classes with many instances
- `datetime.now()` without timezone — use `datetime.now(UTC)` (3.11+) or `datetime.now(timezone.utc)`
