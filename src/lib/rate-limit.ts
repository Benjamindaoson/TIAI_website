type Bucket = {
  count: number;
  resetAt: number;
};

type RateLimiterOptions = {
  maxBuckets?: number;
  now?: () => number;
};

export function createFixedWindowRateLimiter(options: RateLimiterOptions = {}) {
  const buckets = new Map<string, Bucket>();
  const maxBuckets = options.maxBuckets ?? 1_000;
  const now = options.now ?? Date.now;

  function pruneExpired(currentTime: number) {
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= currentTime) {
        buckets.delete(key);
      }
    }
  }

  function capBuckets() {
    while (buckets.size > maxBuckets) {
      const oldestKey = buckets.keys().next().value as string | undefined;
      if (!oldestKey) return;
      buckets.delete(oldestKey);
    }
  }

  return {
    check(key: string, limit: number, windowMs: number) {
      const currentTime = now();
      pruneExpired(currentTime);

      const current = buckets.get(key);
      if (!current) {
        const resetAt = currentTime + windowMs;
        buckets.set(key, { count: 1, resetAt });
        capBuckets();
        return { allowed: true, remaining: limit - 1, resetAt };
      }

      if (current.count >= limit) {
        return { allowed: false, remaining: 0, resetAt: current.resetAt };
      }

      current.count += 1;
      return { allowed: true, remaining: limit - current.count, resetAt: current.resetAt };
    },
    has(key: string) {
      return buckets.has(key);
    },
    size() {
      return buckets.size;
    },
  };
}

const defaultLimiter = createFixedWindowRateLimiter();

export function checkRateLimit(key: string, limit: number, windowMs: number) {
  return defaultLimiter.check(key, limit, windowMs);
}
