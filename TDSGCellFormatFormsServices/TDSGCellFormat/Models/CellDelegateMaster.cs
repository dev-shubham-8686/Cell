using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("CellDelegateMaster")]
public class CellDelegateMaster
{
    [Key]
    public int DelegateId { get; set; }
    public int? RequestId { get; set; }
    public int? EmployeeId { get; set; }
    public int? DelegateUserId { get; set; }
    public string? FormName { get; set; }
    public DateTime? CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
    public int? CreatedBy { get; set; }
}

