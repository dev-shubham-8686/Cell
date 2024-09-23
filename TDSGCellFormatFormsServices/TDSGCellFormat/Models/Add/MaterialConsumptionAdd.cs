namespace TDSGCellFormat.Models.Add
{
    public class MaterialConsumptionAdd
    {
        public int MaterialConsumptionSlipId { get; set; }

        public string when { get; set; }

        public int? category { get; set; }

        public int? materialNumber { get; set; }

        public string? glCode { get; set; }

        public string? costCenter { get; set; }

        public string? description { get; set; }

        public string? quantity { get; set; }

        public int? uom { get; set; }

        public string? purpose { get; set; }

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
