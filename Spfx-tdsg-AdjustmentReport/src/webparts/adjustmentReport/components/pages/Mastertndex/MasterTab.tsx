import React from "react";
import { Table, Button, Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
// import "../../../../../../src/styles/customStyles.css";
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
    { key: "1", name: "Area" },
     { key: "2", name: "Machine" },
     { key: "3", name: "Section" },
     { key: "4", name: "Sub Machine" },
  ];

  //   const filteredData = data.filter(
  //     (item) => item.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
  //   );

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
              if (record.name == "Machine") {
                navigate(`/master/machine`);
              }
              else if (record.name == "Sub Machine") {
                navigate(`/master/submachine`);
              }
              else if(record.name == "Section"){
                navigate(`/master/section`);
              }else if(record.name == "Area"){
                navigate(`/master/area`);
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
