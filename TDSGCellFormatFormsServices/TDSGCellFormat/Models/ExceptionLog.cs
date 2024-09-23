using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;
[Table("ExceptionLog")]
public partial class ExceptionLog
{
    [Key]
    public int ErrorLogId { get; set; }
    public int? EmployeeId { get; set; }
    public string? ExceptionMessage { get; set; }
    public string? ExceptionType { get; set; }
    public string? ExceptionStackTrack { get; set; }
    public string? WebMethodName { get; set; }
    public DateTime? CreatedDate { get; set; }
}

