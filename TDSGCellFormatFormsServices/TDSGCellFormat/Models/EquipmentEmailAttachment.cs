
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace TDSGCellFormat.Models;

[Table("EquipmentEmailAttachment")]

public class EquipmentEmailAttachment
{
    [Key]
    public int EquipmentEmailAttachmenId { get; set; }
    public int? EquipmentImprovementId { get; set; }
    public string? EmailDocName { get; set; }
    public string? EmailFilePath { get; set; }
    public bool? IsDeleted { get; set; }
    public int? CreatedBy { get; set; }
    public DateTime? CreatedDate { get; set; }
    public int? ModifiedBy { get; set; }
    public DateTime? ModifiedDate { get; set; }
}

