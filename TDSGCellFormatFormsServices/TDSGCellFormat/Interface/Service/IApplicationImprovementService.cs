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
        Task<List<EquipmentImprovementView>> GetEqupimentImprovementApproverList(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue);
        Task<AjaxResult> PullBackRequest(EquipmentPullBack data);
        Task<AjaxResult> UpdateApproveAskToAmend(EquipmentApproveAsktoAmend data);
        Task<AjaxResult> UpdateTargetDates(EquipmentApprovalData data);

        EquipmentApprovalData GetEquipmentTargetDate(int equipmentId, bool toshibaDiscussion);
    }
}
