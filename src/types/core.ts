export type Dispatch = (command: Command) => void;

export type Command =
  | CreateConversation
  | InitiateRestartConversation
  | ConfirmRestartConversation
  | CancelRestartConversation
  | TerminateConversation
  | OpenChatWindow
  | CloseChatWindow
  | MuteAudio
  | UnmuteAudio
  | SendMessage
  | ReceiveTraces
  | AudioStarted
  | AudioCompleted
  | AudioFailed
  | RetryNetworkRequest
  | RetryAudioPlay
  | CommandRejected;

export type Event =
  | CommandError
  | ConversationCreated
  | ConversationRestartInitiated
  | ConversationRestartConfirmed
  | ConversationRestartCanceled
  | ConversationTerminated
  | ChatWindowOpened
  | ChatWindowClosed
  | AudioMuted
  | AudioUnmuted
  | AudioPlaybackStarted
  | AudioPlaybackCompleted
  | AudioPlaybackFailed
  | AudioReady
  | TypingStarted
  | TypingStopped
  | MessageSent
  | MessageRendered
  | MessageTextReceived
  | MessageVisualReceived
  | MessageChoiceReceived
  | MessageCardReceived
  | MessageCarouselReceived
  | MessageCardPresented
  | MessageCarouselPresented
  | MessageVisualPresented
  | NetworkRequestRetried
  | AudioPlayRetried;

export type Effect = NetworkEffect | StorageEffect | AudioEffect | ScrollEffect;
