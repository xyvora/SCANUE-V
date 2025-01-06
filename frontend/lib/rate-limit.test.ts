import { rateLimit, RATE_LIMIT } from "./rate-limit";
import { NextRequest } from "next/server";

describe("rateLimit", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("allows requests under the rate limit", async () => {
    const request = new NextRequest("https://example.com");

    for (let i = 0; i < RATE_LIMIT; i++) {
      const result = await rateLimit(request);
      expect(result.success).toBe(true);
      expect(result.remaining).toBe(RATE_LIMIT - i - 1);
    }
  });

  it("blocks requests over the rate limit", async () => {
    const request = new NextRequest("https://example.com");

    for (let i = 0; i < RATE_LIMIT; i++) {
      await rateLimit(request);
    }

    const result = await rateLimit(request);
    expect(result.success).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it("resets rate limit after window expires", async () => {
    const request = new NextRequest("https://example.com");
    await rateLimit(request);

    jest.advanceTimersByTime(60_000);

    const result = await rateLimit(request);
    expect(result.success).toBe(true);
    expect(result.remaining).toBe(RATE_LIMIT - 1);
  });
});
