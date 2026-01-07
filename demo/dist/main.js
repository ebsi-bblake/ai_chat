// ../src/runtime.ts
var createRuntime = (config) => {
  let root = config.fold(config.initialRoot, config.eventStore.all());
  let window = config.initialWindow;
  let processing = false;
  const queue = [];
  const commitEvents = (events) => {
    config.eventStore.append(events);
    root = config.fold(root, events);
  };
  const runEffects = async (effects) => {
    const spawned = [];
    for (const effect of effects) {
      const result = await config.effectHandlers.handle(effect);
      const cmds = config.effectResolver(effect, result) ?? [];
      spawned.push(...cmds);
    }
    return spawned;
  };
  const project = (events) => {
    window = events.reduce(
      (w, event) => config.projectors.reduce((acc, projector) => projector(acc, event), w),
      window
    );
  };
  const executeCommand = async (command, accEvents) => {
    const { events, effects } = config.aggregate(root, command);
    if (!events.length) return;
    commitEvents(events);
    accEvents.push(...events);
    const spawned = await runEffects(effects);
    for (const c of spawned) {
      await executeCommand(c, accEvents);
    }
  };
  const handleCommand = async (command) => {
    const accEvents = [];
    await executeCommand(command, accEvents);
    if (accEvents.length) project(accEvents);
  };
  const processQueue = async () => {
    processing = true;
    try {
      while (queue.length) {
        const command = queue.shift();
        await handleCommand(command);
      }
    } finally {
      processing = false;
    }
  };
  const dispatch = (command) => {
    queue.push(command);
    if (!processing) {
      void processQueue();
    }
  };
  const start = () => {
    for (const sub of config.subscriptions) {
      sub.start(dispatch);
    }
  };
  const stop = () => {
    for (const sub of config.subscriptions) {
      sub.stop();
    }
  };
  return {
    dispatch,
    start,
    stop,
    getRoot: () => root,
    getConversationWindow: () => window
  };
};

// ../src/aggregate/conversation.ts
var generateConversationId = () => crypto.randomUUID();
var now = () => (/* @__PURE__ */ new Date()).toISOString();
var conversationAggregate = (root, command) => {
  switch (command.type) {
    case "CreateConversation": {
      if (root.conversationActive) {
        return { events: [], effects: [] };
      }
      const event = {
        type: "ConversationCreated",
        payload: {
          conversationId: generateConversationId(),
          time: now()
        }
      };
      return {
        events: [event],
        effects: []
      };
    }
    default:
      return { events: [], effects: [] };
  }
};

// ../src/aggregate/messaging.ts
var now2 = () => {
  return (/* @__PURE__ */ new Date()).toISOString();
};
var generateMessageId = () => {
  return crypto.randomUUID();
};
var generateRequestId = () => {
  return crypto.randomUUID();
};
var messagingAggregate = (root, command) => {
  switch (command.type) {
    case "SendMessage": {
      if (!root.conversationActive || root.conversationId === null) {
        const rejected = {
          type: "CommandRejected",
          payload: {
            command,
            reason: "no-active-conversation"
          }
        };
        return {
          events: [rejected],
          effects: []
        };
      }
      if (command.payload.text.trim().length === 0) {
        const rejected = {
          type: "CommandRejected",
          payload: {
            command,
            reason: "empty-message"
          }
        };
        return {
          events: [rejected],
          effects: []
        };
      }
      const messageId = generateMessageId();
      const requestId = generateRequestId();
      const messageSent = {
        type: "MessageSent",
        payload: {
          messageId,
          time: now2()
        }
      };
      const networkEffect = {
        type: "network.post",
        payload: {
          requestId,
          url: "/messages",
          headers: {
            "Content-Type": "application/json"
          },
          body: {
            conversationId: root.conversationId,
            messageId,
            text: command.payload.text
          }
        }
      };
      return {
        events: [messageSent],
        effects: [networkEffect]
      };
    }
    default:
      return {
        events: [],
        effects: []
      };
  }
};

