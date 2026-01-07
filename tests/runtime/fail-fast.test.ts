import { describe, it, expect } from "vitest";
import { createRuntime } from "../../src/runtime";
import { aggregate } from "../../src/aggregate";
import { foldRoot } from "../../src/fold";
import { projectors } from "../../src/projectors";
import { defaultRoot, defaultWindow } from "../../defaults";
import { flush } from "../utils/flush";

process.on("unhandledRejection", () => {
  // Expected in fail-fast runtime tests
});

describe("runtime fail-fast", () => {
  it("does not project when effect handler throws", async () => {
    const eventStore = {
      events: [],
      append(e) {
        this.events.push(...e);
      },
      all() {
        return this.events;
      },
    };

    const runtime = createRuntime({
      aggregate,
      fold: foldRoot,
      eventStore,
      projectors,
      effectHandlers: {
        handle: async () => {
          throw new Error("boom");
        },
      },
      effectResolver: () => [],
      subscriptions: [],
      initialRoot: defaultRoot,
      initialWindow: defaultWindow,
    });

    // baseline
    expect(runtime.getConversationWindow().conversation.utterances.length).toBe(
      0,
    );

    runtime.dispatch({ type: "CreateConversation" });
    await flush();

    runtime.dispatch({
      type: "SendMessage",
      payload: { text: "hi" },
    });

    await flush();

    // FAIL-FAST ASSERTION:
    // MessageSent may have been committed,
    // but projection must NOT have occurred
    expect(runtime.getConversationWindow().conversation.utterances.length).toBe(
      0,
    );
  });
});
