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
import { useGetSectionMaster } from "../../../apis/mastermanagementAPIs/sectionMaster/useGetSectionMaster";
import useAddOrUpdateSection from "../../../apis/mastermanagementAPIs/sectionMaster/useAddOrUpdateSection";
import useDeleteSectionMaster from "../../../apis/mastermanagementAPIs/sectionMaster/useDeleteSection";
import Page from "../../page/page";
import { scrollToElementsTop } from "../../../utility/utility";

interface ISectionMaster {
  SectionId: number;
  SectionName?: string;
  CreatedDate?: string;
  CreatedBy?: number;
  ModifiedBy?: number;
  ModifiedDate?: string;
  IsActive?: boolean;
}

const SectionMasterPage: React.FC = () => {
  // const [data, setData] = useState<ISectionMaster[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] =
    useState<ISectionMaster | null>(null);
  const [form] = Form.useForm();
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  const user: IUser = useContext(UserContext);
  const { data: data, isLoading: SectionLoading,refetch } =
  useGetSectionMaster();
  const { mutate: sectionMasterAddOrUpdate, isLoading: addingMachine } =
  useAddOrUpdateSection();
  const { mutate: deleteSectionMaster, isLoading: deletingMachine } =
  useDeleteSectionMaster();

  // const fetchData = () => {
  //   setLoading(true);
  //   getAllSectionMaster()
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

  const handleEdit = (record: ISectionMaster) => {
    setEditingItem(null);
    setIsViewMode(false);
    setEditingItem(record);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleView = (record: ISectionMaster) => {
    setEditingItem(null);
    setEditingItem(record);
    setIsViewMode(true);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleDelete = (id: number) => {
    // getEquipmentMasterTblDelete(id.toString())
    //   .then(() => {
    //     void displayjsx.showSuccess("Record Inactivated successfully");
    //     fetchData();
    //   })
    //   .catch(() => {
    //     void displayjsx.showErrorMsg("Failed to Inactivate record");
    //   });
  };


  const handleSave = (values: ISectionMaster) => {
    if (editingItem) {
      // Update existing record
      sectionMasterAddOrUpdate({
        SectionId: editingItem.SectionId,
        SectionName: values.SectionName,
        IsActive: values.IsActive,
        ModifiedBy:user?.employeeId
      },{
        onSuccess: async (Response: any) => {
          console.log("ONSUBMIT RES", Response);
          setModalVisible(false);
           let result = Response?.ReturnValue;
          
                      if (result.SectionId == -1) {
                        void displayjsx.showInfo("Duplicate record found");
                        return false;
                      }
         await refetch();
        },
        onError: (error) => {
          console.error("On submit error:", error);
        },
      })
        
    } else {
      // Create new record
      sectionMasterAddOrUpdate({
        SectionId: 0,
        SectionName: values.SectionName,
        IsActive: values.IsActive,
        CreatedBy: user?.employeeId,
      },{
        onSuccess: async (Response: any) => {
          console.log("ONSUBMIT RES", Response);
          setModalVisible(false);
             let result = Response?.ReturnValue;
          
                      if (result.SectionId == -1) {
                        void displayjsx.showInfo("Duplicate record found");
                        return false;
                      }
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
      title: "Section Name",
      dataIndex: "SectionName",
      key: "SectionName",
      sorter: (a: any, b: any) =>
        a.SectionName.localeCompare(b.SectionName),
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
      render: (text: any, record: ISectionMaster) => (
        <span className="">
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
        {record?.IsActive &&
          <Popconfirm
            title="Are you sure to inactivate this record?"
            onConfirm={() => handleDelete(record.SectionId!)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ disabled: isViewMode , className:"btn btn-primary"}}
            cancelButtonProps={{ className:"btn btn-outline-primary"}}

          >
            <Button
              title="Delete"
              className="action-btn"
              style={{ background: "none", border: "none" }}

              icon={<FontAwesomeIcon title="Delete" icon={faTrash} />}
              //onClick={() => handleDelete(record.EquipmentId)}
            />
          </Popconfirm>}
        </span>
      ),
    },
  ];

  return (
    <Page title="Section Master">
    <div className="content flex-grow-1 p-4">
  <div className="d-flex justify-content-between items-center mb-3">
        <div>
                  <button
                    className="btn btn-link btn-back px-0"
                    type="button"
                    onClick={() => navigate(`/master`)}
                  >
                    <FontAwesomeIcon
className="me-2"
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
            name="SectionName"
            label="Section Name"
            rules={[{ required: true, message: "Please enter Section Name" },
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

export default SectionMasterPage;
