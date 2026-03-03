---
description: "Swift Testing standards and patterns for writing tests."
paths: ["**/*Tests.swift", "**/*Test.swift", "**/Tests/**/*.swift"]
---

# Swift Testing Rules

Based on [The Ultimate Swift Testing Playbook](https://gist.github.com/steipete/84a5952c22e1ff9b6fe274ab079e3a95).

## Framework Choice

- Use **Swift Testing** (`@Test`, `#expect`) for all new tests
- Use **XCTest** only for UI automation (`XCUIApplication`), performance (`XCTMetric`), or Objective-C
- Both frameworks can coexist in the same target

## Assertions: `#expect` vs `#require`

- **`#expect(expr)`** — soft check. Records failure, test continues. Use for most assertions.
- **`#require(expr)`** — hard check. Stops test immediately. Only for preconditions (unwrapping optionals, essential setup).

```swift
let user = try #require(await fetchUser(id: "123"))  // stops if nil
#expect(user.id == "123")   // continues on failure
#expect(user.name == "Alex")
```

Do NOT overuse `#require` — it hides information about subsequent failures.

| XCTest | Swift Testing |
|--------|---------------|
| `XCTAssertEqual(a, b)` | `#expect(a == b)` |
| `XCTAssertNil(a)` / `NotNil` | `#expect(a == nil)` / `#expect(a != nil)` |
| `XCTAssertTrue(a)` / `False` | `#expect(a)` / `#expect(!a)` |
| `try XCTUnwrap(a)` | `try #require(a)` |
| `XCTAssertThrowsError` | `#expect(throws: SomeError.self) { try expr }` |
| `XCTAssertNoThrow` | `#expect(throws: Never.self) { try expr }` |

## Test Structure & Naming

Arrange-Act-Assert. Name tests `methodName_condition_expectedResult`.

```swift
@Suite("Odoo Authentication")
struct AuthenticationTests {
    @Test func authenticate_validCredentials_returnsSession() async throws {
        // Arrange
        let client = StubOdooClient(result: validSessionData)
        let service = AuthService(client: client)
        // Act
        let session = try await service.authenticate(user: "test", password: "pass")
        // Assert
        #expect(session.isValid)
    }

    @Test func authenticate_invalidPassword_throwsError() async {
        let client = StubOdooClient(error: OdooError.authenticationFailed)
        let service = AuthService(client: client)
        #expect(throws: OdooError.authenticationFailed) {
            try await service.authenticate(user: "test", password: "wrong")
        }
    }
}
```

## Setup & Teardown

A **new instance** is created for each `@Test` — state never leaks. Prefer `struct`. Use `class` only when `deinit` cleanup is needed.

```swift
@Suite struct ServiceTests {
    let sut: MyService  // fresh per test
    init() throws { sut = MyService(client: StubClient()) }

    @Test func fetchData_returnsResults() async throws {
        let results = try await sut.fetch()
        #expect(!results.isEmpty)
    }
}
```

## Error Testing

```swift
#expect(throws: (any Error).self) { try riskyOp() }           // any error
#expect(throws: OdooError.self) { try client.fetch() }        // specific type
#expect(throws: OdooError.authFailed) { try client.login() }  // specific case
#expect(throws: Never.self) { try client.fetch() }            // no error (happy path)
```

## Parameterized Tests

Each argument runs as an independent, parallel test case. Use `zip` for input-output pairs.

```swift
@Test("Format seconds", arguments: zip(
    [0,    45,         754,        3661],
    ["00:00:00", "00:00:45", "00:12:34", "01:01:01"]
))
func formatted(seconds: Int, expected: String) {
    #expect(TimerState.formatted(seconds: seconds) == expected)
}
```

**Caution:** Multiple collections WITHOUT `zip` creates a Cartesian product. Use `zip` for one-to-one pairing.

## Async & Concurrency

```swift
// Confirmations — for callbacks, delegates, notifications
@Test func delegate_receivesThreeUpdates() async {
    await confirmation("didUpdate called", expectedCount: 3) { confirm in
        let delegate = MockDelegate { confirm() }
        let sut = Processor(delegate: delegate)
        sut.processAll()
    }
}

// Assert something never happens (expectedCount: 0)
@Test func logout_doesNotSync() async {
    await confirmation("sync triggered", expectedCount: 0) { confirm in
        let engine = MockSyncEngine { confirm() }
        AccountManager(syncEngine: engine).logout()
    }
}
```

## Tags

```swift
// Tests/Support/TestTags.swift
extension Tag {
    @Tag static var fast: Self
    @Tag static var networking: Self
}

@Test("Quick validation", .tags(.fast))
func validateInput() { ... }
```

## Traits: Conditional, Serial, Time Limits

```swift
@Test(.disabled("Blocked by PROJ-123")) func brokenFeature() { ... }
@Test(.enabled(if: FeatureFlags.newAPI)) func newAPIBehavior() { ... }
@available(macOS 15, *) @Test func newOSFeature() { ... }

@Suite(.serialized) struct LegacyTests { ... }  // serial execution (temporary)
@Test(.timeLimit(.minutes(1))) func longOp() async throws { ... }
```

## Stubs Over Mocks

Prefer protocol-based stubs that return predefined data:

```swift
protocol APIClientProtocol: Sendable {
    func execute(_ endpoint: String) async throws -> Data
}

struct StubAPIClient: APIClientProtocol {
    var result: Data = Data()
    var error: Error?
    func execute(_ endpoint: String) async throws -> Data {
        if let error { throw error }
        return result
    }
}
```

## Key Principles

1. **One behavior per test** — each test verifies one thing
2. **Test behavior, not implementation** — don't test private methods
3. **No sleeps or delays** — use `confirmation` for async events
4. **Stubs over mocks** — stubs return data, mocks assert calls
5. **`#expect` for most, `#require` only for preconditions**
6. **Fresh state per test** — never depend on execution order
7. **Parameterize over duplicate** — `@Test(arguments:)` not copy-paste
