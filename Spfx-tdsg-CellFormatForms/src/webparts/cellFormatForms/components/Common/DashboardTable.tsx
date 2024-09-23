import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  ConfigProvider,
  TablePaginationConfig,
  Select,
  Spin,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { SortOrder } from "antd/es/table/interface";
import {
  DASHBOARD_LISTING_PAGESIZE,
  DATE_FORMAT,
  EXCEL_DATE_FORMAT,
  pageSizeOptions,
} from "../GLOBAL_CONSTANT";
import { useSelector } from "react-redux";
import { IAppState } from "../../store/reducers";
import { ExportToPdf } from "../utils/Handler/Listing";
import dayjs from "dayjs";
import ExportReportBox from "./ExportReportBox";

interface TableRecord {
  PlusSign: number;
  key: React.Key;
}

interface FetchDataProps<T> {
  pageIndex: number;
  pageSize: number;
  order?: string;
  sorting?: SortOrder;
  search?: string;
  columnName?: string;
}

interface FetchDataResult<T> {
  items: T[];
  totalCount: number;
}

interface DashboardTableProps<T extends TableRecord> {
  setSearchColumn?: React.Dispatch<React.SetStateAction<string>>;
  tab: number; // approver = 3 review = 2 request = 1
  rowKey?: number | ((record: any) => number);
  tableClass?: string;
  columns: ColumnsType<T>;
  renderNestedRecords: (expanded: boolean, record: any) => Promise<any>;
  fetchData: (props: FetchDataProps<T>) => Promise<FetchDataResult<T>>;
  reloadData: number;
  filters?: any;
  setFilters?: React.SetStateAction<any>;
  searchedColumn?: string;
  excelReportType?: "requestor" | "approver";
  userId?: number;

  expandedRowRender?: (
    record: T,
    index?: number,
    indent?: number,
    expanded?: boolean
  ) => React.ReactNode;
}

