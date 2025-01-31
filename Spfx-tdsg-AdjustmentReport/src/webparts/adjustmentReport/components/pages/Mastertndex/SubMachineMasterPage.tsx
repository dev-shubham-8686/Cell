import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Checkbox, Popconfirm, Select } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft, faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
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
import Page from "../../page/page";
import { IMachineMaster } from "./MachineMasterPage";
import { IMachine } from "../../../api/GetAllMachines.api";
import { scrollToElementsTop } from "../../../utils/utility";

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
        void displayjsx.showSuccess("Record Inactivated successfully");
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
        ModifiedBy:user?.employeeId
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
        CreatedBy: user?.employeeId,
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
      width:"400px",
      sorter: (a: any, b: any) =>
        a.SubMachineName.localeCompare(b.SubMachineName),
    },
    {
      title: "Machine Name",
      dataIndex: "MachineId",
      key: "MachineId",
      sorter: (a: any, b: any) =>{
        debugger
        console.log("DATA",a,b)
        const machineA = machinesResult?.ReturnValue.find(
          (m: IMachine) => m.MachineId === a.MachineId
        )?.MachineName || "";
        const machineB = machinesResult?.ReturnValue.find(
          (m: IMachine) => m.MachineId === b.MachineId
        )?.MachineName || "";
    
        return machineA.localeCompare(machineB);
      },
      render: (MachineId: number, record: any) => {
        const machine = machinesResult?.ReturnValue.find(
          (m: IMachine) => m.MachineId === MachineId
        );
        return machine?.MachineName || "-"; // Show MachineName or fallback to "Unknown Machine"
      },
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
          {CreatedDate ? dayjs(CreatedDate).format("DD-MM-YYYY") : "-"}
        </span>
      ),
      sorter: (a: any, b: any) =>
        dayjs(a.CreatedDate).unix() - dayjs(b.CreatedDate).unix(),
    },
    {
      title: "Created By",
      dataIndex: "CreatedByName",
      key: "CreatedByName",
      render: (text) => {
        return <p className="text-cell">{text??"-"}</p>;
      },
      sorter: (a: any, b: any) =>
        {
          console.log("DATA",a,b);
          return (a.CreatedByName || "").localeCompare(b.CreatedByName || "");
      },
    },
    {
      title: "Modified Date",
      dataIndex: "ModifiedDate",
      key: "ModifiedDate",
      render: (ModifiedDate: string) => (
        <span>
          {ModifiedDate ? dayjs(ModifiedDate).format("DD-MM-YYYY") : "-"}
        </span>
      ),
      sorter: (a: any, b: any) =>
        dayjs(a.ModifiedDate).unix() - dayjs(b.ModifiedDate).unix(),
    },
    {
      title: "Modified By",
      dataIndex: "ModifiedByName",
      key: "ModifiedByName",
      render: (text) => {
        return <p className="text-cell">{text??"-"}</p>;
      },
      sorter: (a: any, b: any) =>
        {
          console.log("DATA",a,b);
          return (a.ModifiedByName || "").localeCompare(b.ModifiedByName || "");
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: ISubMachineMaster) => (
        <span className="">
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
            title="Are you sure to inactivate this record?"
            onConfirm={() => handleDelete(record.SubMachineId!)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ disabled: isViewMode , className:"btn btn-primary"}}
            cancelButtonProps={{ className:"btn btn-outline-primary"}}
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
    <Page title="Sub-Machine Master">
      <div className="content flex-grow-1 p-4">
        <div className="d-flex justify-content-between items-center mb-3">
      <button
            className="btn btn-link btn-back"
            type="button"
            onClick={() => navigate(`/master`)}
          >
            <FontAwesomeIcon
            className="me-2"
              icon={faCircleChevronLeft}
            />
            Back
          </button>
        <Button type="primary" onClick={handleAdd}>
          Add New
        </Button>
      </div>
      <div className="table-container pt-0">

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
      //   pagination={{ pageSize: 10, 
      //     showTotal: () => (
      //    <div className="d-flex align-items-center gap-3">
      //      <span style={{ marginRight: "auto" }}>
      //        Total {data.length} items
      //      </span>
      //    </div>
      //  ), }}
      pagination={{
        onChange:()=>{
          scrollToElementsTop("table-container");
        },
       
        showTotal: (total, range) => (
          <div className="d-flex align-items-center gap-3">
            <span style={{ marginRight: "auto" }}>
              Showing {range[0]}-{range[1]} of {total} items
            </span>

           
          </div>
        ),
        itemRender: (_, __, originalElement) => originalElement,
      }}
      />
      </div>
      <Modal
        title={isViewMode?"View Item":editingItem ? "Edit Item" : "Add Item"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => !isViewMode && form.submit()}
        okButtonProps={{ disabled: isViewMode , className:"btn btn-primary"}}
        cancelButtonProps={{ className:"btn btn-outline-primary"}} 
        footer={
          isViewMode
            ? null 
            : undefined 
        }
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
            rules={[{ required: true, message: "Please enter Sub Machine Name" },
              {
                validator: (_, value) => {
                  if (value && value.trim() === "") {
                    return Promise.reject(new Error("Only spaces are not allowed"));
                  }
                  return Promise.resolve();
                },
              },
            ]}
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
    </Page>
  );
};

export default SubMachineMasterPage;
