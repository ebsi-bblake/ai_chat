import { EffectResult } from "../../../../src/types/effects";
import { AudioEffect } from "../../../../src/types/effects/audio";

const getVoice = (): SpeechSynthesisVoice | null => {
  const voices = speechSynthesis.getVoices();
  return voices.find((v) => v.lang.startsWith("en")) ?? voices[0] ?? null;
};
export const handleAudioEffect = (effect: AudioEffect) => {
  if (!("speechSynthesis" in window)) {
    let result: EffectResult = {
      ok: false,
      error: "unsupported-effect",
    };
    return result;
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
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);

      let result: EffectResult = {
        ok: true,
        value: null,
      };
      return result;

    case "audio.stop":
      console.log("stopping??");
      speechSynthesis.cancel();
      result = {
        ok: true,
        value: null,
      };
      return result;
    default:
      result = {
        ok: true,
        value: null,
      } as const;
      return result;
  }
};
