import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { deleteAttachment, IAjaxResult } from "../api/DeleteAttachment.api";

export const useDeleteAttachment = (
    id:number
): UseQueryResult<IAjaxResult> => {
  return useQuery(["delete-attachment"], () => deleteAttachment(id), {
    keepPreviousData: true,
  });
};
