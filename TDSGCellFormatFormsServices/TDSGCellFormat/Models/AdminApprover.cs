using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("AdminApprover")]
public class AdminApprover
{
    [Key]
    public int Id { get; set; }
    public int? AdminId { get; set; }
    public string? FormName { get; set; }
    public bool? IsActive { get; set; }
}

