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
import { deleteMachineMaster, getAllMachineMaster, machineMasterAddOrUpdate } from "../../../api/MasterAPIs/MachineMaster.api";

interface IMachineMaster {
  MachineId: number;
  MachineName?: number;
  CreatedDate?: string;
  CreatedBy?: number;
  ModifiedBy?: number;
  ModifiedDate?: string;
  IsActive?: boolean;
}

const MachineMasterPage: React.FC = () => {
  const [data, setData] = useState<IMachineMaster[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] =
    useState<IMachineMaster | null>(null);
  const [form] = Form.useForm();
  const { user } = useUserContext();
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
 
  const fetchData = () => {
    setLoading(true);
    getAllMachineMaster()
      .then((response) => {
        setLoading(false);
        setData(response.ReturnValue);
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

  const handleEdit = (record: IMachineMaster) => {
    setEditingItem(null);
    setIsViewMode(false);
    setEditingItem(record);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleView = (record: IMachineMaster) => {
    setEditingItem(null);
    setEditingItem(record);
    setIsViewMode(true);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleDelete = (id: number) => {
    deleteMachineMaster(id.toString())
      .then(() => {
        void displayjsx.showSuccess("Record deleted successfully");
        fetchData();
      })
      .catch(() => {
        void displayjsx.showErrorMsg("Failed to delete record");
      });
  };


  const handleSave = (values: IMachineMaster) => {
    if (editingItem) {
      // Update existing record
      machineMasterAddOrUpdate({
        MachineId: editingItem.MachineId,
        MachineName: values.MachineName,
        IsActive: values.IsActive,
        UserId: user?.employeeId,
      })
        .then(() => {
          void displayjsx.showSuccess("Record updated successfully");
          
          fetchData();
          setModalVisible(false);
        })
        .catch(() => {
          void displayjsx.showErrorMsg("Failed to update record");
          
        });
    } else {
      // Create new record
      machineMasterAddOrUpdate({
        MachineId: 0,
        MachineName: values.MachineName,
        IsActive: values.IsActive,
        UserId: user?.employeeId,
      })
        .then((response) => {

          let result = response.ReturnValue;

          if(result.MachineId == -1){
            void displayjsx.showInfo("Duplicate record found");
             return false;
          }

          void displayjsx.showSuccess("Record created successfully");
          
          fetchData();
          setModalVisible(false);
        })
        .catch(() => {
          void displayjsx.showErrorMsg("Failed to create record");
         
        });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Machine Name",
      dataIndex: "MachineName",
      key: "MachineName",
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
      render: (text: any, record: IMachineMaster) => (
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
            onConfirm={() => handleDelete(record.MachineId!)}
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
      <h2 className="title">Machine Master</h2>
      <div className="flex justify-between items-center mb-3">
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
            name="MachineName"
            label="Machine Name"
            rules={[{ required: true, message: "Please enter Machine Name" }]}
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

export default MachineMasterPage;
