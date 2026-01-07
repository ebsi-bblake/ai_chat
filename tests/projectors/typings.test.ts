import { describe, it, expect } from "vitest";
import {
  projectTypingStarted,
  projectTypingStopped,
} from "../../src/projectors/typing";
import { defaultWindow } from "../../defaults";

describe("typing projectors", () => {
  it("TypingStarted sets isTyping=true", () => {
    const next = projectTypingStarted(defaultWindow, {
      type: "TypingStarted",
      payload: { time: "t" },
    });

    expect(next.isTyping).toBe(true);
  });

  it("TypingStopped sets isTyping=false", () => {
    const window = { ...defaultWindow, isTyping: true };

    const next = projectTypingStopped(window, {
      type: "TypingStopped",
      payload: { time: "t" },
    });

    expect(next.isTyping).toBe(false);
  });
});
