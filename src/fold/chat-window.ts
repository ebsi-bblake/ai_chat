import { Root } from "../types/runtime";
import { ChatWindowOpened, ChatWindowClosed } from "../types/events";

export const foldChatWindowOpened = (
  root: Root,
  _event: ChatWindowOpened,
): Root => {
  return {
    ...root,
    conversationActive: true,
  };
};

export const foldChatWindowClosed = (
  root: Root,
  _event: ChatWindowClosed,
): Root => {
  return {
    ...root,
    conversationActive: false,
  };
};
