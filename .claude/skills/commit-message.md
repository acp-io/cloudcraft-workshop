---
description: "Conventional Commits format reference. Use when writing commit messages."
---

# Commit Message: Conventional Commits

In general, adhere to the project's guidelines (should be in the top-level README or CONTRIBUTING.md). If guidelines are not specified, follow these conventions.

The key words "MUST", "MUST NOT", "REQUIRED", "SHALL", "SHALL NOT", "SHOULD", "SHOULD NOT", "RECOMMENDED", "MAY", and "OPTIONAL" in this document are to be interpreted as described in RFC 2119.

## Format

```
<type>[optional scope][!]: <description>

[optional body]

[optional footer(s)]
```

## Rules

- Commits MUST be prefixed with a type (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`, etc.), followed by an OPTIONAL scope, OPTIONAL `!`, and REQUIRED terminal colon and space.
- The type `feat` MUST be used when a commit adds a new feature.
- The type `fix` MUST be used when a commit represents a bug fix.
- A scope MAY be provided after a type. A scope MUST consist of a noun describing a section of the codebase surrounded by parentheses, e.g., `fix(parser):`.
- A description MUST immediately follow the colon and space after the type/scope prefix. The description is a short summary of the code changes.
- A longer commit body MAY be provided after the short description. The body MUST begin one blank line after the description.
- A commit body is free-form and MAY consist of any number of newline-separated paragraphs.
- One or more footers MAY be provided one blank line after the body. Each footer MUST consist of a word token, followed by either `:<space>` or `<space>#` separator, followed by a string value.
- A footer's token MUST use `-` in place of whitespace characters (e.g., `Acked-by`). An exception is made for `BREAKING CHANGE`, which MAY also be used as a token.
- Breaking changes MUST be indicated in the type/scope prefix of a commit, or as an entry in the footer.
- If included as a footer, a breaking change MUST consist of the uppercase text `BREAKING CHANGE`, followed by a colon, space, and description.
- If included in the type/scope prefix, breaking changes MUST be indicated by a `!` immediately before the `:`.
- Types other than `feat` and `fix` MAY be used in commit messages (e.g., `docs: update ref docs`).
- The units of information that make up Conventional Commits MUST NOT be treated as case-sensitive by implementors, with the exception of `BREAKING CHANGE` which MUST be uppercase.

## 50/72 Rule

- The subject line (type + scope + description) MUST be **50 characters or fewer**.
- The commit body MUST wrap lines at **72 characters**.

## Output

ALWAYS propose TWO versions:
- A **short version** with just the first line of the commit message
- A **full version** with description, body, and footers if applicable

## Examples

Short (43 chars):
```
feat(auth): add OAuth2 login flow
```

Full (body lines wrapped at 72 chars):
```
feat(auth): add OAuth2 login flow

Implement Google and GitHub OAuth2 providers with token
refresh. Adds login, callback, and token refresh endpoints.

Closes #42
```
