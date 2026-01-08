import { ConversationWindow } from "../types/runtime";
import { ConversationCreated } from "../types/events";

export const projectConversationCreated = (
  window: ConversationWindow,
  event: ConversationCreated,
): ConversationWindow => {
  return {
    ...window,
    conversationId: event.data.conversationId,
    conversation: {
      ...window.conversation,
      conversationId: event.data.conversationId,
      utterances: [],
    },
    isTyping: false,
  };
};
