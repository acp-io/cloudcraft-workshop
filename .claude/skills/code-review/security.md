---
description: "Security-focused code review checklist. Load alongside the code-reviewer agent when reviewing security-sensitive code, APIs, auth flows, or infrastructure."
---

# Security Review Checklist

Supplement the core 4-pass review protocol with this deep-dive security analysis.

---

Perform a security-focused review with CRE awareness:

- **Injection**: SQL injection, command injection, template injection. Check all user-controlled inputs that flow into queries, commands, or templates.
- **Authentication & Authorization**: Missing or weak auth checks, hardcoded credentials, secrets in code, improper session management, missing RBAC enforcement.
- **Data Exposure**: Sensitive data in logs, overly verbose error messages, PII in responses, missing encryption where needed.
- **Input Validation**: Missing or insufficient validation, improper sanitization, type coercion issues, path traversal, SSRF vectors.
- **Dependency Security**: Known vulnerable dependencies, pinned vs unpinned versions, use of deprecated/abandoned libraries.
- **Deserialization**: Unsafe deserialization of untrusted data.
- **Cryptography**: Weak algorithms, improper key management, predictable random values where crypto-strength randomness is needed.

You can find CRE definitions at https://cwe.mitre.org/data/definitions/699.html

For language and platform-specific security concerns, load the relevant review skill

## Injection

- **SQL Injection**: Raw string interpolation in queries. Verify parameterized queries / ORM usage. Check dynamic table/column names (can't be parameterized — must be allow-listed).
- **Command Injection**: User input in `subprocess`, `os.system`, shell=True, or equivalent. Check template engines, eval/exec, and dynamic code generation.
- **Template Injection**: User input rendered in server-side templates without sandboxing (Jinja2 `|safe`, Go `template.HTML`, etc.).
- **LDAP/XPath/Header Injection**: User input in LDAP queries, XML/XPath expressions, or HTTP headers without sanitization.
- **Log Injection**: User input written to logs without sanitization — can forge log entries or inject control characters.

## Authentication & Authorization

- Hardcoded credentials, API keys, tokens, or secrets anywhere in code (including test files)
- Secrets in environment variables without encryption (KMS, Vault, etc.)
- Missing authentication on endpoints that should be protected
- Missing authorization checks — authenticated != authorized. Verify RBAC/ABAC enforcement.
- Session management: predictable session IDs, missing expiration, no rotation after privilege change
- JWT issues: missing signature verification, `alg: none` acceptance, overly long expiration, sensitive data in payload
- Password handling: plaintext storage, weak hashing (MD5, SHA1), missing salting, no rate limiting on auth endpoints

## Data Exposure

- PII or sensitive data in logs, error messages, or stack traces returned to clients
- API responses that over-expose fields (return full objects instead of DTOs)
- Missing field-level encryption for sensitive data at rest
- Debug/verbose mode enabled in production configurations
- Source maps or debug symbols shipped to production
- `.env` files, credentials, or private keys in version control

## Input Validation

- Missing validation at system boundaries (API endpoints, message consumers, file uploads)
- Allow-list vs deny-list: prefer allow-listing valid inputs over deny-listing bad ones
- Path traversal: user input in file paths without canonicalization (`../../../etc/passwd`)
- SSRF: user-controlled URLs without domain/scheme allow-listing
- File upload: missing type validation, missing size limits, executable uploads
- Integer overflow/underflow at boundaries
- Unicode normalization issues (homoglyph attacks, bidirectional text)

## Cryptography

- Weak algorithms: MD5/SHA1 for integrity, DES/3DES/RC4 for encryption, RSA < 2048 bits
- ECB mode for block ciphers (use GCM or CBC with HMAC)
- Predictable random values where `secrets` / crypto-grade randomness is needed
- Hard-coded IVs, nonces, or salts
- Missing key rotation mechanisms
- TLS/SSL: allowing TLS < 1.2, weak cipher suites, missing certificate validation

## Cloud & Infrastructure

- **IAM**: Overly permissive policies (`*` actions/resources), missing least-privilege principle
- **Storage**: Public S3 buckets / GCS buckets, missing encryption at rest, overly broad ACLs
- **Networking**: Security groups / firewall rules too permissive, public-facing resources that should be internal
- **Secrets Management**: Secrets in Lambda env vars without KMS, missing Vault/SecretsManager integration
- **API Gateway**: Missing rate limiting, missing WAF, overly permissive CORS
- **Container Security**: Running as root, outdated base images, secrets baked into images
- **Infrastructure-as-Code**: Hardcoded secrets in Pulumi/Terraform/CDK, missing encryption flags, overly permissive defaults

## Deserialization

- Unsafe deserialization of untrusted data (pickle, yaml.load, Java ObjectInputStream)
- Missing integrity checks on serialized data
- Prototype pollution in JavaScript/TypeScript
- XML external entity (XXE) processing enabled

## Dependency Security

- Known CVEs in dependencies (check with `pip audit`, `npm audit`, `govulncheck`, etc.)
- Unpinned dependency versions allowing supply chain drift
- Dependencies from untrusted sources or mirrors
- Abandoned/unmaintained dependencies with known issues