// ../src/aggregate/traces.ts
var tracesAggregate = (root, command) => {
  switch (command.type) {
    case "ReceiveTraces": {
      if (!root.conversationActive) {
        return {
          events: [],
          effects: []
        };
      }
      return {
        events: [],
        effects: []
      };
    }
    default:
      return {
        events: [],
        effects: []
      };
  }
};

// ../src/aggregate/audio.ts
var now3 = () => {
  return (/* @__PURE__ */ new Date()).toISOString();
};
var audioAggregate = (root, command) => {
  switch (command.type) {
    case "MuteAudio": {
      if (root.audioMuted) {
        return { events: [], effects: [] };
      }
      const event = {
        type: "AudioMuted",
        payload: { time: now3() }
      };
      return { events: [event], effects: [] };
    }
    case "UnmuteAudio": {
      if (!root.audioMuted) {
        return { events: [], effects: [] };
      }
      const event = {
        type: "AudioUnmuted",
        payload: { time: now3() }
      };
      return { events: [event], effects: [] };
    }
    case "AudioStarted": {
      if (root.audioPlaying) {
        return { events: [], effects: [] };
      }
      const event = {
        type: "AudioPlaybackStarted",
        payload: {
          url: command.payload.url,
          time: now3()
        }
      };
      return { events: [event], effects: [] };
    }
    case "AudioCompleted": {
      if (!root.audioPlaying) {
        return { events: [], effects: [] };
      }
      const event = {
        type: "AudioPlaybackCompleted",
        payload: {
          url: command.payload.url,
          time: now3()
        }
      };
      return { events: [event], effects: [] };
    }
    case "AudioFailed": {
      if (!root.audioPlaying) {
        return { events: [], effects: [] };
      }
      const event = {
        type: "AudioPlaybackFailed",
        payload: {
          url: command.payload.url,
          error: command.payload.error,
          time: now3()
        }
      };
      return { events: [event], effects: [] };
    }
    default:
      return { events: [], effects: [] };
  }
};

// ../src/aggregate/index.ts
var aggregate = (root, command) => {
  const aggregates = [
    conversationAggregate,
    messagingAggregate,
    tracesAggregate,
    audioAggregate
  ];
  for (const fn of aggregates) {
    const result = fn(root, command);
    if (result.events.length > 0 || result.effects.length > 0) {
      return result;
    }
  }
  return {
    events: [],
    effects: []
  };
};

// ../src/fold/messaging.ts
var foldMessageSent = (root, event) => {
  return root;
};

// ../src/fold/conversation.ts
var foldConversationCreated = (root, event) => {
  return {
    ...root,
    conversationId: event.payload.conversationId,
    conversationActive: true
  };
};
var foldConversationTerminated = (root, event) => {
  return {
    ...root,
    conversationActive: false,
    conversationId: null
  };
};

// ../src/fold/chat-window.ts
var foldChatWindowOpened = (root, event) => {
  return {
    ...root,
    conversationActive: true
  };
};
var foldChatWindowClosed = (root, event) => {
  return {
    ...root,
    conversationActive: false
  };
};

// ../src/fold/audio.ts
var foldAudioMuted = (root, event) => {
  return {
    ...root,
    audioMuted: true
  };
};
var foldAudioUnmuted = (root, event) => {
  return {
    ...root,
    audioMuted: false
  };
};

// ../src/fold/index.ts
var foldRoot = (root, events) => {
  return events.reduce((acc, event) => {
    switch (event.type) {
      case "AudioMuted":
        return foldAudioMuted(acc, event);
      case "AudioUnmuted":
        return foldAudioUnmuted(acc, event);
      case "ConversationCreated":
        return foldConversationCreated(acc, event);
      case "ConversationTerminated":
        return foldConversationTerminated(acc, event);
      case "ChatWindowOpened":
        return foldChatWindowOpened(acc, event);
      case "ChatWindowClosed":
        return foldChatWindowClosed(acc, event);
      case "MessageSent":
        return foldMessageSent(acc, event);
      default:
        return acc;
    }
  }, root);
};

// ../src/projectors/conversation.ts
var projectConversationCreated = (window, event) => {
  return {
    ...window,
    conversationId: event.payload.conversationId,
    conversation: {
      ...window.conversation,
      conversationId: event.payload.conversationId,
      utterances: []
    },
    isTyping: false
  };
};

