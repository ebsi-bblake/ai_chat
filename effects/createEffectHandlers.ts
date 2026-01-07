import { Effect } from "../src/types/core";
import { EffectHandlers } from "../src/types/runtime";
import { EffectResult } from "../src/types/effects/effect-result";

export type EffectHandlerFn<E extends Effect> = (
  effect: E,
) => Promise<EffectResult<E>>;

export type EffectHandlerMap = {
  [K in Effect["type"]]?: EffectHandlerFn<Extract<Effect, { type: K }>>;
};

export const createEffectHandlers = (
  handlers: EffectHandlerMap,
): EffectHandlers => {
  return {
    handle: async <T extends Effect>(effect: T): Promise<EffectResult<T>> => {
      const handler = handlers[effect.type] as EffectHandlerFn<T> | undefined;

      if (handler === undefined) {
        throw new Error(`No effect handler for type: ${effect.type}`);
      }

      return handler(effect);
    },
  };
};
