import { cn } from "./utils";

describe("cn utility", () => {
  it("should merge class names correctly", () => {
    const result = cn("base-class", "conditional-class", { "dynamic-class": true }, [
      "array-class",
    ]);
    expect(result).toBe("base-class conditional-class dynamic-class array-class");
  });

  it("should handle conflicting tailwind classes", () => {
    const result = cn("p-4", "p-6");
    expect(result).toBe("p-6");
  });
});
