import { Root } from "../types/runtime";
import {
  AudioMuted,
  AudioUnmuted,
  AudioPlaybackStarted,
  AudioPlaybackCompleted,
  AudioPlaybackFailed,
} from "../types/events/audio";

export const foldAudioPlaybackStarted = (
  root: Root,
  event: AudioPlaybackStarted,
): Root => {
  return {
    ...root,
    audioPlaying: true,
    currentAudioUrl: event.payload.url,
  };
};

export const foldAudioPlaybackCompleted = (
  root: Root,
  event: AudioPlaybackCompleted,
): Root => {
  return {
    ...root,
    audioPlaying: false,
    currentAudioUrl: null,
  };
};

export const foldAudioPlaybackFailed = (
  root: Root,
  event: AudioPlaybackFailed,
): Root => {
  return {
    ...root,
    audioPlaying: false,
    currentAudioUrl: null,
  };
};

export const foldAudioMuted = (root: Root, event: AudioMuted): Root => {
  return {
    ...root,
    audioMuted: true,
  };
};

export const foldAudioUnmuted = (root: Root, event: AudioUnmuted): Root => {
  return {
    ...root,
    audioMuted: false,
  };
};
