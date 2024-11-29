import * as React from "react";
import {
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  Upload,
  Select,
  Button,
  InputNumber,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { previewFile } from "../../../api/fileUploadApi";
import { DOCUMENT_LIBRARIES } from "../../../GLOBAL_CONSTANT";
import { toolbarButtons } from "../../editor/Toolbar";
import FroalaEditor from "react-froala-wysiwyg";
const { Option } = Select;

const FormTab: React.FC<any> = ({
  form,
  onFinish,
  initialData,
  isViewMode,
  equipments,
  handleUpload,
  handleRemove,
  fileList,
  technicalOutlineFileList,
  ctiNumber,
  intialFolderName,
  handleOutlineUpload,
  handleOutlineRemove,
  setEditorModel,
  editorModel,
  outlineImageFiles,
  setoutlineImageFiles,
}) => {
  const [model, setModel] = React.useState<string>("");
  const [imageFiles, setImageFiles] = React.useState<any>([]);
  // Handle image insertion
  const handleImageInsert = function (image: any) {
    const newImageFile = image[0].currentSrc; // Get the image source (base64 or blob)
    setImageFiles((prevFiles: any) => [...prevFiles, newImageFile]); // Use the functional update form
    setoutlineImageFiles((prevFiles: any) => [...prevFiles, newImageFile]);
  };

  // Log updated imageFiles after state change
  React.useEffect(() => {
    console.log("Updated image files:", imageFiles);
  }, [imageFiles]); // Run when imageFiles changes

  const myconfig = {
    placeholderText: "Edit your content here...",
    key: "1C%kZV[IX)_SL}UJHAEFZMUJOYGYQE[\\ZJ]RAe(+%$==", // Replace with your Froala key.
    toolbarButtons: isViewMode == true ? [] : toolbarButtons,
    events: {
      "image.inserted": handleImageInsert,
      initialized: function () {
        if (isViewMode) {
          this.edit.off(); // Turn off all editing features
          this.$el.attr("contenteditable", false); // Ensure content is not editable at the DOM level
        }
      },
    },
    attribution: false,
    //imageUpload: false, // Disable auto-upload.
  };

  const handleModelChange = (value: any) => {
    setModel(value);
    setEditorModel(value); // Use the same `value` that was passed to `setModel`
  };

  React.useEffect(() => {
    setModel(editorModel);
  }, [editorModel]);

  return (
    <div>
      {/* Form tab content */}
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialData}
      >
        <Row gutter={1}>
          <Col span={8}>
            <Form.Item
              label="Issue Date"
              name="issueDate"
              rules={[{ required: true }]}
            >
              <DatePicker
                style={{ width: "95%" }}
                disabledDate={(current) =>
                  current && current < dayjs().endOf("day")
                }
                disabled={isViewMode}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Issued By"
              name="issuedBy"
              rules={[{ required: true }]}
            >
              <Input
                style={{ width: "95%" }}
                placeholder="Requestor Name"
                disabled={true}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="CTI Number"
              name="ctiNumber"
              //rules={[{ required: true }]}
            >
              <Input
                style={{ width: "95%" }}
                //value={`CTI-${dayjs().year()}-001`}
                disabled
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={1}>
          <Col span={12}>
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, max: 500 }]}
            >
              <Input.TextArea
                style={{ width: "95%" }}
                maxLength={500}
                placeholder="Enter title"
                disabled={isViewMode}
                rows={3}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Purpose"
              name="purpose"
              rules={[{ required: true, max: 1000 }]}
            >
              <Input.TextArea
                style={{ width: "95%" }}
                maxLength={1000}
                placeholder="Enter purpose"
                disabled={isViewMode}
                rows={3}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={1}>
          <Col span={8}>
            <Form.Item label="Revision No." name="revisionNo">
              <Input style={{ width: "95%" }} disabled={true} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Product Type"
              name="productType"
              rules={[{ required: true, max: 50 }]}
            >
              <Input
                style={{ width: "95%" }}
                maxLength={50}
                placeholder="Enter product type"
                disabled={isViewMode}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Quantity"
              name="quantity"
              rules={[{ required: true }]}
            >
              <InputNumber
                style={{ width: "95%" }}
                //min={0}
                //step={0.01}
                precision={2} // Limit to two decimal places
                placeholder="Enter quantity"
                disabled={isViewMode}
                controls={false} // Hide the up/down buttons
                onBlur={(e) => {
                  const value = Number(e.target.value); // Convert to number
                  if (value < 0) {
                    form.setFieldsValue({ quantity: null });
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={1}>
          <Col span={24}>
            <Form.Item
              label="Outline"
              name="outline"

              //rules={[{ required: true, max: 1000 }]}
            >
              <FroalaEditor
                tag="textarea"
                config={myconfig}
                model={model}
                onModelChange={handleModelChange}
              />
              {/* <Input.TextArea
                style={{ width: "95%" }}
                maxLength={1000}
                placeholder="Enter outline"
                disabled={isViewMode}
                rows={1}
              /> */}
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={1}>
          {/* <Col span={8}>
            <Form.Item
              label="Outline Attachment"
              name="technicalOutlineAttachmentAdd"
            >
              <Upload
                className={isViewMode ? "upload-red-only" : ""}
                style={{ width: "95%" }}
                multiple
                beforeUpload={handleOutlineUpload}
                // onRemove={(file) => {
                //   const newFileList = fileList.filter((f: any) => f.uid !== file.uid);
                //   setFileList(newFileList);
                // }}
                onRemove={handleOutlineRemove}
                maxCount={5}
                disabled={isViewMode}
                fileList={technicalOutlineFileList}
                onPreview={(file) => {
                  if (file.status == "done") {
                    previewFile(
                      file,
                      DOCUMENT_LIBRARIES.Technical_Attachment,
                      `${ctiNumber}`,
                      DOCUMENT_LIBRARIES.Technical_Attachment__Outline_Attachment
                    );
                  } else if (intialFolderName != "") {
                    previewFile(
                      file,
                      DOCUMENT_LIBRARIES.Technical_Attachment,
                      `${intialFolderName}`,
                      DOCUMENT_LIBRARIES.Technical_Attachment__Outline_Attachment
                    );
                  }
                }}
              >
                <Button icon={<UploadOutlined />} disabled={isViewMode}>
                  Upload Document
                </Button>
              </Upload>
            </Form.Item>
          </Col> */}
          <Col span={8}>
            <Form.Item
              label="TIS Applicability Date"
              name="tisApplicabilityDate"
              rules={[{ required: true }]}
            >
              <DatePicker
                style={{ width: "95%" }}
                disabledDate={(current) =>
                  current && current < dayjs().endOf("day")
                }
                disabled={isViewMode}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Target Closure Date "
              name="targetClosureDate"
              rules={[{ required: true }]}
            >
              <DatePicker
                style={{ width: "95%" }}
                disabledDate={(current) =>
                  current && current < dayjs().endOf("day")
                }
                disabled={isViewMode}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Related Document" name="technicalAttachmentAdds">
              <Upload
                className={isViewMode ? "upload-red-only" : ""}
                style={{ width: "95%" }}
                multiple
                beforeUpload={handleUpload}
                // onRemove={(file) => {
                //   const newFileList = fileList.filter((f: any) => f.uid !== file.uid);
                //   setFileList(newFileList);
                // }}
                onRemove={handleRemove}
                maxCount={5}
                disabled={isViewMode}
                fileList={fileList}
                onPreview={(file) => {
                  if (file.status == "done") {
                    previewFile(
                      file,
                      DOCUMENT_LIBRARIES.Technical_Attachment,
                      `${ctiNumber}`,
                      DOCUMENT_LIBRARIES.Technical_Attachment__Related_Document
                    );
                  } else if (intialFolderName != "") {
                    previewFile(
                      file,
                      DOCUMENT_LIBRARIES.Technical_Attachment,
                      `${intialFolderName}`,
                      DOCUMENT_LIBRARIES.Technical_Attachment__Related_Document
                    );
                  }
                }}
              >
                <Button icon={<UploadOutlined />} disabled={isViewMode}>
                  Upload Document
                </Button>
              </Upload>
            </Form.Item>
          </Col>

          {/* <Col span={8}>
            <Form.Item label="Lot.No" name="lotNo">
              <Input
                style={{ width: "95%" }}
                placeholder="Enter Lot.No"
                disabled={isViewMode}
              />
            </Form.Item>
          </Col> */}
        </Row>
        {/* <Row gutter={1}>
          
        </Row> */}

        <h3
          className="primary-color"
          style={{ marginTop: 0, fontSize: "1.125rem" }}
        >
          Application Timing
        </h3>
        <Row gutter={1}>
          <Col span={8}>
            <Form.Item label="Application Date" name="applicationStartDate">
              <DatePicker style={{ width: "95%" }} disabled={isViewMode} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Lot.No"
              name="applicationLotNo"
              //rules={[{ required: true }]}
            >
              <Input
                style={{ width: "95%" }}
                placeholder="Enter Lot.No"
                disabled={isViewMode}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Equipment"
              name="equipmentIds"
              rules={[{ required: true }]}
            >
              <Select
                style={{ width: "95%" }}
                mode="multiple"
                placeholder="Select Equipment"
                allowClear
                disabled={isViewMode}
              >
                {/* Example options; replace with actual master data */}

                {equipments.map(
                  (eq: { EquipmentId: React.Key; EquipmentName: string }) => (
                    <Option key={eq.EquipmentId} value={eq.EquipmentId}>
                      {eq.EquipmentName}
                    </Option>
                  )
                )}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default FormTab;
