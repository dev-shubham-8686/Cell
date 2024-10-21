using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("EquipmentAdvisorMaster")]
public class EquipmentAdvisorMaster
{
    [Key]
    public int AdvisorId { get; set; }

    public int? EmployeeId { get; set; }
    public int? EquipmentImprovementId  { get; set; }
    public int? WorkFlowlevel {  get; set; }

    public bool? IsActive {  get; set; }

    [ForeignKey("EquipmentImprovementId")]
    public virtual EquipmentImprovementApplication? EquipmentImprovementApplication { get; set; }
}

