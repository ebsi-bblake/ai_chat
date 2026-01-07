import { describe, it, expect } from "vitest";
import {
  projectAudioMuted,
  projectAudioUnmuted,
} from "../../src/projectors/audio";
import { defaultWindow } from "../../defaults";

describe("audio projectors", () => {
  it("AudioMuted sets isMuted=true", () => {
    const next = projectAudioMuted(defaultWindow, {
      type: "AudioMuted",
      payload: { time: "t" },
    });

    expect(next.isMuted).toBe(true);
  });

  it("AudioUnmuted sets isMuted=false", () => {
    const window = { ...defaultWindow, isMuted: true };

    const next = projectAudioUnmuted(window, {
      type: "AudioUnmuted",
      payload: { time: "t" },
    });

    expect(next.isMuted).toBe(false);
  });
});
