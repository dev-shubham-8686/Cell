import React, { useRef, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Modal, Button, Input, Space, InputRef } from "antd";
import DashboardTable from "../Common/DashboardTable";
import DashboardLayout from "../Layout/DashboardLayout";
import { SearchOutlined, ExclamationCircleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

type DataIndex = keyof UOMType;

export interface UOMType {
  key: number;
  id: number;
  SrNo: string;
  UOMType: string;
}

const UOMType = () => {
  const navigate = useNavigate();
  
  const [data, setData] = useState<UOMType[]>([
    {
      key: 1,
      id: 1,
      SrNo: "01",
      UOMType: "UOM1",
    },
    {
      key: 2,
      id: 2,
      SrNo: "02",
      UOMType: "UOM2",
    },
    {
      key: 3,
      id: 3,
      SrNo: "03",
      UOMType: "UOM3",
    },
    {
      key: 4,
      id: 4,
      SrNo: "04",
      UOMType: "UOM4",
    },
    {
      key: 5,
      id: 5,
      SrNo: "05",
      UOMType: "UOM5",
    },
  ]);

  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [viewModalVisible, setViewModalVisible] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<UOMType | null>(null);
  const [editedUOMType, setEditedUOMType] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");
  const [searchedColumn, setSearchedColumn] = useState("");
    const [tableData, setTableData] = useState<UOMType[]>(data);

  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: (string | React.Key)[],
    confirm: () => void,
    dataIndex: DataIndex
  ) => {
    const searchText = selectedKeys[0].toString().toLowerCase();
    // Implement your search logic here
    confirm();
  };

  const onBackClick = () => {
    Modal.confirm({
      title: "Are you sure you want to move to master-management?",
      icon: <ExclamationCircleFilled />,
      onOk() {
        navigate("/master-management");
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const EditHandler = (record: UOMType) => {
    setSelectedRecord(record);
    setEditedUOMType(record.UOMType); 

    setEditModalVisible(true);
  };
 

  const handleEditOk = () => {
    if (selectedRecord) {
      setSelectedRecord({
        ...selectedRecord,
        UOMType: editedUOMType,
      });

      console.log("Edited UOM Type:", editedUOMType);

      setEditModalVisible(false);
    }
  };

  const handleEditCancel = () => {
    setEditModalVisible(false);
  };

  const DeleteHandler = (record: UOMType) => {
    console.log("Delete record:", record);
    setData(data.filter(item => item.id !== record.id));
  };

  const ViewHandler = (record: UOMType) => {
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
  ): ColumnsType<UOMType>[0] => ({
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
            handleSearch(selectedKeys, confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys, confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            size="small"
            style={{ width: 90 }}
            onClick={clearFilters}
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
            onClick={close}
          >
            Close
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
  });

  const columns: ColumnsType<UOMType> = [
    {
      title: "Sr. No.",
      dataIndex: "SrNo",
      key: "SrNo",
      width: "10%",
      sorter: (a, b) => parseInt(a.SrNo) - parseInt(b.SrNo),
      render: (text) => <p className="text-cell">{text}</p>,
    },
    {
      title: "UOM Type",
      dataIndex: "UOMType",
      key: "UOMType",
      render: (text) => <p className="text-cell">{text}</p>,
      width: "50%",
      sorter: (a, b) => a.UOMType.localeCompare(b.UOMType),
      ...getColumnSearchProps("UOMType"),
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

  const SearchTableHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value.toLowerCase();
    setSearchTableText(searchText);
    const filteredData = data.filter(item => item.UOMType.toLowerCase().includes(searchText));
    setTableData(filteredData);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchTableText("");
    setTableData(data);
  };
  const handleUOMTypeChange = (e:any) => {
    console.log("edit uom type")
  };


  return (
    <div>
      <DashboardLayout>
        <div className="col-xl-11" style={{ width: "1855px", padding: "1.5rem 1.25rem" }}>
          <div style={{ padding: "1.5rem 1.25rem", backgroundColor: "white" }}>
            <div className="d-flex align-items-center mb-3">
              <button
                className="btn btn-link btn-back"
                type="button"
                onClick={onBackClick}
              >
                <i className="fa-solid fa-circle-chevron-left"  /> Back
              </button>
              <Input
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
              <Button className="btn btn-primary text-nowrap" >
                <i className="fas fa-search me-1" /> Search
              </Button>
            </div>
            {/* <div className="full-width" style={{ overflowX: "auto" }}>
              <DashboardTable<UOMType> data={tableData} columns={columns} />
            </div> */}
          </div>
        </div>
      </DashboardLayout>
      <Modal
        title="Edit UOM Type"
        centered
        open={editModalVisible}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
      >
        {selectedRecord && (
          <div>
            <label>UOM Type:</label>
            <Input
              value={editedUOMType}
              onChange={(e) => setEditedUOMType(e.target.value)}
            />
          </div>
        )}
      </Modal>


      <Modal
        title="View UOM Type"
        centered
        open={viewModalVisible}
        onOk={handleViewOk}
        onCancel={handleViewCancel}
        footer={[
          <Button key="back" onClick={handleViewCancel}>
            Close
          </Button>,
        ]}
      >
     
        {selectedRecord && (
          <div>
            {selectedRecord.UOMType}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UOMType;
