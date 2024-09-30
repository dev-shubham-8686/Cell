namespace TDSGCellFormat.Entities
{
    public class MachineNameMaster
    {
        public int MachineNameId { get; set; }

        public string? MachineName { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public bool? IsDeleted { get; set; }
    }
}
