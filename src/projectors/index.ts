import { Projector } from "../types/runtime";
import { ConversationWindow } from "../types/conversation";
import { Event } from "../types/core";

import { projectConversationCreated } from "./conversation";
import {
  projectMessageSent,
  projectMessageTextReceived,
  projectMessageRendered,
} from "./messaging";
import { projectTypingStarted, projectTypingStopped } from "./typing";
import {
  projectAudioMuted,
  projectAudioUnmuted,
  projectAudioPlaybackStarted,
  projectAudioPlaybackCompleted,
  projectAudioPlaybackFailed,
} from "./audio";
import { projectCommandRejected } from "./errors";
import {
  isConversationCreated,
  isMessageSent,
  isMessageRendered,
  isMessageTextReceived,
  isTypingStarted,
  isTypingStopped,
  isAudioMuted,
  isAudioUnmuted,
  isAudioPlaybackStarted,
  isAudioPlaybackCompleted,
  isAudioPlaybackFailed,
  isCommandRejected,
} from "./guards";

export const projectEvent = (
  window: ConversationWindow,
  event: Event,
): ConversationWindow => {
  if (isCommandRejected(event)) {
    return projectCommandRejected(window, event);
  }
  if (isAudioMuted(event)) {
    return projectAudioMuted(window, event);
  }

  if (isAudioUnmuted(event)) {
    return projectAudioUnmuted(window, event);
  }
  if (isAudioPlaybackStarted(event)) {
    return projectAudioPlaybackStarted(window, event);
  }

  if (isAudioPlaybackCompleted(event)) {
    return projectAudioPlaybackCompleted(window, event);
  }

  if (isAudioPlaybackFailed(event)) {
    return projectAudioPlaybackFailed(window, event);
  }
  if (isConversationCreated(event)) {
    return projectConversationCreated(window, event);
  }

  if (isMessageSent(event)) {
    return projectMessageSent(window, event);
  }

  if (isMessageTextReceived(event)) {
    return projectMessageTextReceived(window, event);
  }

  if (isTypingStarted(event)) {
    return projectTypingStarted(window, event);
  }

  if (isTypingStopped(event)) {
    return projectTypingStopped(window, event);
  }

  if (isMessageRendered(event)) {
    return projectMessageRendered(window, event);
  }
  return window;
};

export const projectors: Projector[] = [
  (window: ConversationWindow, event: Event): ConversationWindow =>
    projectEvent(window, event),
];
