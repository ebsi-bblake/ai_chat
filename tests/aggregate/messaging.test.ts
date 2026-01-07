import { describe, it, expect } from "vitest";
import { messagingAggregate } from "../../src/aggregate/messaging";
import { defaultRoot } from "../../defaults";

describe("messagingAggregate", () => {
  it("SendMessage emits MessageSent when valid", () => {
    const root = {
      ...defaultRoot,
      conversationActive: true,
      conversationId: "c1",
    };

    const r = messagingAggregate(root, {
      type: "SendMessage",
      payload: { text: "hello" },
    });

    expect(r.events[0].type).toBe("MessageSent");
  });

  it("SendMessage rejects empty text", () => {
    const root = {
      ...defaultRoot,
      conversationActive: true,
      conversationId: "c1",
    };

    const r = messagingAggregate(root, {
      type: "SendMessage",
      payload: { text: "" },
    });

    expect(r.events[0].type).toBe("CommandRejected");
  });

  it("SendMessage rejects without active conversation", () => {
    const r = messagingAggregate(defaultRoot, {
      type: "SendMessage",
      payload: { text: "hi" },
    });

    expect(r.events[0].type).toBe("CommandRejected");
  });
});
