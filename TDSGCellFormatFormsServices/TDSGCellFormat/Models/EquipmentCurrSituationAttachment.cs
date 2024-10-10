
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace TDSGCellFormat.Models;

[Table("EquipmentCurrSituationAttachment")]

public class EquipmentCurrSituationAttachment
{
    [Key]

    public int EquipmentCurrentSituationAttachmentId { get; set; }
    public int? EquipmentImprovementId { get; set; }
    public string? CurrSituationDocName { get; set; }
    public string? CurrSituationDocFilePath { get; set; }
    public bool? IsDeleted { get; set; }
    public int? CreatedBy { get; set; }
    public DateTime? CreatedDate { get; set; }
    public int? ModifiedBy { get; set; }
    public DateTime? ModifiedDate { get; set; }

    [ForeignKey("EquipmentImprovementId")]
    public virtual EquipmentImprovementApplication? EquipmentImprovementApplication { get; set; }
}

