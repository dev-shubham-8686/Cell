using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Models.View;
using TDSGCellFormat.Models;

namespace TDSGCellFormat.Interface.Service
{
    public interface IAdjustMentReportService : IBaseService<AdjustmentReport>
    {
        Task<AjaxResult> GetAllAdjustmentData(int pageIndex, int pageSize, int createdBy = 0, string sortColumn = "", string orderBy = "", string searchValue = "");

        IQueryable<AdjustMentReportRequest> GetAll();

        AdjustMentReportRequest GetById(int Id);

        Task<AjaxResult> DeleteReport(int Id);

        Task<AjaxResult> AddOrUpdateReport(AdjustMentReportRequest report);

        Task<AjaxResult> DeleteAttachment(int Id);

        Task<AjaxResult> GetAdjustmentReportApproverList(int Id);

        Task<AjaxResult> UpdateApproveAskToAmend(int ApproverTaskId, int CurrentUserId, ApprovalStatus type, string comment, int Id);

        Task<AjaxResult> PullBackRequest(int Id, int userId, string comment);

        Task<AjaxResult> GeAdjustmentReportWorkFlow(int Id);

        Task<AjaxResult> GetCurrentApproverTask(int Id, int userId);
    }
}
