import { Root } from "../types/runtime";
import { Command, Event } from "../types/core";
import { ReceiveTraces } from "../types/commands/messaging";

export const tracesAggregate = (
  root: Root,
  command: Command,
): {
  events: Event[];
  effects: [];
} => {
  switch (command.type) {
    case "ReceiveTraces": {
      if (!root.conversationActive) {
        return {
          events: [],
          effects: [],
        };
      }

      return {
        events: [],
        effects: [],
      };
    }

    default:
      return {
        events: [],
        effects: [],
      };
  }
};
