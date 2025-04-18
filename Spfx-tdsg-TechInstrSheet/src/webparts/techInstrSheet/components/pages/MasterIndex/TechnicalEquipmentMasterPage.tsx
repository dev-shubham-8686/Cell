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
import "../../../../../../src/styles/customStyles.css";
import dayjs from "dayjs";

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
        (a.EquipmentName || "").localeCompare(b.EquipmentName || ""),
    },
    {
      title: "Is Active",
      dataIndex: "IsActive",
      key: "IsActive",
      render: (IsActive: boolean) => (IsActive ? "Yes" : "No"), // Display Yes/No for IsActive
      sorter: (a: any, b: any) => a.IsActive - b.IsActive,
    },
    {
      title: "Created Date",
      dataIndex: "CreatedDate",
      key: "CreatedDate",
      render: (CreatedDate: string) => (
        <span>
          {CreatedDate ? dayjs(CreatedDate).format("DD-MM-YYYY") : ""}
        </span>
      ),
      sorter: (a: any, b: any) => {
        const dateA = a.CreatedDate ? dayjs(a.CreatedDate).unix() : 0;
        const dateB = b.CreatedDate ? dayjs(b.CreatedDate).unix() : 0;
        return dateA - dateB;
      },
    },
    {
      title: "Created By",
      dataIndex: "UserName",
      key: "UserName",
      sorter: (a: any, b: any) =>
        (a.UserName || "").localeCompare(b.UserName || ""),
    },
    {
      title: "Modified Date",
      dataIndex: "ModifiedDate",
      key: "ModifiedDate",
      render: (ModifiedDate: string) => (
        <span>
          {ModifiedDate ? dayjs(ModifiedDate).format("DD-MM-YYYY") : ""}
        </span>
      ),
      sorter: (a: any, b: any) => {
        const dateA = a.ModifiedDate ? dayjs(a.ModifiedDate).unix() : 0;
        const dateB = b.ModifiedDate ? dayjs(b.ModifiedDate).unix() : 0;
        return dateA - dateB;
      },
    },
    {
      title: "Modified By",
      dataIndex: "UpdatedUserName",
      key: "UpdatedUserName",
      sorter: (a: any, b: any) =>
        (a.UpdatedUserName || "").localeCompare(b.UpdatedUserName || ""),
    },

    // {
    //   title: "Created By",
    //   dataIndex: "UserName",
    //   key: "UserName",
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
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2 className="title">Equipment Master</h2>
      <div className="flex justify-between items-center mb-3">
        <div className="flex gap-2">
          <Button
            type="primary"
            icon={<LeftCircleFilled />}
            onClick={() => navigate(`/masterlist`)}
            className="whitespace-nowrap"
          >
            BACK
          </Button>
          <Button
            type="primary"
            onClick={handleAdd}
            style={{ marginLeft: "4px" }}
          >
            Add New
          </Button>
        </div>
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
        title={
          isViewMode ? "View Item" : editingItem ? "Edit Item" : "Add Item"
        }
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
            rules={[
              {
                required: true,
                max: 100,
                message: "Please enter Equipment Name",
              },
              {
                validator: (_, value) => {
                  if (value && value.trim() === "") {
                    return Promise.reject(
                      new Error("Only spaces are not allowed")
                    );
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input
              type="text"
              placeholder="Equipment Name"
              disabled={isViewMode}
            />
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
