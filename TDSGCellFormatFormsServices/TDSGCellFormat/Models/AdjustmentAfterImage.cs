using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace TDSGCellFormat.Models;

[Table("AdjustmentAfterImage")]
public class AdjustmentAfterImage
{
    [Key]

    public int AdjustmentAfterImageId { get; set; }
    public int? AdjustmentReportId { get; set; }
    public string? AfterImageDocName { get; set; }
    public string? AfterImageDocFilePath { get; set; }
    public string? AfterImageBytes { get; set; }
    public bool? IsDeleted { get; set; }
    public int? CreatedBy { get; set; }
    public DateTime? CreatedDate { get; set; }
    public int? ModifiedBy { get; set; }
    public DateTime? ModifiedDate { get; set; }
}

