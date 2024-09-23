using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TDSGCellFormat.Models;

public partial class EmployeeRelation
{
    [Key]
    public int EmpRelationId { get; set; }

    public DateTime? EmployeeDob { get; set; }

    public string? EmployeeCode { get; set; }

    public string? Name { get; set; }

    public string? RelatedPersonIdExternal { get; set; }

    public string? RelationshipType { get; set; }

    public DateTime? LastModifiedBy { get; set; }

    public DateTime? LastModifiedBySystem { get; set; }
}