// ../src/projectors/messaging.ts
var createUtterance = (conversationId, avatar, messageId, time) => {
  const message = {
    avatar,
    type: "text"
  };
  return {
    id: messageId,
    time,
    conversationId,
    avatar,
    messages: [message]
  };
};
var projectMessageRendered = (window, event) => {
  const updatedUtterances = window.conversation.utterances.map(
    (utterance) => {
      if (utterance.id !== event.payload.messageId) {
        return utterance;
      }
      return {
        ...utterance,
        time: event.payload.time
      };
    }
  );
  return {
    ...window,
    conversation: {
      ...window.conversation,
      utterances: updatedUtterances
    }
  };
};
var projectMessageTextReceived = (window, event) => {
  const updatedUtterances = window.conversation.utterances.map(
    (utterance) => {
      if (utterance.id !== event.payload.messageId) {
        return utterance;
      }
      const message = {
        avatar: utterance.avatar,
        text: event.payload.text,
        type: "text"
      };
      return {
        ...utterance,
        messages: [...utterance.messages, message]
      };
    }
  );
  return {
    ...window,
    conversation: {
      ...window.conversation,
      utterances: updatedUtterances
    }
  };
};
var projectMessageSent = (window, event) => {
  const conversationId = window.conversation.conversationId;
  const participantAvatar = window.avatars.find(
    (a) => a.role === "user"
  );
  if (participantAvatar === void 0) {
    return window;
  }
  const utterance = createUtterance(
    conversationId,
    participantAvatar,
    event.payload.messageId,
    event.payload.time
  );
  return {
    ...window,
    conversation: {
      ...window.conversation,
      utterances: [...window.conversation.utterances, utterance]
    }
  };
};

// ../src/projectors/typing.ts
var projectTypingStarted = (window, event) => {
  return {
    ...window,
    isTyping: true
  };
};
var projectTypingStopped = (window, event) => {
  return {
    ...window,
    isTyping: false
  };
};

// ../src/projectors/audio.ts
var projectAudioPlaybackStarted = (window, event) => {
  return {
    ...window
  };
};
var projectAudioPlaybackCompleted = (window, event) => {
  return {
    ...window
  };
};
var projectAudioPlaybackFailed = (window, event) => {
  return {
    ...window
  };
};
var projectAudioMuted = (window, event) => {
  return {
    ...window,
    isMuted: true
  };
};
var projectAudioUnmuted = (window, event) => {
  return {
    ...window,
    isMuted: false
  };
};

// ../src/projectors/errors.ts
var projectCommandRejected = (window, event) => {
  return window;
};

// ../src/projectors/guards.ts
var isCommandRejected = (event) => event.type === "CommandRejected";
var isAudioPlaybackStarted = (event) => event.type === "AudioPlaybackStarted";
var isAudioPlaybackCompleted = (event) => event.type === "AudioPlaybackCompleted";
var isAudioPlaybackFailed = (event) => event.type === "AudioPlaybackFailed";
var isAudioMuted = (event) => event.type === "AudioMuted";
var isAudioUnmuted = (event) => event.type === "AudioUnmuted";
var isMessageRendered = (event) => event.type === "MessageRendered";
var isConversationCreated = (event) => event.type === "ConversationCreated";
var isMessageSent = (event) => event.type === "MessageSent";
var isMessageTextReceived = (event) => event.type === "MessageTextReceived";
var isTypingStarted = (event) => event.type === "TypingStarted";
var isTypingStopped = (event) => event.type === "TypingStopped";

