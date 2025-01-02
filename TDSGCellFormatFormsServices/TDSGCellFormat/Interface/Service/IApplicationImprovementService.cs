using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Models.View;

namespace TDSGCellFormat.Interface.Service
{
    public interface IApplicationImprovementService : IBaseService<EquipmentImprovementApplication> 
    {

        IQueryable<EquipmentImprovementApplicationAdd> GetAll();
        EquipmentImprovementApplicationAdd GetById(int Id);
        Task<AjaxResult> DeleteReport(int Id);
        Task<AjaxResult> AddOrUpdateReport(EquipmentImprovementApplicationAdd report);
        Task<List<EquipmentImprovementView>> GetEqupimentImprovementList(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue);

        Task<List<EquipmentImprovementView>> GetEqupimentImprovementMyRequestList(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue);

        Task<List<EquipmentImprovementApproverView>> GetEqupimentImprovementApproverList(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue);
        Task<AjaxResult> PullBackRequest(EquipmentPullBack data);
        Task<AjaxResult> UpdateApproveAskToAmend(EquipmentApproveAsktoAmend data);
        Task<AjaxResult> UpdateTargetDates(EquipmentApprovalData data);

        EquipmentApprovalData GetEquipmentTargetDate(int equipmentId, bool toshibaDiscussion);
        // Task<List<EquipmentApproverTaskMasterAdd>> GetEquipmentWorkFlowData(int equipmentId);
        Task<(List<EquipmentApproverTaskMasterAdd> WorkflowOne, List<EquipmentApproverTaskMasterAdd> WorkflowTwo)> GetEquipmentWorkFlowData(int equipmentId);
        ApproverTaskId_dto GetCurrentApproverTask(int equipmentId, int userId);
        List<TroubleReportHistoryView> GetHistoryData(int equipmentId);
        Task<AjaxResult> GetEquipmentExcel(DateTime fromDate, DateTime toDate, int employeeId, int type);

        Task<GetEquipmentUser> GetUserRole(string email);

        Task<AjaxResult> ExportToPdf(int equipmentId);
        Task<AjaxResult> GetEmailAttachment(int id);
    }
}
