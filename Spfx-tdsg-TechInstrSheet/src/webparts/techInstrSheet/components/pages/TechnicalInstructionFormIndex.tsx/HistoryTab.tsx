import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { TablePaginationConfig } from "antd/es/table";
import { GetHistoryData } from "../../../api/technicalInstructionApi";

// interface HistoryRecord {
//   historyID: string;
//   comment: string;
//   actionTakenBy: string;
//   actionTakenDateTime: string;
// }

const HistoryTab: React.FC<{ technicalId: string }> = ({ technicalId }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const loadHistoryData = () => {
    setLoading(true);
    GetHistoryData(technicalId)
      .then((responseData) => {
        setData(responseData.ReturnValue);
        setPagination((prev) => ({
          ...prev,
          total: responseData.length,
        }));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadHistoryData();
  }, [technicalId]);

  const handleTableChange = (newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  };

  const columns = [
    {
      title: "Action",
      dataIndex: "actionType",
      key: "actionType",
      width: "15%",
      render: (text:any) => (
         text ? (text === "UnderAmendment"? "Ask to Amend" : text) : text
      )
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      width: "40%",
    },
    {
      title: "Action Taken By",
      dataIndex: "actionTakenBy",
      key: "actionTakenBy",
      width: "25%",
    },
    {
      title: "Action Taken DateTime",
      dataIndex: "actionTakenDateTime",
      key: "actionTakenDateTime",
      width: "20%",
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          pageSizeOptions: ["10", "20", "50"],
        }}
        loading={loading}
        rowKey="historyID"
        onChange={handleTableChange}
        className="w-full shadow-sm no-radius-table"
      />
    </div>
  );
};

export default HistoryTab;
