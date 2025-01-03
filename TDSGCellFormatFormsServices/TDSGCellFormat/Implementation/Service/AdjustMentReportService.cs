using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Buffers;
using TDSGCellFormat.Interface.Repository;
using TDSGCellFormat.Interface.Service;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Models.View;
using static TDSGCellFormat.Common.Enums;

namespace TDSGCellFormat.Implementation.Service
{
    public class AdjustMentReporttService : BaseService<AdjustmentReport>, IAdjustMentReportService
    {
        private readonly IAdjustMentReportRepository _adjustMentRepository;

        public AdjustMentReporttService(IAdjustMentReportRepository tdsgRepository)
          : base(tdsgRepository)
        {
            this._adjustMentRepository = tdsgRepository;
        }

        public Task<GetEquipmentUser> GetUserRole(string email)
        {
            return _adjustMentRepository.GetUserRole(email);
        }

        public async Task<List<AdjustmentReportView>> GetAllAdjustmentData(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
        {
            return await _adjustMentRepository.GetAllAdjustmentData(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
        }

        public async Task<List<AdjustmentReportView>> GetAllAdjustmentDataMyReq(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
        {
            return await _adjustMentRepository.GetAllAdjustmentDataMyReq(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
        }

        public async Task<List<AdjustmentReportApproverView>> GetAllAdjustmentApproverData(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
        {
            return await _adjustMentRepository.GetAllAdjustmentApproverData(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
        }

        public IQueryable<AdjustMentReportRequest> GetAll()
        {
            return _adjustMentRepository.GetAll();
        }

        public AdjustMentReportRequest GetById(int Id)
        {
            return _adjustMentRepository.GetById(Id);
        }

        public async Task<AjaxResult> AddOrUpdateReport(AdjustMentReportRequest reportAdd)
        {
            //var report = _mapper.Map<AdjustmentReport>(reportAdd);
            return await _adjustMentRepository.AddOrUpdateReport(reportAdd);
        }

        public async Task<AjaxResult> DeleteReport(int Id)
        {

            return await _adjustMentRepository.DeleteReport(Id);
        }

        public async Task<AjaxResult> DeleteAttachment(int Id)
        {
            return await _adjustMentRepository.DeleteAttachment(Id);
        }

        public async Task<AjaxResult> GetEmployeeDetailsById(int id, string email)
        {
            return await _adjustMentRepository.GetEmployeeDetailsById(id, email);
        }


        public async Task<AjaxResult> UpdateApproveAskToAmend(ApproveAsktoAmend asktoAmend)
        {
            return await _adjustMentRepository.UpdateApproveAskToAmend(asktoAmend);
        }

        public async Task<AjaxResult> PullBackRequest(PullBackRequest data)
        {
            return await _adjustMentRepository.PullBackRequest(data);
        }

        public async Task<AjaxResult> GeAdjustmentReportWorkFlow(int Id)
        {
            return await _adjustMentRepository.GeAdjustmentReportWorkFlow(Id);
        }

        public async Task<AjaxResult> GetCurrentApproverTask(int Id, int userId)
        {
            return await _adjustMentRepository.GetCurrentApproverTask(Id, userId);
        }

        public async Task<AjaxResult> GetAdjustmentReportExcel(DateTime fromDate, DateTime todate, int employeeId, int type)
        {
            return await _adjustMentRepository.GetAdjustmentReportExcel(fromDate, todate, employeeId, type);
        }

        public async Task<AjaxResult> ExportToPdf(int adjustmentreportId)
        {
            return await _adjustMentRepository.ExportToPdf(adjustmentreportId);
        }

        public async Task<AjaxResult> GetSectionHead(int adjustmentReportId)
        {
            return await _adjustMentRepository.GetSectionHead(adjustmentReportId);
        }

        public async Task<AjaxResult> GetDepartmentHead(int adjustmentReportId)
        {
            return await _adjustMentRepository.GetDepartmentHead(adjustmentReportId);
        }

        public async Task<List<DepartmentHeadsView>> GetAdditionalDepartmentHeads(int departmentId)
        {
            return await _adjustMentRepository.GetAdditionalDepartmentHeads(departmentId);
        }

        public async Task<List<CellDepartment>> GetAdditionalDepartments(int departmentId)
        {
            return await _adjustMentRepository.GetAdditionalDepartments(departmentId);
        }

        public List<TroubleReportHistoryView> GetHistoryData(int adjustmentId)
        {
            return  _adjustMentRepository.GetHistoryData(adjustmentId);
        }

        public async Task<AjaxResult> AddOrUpdateAdvisorData(AdjustmentAdvisor request)
        {
            return await _adjustMentRepository.AddOrUpdateAdvisorData(request);
        }

        public AdjustmentAdvisor GetAdvisorData(int adjustmentReportId)
        {
            return _adjustMentRepository.GetAdvisorData(adjustmentReportId);
        }

        public async Task<AjaxResult> InsertDelegate(DelegateUser request)
        {
            return await _adjustMentRepository.InsertDelegate(request);
        }
    }
}
