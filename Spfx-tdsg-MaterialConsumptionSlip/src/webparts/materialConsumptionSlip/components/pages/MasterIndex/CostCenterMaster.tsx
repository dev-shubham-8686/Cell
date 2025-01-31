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
import { UserContext } from "../../../context/userContext";
import useUnitsOfMeasure from "../../../apis/unitOfMeasure/useUnitsOfMeasure";
import displayjsx from "../../../utility/displayjsx";
import {
  costCenterMasterAddOrUpdate,
  getAllCostCenterMaster,
} from "../../../apis/MasterAPIs/CostCenterMaster";
import Page from "../../page/page";
interface IConstCenterMaster {
  CostCenterId: number;
  CostCenterName: string;
  CreatedDate?: string;
  CreatedBy?: number;
  ModifiedBy?: number;
  ModifiedDate?: string;
  IsActive?: boolean;
}

const CostCenterMasterPage: React.FC = () => {
  const [data, setData] = useState<IConstCenterMaster[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<IConstCenterMaster | null>(
    null
  );
  const [form] = Form.useForm();
  const user = useContext(UserContext);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  //   const { data: unitsOfMeasure , isLoading:UOMLoading} = useUnitsOfMeasure();

  const fetchData = () => {
    setLoading(true);
    getAllCostCenterMaster()
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

  const handleEdit = (record: IConstCenterMaster) => {
    setEditingItem(null);
    setIsViewMode(false);
    setEditingItem(record);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleView = (record: IConstCenterMaster) => {
    setEditingItem(null);
    setEditingItem(record);
    setIsViewMode(true);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  //   const handleDelete = (id: number) => {
  //     deleteCostCenterMaster(id.toString())
  //       .then(() => {
  //         void displayjsx.showSuccess("Record deleted successfully");
  //         fetchData();
  //       })
  //       .catch(() => {
  //         void displayjsx.showErrorMsg("Failed to delete record");
  //       });
  //   };

  const handleSave = (values: IConstCenterMaster) => {
    if (editingItem) {
      costCenterMasterAddOrUpdate({
        CostCenterId: editingItem.CostCenterId,
        CostCenterName: values.CostCenterName,
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
      costCenterMasterAddOrUpdate({
        CostCenterId: 0,
        CostCenterName: values.CostCenterName,
        IsActive: values.IsActive,
        CreatedBy: user?.employeeId,
      })
        .then((response) => {
          let result = response.ReturnValue;

          if (result.CostCenterId == -1) {
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
      title: "Cost Center Name",
      dataIndex: "CostCenterName",
      key: "CostCenterName",
      sorter: (a: any, b: any) =>
        a.CostCenterName.localeCompare(b.CostCenterName),
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
      dataIndex: "CreatedByName",
      key: "CreatedByName",
      render: (text:any) => {
        return <p className="text-cell">{text??"-"}</p>;
      },
      sorter: (a: any, b: any) =>
        a.CreatedByName.localeCompare(b.CreatedByName)
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
      dataIndex: "ModifiedByName",
      key: "ModifiedByName",
      render: (text:any) => {
        return <p className="text-cell">{text??"-"}</p>;
      },
      sorter: (a: any, b: any) =>
        a.ModifiedByName.localeCompare(b.ModifiedByName)
    },
    {
      title: "Actions",
      key: "actions",
      render: (text: any, record: IConstCenterMaster) => (
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
          {/* <Popconfirm
            title="Are you sure to delete this record?"
            onConfirm={() => handleDelete(record.CostCenterId!)}
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
    <Page title="Cost-Center Master">
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

        <div >
          <Button
            type="primary"
            className="btn btn-primary"
            onClick={handleAdd}
          >
            Add New
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
      </div>
      <Modal
        title={isViewMode?"View Item":editingItem ? "Edit Item" : "Add Item"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => !isViewMode && form.submit()}
        okButtonProps={{ disabled: isViewMode, className: "btn btn-primary" }}
        cancelButtonProps={{ className: "btn btn-outline-primary" }}
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
          initialValues={{ CostCenterName: "", IsActive: false }}
        >
          <Form.Item
            name="CostCenterName"
            label="Cost Center Name"
            rules={[
              { required: true, message: "Please enter Cost Center Name" },
            ]}
          >
            <Input type="text" disabled={isViewMode} />
          </Form.Item>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Form.Item
              name="IsActive"
              valuePropName="checked"
              style={{ marginBottom: 0 }}
              className="btn-outline-primary"
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

export default CostCenterMasterPage;
