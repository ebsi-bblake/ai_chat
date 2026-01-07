import { createEffectHandlers } from "../../../effects/createEffectHandlers";
import { handleNetworkPost } from "./network";

export const webEffectHandlers = createEffectHandlers({
  "network.post": handleNetworkPost,
});
