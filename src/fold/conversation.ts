import { Root } from "../types/runtime";
import { Event } from "../types/core";
import {
  ConversationCreated,
  ConversationTerminated,
} from "../types/events/conversation";
import { foldConversationCreated } from "./conversation";

export const foldConversationCreated = (
  root: Root,
  event: ConversationCreated,
): Root => {
  return {
    ...root,
    conversationId: event.payload.conversationId,
    conversationActive: true,
  };
};

export const foldConversationTerminated = (
  root: Root,
  event: ConversationTerminated,
): Root => {
  return {
    ...root,
    conversationActive: false,
    conversationId: null,
  };
};

export const foldRoot = (root: Root, events: Event[]): Root => {
  return events.reduce((acc: Root, event: Event): Root => {
    switch (event.type) {
      case "ConversationCreated":
        return foldConversationCreated(acc, event);
      case "ConversationTerminated":
        return foldConversationTerminated(acc, event);
      default:
        return acc;
    }
  }, root);
};
