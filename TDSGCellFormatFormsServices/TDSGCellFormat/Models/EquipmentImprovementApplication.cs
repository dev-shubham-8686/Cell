using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("EquipmentImprovementApplication")]
public partial class EquipmentImprovementApplication
{
    [Key]
    public int EquipmentImprovementId { get; set; }
    public string? EquipmentImprovementNo { get; set; }

    public DateTime? When { get; set; }

    public string? DeviceId { get; set; }

    public string? Purpose { get; set; }

    public string? CurrentSituation { get; set; }

    public string? Imrovement { get; set; }

    public DateTime? TargetDate { get; set; }

    public DateTime? ActualDate { get; set; }

    public string? ResultStatus { get; set; }   
    public string? PCRNDocName { get; set; }

    public string? PCRNDocFilePath { get; set; }

    public string? Status { get; set; }

    public bool? IsSubmit { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public bool? IsDeleted { get; set; }
    public virtual ICollection<ChangeRiskManagement> ChangeRiskManagement { get; set; } = new List<ChangeRiskManagement>();
    public virtual ICollection<EquipmentCurrSituationAttachment> EquipmentCurrSituationAttachment { get; set; } = new List<EquipmentCurrSituationAttachment>();
    public virtual ICollection<EquipmentImprovementAttachment> EquipmentImprovementAttachment { get; set; } = new List<EquipmentImprovementAttachment>();
   
}
