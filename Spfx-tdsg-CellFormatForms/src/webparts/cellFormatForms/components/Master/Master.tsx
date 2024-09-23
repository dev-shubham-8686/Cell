import React, { useRef, useState } from 'react';
import { ColumnsType } from 'antd/es/table';
import { Link, BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import DashboardTable from '../Common/DashboardTable';
import DashboardLayout from '../Layout/DashboardLayout';
import { SearchOutlined,EditOutlined } from "@ant-design/icons";
import { FilterConfirmProps } from 'antd/es/table/interface';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Button, Input, InputRef, Space, TableColumnType } from 'antd';
type DataIndex = keyof Master;

export interface Master {
    id: number;
    SrNo: string;
    MasterName: string;
    url:string;
}




const data: Master[] = [
    {
        id: 1,
        SrNo: "01",
        MasterName: "Trouble Type",
        url:"troubletype"
    },
    {
        id: 2,
        SrNo: "02",
        MasterName: "Category",
        url:"category"
    },
    {
        id: 3,
        SrNo: "03",
        MasterName: "Material",
        url:"material"
    },
    {
        id: 4,
        SrNo: "04",
        MasterName: "UOM",
        url:"uom"
    },
];

const MasterManagement = () => {
  const EditHandler = (record: Master): void => {
    console.log("Edit record:", record);
//     const navigate = useNavigate();
//     switch (record.MasterName) {
//         case "Trouble Type":
//             navigate("/master-management/troubletype");
//             break;
//         case "Category":
//             navigate('/master-management/category');
//             break;
//         case "Material":
//             navigate('/master-management/material');
//             break;
//         case "UOM":
//             navigate('/master-management/uom');
//             break;
//         default:
//             // Handle the default case or log an error
//             console.error(`Unsupported MasterName: ${record.MasterName}`);
//             break;
//     }
};
    const getColumnSearchProps = (
        dataIndex: DataIndex
      ): TableColumnType<Master> => {
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
                // ref={searchInput}
                placeholder={`Search ${dataIndex}`}
                value={selectedKeys[0]}
                onChange={(e) =>
                  setSelectedKeys(e.target.value ? [e.target.value] : [])
                }
                // onPressEnter={() =>
                  // handleSearch(selectedKeys as string[], confirm, dataIndex)
                // }
                style={{ marginBottom: 8, display: "block" }}
              />
              <Space>
                <Button
                  type="primary"
                  // onClick={() =>
                    // handleSearch(selectedKeys as string[], confirm, dataIndex)
                  // }
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
                    // setSearchText(selectedKeys[0] as string);
                    // setSearchedColumn(dataIndex);
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
              // setTimeout(() => searchInput.current?.select(), 100);
            }
          },
        };
      };
    const columns: ColumnsType<Master> = [
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
      title: "Master Name",
      dataIndex: "MasterName",
      key: "MasterName",
      render: (text) => <p className="text-cell">{text}</p>,
      width: "50%",
      sorter: (a, b) => a.MasterName.localeCompare(b.MasterName),
      ...getColumnSearchProps("MasterName"), 
    },
        {
            title: <p className="text-center p-0 m-0">Action</p>,
            key: "action",
            render: (_, record) => (
              <div className="action-cell">
              <Link to={`/master-management/${record.url.toLowerCase()}`}>
                  <button type="button" style={{ background: "none", border: "none" }}>
                      <span>
                          <i title="Edit" className="fas fa-edit" />
                      </span>
                  </button>
              </Link>
          </div>
            ),
            sorter: false,
            width: "10%",
        },
    ];
    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
  
    const [searchTableText, setSearchTableText] = useState<string>("");
    const [tableData, setTableData] = useState<Master[]>(data);
    const searchInput = useRef<InputRef>(null);

    const SearchTableHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchText = e.target.value;
        setSearchTableText(searchText);
        const filteredData = data.filter(item => item.MasterName.toLowerCase().includes(searchText.toLowerCase()));
        setTableData(filteredData);
    };

    const handleSearch = (selectedKeys: string | React.Key[], confirm: { (param?: FilterConfirmProps): void; (param?: FilterConfirmProps): void; (): void; (): void; }, dataIndex: string) => {
        confirm();
    };

    const handleReset = (clearFilters: { (): void; (): void; }) => {
        clearFilters();
        setSearchTableText("");
    };

    return (
        <div>
            <DashboardLayout>
            <div className="col-md-12" style={{ width: "1855px", padding: "1.5rem 1.25rem" }}>
  <div style={{ backgroundColor: "white", padding: "1.5rem 1.25rem" }}>
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
    {/* <div className="full-width" style={{ overflowX: 'auto' }}>
      <DashboardTable
        data={tableData}
        columns={columns}
      />
    </div> */}
  </div>
</div>

            </DashboardLayout>
        </div>
    );
};

export default MasterManagement;



