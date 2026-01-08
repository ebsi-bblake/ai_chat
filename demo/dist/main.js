// ../src/runtime.ts
var createRuntime = (config) => {
  let root = config.fold(config.initialRoot, config.eventStore.all());
  let window2 = config.initialWindow;
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
    window2 = events.reduce(
      (w, event) => config.projectors.reduce((acc, projector) => projector(acc, event), w),
      window2
    );
  };
  const executeCommand = async (command, accEvents) => {
    const { events, effects } = config.aggregate(root, command, config.ids);
    if (events.length) {
      commitEvents(events);
      accEvents.push(...events);
    }
    if (effects.length) {
      runEffects(effects).then((spawned) => {
        for (const c of spawned) {
          dispatch(c);
        }
      });
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
    getConversationWindow: () => window2
  };
};

// ../src/aggregate/conversation.ts
var now = () => (/* @__PURE__ */ new Date()).toISOString();
var conversationAggregate = (root, command, ids2) => {
  switch (command.type) {
    case "CreateConversation": {
      if (root.conversationActive) {
        return { events: [], effects: [] };
      }
      const event = {
        type: "ConversationCreated",
        category: "session",
        id: ids2(),
        time: now(),
        data: {
          conversationId: ids2(),
          avatar: command.data.avatar
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
var now2 = () => (/* @__PURE__ */ new Date()).toISOString();
var messagingAggregate = (root, command, ids2) => {
  switch (command.type) {
    case "SendMessage": {
      if (!root.conversationActive || root.conversationId === null) {
        const rejected = {
          type: "CommandRejected",
          category: "system",
          id: ids2(),
          time: now2(),
          data: {
            conversationId: root.conversationId ?? "unknown",
            reason: "no-active-conversation",
            command: command.type,
            avatar: command.data.avatar
          }
        };
        return { events: [rejected], effects: [] };
      }
      if (command.data.prompt.trim().length === 0) {
        const rejected = {
          type: "CommandRejected",
          category: "system",
          id: ids2(),
          time: now2(),
          data: {
            conversationId: root.conversationId,
            reason: "empty-message",
            command: command.type,
            avatar: command.data.avatar
          }
        };
        return { events: [rejected], effects: [] };
      }
      const messageSentEvent = {
        type: "MessageSent",
        category: "message",
        id: ids2(),
        time: now2(),
        data: {
          conversationId: root.conversationId,
          prompt: command.data.prompt,
          avatar: command.data.avatar
        }
      };
      const networkEffect = {
        type: "network.post",
        data: {
          conversationId: root.conversationId,
          prompt: command.data.prompt
        }
      };
      return {
        events: [messageSentEvent],
        effects: [networkEffect]
      };
    }
    default:
      return { events: [], effects: [] };
  }
};

// ../src/aggregate/traces.ts
var now3 = () => (/* @__PURE__ */ new Date()).toISOString();
var tracesAggregate = (_root, command, ids2) => {
  switch (command.type) {
    case "ReceiveTraces": {
      const trace2 = command.data.traces.find(
        (t) => typeof t === "object" && t !== null && t.role === "assistant" && typeof t.content === "string"
      );
      if (!trace2) {
        return { events: [], effects: [] };
      }
      const event = {
        type: "MessageTextReceived",
        category: "message",
        id: ids2(),
        time: now3(),
        data: {
          conversationId: command.data.conversationId,
          avatar: command.data.avatar,
          text: trace2.content
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

// ../src/aggregate/audio.ts
var now4 = () => (/* @__PURE__ */ new Date()).toISOString();
var audioAggregate = (root, command, ids2) => {
  switch (command.type) {
    case "MuteAudio": {
      if (root.audioMuted) return { events: [], effects: [] };
      const event = {
        type: "AudioMuted",
        category: "system",
        id: ids2(),
        time: now4(),
        data: { conversationId: command.data.conversationId }
      };
      return { events: [event], effects: [] };
    }
    case "UnmuteAudio": {
      if (!root.audioMuted) return { events: [], effects: [] };
      const event = {
        type: "AudioUnmuted",
        category: "system",
        id: ids2(),
        time: now4(),
        data: { conversationId: command.data.conversationId }
      };
      return { events: [event], effects: [] };
    }
    case "StartAudio": {
      return {
        events: [],
        effects: [
          {
            type: "audio.synthesize",
            data: {
              conversationId: command.data.conversationId,
              audioSrc: command.data.audioSrc
            }
          }
        ]
      };
    }
    default:
      return { events: [], effects: [] };
  }
};

// ../src/aggregate/index.ts
var aggregate = (root, command, ids2) => {
  const aggregates = [
    conversationAggregate,
    messagingAggregate,
    tracesAggregate,
    audioAggregate
  ];
  for (const fn of aggregates) {
    const result = fn(root, command, ids2);
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
var foldMessageSent = (root, _event) => {
  return root;
};

// ../src/fold/conversation.ts
var foldConversationCreated = (root, event) => {
  return {
    ...root,
    conversationId: event.data.conversationId,
    conversationActive: true
  };
};
var foldConversationTerminated = (root, _event) => {
  return {
    ...root,
    conversationActive: false,
    conversationId: null
  };
};

// ../src/fold/chat-window.ts
var foldChatWindowOpened = (root, _event) => {
  return {
    ...root,
    conversationActive: true
  };
};
var foldChatWindowClosed = (root, _event) => {
  return {
    ...root,
    conversationActive: false
  };
};

// ../src/fold/audio.ts
var foldAudioMuted = (root, _event) => {
  return {
    ...root,
    audioMuted: true
  };
};
var foldAudioUnmuted = (root, _event) => {
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
var projectConversationCreated = (window2, event) => {
  return {
    ...window2,
    conversationId: event.data.conversationId,
    conversation: {
      ...window2.conversation,
      conversationId: event.data.conversationId,
      utterances: []
    },
    isTyping: false
  };
};

// ../src/projectors/messaging.ts
var createUtterance = (conversationId2, avatar, time, messages) => ({
  time,
  conversationId: conversationId2,
  avatar,
  messages
});
var projectMessageSent = (window2, event) => {
  const avatar = window2.avatars.find((a) => a.role === "user");
  if (!avatar) return window2;
  const message = {
    avatar,
    type: "text",
    text: event.data.prompt
  };
  const utterance = createUtterance(window2.conversationId, avatar, event.time, [
    message
  ]);
  return {
    ...window2,
    conversation: {
      ...window2.conversation,
      utterances: [...window2.conversation.utterances, utterance]
    }
  };
};
var projectMessageTextReceived = (window2, event) => {
  const avatar = window2.avatars.find((a) => a.role === "assistant");
  if (!avatar) return window2;
  const message = {
    avatar,
    text: event.data.text,
    type: "text"
  };
  const utterance = createUtterance(window2.conversationId, avatar, event.time, [
    message
  ]);
  return {
    ...window2,
    conversation: {
      ...window2.conversation,
      utterances: [...window2.conversation.utterances, utterance]
    }
  };
};
var projectMessageRendered = (window2, _event) => window2;

// ../src/projectors/typing.ts
var projectTypingStarted = (window2, _event) => {
  return {
    ...window2,
    isTyping: true
  };
};
var projectTypingStopped = (window2, _event) => {
  return {
    ...window2,
    isTyping: false
  };
};

// ../src/projectors/audio.ts
var projectAudioPlaybackStarted = (window2, _event) => {
  return {
    ...window2
  };
};
var projectAudioPlaybackCompleted = (window2, _event) => {
  return {
    ...window2
  };
};
var projectAudioPlaybackFailed = (window2, _event) => {
  return {
    ...window2
  };
};
var projectAudioMuted = (window2, _event) => {
  return {
    ...window2,
    isMuted: true
  };
};
var projectAudioUnmuted = (window2, _event) => {
  return {
    ...window2,
    isMuted: false
  };
};

// ../src/projectors/errors.ts
var projectCommandRejected = (window2, _event) => {
  return window2;
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
var projectEvent = (window2, event) => {
  if (isCommandRejected(event)) {
    return projectCommandRejected(window2, event);
  }
  if (isAudioMuted(event)) {
    return projectAudioMuted(window2, event);
  }
  if (isAudioUnmuted(event)) {
    return projectAudioUnmuted(window2, event);
  }
  if (isAudioPlaybackStarted(event)) {
    return projectAudioPlaybackStarted(window2, event);
  }
  if (isAudioPlaybackCompleted(event)) {
    return projectAudioPlaybackCompleted(window2, event);
  }
  if (isAudioPlaybackFailed(event)) {
    return projectAudioPlaybackFailed(window2, event);
  }
  if (isConversationCreated(event)) {
    return projectConversationCreated(window2, event);
  }
  if (isMessageSent(event)) {
    return projectMessageSent(window2, event);
  }
  if (isMessageTextReceived(event)) {
    return projectMessageTextReceived(window2, event);
  }
  if (isTypingStarted(event)) {
    return projectTypingStarted(window2, event);
  }
  if (isTypingStopped(event)) {
    return projectTypingStopped(window2, event);
  }
  if (isMessageRendered(event)) {
    return projectMessageRendered(window2, event);
  }
  return window2;
};
var projectors = [
  (window2, event) => projectEvent(window2, event)
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

// ../platform/web/index.ts
var ids = () => crypto.randomUUID();

// src/effects/web/network-handler.ts
var handleNetworkEffect = async (effect) => {
  try {
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma3:4b",
        messages: [
          {
            role: "user",
            content: String(effect.data.prompt)
          }
        ],
        stream: false
      })
    });
    const data = await response.json();
    return {
      ok: true,
      value: {
        conversationId: effect.data.conversationId,
        traces: [data.message]
      }
    };
  } catch (error) {
    return { ok: false, error };
  }
};

// src/effects/web/audio-handler.ts
var getVoice = () => {
  const voices = speechSynthesis.getVoices();
  return voices.find((v) => v.lang.startsWith("en")) ?? voices[0] ?? null;
};
var handleAudioSynthesize = async (effect) => {
  if (!("speechSynthesis" in window)) {
    return { ok: false, error: "speechSynthesis not supported" };
  }
  switch (effect.type) {
    case "audio.synthesize":
      const utterance = new SpeechSynthesisUtterance(effect.data.audioSrc);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;
      const voice = getVoice();
      if (voice) {
        utterance.voice = voice;
      }
      console.log("utterance", utterance);
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
      return { ok: true, value: null };
    default:
      console.warn("need to handle this");
      return { ok: true, value: null };
  }
};

// src/effects/web/effect-handlers.ts
var handleEffect = async (effect) => {
  switch (effect.type) {
    case "network.post":
      return await handleNetworkEffect(effect);
    case "audio.synthesize":
      return await handleAudioSynthesize(effect);
    default:
      return {
        ok: false,
        error: "unsupported-effect"
      };
  }
};

// src/effects/web/network-resolver.ts
var now5 = () => (/* @__PURE__ */ new Date()).toISOString();
var resolveNetworkResult = (ids2) => (result) => {
  if (!result.ok) return [];
  const receiveTracesCommand = {
    type: "ReceiveTraces",
    category: "command",
    id: ids2(),
    time: now5(),
    data: {
      conversationId: result.value.conversationId,
      avatar: "ai",
      traces: result.value.traces
    }
  };
  const assistantText = result.value.traces.map((t) => t.content).join(" ");
  const startAudioCommand = {
    type: "StartAudio",
    category: "command",
    id: ids2(),
    time: now5(),
    data: {
      conversationId: result.value.conversationId,
      audioSrc: assistantText,
      avatar: "ai"
    }
  };
  return [receiveTracesCommand, startAudioCommand];
};

// src/effects/web/effect-resolvers.ts
var resolveEffect = (ids2) => (effect, result) => {
  switch (effect.type) {
    case "network.post":
      return resolveNetworkResult(ids2)(result);
    case "audio.synthesize":
      return [];
    // audio has no follow-up commands
    default:
      return [];
  }
};

// src/main.ts
var windowEl = document.getElementById("window");
var rootEl = document.getElementById("root");
var eventsEl = document.getElementById("events");
var traceEl = document.getElementById("trace");
var copyTraceBtn = document.getElementById("copyTrace");
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
  const result = aggregate(root, command, ids);
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
  return (window2, event) => {
    trace({ step: "project", event });
    const next = projector(window2, event);
    trace({ step: "window", window: next });
    return next;
  };
});
var tracedEffectHandler = async (effect) => {
  trace({ step: "effect.handle.start", effect });
  const result = await handleEffect(effect);
  trace({ step: "effect.handle.result", result });
  return result;
};
var tracedEffectResolver = (effect, result) => {
  trace({ step: "effect.resolve.start", effect, result });
  const commands = resolveEffect(ids)(effect, result) ?? [];
  trace({ step: "effect.resolve.commands", commands });
  setTimeout(render, 0);
  return commands;
};
var runtime = createRuntime({
  aggregate: tracedAggregate,
  fold: tracedFold,
  eventStore,
  projectors: tracedProjectors,
  ids,
  effectHandlers: {
    handle: tracedEffectHandler
  },
  effectResolver: tracedEffectResolver,
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
var conversationId = ids();
createBtn.onclick = () => {
  dispatchAndRender({
    type: "CreateConversation",
    category: "command",
    id: conversationId,
    data: { avatar: "participant" },
    time: Date.now().toString()
  });
};
sendBtn.onclick = () => {
  dispatchAndRender({
    type: "SendMessage",
    category: "command",
    id: ids(),
    time: Date.now().toString(),
    data: {
      conversationId,
      prompt: inputEl.value.toString(),
      avatar: "participant"
    }
  });
  inputEl.value = "";
};
muteBtn.onclick = () => {
  dispatchAndRender({
    type: "MuteAudio",
    category: "command",
    id: ids(),
    time: Date.now().toString(),
    data: { conversationId, avatar: "participant" }
  });
};
unmuteBtn.onclick = () => {
  dispatchAndRender({
    type: "UnmuteAudio",
    category: "command",
    id: ids(),
    time: Date.now().toString(),
    data: { conversationId, avatar: "participant" }
  });
};
copyTraceBtn.onclick = () => {
  const text = traceEl.textContent ?? "";
  navigator.clipboard.writeText(text);
};
