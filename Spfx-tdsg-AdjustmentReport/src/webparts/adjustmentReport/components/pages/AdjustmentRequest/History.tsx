import * as  React from 'react'
import { ColumnsType } from 'antd/es/table';
import { AnyObject } from "antd/es/_util/type";
import Table from '../../table/table';
export interface DataType {
    key: number;
    status?: string;
    action: string;
    comments: string;
    actionTakenBy: string;
    actionTakenDate: string;
  }
const History: React.FC = () => {

    const columns:ColumnsType<AnyObject> = [
        {
          title: "Action",
          dataIndex: "actionType",
          key: "actionType",
          render: (text:string) => <p className="text-cell">{text}</p>,
          width: 150,
        },
        {
          title: "Status",
          dataIndex: "status",
          key: "status",
          render: (text:string) => <p className="text-cell">{text}</p>,
          width: 150,
        },
        {
          title: "Comments",
          dataIndex: "comment",
          key: "comment",
          render: (text:string) => (
            <p
              className="text-cell"
              style={{
                textTransform: "none",
              }}
            >
              {text}
            </p>
          ),
          width: 150,
        },
        {
          title: "Action Taken By",
          dataIndex: "actionTakenBy",
          key: "actionTakenBy",
          render: (text:string) => <p className="text-cell">{text}</p>,
          width: "20%",
        },
        {
          title: "Action Taken Date",
          dataIndex: "actionTakenDateTime",
          key: "actionTakenDate",
        //   render: (value: string) => (
        //     <p className="text-cell">{dayjs(value).format(DATE_FORMAT)}</p>
        //   ),
          width: 150,
        },
      ];
  return (
    <div>
       <Table
      //  classname='maximumWidth'
       columns={columns} paginationRequired={false} url="/api/AdjustmentReport/GetHistoryData" />
    </div>
  )
}

export default History
