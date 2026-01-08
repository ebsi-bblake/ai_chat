import { Root } from "../types/runtime";
import {
  AudioMuted,
  AudioUnmuted,
  AudioPlaybackStarted,
  AudioPlaybackCompleted,
  AudioPlaybackFailed,
} from "../types/events";

export const foldAudioPlaybackStarted = (
  root: Root,
  event: AudioPlaybackStarted,
): Root => {
  return {
    ...root,
    audioPlaying: true,
    currentAudioUrl: event.data.audioSrc,
  };
};

export const foldAudioPlaybackCompleted = (
  root: Root,
  _event: AudioPlaybackCompleted,
): Root => {
  return {
    ...root,
    audioPlaying: false,
    currentAudioUrl: null,
  };
};

export const foldAudioPlaybackFailed = (
  root: Root,
  _event: AudioPlaybackFailed,
): Root => {
  return {
    ...root,
    audioPlaying: false,
    currentAudioUrl: null,
  };
};

export const foldAudioMuted = (root: Root, _event: AudioMuted): Root => {
  return {
    ...root,
    audioMuted: true,
  };
};

export const foldAudioUnmuted = (root: Root, _event: AudioUnmuted): Root => {
  return {
    ...root,
    audioMuted: false,
  };
};
