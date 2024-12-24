import { useMutation } from "@tanstack/react-query";
import { IPullBack, pullBack } from "../api/PullBack.api";
import { deligate, IDeligate } from "../api/DeligateUser.api";

export const useDeligate = () => {
  return useMutation(async (payload: IDeligate) => {
    const success = await deligate(payload);
    return success;
  });
};
