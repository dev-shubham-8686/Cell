using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TDSGCellFormat.Models;

namespace TDSG_VehicleRequisitionSubstitution.Models;

[Table("SubstituteMaster")]
public partial class SubstituteMaster
{
    [Key]
    public int SubstituteId { get; set; }

    public int? EmployeedId { get; set; }

    public int? SubstituteUserId { get; set; }

    public bool? IsSubstitute { get; set; }

    public DateOnly? DateFrom { get; set; }

    public DateOnly? DateTo { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public string? FormName { get; set; }

    public virtual EmployeeMaster? Employeed { get; set; }
}
