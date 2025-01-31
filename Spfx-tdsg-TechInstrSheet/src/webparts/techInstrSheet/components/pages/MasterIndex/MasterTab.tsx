import React from "react";
import { Table, Button, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
// import "../../../../../../src/styles/customStyles.css";
import { LeftCircleFilled } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const MasterTab: React.FC = () => {
  //   const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  // Sample master table data
  const data = [
    { key: "1", moduleName: "TECHNICAL INSTRUCTIONS SHEET ", name: "Equipment", url: "/masterlist/equipment" },
    // { key: "2", moduleName: "Test-1", name: "Category", url: "/masterlist/category" },
    // { key: "3", moduleName: "Test-1", name: "Device", url: "/masterlist/device" },
    // { key: "4", moduleName: "Test-1", name: "Result Monitoring Master", url: "/masterlist/result-monitoring" },
    // { key: "5", moduleName: "Test-1", name: "FunctionMaster", url: "/masterlist/function" },
    // { key: "6", moduleName: "Test-1", name: "TroubleType", url: "/masterlist/troubleType" },
    // { key: "7", moduleName: "Test-1", name: "UnitOfMeasure", url: "/masterlist/unitOfMeasure" },
    // { key: "8", moduleName: "Test-1", name: "CellDivisionRole Master", url: "/masterlist/cellDivisionRole" },
    // { key: "9", moduleName: "Test-1", name: "CPCGroup Master", url: "/masterlist/cPCGroupMaster" },
    // { key: "10", moduleName: "Test-1", name: "SubDevice Master", url: "" },
    // { key: "11", moduleName: "Test-1", name: "Material", url: "/masterlist/material" },
    // { key: "12", moduleName: "Test-1", name: "SectionHeadEmp Master", url: "/masterlist/sectionHeadEmpMaster" },
];


  // Columns for the table
  const columns = [
    {
      title: "Sr No.",
      dataIndex: "key",
      key: "key",
      width: "20%",
      sorter: true
    },
    {
      title: "Module Name",
      dataIndex: "moduleName",
      key: "moduleName",
      width: "30%", // Set width for this column
      sorter: (a: any, b: any) => a.name.localeCompare(b.moduleName),
    },
    {
      title: "Master Table Name",
      dataIndex: "name",
      key: "name",
      width: "30%", // Set width for this column
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: "Action",
      key: "action",
      width: "10%", // Set width for this column
      render: (_: any, record: any) => (
        <span className="action-cell">
          <Button
            style={{ marginLeft: "22px" }}
            title="View"
            className="action-btn"
            icon={<FontAwesomeIcon title="View" icon={faEye} />}
            onClick={() => {
              if (record.url) {
                  navigate(record.url);
              } else {
                  console.error("No URL specified for this record.");
              }
          }}
          />
        </span>
      ),
    },
  ];

  return (
    <div>
      <Row>
        <Col span={24}>
          <h2 className="title">Master List</h2>
          <div className="flex justify-between items-center mb-3">
            {/* <div className="flex gap-3 items-center">
              <div style={{ position: "relative", display: "inline-block" }}>
                <Input
                  type="text"
                  placeholder="Search Here"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 300 }}
                />
                {searchText && (
                  <CloseOutlined
                    onClick={() => {
                      setSearchText("");
                    }}
                    className="text-gray-400 cursor-pointer"
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      zIndex: 1,
                      cursor: "pointer",
                    }}
                  />
                )}
              </div>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                //onClick={handleSearch}
                className="whitespace-nowrap"
              >
                Search
              </Button>
            </div> */}
            <Button
              type="primary"
              icon={<LeftCircleFilled />}
              onClick={() => navigate(`/`)}
              className="whitespace-nowrap"
            >
              BACK
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              pageSize: 16,
              showTotal: () => (
                <div className="d-flex align-items-center gap-3">
                  <span style={{ marginRight: "auto" }}>
                    Total {data.length} items
                  </span>
                </div>
              ),
            }}
            rowKey="key"
            bordered
          />
        </Col>
      </Row>
    </div>
  );
};

export default MasterTab;
