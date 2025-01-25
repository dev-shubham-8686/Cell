import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Modal, Form, Input, Checkbox, Popconfirm } from "antd";

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
import { IUser, UserContext } from "../../../context/userContext";
import { useGetMachineMaster } from "../../../apis/mastermanagementAPIs/machineMaster/useGetMachineMaster";
import useAddOrUpdateMachine from "../../../apis/mastermanagementAPIs/machineMaster/useAddOrUpdateMachine";
import useDeleteMachineMaster from "../../../apis/mastermanagementAPIs/machineMaster/useDeleteMachine";
import Page from "../../page/page";

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
  // const [data, setData] = useState<IMachineMaster[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] =
    useState<IMachineMaster | null>(null);
  const [form] = Form.useForm();
  const user: IUser = useContext(UserContext);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  const { data: data, isLoading: MachineLoading,refetch } =
    useGetMachineMaster();
    const { mutate: machineMasterAddOrUpdate, isLoading: addingMachine } =
    useAddOrUpdateMachine();
    const { mutate: deleteMachineMaster, isLoading: deletingMachine } =
    useDeleteMachineMaster();

  // const fetchData = () => {
  //   setLoading(true);
  //   getAllMachineMaster()
  //     .then((response) => {
  //       setLoading(false);
  //       setData(response.ReturnValue);
  //     })
  //     .catch(() => {
  //       void displayjsx.showErrorMsg("Error fetching data");
  //       setLoading(false);
  //     });
  // };

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
    deleteMachineMaster(id.toString(),{
      onSuccess:async (Response: any) => {
        console.log("ondelete RES", Response);
        await refetch();
      },
      onError: (error) => {
        console.error("ondelete error:", error);
      },
    })
  };


  const handleSave = (values: IMachineMaster) => {
    if (editingItem) {
      // Update existing record
      machineMasterAddOrUpdate({
        MachineId: editingItem.MachineId,
        MachineName: values.MachineName,
        IsActive: values.IsActive,
        UserId: user?.employeeId,
      },{
        onSuccess:async (Response: any) => {
          console.log("ONSUBMIT RES", Response);
          setModalVisible(false);
          await refetch();
        },
        onError: (error) => {
          console.error("On submit error:", error);
        },
      });
    } else {
      // Create new record
      machineMasterAddOrUpdate({
        MachineId: 0,
        MachineName: values.MachineName,
        IsActive: values.IsActive,
        UserId: user?.employeeId,
      },{
        onSuccess:async (Response: any) => {
          console.log("ONSUBMIT RES", Response);
          setModalVisible(false);
          await refetch();
        },
        onError: (error) => {
          console.error("On submit error:", error);
        },
      })
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const columns = [
    {
      title: "Machine Name",
      dataIndex: "MachineName",
      key: "MachineName",
      sorter: (a: any, b: any) =>
        a.MachineName.localeCompare(b.MachineName),
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
            style={{ background: "none", border: "none" }}

            icon={<FontAwesomeIcon title="View" icon={faEye} />}
            onClick={() => handleView(record)}
          />

          <Button
            title="Edit"
            className="action-btn"
            style={{ background: "none", border: "none" }}

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
              style={{ background: "none", border: "none" }}

              icon={<FontAwesomeIcon title="Delete" icon={faTrash} />}
              //onClick={() => handleDelete(record.EquipmentId)}
            />
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <Page title="Machine Master">
    <div className="content flex-grow-1 p-4">
  <div className="d-flex justify-content-between items-center mb-3">
        <div>
                  <button
                    className="btn btn-link btn-back"
                    type="button"
                    onClick={() => navigate(`/master`)}
                  >
                    <FontAwesomeIcon
                      style={{ marginRight: "5px" }}
                      icon={faCircleChevronLeft}
                    />
                    Back
                  </button>
                </div>
                <div>
                  <Button
                    type="primary"
                    className="btn btn-primary"
                    onClick={handleAdd}
                  >
                    Add Item
                  </Button>
                </div>
      </div>
      <div className="table-container pt-0">

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
      </div>
      <Modal
        title={isViewMode?"View Item":editingItem ? "Edit Item" : "Add Item"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => !isViewMode && form.submit()}
        okButtonProps={{ disabled: isViewMode , className:"btn btn-primary"}}
        cancelButtonProps={{ className:"btn btn-outline-primary"}}
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
    </Page>
  );
};

export default MachineMasterPage;
