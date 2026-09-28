import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  checkRateLimit: vi.fn(() => ({
    allowed: true,
    remaining: 4,
    resetAt: Date.now() + 60_000,
  })),
  verifyTurnstileToken: vi.fn(async () => ({ success: true })),
  send: vi.fn(async () => ({})),
  Resend: vi.fn(() => ({
    emails: {
      send: mocks.send,
    },
  })),
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: mocks.checkRateLimit,
}));

vi.mock("@/lib/turnstile", () => ({
  verifyTurnstileToken: mocks.verifyTurnstileToken,
}));

vi.mock("resend", () => ({
  Resend: mocks.Resend,
}));

import { POST } from "./route";

describe("contact route", () => {
  beforeEach(() => {
    mocks.checkRateLimit.mockClear();
    mocks.verifyTurnstileToken.mockClear();
    mocks.send.mockClear();
    mocks.Resend.mockClear();
  });

  it("rejects submissions without privacy consent before side effects", async () => {
    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        program: "other",
        message: "Hello",
        lang: "en",
      }),
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error.fieldErrors.privacyConsent).toBeTruthy();
    expect(mocks.checkRateLimit).not.toHaveBeenCalled();
    expect(mocks.verifyTurnstileToken).not.toHaveBeenCalled();
    expect(mocks.Resend).not.toHaveBeenCalled();
    expect(mocks.send).not.toHaveBeenCalled();
  });
});
