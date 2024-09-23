using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("ApplicationEquipmentImprovement")]
public partial class ApplicationEquipmentImprovement
{
    [Key]
    public int ApplicationImprovementId { get; set; }

    public DateTime? When { get; set; }

    public string? DeviceName { get; set; }

    public string? Purpose { get; set; }

    public string? CurrentSituation { get; set; }

    public string? Imrovement { get; set; }

    public string? Attachment { get; set; }

    public string? Status { get; set; }

    public bool? IsSubmit { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? CreatedBy { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public bool? IsDeleted { get; set; }
}
