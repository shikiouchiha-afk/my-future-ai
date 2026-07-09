# Mobile E2E Test Notes

## Public mobile layout suite
- Command: `npm run test:mobile`
- Covers public routes and checks horizontal overflow + screenshot capture.

## Authenticated mobile suite
- Command: `npm run test:mobile:auth`
- Requires env vars:
  - `E2E_TEST_EMAIL`
  - `E2E_TEST_PASSWORD`
- Optional premium route test env vars:
  - `E2E_PREMIUM_TEST_EMAIL`
  - `E2E_PREMIUM_TEST_PASSWORD`

If required env vars are missing, related tests are skipped automatically.

## Combined run
- Command: `npm run test:mobile:all`
