import { Result } from "./";

export type NetworkEffect =
  | {
      type: "network.get";
      data: Record<string, string>;
    }
  | {
      type: "network.post";
      data: Record<string, string>;
    }
  | {
      type: "network.put";
      data: Record<string, string>;
    }
  | {
      type: "network.patch";
      data: Record<string, string>;
    }
  | {
      type: "network.delete";
      data: Record<string, string>;
    }
  | {
      type: "network.ws";
      data: Record<string, string>;
    };

export type NetworkResult = Result<any>;
