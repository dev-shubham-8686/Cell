namespace TDSGCellFormat.Models.Add
{
    public class AdjustMentReportAdd
    {
        public int AdjustMentReportId { get; set; }

        public string when { get; set; }

        public string? Area { get; set; }

        public string? linestation { get; set; }

        public string? machinename { get; set; }

        public string? machineno { get; set; }

        public string? describeproblem { get; set; }

        public string? observation { get; set; }

        public string? rootcause { get; set; }

        public string? adjustmentsuggested { get; set; }

        public string? attachment { get; set; }

        public string? Status { get; set; }

        public bool? IsSubmit { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public bool? IsDeleted { get; set; }
    }
}
