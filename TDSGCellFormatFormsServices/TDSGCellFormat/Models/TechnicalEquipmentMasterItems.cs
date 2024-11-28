using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models
{
    [Table("TechnicalEquipmentMasterItems")]
    public class TechnicalEquipmentMasterItems
    {
        [Key]
        public int Id { get; set; }

        public int? TechnicalId { get; set; }

        public int? EquipmentId { get; set; }
    }
}
