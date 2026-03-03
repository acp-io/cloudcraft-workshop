# WORK SUMMARY: Setup Script for EC2 Workshop Environment

**Date:** 2026-03-03
**Branch:** main
**Related Work:** None

---

## Objective

Create a `setup.sh` script for Amazon Linux 2023 EC2 instances that installs all workshop prerequisites (Node.js 20+, Pulumi CLI, GitHub CLI). Update README.md to reference it.

---

## STAGE 1: Create setup.sh

### Task 1.1 — Write `setup.sh`
- Target: Amazon Linux 2023
- Install Node.js 20 via nvm
- Install Pulumi CLI via official curl installer
- Install GitHub CLI via GitHub's RPM repo
- Verify each tool after installation (print versions)
- Make the script idempotent (skip already-installed tools)
- Include clear output messages so students know what's happening

### Task 1.2 — Update README.md
- Add a "Setup (EC2)" section before "Getting Started" that tells students to run the setup script
- Keep existing prerequisite list but note the script handles installation

---

## STAGE 2: Verify

### Task 2.1 — Review script for correctness
- Verify all install commands are correct for Amazon Linux 2023 (dnf-based)
- Ensure nvm sourcing works in the current shell session
- Check error handling

---

## STAGE 1 — WORK SUMMARY

### Task 1.1 — setup.sh ✅
- Created `setup.sh` (executable) with:
  - Node.js 20 via nvm v0.40.1 — checks existing version before installing
  - Pulumi CLI via official installer — skips if already present
  - GitHub CLI via GitHub's RPM repo (`dnf`) — skips if already present
  - `add_line()` helper for idempotent `.bashrc` updates (no duplicate entries)
  - Colored output (green ✓ / yellow →) for clear student feedback
  - Version summary at the end

### Task 1.2 — README.md ✅
- Added "EC2 Quick Setup" subsection under Prerequisites
- Simplified prerequisite bullet points (removed install commands, kept verify commands)
- Points students to `./setup.sh` + `source ~/.bashrc`

## STAGE 2 — VERIFICATION

### Syntax check
```
$ bash -n setup.sh
Syntax OK
```

### Correctness review
- **Node.js**: nvm install is the standard approach for Amazon Linux 2023 (no Node in default repos) ✓
- **Pulumi**: `get.pulumi.com` installer is distro-agnostic ✓
- **GitHub CLI**: `dnf config-manager --add-repo` + GitHub RPM repo is the documented method for RHEL/Fedora/Amazon Linux ✓
- **Idempotency**: All three tool sections use `command -v` checks; `.bashrc` uses `grep -qF` before appending ✓
- **set -euo pipefail**: Script fails fast on errors ✓

## Success Criteria
- [x] `setup.sh` installs Node.js 20+, Pulumi, and GitHub CLI on Amazon Linux 2023
- [x] Script is idempotent and provides clear feedback
- [x] README references the script
