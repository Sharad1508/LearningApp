# Learning Dashboard (React Native)

Login → Course Dashboard → Course Details, with lesson completion and offline support. Built with React Native CLI 0.87 (JavaScript), Redux Toolkit and React Navigation. I chose React Native because it's the platform I'm strongest on. The architecture maps one-to-one onto native (see §5).

**Run:** `npm install && npm run android` (iOS: `cd ios && pod install && cd .. && npm run ios`) · **Test:** `npm test` · **APK:** `cd android && ./gradlew assembleRelease`
**Demo login:** any valid email and a password of 6+ characters. `fail@test.com` shows the error state. `mockScenario` in `src/core/config.js` switches the dashboard to its empty or failure state.

### 1. Architecture
MVVM with a repository layer: `View → ViewModel hook → Redux slice/thunk → Repository → API + local storage`.
- **Views** (`*Screen.js`) only render. **ViewModels** (`use*ViewModel.js`) turn store state into a view state (`loading | error | empty | content`) and expose actions.
- **Redux Toolkit** gives one predictable, debuggable state tree and explicit async lifecycles (pending/fulfilled/rejected), including an optimistic update with rollback for lesson completion.
- **Repositories** are injected through the thunk `extraArgument` in `src/app/dependencies.js` (the composition root). Slices never import data sources, so tests swap in fakes without mocking modules.
- **Domain** (`progress.js`, `validation.js`) is plain JS with no framework dependencies. Errors are normalised to a typed `AppError` (network, timeout, server, parse, unauthorized) at the data boundary.

### 2. Offline support
`CourseRepository` fetches from the network first and falls back to cache: a successful response is written to AsyncStorage; a network, timeout or server failure returns the last saved copy with `source: 'cache'` and its `savedAt` time. The UI shows an offline banner and refreshes automatically when connectivity returns (NetInfo). On cold start, cached courses are shown immediately while the refresh runs. Lesson completions are written locally, merged over server data, and used to recompute progress, so they survive restarts and work offline. A 401 is never hidden behind the cache. The mock server really fails when the device is offline, and pointing `apiBaseUrl` at the `mock-api/` folder uses real HTTP.

### 3. Security
Tokens go in the **Keychain (iOS) / Android Keystore** via `react-native-keychain` (`WHEN_UNLOCKED_THIS_DEVICE_ONLY`), never AsyncStorage. In production: a short-lived access token with a rotating refresh token, refresh on 401, TLS (plus certificate pinning if required), all cached user data cleared on logout (already done here), and no tokens in logs.

### 4. Scale (1M users, hundreds of courses)
1. **Pagination and lighter payloads:** a cursor-paginated course list, lessons loaded per course, and ETag/`Cache-Control` behind a CDN.
2. **A real local database** (SQLite via op-sqlite/WatermelonDB) in place of JSON blobs, with indexed queries, plus an **outbox sync queue** that replays completions with idempotency keys and retry/backoff.
3. **Server-authoritative progress:** the backend owns progress and conflicts resolve as a union of completions, so multiple devices agree.
4. **Observability:** Crashlytics/Sentry, performance traces, structured logs and product analytics, with alerting on error rates.
5. **Safe delivery:** feature flags, staged store rollouts, OTA updates for JS fixes, and CI running lint, tests and Detox E2E.

### 5. Second platform (native)
**Android:** Jetpack Compose screens; `ViewModel` exposing `StateFlow<UiState>` (sealed class); a repository with Retrofit/OkHttp and Room (a `Flow` from Room as the single source of truth); Hilt for DI; EncryptedDataStore/Keystore for tokens; WorkManager to sync completions. **iOS:** SwiftUI views; an `@Observable` view model with `async/await`; a repository with URLSession and SwiftData/Core Data; Keychain for tokens; `NWPathMonitor` for connectivity; BGTaskScheduler for sync. The layers, state model and tests carry over unchanged.
