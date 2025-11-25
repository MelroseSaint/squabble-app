# Audit and Bug Fix Plan

## Audit Findings

1.  **Critical Bug in AI Service**:
    - `services/geminiService.ts` uses a non-existent model `gemini-2.5-flash`. This will cause all AI requests to fail.
    - **Fix**: Update model to `gemini-1.5-flash`.

2.  **State Synchronization Issue**:
    - `App.tsx` initializes fighters only on mount. If the user adds an API key in settings, the app does not automatically switch from mock data to AI-generated data until a page reload.
    - **Fix**: Refactor `App.tsx` to watch for `apiKey` changes and re-fetch fighters if necessary.

3.  **Database Configuration**:
    - `services/db.ts` uses hardcoded credentials (`root`/`root`) and assumes a local SurrealDB instance at `ws://localhost:8000/rpc`.
    - **Note**: This is acceptable for a local prototype but unsafe for production. Will keep as is for now but ensure graceful fallback to `localStorage` (which is already implemented).

4.  **Dependency Versions**:
    - `surrealdb` is at `0.11.0` which is outdated.
    - **Decision**: Keep as is to avoid breaking changes with the existing `db.ts` implementation, as upgrading to 1.x/2.x requires significant code changes.

5.  **Code Quality**:
    - `App.tsx` is large and handles too many concerns (routing, state, effects).
    - **Fix**: Minor refactoring to improve readability and state management for the API key.

## Implementation Plan

1.  **Fix `services/geminiService.ts`**:
    - Update model names.

2.  **Refactor `App.tsx`**:
    - Split the initialization `useEffect` into two:
        - One for DB/Profile/Legal (runs once).
        - One for Fighters (runs on mount and when `apiKey` changes).

3.  **Verify Components**:
    - Ensure all components are correctly imported and used. (Verified: `VideoCallModal` is used).

4.  **Final Review**:
    - Check for any linting errors or type mismatches.
