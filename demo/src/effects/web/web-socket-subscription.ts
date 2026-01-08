import type { ID, Subscription } from "../../../../src/types/runtime";
import { Command } from "../../../../src/types/";
import { RuntimeTrace } from "../../main";

export const networkSubscription = (
  trace: (t: RuntimeTrace) => void,
  ids: ID,
): Subscription => {
  let socket: WebSocket | null = null;

  return {
    start(dispatch) {
      socket = new WebSocket("ws://localhost:11434/api/chat");

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const command: Command = {
          type: "ReceiveTraces",
          category: "command",
          id: ids(),
          time: Date.now().toString(),
          data: {
            conversationId: data.conversationId,
            avatar: "ai",
            traces: [data],
          },
        };
        trace({
          step: "subscription.dispatch",
          command,
        });
        return dispatch(command);
      };
    },

    stop() {
      socket?.close();
      socket = null;
    },
  };
};
