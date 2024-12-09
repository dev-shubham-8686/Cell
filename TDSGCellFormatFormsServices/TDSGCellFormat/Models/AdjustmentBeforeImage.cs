
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace TDSGCellFormat.Models;

[Table("AdjustmentBeforeImage")]

public class AdjustmentBeforeImage
    {
        [Key]

        public int AdjustmentBeforeImageId { get; set; }
        public int? AdjustmentReportId { get; set; }
        public string? BeforeImageDocName { get; set; }
        public string? BeforeImageDocFilePath { get; set; }
        public bool? IsDeleted { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? ModifiedBy { get; set; }
        public DateTime? ModifiedDate { get; set; }

    }

