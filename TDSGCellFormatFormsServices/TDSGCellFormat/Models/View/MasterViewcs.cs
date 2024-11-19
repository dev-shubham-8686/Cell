namespace TDSGCellFormat.Models.View
{
    public class AreaView
    {
        public int areaId { get; set; }

        public string areaName { get; set; } = null!;
    }

    public class CostCenterView
    {
        public int costCenterId { get; set; }

        public string name { get; set; }
    }

    public class TroubleTypeView
    {
        public int troubleId { get; set; }

        public string? name { get; set; }
    }
    public class UnitOfMeasureView
    {
        public int uomid { get; set; }

        public string? name { get; set; }
    }
    public class MaterialView
    {
        public int materialId { get; set; }

        public string? code { get; set; }

        public string description { get; set; }

        public int uom {  get; set; }

        public int category { get; set; }

        public int costCenter { get; set; }
    }
    public class CategoryView
    {
        public int categoryId { get; set; }
        public string? name { get; set; }
    }

    public class EmployeeMasterView
    {
        public int employeeId { get; set; }
        public string? employeeName { get; set; }

        public string? Email { get; set; }
    }

    public class AreaMasterView
    {
        public int AreaId { get; set; }

        public string? AreaName { get; set; }
    }

    public class MachineView
    {
        public int MachineId { get; set; }
        public string? MachineName { get; set; }
    }

    public class SubMachineView
    {
        public int? MachineId { get; set; }
        public int SubMachineId {  get; set; }
        public string? SubMachineName { get; set; }
    }
    public class DeviceView
    {
        public int deviceId { get; set; }

        public string? deviceName { get; set; }
    }

    public class SubDeviceView
    {
        public int subDeviceId { get; set; }
        public int? deviceId { get; set; }
        public string? subDeviceName { get; set; }
    }

    public class SectionView
    {
        public int sectionId { get; set; }

        public string? sectionName { get; set; }
    }


    public class FunctionView
    {
        public int functionId { get; set; }

        public string? functionName { get; set; }
    }

    public class SectionHeadView
    {
        
        public int sectionHeadId { get; set; }
        public int? head {  get; set; }
        public string? headName { get; set; }
        public string? sectionName { get; set; }
    }

    public class AdvisorMasterView
    {
        public int employeeId { get; set; }
        public string? employeeName { get; set; }

        public string? Email { get; set; }
    }

    public class ResultMonitorView
    {
        public int resultMonitorId { get; set; }

        public string? resultMonitorName { get; set; }


    }
}
