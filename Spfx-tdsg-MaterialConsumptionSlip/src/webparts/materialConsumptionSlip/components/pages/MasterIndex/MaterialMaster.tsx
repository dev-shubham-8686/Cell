import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Checkbox, Select, Input, Popconfirm } from "antd";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronLeft, faEdit, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../../../context/userContext";
import {
  //CloseOutlined,
  LeftCircleFilled,
  //SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import useCategories from "../../../apis/category/useCategories";
import useMaterials from "../../../apis/material/useMaterials";
import useUnitsOfMeasure from "../../../apis/unitOfMeasure/useUnitsOfMeasure";
import useCostCenters from "../../../apis/costCenter/useCostCenters";
import displayjsx from "../../../utility/displayjsx";
import { ICostCenter } from "../../../apis/costCenter/useCostCenters/useCostCenters";
import { addUpdateMaterialMaster, deleteMaterial, getAllMaterialMaster } from "../../../apis/MasterAPIs/MaterialMaster";
import { getAllUOMMaster } from "../../../apis/MasterAPIs/UOMMaster";
import { categoryMasterAddOrUpdate, deleteCategoryMaster, getAllCategoryMaster } from "../../../apis/MasterAPIs/CategoryMaster";
import Page from "../../page/page";

export interface Material {
  MaterialId: number;
  Code?: string;
  Description?: number;
  Category?: number;
  UOM?: number;
  CostCenter?: number;
  CreatedDate?: string;
  CreatedBy?: number;
  ModifiedBy?: number;
  ModifiedDate?: string;
  IsActive?: boolean;
}

const MaterialMasterPage: React.FC = () => {
  const [data, setData] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Material | null>(null);
  const [form] = Form.useForm();
  const user = React.useContext(UserContext);
  const [isViewMode, setIsViewMode] = useState<boolean>(false);
  const [CostCenter, SetCostCenter] = useState([]);
  const [Category, SetCategory] = useState([]);
  const [UOM, SetUOM] = useState([]);
//   const { data: categories, isLoading: categoryIsLoading } = useCategories();
//   const { data: materials, isLoading: materialIsLoading } = useMaterials();
//   const { data: unitsOfMeasure } = useUnitsOfMeasure();
  const { data: costCenters } = useCostCenters();
  const fetchData = () => {
    setLoading(true);
    getAllMaterialMaster()
    .then((response) => {
      setLoading(false);
      setData(response?.ReturnValue);
    })
    .catch(() => {
      void displayjsx.showErrorMsg("Error fetching data");
      setLoading(false);
    });

    getAllUOMMaster()
       .then((response) => {
   SetUOM(response?.ReturnValue);
       })
       .catch(() => {
         void displayjsx.showErrorMsg("Error fetching data");
         setLoading(false);
       });

    // getAllCostCenterSelection()
    //   .then((response) => {
        SetCostCenter(costCenters);
    //   })
    //   .catch(() => {
    //     void displayjsx.showErrorMsg("Error fetching data");
    //     setLoading(false);
    //   });

     getAllCategoryMaster()
       .then((response) => {
   SetCategory(response?.ReturnValue);
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

  const handleEdit = (record: Material) => {
    setEditingItem(null);
    setIsViewMode(false);
    setEditingItem(record);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleView = (record: Material) => {
    setEditingItem(null);
    setEditingItem(record);
    setIsViewMode(true);
    setModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleDelete = (id: number) => {
    deleteMaterial(id.toString())
      .then(() => {
        void displayjsx.showSuccess("Record deleted successfully");
        fetchData();
      })
      .catch(() => {
        void displayjsx.showErrorMsg("Failed to delete record");
      });
  };

  const handleSave = (values: Material) => {
    if (editingItem) {
      // Update existing record
      addUpdateMaterialMaster({
        MaterialId: editingItem.MaterialId,
        Code: values.Code,
        Description: values.Description,
        Category: values.Category,
        UOM: values.UOM,
        CostCenter: values.CostCenter,
        IsActive: values.IsActive,
        CreatedBy: user?.employeeId,
        ModifiedBy: user?.employeeId,
      })
        .then((response) => {
          let result = response.ReturnValue;

          if (result.MaterialId == -1) {
            void displayjsx.showInfo("Duplicate record found");
            return false;
          }

          void displayjsx.showSuccess("Record updated successfully");

          fetchData();
          setModalVisible(false);
        })
        .catch(() => {
          void displayjsx.showErrorMsg("Failed to update record");
        });
    } else {
      // Create new record
      addUpdateMaterialMaster({
        MaterialId: 0,
        Code: values.Code,
        Description: values.Description,
        Category: values.Category,
        UOM: values.UOM,
        CostCenter: values.CostCenter,
        IsActive: values.IsActive,
        CreatedBy: user?.employeeId,
        ModifiedBy: user?.employeeId,
      })
        .then((response) => {
          let result = response.ReturnValue;

          if (result.MaterialId == -1) {
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
console.log("UOMS",UOM)
  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      title: "Code",
      dataIndex: "Code",
      key: "Code",
      sorter: (a: any, b: any) => a.Code.localeCompare(b.Code),
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
      sorter: (a: any, b: any) => a.Description.localeCompare(b.Description),
    },
    {
      title: "Is Active",
      dataIndex: "IsActive",
      key: "IsActive",
      render: (IsActive: boolean) => (IsActive ? "Yes" : "No"), // Display Yes/No for IsActive
      sorter: (a: any, b: any) => a.IsActive - b.IsActive,
    },
    {
      title: "UOM",
      dataIndex: "UOM",
      key: "UOM",
      // render: (UOM:any) => (UOM ? UOM : "-"), // Display Yes/No for IsActive
      sorter: (a: any, b: any) => a.UOM - b.UOM,
      render: ( value: any) => {
        
        const uom = UOM?.find(
          (m: any) => m.UOMId === value
        );
        return uom?.UOMName || "-"; // Show MachineName or fallback to "Unknown Machine"
      }
    },
    {
      title: "Category",
      dataIndex: "Category",
      key: "Category",
      // render: (Category: boolean) => (Category ? Category : "-"), // Display Yes/No for IsActive
      sorter: (a: any, b: any) => a.Category - b.IsCategoryActive,
      render: ( value: any) => {
        
        const category = Category?.find(
          (m: any) => m.CategoryId === value
        );
        return category?.CategoryName || "-"; // Show MachineName or fallback to "Unknown Machine"
      }
    },
    {
      title: "CostCenter",
      dataIndex: "CostCenter",
      key: "CostCenter",
      // render: (CostCenter: boolean) => (CostCenter ? CostCenter : "-"), // Display Yes/No for IsActive
      sorter: (a: any, b: any) => a.CostCenter - b.CostCenter,
      render: ( value: any) => {
        
        const costcenter = costCenters?.find(
          (m: any) => m.costCenterId === value
        );
        return costcenter?.name || "-"; // Show MachineName or fallback to "Unknown Machine"
      }
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
      render: (text: any, record: Material) => (
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
            title="Are you sure to delete this record?"
            onConfirm={() => handleDelete(record.MaterialId!)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{className:"btn btn-primary"}}
            cancelButtonProps={{className:"btn btn-outline-primary"}}
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
    <Page title="Material Master">
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
        <Button type="primary"
                  className="btn btn-primary"
                  onClick={handleAdd}>
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
          initialValues={{
            IsActive: false,
          }}
        >
          <Form.Item
            name="Code"
            label="Code"
            rules={[{ required: true, message: "Please enter Code" }]}
          >
            <Input type="text" disabled={isViewMode} />
          </Form.Item>
          <Form.Item
            name="Description"
            label="Description"
            rules={[{ required: true, message: "Please enter Description" }]}
          >
            <Input type="text" disabled={isViewMode} />
          </Form.Item>
          {/* Employee Dropdown */}
          <Form.Item
            name="Category"
            label="Category"
            rules={[{ required: true, message: "Please select an Category" }]}
          >
            <Select
              placeholder="Select an Category"
              disabled={isViewMode}
              options={Category?.map((emp: any) => ({
                label: emp.CategoryName,
                value: emp.CategoryId,
              }))}
            />
          </Form.Item>
          <Form.Item
            name="UOM"
            label="UOM"
            rules={[{ required: true, message: "Please select an UOM" }]}
          >
            <Select
              placeholder="Select an UOM"
              disabled={isViewMode}
              options={UOM?.map((val: any) => ({
                label: val.UOMName,
                value: val.UOMId,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="CostCenter"
            label="CostCenter"
            rules={[{ required: true, message: "Please select an CostCenter" }]}
          >
            <Select
              placeholder="Select an CostCenter"
              disabled={isViewMode}
              options={costCenters?.map((sec: ICostCenter) => ({
                label: sec.name,
                value: sec.costCenterId,
              }))}
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

export default MaterialMasterPage;
