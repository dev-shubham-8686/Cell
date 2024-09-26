using DocumentFormat.OpenXml.Spreadsheet;
using TDSGCellFormat.Interface.Repository;
using TDSGCellFormat.Interface.Service;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Models.View;
using static TDSGCellFormat.Common.Enums;

namespace TDSGCellFormat.Implementation.Service
{
    public class MaterialConsumptionService : BaseService<MaterialConsumptionSlip>, IMaterialConsumptionService
    {
        private readonly IMatrialConsumptionRepository _materialRepository;
        

        public MaterialConsumptionService(IMatrialConsumptionRepository materialRepository)
          : base(materialRepository)
        {
            this._materialRepository = materialRepository;
           
        }

        public Task<object> GetAll(int createdOne, int pageIndex, int pageSize, string order, string orderBy, string searchColumn, string searchValue)
        {
            return _materialRepository.GetMaterialConsumptionList(createdOne, pageIndex, pageSize, order, orderBy, searchColumn, searchValue);
        }

        public Task<object> GetMaterialConsumptionApproverList(int createdOne, int pageIndex, int pageSize, string order, string orderBy, string searchColumn, string searchValue)
        {
            return _materialRepository.GetMaterialConsumptionApproverList(createdOne, pageIndex, pageSize, order, orderBy, searchColumn, searchValue);
        }

        public MaterialConsumptionSlipView GetById(int Id)
        {
            return _materialRepository.GetById(Id);
        }

        public async Task<AjaxResult> AddOrUpdateReport(MaterialConsumptionSlipAdd reportAdd)
        {
            return await _materialRepository.AddOrUpdateReport(reportAdd);
        }
        public async Task<AjaxResult> DeleteReport(int Id)
        {

            return await _materialRepository.DeleteReport(Id);
        }

        public async Task<AjaxResult> UpdateApproveAskToAmend(int ApproverTaskId, int CurrentUserId, ApprovalStatus type, string comment, int materialConsumptionId)
        {

            return await _materialRepository.UpdateApproveAskToAmend(ApproverTaskId,CurrentUserId,type,comment,materialConsumptionId);
        }

        public async Task<AjaxResult> PullBackRequest(int materialConsumptionId, int userId, string comment)
        {
            return await _materialRepository.PullBackRequest(materialConsumptionId, userId,  comment);
        }

        public async Task<List<MaterialConsumptionApproverTaskMasterAdd>> GetMaterialConsumptionWorkFlow(int materialConsumptionId)
        {
            return await _materialRepository.GetMaterialConsumptionWorkFlow(materialConsumptionId);
        }
        public  List<TroubleReportHistoryView> GetHistoryData(int materialConsumptionId)
        {
            return  _materialRepository.GetHistoryData(materialConsumptionId);
        }

        public ApproverTaskId_dto GetCurrentApproverTask(int materialConsumptionId, int userId)
        {
            return _materialRepository.GetCurrentApproverTask(materialConsumptionId, userId);
        }
        public async Task<AjaxResult> CloseMaterial(ScrapNoteAdd report)
        {
            return await _materialRepository.CloseMaterial(report);
        }
        public async Task<AjaxResult> ExportMaterialConsumptionToExcel(int materialConsumptionId)
        {
            return await _materialRepository.ExportMaterialConsumptionToExcel(materialConsumptionId);
        }
        public async Task<AjaxResult> ExportToPdf(int materialConsumptionId)
        {
            return await _materialRepository.ExportToPdf(materialConsumptionId);
        }

        //new pne 
        public async Task<List<MaterialConsumptionListView>> GetMaterialConsumptionList1(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
        {
            return await _materialRepository.GetMaterialConsumptionList1(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
        }
    }
}
