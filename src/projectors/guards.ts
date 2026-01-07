import { Event } from "../types/core";
import { ConversationCreated } from "../types/events/conversation";
import {
  MessageSent,
  MessageTextReceived,
  TypingStarted,
  TypingStopped,
  MessageRendered,
} from "../types/events/messaging";
import {
  AudioMuted,
  AudioUnmuted,
  AudioPlaybackStarted,
  AudioPlaybackCompleted,
  AudioPlaybackFailed,
} from "../types/events/audio";
import { CommandRejected } from "../types/commands/error";

export const isCommandRejected = (event: Event): event is CommandRejected =>
  event.type === "CommandRejected";

export const isAudioPlaybackStarted = (
  event: Event,
): event is AudioPlaybackStarted => event.type === "AudioPlaybackStarted";

export const isAudioPlaybackCompleted = (
  event: Event,
): event is AudioPlaybackCompleted => event.type === "AudioPlaybackCompleted";

export const isAudioPlaybackFailed = (
  event: Event,
): event is AudioPlaybackFailed => event.type === "AudioPlaybackFailed";

export const isAudioMuted = (event: Event): event is AudioMuted =>
  event.type === "AudioMuted";

export const isAudioUnmuted = (event: Event): event is AudioUnmuted =>
  event.type === "AudioUnmuted";

export const isMessageRendered = (event: Event): event is MessageRendered =>
  event.type === "MessageRendered";
export const isConversationCreated = (
  event: Event,
): event is ConversationCreated => event.type === "ConversationCreated";

export const isMessageSent = (event: Event): event is MessageSent =>
  event.type === "MessageSent";

export const isMessageTextReceived = (
  event: Event,
): event is MessageTextReceived => event.type === "MessageTextReceived";

export const isTypingStarted = (event: Event): event is TypingStarted =>
  event.type === "TypingStarted";

export const isTypingStopped = (event: Event): event is TypingStopped =>
  event.type === "TypingStopped";
