import type { Command } from "./types/commands";
import { Event } from "./types/events";
import { Effect } from "./types/effects";
import { Dispatch } from "./types/runtime";

import { Root, Config, ConversationWindow } from "./types/runtime";

export const createRuntime = (
  config: Config,
): {
  start: () => void;
  stop: () => void;
  getRoot: () => Root;
  getConversationWindow: () => ConversationWindow;
  dispatch: Dispatch;
} => {
  let root: Root = config.fold(config.initialRoot, config.eventStore.all());

  let window: ConversationWindow = config.initialWindow;

  let processing: boolean = false;
  const queue: Command[] = [];

  const commitEvents = (events: Event[]): void => {
    config.eventStore.append(events);
    root = config.fold(root, events);
  };

  const runEffects = async (effects: Effect[]): Promise<Command[]> => {
    const spawned: Command[] = [];

    for (const effect of effects) {
      const result = await config.effectHandlers.handle(effect);
      const cmds = config.effectResolver(effect, result) ?? [];
      spawned.push(...cmds);
    }

    return spawned;
  };

  const project = (events: Event[]): void => {
    window = events.reduce(
      (w, event) =>
        config.projectors.reduce((acc, projector) => projector(acc, event), w),
      window,
    );
  };
  const executeCommand = async (
    command: Command,
    accEvents: Event[],
  ): Promise<void> => {
    const { events, effects } = config.aggregate(root, command);
    if (!events.length) return;

    commitEvents(events);
    accEvents.push(...events);

    if (effects.length) {
      runEffects(effects).then((spawned) => {
        for (const c of spawned) {
          dispatch(c);
        }
      });
    }
  };

  const handleCommand = async (command: Command): Promise<void> => {
    const accEvents: Event[] = [];
    await executeCommand(command, accEvents);
    if (accEvents.length) project(accEvents);
  };

  const processQueue = async (): Promise<void> => {
    processing = true;
    try {
      while (queue.length) {
        const command = queue.shift() as Command;
        await handleCommand(command);
      }
    } finally {
      processing = false;
    }
  };

  const dispatch: Dispatch = (command: Command): void => {
    queue.push(command);
    if (!processing) {
      void processQueue();
    }
  };

  const start = (): void => {
    for (const sub of config.subscriptions) {
      sub.start(dispatch);
    }
  };

  const stop = (): void => {
    for (const sub of config.subscriptions) {
      sub.stop();
    }
  };

  return {
    dispatch,
    start,
    stop,
    getRoot: (): Root => root,
    getConversationWindow: (): ConversationWindow => window,
  };
};
