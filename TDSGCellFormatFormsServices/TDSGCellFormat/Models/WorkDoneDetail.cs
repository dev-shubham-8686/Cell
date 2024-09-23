using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("WorkDoneDetail")]
public partial class WorkDoneDetail
{
    [Key]
    public int WorkDoneId { get; set; }

    public int? TroubleReportId { get; set; }

    public int? EmployeeId { get; set; }

    public bool? Lead { get; set; }
    public string? Comment { get; set; }
    public bool? IsDeleted { get; set; }
    public bool? IsSaved { get; set; }
    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public virtual TroubleReports? TroubleReport { get; set; }
}
