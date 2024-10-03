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
    }

    public class DeviceView
    {
        public int deviceId { get; set; }

        public string? deviceName { get; set; }
    }

    public class SubDeviceView
    {
        public int subDeviceId { get; set; }

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
}
