import { describe, it, expect } from "vitest";
import {
  foldConversationCreated,
  foldConversationTerminated,
} from "../../src/fold/conversation";
import { defaultRoot } from "../../defaults";

describe("conversation folds", () => {
  it("ConversationCreated sets id and active", () => {
    const next = foldConversationCreated(defaultRoot, {
      type: "ConversationCreated",
      payload: { conversationId: "c1", time: "t" },
    });

    expect(next.conversationId).toBe("c1");
    expect(next.conversationActive).toBe(true);
  });

  it("ConversationTerminated clears id and active", () => {
    const root = {
      ...defaultRoot,
      conversationId: "c1",
      conversationActive: true,
    };

    const next = foldConversationTerminated(root, {
      type: "ConversationTerminated",
      payload: { time: "t" },
    });

    expect(next.conversationId).toBeNull();
    expect(next.conversationActive).toBe(false);
  });
});
