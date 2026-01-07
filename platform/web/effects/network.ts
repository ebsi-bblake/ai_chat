import {
  NetworkEffect,
  NetworkResult,
} from "../../../src/types/effects/network";
import { Result } from "../../../src/types/effects/result";

export const handleNetworkPost = async (
  effect: NetworkEffect,
): Promise<NetworkResult> => {
  try {
    const response: Response = await fetch(effect.payload.url, {
      method: effect.type.split(".")[1].toUpperCase(),
      headers: effect.payload.headers,
      body:
        "body" in effect.payload
          ? JSON.stringify(effect.payload.body)
          : undefined,
    });

    const headers: Record<string, string> = {};
    response.headers.forEach((value: string, key: string): void => {
      headers[key] = value;
    });

    const contentType: string | null = response.headers.get("content-type");

    const data: unknown =
      contentType !== null && contentType.includes("application/json")
        ? await response.json()
        : await response.text();

    const result: NetworkResult = {
      ok: true,
      value: {
        requestId: effect.payload.requestId,
        status: response.status,
        data,
        headers,
      },
    };

    return result;
  } catch {
    const result: NetworkResult = {
      ok: false,
      error: "network-error",
    };

    return result;
  }
};
