import { createRuntime } from "../../src/runtime";
import { aggregate } from "../../src/aggregate";
import { foldRoot } from "../../src/fold";
import { projectors } from "../../src/projectors";
import { defaultRoot, defaultWindow } from "../../defaults";

import type { Event } from "../../src/types/core";

export const createTestRuntime = () => {
  const eventStore = {
    events: [] as Event[],

    append(events: Event[]): void {
      this.events.push(...events);
    },

    all(): Event[] {
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
        return {
          ok: true,
          value: {
            requestId: "test",
            status: 200,
            data: [],
            headers: {},
          },
        };
      },
    },

    effectResolver: () => [],
    subscriptions: [],
    initialRoot: defaultRoot,
    initialWindow: defaultWindow,
  });

  return { runtime, eventStore };
};
