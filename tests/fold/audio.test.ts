import { describe, it, expect } from "vitest";
import {
  foldAudioMuted,
  foldAudioUnmuted,
  foldAudioPlaybackStarted,
  foldAudioPlaybackCompleted,
} from "../../src/fold/audio";
import { defaultRoot } from "../../defaults";

describe("audio folds", () => {
  it("AudioMuted sets audioMuted=true", () => {
    const next = foldAudioMuted(defaultRoot, {
      type: "AudioMuted",
      payload: { time: "t" },
    });
    expect(next.audioMuted).toBe(true);
  });

  it("AudioPlaybackStarted sets playing state", () => {
    const next = foldAudioPlaybackStarted(defaultRoot, {
      type: "AudioPlaybackStarted",
      payload: { url: "x", time: "t" },
    });
    expect(next.audioPlaying).toBe(true);
    expect(next.currentAudioUrl).toBe("x");
  });

  it("AudioPlaybackCompleted clears playing state", () => {
    const next = foldAudioPlaybackCompleted(
      { ...defaultRoot, audioPlaying: true, currentAudioUrl: "x" },
      {
        type: "AudioPlaybackCompleted",
        payload: { url: "x", time: "t" },
      },
    );
    expect(next.audioPlaying).toBe(false);
    expect(next.currentAudioUrl).toBeNull();
  });
});
