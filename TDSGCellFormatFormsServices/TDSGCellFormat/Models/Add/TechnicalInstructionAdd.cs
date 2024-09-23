namespace TDSGCellFormat.Models.Add
{
    public class TechnicalInstructionAdd
    {

        public int TechnicalId { get; set; }

        public string when { get; set; }

        public string? title { get; set; }

        public string? purpose { get; set; }

        public string? productType { get; set; }

        public string? quantity { get; set; }

        public string? outline { get; set; }

        public string tisApplicabilityDate { get; set; }

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
