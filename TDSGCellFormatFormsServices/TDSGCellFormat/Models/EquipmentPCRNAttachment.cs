using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("EquipmentPCRNAttachment")]
public class EquipmentPCRNAttachment
{
    public int PCRNId { get; set; }
    public int? EquipmentImprovementId { get; set; }

    public string? PCRNDocFileName { get; set; }
    public string? PCRNDocFilePath  { get; set; }
    public DateTime? CreatedDate { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public bool? IsDeleted { get; set; }
}

