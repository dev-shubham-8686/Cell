using TDSGCellFormat.Models;
using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Models.View;

namespace TDSGCellFormat.Interface.Service
{
    public interface ITroubleReportService : IBaseService<TroubleReports>
    {

        List<TroubleReportAdd> GetAll();
        TroubleReportAdd GetById(int Id);
        Task<AjaxResult> DeleteReport(int Id);
        Task<AjaxResult> AddOrUpdateReport(TroubleReportAdd report);
        //Task<dynamic> GetTroubleReportsWithRevisions(int createdBy, int pageIndex, int pageSize,  string order, string orderBy, string searchColumn, string searchValue);
        Task<string> GetTroubleListingScreen(int createdBy, int pageIndex, int pageSize, string order, string orderBy, string searchColumn, string searchValue);
        Task<string> GetReviewListingScreen(int createdBy, int pageIndex, int pageSize, string order, string orderBy, string searchColumn, string searchValue);
        Task<string> GetReviseDataListing(int troubleReportId);
        Task<string> GetApproverListingScreen(int createdBy, int pageIndex, int pageSize, string order, string orderBy, string searchColumn, string searchValue);

        Task<AjaxResult> SubmitRequest(TroubleReport_OnSubmit onSubmit);
        ApproverTaskId_dto GetCurrentApproverTask(int troubleReportId, int userId);
        Task<AjaxResult> UpdateApproveAskToAmend(int ApproverTaskId, int CurrentUserId, ApprovalStatus type, string comment, int troubleReportId);

        Task<AjaxResult> PullbackRequest(int troubleReportId, int userId, string comment);

        Task<AjaxResult> SendManager(int troubleReportId, int userId);

        Task<AjaxResult> NotifyWorkDoneMembers(int troubleReportId, int userId);

        Task<AjaxResult> ReviewByManagers(int troubleReportId, int userId);

        Task<AjaxResult> ManagerReviewTask(int troubleReportId, int userId,string status, string comment);

        List<TroubleReportHistoryView> GetHistoryData(int troubleReportId);

        List<TroubleReportInternalFlowView> GetTroubleInernalFlow(int troubleReportId);

        Task<List<TroubleReportApproverTaskMasterAdd>> GetTroubelReportApproverData(int troubelReportId);

        Task<GetUserDetailsView> GetUserRole(string email);

        TroubleReportInternalFlowView GetCurrentTask(int troubleReportId, int userId);
        Task<AjaxResult> ReOpenTroubleForm(int troubleReportId, int userId);


        Task<AjaxResult> GetTroubleReportExcel(DateTime fromDate, DateTime toDate, int employeeId, int type);
    }
}
