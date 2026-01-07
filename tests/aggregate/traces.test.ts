import { describe, it, expect } from "vitest";
import { tracesAggregate } from "../../src/aggregate/traces";
import { defaultRoot } from "../../defaults";

describe("tracesAggregate", () => {
  it("ReceiveTraces emits no events or effects", () => {
    const result = tracesAggregate(defaultRoot, {
      type: "ReceiveTraces",
      payload: { traces: [{ anything: true }] },
    });

    expect(result.events).toEqual([]);
    expect(result.effects).toEqual([]);
  });
});
