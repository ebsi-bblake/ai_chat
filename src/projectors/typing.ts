import { ConversationWindow } from "../types/runtime";
import { TypingStarted, TypingStopped } from "../types/events";

export const projectTypingStarted = (
  window: ConversationWindow,
  _event: TypingStarted,
): ConversationWindow => {
  return {
    ...window,
    isTyping: true,
  };
};

export const projectTypingStopped = (
  window: ConversationWindow,
  _event: TypingStopped,
): ConversationWindow => {
  return {
    ...window,
    isTyping: false,
  };
};
