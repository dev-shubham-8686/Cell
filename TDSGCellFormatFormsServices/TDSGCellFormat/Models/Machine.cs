using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models
{
    [Table("Machine")]
    public class Machine
    {
        [Key]
        public int MachineId { get; set; }

        public string? MachineName { get; set; }

        public DateTime? CreatedDate { get; set; }

        public int? CreatedBy { get; set; }

        public DateTime? ModifiedDate { get; set; }

        public int? ModifiedBy { get; set; }

        public bool? IsDeleted { get; set; }

        public virtual ICollection<EquipmentImprovementApplication> EquipmentImprovementApplication { get; set; } = new List<EquipmentImprovementApplication>();
        public virtual ICollection<SubMachine> SubMachine { get; set; } = new List<SubMachine>();
    }
}
