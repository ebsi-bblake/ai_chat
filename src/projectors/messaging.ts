import {
  ConversationWindow,
  Utterance,
  Message,
  Avatar,
} from "../types/runtime";
import {
  MessageSent,
  MessageTextReceived,
  MessageRendered,
} from "../types/events";

const createUtterance = (
  conversationId: string,
  avatar: Avatar,
  time: string,
  messages: Message[],
): Utterance => ({
  time,
  conversationId,
  avatar,
  messages,
});

export const projectMessageSent = (
  window: ConversationWindow,
  event: MessageSent,
): ConversationWindow => {
  const avatar = window.avatars.find((a) => a.role === "user");
  if (!avatar) return window;

  const message: Message = {
    avatar,
    type: "text",
    text: event.data.prompt,
  };

  const utterance = createUtterance(window.conversationId, avatar, event.time, [
    message,
  ]);

  return {
    ...window,
    conversation: {
      ...window.conversation,
      utterances: [...window.conversation.utterances, utterance],
    },
  };
};

export const projectMessageTextReceived = (
  window: ConversationWindow,
  event: MessageTextReceived,
): ConversationWindow => {
  const avatar = window.avatars.find((a) => a.role === "assistant");
  if (!avatar) return window;

  const message: Message = {
    avatar,
    text: event.data.text,
    type: "text",
  };

  const utterance = createUtterance(window.conversationId, avatar, event.time, [
    message,
  ]);

  return {
    ...window,
    conversation: {
      ...window.conversation,
      utterances: [...window.conversation.utterances, utterance],
    },
  };
};

export const projectMessageRendered = (
  window: ConversationWindow,
  _event: MessageRendered,
): ConversationWindow => window;
