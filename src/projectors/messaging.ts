import { ConversationWindow, Utterance, Message } from "../types/conversation";
import {
  MessageSent,
  MessageTextReceived,
  MessageRendered,
} from "../types/events/messaging";
import { Avatar } from "../types/conversation";

const createUtterance = (
  conversationId: string,
  avatar: Avatar,
  messageId: string,
  time: string,
): Utterance => {
  const message: Message = {
    avatar,
    type: "text",
  };

  return {
    id: messageId,
    time,
    conversationId,
    avatar,
    messages: [message],
  };
};

export const projectMessageRendered = (
  window: ConversationWindow,
  event: MessageRendered,
): ConversationWindow => {
  const updatedUtterances: Utterance[] = window.conversation.utterances.map(
    (utterance: Utterance): Utterance => {
      if (utterance.id !== event.payload.messageId) {
        return utterance;
      }

      return {
        ...utterance,
        time: event.payload.time,
      };
    },
  );

  return {
    ...window,
    conversation: {
      ...window.conversation,
      utterances: updatedUtterances,
    },
  };
};

export const projectMessageTextReceived = (
  window: ConversationWindow,
  event: MessageTextReceived,
): ConversationWindow => {
  const updatedUtterances: Utterance[] = window.conversation.utterances.map(
    (utterance: Utterance): Utterance => {
      if (utterance.id !== event.payload.messageId) {
        return utterance;
      }

      const message: Message = {
        avatar: utterance.avatar,
        text: event.payload.text,
        type: "text",
      };

      return {
        ...utterance,
        messages: [...utterance.messages, message],
      };
    },
  );

  return {
    ...window,
    conversation: {
      ...window.conversation,
      utterances: updatedUtterances,
    },
  };
};

export const projectMessageSent = (
  window: ConversationWindow,
  event: MessageSent,
): ConversationWindow => {
  const conversationId: string = window.conversation.conversationId;

  const participantAvatar: Avatar | undefined = window.avatars.find(
    (a: Avatar) => a.role === "user",
  );

  if (participantAvatar === undefined) {
    return window;
  }

  const utterance: Utterance = createUtterance(
    conversationId,
    participantAvatar,
    event.payload.messageId,
    event.payload.time,
  );

  return {
    ...window,
    conversation: {
      ...window.conversation,
      utterances: [...window.conversation.utterances, utterance],
    },
  };
};
