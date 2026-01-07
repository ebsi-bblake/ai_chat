import { describe, it, expect } from "vitest";
import { audioAggregate } from "../../src/aggregate/audio";
import { defaultRoot } from "../../defaults";

describe("audioAggregate playback branches", () => {
  it("AudioStarted is idempotent when already playing", () => {
    const root = {
      ...defaultRoot,
      audioPlaying: true,
      currentAudioUrl: "x",
    };

    const result = audioAggregate(root, {
      type: "AudioStarted",
      payload: { url: "x" },
    });

    expect(result.events).toEqual([]);
  });

  it("AudioCompleted does nothing when not playing", () => {
    const result = audioAggregate(defaultRoot, {
      type: "AudioCompleted",
      payload: { url: "x" },
    });

    expect(result.events).toEqual([]);
  });

  it("AudioFailed does nothing when not playing", () => {
    const result = audioAggregate(defaultRoot, {
      type: "AudioFailed",
      payload: { url: "x", error: "fail" },
    });

    expect(result.events).toEqual([]);
  });
});
