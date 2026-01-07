export type ConversationWindow = {
  conversationId: string;
  conversation: Conversation;
  avatars: Avatar[];
  isTyping: boolean;
  isMuted: boolean;
};

export type Conversation = {
  conversationId: string;
  avatars: Avatar[];
  utterances: Utterance[];
};

export type Utterance = {
  id: string;
  time: string;
  conversationId: string;
  avatar: Avatar;
  messages: Message[];
};

export type Message = {
  avatar: Avatar;
  text?: string;
  visual?: unknown;
  buttons?: unknown[];
  type?: string;
};

export type Avatar = {
  id: string;
  name: string;
  role: "user" | "assistant" | "system";
};
