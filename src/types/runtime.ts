import { Command, Event, Effect, Dispatch } from "./core";
import { ConversationWindow } from "./conversation";
import { EffectResult } from "./effects/effect-result";

export type Aggregate = (
  root: Root,
  command: Command,
) => {
  events: Event[];
  effects: Effect[];
};

export type EventStore = {
  append: (events: Event[]) => void;
  all: () => Event[];
};

export type Projector = (
  window: ConversationWindow,
  event: Event,
) => ConversationWindow;

export type Subscription = {
  start: (dispatch: Dispatch) => void;
  stop: () => void;
};

export type EffectHandlers = {
  handle<T extends Effect>(effect: T): Promise<EffectResult<T>>;
};

export type EffectResolver = (
  effect: Effect,
  result: EffectResult<Effect>,
) => Command[] | undefined;

export type Config = {
  aggregate: Aggregate;
  fold: (root: Root, events: Event[]) => Root;
  eventStore: EventStore;
  projectors: Projector[];
  effectHandlers: EffectHandlers;
  effectResolver: EffectResolver;
  subscriptions: Subscription[];
  initialRoot: Root;
  initialWindow: ConversationWindow;
};

export type Root = {
  conversationId: string | null;
  conversationActive: boolean;
  audioMuted: boolean;
  audioPlaying: boolean;
  currentAudioUrl: string | null;
  networkRetries: Record<string, number>;
  audioRetries: Record<string, number>;
};
