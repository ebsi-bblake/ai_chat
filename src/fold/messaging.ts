import { Root } from "../types/runtime";
import { MessageSent } from "../types/events";

export const foldMessageSent = (root: Root, _event: MessageSent): Root => {
  return root;
};
