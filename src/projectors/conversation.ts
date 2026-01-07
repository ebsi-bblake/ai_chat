import { ConversationWindow } from "../types/conversation";
import { Event } from "../types/core";
import { ConversationCreated } from "../types/events/conversation";

export const projectConversationCreated = (
  window: ConversationWindow,
  event: ConversationCreated,
): ConversationWindow => {
  return {
    ...window,
    conversationId: event.payload.conversationId,
    conversation: {
      ...window.conversation,
      conversationId: event.payload.conversationId,
      utterances: [],
    },
    isTyping: false,
  };
};
