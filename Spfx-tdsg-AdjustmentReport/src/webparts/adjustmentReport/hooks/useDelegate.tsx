import { useMutation } from "@tanstack/react-query";
import { IPullBack, pullBack } from "../api/PullBack.api";
import { delegate, IDelegate } from "../api/DeligateUser.api";

export const useDelegate = () => {
  return useMutation(async (payload: IDelegate) => {
    const success = await delegate(payload);
    return success;
  });
};
