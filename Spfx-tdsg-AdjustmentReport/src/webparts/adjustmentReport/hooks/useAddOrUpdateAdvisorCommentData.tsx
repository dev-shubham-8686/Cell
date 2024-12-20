import { useMutation } from "@tanstack/react-query";

import { addUpdateAdvisorComment, IAdvisorCommentsData } from "../api/AddorUpdateAdvisorComments.api";

export const useAddOrUpdateAdvisorComment = () => {
  return useMutation(async (payload: IAdvisorCommentsData) => {
    const success = await addUpdateAdvisorComment(payload);
    return success;
  });
};
