import { createRuntime } from "../../src/runtime";
import { aggregate } from "../../src/aggregate";
import { foldRoot } from "../../src/fold";
import { projectors } from "../../src/projectors";
import { defaultRoot, defaultWindow } from "../../defaults";
import { ids } from "../../platform/web/index.ts";
import type { Command, Event, Effect } from "../../src/types";
import type { Root, ConversationWindow } from "../../src/types/runtime";
import type { EffectResult } from "../../src/types/effects/effect-result.ts";
import { handleEffect } from "./effects/web/effect-handlers.ts";
import { resolveEffect } from "./effects/web/effect-resolvers.ts";
/* ---------------- DOM ---------------- */

const windowEl = document.getElementById("window")!;
const rootEl = document.getElementById("root")!;
const eventsEl = document.getElementById("events")!;
const traceEl = document.getElementById("trace")!;

const copyTraceBtn = document.getElementById("copyTrace")!;
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
  | { step: "effect.handle.start"; effect: Effect }
  | { step: "effect.handle.result"; result: EffectResult<Effect> }
  | {
      step: "effect.resolve.start";
      effect: Effect;
      result: EffectResult<Effect>;
    }
  | { step: "effect.resolve.commands"; commands: Command[] }
  | { step: "project"; event: Event }
  | { step: "window"; window: ConversationWindow };

const runtimeTraces: RuntimeTrace[] = [];

const trace = (t: RuntimeTrace): void => {
  runtimeTraces.push(t);
};

/* ---------------- Traced wrappers ---------------- */

const tracedAggregate = (root: Root, command: Command) => {
  trace({ step: "aggregate", command });

  const result = aggregate(root, command, ids);

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

const tracedEffectHandler = async (effect: Effect) => {
  trace({ step: "effect.handle.start", effect });

  const result = await handleEffect(effect);

  trace({ step: "effect.handle.result", result });

  return result;
};

const tracedEffectResolver = (effect: Effect, result: EffectResult<Effect>) => {
  trace({ step: "effect.resolve.start", effect, result });

  const commands = resolveEffect(ids)(effect, result) ?? [];

  trace({ step: "effect.resolve.commands", commands });

  setTimeout(render, 0);
  return commands;
};

/* ---------------- Runtime ---------------- */

const runtime = createRuntime({
  aggregate: tracedAggregate,
  fold: tracedFold,
  eventStore,
  projectors: tracedProjectors,
  ids,
  effectHandlers: {
    handle: tracedEffectHandler,
  },

  effectResolver: tracedEffectResolver,

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

const conversationId = ids();

createBtn.onclick = (): void => {
  dispatchAndRender({
    type: "CreateConversation",
    category: "command",
    id: conversationId,
    data: { avatar: "participant" },
    time: Date.now().toString(),
  });
};

sendBtn.onclick = (): void => {
  dispatchAndRender({
    type: "SendMessage",
    category: "command",
    id: ids(),
    time: Date.now().toString(),
    data: {
      conversationId,
      prompt: inputEl.value.toString(),
      avatar: "participant",
    },
  });
  inputEl.value = "";
};

muteBtn.onclick = (): void => {
  dispatchAndRender({
    type: "MuteAudio",
    category: "command",
    id: ids(),
    time: Date.now().toString(),
    data: { conversationId, avatar: "participant" },
  });
};

unmuteBtn.onclick = (): void => {
  dispatchAndRender({
    type: "UnmuteAudio",
    category: "command",
    id: ids(),
    time: Date.now().toString(),
    data: { conversationId, avatar: "participant" },
  });
};

copyTraceBtn.onclick = () => {
  const text = traceEl.textContent ?? "";
  navigator.clipboard.writeText(text);
};
