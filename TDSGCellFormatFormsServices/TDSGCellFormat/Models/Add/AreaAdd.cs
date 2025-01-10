namespace TDSGCellFormat.Models.Add
{
    public class AreaAdd
    {
        public string areaName {  get; set; }
    }

    public class UnitOfMeasureAdd
    {
        public string name { get; set; }

        public int? createdBy { get; set; }
    }

    public class UnitOfMeasureUpdate
    {
        public int uomId { get; set; }
        public string name { get; set; }

        public int? modifiedBy { get; set; }
    }

    #region Master Table Add Models

    

    public class CategoryAdd
    {
        public int CategoryId { get; set; }

        public string? Name { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }

    public class UnitOfMeasureDtoAdd
    {
        public int UOMId { get; set; }

        public string? Name { get; set; }

        public int? CreatedBy { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public bool? IsActive { get; set; }
    }

    public class CellDivisionRoleMasterAdd
    {
        public int CellDivisionId { get; set; }

        public int? DivisionId { get; set; }

        public string? FormName { get; set; }

        public int? Head { get; set; }

        public int? DeputyDivisionHead { get; set; }

        public bool? IsActive { get; set; }
    }

    public class CPCGroupMasterAdd
    {
        public int CPCGroupId { get; set; }

        public int? EmployeeId { get; set; }

        public string? Email { get; set; }

        public string? EmployeeName { get; set; }

        public bool? IsActive { get; set; }
    }

    public class DeviceAdd
    {
        public int DeviceId { get; set; }

        public string? DeviceName { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }

    public class SubDeviceAdd
    {
        public int SubDeviceId { get; set; }

        public int? DeviceId { get; set; }

        public string? SubDeviceName { get; set; }

        public bool IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }

    public class EquipmentMasterAdd
    {
        public int EquipmentId { get; set; }

        public string? EquipmentName { get; set; }

        public int? CreatedBy { get; set; }

        public bool IsActive { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }

    public class MachineAdd
    {
        public int MachineId { get; set; }

        public string? MachineName { get; set; }

        public int? CreatedBy { get; set; }

        public bool IsDeleted { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }

    public class SubMachineAdd
    {
        public int SubMachineId { get; set; }

        public int? MachineId { get; set; }

        public string? SubMachineName { get; set; }

        public int? CreatedBy { get; set; }

        public bool IsDeleted { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }

    public class MaterialAdd
    {
        public int MaterialId { get; set; }

        public string? Code { get; set; }

        public string? Description { get; set; }

        public int? Category { get; set; }

        public int? UOM { get; set; }

        public int? CostCenter { get; set; }

        public int? CreatedBy { get; set; }

        public bool IsActive { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }

    public class ResultMonitoringMasterAdd
    {
        public int ResultMonitoringId { get; set; }

        public string? ResultMonitoringName { get; set; }

        public bool? IsActive { get; set; }
    }

    public class FunctionMasterAdd
    {
        public int FunctionId { get; set; }

        public string? FunctionName { get; set; }

        public int? CreatedBy { get; set; }

        public bool IsActive { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }

    public class SectionHeadEmpMasterAdd
    {
        public int SectionHeadMasterId { get; set; }

        public int? EmployeeId { get; set; }

        public string? SectionHeadName { get; set; }

        public string? SectionHeadEmail { get; set; }

        public int? SectionId { get; set; }

        public bool? IsActive { get; set; }
    }

    public class SectionMasterAdd
    {
        public int SectionId { get; set; }

        public string SectionName { get; set; }

        public bool IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }

    public class TroubleTypeAdd
    {
        public int TroubleId { get; set; }

        public string? Name { get; set; }

        public bool? IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }

    public class MasterEmployeeSelection
    {
        public int EmployeeId { get; set; }

        public string? EmployeeName { get; set; }

        public string? Email { get; set; }
    }

    public class AreaDtoAdd
    {
        public int AreaId { get; set; }

        public string AreaName { get; set; }

        public bool IsActive { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }
    }

    #endregion
}
