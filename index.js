class LimitX {
  constructor(options = {}) {
    this.capacity = options.capacity ?? 10;
    this.refillRate = options.refillRate ?? 1;
    this.idleTTL = options.idleTTL ?? 120000;
    this.cleanupInterval = options.cleanupInterval ?? 60000;

    this.onAllow = options.onAllow || null;
    this.onReject = options.onReject || null;
    this.onRefill = options.onRefill || null;

    this.buckets = new Map();

    this._cleanupTimer = setInterval(
      () => this._cleanup(),
      this.cleanupInterval
    );
    this._cleanupTimer.unref();
  }

  _safeHook(fn, type, ...args) {
    if (typeof fn !== "function") return;
    try {
      fn(...args);
    } catch (err) {
      console.error(`[LimitX] Hook "${type}" error:`, err);
    }
  }

  _cleanup() {
    const now = process.hrtime.bigint();
    for (const [key, bucket] of this.buckets) {
      if (Number(now - bucket.lastRefillNs) / 1e6 > this.idleTTL) {
        this.buckets.delete(key);
      }
    }
  }

  _refill(bucket) {
    const now = process.hrtime.bigint();
    const elapsedNs = now - bucket.lastRefillNs;
    const tokensToAdd = (Number(elapsedNs) / 1e9) * this.refillRate;

    if (tokensToAdd > 0) {
      const oldTokens = bucket.tokens;
      bucket.tokens = Math.min(this.capacity, bucket.tokens + tokensToAdd);
      bucket.lastRefillNs = now;

      if (bucket.tokens !== oldTokens) {
        this._safeHook(this.onRefill, "onRefill", {
          tokens: bucket.tokens,
          capacity: this.capacity,
        });
      }
    }
  }

  consume(key, weight = 1) {
    if (typeof key !== "string") {
      throw new Error(`[LimitX] consume(key) requires key to be a string.`);
    }

    let bucket = this.buckets.get(key);

    if (!bucket) {
      bucket = {
        tokens: this.capacity,
        lastRefillNs: process.hrtime.bigint(),
      };
      this.buckets.set(key, bucket);
    }

    this._refill(bucket);

    const allowed = bucket.tokens >= weight;

    if (allowed) {
      bucket.tokens -= weight;
      this._safeHook(this.onAllow, "onAllow", key, {
        tokens: bucket.tokens,
        consumed: weight,
      });
    } else {
      this._safeHook(this.onReject, "onReject", key, {
        tokens: bucket.tokens,
        consumed: weight,
      });
    }

    return {
      allowed,
      remaining: bucket.tokens,
    };
  }

  getTokens(key) {
    const bucket = this.buckets.get(key);
    return bucket ? bucket.tokens : this.capacity;
  }

  reset(key) {
    this.buckets.delete(key);
  }

  stop() {
    clearInterval(this._cleanupTimer);
  }
}

module.exports = LimitX;
