namespace TDSGCellFormat.Models.Add
{
    public class ApplicationImprovementAdd
    {
        public int ApplicationImprovementId { get; set; }

        public string When { get; set; }

        public string? DeviceName { get; set; }

        public string? Purpose { get; set; }

        public string? CurrentSituation { get; set; }

        public string? Improvement { get; set; }

        public string? Attachment { get; set; }

        public string? Status { get; set; }

        public bool? IsSubmit { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }

        public int? ModifiedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public bool? IsDeleted { get; set; }
    }


    public class EquipmentPullBack
    {
        public int? equipmentId { get; set; }
        public int? userId { get; set; }
        public string? comment { get; set; }
    }
}
