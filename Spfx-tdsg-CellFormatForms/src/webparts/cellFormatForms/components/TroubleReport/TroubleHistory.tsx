import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IHistoryDetail } from "../utils/Handler/HistoryDetails";
import Handler from "../utils/Handler";
import History from "../History";

const TroubleHistory: React.FC = () => {
  const { id } = useParams(); // Adjust based on your route configuration
  const [loading, setLoading] = useState(false);
  const [historyTableData, setHistoryTableData] = useState<IHistoryDetail[]>(
    []
  );

  const fetchWorkflowHistoryDetails = async (
    requestId: any
  ): Promise<IHistoryDetail[]> => {
    setLoading(true);
    try {
      const response = await Handler.HistoryDetails.getWorkflowHistory(
        requestId
      );
      console.log("TroubleHistory Response", response);
      setHistoryTableData(response);
      return response;
    } catch (error) {
      console.error(
        "Error in executing the fetchWorkflowHistoryDetails function",
        error
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (id) {
      fetchWorkflowHistoryDetails(id).catch((e) =>
        console.error("history data error", e)
      );
    }
  }, []);

  return (
    <>
      <div>
        <History id={id} data={historyTableData} isLoading={loading} />
      </div>
    </>
  );
};

export default TroubleHistory;
