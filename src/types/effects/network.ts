import { Result } from "./result";

export type NetworkEffect =
  | {
      type: "network.get";
      payload: Record<string, string>;
    }
  | {
      type: "network.post";
      payload: Record<string, string>;
    }
  | {
      type: "network.put";
      payload: Record<string, string>;
    }
  | {
      type: "network.patch";
      payload: Record<string, string>;
    }
  | {
      type: "network.delete";
      payload: Record<string, string>;
    };

export type NetworkResult = Result<any>;
