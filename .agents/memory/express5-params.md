---
name: Express 5 params typing
description: req.params values are string | string[] in Express 5, not plain string
---

In Express 5, `req.params.id` is typed as `string | string[]`, not `string`.

**Why:** Express 5 changed the RouteParameters type to be more accurate about array params.

**How to apply:** Always use `parseInt(String(req.params.id))` instead of `parseInt(req.params.id)`. Apply this to every numeric path param extraction in route handlers.
