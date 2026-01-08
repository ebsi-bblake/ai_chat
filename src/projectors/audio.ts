import { ConversationWindow } from "../types/runtime";
import {
  AudioMuted,
  AudioUnmuted,
  AudioPlaybackStarted,
  AudioPlaybackCompleted,
  AudioPlaybackFailed,
} from "../types/events";

export const projectAudioPlaybackStarted = (
  window: ConversationWindow,
  _event: AudioPlaybackStarted,
): ConversationWindow => {
  return {
    ...window,
  };
};

export const projectAudioPlaybackCompleted = (
  window: ConversationWindow,
  _event: AudioPlaybackCompleted,
): ConversationWindow => {
  return {
    ...window,
  };
};

export const projectAudioPlaybackFailed = (
  window: ConversationWindow,
  _event: AudioPlaybackFailed,
): ConversationWindow => {
  return {
    ...window,
  };
};
export const projectAudioMuted = (
  window: ConversationWindow,
  _event: AudioMuted,
): ConversationWindow => {
  return {
    ...window,
    isMuted: true,
  };
};

export const projectAudioUnmuted = (
  window: ConversationWindow,
  _event: AudioUnmuted,
): ConversationWindow => {
  return {
    ...window,
    isMuted: false,
  };
};
