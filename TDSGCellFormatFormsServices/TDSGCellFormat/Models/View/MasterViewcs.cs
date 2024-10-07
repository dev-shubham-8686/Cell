namespace TDSGCellFormat.Models.View
{
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

        public string? name { get; set; }
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
}
