using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("ResultMonitoringMaster")]

public class ResultMonitoringMaster
{
    [Key]
    public int ResultMonitoringId { get; set; }
    public string? ResultMonitoringName { get; set; }

    public bool? IsActive {  get; set; }
}

