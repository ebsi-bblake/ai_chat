import { describe, it, expect } from "vitest";
import { createTestRuntime } from "../utils/createTestRuntime";
import { flush } from "../utils/flush";

describe("runtime dispatch flow", () => {
  it("CreateConversation updates Root and Window", async () => {
    const { runtime } = createTestRuntime();

    runtime.dispatch({ type: "CreateConversation" });
    await flush();

    expect(runtime.getRoot().conversationActive).toBe(true);
    expect(runtime.getConversationWindow().conversationId).not.toBe("");
  });

  it("SendMessage creates an utterance", async () => {
    const { runtime } = createTestRuntime();

    runtime.dispatch({ type: "CreateConversation" });
    await flush();

    runtime.dispatch({
      type: "SendMessage",
      payload: { text: "hello" },
    });
    await flush();

    expect(runtime.getConversationWindow().conversation.utterances.length).toBe(
      1,
    );
  });

  it("Rejecting command does not mutate window", async () => {
    const { runtime } = createTestRuntime();

    runtime.dispatch({
      type: "SendMessage",
      payload: { text: "nope" },
    });
    await flush();

    expect(runtime.getConversationWindow().conversation.utterances.length).toBe(
      0,
    );
  });
});
