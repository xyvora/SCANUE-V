import type { PropsWithChildren, HTMLAttributes } from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { ChatInterfaceClient } from "@/components/ChatInterfaceClient";

// Mock scrollIntoView
window.HTMLElement.prototype.scrollIntoView = jest.fn();

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: PropsWithChildren<HTMLAttributes<HTMLDivElement>>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: PropsWithChildren) => <>{children}</>,
}));

// Mock fetch
type MockResponse = {
  ok: boolean;
  status: number;
  json: () => Promise<{
    message: string;
    agentResponse: string;
    timestamp: string;
  }>;
};

const mockFetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve({
        message: "Test response",
        agentResponse: "Test agent response",
        timestamp: new Date().toISOString(),
      }),
  } as MockResponse),
);
global.fetch = mockFetch as unknown as typeof fetch;

describe("ChatInterfaceClient", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<ChatInterfaceClient />);
    expect(screen.getByTestId("chat-interface")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Message .* agent/i)).toBeInTheDocument();
  });

  it("handles input changes", () => {
    render(<ChatInterfaceClient />);
    const input = screen.getByPlaceholderText(/Message .* agent/i);
    fireEvent.change(input, { target: { value: "test message" } });
    expect(input).toHaveValue("test message");
  });

  it("handles message submission", async () => {
    render(<ChatInterfaceClient />);
    const input = screen.getByPlaceholderText(/Message .* agent/i);
    const form = screen.getByRole("form");

    fireEvent.change(input, { target: { value: "test message" } });
    await act(async () => {
      fireEvent.submit(form);
    });

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(input).toHaveValue("");
    });
  });

  it("shows error for empty message", async () => {
    render(<ChatInterfaceClient />);
    const form = screen.getByRole("form");

    await act(async () => {
      fireEvent.submit(form);
    });

    expect(screen.getByText("Please enter a message")).toBeInTheDocument();
  });

  it("shows loading state", async () => {
    render(<ChatInterfaceClient />);
    const input = screen.getByPlaceholderText(/Message .* agent/i);
    const form = screen.getByRole("form");

    fireEvent.change(input, { target: { value: "test message" } });
    fireEvent.submit(form);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("handles API errors", async () => {
    mockFetch.mockImplementationOnce(() => Promise.reject(new Error("API Error")));

    render(<ChatInterfaceClient />);
    const input = screen.getByPlaceholderText(/Message .* agent/i);
    const form = screen.getByRole("form");

    fireEvent.change(input, { target: { value: "test message" } });
    await act(async () => {
      fireEvent.submit(form);
    });

    expect(screen.getByText("Failed to send message. Please try again.")).toBeInTheDocument();
  });

  it("switches agent types", () => {
    render(<ChatInterfaceClient />);
    fireEvent.click(screen.getByText("PFC"));
    expect(screen.getByPlaceholderText(/Message PFC agent/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText("General"));
    expect(screen.getByPlaceholderText(/Message General agent/i)).toBeInTheDocument();
  });
});
