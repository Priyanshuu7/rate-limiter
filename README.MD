# Express Rate Limiter 

This project implements rate limiting using `express-rate-limit` to protect the API from excessive requests.

## Rate Limiter Configuration

The limiter is configured in `src/middleware/RateLimiter.ts`.

```typescript
import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  limit: 5,            // 5 requests per window
  standardHeaders: 'draft-8', 
  legacyHeaders: false,
  ipv6Subnet: 56, 
})

```

### Configuration Breakdown

* **`windowMs`**: Sets the time frame (30 seconds) for which requests are checked.
* **`limit`**: The maximum number of connections allowed per IP within the `windowMs`.
* **`standardHeaders: 'draft-8'`**: Enables the latest `RateLimit-*` headers defined in the IETF draft-8 standard (e.g., `RateLimit-Limit`, `RateLimit-Remaining`).
* **`legacyHeaders: false`**: Disables the older `X-RateLimit-*` headers, keeping the response cleaner.
* **`ipv6Subnet: 56`**: Groups IPv6 addresses by a `/56` prefix to prevent users from bypassing limits by cycling through individual addresses in a large subnet.

---

## Implementation Types

### 1. Global Rate Limiter

A global limiter applies to every route in the application. In your `src/index.ts`, these lines are currently commented out to allow for route-specific testing.

**To enable globally:**
Uncomment these lines in `src/index.ts`:

```typescript
 import {limiter} from "./middleware/RateLimiter" // Import the limiter
 app.use(limiter);                             // Apply to all routes

```

### 2. Route-Specific Rate Limiter

Route-specific limiting allows you to apply different rules (or the same rules) only to certain endpoints. This is useful for protecting heavy operations like user creation.

**Example in `src/routes/UserRoute.ts`:**

* **Single Route Protection**: Only the `POST /` route is limited here.
```typescript
router.post("/", limiter, createUser);

```


* **Router-Wide Protection**: Applying the limiter after specific routes will affect all subsequent routes in that router.
```typescript
router.use(limiter);

```

## Usage Comparison

| Type | Usage | Scope |
| --- | --- | --- |
| **Global** | `app.use(limiter)` in `index.ts` | Every request to the server. |
| **Route-Specific** | `router.post("/", limiter, ...)` | Only that specific HTTP method and path. |
| **Router-Specific** | `router.use(limiter)` | All routes defined after this line in a specific file. |