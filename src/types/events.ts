import { BaseType, Avatar } from "./base";

// --------- Session / Conversation ---------

export type ConversationCreated = BaseType<
  "ConversationCreated",
  "session",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;

export type ConversationRestartInitiated = BaseType<
  "ConversationRestartInitiated",
  "session",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;

export type ConversationRestartConfirmed = BaseType<
  "ConversationRestartConfirmed",
  "session",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;

export type ConversationRestartCanceled = BaseType<
  "ConversationRestartCanceled",
  "session",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;

export type ConversationRestarted = BaseType<
  "ConversationRestarted",
  "session",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;

export type ConversationTerminated = BaseType<
  "ConversationTerminated",
  "session",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;

// --------- System / Trace ---------

export type TracesAcknowledged = BaseType<
  "TracesAcknowledged",
  "system",
  {
    conversationId: string;
    count: number;
  }
>;

export type ChatWindowOpened = BaseType<
  "ChatWindowOpened",
  "system",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;

export type ChatWindowClosed = BaseType<
  "ChatWindowClosed",
  "system",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;

export type AudioPlaybackStarted = BaseType<
  "AudioPlaybackStarted",
  "audio",
  {
    conversationId: string;
    audioSrc: string;
  }
>;

export type AudioPlaybackCompleted = BaseType<
  "AudioPlaybackCompleted",
  "audio",
  {
    conversationId: string;
    audioSrc: string;
  }
>;

export type AudioMuted = BaseType<
  "AudioMuted",
  "system",
  {
    conversationId: string;
  }
>;

export type AudioUnmuted = BaseType<
  "AudioUnmuted",
  "system",
  {
    conversationId: string;
  }
>;

export type AudioPlaybackFailed = BaseType<
  "AudioPlaybackFailed",
  "audio",
  {
    conversationId: string;
    audioSrc: string;
    reason: string;
  }
>;

export type AudioStarted = BaseType<
  "AudioStarted",
  "audio",
  {
    conversationId: string;
    avatar: Avatar;
    audioSrc: string;
  }
>;

export type AudioCompleted = BaseType<
  "AudioCompleted",
  "audio",
  {
    conversationId: string;
    avatar: Avatar;
    audioSrc: string;
  }
>;

export type AudioFailed = BaseType<
  "AudioFailed",
  "audio",
  {
    conversationId: string;
    avatar: Avatar;
    audioSrc: string;
    reason: string;
  }
>;

export type TypingStarted = BaseType<
  "TypingStarted",
  "typing",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;

export type TypingStopped = BaseType<
  "TypingStopped",
  "typing",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;

export type MessageRendered = BaseType<
  "MessageRendered",
  "system",
  {
    conversationId: string;
    messageId: number;
  }
>;

// --------- Utterance Boundaries ---------

export type UtteranceStarted = BaseType<
  "UtteranceStarted",
  "message",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;

export type UtteranceEnded = BaseType<
  "UtteranceEnded",
  "message",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;

// --------- Message / AI ---------

export type MessageSent = BaseType<
  "MessageSent",
  "message",
  {
    conversationId: string;
    prompt: string;
    avatar: Avatar;
  }
>;

export type MessageTextReceived = BaseType<
  "MessageTextReceived",
  "message",
  {
    conversationId: string;
    avatar: Avatar;
    text: string;
    audio?: string;
  }
>;

export type MessageVisualReceived = BaseType<
  "MessageVisualReceived",
  "message",
  {
    conversationId: string;
    visual: {
      type: "image" | "video" | "url";
      src: string;
      dimensions?: { width: number; height: number } | null;
      canvasVisibility?: "full" | "partial";
    };
  }
>;

export type MessageChoiceReceived = BaseType<
  "MessageChoiceReceived",
  "message",
  {
    conversationId: string;
    buttons: Array<{
      name: string;
      request: unknown;
    }>;
  }
>;

export type MessageCarouselReceived = BaseType<
  "MessageCarouselReceived",
  "message",
  {
    conversationId: string;
    layout: string;
    cards: Array<{
      id: string;
      title: string;
      description: string;
      imageUrl?: string;
      buttons?: unknown[];
    }>;
  }
>;

export type MessageCardReceived = BaseType<
  "MessageCardReceived",
  "message",
  {
    conversationId: string;
    cards: Array<{
      title?: string;
      description?: string;
      imageUrl?: string;
      buttons?: unknown[];
    }>;
  }
>;

export type MessageCarouselPresented = BaseType<
  "MessageCarouselPresented",
  "message",
  {
    conversationId: string;
    layout: string;
    cards: Array<{
      id: string;
      title: string;
      description: string;
      imageUrl?: string;
      buttons?: unknown[];
    }>;
  }
>;

export type MessageCardPresented = BaseType<
  "MessageCardPresented",
  "message",
  {
    conversationId: string;
    cards: Array<{
      title?: string;
      description?: string;
      imageUrl?: string;
      buttons?: unknown[];
    }>;
  }
>;

export type MessageVisualPresented = BaseType<
  "MessageVisualPresented",
  "message",
  {
    conversationId: string;
    visual: {
      type: "image" | "video" | "url";
      src: string;
      dimensions?: { width: number; height: number } | null;
      canvasVisibility?: "full" | "partial";
    };
  }
>;

// --------- Snapshot / Errors ---------

export type EventsSnapshot = BaseType<
  "EventsSnapshot",
  "system",
  {
    conversationId: string;
    events: Event[];
  }
>;

export type CommandRejected = BaseType<
  "CommandRejected",
  "system",
  {
    conversationId: string;
    reason: string;
    command: string;
    avatar: Avatar;
  }
>;

export type Event =
  | ConversationCreated
  | ConversationRestartInitiated
  | ConversationRestartConfirmed
  | ConversationRestartCanceled
  | ConversationRestarted
  | ConversationTerminated
  | ChatWindowOpened
  | ChatWindowClosed
  | AudioMuted
  | AudioStarted
  | AudioCompleted
  | AudioFailed
  | AudioUnmuted
  | AudioPlaybackStarted
  | AudioPlaybackCompleted
  | AudioPlaybackFailed
  | TypingStarted
  | TypingStopped
  | UtteranceStarted
  | UtteranceEnded
  | MessageSent
  | MessageTextReceived
  | MessageVisualReceived
  | MessageChoiceReceived
  | MessageCarouselReceived
  | MessageCardReceived
  | MessageCarouselPresented
  | MessageCardPresented
  | MessageVisualPresented
  | MessageRendered
  | TracesAcknowledged
  | EventsSnapshot
  | CommandRejected;
