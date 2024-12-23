import * as React from "react";
import { useState, useContext, useEffect, useCallback, useRef } from "react";
import { Table as AntdTable, Select } from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { AnyObject } from "antd/es/_util/type";
import { DefaultOptionType } from "antd/es/cascader";

import useTable from "./useTable";
import { UserContext } from "../../context/userContext";
import { SorterResult } from "antd/es/table/interface";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileExport, faXmark } from "@fortawesome/free-solid-svg-icons";
import ExportReportBox from "../common/exportReportBox";

interface ITable {
  url: string;
  columns: ColumnsType<AnyObject>;
  paginationRequired: boolean;
}

interface IColumnFilter {
  columnName: string;
  columnFilterText: string;
}

const DEFAULT_PAGE_SIZE = 10;
export const pageSizeOptions: DefaultOptionType[] = [
  { label: "10 / page", value: 10 },
  { label: "20 / page", value: 20 },
  { label: "50 / page", value: 50 },
  { label: "100 / page", value: 100 },
];

const Table: React.FC<ITable> = ({ columns, url ,paginationRequired}) => {
  const user = useContext(UserContext);
  const { isLoading, data, mutate } = useTable();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [order, setOrder] = useState("");
  const [orderBy, setOrderBy] = useState("");
  const [columnFilter, setColumnFilter] = useState<IColumnFilter | null>(null);
  const [searchText, setSearchText] = useState("");
  const { id } = useParams();
  const exportReportBoxRef = useRef(null);
  console.log("TABLEDATA",data)
  const staticData = [
    {
      key: '1',
      actionType: 'Approved',
      comment: 'The document has been reviewed and approved.',
      actionTakenBy: 'Raj Parmar',
      actionTakenDate: '2024-09-01', // Adjust the format as needed for rendering
    },
    {
      key: '2',
      actionType: 'Rejected',
      comment: 'The request was rejected due to missing information.',
      actionTakenBy: 'Jinal Panchal',
      actionTakenDate: '2024-09-02', 
    },
    {
      key: '3',
      actionType: 'Pending',
      comment: 'Awaiting further information from the requester.',
      actionTakenBy: 'Raj Parmar',
      actionTakenDate: '2024-09-03', 
    },
    {
      key: '4',
      actionType: 'Approved',
      comment: 'Final approval given after all revisions were made.',
      actionTakenBy: 'Jinal Panchal',
      actionTakenDate: '2024-09-04', 
    },
    {
      key: '5',
      actionType: 'Pending',
      comment: 'Awaiting further information from the requester.',
      actionTakenBy: 'Raj Parmar',
      actionTakenDate: '2024-09-03', 
    },
    {
      key: '6',
      actionType: 'Pending',
      comment: 'Awaiting further information from the requester.',
      actionTakenBy: 'Raj Parmar',
      actionTakenDate: '2024-09-03', 
    },
    {
      key: '7',
      actionType: 'Pending',
      comment: 'Awaiting further information from the requester.',
      actionTakenBy: 'Raj Parmar',
      actionTakenDate: '2024-09-03', 
    },
    {
      key: '8',
      actionType: 'Pending',
      comment: 'Awaiting further information from the requester.',
      actionTakenBy: 'Raj Parmar',
      actionTakenDate: '2024-09-03', 
    },
    {
      key: '9',
      actionType: 'Pending',
      comment: 'Awaiting further information from the requester.',
      actionTakenBy: 'Raj Parmar',
      actionTakenDate: '2024-09-03', 
    },
    {
      key: '10',
      actionType: 'Pending',
      comment: 'Awaiting further information from the requester.',
      actionTakenBy: 'Raj Parmar',
      actionTakenDate: '2024-09-03', 
    },
    {
      key: '11',
      actionType: 'Pending',
      comment: 'Awaiting further information from the requester.',
      actionTakenBy: 'Raj',
      actionTakenDate: '2024-09-03', 
    },
    {
      key: '12',
      actionType: 'Pending',
      comment: 'Awaiting further information from the requester.',
      actionTakenBy: 'Raj ',
      actionTakenDate: '2024-09-03', 
    },
    {
      key: '13',
      actionType: 'Pending',
      comment: 'Awaiting further information from the requester.',
      actionTakenBy: 'Raj Parmar',
      actionTakenDate: '2024-09-03', 
    },
  ];
  
  
  const onChange = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, React.Key[] | null>,
      sorter: SorterResult<AnyObject>
    ) => {
      if (sorter.order && sorter.field) {
        setOrder(sorter.order.replace("end", ""));
        setOrderBy(sorter.field.toString());
      } else {
        setOrder("");
        setOrderBy("");
      }

      if (searchText) return;

      let columnName, columnFilterText;
      for (const [key, value] of Object.entries(filters)) {
        if (key && value?.[0]) {
          columnName = key;
          columnFilterText = value[0].toString();
        }
      }

      if (columnName && columnFilterText)
        setColumnFilter({ columnName, columnFilterText });
      else setColumnFilter(null);
    },
    [searchText]
  );

  const onPaginationChange = useCallback((page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  }, []);

  const onSearchChange = useCallback(
    (
      e:
        | React.MouseEvent<HTMLButtonElement, MouseEvent>
        | React.KeyboardEvent<HTMLInputElement>
    ) => {
      e?.preventDefault();
      const trimmedSearchText = searchText.replace(/\s+/g, '');
      console.log("trimmedtext",trimmedSearchText)
      setColumnFilter({ columnName: "", columnFilterText: trimmedSearchText.trim() });
      setCurrentPage(1);
    },
    [searchText]
  );
  const handleExportButtonClick = () => {
    if (exportReportBoxRef.current) {
      exportReportBoxRef.current.openModal();
    }
  };
  useEffect(() => {
    if (url) {
      let params;
      if(paginationRequired){
        params={
          createdBy: user?.employeeId,
          skip: (currentPage - 1) * pageSize,
          take: pageSize,
          order: order || "Desc",
          orderBy: orderBy || "CreatedDate",
          searchColumn: columnFilter?.columnName,
          searchValue: columnFilter?.columnFilterText,
        }
      }
      else {
         params={
          materialConsumptionId:id
        }
      }
      mutate({
        url: url,
        params:params,
        listingScreen:paginationRequired
      });
    }
  }, [url, currentPage, pageSize, order, orderBy, columnFilter,id,user.employeeId]);
  console.log("DATA",data)
  return (
    <>
      <div className="row">
        <div className="col-md-4">
          <div className="d-flex gap-3 mb-3">
            {paginationRequired && (
              <input
                className="form-control"
                type="text"
                placeholder="Search Here"
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    onSearchChange(e);
                  }
                }}
              />
            )}
            {console.log("SEARCHTEXT",searchText)}
            
            <div className="position-relative">
              {searchText && (
               <FontAwesomeIcon className="me-1 position-absolute text-gray font-18" icon={faXmark} 
                  style={{
                    right: "6rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                
                  }}
                  onClick={() => {
                    setSearchText("");
                    setColumnFilter(null);
                  }}
                /> 
           )} 
              {paginationRequired && (
                <button
                  className="btn btn-primary text-nowrap"
                  onClick={onSearchChange}
                >
                  <i className="fa-solid fa-magnifying-glass me-1" /> Search
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4" />
        {/* {paginationRequired &&<div className="col-md-4 text-end">
          <button className="btn btn-outline-darkgrey text-nowrap">
            <i className="fa-solid fa-file-export me-1 font -16" />
            Export to Excel
          </button>
        </div>}  */}
       {paginationRequired && <div className="col-md-4 text-end">
          <button
            className="btn btn-outline-darkgrey text-nowrap"
            onClick={handleExportButtonClick}
          >
            <FontAwesomeIcon title="View" icon={faFileExport} className="me-1"/>
              Export to Excel
          </button>

          <ExportReportBox
            ref={exportReportBoxRef}
            // onFinish={handleExportFormSubmit}
            buttonText=""
            onCancel={undefined}
          />
        </div>}
      </div>
      <AntdTable
        columns={columns}
        dataSource={data}
        scroll={{ x: "max-content" }}
        loading={isLoading}
        onChange={onChange}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: data?.[0]?.totalCount,
          showSizeChanger: false,
          onChange: onPaginationChange,
          showTotal: (total, range) => (
            <div className="d-flex align-items-center gap-3">
              <span style={{ marginRight: "auto" }}>
                Showing {range[0]}-{range[1]} of {total} items
              </span>
              <Select
                defaultValue={pageSize}
                value={pageSize}
                onChange={(value) => setPageSize(value)}
                options={pageSizeOptions}
              />
            </div>
          ),
        }}
      />
    </>
  );
};

export default Table;
