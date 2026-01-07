import { describe, it, expect } from "vitest";
import {
  foldChatWindowOpened,
  foldChatWindowClosed,
} from "../../src/fold/chat-window";
import { defaultRoot } from "../../defaults";

describe("chat window folds", () => {
  it("ChatWindowOpened sets conversationActive=true", () => {
    const next = foldChatWindowOpened(defaultRoot, {
      type: "ChatWindowOpened",
      payload: { time: "t" },
    });

    expect(next.conversationActive).toBe(true);
  });

  it("ChatWindowClosed sets conversationActive=false", () => {
    const root = { ...defaultRoot, conversationActive: true };

    const next = foldChatWindowClosed(root, {
      type: "ChatWindowClosed",
      payload: { time: "t" },
    });

    expect(next.conversationActive).toBe(false);
  });
});
