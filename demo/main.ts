import { createRuntime } from "../src/runtime";
import { aggregate } from "../src/aggregate";
import { foldRoot } from "../src/fold";
import { projectors } from "../src/projectors";
import { defaultRoot, defaultWindow } from "../defaults";

import type { Command, Event, Effect } from "../src/types/core";
import type { Root } from "../src/types/runtime";
import type { ConversationWindow } from "../src/types/conversation";

/* ---------------- DOM ---------------- */

const windowEl = document.getElementById("window")!;
const rootEl = document.getElementById("root")!;
const eventsEl = document.getElementById("events")!;
const traceEl = document.getElementById("trace")!;

const inputEl = document.getElementById("input") as HTMLInputElement;
const sendBtn = document.getElementById("send")!;
const createBtn = document.getElementById("create")!;
const muteBtn = document.getElementById("mute")!;
const unmuteBtn = document.getElementById("unmute")!;

/* ---------------- Runtime Trace (edge-based) ---------------- */

type RuntimeTrace =
  | { step: "dispatch"; command: Command }
  | { step: "aggregate"; command: Command }
  | { step: "events"; events: Event[] }
  | { step: "commit"; events: Event[] }
  | { step: "fold"; root: Root }
  | { step: "effects"; effects: Effect[] }
  | { step: "project"; event: Event }
  | { step: "window"; window: ConversationWindow };

const runtimeTraces: RuntimeTrace[] = [];

const trace = (t: RuntimeTrace): void => {
  runtimeTraces.push(t);
};

/* ---------------- Traced wrappers ---------------- */

const tracedAggregate = (root: Root, command: Command) => {
  trace({ step: "aggregate", command });

  const result = aggregate(root, command);

  trace({ step: "events", events: result.events });
  trace({ step: "effects", effects: result.effects });

  return result;
};

const eventStore = {
  events: [] as Event[],

  append(events: Event[]): void {
    trace({ step: "commit", events });
    this.events.push(...events);
  },

  all(): Event[] {
    return this.events;
  },
};

const tracedFold = (root: Root, events: Event[]): Root => {
  const next = foldRoot(root, events);
  trace({ step: "fold", root: next });
  return next;
};

const tracedProjectors = projectors.map((projector) => {
  return (window: ConversationWindow, event: Event): ConversationWindow => {
    trace({ step: "project", event });
    const next = projector(window, event);
    trace({ step: "window", window: next });
    return next;
  };
});

/* ---------------- Runtime ---------------- */

const runtime = createRuntime({
  aggregate: tracedAggregate,
  fold: tracedFold,
  eventStore,
  projectors: tracedProjectors,

  effectHandlers: {
    handle: async (): Promise<never> => {
      throw new Error("No effects in demo");
    },
  },

  effectResolver: (): Command[] => [],

  subscriptions: [],
  initialRoot: defaultRoot,
  initialWindow: defaultWindow,
});

runtime.start();

/* ---------------- Render ---------------- */

const render = (): void => {
  windowEl.textContent = JSON.stringify(
    runtime.getConversationWindow(),
    null,
    2,
  );

  rootEl.textContent = JSON.stringify(runtime.getRoot(), null, 2);

  eventsEl.textContent = eventStore.events
    .map((e, i) => `${i + 1}.\n${JSON.stringify(e, null, 2)}`)
    .join("\n\n");

  traceEl.textContent = runtimeTraces
    .map((t, i) => `${i + 1}. ${JSON.stringify(t, null, 2)}`)
    .join("\n\n");
};

const dispatchAndRender = (command: Command): void => {
  trace({ step: "dispatch", command });
  runtime.dispatch(command);
  setTimeout(render, 0);
};

render();

/* ---------------- Controls ---------------- */

createBtn.onclick = (): void => {
  dispatchAndRender({ type: "CreateConversation" });
};

sendBtn.onclick = (): void => {
  dispatchAndRender({
    type: "SendMessage",
    payload: { text: inputEl.value },
  });
  inputEl.value = "";
};

muteBtn.onclick = (): void => {
  dispatchAndRender({ type: "MuteAudio" });
};

unmuteBtn.onclick = (): void => {
  dispatchAndRender({ type: "UnmuteAudio" });
};
