import type {
  StorageEffect,
  StorageReadResult,
  StorageWriteResult,
} from "../../../../src/types/effects/storage";

export const handleStorageEffect = async (
  effect: StorageEffect,
): Promise<StorageReadResult | StorageWriteResult> => {
  try {
    switch (effect.type) {
      case "storage.write":
        localStorage.setItem(effect.data.key, effect.data.value);
        return { ok: true, value: undefined };

      case "storage.read":
        return {
          ok: true,
          value: {
            value: localStorage.getItem(effect.data.key),
          },
        };

      case "storage.delete":
        localStorage.removeItem(effect.data.key);
        return { ok: true, value: undefined };

      case "storage.clear":
        Object.keys(localStorage).forEach((k) => {
          if (!effect.data?.prefix || k.startsWith(effect.data.prefix)) {
            localStorage.removeItem(k);
          }
        });
        return { ok: true, value: undefined };
    }
  } catch (error) {
    return { ok: false, error };
  }
};