const   DashboardTable = <T extends TableRecord>({
  setSearchColumn,
  tab,
  tableClass = "",
  columns,
  fetchData,
  renderNestedRecords,
  reloadData,
  filters,
  setFilters,
  searchedColumn,
  excelReportType,
  userId,
  expandedRowRender,
}: DashboardTableProps<T>): React.ReactElement => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(DASHBOARD_LISTING_PAGESIZE);
  const [total, setTotal] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<SortOrder | null>(null);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [searchTableText, setSearchTableText] = useState<string>("");
  const exportReportBoxRef = useRef(null);

  const EMPLOYEE_ID = useSelector<IAppState, number>(
    (state) => state.Common.userRole.employeeId
  );

  const loadData = async (
    pageIndex: number,
    pageSize: number,
    order?: string,
    sorting?: SortOrder,
    search?: string,
    columnName?: string
  ): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetchData({
        pageIndex,
        pageSize,
        order,
        sorting,
        search,
        columnName,
      });

      

      console.log("DashBoardTableLoadData", response);
      setData(response?.items ?? []);
      setTotal(response?.totalCount ?? 0);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDataAsync = async (): Promise<void> => {
      await loadData(
        currentPage,
        pageSize,
        sortColumn,
        sortOrder,
        searchTableText
      );
    };

    fetchDataAsync().catch((error) => {
      console.error("Error during data fetching:", error);
    });
  }, [
    EMPLOYEE_ID,
    currentPage,
    pageSize,
    sortColumn,
    sortOrder,
    filters,
    reloadData,
  ]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, React.Key[] | null>,
    sorter: any
  ): void => {
    setCurrentPage(pagination.current || 1);
    setPageSize(pagination.pageSize || DASHBOARD_LISTING_PAGESIZE);
    setFilters(filters);

    if (sorter.order) {
      setSortOrder(sorter.order.replace("end", ""));
      setSortColumn(sorter.field);
    } else {
      setSortOrder(null);
      setSortColumn(null);
    }
  };

  const handlePageSizeChange = (current: number, size: number): void => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page on page size change
  };

  const handlePageChange = (page: number, pageSize?: number): void => {
   
    setCurrentPage(page);
    if (pageSize) {
      setPageSize(pageSize);
    }
  };

  // const handleExpandRow = async (expanded: boolean, record: T) => {
  //   if (expanded && record.key) {
  //     setShowLoader(true);
  //     try {
  //       const nestedData = await getReviseDataListing(record.key as number);
  //       const updatedData = data.map(item =>
  //         item.key === record.key ? { ...item, SimilarEntries: nestedData } : item
  //       );
  //       setData(updatedData);
  //     } catch (error) {
  //       console.error("Failed to fetch nested data:", error);
  //     } finally {
  //       setShowLoader(false);
  //     }
  //   }
  // };

  const SearchTableHandler = async (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLInputElement>,
    resetSearchText: boolean = false
  ): Promise<void> => {
    if (e.preventDefault) {
      e.preventDefault();
    }

    if (resetSearchText) setSearchTableText("");

    await loadData(
      searchTableText !== "" && !resetSearchText ? 1 : currentPage,
      pageSize,
      sortColumn,
      sortOrder,
      resetSearchText ? "" : searchTableText
    );
  };
  
  const handleExportFormSubmit = async (values: any) => {
    try {
      // const filteredData = values.filter((item:any) => {
      //   const createdOn = new Date(item.CreatedDate);
      //   const fromDate = new Date(values.fromDate);
      //   const toDate = new Date(values.toDate);
      //   const isWithinDateRange = createdOn >= fromDate && createdOn <= toDate;
      //   return isWithinDateRange;
      // });

      const formattedFromDate = dayjs(values.fromDate).format(
        EXCEL_DATE_FORMAT
      );

      const formattedToDate = dayjs(values.toDate).format(EXCEL_DATE_FORMAT);

      await ExportToPdf(formattedFromDate, formattedToDate, EMPLOYEE_ID, tab);
      
      //
      // if (filteredData.length === 0) {
      //   await message.info("No data available for export.");
      //   return;
      // }
      //
      // const jsonData = filteredData.map((item:any) => ({
      //   SrNo: item.SrNo,
      //   TroubleReportNo: item.TroubleReportNo,
      //   CreatedOn: item.CreatedDate,
      //   CreatedBy: item.CreatedBy,
      //   Status: item.Status,
      // }));
      //
      // const ws = XLSX.utils.json_to_sheet(jsonData);
      // const wb = XLSX.utils.book_new();
      // XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

      // const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });
      // const url = window.URL.createObjectURL(new Blob([excelBuffer]));

      // const link = document.createElement("a");
      // link.href = url;
      // link.setAttribute("download", "exported_data.xlsx");
      // document.body.appendChild(link);
      // link.click();

      // await message.success("Data exported successfully.");
    } catch (error) {
      console.error("Export error:", error);
      await message.error("Failed to export data.");
    }
  };

  const handleExportButtonClick = () => {
    if (exportReportBoxRef.current) {
      exportReportBoxRef.current.openModal();
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-md-4">
          <div className="d-flex gap-3 mb-3">
            <input
              className="form-control"
              type="text"
              placeholder="Search Here"
              value={searchTableText}
              onChange={(e) => {
                setSearchTableText(e.target.value);
                setSearchColumn("");
              }}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  await SearchTableHandler(e);
                }
              }}
            />
            <div className="position-relative">
              {searchTableText && (
                <i
                  className="fa-solid fa-times position-absolute text-gray font-18"
                  style={{
                    left: "-2.25rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                  onClick={(e: any) => SearchTableHandler(e, true)}
                />
              )}
              <button
                className="btn btn-primary text-nowrap"
                onClick={(e) => SearchTableHandler(e)}
              >
                <i className="fa-solid fa-magnifying-glass me-1" /> Search
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-4" />
        <div className="col-md-4 text-end">
          <button
            className="btn btn-outline-darkgrey text-nowrap"
            onClick={handleExportButtonClick}
          >
            <i className="fa-solid fa-file-export me-1 font -16" />
            Export to Excel
          </button>

          <ExportReportBox
            ref={exportReportBoxRef}
            onFinish={handleExportFormSubmit}
            buttonText=""
            onCancel={undefined}
          />
        </div>
      </div>
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 4,
            fontFamily: "Segoe UI",
            // colorPrimary: "#c50017",
          },
        }}
      >
        <Table
          className={tableClass}
          columns={columns}
          dataSource={data}
          scroll={{ x: "max-content" }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: false,
            onChange: handlePageChange,
            onShowSizeChange: handlePageSizeChange,
            showTotal: (total, range) => (
              <div className="d-flex align-items-center gap-3">
                <span style={{ marginRight: "auto" }}>
                  Showing {range[0]}-{range[1]} of {total} items
                </span>
                <Select
                  defaultValue={pageSize}
                  value={pageSize}
                  onChange={(value) => handlePageSizeChange(currentPage, value)}
                  options={pageSizeOptions}
                />
              </div>
            ),
            itemRender: (_, __, originalElement) => originalElement,
          }}
          rowKey={(record) => record.key}
          loading={loading}
          onChange={handleTableChange}
          expandable={{
            expandedRowRender: (record) => expandedRowRender(record),
            onExpand: renderNestedRecords,
            rowExpandable: (record) => record.PlusSign === 1,
          }}
        />
      </ConfigProvider>
      <Spin spinning={showLoader} fullscreen />
    </>
  );
};

export default DashboardTable;
