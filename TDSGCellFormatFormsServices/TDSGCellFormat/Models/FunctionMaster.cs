using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;

[Table("FunctionMaster")]
public class FunctionMaster
{
    [Key]
    public int FunctionId { get; set; }

    public string? FunctionName { get; set; }

    public int? CreatedBy { get; set; }

    public DateTime? CreatedDate { get; set; }

    public int? ModifiedBy { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public bool? IsActive { get; set; }
    public virtual ICollection<ChangeRiskManagement> ChangeRiskManagements { get; set; } = new List<ChangeRiskManagement>();
}

