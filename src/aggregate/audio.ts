import { Root, ID } from "../types/runtime";
import { Command, Event, Effect } from "../types";
import { AudioMuted, AudioUnmuted } from "../types/events";

const now = (): string => new Date().toISOString();

export const audioAggregate = (
  root: Root,
  command: Command,
  ids: ID,
): {
  events: Event[];
  effects: Effect[];
} => {
  switch (command.type) {
    case "MuteAudio": {
      if (root.audioMuted) return { events: [], effects: [] };

      const event: AudioMuted = {
        type: "AudioMuted",
        category: "system",
        id: ids(),
        time: now(),
        data: { conversationId: command.data.conversationId },
      };

      return { events: [event], effects: [] };
    }

    case "UnmuteAudio": {
      if (!root.audioMuted) return { events: [], effects: [] };

      const event: AudioUnmuted = {
        type: "AudioUnmuted",
        category: "system",
        id: ids(),
        time: now(),
        data: { conversationId: command.data.conversationId },
      };

      return { events: [event], effects: [] };
    }

    case "StartAudio": {
      return {
        events: [],
        effects: [
          {
            type: "audio.synthesize",
            data: {
              conversationId: command.data.conversationId,
              audioSrc: command.data.audioSrc,
            },
          },
        ],
      };
    }

    default:
      return { events: [], effects: [] };
  }
};
