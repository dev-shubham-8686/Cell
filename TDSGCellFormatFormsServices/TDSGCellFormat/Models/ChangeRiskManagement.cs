using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("ChangeRiskManagement")]
public class ChangeRiskManagement
{
    [Key]

    public int ChangeRiskManagementId { get; set; }
    public int? EquipmentImprovementId { get; set; }
    public string? Changes { get; set; }
    
    public string? FunctionId { get; set; }
    public string? RiskAssociatedWithChanges { get; set; }
    public string? Factor {  get; set; }
    public string? CounterMeasures { get; set; }
    public DateTime? DueDate { get; set; }
    public int? PersonInCharge { get; set; }
    public string? Results { get; set; }
    public bool? IsDeleted { get; set; }
    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }
    [ForeignKey("EquipmentImprovementId")]
    public virtual EquipmentImprovementApplication? EquipmentImprovementApplication { get; set; }
   
}

