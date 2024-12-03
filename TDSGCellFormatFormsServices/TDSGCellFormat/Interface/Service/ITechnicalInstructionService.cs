using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Models.View;

namespace TDSGCellFormat.Interface.Service
{
    public interface ITechnicalInstructionService : IBaseService<TechnicalInstructionSheet>
    {
        IQueryable<TechnicalInstructionAdd> GetAll();

        Task<string> GetTechnicalInsurtuctionListUpdate(int createdBy, int skip, int take, string order, string orderBy, string searchColumn, string searchValue);
        Task<string> GetTechnicalInstructionList(int createdBy, int skip, int take, string order, string orderBy, string searchColumn, string searchValue);
        Task<string> GetTechnicalInstructionApproverList(int createdOne, int pageIndex, int pageSize, string order, string orderBy, string searchColumn, string searchValue);
        TechnicalInstructionView GetById(int Id);
        Task<AjaxResult> DeleteReport(int Id);
        Task<AjaxResult> AddOrUpdateReport(TechnicalInstructionAdd report);
        Task<IEnumerable<EquipmentMasterView>> GetEquipmentMasterList();
        Task<AjaxResult> DeleteTechnicalAttachment(int TechnicalAttachmentId);
        Task<AjaxResult> DeleteTechnicalOutlineAttachment(int TechnicalOutlineAttachmentId);
        Task<AjaxResult> CreateTechnicalAttachment(TechnicalAttachmentAdd technicalAttachmentAdd);
        Task<AjaxResult> CreateTechnicalOutlineAttachment(TechnicalOutlineAttachmentAdd technicalOutlineAttachmentAdd);
        Task<AjaxResult> UpdateApproveAskToAmend(int ApproverTaskId, int CurrentUserId, ApprovalStatus type, string comment, int technicalId);
        Task<AjaxResult> PullBackRequest(int technicalId, int userId, string comment);
        Task<List<TechnicalInstructionTaskMasterAdd>> GetTechnicalInstructionWorkFlow(int technicalId);

        Technical_ApproverTaskId_dto GetCurrentApproverTask(int technicalId, int userId);

        List<TechnicalHistoryView> GetHistoryData(int technicalId);

        Task<AjaxResult> ExportTechnicalInstructionToExcel(int technicalId);

        Task<AjaxResult> ExportToPdf(int technicalId);

        Task<AjaxResult> GetTechnicalInstructionExcel(DateTime fromDate, DateTime toDate, int employeeId, int type);

        Task<AjaxResult> CloseTechnical(Technical_ScrapNoteAdd report);

        Task<AjaxResult> ReOpenTechnicalForm(int technicalId, int userId);

        Task<string> GetReviseDataListing(int troubleReportId);
        IQueryable<SectionHeadSelectionView> GetAllSections();

        Task<AjaxResult> DeleteTechnicalClosureAttachment(int TechnicalClosureAttachmentId);

        IQueryable<TechnicalEmployeeMasterView> GetAllEmployee();

        Task<AjaxResult> ChangeRequestOwner(int technicalId, int userId);

        Task<AjaxResult> UpdateOutlineEditor(UpdateOutlineEditor updateOutlineEditor);

        Task<AjaxResult> ExportToPdf_v2(int technicalId);

        Task<NotifyCellDivPartView> NotifyCellDivPart(int technicalId);
    }
}
