using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Buffers;
using TDSGCellFormat.Interface.Repository;
using TDSGCellFormat.Interface.Service;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
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

        public Task<AjaxResult> GetAllAdjustmentData(
         int pageIndex, int pageSize, int createdBy = 0, string sortColumn = "", string orderBy = "", string searchValue = "")
        {
            return _adjustMentRepository.GetAllAdjustmentData(pageIndex, pageSize, createdBy, sortColumn, orderBy, searchValue);
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

        public async Task<AjaxResult> GetAdjustmentReportApproverList(int pageIndex, int pageSize, int createdBy = 0, string sortColumn = "", string orderBy = "DESC", string searchValue = "")
        {
            return await _adjustMentRepository.GetAdjustmentReportApproverList(pageIndex, pageSize, createdBy, sortColumn , orderBy , searchValue );
        }

        public async Task<AjaxResult> UpdateApproveAskToAmend(int ApproverTaskId, int CurrentUserId, ApprovalStatus type, string comment, int Id)
        {
            return await _adjustMentRepository.UpdateApproveAskToAmend(ApproverTaskId, CurrentUserId, type, comment, Id);
        }

        public async Task<AjaxResult> PullBackRequest(int Id, int userId, string comment)
        {
            return await _adjustMentRepository.PullBackRequest(Id, userId, comment);
        }

        public async Task<AjaxResult> GeAdjustmentReportWorkFlow(int Id)
        {
            return await _adjustMentRepository.GeAdjustmentReportWorkFlow(Id);
        }

        public async Task<AjaxResult> GetCurrentApproverTask(int Id, int userId)
        {
            return await _adjustMentRepository.GetCurrentApproverTask(Id, userId);
        }
    }
}
