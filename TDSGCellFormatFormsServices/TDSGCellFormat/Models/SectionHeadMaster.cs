using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;
[Table("SectionHeadMaster")]
public class SectionHeadMaster
{
    [Key]
    public int Sectionid { get; set; }
    public int? DepartmentId { get; set; }
    public string? SectionName { get; set; }
    public int? Head {  get; set; }
    public bool? IsActive { get; set; }
    [ForeignKey("DepartmentId")]
    public virtual DepartmentMaster? DepartmentMaster { get; set; }
}

