using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Models.View;
using static TDSGCellFormat.Common.Enums;

namespace TDSGCellFormat.Interface.Repository
{
    public interface IMatrialConsumptionRepository : IBaseRepository<MaterialConsumptionSlip>
    {
        Task<object> GetMaterialConsumptionList(int createdBy, int skip, int take, string order, string orderBy, string searchColumn, string searchValue);
        Task<object> GetMaterialConsumptionApproverList(int createdBy, int skip, int take, string order, string orderBy, string searchColumn, string searchValue);
        MaterialConsumptionSlipView GetById(int Id);
        Task<AjaxResult> DeleteReport(int Id);
        Task<AjaxResult> AddOrUpdateReport(MaterialConsumptionSlipAdd report);

        Task<AjaxResult> UpdateApproveAskToAmend(int ApproverTaskId, int CurrentUserId, ApprovalStatus type, string comment, int materialConsumptionId);
        Task<AjaxResult> PullBackRequest(int materialConsumptionId, int userId, string comment);
        Task<List<MaterialConsumptionApproverTaskMasterAdd>> GetMaterialConsumptionWorkFlow(int materialConsumptionId);
        List<TroubleReportHistoryView> GetHistoryData(int materialConsumptionId);
        ApproverTaskId_dto GetCurrentApproverTask(int materialConsumptionId, int userId);
        Task<AjaxResult> CloseMaterial(ScrapNoteAdd report);
        Task<AjaxResult> ExportMaterialConsumptionToExcel(int materialConsumptionId);
        Task<AjaxResult> ExportToPdf(int materialConsumptionId);

        Task<AjaxResult> GetMaterialConsumptionExcel(DateTime fromDate, DateTime toDate, int employeeId, int type);
       
        Task<List<MaterialConsumptionListView>> GetMaterialConsumptionList1(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue);

        Task<AjaxResult> InsertDelegate(DelegateUser request);
    }
}
