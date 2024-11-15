namespace TDSGCellFormat.Models.View
{
    public class AdjustmentReportPdfView
    {
        public string? ReportNo { get; set; }

        public string WhenDate { get; set; }

        public string? AreaName { get; set; }

        public string? MachineName { get; set; }

        public int MachineId { get; set; }

        public string? DescribeProblem { get; set; }

        public string? Observation { get; set; }

        public string? RootCause { get; set; }

        public string? AdjustmentDescription { get; set; }

        public string? ConditionAfterAdjustment { get; set; }

        public string? Requestor { get; set; }

        public string? CheckedBy { get; set; }
    }
}
