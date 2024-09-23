using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("TroubleAttachment")]
public partial class TroubleAttachment
{
    [Key]
   
    public int TroubleAttachmentId { get; set; }
    public int? TroubleReportId { get; set; }
    public string? DocumentName { get; set; }
    public string? DocumentFilePath { get; set; }
    public bool? IsDeleted { get; set; }
    public int? CreatedBy { get; set; }
    public DateTime? CreatedDate { get; set; }
    public int? ModifiedBy { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public virtual TroubleReports? TroubleReport { get; set; }
}
