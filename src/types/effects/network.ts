export type NetworkEffect =
  | {
      type: "network.get";
      payload: {
        requestId: string;
        url: string;
        headers?: Record<string, string>;
      };
    }
  | {
      type: "network.post";
      payload: {
        requestId: string;
        url: string;
        headers?: Record<string, string>;
        body?: unknown;
      };
    }
  | {
      type: "network.put";
      payload: {
        requestId: string;
        url: string;
        headers?: Record<string, string>;
        body?: unknown;
      };
    }
  | {
      type: "network.patch";
      payload: {
        requestId: string;
        url: string;
        headers?: Record<string, string>;
        body?: unknown;
      };
    }
  | {
      type: "network.delete";
      payload: {
        requestId: string;
        url: string;
        headers?: Record<string, string>;
      };
    };

export type NetworkResult = Result<{
  requestId: string;
  status: number;
  data: unknown;
  headers: Record<string, string>;
}>;
