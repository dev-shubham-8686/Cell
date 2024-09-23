


import React, { useRef, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Modal, Button, TableColumnType, Input, Space, InputRef } from "antd";
import DashboardTable from "../Common/DashboardTable";
import DashboardLayout from "../Layout/DashboardLayout";
import { SearchOutlined } from "@ant-design/icons";
import { FilterConfirmProps } from "antd/es/table/interface";

type DataIndex = keyof MaterialType;

export interface MaterialType {
  id: number;
  SrNo: string;
  MaterialType: string;
}

const MaterialType = () => {
  const [data, setData] = useState<MaterialType[]>([
   

    {
      id: 1,
      SrNo: "01",
      MaterialType: "Material1",
    },
    {
      id: 2,
      SrNo: "02",
      MaterialType: "Material2",
    },
    {
      id: 3,
      SrNo: "03",
      MaterialType: "Material3",
    },
    {
      id: 4,
      SrNo: "04",
      MaterialType: "Material4",
    },
    {
      id: 5,
      SrNo: "05",
      MaterialType: "Material5",
    },
  ]);

  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<MaterialType | null>(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: (string | React.Key)[],
    confirm: { (): void; },
    dataIndex: DataIndex
  ) => {
    // Extract the search text from the selectedKeys array
    const searchText = selectedKeys[0].toString().toLowerCase();
    // Your search logic here...
    confirm();
  };

  const EditHandler = (record: MaterialType): void => {
    setSelectedRecord(record);
    setEditModalVisible(true);
  };

  const handleEditOk = () => {
    // Update the data array with the edited item
    console.log("Edited record:", selectedRecord);
    setEditModalVisible(false);
  };

  const handleEditCancel = () => {
    setEditModalVisible(false);
  };
  const DeleteHandler = (record: MaterialType): void => {
    console.log("Delete record:", record);
    // Remove the item from the data array
    setData(data.filter((item) => item.id !== Number(record.id)));
  };
  

  
  const ViewHandler = (record: MaterialType): void => {
    setSelectedRecord(record);
    setViewModalVisible(true);
  };

  const handleViewOk = () => {
    setViewModalVisible(false);
  };

  const handleViewCancel = () => {
    setViewModalVisible(false);
  };

  const getColumnSearchProps = (
    dataIndex: DataIndex
  ): TableColumnType<MaterialType> => {
    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
        close,
      }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() =>
                handleSearch(selectedKeys as string[], confirm, dataIndex)
              }
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              // onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText(selectedKeys[0] as string);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? "#c50017" : undefined }} />
      ),
      onFilter: (value, record) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
    };
  };

  const columns: ColumnsType<MaterialType> = [
    {
      title: "Sr. No.",
      dataIndex: "SrNo",
      key: "SrNo",
      width: "10%",
      sorter: (a, b) => parseInt(a.SrNo) - parseInt(b.SrNo),
      render: (text) => {
        return <p className="text-cell">{text}</p>;
      },
    },
    {
      title: "Material Type",
      dataIndex: "MaterialType",
      key: "MaterialType",
      render: (text) => <p className="text-cell">{text}</p>,
      width: "50%",
      sorter: (a, b) => a.MaterialType.localeCompare(b.MaterialType),
      ...getColumnSearchProps("MaterialType"), // Apply styling function
    },
    {
      title: <p className="text-center p-0 m-0">Action</p>,
      key: "action",
      render: (_, record) => (
        <div className="action-cell">
          <button
            onClick={() => ViewHandler(record)}
            type="button"
            style={{ background: "none", border: "none" }}
          >
            <span>
              <i title="View" className="fas fa-eye" />
            </span>
          </button>
          <button
            onClick={() => EditHandler(record)}
            type="button"
            style={{ background: "none", border: "none" }}
          >
            <span>
              <i title="Edit" className="fas fa-edit" />
            </span>
          </button>
          <button
            onClick={() => DeleteHandler(record)}
            type="button"
            style={{ background: "none", border: "none" }}
          >
            <span>
              <i title="Delete" className="fas fa-trash text-danger" />
            </span>
          </button>
        </div>
      ),
      width: "0%",
    },
  ];

  const [searchTableText, setSearchTableText] = useState<string>("");
  const [tableData, setTableData] = useState<MaterialType[]>(data);

  const SearchTableHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;
    setSearchTableText(searchText);
    const filteredData = data.filter(item => item.MaterialType.toLowerCase().includes(searchText.toLowerCase()));
    setTableData(filteredData);
  };

  const handleReset = (clearFilters: { (): void; (): void; }) => {
    clearFilters();
    setSearchTableText("");
  };

  return (
    <div>
      <DashboardLayout>
        <div className="col-xl-11" style={{ width: "1855px", padding: "1.5rem 1.25rem" }}>
          <div style={{ padding: "1.5rem 1.25rem", backgroundColor: "white" }}>
            <div className="d-flex align-items-center mb-3">
              <input
                className="form-control me-3"
                type="text"
                placeholder="Search Here"
                value={searchTableText}
                onChange={SearchTableHandler}
                onKeyDown={(e: any) => {
                  if (e.key === "Enter") {
                    SearchTableHandler(e);
                  }
                }}
                style={{ width: "450px", height: "35px" }}
              />
              <button className="btn btn-primary text-nowrap">
                <i className="fa-solid fa-magnifying-glass me-1" /> Search
              </button>
            </div>
            {/* <div className="full-width" style={{ overflowX: "auto" }}>
              <DashboardTable data={tableData} columns={columns} />
            </div> */}
          </div>
        </div>
      </DashboardLayout>
      <Modal
        title="Edit Material Type"
        visible={editModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        footer={[
          <Button key="back" onClick={handleEditCancel}>Cancel</Button>,
          <Button key="submit" type="primary" onClick={handleEditOk}>Save</Button>,
        ]}
      >
        {selectedRecord && (
          <div>
            <input
              type="text"
              value={selectedRecord.MaterialType}
              onChange={(e) =>
                setSelectedRecord({ ...selectedRecord, MaterialType: e.target.value })
              }
              style={{ width: "100%" }}
            />
          </div>
        )}
      </Modal>
      <Modal
        title="View Material Type"
        visible={viewModalVisible}
        onOk={handleViewOk}
        onCancel={handleViewCancel}
        footer={[
          <button
            key="back"
            onClick={handleViewCancel}
            style={{ background: "none", border: "none" }}
          >
          </button>,
        ]}
        width={600}
      >
        {selectedRecord && (
          <p style={{ border: "1px solid #d9d9d9", padding: "4px 8px", borderRadius: "4px" }}>
            {selectedRecord.MaterialType}
          </p>
        )}
      </Modal>
    </div>
  );
};

export default MaterialType;
