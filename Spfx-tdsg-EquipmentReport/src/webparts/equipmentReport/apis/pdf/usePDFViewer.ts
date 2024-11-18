import { useMutation } from "@tanstack/react-query";
import http from "../../http";
import { downloadPDF } from "../../utility/utility";
import { PDF_VIEWER } from "../../URLs";

const pdfViewer = async ({ id, EQNo }: { id: number; EQNo: any }) => {
    
  const response = await http.get<any>(PDF_VIEWER, { params: { equipmentId: id } });
  const data = response.data.ReturnValue;
  
  downloadPDF(data, EQNo); 
  return data;
};

const usePDFViewer = () =>
  useMutation<string, unknown, { id: number; EQNo: any }>({
    mutationFn: pdfViewer, 
  });

export default usePDFViewer;
