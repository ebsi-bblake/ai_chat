import { AudioEffect } from "./audio";
import { NetworkEffect } from "./network";
import { ScrollEffect } from "./scroll";
import { StorageEffect } from "./storage";

export type Effect = AudioEffect | NetworkEffect | StorageEffect | ScrollEffect;
