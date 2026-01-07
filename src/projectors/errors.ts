import { ConversationWindow } from "../types/conversation";
import { CommandRejected } from "../types/commands/error";

export const projectCommandRejected = (
  window: ConversationWindow,
  event: CommandRejected,
): ConversationWindow => {
  return window;
};
