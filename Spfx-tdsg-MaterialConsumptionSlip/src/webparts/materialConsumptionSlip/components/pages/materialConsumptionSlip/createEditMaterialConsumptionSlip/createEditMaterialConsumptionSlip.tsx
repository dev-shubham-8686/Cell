import * as React from "react";
import { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  Select,
  Input,
  Button,
  Collapse,
  Spin,
  InputNumber,
  Modal,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import FileUpload from "../../../fileUpload";
import useCategories from "../../../../apis/category/useCategories";
import useMaterials from "../../../../apis/material/useMaterials";
import useUnitsOfMeasure from "../../../../apis/unitOfMeasure/useUnitsOfMeasure";
import useCostCenters from "../../../../apis/costCenter/useCostCenters";
import useCreateEditMaterialConsumptionSlip from "../../../../apis/materialConsumptionSlip/useCreateEditMaterialConsumptionSlip";
import { UserContext } from "../../../../context/userContext";
import { IMaterialConsumptionSlipForm } from "../../../../interface";
import {
  DATE_FORMAT,
  DOCUMENT_LIBRARIES,
  REQUEST_STATUS,
  WEB_URL,
} from "../../../../GLOBAL_CONSTANT";
import { format } from "date-fns";
import CloseModal from "../../../common/CloseModal";
import { WebPartContext } from "../../../../context/webpartContext";
import { renameFolder } from "../../../../utility/utility";
import { IApproverTask } from "../../../../apis/workflow/useGetCurrentApprover/useGetCurrentApprover";

const { TextArea } = Input;

interface ICreateEditMaterialConsumptionSlip {
  setIsFormModified: React.Dispatch<React.SetStateAction<boolean>>;
  currentApproverTask: IApproverTask;
  existingMaterialConsumptionSlip?: IMaterialConsumptionSlipForm;
  mode?: string;
}

const CreateEditMaterialConsumptionSlip: React.FC<
  ICreateEditMaterialConsumptionSlip
> = ({
  currentApproverTask,
  existingMaterialConsumptionSlip,
  mode,
  setIsFormModified,
}) => {
  const webPartContext = React.useContext(WebPartContext);

  const navigate = useNavigate();
  const user = useContext(UserContext);
  const { info, confirm } = Modal;
  const location = useLocation();
  const { isApproverRequest } = location.state || {};
  const { id: paramId } = useParams();
  const id = paramId ? parseInt(paramId) : 0;
  console.log("ISADMIN", user);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setsubmitted] = useState(false);
  const [underAmmendment, setunderAmmendment] = useState(false);
  const [isDepHead, setisDepHead] = useState<boolean>(false);
  const { data: categories, isLoading: categoryIsLoading } = useCategories();
  const { data: materials, isLoading: materialIsLoading } = useMaterials();
  const { data: unitsOfMeasure } = useUnitsOfMeasure();
  const { data: costCenters } = useCostCenters();
  const createUpdateMaterialConsumptionSlip =
    useCreateEditMaterialConsumptionSlip();
  const isModeView = mode === "view" ? true : false;

  const { handleSubmit, control, watch, setValue, formState, getValues } =
    useForm<IMaterialConsumptionSlipForm>({
      defaultValues: existingMaterialConsumptionSlip ?? {
        items: [
          {
            attachments: [],
          },
        ],
      },
      // disabled:
      //   isModeView ||
      //   (submitted && !underAmmendment)
    });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  useEffect(() => {
    if (existingMaterialConsumptionSlip?.isSubmit) {
      setsubmitted(true);
    }
    if (
      existingMaterialConsumptionSlip?.status ==
        REQUEST_STATUS.UnderAmendment &&
      existingMaterialConsumptionSlip.userId == user.employeeId
    ) {
      setunderAmmendment(true);
    }
  }, [existingMaterialConsumptionSlip]);

  useEffect(() => {
    setisDepHead(
      currentApproverTask?.approverTaskId &&
        currentApproverTask?.approverTaskId !== 0 &&
        (currentApproverTask.seqNumber == 1 ||
          currentApproverTask.seqNumber == 2)
    );
  }, [currentApproverTask]);

  const onSubmit = (formData: IMaterialConsumptionSlipForm) => {
    if (!user?.employeeId) return;
    else {
      if (id) {
        confirm({
          title: "Are you sure you want to submit the form ?",
          icon: (
            <ExclamationCircleOutlined
              className="fa-solid fa-circle-exclamation"
              style={{ marginRight: "10px" }}
            />
          ),
          okText: "Yes",
          cancelText: "No",
          okType: "primary",
          okButtonProps: { className: "btn btn-primary" },
          cancelButtonProps: { className: "btn-outline-primary" },
          onOk() {
            console.log("OK clicked");
            createUpdateMaterialConsumptionSlip.mutate(
              {
                ...formData,
                isSubmit: true,
                isAmendReSubmitTask: false,
                userId: user?.employeeId,
              },
              {
                onSuccess(Response: any) {
                  navigate("/", {
                    state: {
                      currentTabState: isApproverRequest
                        ? "myapproval-tab"
                        : "myrequest-tab",
                    },
                  });
                },
              }
            );
          },
          onCancel() {
            console.log("Cancel Clicked");
          },
        });
      } else {
        info({
          title: "Kindly save the form before submitting .",
          icon: (
            <ExclamationCircleOutlined
              className="fa-solid fa-circle-exclamation"
              style={{ marginRight: "10px" }}
            />
          ),
          okText: "OK",
          okType: "primary",
          okButtonProps: { className: "btn btn-primary" },
          onOk() {
            console.log("OK clicked");
            // createUpdateMaterialConsumptionSlip.mutate({
            //   ...formData,
            //   isSubmit: true,
            //   isAmendReSubmitTask: false,
            //   userId: user?.employeeId,
            // });
          },
        });
      }
    }
  };

  const onSave = (formData: IMaterialConsumptionSlipForm) => {
    if (!user?.employeeId) return;
    formData = getValues();

    console.log("FormData", formData);
    console.log("CURRENTAPPROVERTASKBEFORESUBMISSION", currentApproverTask);
    
    createUpdateMaterialConsumptionSlip.mutate(
      {
        ...formData,
        isSubmit: false,
        isAmendReSubmitTask: false,
        userId: user?.employeeId,
        seqNumber: currentApproverTask?.seqNumber ?? 0,
        // seqNumber:(user?.isAdmin || existingMaterialConsumptionSlip?.userId===user?.employeeId) ? 0 :(currentApproverTask?.seqNumber??0)
      },
      {
        onSuccess: (Response: any) => {
          if (mode == "add") {
            void renameFolder(
              DOCUMENT_LIBRARIES.Material_Consumption_SLIP_Attachments,
              WEB_URL,
              webPartContext.spHttpClient,
              "materialConsumptionSlip",
              Response.ReturnValue.MaterialConsumptionSlipNo
            );

            navigate(
              `/form/edit/${Response?.ReturnValue.MaterialConsumptionId}`
            );
          }
          
          setIsFormModified(false);
          console.log("On save Response: ", Response);
        },

        onError: (error) => {
          console.error("Export error:", error);
        },
      }
    );
  };

  const onResubmit = (formData: IMaterialConsumptionSlipForm) => {
    if (!user?.employeeId) return;
    formData = getValues();

    console.log("Resubmit FormData", formData);

    createUpdateMaterialConsumptionSlip.mutate(
      {
        ...formData,
        isSubmit: true,
        isAmendReSubmitTask: true,
        userId: user?.employeeId,
        seqNumber:
          user?.isAdmin ||
          existingMaterialConsumptionSlip?.userId === user?.employeeId
            ? 0
            : currentApproverTask?.seqNumber ?? 0,
      },
      {
        onSuccess(Response: any) {
          navigate("/", {
            state: {
              currentTabState: isApproverRequest
                ? "myapproval-tab"
                : "myrequest-tab",
            },
          });
        },
      }
    );
  };

  const handleClose = () => {
    setIsModalVisible(true);
  };

  const handleCategoryChange = (index: number) => {
    setValue(`items.${index}.materialId`, null);
    setValue(`items.${index}.materialId`, null);
  };

  useEffect(() => {
    // if (createUpdateMaterialConsumptionSlip.isSuccess && id) {
    //   navigate("/",{
    //     state: {
    //       currentTabState: isApproverRequest
    //         ? "myapproval-tab"
    //         : "myrequest-tab",
    //     }});
    // }
  }, [createUpdateMaterialConsumptionSlip.isSuccess]);

  const onValuesChange = () => {
    console.log("FORMCHANGED", formState.isDirty);
    setIsFormModified(formState.isDirty); // To track when the form is modified
  };

  return (
    <div>
      <form onChange={onValuesChange} onSubmit={handleSubmit(onSubmit)}>
        {console.log(
          "CONDITIONS",
          submitted,
          currentApproverTask?.userId,
          user.employeeId
        )}
        <div
          style={{
            position: "absolute",
            right:
              mode !== "view" && currentApproverTask?.userId == user.employeeId
                ? "257px"
                : "40px",
            top:
              mode !== "view" && currentApproverTask?.userId == user.employeeId
                ? "117px"
                : "80px",
          }}
        >
          {mode !== "view" && (
            <div className="d-flex gap-3">
              {mode !== "view" &&
                (user.isAdmin ||
                (!submitted ||
                  (currentApproverTask?.userId == user.employeeId &&
                    currentApproverTask?.seqNumber != 3))) && (
                  <button
                    className="btn btn-primary "
                    type="button"
                    onClick={handleSubmit(onSave)}
                  >
                    <i className="fa-solid fa-floppy-disk " />
                    Save
                  </button>
                )}
              {mode !== "view" && !submitted && (
                <button className="btn btn-darkgrey" type="submit">
                  <i className="fa-solid fa-share-from-square" />
                  Submit
                </button>
              )}
            </div>
          )}
          {underAmmendment && mode != "view" && (
            <button
              className="btn btn-primary"
              type="button"
              onClick={handleSubmit(onResubmit)}
            >
              Resubmit
            </button>
          )}

          {existingMaterialConsumptionSlip?.status ===
            REQUEST_STATUS.Approved &&
            (existingMaterialConsumptionSlip.userId == user.employeeId ||
              existingMaterialConsumptionSlip.cpcDeptHead == user.employeeId) &&
            !isApproverRequest && (
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => handleClose()}
              >
                Close Request
              </button>
            )}
        </div>

        <div className="row">
          <div className="col">
            <div>
              <label>Request No.</label>
              <div className="pt-2">
                <Input
                  className="w-90"
                  disabled
                  value={
                    existingMaterialConsumptionSlip?.materialConsumptionSlipNo ??
                    "-"
                  }
                />
              </div>
            </div>
          </div>
          <div className="col">
            <div>
              <label>Employee Code</label>
              <div className="pt-2">
                <Input
                  className="w-90"
                  disabled
                  value={
                    existingMaterialConsumptionSlip
                      ? existingMaterialConsumptionSlip?.employeeCode
                      : user?.employeeCode
                  }
                />
              </div>
            </div>
          </div>
          <div className="col">
            <div>
              <label>Requestor Name</label>
              <div className="pt-2">
                <Input
                  className="w-90"
                  disabled
                  value={
                    existingMaterialConsumptionSlip
                      ? existingMaterialConsumptionSlip?.requestor
                      : user?.employeeName
                  }
                />
              </div>
            </div>
          </div>
          <div className="col">
            <div>
              <label>Requestor Department</label>
              <div className="pt-2">
                <Input
                  className="w-90"
                  disabled
                  value={
                    existingMaterialConsumptionSlip
                      ? existingMaterialConsumptionSlip?.department
                      : user?.departmentName
                  }
                />
              </div>
            </div>
          </div>
          <div className="col">
            <div>
              <label>Requested Date</label>
              <div className="pt-2">
                <Input
                  className="w-90"
                  disabled
                  value={
                    existingMaterialConsumptionSlip
                      ? existingMaterialConsumptionSlip.createdDate
                      : format(new Date(), DATE_FORMAT)
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {fields.map((field, index) => (
          <Collapse
            defaultActiveKey={[index.toString()]}
            expandIconPosition="end"
            key={field.id}
            className="mt-2rem"
            items={[
              {
                key: index.toString(),
                label: `Item ${index + 1}`,
                children: (
                  <div className="row">
                    <div className="col">
                      <div className="pb-3">
                        <label title="Category">
                          Category <span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="pt-2">
                          <Controller
                            name={`items.${index}.categoryId`}
                            control={control}
                            rules={{
                              required: {
                                value: true,
                                message: "Please select Category",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <>
                                <Select
                                  disabled={
                                    isModeView ||
                                    (!user.isAdmin &&
                                      submitted &&
                                      !underAmmendment)
                                  }
                                  {...field}
                                  options={categories?.map((category) => ({
                                    label: category.name,
                                    value: category.categoryId,
                                  }))}
                                  loading={categoryIsLoading}
                                  className={` custom-disabled-select w-90 ${
                                    error ? "ant-select-status-error" : ""
                                  }`}
                                  onChange={(value) => {
                                    handleCategoryChange(index);
                                    setValue(
                                      `items.${index}.categoryId`,
                                      value,
                                      { shouldValidate: true }
                                    );
                                    // trigger(`items.${index}.categoryId`);
                                  }}
                                />
                                {error && (
                                  <div className="form-field-error">
                                    {error.message}
                                  </div>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>

                      <div className="pb-3">
                        <label title="UOM">UOM</label>
                        <div className="pt-2">
                          <Input
                            className="w-90"
                            disabled
                            value={
                              unitsOfMeasure?.filter(
                                (unitsOfMeasure) =>
                                  unitsOfMeasure.uomid ===
                                  materials?.filter(
                                    (material) =>
                                      material.materialId ===
                                      watch(`items.${index}.materialId`)
                                  )?.[0]?.uom
                              )?.[0]?.name ?? "-"
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <label title="Attachment">Attachment</label>
                        <div className="pt-2">
                          <div>
                            <FileUpload
                              key={`file-upload-${index}`}
                              disabled={
                                isModeView ||
                                (!user.isAdmin && submitted && !underAmmendment)
                              }
                              folderName={
                                watch(
                                  `materialConsumptionSlipNo`
                                )?.toString() ?? "materialConsumptionSlip"
                              }
                              libraryName={
                                DOCUMENT_LIBRARIES.Material_Consumption_SLIP_Attachments
                              }
                              files={watch(`items.${index}.attachments`).map(
                                (a) => ({
                                  ...a,
                                  uid:
                                    a.materialConsumptionSlipItemAttachmentId?.toString() ??
                                    "",
                                  url: `${WEB_URL}${a.url}`,
                                })
                              )}
                              setIsLoading={(loading: boolean) => {
                                setIsLoading(loading);
                              }}
                              isLoading={isLoading}
                              onAddFile={(name: string, url: string) => {
                                setValue(`items.${index}.attachments`, [
                                  ...watch(`items.${index}.attachments`),
                                  {
                                    name,
                                    url,
                                  },
                                ]);
                              }}
                              onRemoveFile={(documentName: string) => {
                                setValue(
                                  `items.${index}.attachments`,
                                  watch(`items.${index}.attachments`).filter(
                                    (document) => document.name !== documentName
                                  )
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="pb-3">
                        <label title="Material Description">
                          Material Description{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                        <div className="pt-2">
                          <Controller
                            name={`items.${index}.materialId`}
                            control={control}
                            rules={{
                              required: {
                                value: true,
                                message: "Please select Material",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <>
                                <Select
                                  disabled={
                                    isModeView ||
                                    (!user.isAdmin &&
                                      submitted &&
                                      !underAmmendment)
                                  }
                                  {...field}
                                  options={materials
                                    ?.filter(
                                      (material) =>
                                        material.category ===
                                        watch(`items.${index}.categoryId`)
                                    )
                                    ?.sort((a, b) =>
                                      a.description.localeCompare(b.description)
                                    )
                                    ?.map((material) => ({
                                      label: material.description,
                                      value: material.materialId,
                                    }))}
                                  loading={materialIsLoading}
                                  className={` custom-disabled-select w-90 ${
                                    error ? "ant-select-status-error" : ""
                                  }`}
                                />
                                {error && (
                                  <div className="form-field-error">
                                    {error.message}
                                  </div>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>

                      <div className="pb-3">
                        <label title="Cost Center">Cost Center</label>
                        <div className="pt-2">
                          <Input
                            className="w-90"
                            disabled
                            value={
                              costCenters?.filter(
                                (costCenter) =>
                                  costCenter.costCenterId ===
                                  materials?.filter(
                                    (material) =>
                                      material.materialId ===
                                      watch(`items.${index}.materialId`)
                                  )?.[0]?.costCenter
                              )?.[0]?.name ?? "-"
                            }
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="pb-3">
                        <label title="Material No">
                          Material No. <span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <div className="pt-2">
                          <Controller
                            name={`items.${index}.materialId`}
                            control={control}
                            rules={{
                              required: {
                                value: true,
                                message: "Please select Material",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <>
                                <Select
                                  labelRender={(value: any) =>
                                    value.label ?? "-"
                                  }
                                  disabled={
                                    isModeView ||
                                    (!user.isAdmin &&
                                      submitted &&
                                      !underAmmendment)
                                  }
                                  {...field}
                                  options={materials
                                    ?.filter(
                                      (material) =>
                                        material.category ===
                                          watch(`items.${index}.categoryId`) &&
                                        material.code
                                    )
                                    ?.map((material) => ({
                                      label: material.code
                                        ? material.code
                                        : "-",
                                      value: material.materialId,
                                    }))}
                                  loading={materialIsLoading}
                                  className={` custom-disabled-select w-90 ${
                                    error ? "ant-select-status-error" : ""
                                  }`}
                                />
                                {error && (
                                  <div className="form-field-error">
                                    {error.message}
                                  </div>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>

                      <div className="pb-3">
                        <label title="GL Code">GL Code </label>
                        <div className="pt-2">
                          <Controller
                            name={`items.${index}.glCode`}
                            control={control}
                            rules={{
                              maxLength: {
                                value: 50,
                                message:
                                  "GL Code should not be more then 50 character",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <>
                                <Input
                                  disabled={
                                    isModeView ||
                                    (!user.isAdmin &&
                                      submitted &&
                                      !underAmmendment &&
                                      !isDepHead)
                                  }
                                  maxLength={50}
                                  {...field}
                                  className={`w-90 ${
                                    error ? "ant-input-status-error" : ""
                                  }`}
                                />
                                {error && (
                                  <div className="form-field-error">
                                    {error.message}
                                  </div>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="pb-3">
                        <label title="Quantity">
                          Quantity. <span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <div className="pt-2">
                          <Controller
                            name={`items.${index}.quantity`}
                            control={control}
                            rules={{
                              required: {
                                value: true,
                                message: "Please enter Quantity",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <>
                                <InputNumber
                                  changeOnWheel={false}
                                  controls={false}
                                  disabled={
                                    isModeView ||
                                    (!user.isAdmin &&
                                      submitted &&
                                      !underAmmendment)
                                  }
                                  {...field}
                                  onChange={(value) => {
                                    if (parseFloat(value) <= 0) {
                                      field.onChange(null);
                                    } else {
                                      field.onChange(value);
                                    }
                                  }}
                                  precision={2}
                                  className={`custom-disabled-input w-90 ${
                                    error ? "ant-input-number-status-error" : ""
                                  }`}
                                />
                                {error && (
                                  <div className="form-field-error">
                                    {error.message}
                                  </div>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>

                      <div className="pb-3">
                        <label title="Purpose">
                          Purpose <span style={{ color: "red" }}>*</span>{" "}
                        </label>
                        <div className="pt-2">
                          <Controller
                            name={`items.${index}.purpose`}
                            control={control}
                            rules={{
                              required: {
                                value: true,
                                message: "Please enter Purpose",
                              },
                              maxLength: {
                                value: 1000,
                                message:
                                  "GL Code should not be more then 1000 character",
                              },
                            }}
                            render={({ field, fieldState: { error } }) => (
                              <>
                                <TextArea
                                  disabled={
                                    isModeView ||
                                    (!user.isAdmin &&
                                      submitted &&
                                      !underAmmendment)
                                  }
                                  maxLength={1000}
                                  rows={4}
                                  {...field}
                                  className={`w-90 ${
                                    error ? "ant-input-status-error" : ""
                                  }`}
                                />
                                {error && (
                                  <div className="form-field-error">
                                    {error.message}
                                  </div>
                                )}
                              </>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ),
                extra:
                  (mode === "add" && (index != 0)) ||
                  ((index != 0 || user.isAdmin) &&
                  !(mode == "view") &&
                  (user.isAdmin ||
                    (submitted
                      ? underAmmendment &&
                        existingMaterialConsumptionSlip?.userId ==
                          user.employeeId
                      : existingMaterialConsumptionSlip?.userId ==
                        user.employeeId))) ? (
                    <FontAwesomeIcon
                      onClick={() => {
                        remove(index);
                      }}
                      icon={faTrash}
                      className="text-danger mr-4"
                    />
                  ) : null,
              },
            ]}
          />
        ))}
        {console.log("ID", id)}
        {mode != "view" &&
          (user.isAdmin ||
            ((!submitted || underAmmendment) &&
              existingMaterialConsumptionSlip?.userId == user.employeeId) ||
            id === 0) && (
            <Button
              className="mt-2rem"
              type="dashed"
              onClick={() =>
                append({
                  glCode: "",
                  purpose: "",
                  quantity: "",
                  attachments: [],
                })
              }
              block
            >
              + Add Item
            </Button>
          )}

        <div className="pb-3 mt-3">
          <label title="Remarks">Remarks</label>
          <div className="pt-2">
            <Controller
              // rules={{
              //   required: {
              //     value: true,
              //     message: "Please Enter Remarks",
              //   },
              // }}
              name="remarks"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <TextArea
                    disabled={
                      isModeView ||
                      (!user.isAdmin &&
                        submitted &&
                        !underAmmendment &&
                        !isDepHead)
                    }
                    maxLength={1000}
                    rows={4}
                    {...field}
                    className={`w-100 ${error ? "ant-input-status-error" : ""}`}
                  />
                  {error && (
                    <div className="form-field-error">{error.message}</div>
                  )}
                </>
              )}
            />
          </div>
        </div>
      </form>

      <Spin
        spinning={createUpdateMaterialConsumptionSlip.isLoading}
        fullscreen
      />

      <CloseModal
        setmodalVisible={setIsModalVisible}
        visible={isModalVisible}
      />
    </div>
  );
};

export default CreateEditMaterialConsumptionSlip;
