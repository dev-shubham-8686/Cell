namespace TDSGCellFormat.Models.View
{
    public class AdjustmentReportView
    {
        public int AdjustmentReportId { get; set; }
        public string? ReportNo { get; set; }

        public string? AreaName { get; set; }
        public string? IssueDate { get; set; }
        public string? MachineName { get; set; }
        public string? SubMachineName { get; set; }

        public string? Requestor { get; set; }

        public string? CurrentApprover { get; set; }

        public int? CurrentApproverId { get; set; }
        public string? Status { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public bool? IsSubmit { get; set; }

        public int? totalCount { get; set; }
    }

    public class AdjustmentReportApproverView
    {
        public int AdjustmentReportId { get; set; }
        public string? ReportNo { get; set; }

        public string? AreaName { get; set; }
        public string? IssueDate { get; set; }
        public string? MachineName { get; set; }
        public string? SubMachineName { get; set; }

        public string? Requestor { get; set; }

        public string? ApproverTaskStatus { get; set; }
        public string? Status { get; set; }

        public int? CreatedBy { get; set; }

        public int? totalCount { get; set; }

        public DateTime? ModifiedDate { get; set; }

    }

    public class AdjustmentReportAllView
    {
        public int AdjustmentReportId { get; set; }
        public string? ReportNo { get; set; }

        public string? AreaName { get; set; }
        public string? IssueDate { get; set; }
        public string? MachineName { get; set; }
        public string? SubMachineName { get; set; }

        public string? Requestor { get; set; }

        public string? CurrentApprover { get; set; }

        public int? CurrentApproverId { get; set; }
        public string? Status { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public bool? IsSubmit { get; set; }
        public int? AdvisorId { get; set; }

        public int? totalCount { get; set; }
    }

}
