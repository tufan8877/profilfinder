---
name: Orval array endpoints
description: Orval-generated hooks for array responses return T[] directly, not a wrapper object
---

When an OpenAPI endpoint returns `type: array`, the generated React Query hook returns the array directly as `data`.

**Why:** Orval correctly models the response as `T[]` — there is no `.items`, `.profiles`, or `.data` wrapper.

**How to apply:** If the component does `data?.profiles.map(...)` but the endpoint returns an array, it will throw "Cannot read map of undefined". Fix: use `(Array.isArray(data) ? data : []).map(...)` or just `data?.map(...)`.
