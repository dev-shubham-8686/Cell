using TDSGCellFormat.Interface.Service;
using TDSGCellFormat.Models;
using AutoMapper;
using TDSGCellFormat.Interface.Repository;
using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Models.View;

namespace TDSGCellFormat.Implementation.Service
{
    public class TechnicalInstructionService : BaseService<TechnicalInstructionSheet>, ITechnicalInstructionService
    {
        private readonly ITechnicalInsurtuctionRepository _technicalRepository;


        public TechnicalInstructionService(ITechnicalInsurtuctionRepository technicalRepository)
          : base(technicalRepository)
        {
            this._technicalRepository = technicalRepository;

        }

        public IQueryable<TechnicalInstructionAdd> GetAll()
        {
            return _technicalRepository.GetAll();
        }

        public async Task<string> GetTechnicalInstructionList(int createdOne, int pageIndex, int pageSize, string order, string orderBy, string searchColumn, string searchValue)
        {
            return await _technicalRepository.GetTechnicalInstructionList(createdOne, pageIndex, pageSize, order, orderBy, searchColumn, searchValue);
        }

        public async Task<string> GetTechnicalInsurtuctionListUpdate(int createdOne, int pageIndex, int pageSize, string order, string orderBy, string searchColumn, string searchValue)
        {
            return await _technicalRepository.GetTechnicalInsurtuctionListUpdate(createdOne, pageIndex, pageSize, order, orderBy, searchColumn, searchValue);
        }

        public async Task<string> GetTechnicalInstructionApproverList(int createdOne, int pageIndex, int pageSize, string order, string orderBy, string searchColumn, string searchValue)
        {
            return await _technicalRepository.GetTechnicalInstructionApproverList(createdOne, pageIndex, pageSize, order, orderBy, searchColumn, searchValue);
        }

        public async Task<IEnumerable<EquipmentMasterView>> GetEquipmentMasterList()
        {
            return await _technicalRepository.GetEquipmentMasterList();
        }

        public TechnicalInstructionView GetById(int Id)
        {
            return _technicalRepository.GetById(Id);
        }

        public async Task<AjaxResult> AddOrUpdateReport(TechnicalInstructionAdd reportAdd)
        {
            //var report = _mapper.Map<TechnicalInstructionSheet>(reportAdd);
            return await _technicalRepository.AddOrUpdateReport(reportAdd);
        }

        public async Task<AjaxResult> DeleteReport(int Id)
        {

            return await _technicalRepository.DeleteReport(Id);
        }



        public async Task<AjaxResult> DeleteTechnicalAttachment(int TechnicalAttachmentId)
        {
            return await _technicalRepository.DeleteTechnicalAttachment(TechnicalAttachmentId);
        }

        public async Task<AjaxResult> CreateTechnicalAttachment(TechnicalAttachmentAdd technicalAttachmentAdd)
        {
            return await _technicalRepository.CreateTechnicalAttachment(technicalAttachmentAdd);
        }

        public async Task<AjaxResult> PullBackRequest(int technicalId, int userId, string comment)
        {
            return await _technicalRepository.PullBackRequest(technicalId, userId, comment);
        }

        public async Task<AjaxResult> UpdateApproveAskToAmend(int ApproverTaskId, int CurrentUserId, ApprovalStatus type, string comment, int technicalId)
        {
            return await _technicalRepository.UpdateApproveAskToAmend(ApproverTaskId, CurrentUserId, type, comment, technicalId);
        }

        public async Task<List<TechnicalInstructionTaskMasterAdd>> GetTechnicalInstructionWorkFlow(int technicalId)
        {
            return await _technicalRepository.GetTechnicalInstructionWorkFlow(technicalId);
        }

        public Technical_ApproverTaskId_dto GetCurrentApproverTask(int technicalId, int userId)
        {
            return _technicalRepository.GetCurrentApproverTask(technicalId, userId);
        }

        public List<TechnicalHistoryView> GetHistoryData(int technicalId)
        {
            return _technicalRepository.GetHistoryData(technicalId);
        }

        public async Task<AjaxResult> ExportTechnicalInstructionToExcel(int technicalId)
        {
            return await _technicalRepository.ExportTechnicalInstructionToExcel(technicalId);
        }

        public async Task<AjaxResult> ExportToPdf(int technicalId)
        {
            return await _technicalRepository.ExportToPdf(technicalId);
        }

        public async Task<AjaxResult> GetTechnicalInstructionExcel(DateTime fromDate, DateTime toDate, int employeeId, int type)
        {
            return await _technicalRepository.GetTechnicalInstructionExcel(fromDate, toDate, employeeId, type);
        }

        public async Task<AjaxResult> CloseTechnical(Technical_ScrapNoteAdd report)
        {
            return await _technicalRepository.CloseTechnical(report);
        }

        public async Task<AjaxResult> ReOpenTechnicalForm(int technicalId, int userId)
        {
            return await _technicalRepository.ReOpenTechnicalForm(technicalId, userId);
        }

        public async Task<string> GetReviseDataListing(int technicalId)
        {
            return await _technicalRepository.GetReviseDataListing(technicalId);
        }

        public async Task<AjaxResult> DeleteTechnicalOutlineAttachment(int TechnicalOutlineAttachmentId)
        {
            return await _technicalRepository.DeleteTechnicalOutlineAttachment(TechnicalOutlineAttachmentId);
        }

        public async Task<AjaxResult> CreateTechnicalOutlineAttachment(TechnicalOutlineAttachmentAdd technicalOutlineAttachmentAdd)
        {
            return await _technicalRepository.CreateTechnicalOutlineAttachment(technicalOutlineAttachmentAdd);
        }

        public IQueryable<SectionHeadSelectionView> GetAllSections()
        {
            return _technicalRepository.GetAllSections();
        }

        public async Task<AjaxResult> DeleteTechnicalClosureAttachment(int TechnicalClosureAttachmentId)
        {
            return await _technicalRepository.DeleteTechnicalClosureAttachment(TechnicalClosureAttachmentId);
        }

        public IQueryable<TechnicalEmployeeMasterView> GetAllEmployee()
        {
            return _technicalRepository.GetAllEmployee();
        }

        public async Task<AjaxResult> ChangeRequestOwner(int technicalId, int userId)
        {
            return await _technicalRepository.ChangeRequestOwner(technicalId, userId);
        }

        public async Task<AjaxResult> UpdateOutlineEditor(UpdateOutlineEditor updateOutlineEditor)
        {
            return await _technicalRepository.UpdateOutlineEditor(updateOutlineEditor);
        }

    }
}
