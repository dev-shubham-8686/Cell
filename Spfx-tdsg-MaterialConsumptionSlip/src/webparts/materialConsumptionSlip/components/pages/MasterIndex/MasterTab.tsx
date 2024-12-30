import React from "react";
import { Table, Button, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import {
  //CloseOutlined,
  LeftCircleFilled,
  //SearchOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const MasterTab: React.FC = () => {
  //   const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  // Sample master table data
  const data = [
    { key: "1", name: "UOM" },
    { key: "2", name: "Category" },
    { key: "3", name: "Material" },
    { key: "4", name: "Cost-Center" },
  ];


  // Columns for the table
  const columns = [
    {
      title: "Master Table Name",
      dataIndex: "name",
      key: "name",
      width: "90%", // Set width for this column
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
              if (record.name == "UOM") {
                navigate(`/master/uom`);
              }else if(record.name == "Category") {
                navigate(`/master/category`);
              }
              else if(record.name == "Material") {
                navigate(`/master/material`);
              }
              else if(record.name == "Cost-Center") {
                navigate(`/master/costcenter`);
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
              className="btn btn-primary"
            >
              BACK
            </Button>
          </div>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              pageSize: 5,
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
