import { Root } from "../src/types/runtime";
import {
  ConversationWindow,
  Conversation,
  Avatar,
} from "../src/types/conversation";

export const defaultRoot: Root = {
  conversationId: null,
  conversationActive: false,

  audioMuted: false,
  audioPlaying: false,
  currentAudioUrl: null,

  networkRetries: {},
  audioRetries: {},
};

const systemAvatars: Avatar[] = [
  {
    id: "user",
    name: "You",
    role: "user",
  },
  {
    id: "assistant",
    name: "Assistant",
    role: "assistant",
  },
];

const defaultConversation: Conversation = {
  conversationId: "",
  avatars: systemAvatars,
  utterances: [],
};

export const defaultWindow: ConversationWindow = {
  conversationId: "",
  conversation: defaultConversation,
  avatars: systemAvatars,

  isTyping: false,
  isMuted: false,
};
