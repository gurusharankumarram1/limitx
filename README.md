# 🚀 LimitX
### Lightweight Token Bucket Rate Limiter for Node.js

Fast • Simple • Stable • API-Friendly

[![npm version](https://img.shields.io/npm/v/limitx.svg)](https://www.npmjs.com/package/limitx) 
[![npm downloads](https://img.shields.io/npm/dt/limitx.svg)](https://www.npmjs.com/package/limitx) 
[![Node version](https://img.shields.io/badge/node-%3E=14-green)](https://nodejs.org/) 
[![License](https://img.shields.io/github/license/gurusharankumarram1/limitx)](https://github.com/gurusharankumarram1/limitx/blob/main/LICENSE)

---

## 🌟 Overview

**LimitX** is a clean and efficient Token Bucket rate limiter designed for backend and API workloads.  
It focuses on predictable behaviour, stable performance, and smooth integration with any Node.js framework.

A straightforward tool for managing request flow and protecting critical routes with minimal setup.

---

## ⭐ Features

- ⚡ Efficient token bucket algorithm
- 🎯 Designed for backend APIs (Express, Fastify, Koa, etc.)
- 🔄 Automatic token refill with precise time calculation
- 🧩 Cleanup for inactive keys
- 🪝 Hooks for logging & monitoring
- 🟦 Comes with TypeScript definitions (`index.d.ts`)
- 🛠️ Small API surface, easy to integrate

---

## 📦 Installation

```bash
npm install limitx
````

---

## 🚀 Quick Usage

```js
const LimitX = require("limitx");

const limiter = new LimitX({
  capacity: 20,
  refillRate: 5,
});

app.get("/api/data", (req, res) => {
  const result = limiter.consume(req.ip);

  if (!result.allowed) {
    return res.status(429).send("Too many requests");
  }

  res.send("Success");
});
```

---

# 🔧 Options & Usage Guide

Here is the full configuration reference:

```js
const limiter = new LimitX({
  capacity: 10,           // Max tokens
  refillRate: 1,          // Tokens per second
  idleTTL: 120000,        // Auto remove inactive users
  cleanupInterval: 60000, // Interval for cleanup

  onAllow: (key, info) => {},
  onReject: (key, info) => {},
  onRefill: (info) => {},
});
```

---

# 📘 Option Details

## 1️⃣ `capacity`

Maximum number of tokens per key.

```js
new LimitX({ capacity: 50 });
```

---

## 2️⃣ `refillRate`

Number of tokens added per second.

```js
new LimitX({ refillRate: 5 });
```

---

## 3️⃣ `idleTTL`

Remove inactive buckets automatically.

```js
new LimitX({ idleTTL: 60000 }); // 1 min
```

---

## 4️⃣ `cleanupInterval`

How often the cleanup runs.

```js
new LimitX({ cleanupInterval: 30000 });
```

---

# 🪝 Hooks

Hooks allow you to track limiter activity.

---

## 5️⃣ `onAllow(key, info)`

Triggered when a request is allowed.

```js
onAllow: (key, info) => {
  console.log("Allowed:", key, info.tokens);
}
```

---

## 6️⃣ `onReject(key, info)`

Triggered when a request is blocked.

```js
onReject: (key, info) => {
  console.log("Rejected:", key, info.tokens);
}
```

---

## 7️⃣ `onRefill(info)`

Triggered when tokens are refilled.

```js
onRefill: (info) => {
  console.log("Refilled:", info.tokens);
}
```

---

# 🎮 Full Example With All Features

```js
const limiter = new LimitX({
  capacity: 20,
  refillRate: 4,
  idleTTL: 100000,
  cleanupInterval: 50000,

  onAllow: (key, info) => {
    console.log(`[ALLOW] ${key} → ${info.tokens}`);
  },

  onReject: (key, info) => {
    console.log(`[REJECT] ${key} → ${info.tokens}`);
  },

  onRefill: (info) => {
    console.log(`[REFILL] tokens → ${info.tokens}`);
  },
});

// Use in API route
const result = limiter.consume(req.ip);

if (!result.allowed) {
  return res.status(429).json({ message: "Rate limit exceeded" });
}
```

---

# 📘 API Reference

### `consume(key, weight = 1)`

Consumes tokens and returns:

```ts
{ allowed: boolean, remaining: number }
```

---

### `getTokens(key)`

Returns remaining tokens for the key.

---

### `reset(key)`

Clears a specific bucket.

---

### `stop()`

Stops the internal cleanup timer.

---

<div align="center">
  <b>LimitX — Simple. Fast. Stable. A modern rate limiter for Node.js backends.</b>
</div>
