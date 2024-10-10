using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("CPCGroupMaster")]

public class CPCGroupMaster
{
    [Key]
    public int CPCGroupId { get; set; }
    public int? EmployeeId { get; set; }
    public string? Email { get; set; }
    public string? EmployeeName { get; set; }
    public bool? IsActive { get; set; }
}

