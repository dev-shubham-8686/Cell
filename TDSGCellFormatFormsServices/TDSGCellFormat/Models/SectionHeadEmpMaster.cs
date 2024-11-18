using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;


[Table("SectionHeadEmpMaster")]
public class SectionHeadEmpMaster
{
    [Key]
    public int SectionHeadMasterId { get; set; }
    public int? EmployeeId { get; set; }
    public string? SectionHeadName { get; set; }

    public string? SectionHeadEmail { get; set; }
    public int? SectionId { get; set; }
    public bool? IsActive { get; set; }


    [ForeignKey("SectionId")]
    public virtual SectionMaster? SectionMaster { get; set; }
}

