---
description: "Performance-focused code review checklist. Load alongside the code-reviewer agent when reviewing performance-critical paths, data processing, or high-throughput code."
---

# Performance Review Checklist

Supplement the core 4-pass review protocol with this deep-dive performance analysis.

---

Identify performance bottlenecks and inefficiencies:

- **Algorithmic Complexity**: O(n²) or worse where O(n) or O(n log n) solutions exist. Nested loops over large datasets. Missing early exits.
- **Memory**: Unnecessary data copies, loading entire datasets into memory when streaming/pagination would work, memory leaks from unclosed resources.
- **I/O & Network**: N+1 query patterns, sequential calls that could be parallelized, missing connection pooling, unbounded retries, missing timeouts on HTTP/DB calls.
- **Caching**: Missing obvious caching opportunities, cache invalidation issues, unbounded cache growth.
- **Concurrency**: Race conditions, missing locks where needed, deadlock potential, thread-safety issues.
- **Database**: Missing indexes implied by query patterns, full table scans, over-fetching columns/rows.

## Algorithmic Complexity

- O(n²) or worse where O(n) or O(n log n) solutions exist — especially nested loops over collections
- Missing early exits / short-circuits in search or validation loops
- Repeated linear scans that could use a hash map for O(1) lookup
- Sorting when only min/max/top-k is needed (use heaps)
- Redundant computation that could be memoized or precomputed
- String operations in tight loops (concatenation, regex compilation, repeated parsing)

## Memory

- Loading entire datasets into memory when streaming or pagination would work
- Unnecessary deep copies where shallow copies or references suffice
- Unbounded collections that grow with input size without limits
- Memory leaks from unclosed resources (file handles, DB connections, HTTP clients)
- Large object graphs held in memory longer than needed (missing scope reduction)
- Buffer allocations in hot loops — pre-allocate and reuse where possible

## I/O & Network

- **N+1 queries**: Fetching related data one-by-one in a loop instead of batch/join
- Sequential I/O calls that could be parallelized (concurrent HTTP requests, parallel DB queries)
- Missing connection pooling for databases, HTTP clients, or message brokers
- Unbounded retries without backoff — can cause thundering herd
- Missing timeouts on HTTP calls, DB queries, and external service calls
- Large payloads sent without compression or pagination
- Missing request batching where APIs support it

## Caching

- Missing obvious caching opportunities (repeated identical queries, computed values)
- Unbounded cache growth — missing eviction policy (LRU, TTL, size limits)
- Cache invalidation issues — stale data served after mutations
- Cache stampede risk — missing locking or probabilistic early expiration
- Caching mutable objects without defensive copies
- Over-caching — caching data that changes frequently or is cheap to recompute

## Database

- Missing indexes implied by WHERE/ORDER BY/JOIN clauses
- Full table scans on large tables
- Over-fetching: `SELECT *` when only specific columns are needed
- Under-fetching leading to N+1 patterns
- Missing query result limits (LIMIT clause) on potentially large result sets
- Expensive operations (aggregations, sorts) that could be offloaded or pre-computed
- Missing database connection limits / pool sizing
- Transaction scope too broad — holding locks longer than necessary

## Concurrency

- Race conditions on shared mutable state
- Missing synchronization (locks, atomics) where needed
- Deadlock potential from inconsistent lock ordering
- Thread-safety issues in singleton or shared service instances
- Async/await anti-patterns: blocking the event loop, unawaited coroutines, sync calls in async context
- Thread pool / worker pool sizing issues (too few = bottleneck, too many = resource exhaustion)

## Serverless & Cloud-Specific

- Cold start impact: heavy imports, large packages, SDK initialization at module level
- Missing connection reuse across invocations (DB pools, HTTP clients)
- Package size bloat affecting deployment and cold start times
- Missing provisioned concurrency for latency-sensitive functions
- Unnecessary SDK client initialization (create once, reuse across invocations)
- Missing regional endpoint configuration (cross-region calls add latency)

## Profiling Guidance

When findings suggest performance issues but impact is unclear, recommend:
- CPU profiling for computation-heavy code
- Memory profiling for suspected leaks or bloat
- Query analysis (EXPLAIN plans) for database concerns
- Load testing for concurrency and throughput concerns
- Benchmarking before and after for proposed optimizations
