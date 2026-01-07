import { ConversationWindow } from "../types/conversation";
import { TypingStarted, TypingStopped } from "../types/events/messaging";

export const projectTypingStarted = (
  window: ConversationWindow,
  event: TypingStarted,
): ConversationWindow => {
  return {
    ...window,
    isTyping: true,
  };
};

export const projectTypingStopped = (
  window: ConversationWindow,
  event: TypingStopped,
): ConversationWindow => {
  return {
    ...window,
    isTyping: false,
  };
};
