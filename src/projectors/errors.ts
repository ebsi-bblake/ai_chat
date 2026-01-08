import { ConversationWindow } from "../types/runtime";
import { CommandRejected } from "../types/events";

export const projectCommandRejected = (
  window: ConversationWindow,
  _event: CommandRejected,
): ConversationWindow => {
  return window;
};
