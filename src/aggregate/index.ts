import { Root } from "../types/runtime";
import { Command, Event, Effect } from "../types/core";

import { conversationAggregate } from "./conversation";
import { messagingAggregate } from "./messaging";
import { tracesAggregate } from "./traces";
import { audioAggregate } from "./audio";

type AggregateResult = {
  events: Event[];
  effects: Effect[];
};

export const aggregate = (root: Root, command: Command): AggregateResult => {
  const aggregates = [
    conversationAggregate,
    messagingAggregate,
    tracesAggregate,
    audioAggregate,
  ];

  for (const fn of aggregates) {
    const result: AggregateResult = fn(root, command);

    if (result.events.length > 0 || result.effects.length > 0) {
      return result;
    }
  }

  return {
    events: [],
    effects: [],
  };
};
