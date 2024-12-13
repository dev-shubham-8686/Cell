namespace TDSGCellFormat.Models.View
{
    public class AdjustmentReportExcelView
    {
        public string? ReportNo { get; set; }

        public string IssueDate { get; set; }

        public string? AreaName { get; set; }

        public string? MachineName { get; set; }

        public string? SubMachineName { get; set; }

        public string? Requestor { get; set; }

        public string? CurrentApprover { get; set; }

        public string? Status { get; set; }
    }

    public class AdjustmentReportApprovalExcelView
    {
        public string? ReportNo { get; set; }

        public string IssueDate { get; set; }

        public string? AreaName { get; set; }

        public string? MachineName { get; set; }

        public string? SubMachineName { get; set; }

        public string? Requestor { get; set; }

        public string? Status { get; set; }
    }
}
