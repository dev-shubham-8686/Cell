using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;


[Table("SectionMaster")]
public class SectionMaster
{
    [Key]
    public int SectionId { get; set; }
    public string? SectionName { get; set; }
    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public bool? IsActive { get; set; }
    public virtual ICollection<EquipmentImprovementApplication> EquipmentImprovementApplication { get; set; } = new List<EquipmentImprovementApplication>();
}

