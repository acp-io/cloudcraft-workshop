# WORK SUMMARY: Rework Workshop to AI-First Methodology Showcase

**Date:** 2026-03-04
**Branch:** main, phase-1, phase-2, solution
**Branch Duration:** 2026-03-04 — completed
**Related Work:** Previous TODO-based exercises (exercise-1, exercise-2, exercise-3, complete)

---

## Objective

Transformed the workshop from "fill-in-the-blank TODO exercises" to a two-phase AI-assisted development comparison showcasing how structured AI workflows produce better results.

---

## What Was Done

### New Branch Structure
| Branch | Commit | Purpose |
|--------|--------|---------|
| `main` | 84b5499 | Landing README + facilitator guide |
| `phase-1` | a3f340b | "The Cowboy" — PM brief + minimal scaffold, no AI context |
| `phase-2` | c6cd29a | "The Engineer" — same scaffold + copilot-instructions.md + WORKFLOW.md |
| `solution` | 4ba4dba | Full working reference implementation with dedicated README |

### Old Branches Deleted
- `exercise-1`, `exercise-2`, `exercise-3`, `complete`

### Files Created
1. **REQUIREMENTS.md** — PM-style product brief with tech hints (on phase-1, phase-2)
2. **WORKFLOW.md** — 3-step methodology: Understand → Plan → Build & Verify (phase-2 only)
3. **.github/copilot-instructions.md** — Project architecture, patterns, conventions (phase-2 only)
4. **FACILITATOR_GUIDE.md** — Instructor guide with timing, talking points, troubleshooting (main)
5. Updated **README.md** on main, phase-1, phase-2, and solution branches
6. Updated **setup.sh** with GitHub Copilot CLI installation
7. Updated **.gitignore** with lambda/typescript build artifacts

### Scaffold Design (phase-1 and phase-2)
Minimal starting point — 16 files (config only):
- Root: package.json, tsconfig.json, next.config.mjs, tailwind.config.ts, postcss.config.mjs
- src/app/: layout.tsx, globals.css (shell only, no page)
- src/lambda/: package.json, tsconfig.json (no handler)
- infra/: Pulumi.yaml, package.json, tsconfig.json (no index.ts)

### Key Design Decision
Phase 1 and Phase 2 differ by exactly 2 files:
- `.github/copilot-instructions.md` (120 lines of project context)
- `WORKFLOW.md` (61 lines of structured methodology)

This makes the comparison clean and the lesson clear.

---

## Verification

- Phase-1: 16 tracked files, no app code, no AI context ✓
- Phase-2: 18 tracked files, same scaffold + 2 AI context files ✓
- Solution: 47 files, full working implementation ✓
- `git diff --stat phase-1..phase-2` shows exactly 2 files, 161 insertions ✓
- Old branches deleted, solution preserves all code from complete ✓

---

## Knowledge Transfer

- **GitHub Copilot CLI** (GA Feb 2026) reads `.github/copilot-instructions.md` for project context
- Installed via `npm install -g @github/copilot`, included in all Copilot plans
- Supports custom instructions, memory, and agentic workflows similar to Claude Code
- The workshop's "Understand → Plan → Build & Verify" workflow is a simplified version of RIPER, optimized for a 25-minute exercise
