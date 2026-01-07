import { describe, it, expect } from "vitest";
import { projectCommandRejected } from "../../src/projectors/errors";
import { defaultWindow } from "../../defaults";

describe("error projector", () => {
  it("CommandRejected does not mutate window", () => {
    const next = projectCommandRejected(defaultWindow, {
      type: "CommandRejected",
      payload: {
        command: { type: "MuteAudio" },
        reason: "test",
      },
    });

    expect(next).toEqual(defaultWindow);
  });
});
