using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;
[Table("AuthSession")]
public partial class AuthSession
{
    [Key]
    public int AuthSessionId { get; set; }
    public Nullable<int> UserId { get; set; }
    public string TenentID { get; set; }
    public string APIKeyId { get; set; }
    public Nullable<System.DateTime> StartDateTime { get; set; }
    public Nullable<System.DateTime> EndDateTime { get; set; }
    public Nullable<bool> IsExpired { get; set; }
    public Nullable<System.DateTime> LastActivity { get; set; }
}

