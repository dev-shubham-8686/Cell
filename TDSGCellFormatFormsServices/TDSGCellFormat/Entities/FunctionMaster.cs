namespace TDSGCellFormat.Entities
{
    public class FunctionMaster
    {
        public int FunctionId { get; set; }

        public string? Function { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public bool? IsDeleted { get; set; }
    }
}
