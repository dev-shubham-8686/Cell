import { useMutation } from "@tanstack/react-query";
import { PDF_VIEWER } from "../../URLS";
import http from "../../http";
import { downloadPDF } from "../../utility/utility";
import displayjsx from "../../utility/displayjsx";

const pdfViewer = async ({
  id,
  materialNo,
}: {
  id: number;
  materialNo: any;
}) => {
  const response = await http.get<any>(PDF_VIEWER, {
    params: { materialConsumptionId: id },
  });
  const data = response.data.ReturnValue;

  if (response?.data?.StatusCode === 7) {
    void displayjsx.showSuccess(response?.data?.Message ?? "");
  }

  downloadPDF(data, materialNo);
  return data;
};

const usePDFViewer = () =>
  useMutation<string, unknown, { id: number; materialNo: any }>({
    mutationFn: pdfViewer,
  });

export default usePDFViewer;
