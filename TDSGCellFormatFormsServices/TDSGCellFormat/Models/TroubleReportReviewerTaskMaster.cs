using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("TroubleReportReviewerTaskMaster")]
public partial class TroubleReportReviewerTaskMaster
{
    [Key]
    public int ReviewerTaskMasterId { get; set; }

    public int? TroubleReportId { get; set; }

    public int? ReviewerId { get; set; }
    public string? DisplayName {  get; set; }
    public string? ProcessName { get; set; }
    public string? Comment { get; set; }

    public string? Status { get; set; }

    public bool? IsActive { get; set; }

    public bool? IsClsoed { get; set; }
    public bool? IsSubmit { get; set; }
    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }
}
