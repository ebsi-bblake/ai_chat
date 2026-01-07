import { ConversationWindow } from "../types/conversation";
import {
  AudioMuted,
  AudioUnmuted,
  AudioPlaybackStarted,
  AudioPlaybackCompleted,
  AudioPlaybackFailed,
} from "../types/events/audio";

export const projectAudioPlaybackStarted = (
  window: ConversationWindow,
  event: AudioPlaybackStarted,
): ConversationWindow => {
  return {
    ...window,
  };
};

export const projectAudioPlaybackCompleted = (
  window: ConversationWindow,
  event: AudioPlaybackCompleted,
): ConversationWindow => {
  return {
    ...window,
  };
};

export const projectAudioPlaybackFailed = (
  window: ConversationWindow,
  event: AudioPlaybackFailed,
): ConversationWindow => {
  return {
    ...window,
  };
};
export const projectAudioMuted = (
  window: ConversationWindow,
  event: AudioMuted,
): ConversationWindow => {
  return {
    ...window,
    isMuted: true,
  };
};

export const projectAudioUnmuted = (
  window: ConversationWindow,
  event: AudioUnmuted,
): ConversationWindow => {
  return {
    ...window,
    isMuted: false,
  };
};
