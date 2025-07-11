import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Api from "@/features/utils/api.utils";
import Urls from "@/features/utils/urls.utils";
import { queryClient } from "@/queryClient";
import { AxiosError } from "axios";
type DatePaging = BaseResponse<DataPoint>;

export default function useDeleteDatapoint() {
  const deleteDatapointMutation = useMutation({
    mutationKey: ["delete-Datapoint"],
    mutationFn: async (data: string) => {
      if (!data) {
        throw new Error("Something Went Wrong");
      }
      const { data: resData } = await Api.delete<DatePaging>({
        url: Urls.deleteDatapointMeeting(data),
      });
      return resData;
    },
    onSuccess: (response) => {
      toast.success(response?.message);
      queryClient.resetQueries({ queryKey: ["get-datapoint-list"] });
      queryClient.resetQueries({ queryKey: ["get-datapoint-list-non-select"] });
      queryClient.resetQueries({ queryKey: ["get-kpi-by-id"] });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message);
    },
  });

  return deleteDatapointMutation;
}
