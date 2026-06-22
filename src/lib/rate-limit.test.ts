import { describe, expect, it } from "vitest";
import { createFixedWindowRateLimiter } from "./rate-limit";

describe("createFixedWindowRateLimiter", () => {
  it("allows requests until the fixed window limit is reached", () => {
    const now = 1_000;
    const limiter = createFixedWindowRateLimiter({ now: () => now });

    expect(limiter.check("ip:1", 2, 1_000)).toEqual({ allowed: true, remaining: 1, resetAt: 2_000 });
    expect(limiter.check("ip:1", 2, 1_000)).toEqual({ allowed: true, remaining: 0, resetAt: 2_000 });
    expect(limiter.check("ip:1", 2, 1_000)).toEqual({ allowed: false, remaining: 0, resetAt: 2_000 });
  });

  it("resets the bucket after the window expires", () => {
    let now = 1_000;
    const limiter = createFixedWindowRateLimiter({ now: () => now });

    limiter.check("ip:1", 1, 1_000);
    now = 2_001;

    expect(limiter.check("ip:1", 1, 1_000)).toEqual({ allowed: true, remaining: 0, resetAt: 3_001 });
  });

  it("prunes expired buckets and caps total retained keys", () => {
    let now = 1_000;
    const limiter = createFixedWindowRateLimiter({ maxBuckets: 2, now: () => now });

    limiter.check("a", 1, 1_000);
    limiter.check("b", 1, 10_000);
    expect(limiter.size()).toBe(2);

    now = 2_001;
    limiter.check("c", 1, 10_000);

    expect(limiter.size()).toBe(2);
    expect(limiter.has("a")).toBe(false);
    expect(limiter.has("b")).toBe(true);
    expect(limiter.has("c")).toBe(true);
  });
});
