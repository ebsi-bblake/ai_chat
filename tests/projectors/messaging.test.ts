import { describe, it, expect } from "vitest";
import { projectMessageSent } from "../../src/projectors/messaging";
import { defaultWindow } from "../../defaults";

describe("message projectors", () => {
  it("MessageSent creates an utterance", () => {
    const next = projectMessageSent(defaultWindow, {
      type: "MessageSent",
      payload: { messageId: "m1", time: "t" },
    });

    expect(next.conversation.utterances.length).toBe(1);
  });
});
