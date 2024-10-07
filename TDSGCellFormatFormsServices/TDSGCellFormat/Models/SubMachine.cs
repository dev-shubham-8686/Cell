using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models
{
    [Table("SubMachine")]
    public class SubMachine
    {
        [Key]
        public int SubMachineId { get; set; }

        public int? MachineId { get; set; }

        public string? SubMachineName { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public bool? IsDeleted { get; set; }

        [ForeignKey("MachineId")]
        public virtual Machine? Machine { get; set; }
    }
}
