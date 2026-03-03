# Agent Workflow — Structured Development

You are an AI coding agent. Follow this workflow for every task. Do not skip phases.

## Phase 1: Research

Before writing any code, understand the context.

- Read the project structure — identify key directories, config files, and entry points
- Read existing code related to the task — understand patterns, conventions, and dependencies
- Identify the tech stack — frameworks, languages, cloud services, build tools
- Check for documentation — README, requirements docs, inline comments
- List what you know and what you still need to clarify

**Output:** A summary of the current architecture and how the task fits into it.

**Rule:** Do not write or modify code during this phase.

## Phase 2: Plan

Create a concrete implementation plan before touching code.

- Break the task into ordered steps
- For each step, specify the exact file(s) and function(s) to modify or create
- Identify dependencies between steps — what must happen first
- Flag potential risks — breaking changes, missing permissions, new dependencies
- Present the plan to the user for review

**Output:** A numbered list of steps, each with files, changes, and rationale.

**Rule:** Do not write or modify code until the plan is reviewed.

## Phase 3: Build

Execute the plan step by step.

- Implement one step at a time
- After each step, verify it works — run builds, check for errors
- If something fails, diagnose and fix before moving on
- Keep changes minimal and focused — don't refactor unrelated code
- Follow existing code patterns and conventions

**Build cycle:**
1. Make the change
2. Build / compile
3. Fix any errors
4. Move to the next step

**Rule:** Do not skip the build/verify step between changes.

## Phase 4: Verify

After all steps are complete, verify the full result.

- Test the feature end-to-end — does it work as specified?
- Check for regressions — did anything else break?
- Review the changes — are they clean, minimal, and consistent?
- Confirm all acceptance criteria from the original task are met

**Output:** A summary of what was built, what was tested, and the result.

**Rule:** Do not mark the task as done until verification passes.

---

## Placement

This file works with any AI coding agent. Place it where your tool reads project instructions:

| Tool | File location |
|------|--------------|
| GitHub Copilot | `.github/copilot-instructions.md` |
| Claude Code | `CLAUDE.md` or `.claude/rules/workflow.md` |
| Cursor | `.cursor/rules/workflow.mdc` |
| Generic | `workflow.md` in the project root |
