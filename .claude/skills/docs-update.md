---
description: "Documentation sync protocol. Use when updating project documentation."
---

# Documentation Sync Protocol

Use this protocol whenever code changes require documentation updates. Keep the `docs/` folder in sync with the codebase.

## Core Documents

<!-- CUSTOMIZE: Adjust these to match your project's documentation structure -->

| Document | Purpose | Update When |
|----------|---------|-------------|
| `docs/ARCHITECTURE.md` | System design, component relationships, data flow | Adding/removing components, changing integrations, modifying data flow |
| `docs/REQUIREMENTS.md` | Functional and non-functional requirements | Scope changes, new features, changed constraints |
| `docs/PROGRESS.md` | Current status, completed work, next steps | After completing any work stage |
| `README.md` | Project overview, setup, usage | Setup steps change, new dependencies, API changes |

## Protocol

### 1. Identify Affected Documents

After completing a code change, determine which documents need updating:
- Did you add or remove a component? Update ARCHITECTURE.md
- Did you change requirements or scope? Update REQUIREMENTS.md
- Did you complete a milestone? Update PROGRESS.md
- Did you change setup steps or dependencies? Update README.md

### 2. Update Documents

For each affected document:
- Read the current version first (never assume you know the contents)
- Make minimal, targeted edits — don't rewrite sections unnecessarily
- Keep the existing structure and formatting conventions
- Add dated entries to PROGRESS.md (newest first)

### 3. Verify Consistency

After updating, verify that:
- Cross-references between documents are still valid
- No contradictions exist between documents
- Technical details match the actual codebase
- Links and file paths are correct

## Guidelines

- **Accuracy over completeness** — only document what exists, not what's planned
- **Keep it current** — stale docs are worse than no docs
- **Match the codebase** — if the code changed, the docs should reflect it
- **Minimal diffs** — update only what changed, preserving existing structure
