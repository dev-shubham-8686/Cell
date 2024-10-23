namespace TDSGCellFormat.Models.View
{
    public class AdjustmentReportView
    {
        public int AdjustmentReportId { get; set; }

        public string? ReportNo { get; set; }

        public string? EmployeeName { get; set; }

        public string? DepartmentName { get; set; }

        public string? DivisionName { get; set; }

        public string? EmployeeCode { get; set; }

        public string? EmpDesignation { get; set; }

        public string? Status { get; set; }

        public bool? IsDeleted { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? CreatedDate { get; set; }
    }
}
