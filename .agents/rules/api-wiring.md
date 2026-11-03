# API Wiring & Integration Rules

You are responsible for wiring this project to the API. Follow these rules exactly. Do not deviate from them.

## 1) Source of truth
- The endpoints listed at the end of this prompt (or from Postman MCP, if available) are the ONLY source of truth: method, headers, body, response shape, and error codes.
- Never guess a field or invent an endpoint. If anything is unclear or missing, ask me before continuing.
- Implement every endpoint with all of its operations: list, details, add, edit, delete.
- Do not touch anything outside the requested endpoints.

## 2) Design
- The base design must not change: colors, layout, element order, icons, border radius, and text stay exactly as they are.
- The whole site stays Arabic with RTL direction.
- You may add an element only if the API strictly requires it (loading state, error message, a missing field), using the site's existing style. List every addition in your final report.

## 3) Logic
- Follow the API's logic, not your own assumptions: values, statuses, permissions, ordering.
- Remove all fake/mock data. Everything displayed must come from the response. Anything displayed that is not in the response must be removed.
- Keep all API calls in a single layer (service or actions). UI components must not call fetch directly.
- Define types for every request and response.
- Base URL and tokens come from environment variables. No hardcoded values.
- No duplicated code. Keep the code clean, organized, and free of pointless files.

## 4) Validation
- Mirror the API's rules on the client: min/max length, format, required fields.
- Show server validation errors (400/422) under the exact field they belong to.
- Error messages are in Arabic, clear, and placed under each input.
- Never submit an invalid form.
- Disable the submit button and show a spinner while a request is in flight to prevent double submission.

## 5) UI states
- Show loading first. Show the empty state only after the request has finished with no data (it must never flash before data arrives).
- Add an error state with a retry button.
- After any add, edit, or delete: refresh the list and show a success or failure toast.
- Show an AlertDialog confirmation before delete and before edit/save.
- On 401, redirect to login. For 403, 404, and 500, show a clear message.

## 6) Testing (mandatory before delivery)
For every element on the page (button, form, filter, search, pagination, dropdown):
- Verify it sends a request to the correct endpoint with the correct body, or reads from it (check the Network tab).
- Test 4 cases: success, validation error, server error, empty data.
- Any element that neither sends to nor reads from the API is incomplete. Finish it.
- Run build and lint with zero errors.

## 7) Delivery
- Provide a table: endpoint → page/element → tested ✅/❌.
- List every design addition or change you made and anything that was missing or unclear.
- Do not say "done" until every row in the table is ✅.

## Endpoints Reference
- Documentation Map: `docs/admin-api-map.md`
- Cached Postman Collection: `docs/postman-super-admin-collection.json`
- Postman Collection Name: `SaaS Super Admin Management API (منصة الجودي)`
- Base URL config: `NEXT_PUBLIC_API_URL` in `.env` / `src/lib/api/config.ts`
