using Microsoft.Extensions.Configuration;
using TDSGCellFormat.Helper;
using TDSGCellFormat.Models;
using System.Data;
using System.Text;
using TDSGCellFormat.Common;
using static TDSGCellFormat.Common.Enums;
using Microsoft.Graph.Models;

namespace TDSG.CellForms.SubstituteScheduler.Scheduler
{
    public class AdjustmentReportScheduler
    {
        private readonly IConfiguration _configuration;
        private readonly TdsgCellFormatDivisionContext _cellContext;
        private readonly AepplNewCloneStageContext _dbContext;

        public AdjustmentReportScheduler(IConfiguration configuration, TdsgCellFormatDivisionContext cellContext, AepplNewCloneStageContext dbContext)
        {
            this._configuration = configuration;
            this._cellContext = cellContext;
            this._dbContext = dbContext;
        }

        public void AdjustmentSubstituteCheck()
        {
            try
            {
                DateTime date_time_to_compare = DateTime.Now.AddDays(-1);
                var a = DateOnly.FromDateTime(date_time_to_compare);
                var substitutes = _cellContext.CellSubstituteMasters
                    .Where(r => r.DateTo == DateOnly.FromDateTime(date_time_to_compare))
                    .ToList();

                if (substitutes.Count > 0) 
                {
                    foreach (var item in substitutes)
                    {
                        string EmailAddress = "";

                        DateTime? fromDate = item.DateFrom?.ToDateTime(TimeOnly.MinValue);
                        DateTime? toDate = item.DateTo?.ToDateTime(TimeOnly.MinValue);

                        var approverTasks = _cellContext.AdjustmentReportApproverTaskMasters
                       .Where(x =>
                           (
                               (fromDate.HasValue && toDate.HasValue && x.CreatedDate >= fromDate.Value && x.CreatedDate <= toDate.Value) ||
                               (x.ModifiedDate.HasValue && fromDate.HasValue && toDate.HasValue && x.ModifiedDate.Value >= fromDate.Value && x.ModifiedDate.Value <= toDate.Value)
                           )
                           && (x.Status == "InReview" || x.Status == "Pending")
                           && (x.AssignedToUserId == item.SubstituteUserID || x.DelegateUserId == item.SubstituteUserID)
                           && (x.FormType == ProjectType.AdjustMentReport.ToString())
                       // && x.IsSubstitute
                       ).ToList();

                        foreach (var approverTask in approverTasks)
                        {
                            int sequneceNo = 1;
                            approverTask.AssignedToUserId = item.EmployeeID ?? 0;
                            approverTask.DelegateUserId = null;
                            approverTask.DelegateOn = null;
                            approverTask.DelegateBy = null;
                            approverTask.ModifiedDate = DateTime.Now;
                            _cellContext.SaveChanges();

                            string formName = item.FormName;
                            string reqNo = "";
                            string requestDate = "";
                            string requestBy = "";

                            if (item.EmployeeID > 0)
                            {
                                var requesterUserDetail = _dbContext.EmployeeMasters.FirstOrDefault(x => x.EmployeeID == item.EmployeeID);
                                if (requesterUserDetail != null)
                                {
                                    EmailAddress = requesterUserDetail?.Email ?? "";
                                }
                            }

                            string documentationLink = _configuration["SPSiteUrl"] + _configuration["AdjustmentURL"];
                            string docLink = documentationLink + "edit/" + approverTask.AdjustmentReportId;

                            var adjustmentDetails = _cellContext.AdjustmentReports.Where(x => x.AdjustMentReportId == approverTask.AdjustmentReportId).FirstOrDefault();
                            if(adjustmentDetails != null)
                            {
                                reqNo = adjustmentDetails.ReportNo ?? "";
                                requestDate = adjustmentDetails.CreatedDate?.ToString("dd-MM-yyyy");

                                if(adjustmentDetails.CreatedBy != null)
                                {
                                    var requesterUserDetail = _dbContext.EmployeeMasters.FirstOrDefault(x => x.EmployeeID == adjustmentDetails.CreatedBy);
                                    requestBy = requesterUserDetail?.EmployeeName ?? "";
                                }

                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                var commonHelper = new CommonHelper(_cellContext,_dbContext);
                commonHelper.LogException(ex, "Adjustment Substitute Scheduler");
                //return false;
                Console.WriteLine("error" + ex.Message);
                Console.WriteLine("error" + ex.InnerException);
            }
        }

    }
}
