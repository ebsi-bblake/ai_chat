import { AudioEffect } from "../../../../src/types/effects/audio";

const getVoice = (): SpeechSynthesisVoice | null => {
  const voices = speechSynthesis.getVoices();
  return voices.find((v) => v.lang.startsWith("en")) ?? voices[0] ?? null;
};
export const handleAudioSynthesize = async (effect: AudioEffect) => {
  if (!("speechSynthesis" in window)) {
    return { ok: false, error: "speechSynthesis not supported" };
  }

  switch (effect.type) {
    case "audio.synthesize":
      const utterance = new SpeechSynthesisUtterance(effect.data.audioSrc);

      // Optional tuning
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;

      const voice = getVoice();
      if (voice) {
        utterance.voice = voice;
      }
      console.log("utterance", utterance);
      speechSynthesis.cancel(); // stop any existing speech
      speechSynthesis.speak(utterance);

      return { ok: true, value: null };
    default:
      console.warn("need to handle this");
      return { ok: true, value: null };
  }
};
