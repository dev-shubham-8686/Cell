using TDSGCellFormat.Interface.Service;
using TDSGCellFormat.Models;
using AutoMapper;
using TDSGCellFormat.Interface.Repository;
using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Models.View;

namespace TDSGCellFormat.Implementation.Service
{
    public class ApplicationImprovementService : BaseService<EquipmentImprovementApplication>, IApplicationImprovementService
    {
        private readonly IApplicationImprovementRepository _applicationRepo;

        public ApplicationImprovementService(IApplicationImprovementRepository applicationRepo)
          : base(applicationRepo)
        {
            this._applicationRepo = applicationRepo;

        }

        public IQueryable<EquipmentImprovementApplicationAdd> GetAll()
        {
            return _applicationRepo.GetAll();
        }

        public EquipmentImprovementApplicationAdd GetById(int Id)
        {
            return _applicationRepo.GetById(Id);
        }

        public async Task<AjaxResult> AddOrUpdateReport(EquipmentImprovementApplicationAdd reportAdd)
        {
            //var report = _mapper.Map<ApplicationEquipmentImprovement>(reportAdd);
            return await _applicationRepo.AddOrUpdateReport(reportAdd);
        }

        public async Task<AjaxResult> DeleteReport(int Id)
        {

            return await _applicationRepo.DeleteReport(Id);
        }

        public async Task<List<EquipmentImprovementView>> GetEqupimentImprovementList(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
        {
            return await _applicationRepo.GetEqupimentImprovementList(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
        }

        public async Task<List<EquipmentImprovementApproverView>> GetEqupimentImprovementApproverList(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
        {
            return await _applicationRepo.GetEqupimentImprovementApproverList(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
        }
        public async Task<AjaxResult> PullBackRequest(EquipmentPullBack data)
        {
           return await _applicationRepo.PullBackRequest(data);
        }
        public async Task<AjaxResult> UpdateApproveAskToAmend(EquipmentApproveAsktoAmend data)
        {
            return await _applicationRepo.UpdateApproveAskToAmend(data);
        }

        public async Task<AjaxResult> UpdateTargetDates(EquipmentApprovalData data)
        {
            return await _applicationRepo.UpdateTargetDates(data);
        }
        public EquipmentApprovalData GetEquipmentTargetDate(int equipmentId, bool toshibaDiscussion)
        {
            return _applicationRepo.GetEquipmentTargetDate(equipmentId, toshibaDiscussion);
        }

        public async Task<List<EquipmentApproverTaskMasterAdd>> GetEquipmentWorkFlowData(int equipmentId)
        {
            return await _applicationRepo.GetEquipmentWorkFlowData(equipmentId);
        }

        public ApproverTaskId_dto GetCurrentApproverTask(int equipmentId, int userId)
        {
            return _applicationRepo.GetCurrentApproverTask(equipmentId, userId);
        }
    }
}