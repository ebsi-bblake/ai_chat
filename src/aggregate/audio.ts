import { Root } from "../types/runtime";
import { Command, Event } from "../types/core";
import {
  MuteAudio,
  UnmuteAudio,
  AudioStarted,
  AudioCompleted,
  AudioFailed,
} from "../types/commands/audio";
import {
  AudioMuted,
  AudioUnmuted,
  AudioPlaybackStarted,
  AudioPlaybackCompleted,
  AudioPlaybackFailed,
} from "../types/events/audio";

const now = (): string => {
  return new Date().toISOString();
};

export const audioAggregate = (
  root: Root,
  command: Command,
): {
  events: Event[];
  effects: [];
} => {
  switch (command.type) {
    case "MuteAudio": {
      if (root.audioMuted) {
        return { events: [], effects: [] };
      }

      const event: AudioMuted = {
        type: "AudioMuted",
        payload: { time: now() },
      };

      return { events: [event], effects: [] };
    }

    case "UnmuteAudio": {
      if (!root.audioMuted) {
        return { events: [], effects: [] };
      }

      const event: AudioUnmuted = {
        type: "AudioUnmuted",
        payload: { time: now() },
      };

      return { events: [event], effects: [] };
    }

    case "AudioStarted": {
      if (root.audioPlaying) {
        return { events: [], effects: [] };
      }

      const event: AudioPlaybackStarted = {
        type: "AudioPlaybackStarted",
        payload: {
          url: command.payload.url,
          time: now(),
        },
      };

      return { events: [event], effects: [] };
    }

    case "AudioCompleted": {
      if (!root.audioPlaying) {
        return { events: [], effects: [] };
      }

      const event: AudioPlaybackCompleted = {
        type: "AudioPlaybackCompleted",
        payload: {
          url: command.payload.url,
          time: now(),
        },
      };

      return { events: [event], effects: [] };
    }

    case "AudioFailed": {
      if (!root.audioPlaying) {
        return { events: [], effects: [] };
      }

      const event: AudioPlaybackFailed = {
        type: "AudioPlaybackFailed",
        payload: {
          url: command.payload.url,
          error: command.payload.error,
          time: now(),
        },
      };

      return { events: [event], effects: [] };
    }

    default:
      return { events: [], effects: [] };
  }
};
