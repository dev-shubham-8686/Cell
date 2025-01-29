import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Checkbox,
  //  Popconfirm
} from "antd";
import {
  getEquipmentMasterTblAddOrUpdate,
  //getEquipmentMasterTblDelete,
  getEquipmentMasterTblList,
} from "../../../api/technicalInstructionApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEye,
  //faTrash
} from "@fortawesome/free-solid-svg-icons";
//import dayjs from "dayjs";
import { UserContext } from "../../../context/userContext";
import {
  //CloseOutlined,
  LeftCircleFilled,
  //SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import displayjsx from "../../../utils/displayjsx";

interface TechnicalEquipmentMaster {
  EquipmentId: number;
  EquipmentName?: string;
  CreatedDate?: string;
  CreatedBy?: number;
  ModifiedBy?: number;
  ModifiedDate?: string;
  IsActive?: boolean;
}

const TechnicalEquipmentMasterPage: React.FC = () => {
  const [data, setData] = useState<TechnicalEquipmentMaster[]>([]);
  const [loading, setLoading] = useState(false);
  // const [filteredData, setFilteredData] = useState<TechnicalEquipmentMaster[]>(
  //   []
  // );
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] =
    useState<TechnicalEquipmentMaster | null>(null);
  const [form] = Form.useForm();
  const user = React.useContext(UserContext);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  // const [searchText, setSearchText] = useState("");
  const fetchData = () => {
    setLoading(true);
    getEquipmentMasterTblList()
      .then((response) => {
        setLoading(false);
        setData(response.ReturnValue);
        //setFilteredData(response.ReturnValue); // Initialize filtered data
      })
      .catch(() => {
        void displayjsx.showErrorMsg("Error fetching data");
        setLoading(false);
      });
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsViewMode(false);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (record: TechnicalEquipmentMaster) => {
    setEditingItem(null);
    setIsViewMode(false);
    setEditingItem(record);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleView = (record: TechnicalEquipmentMaster) => {
    setEditingItem(null);
    setEditingItem(record);
    setIsViewMode(true); // Set to true for view mode
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  // const handleDelete = (id: number) => {
  //   getEquipmentMasterTblDelete(id.toString())
  //     .then(() => {
  //       void displayjsx.showSuccess("Record deleted successfully");
  //       //message.success("Record deleted successfully");
  //       fetchData();
  //     })
  //     .catch(() => {
  //       void displayjsx.showErrorMsg("Failed to delete record");
  //       //message.error("Failed to delete record");
  //     });
  // };

  // const handleSearch = () => {
  //   const lowerSearchText = searchText.toLowerCase();
  //   const filtered = data.filter(
  //     (item) =>
  //       Object.keys(item)
  //         .map((key) => String((item as any)[key])) // Convert values to string
  //         .join(" ")
  //         .toLowerCase()
  //         .indexOf(lowerSearchText) !== -1 // Use indexOf instead of includes
  //   );
  //   setFilteredData(filtered);
  // };

  const handleSave = (values: TechnicalEquipmentMaster) => {
    if (editingItem) {
      // Update existing record

      getEquipmentMasterTblAddOrUpdate({
        EquipmentId: editingItem.EquipmentId,
        EquipmentName: values.EquipmentName,
        IsActive: values.IsActive,
        UserId: user?.employeeId,
      })
        .then((response) => {
          let result = response.ReturnValue;

          if (result.EquipmentId == -1) {
            void displayjsx.showInfo("Duplicate record found");
            return false;
          }

          void displayjsx.showSuccess("Record updated successfully");
          //message.success("Record updated successfully");
          fetchData();
          setModalVisible(false);
        })
        .catch(() => {
          void displayjsx.showErrorMsg("Failed to update record");
          // message.error("Failed to update record");
        });
    } else {
      // Create new record
      getEquipmentMasterTblAddOrUpdate({
        EquipmentId: 0,
        EquipmentName: values.EquipmentName,
        IsActive: values.IsActive,
        UserId: user?.employeeId,
      })
        .then((response) => {
          let result = response.ReturnValue;

          if (result.EquipmentId == -1) {
            void displayjsx.showInfo("Duplicate record found");
            return false;
          }

          void displayjsx.showSuccess("Record created successfully");
          //message.success("Record updated successfully");
          fetchData();
          setModalVisible(false);
        })
        .catch(() => {
          void displayjsx.showErrorMsg("Failed to create record");
          // message.error("Failed to update record");
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Equipment Name",
      dataIndex: "EquipmentName",
      key: "EquipmentName",
      sorter: (a: any, b: any) =>
        a.EquipmentName.localeCompare(b.EquipmentName),
    },
    {
      title: "Created By",
      dataIndex: "UserName",
      key: "UserName",
      sorter: (a: any, b: any) =>
        a.UserName.localeCompare(b.UserName),
    },
    {
      title: "Updated By",
      dataIndex: "UpdatedUserName",
      key: "UpdatedUserName",
      sorter: (a: any, b: any) =>
        a.UpdatedUserName.localeCompare(b.UpdatedUserName),
    },
    {
      title: "Is Active",
      dataIndex: "IsActive",
      key: "IsActive",
      render: (IsActive: boolean) => (IsActive ? "Yes" : "No"), // Display Yes/No for IsActive
      sorter: (a: any, b: any) => a.IsActive - b.IsActive,
    },
    // {
    //   title: "Created Date",
    //   dataIndex: "CreatedDate",
    //   key: "CreatedDate",
    //   render: (CreatedDate: string) => (
    //     <span>
    //       {CreatedDate ? dayjs(CreatedDate).format("DD-MM-YYYY") : ""}
    //     </span>
    //   ),
    //   sorter: (a: any, b: any) =>
    //     dayjs(a.CreatedDate).unix() - dayjs(b.CreatedDate).unix(),
    // },
    // {
    //   title: "Created By",
    //   dataIndex: "UserName",
    //   key: "UserName",
    // },
    // {
    //   title: "Modified Date",
    //   dataIndex: "ModifiedDate",
    //   key: "ModifiedDate",
    //   render: (ModifiedDate: string) => (
    //     <span>
    //       {ModifiedDate ? dayjs(ModifiedDate).format("DD-MM-YYYY") : ""}
    //     </span>
    //   ),
    //   sorter: (a: any, b: any) =>
    //     dayjs(a.ModifiedDate).unix() - dayjs(b.ModifiedDate).unix(),
    // },
    // {
    //   title: "Modified By",
    //   dataIndex: "UpdatedUserName",
    //   key: "UpdatedUserName",
    // },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: TechnicalEquipmentMaster) => (
        <span className="action-cell">
          <Button
            title="View"
            className="action-btn"
            icon={<FontAwesomeIcon title="View" icon={faEye} />}
            onClick={() => handleView(record)}
          />

          <Button
            title="Edit"
            className="action-btn"
            icon={<FontAwesomeIcon title="Edit" icon={faEdit} />}
            onClick={() => handleEdit(record)}
          />
          {/* <Popconfirm
            title="Are you sure to delete this record?"
            onConfirm={() => handleDelete(record.EquipmentId!)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              title="Delete"
              className="action-btn"
              icon={<FontAwesomeIcon title="Delete" icon={faTrash} />}
              //onClick={() => handleDelete(record.EquipmentId)}
            />
          </Popconfirm> */}
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2 className="title">Technical Equipment Master</h2>
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
                             setFilteredData(data);
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
                       onClick={handleSearch}
                       className="whitespace-nowrap"
                     >
                       Search
                     </Button>
                   </div> */}
        <Button
          type="primary"
          icon={<LeftCircleFilled />}
          onClick={() => navigate(`/masterlist`)}
          className="whitespace-nowrap"
        >
          BACK
        </Button>
        <Button type="primary" onClick={handleAdd}>
          Add New
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showTotal: () => (
            <div className="d-flex align-items-center gap-3">
              <span style={{ marginRight: "auto" }}>
                Total {data.length} items
              </span>
            </div>
          ),
        }}
      />
      <Modal
        title={editingItem ? "Edit Item" : "Add Item"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => !isViewMode && form.submit()}
        okButtonProps={{ disabled: isViewMode }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{ EquipmentName: "", IsActive: false }}
        >
          <Form.Item
            name="EquipmentName"
            label="Equipment Name"
            rules={[{ required: true, message: "Please enter Equipment Name" }]}
          >
            <Input type="text" placeholder="Equipment Name" disabled={isViewMode} />
          </Form.Item>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Form.Item
              name="IsActive"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
            >
              <Checkbox disabled={isViewMode}>Is Active</Checkbox>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TechnicalEquipmentMasterPage;
