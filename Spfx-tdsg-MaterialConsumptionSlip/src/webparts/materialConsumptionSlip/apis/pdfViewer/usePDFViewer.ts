import { useMutation } from "@tanstack/react-query";
import { PDF_VIEWER } from "../../URLS";
import http from "../../http";
import { downloadPDF } from "../../utility/utility";

const pdfViewer = async ({ id, materialNo }: { id: number; materialNo: any }) => {
  const response = await http.get<any>(PDF_VIEWER, { params: { materialConsumptionId: id } });
  const data = response.data.ReturnValue;
  downloadPDF(data, materialNo); 
  return data;
};

const usePDFViewer = () =>
  useMutation<string, unknown, { id: number; materialNo: any }>({
    mutationFn: pdfViewer, 
  });

export default usePDFViewer;