// ../src/projectors/index.ts
var projectEvent = (window, event) => {
  if (isCommandRejected(event)) {
    return projectCommandRejected(window, event);
  }
  if (isAudioMuted(event)) {
    return projectAudioMuted(window, event);
  }
  if (isAudioUnmuted(event)) {
    return projectAudioUnmuted(window, event);
  }
  if (isAudioPlaybackStarted(event)) {
    return projectAudioPlaybackStarted(window, event);
  }
  if (isAudioPlaybackCompleted(event)) {
    return projectAudioPlaybackCompleted(window, event);
  }
  if (isAudioPlaybackFailed(event)) {
    return projectAudioPlaybackFailed(window, event);
  }
  if (isConversationCreated(event)) {
    return projectConversationCreated(window, event);
  }
  if (isMessageSent(event)) {
    return projectMessageSent(window, event);
  }
  if (isMessageTextReceived(event)) {
    return projectMessageTextReceived(window, event);
  }
  if (isTypingStarted(event)) {
    return projectTypingStarted(window, event);
  }
  if (isTypingStopped(event)) {
    return projectTypingStopped(window, event);
  }
  if (isMessageRendered(event)) {
    return projectMessageRendered(window, event);
  }
  return window;
};
var projectors = [
  (window, event) => projectEvent(window, event)
];

// ../defaults/index.ts
var defaultRoot = {
  conversationId: null,
  conversationActive: false,
  audioMuted: false,
  audioPlaying: false,
  currentAudioUrl: null,
  networkRetries: {},
  audioRetries: {}
};
var systemAvatars = [
  {
    id: "user",
    name: "You",
    role: "user"
  },
  {
    id: "assistant",
    name: "Assistant",
    role: "assistant"
  }
];
var defaultConversation = {
  conversationId: "",
  avatars: systemAvatars,
  utterances: []
};
var defaultWindow = {
  conversationId: "",
  conversation: defaultConversation,
  avatars: systemAvatars,
  isTyping: false,
  isMuted: false
};

// main.ts
var windowEl = document.getElementById("window");
var rootEl = document.getElementById("root");
var eventsEl = document.getElementById("events");
var traceEl = document.getElementById("trace");
var inputEl = document.getElementById("input");
var sendBtn = document.getElementById("send");
var createBtn = document.getElementById("create");
var muteBtn = document.getElementById("mute");
var unmuteBtn = document.getElementById("unmute");
var runtimeTraces = [];
var trace = (t) => {
  runtimeTraces.push(t);
};
var tracedAggregate = (root, command) => {
  trace({ step: "aggregate", command });
  const result = aggregate(root, command);
  trace({ step: "events", events: result.events });
  trace({ step: "effects", effects: result.effects });
  return result;
};
var eventStore = {
  events: [],
  append(events) {
    trace({ step: "commit", events });
    this.events.push(...events);
  },
  all() {
    return this.events;
  }
};
var tracedFold = (root, events) => {
  const next = foldRoot(root, events);
  trace({ step: "fold", root: next });
  return next;
};
var tracedProjectors = projectors.map((projector) => {
  return (window, event) => {
    trace({ step: "project", event });
    const next = projector(window, event);
    trace({ step: "window", window: next });
    return next;
  };
});
var runtime = createRuntime({
  aggregate: tracedAggregate,
  fold: tracedFold,
  eventStore,
  projectors: tracedProjectors,
  effectHandlers: {
    handle: async () => {
      throw new Error("No effects in demo");
    }
  },
  effectResolver: () => [],
  subscriptions: [],
  initialRoot: defaultRoot,
  initialWindow: defaultWindow
});
runtime.start();
var render = () => {
  windowEl.textContent = JSON.stringify(
    runtime.getConversationWindow(),
    null,
    2
  );
  rootEl.textContent = JSON.stringify(runtime.getRoot(), null, 2);
  eventsEl.textContent = eventStore.events.map((e, i) => `${i + 1}.
${JSON.stringify(e, null, 2)}`).join("\n\n");
  traceEl.textContent = runtimeTraces.map((t, i) => `${i + 1}. ${JSON.stringify(t, null, 2)}`).join("\n\n");
};
var dispatchAndRender = (command) => {
  trace({ step: "dispatch", command });
  runtime.dispatch(command);
  setTimeout(render, 0);
};
render();
createBtn.onclick = () => {
  dispatchAndRender({ type: "CreateConversation" });
};
sendBtn.onclick = () => {
  dispatchAndRender({
    type: "SendMessage",
    payload: { text: inputEl.value }
  });
  inputEl.value = "";
};
muteBtn.onclick = () => {
  dispatchAndRender({ type: "MuteAudio" });
};
unmuteBtn.onclick = () => {
  dispatchAndRender({ type: "UnmuteAudio" });
};
