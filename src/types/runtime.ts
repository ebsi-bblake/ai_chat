import { Command } from "./commands";
import { Event } from "./events";
import { Effect, EffectResult } from "./effects/index";

export type Dispatch = (command: Command) => void;
export type ID = () => string;
export type Aggregate = (
  root: Root,
  command: Command,
  ids: ID,
) => {
  events: Event[];
  effects: Effect[];
};

export type RunTime = {
  init: () => RunTime;
  bootstrap: () => RunTime;
  stop: () => RunTime;
  getRoot: () => Root;
  getConversationWindow: () => ConversationWindow;
  dispatch: Dispatch;
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

export type EffectHandlers = (effect: Effect) => Promise<EffectResult>;

export type EffectResolver = (
  effect: Effect,
  result: EffectResult,
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
  ids: ID;
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

export type ConversationWindow = {
  conversationId: string;
  conversation: Conversation;
  avatars: Avatar[];
  isTyping: boolean;
  isMuted: boolean;
};

export type Conversation = {
  conversationId: string;
  avatars: Avatar[];
  utterances: Utterance[];
};

export type Utterance = {
  time: string;
  conversationId: string;
  avatar: Avatar;
  messages: Message[];
};

export type Message = {
  avatar: Avatar;
  text?: string;
  visual?: unknown;
  buttons?: unknown[];
  type?: string;
};

export type Avatar = {
  id: string;
  name: string;
  role: "user" | "assistant" | "system";
};
