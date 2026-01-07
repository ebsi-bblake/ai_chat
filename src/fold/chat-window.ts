import { Root } from "../types/runtime";
import {
  ChatWindowOpened,
  ChatWindowClosed,
} from "../types/events/chat-window";

export const foldChatWindowOpened = (
  root: Root,
  event: ChatWindowOpened,
): Root => {
  return {
    ...root,
    conversationActive: true,
  };
};

export const foldChatWindowClosed = (
  root: Root,
  event: ChatWindowClosed,
): Root => {
  return {
    ...root,
    conversationActive: false,
  };
};
