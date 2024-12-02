import { useMutation } from "@tanstack/react-query";
import { IPullBack, pullBack } from "../api/PullBack.api";

export const usePullBack = () => {
  return useMutation(async (payload: IPullBack) => {
    const success = await pullBack(payload);
    return success;
  });
};
