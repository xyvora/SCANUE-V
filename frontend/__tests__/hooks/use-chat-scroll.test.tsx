import { renderHook } from "@testing-library/react";
import { useChatScroll } from "../../hooks/use-chat-scroll";

describe("useChatScroll", () => {
  it("scrolls to the bottom when new messages are added", () => {
    const { result, rerender } = renderHook(() => useChatScroll({ messages: [] }));
    const scrollRef = result.current.scrollRef;
    Object.defineProperty(scrollRef, "current", {
      value: {
        scrollTop: 0,
        scrollHeight: 100,
        clientHeight: 50,
      },
      writable: true,
    });

    rerender({ messages: [{ id: "1", content: "New message" }] });

    expect(scrollRef.current?.scrollTop).toBe(50);
  });

  it("does not scroll when shouldAutoScroll is false", () => {
    const { result, rerender } = renderHook(() =>
      useChatScroll({ messages: [], shouldAutoScroll: false }),
    );

    const scrollRef = result.current.scrollRef;
    Object.defineProperty(scrollRef, "current", {
      value: {
        scrollTop: 0,
        scrollHeight: 100,
        clientHeight: 50,
      },
      writable: true,
    });

    rerender({ messages: [{ id: "1", content: "New message" }] });

    expect(scrollRef.current?.scrollTop).toBe(0);
  });
});
