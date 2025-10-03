# TODO: Fix Firebase Admin Private Key Error

## Issue
- Error: "Failed to parse private key: Error: Invalid PEM formatted message."
- Occurs in /vehicles/[id] page during Firebase Admin initialization.

## Root Cause
- `lib/firebase-admin.ts` expects `FIREBASE_SERVICE_ACCOUNT_KEY` to be a JSON string containing the full service account object.
- The `private_key` field in the JSON is not in valid PEM format (likely missing proper headers or malformed).

## Plan
- Modify `lib/firebase-admin.ts` to use separate environment variables for Firebase Admin credentials instead of a single JSON string.
- This allows setting `FIREBASE_PRIVATE_KEY` directly as the PEM string, making it easier to ensure correct formatting.
- Add required environment variables: `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PROJECT_ID`.

## Steps
1. Update `lib/firebase-admin.ts` to use individual env vars.
2. Ensure environment variables are set correctly in Firebase App Hosting or local .env file.
3. Test the application to verify the error is resolved.

## Dependent Files
- `lib/firebase-admin.ts`

## Followup
- Verify that `FIREBASE_PRIVATE_KEY` contains the full PEM string starting with `-----BEGIN PRIVATE KEY-----` and ending with `-----END PRIVATE KEY-----`.
- Ensure `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PROJECT_ID` are set.
