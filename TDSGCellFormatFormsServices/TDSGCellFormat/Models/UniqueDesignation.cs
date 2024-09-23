using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TDSGCellFormat.Models;

public partial class UniqueDesignation
{
    [Key]
    public string? EmpDesignation { get; set; }
}
