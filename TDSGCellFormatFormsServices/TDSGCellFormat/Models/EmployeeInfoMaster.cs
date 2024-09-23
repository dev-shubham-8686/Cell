using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace TDSGCellFormat.Models;

public partial class EmployeeInfoMaster
{
    [Key]
    public int EmployeeInfoId { get; set; }

    public string? EmployeeCode { get; set; }

    public string? PanCardNumber { get; set; }

    public string? Country { get; set; }

    public string? ZipCode { get; set; }

    public string? Address1 { get; set; }

    public string? Address2 { get; set; }

    public string? Address3 { get; set; }

    public string? City { get; set; }

    public string? State { get; set; }

    public string? Gender { get; set; }

    public string? Nationality { get; set; }

    public string? MaritalStatus { get; set; }

    public string? BloodGroupId { get; set; }

    public DateTime? CreatedDate { get; set; }

    public DateTime? ModifiedDate { get; set; }

    public bool? IsActive { get; set; }
}
