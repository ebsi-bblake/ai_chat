// --------- Primitives ---------

export type Avatar = "participant" | "ai" | "five9";

export type CommandCategory = "command";
export type EventCategory =
  | "message"
  | "typing"
  | "audio"
  | "session"
  | "system";

// --------- Base Envelope ---------

export type BaseType<
  T extends string,
  C extends CommandCategory | EventCategory,
  D,
> = {
  type: T;
  category: C;
  id: string;
  time: string;
  data: D;
};
