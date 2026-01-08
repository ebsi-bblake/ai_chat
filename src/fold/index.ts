import { Root } from "../types/runtime";
import { Event } from "../types/events";
import { foldMessageSent } from "./messaging";
import {
  foldConversationCreated,
  foldConversationTerminated,
} from "./conversation";
import { foldChatWindowOpened, foldChatWindowClosed } from "./chat-window";
import { foldAudioMuted, foldAudioUnmuted } from "./audio";

export const foldRoot = (root: Root, events: Event[]): Root => {
  return events.reduce((acc: Root, event: Event): Root => {
    switch (event.type) {
      case "AudioMuted":
        return foldAudioMuted(acc, event);

      case "AudioUnmuted":
        return foldAudioUnmuted(acc, event);

      case "ConversationCreated":
        return foldConversationCreated(acc, event);

      case "ConversationTerminated":
        return foldConversationTerminated(acc, event);

      case "ChatWindowOpened":
        return foldChatWindowOpened(acc, event);

      case "ChatWindowClosed":
        return foldChatWindowClosed(acc, event);

      case "MessageSent":
        return foldMessageSent(acc, event);
      default:
        return acc;
    }
  }, root);
};
