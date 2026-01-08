export type AudioSynthesizeEffect = {
  type: "audio.synthesize";
  data: {
    conversationId: string;
    audioSrc: string;
    voice?: string;
  };
};

export type AudioSynthesizeResult =
  | {
      ok: true;
      value: {
        conversationId: string;
        audioSrc: string;
      };
    }
  | {
      ok: false;
      error: unknown;
    };
