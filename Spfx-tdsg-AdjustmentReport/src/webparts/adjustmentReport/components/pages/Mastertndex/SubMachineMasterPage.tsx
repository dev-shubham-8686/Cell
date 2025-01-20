import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Checkbox, Popconfirm, Select } from "antd";

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
import { useGetAllMachines } from "../../../hooks/useGetAllMachines";
import { deleteSubMachineMaster, getAllSubMachineMaster, subMachineMasterAddOrUpdate } from "../../../api/MasterAPIs/SubMachineMaster.api";

interface ISubMachineMaster {
  SubMachineId: number;
  SubMachineName?: number;
  MachineId:number;
  CreatedDate?: string;
  CreatedBy?: number;
  ModifiedBy?: number;
  ModifiedDate?: string;
  IsActive?: boolean;
}

const SubMachineMasterPage: React.FC = () => {
  const [data, setData] = useState<ISubMachineMaster[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] =
    useState<ISubMachineMaster | null>(null);
  const [form] = Form.useForm();
  const { user } = useUserContext();
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
 const { data: machinesResult, isLoading: machineloading } =
     useGetAllMachines();
  const fetchData = () => {
    setLoading(true);
    getAllSubMachineMaster()
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

  const handleEdit = (record: ISubMachineMaster) => {
    setEditingItem(null);
    setIsViewMode(false);
    setEditingItem(record);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleView = (record: ISubMachineMaster) => {
    setEditingItem(null);
    setEditingItem(record);
    setIsViewMode(true);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleDelete = (id: number) => {
    deleteSubMachineMaster(id.toString())
      .then(() => { 
        void displayjsx.showSuccess("Record deleted successfully");
        fetchData();
      })
      .catch(() => {
        void displayjsx.showErrorMsg("Failed to delete record");
      });
  };


  const handleSave = (values: ISubMachineMaster) => {
    if (editingItem) {
      // Update existing record
      subMachineMasterAddOrUpdate({
        SubMachineId: editingItem.SubMachineId,
        SubMachineName: values.SubMachineName,
        MachineId:values.MachineId,
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
      subMachineMasterAddOrUpdate({
        SubMachineId: 0,
        SubMachineName: values.SubMachineName,
        MachineId:values.MachineId,
        IsActive: values.IsActive,
        UserId: user?.employeeId,
      })
        .then((response) => {

          let result = response.ReturnValue;

          if(result.EquipmentId == -1){
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
      title: "Sub Machine Name",
      dataIndex: "SubMachineName",
      key: "SubMachineName",
      sorter: (a: any, b: any) =>
        a.EquipmentName.localeCompare(b.EquipmentName),
    },
    {
      title: "Machine Name",
      dataIndex: "MachineId",
      key: "MachineId",
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
      render: (text: any, record: ISubMachineMaster) => (
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
            onConfirm={() => handleDelete(record.SubMachineId!)}
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
      <h2 className="title">Sub-Machine Master</h2>
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
            name="SubMachineName"
            label="Sub Machine Name"
            rules={[{ required: true, message: "Please enter Sub Machine Name" }]}
          >
            <Input type="text" disabled={isViewMode} />
          </Form.Item>

          <Form.Item
                label="Machine Name"
                name="MachineId"
                rules={[{ required: true, message: "Please select Machine Name" }]}
                >
                <Select
                  allowClear
                  disabled={isViewMode}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  placeholder="Select Machine Name"
                  options={[
                    ...(machinesResult?.ReturnValue?.map((machine) => ({
                      label: machine.MachineName,
                      value: machine.MachineId,
                    })) || []),
                    ...(machinesResult?.ReturnValue
                      ? [{ label: "Other", value: -1 }]
                      : []),
                  ]}
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

export default SubMachineMasterPage;
