import type { StorageReadResult } from "../../../../src/types/effects/storage";
import type { Command, LoadEvents } from "../../../../src/types/commands";
import type { ID } from "../../../../src/types/runtime";

export const resolveStorageEffect =
  (ids: ID) =>
  (result: StorageReadResult): Command[] => {
    if (!result.ok || !result.value.value) return [];

    let events: unknown;
    try {
      events = JSON.parse(result.value.value);
    } catch {
      return [];
    }

    const loadEvents: LoadEvents = {
      type: "LoadEvents",
      category: "command",
      id: ids(),
      time: Date.now().toString(),
      data: {
        events: events as any[],
      },
    };

    return [loadEvents];
  };
