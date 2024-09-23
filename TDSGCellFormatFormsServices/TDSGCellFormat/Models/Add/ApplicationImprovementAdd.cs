namespace TDSGCellFormat.Models.Add
{
    public class ApplicationImprovementAdd
    {
        public int ApplicationImprovementId { get; set; }

        public string when { get; set; }

        public string? deviceName { get; set; }

        public string? purpose { get; set; }

        public string? currentSituation { get; set; }

        public string? improvement { get; set; }

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
