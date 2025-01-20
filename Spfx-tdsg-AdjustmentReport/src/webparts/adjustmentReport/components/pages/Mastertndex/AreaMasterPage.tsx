import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Checkbox, Popconfirm } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import {
  //CloseOutlined,
  LeftCircleFilled,
  //SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import displayjsx from "../../../utils/displayjsx";
import { useUserContext } from "../../../context/UserContext";
import { areaMasterAddOrUpdate, deleteAreaMaster, getAllAreaMaster } from "../../../api/MasterAPIs/AreaMaster.api";

interface IAreaMaster {
  AreaId: number;
  AreaName?: number;
  CreatedDate?: string;
  CreatedBy?: number;
  ModifiedBy?: number;
  ModifiedDate?: string;
  IsActive?: boolean;
}

const AreaMasterPage: React.FC = () => {
  const [data, setData] = useState<IAreaMaster[]>([]);
  const [loading, setLoading] = useState(false);
  // const [filteredData, setFilteredData] = useState<TechnicalEquipmentMaster[]>(
  //   []
  // );
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] =
    useState<IAreaMaster | null>(null);
  const [form] = Form.useForm();
  const { user } = useUserContext();
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  // const [searchText, setSearchText] = useState("");
  const fetchData = () => {
    setLoading(true);
    getAllAreaMaster()
      .then((response) => {
        setLoading(false);
        setData(response?.ReturnValue);
        //setFilteredData(response.ReturnValue); // Initialize filtered data
      })
      .catch(() => {
        void displayjsx.showErrorMsg("Error fetching Area Master data");
        setLoading(false);
      });
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsViewMode(false);
    setModalVisible(true);
    form.resetFields();
  };

  const handleEdit = (record: IAreaMaster) => {
    setEditingItem(null);
    setIsViewMode(false);
    setEditingItem(record);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleView = (record: IAreaMaster) => {
    setEditingItem(null);
    setEditingItem(record);
    setIsViewMode(true); // Set to true for view mode
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleDelete = (id: number) => {
    deleteAreaMaster(id.toString())
      .then(() => {
        void displayjsx.showSuccess("Record deleted successfully");
        //message.success("Record deleted successfully");
        fetchData();
      })
      .catch(() => {
        void displayjsx.showErrorMsg("Failed to delete record");
        //message.error("Failed to delete record");
      });
  };

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

  const handleSave = (values: IAreaMaster) => {
    if (editingItem) {
      // Update existing record

      areaMasterAddOrUpdate({
        AreaId: editingItem.AreaId,
        AreaName: values.AreaName,
        IsActive: values.IsActive,
        UserId: user?.employeeId,
      })
        .then(() => {
          void displayjsx.showSuccess("Record updated successfully");
          //message.success("Record updated successfully");
          fetchData();
          setModalVisible(false);
        })
        .catch(() => {
          void displayjsx.showErrorMsg("Failed to update record");
          // message.error("Failed to update record");
        });
    }
      else {
      // Create new record
      areaMasterAddOrUpdate({
        AreaId: 0,
        AreaName: values.AreaName,
        IsActive: values.IsActive,
        UserId: user?.employeeId,
      })
        .then((response) => {

          let result = response.ReturnValue;

          if(result.AreaId == -1){
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
      title: "Area Name",
      dataIndex: "AreaName",
      key: "AreaName",
      sorter: (a: any, b: any) =>
        a.EquipmentName.localeCompare(b.EquipmentName),
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
      sorter: (a: any, b: any) =>
        dayjs(a.CreatedDate).unix() - dayjs(b.CreatedDate).unix(),
    },
    {
      title: "Created By",
      dataIndex: "UserName",
      key: "UserName",
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
      sorter: (a: any, b: any) =>
        dayjs(a.ModifiedDate).unix() - dayjs(b.ModifiedDate).unix(),
    },
    {
      title: "Modified By",
      dataIndex: "UpdatedUserName",
      key: "UpdatedUserName",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: IAreaMaster) => (
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
          <Popconfirm
            title="Are you sure to delete this record?"
            onConfirm={() => handleDelete(record.AreaId!)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              title="Delete"
              className="action-btn"
              icon={<FontAwesomeIcon title="Delete" icon={faTrash} />}
              //onClick={() => handleDelete(record.EquipmentId)}
            />
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <h2 className="title">Area Master</h2>
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
          onClick={() => navigate(`/master`)}
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
        pagination={{ pageSize: 10, 
          showTotal: () => (
         <div className="d-flex align-items-center gap-3">
           <span style={{ marginRight: "auto" }}>
             Total {data.length} items
           </span>
         </div>
       ), }}
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
            name="AreaName"
            label="Area Name"
            rules={[{ required: true, message: "Please enter Area Name" }]}
          >
            <Input type="text" disabled={isViewMode} />
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

export default AreaMasterPage;
