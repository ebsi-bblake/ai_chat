import { describe, it, expect } from "vitest";
import { audioAggregate } from "../../src/aggregate/audio";
import { defaultRoot } from "../../defaults";

describe("audioAggregate", () => {
  it("MuteAudio emits AudioMuted", () => {
    const r = audioAggregate(defaultRoot, { type: "MuteAudio" });
    expect(r.events[0].type).toBe("AudioMuted");
  });

  it("MuteAudio is idempotent", () => {
    const r = audioAggregate(
      { ...defaultRoot, audioMuted: true },
      { type: "MuteAudio" },
    );
    expect(r.events).toEqual([]);
  });

  it("UnmuteAudio emits AudioUnmuted", () => {
    const r = audioAggregate(
      { ...defaultRoot, audioMuted: true },
      { type: "UnmuteAudio" },
    );
    expect(r.events[0].type).toBe("AudioUnmuted");
  });
});
