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

        Task<AjaxResult> GetEmployeeDetailsById(int id, string email);

        Task<AjaxResult> GetAdjustmentReportApproverList(int pageIndex, int pageSize, int createdBy = 0, string sortColumn = "", string orderBy = "DESC", string searchValue = "");

        Task<AjaxResult> UpdateApproveAskToAmend(ApproveAsktoAmend asktoAmend);

        Task<AjaxResult> PullBackRequest(int Id, int userId, string comment);

        Task<AjaxResult> GeAdjustmentReportWorkFlow(int Id);

        Task<AjaxResult> GetCurrentApproverTask(int Id, int userId);

        Task<AjaxResult> GetAdjustmentReportExcel(DateTime fromDate, DateTime todate, int employeeId, int type);

        Task<AjaxResult> ExportToPdf(int adjustmentreportId);

        Task<AjaxResult> GetSectionHead(int adjustmentReportId);

        Task<AjaxResult> GetDepartmentHead(int adjustmentReportId);

        Task<AjaxResult> GetAdditionalDepartmentHeads();
    }
}
