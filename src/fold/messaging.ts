import { Root } from "../types/runtime";
import { MessageSent } from "../types/events/messaging";

export const foldMessageSent = (root: Root, event: MessageSent): Root => {
  return root;
};
