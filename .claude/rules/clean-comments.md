---
description: "Language-agnostic comment cleanup principles. Always active."
---

# Clean Comments

When a task is complete and the work has been approved, review the code and clean up comments.

## Core Principles

1. **Self-documenting code first** — prefer better function names, variable names, or extracted functions over comments. Code that explains itself needs no comment.

2. **Comments explain WHY, not WHAT** — if a comment restates what the code does, remove it. Comments should explain intent, rationale, or non-obvious constraints.

3. **Stale comments are worse than no comments** — a comment that contradicts the code is actively harmful. Always keep comments in sync when code changes.

4. **Don't comment out code** — use version control instead. Dead code in comments creates noise and confusion.

5. **Refactor over annotate** — if you need a comment to explain complex logic, consider whether the code itself can be simplified or broken into smaller functions.

## Language-Specific Conventions

Each language has its own documentation and comment standards. Follow the conventions of the language you're working in:

- **Python** — see `python/clean-comments.md` for PEP 8/PEP 257 standards
- **Go** — godoc comments on exported types/functions, `//` style only
- **TypeScript/JavaScript** — JSDoc for public APIs, `//` for inline
- **Rust** — `///` doc comments with examples, `//` for inline

## When to Keep Comments

- Legal/license headers
- TODO/FIXME with ticket references (e.g., `TODO(PROJ-123): ...`)
- Non-obvious performance optimizations
- Workarounds for known bugs in dependencies
- Complex regex or algorithm explanations
