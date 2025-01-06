import { formatMessageTime } from "./date-utils";

describe("formatMessageTime", () => {
  it("should format timestamp correctly", () => {
    const timestamp = "2024-01-01T14:30:00Z";
    const result = formatMessageTime(timestamp);

    // Note: This test might need to be adjusted based on the timezone
    expect(result).toMatch(/\d{1,2}:\d{2} [AP]M/);
  });

  it("should handle invalid dates gracefully", () => {
    expect(() => formatMessageTime("invalid-date")).not.toThrow();
  });
});
