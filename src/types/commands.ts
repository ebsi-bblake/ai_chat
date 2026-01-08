import { BaseType, Avatar } from "./base";

// --------- Commands ---------

export type CreateConversation = BaseType<
  "CreateConversation",
  "command",
  {
    avatar: Avatar;
  }
>;

export type InitiateRestartConversation = BaseType<
  "InitiateRestartConversation",
  "command",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;

export type ConfirmRestartConversation = BaseType<
  "ConfirmRestartConversation",
  "command",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;

export type CancelRestartConversation = BaseType<
  "CancelRestartConversation",
  "command",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;

export type SendMessage = BaseType<
  "SendMessage",
  "command",
  {
    conversationId: string;
    prompt: string;
    avatar: "participant";
  }
>;

export type ReceiveTraces = BaseType<
  "ReceiveTraces",
  "command",
  {
    conversationId: string;
    avatar: "ai" | "five9";
    traces: unknown[];
  }
>;

export type MuteAudio = BaseType<
  "MuteAudio",
  "command",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;

export type UnmuteAudio = BaseType<
  "UnmuteAudio",
  "command",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;
type StartAudio = BaseType<
  "StartAudio",
  "command",
  {
    conversationId: string;
    audioSrc: string;
    avatar: Avatar;
  }
>;

type StopAudio = BaseType<
  "StopAudio",
  "command",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;
export type OpenChatWindow = BaseType<
  "OpenChatWindow",
  "command",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;

export type CloseChatWindow = BaseType<
  "CloseChatWindow",
  "command",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;

export type TerminateConversation = BaseType<
  "TerminateConversation",
  "command",
  {
    conversationId: string;
    avatar: Avatar;
  }
>;

export type Command =
  | CreateConversation
  | InitiateRestartConversation
  | ConfirmRestartConversation
  | CancelRestartConversation
  | SendMessage
  | ReceiveTraces
  | MuteAudio
  | UnmuteAudio
  | OpenChatWindow
  | CloseChatWindow
  | TerminateConversation
  | StopAudio
  | StartAudio;
