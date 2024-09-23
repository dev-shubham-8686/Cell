using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TDSGCellFormat.Models;
[Table("EmailLogMaster")]
public class EmailLogMaster
{
    [Key]
    public int EmailId { get; set; }
    public int? FormId { get; set; }
    public string EmailSubject { get; set; }
    public string EmailBody { get; set; }
    public string EmailTo { get; set; }
    public string EmailCC { get; set; }
    public bool? IsEmailSent { get; set; }
    public DateTime? EmailSentTime { get; set; }
    public bool? isDelete { get; set; }
}

