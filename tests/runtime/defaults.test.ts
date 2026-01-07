import { describe, it, expect } from "vitest";
import { defaultRoot, defaultWindow } from "../../defaults";

describe("defaults", () => {
  it("defaultRoot is neutral", () => {
    expect(defaultRoot.conversationId).toBeNull();
    expect(defaultRoot.conversationActive).toBe(false);
    expect(defaultRoot.audioMuted).toBe(false);
    expect(defaultRoot.audioPlaying).toBe(false);
    expect(defaultRoot.currentAudioUrl).toBeNull();
    expect(defaultRoot.networkRetries).toEqual({});
    expect(defaultRoot.audioRetries).toEqual({});
  });

  it("defaultWindow is renderable", () => {
    expect(defaultWindow.conversationId).toBe("");
    expect(defaultWindow.conversation.utterances).toEqual([]);
    expect(defaultWindow.isTyping).toBe(false);
    expect(defaultWindow.isMuted).toBe(false);
  });
});
