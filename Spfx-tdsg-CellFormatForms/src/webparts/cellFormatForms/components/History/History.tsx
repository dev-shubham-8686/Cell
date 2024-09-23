import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import Table, { ColumnsType } from "antd/es/table";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ConfigProvider } from "antd";
import { DATE_FORMAT } from "../GLOBAL_CONSTANT";

export interface DataType {
  key: number;
  status?: string;
  action: string;
  comments: string;
  actionTakenBy: string;
  actionTakenDate: string;
}
interface HistoryProps {
  id: any;
  fetchData: (requestId: number) => Promise<any[]>;
}

const History: React.FC<HistoryProps> = ({ fetchData, id }) => {
  dayjs.extend(customParseFormat);

  const [tableData, setTableData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const columns: ColumnsType<DataType> = [
    {
      title: "Action",
      dataIndex: "actionType",
      key: "actionType",
      render: (text) => <p className="text-cell">{text}</p>,
      width: "15%",
    },
    {
      title: "Comments",
      dataIndex: "comment",
      key: "comment",
      render: (text) => (
        <p
          className="text-cell"
          style={{
            textTransform: "none",
          }}
        >
          {text}
        </p>
      ),
      width: "40%",
    },
    {
      title: "Action Taken By",
      dataIndex: "actionTakenBy",
      key: "actionTakenBy",
      render: (text) => <p className="text-cell">{text}</p>,
      width: "25%",
    },
    {
      title: "Action Taken Date",
      dataIndex: "actionTakenDateTime",
      key: "actionTakenDateTime",
      render: (value: string) => (
        <p className="text-cell">{dayjs(value).format(DATE_FORMAT)}</p>
      ),
      width: "20%",
    },
  ];

  const loadData = async (): Promise<void> => {
    setLoading(true);
    try {
      const data = await fetchData(id);
      setTableData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDataAsync = async (): Promise<void> => {
      await loadData();
    };

    fetchDataAsync().catch((error) => {
      console.error("Error during data fetching:", error);
    });
  }, []);

  return (
    <div className="tab-section h-100">
      <ConfigProvider
        theme={{
          token: {
            /* here are your global tokens */
            borderRadius: 4,
            fontFamily: "Lato",
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={tableData}
          loading={loading}
          rowKey={(record) => record.key}
        />
      </ConfigProvider>
    </div>
  );
};

export default History;
