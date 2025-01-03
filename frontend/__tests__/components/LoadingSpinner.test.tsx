import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders with default size", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveStyle({ width: "24px", height: "24px" });
  });

  it("renders with custom size", () => {
    render(<LoadingSpinner size={40} />);
    const spinner = screen.getByRole("status");
    expect(spinner).toHaveStyle({ width: "40px", height: "40px" });
  });
});
