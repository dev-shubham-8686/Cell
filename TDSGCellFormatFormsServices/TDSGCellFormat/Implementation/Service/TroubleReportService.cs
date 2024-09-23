using AutoMapper;
using TDSGCellFormat.Interface.Repository;
using TDSGCellFormat.Interface.Service;
using TDSGCellFormat.Models;
using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Models.View;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Spreadsheet;

namespace TDSGCellFormat.Implementation.Service
{
    public class TroubleReportService : BaseService<TroubleReports>, ITroubleReportService
    {
        private readonly ITroubleReportRepository _troubleRepository;

        public TroubleReportService(ITroubleReportRepository troubleRepository)
          : base(troubleRepository)
        {
            this._troubleRepository = troubleRepository;
        }

        public List<TroubleReportAdd> GetAll()
        {
            return _troubleRepository.GetAll();
        }

        public TroubleReportAdd GetById(int Id)
        {
            return _troubleRepository.GetById(Id);
        }

        public async Task<AjaxResult> AddOrUpdateReport(TroubleReportAdd reportAdd)
        {
           // var report = _mapper.Map<TroubleReport>(reportAdd);
            return await _troubleRepository.AddOrUpdateReport(reportAdd);
        }

        public async Task<AjaxResult> DeleteReport(int Id)
        {

            return await _troubleRepository.DeleteReport(Id);
        }

        public async Task<string> GetTroubleListingScreen(int createdOne, int pageIndex, int pageSize, string order, string orderBy, string searchColumn, string searchValue)
        {
            return await _troubleRepository.GetTroubleListingScreen(createdOne, pageIndex, pageSize, order, orderBy, searchColumn, searchValue);
        }

        public async Task<string> GetReviseDataListing(int troubleReportId)
        {
            return await _troubleRepository.GetReviseDataListing(troubleReportId);
        }

        public async Task<string> GetReviewListingScreen(int createdOne, int pageIndex, int pageSize, string order, string orderBy, string searchColumn, string searchValue)
        {
            return await _troubleRepository.GetReviewListingScreen(createdOne, pageIndex, pageSize, order, orderBy, searchColumn, searchValue);
        }

        public async Task<string> GetApproverListingScreen(int createdOne, int pageIndex, int pageSize, string order, string orderBy, string searchColumn, string searchValue)
        {
            return await _troubleRepository.GetApproverListingScreen(createdOne, pageIndex, pageSize, order, orderBy, searchColumn, searchValue);
        }
        public async Task<AjaxResult> SubmitRequest(TroubleReport_OnSubmit onSubmit)
        {
            return await _troubleRepository.SubmitRequest(onSubmit);
        }

        public ApproverTaskId_dto GetCurrentApproverTask(int troubleReportId, int userId)
        {
            return  _troubleRepository.GetCurrentApproverTask(troubleReportId, userId);
        }
        public async Task<AjaxResult> UpdateApproveAskToAmend(int ApproverTaskId, int CurrentUserId, ApprovalStatus type, string comment, int troubleReportId)
        {
            return await _troubleRepository.UpdateApproveAskToAmend(ApproverTaskId, CurrentUserId, type, comment,troubleReportId);
        }
        public async Task<AjaxResult> PullbackRequest(int troubleReportId, int userId, string comment)
        {
            return await _troubleRepository.PullbackRequest(troubleReportId, userId, comment);
        }

        public async Task<List<TroubleReportApproverTaskMasterAdd>> GetTroubelReportApproverData(int troubelReportId)
        {
            return await _troubleRepository.GetTroubelReportApproverData(troubelReportId);
        }


        public async Task<AjaxResult> SendManager(int troubleReportId, int userId)
        {
            return await _troubleRepository.SendManager(troubleReportId,userId);
        }
        public async Task<AjaxResult> NotifyWorkDoneMembers(int troubleReportId, int userId)
        {
            return await _troubleRepository.NotifyWorkDoneMembers(troubleReportId, userId);
        }

        public async Task<AjaxResult> ReviewByManagers(int troubleReportId, int userId)
        {
            return await _troubleRepository.ReviewByManagers(troubleReportId, userId);
        }
        public async Task<AjaxResult> ManagerReviewTask(int troubleReportId, int userId, string status,string comment)
        {
            return await _troubleRepository.ManagerReviewTask(troubleReportId, userId,status,comment);
        }
        public List<TroubleReportHistoryView> GetHistoryData(int troubleReportId)
        {
            return  _troubleRepository.GetHistoryData(troubleReportId);
        }
        public List<TroubleReportInternalFlowView> GetTroubleInernalFlow(int troubleReportId)
        {
            return _troubleRepository.GetTroubleInernalFlow(troubleReportId);
        }
        public Task<GetUserDetailsView> GetUserRole(string email)
        {
            return _troubleRepository.GetUserRole(email);
        }

        public TroubleReportInternalFlowView GetCurrentTask(int troubleReportId, int userId)
        {
            return _troubleRepository.GetCurrentTask(troubleReportId, userId);
        }

        public Task<AjaxResult> ReOpenTroubleForm(int troubleReportId,int userId)
        {
            return _troubleRepository.ReOpenTroubleForm(troubleReportId, userId);
        }

        public async Task<AjaxResult> GetTroubleReportExcel(DateTime fromDate, DateTime toDate, int employeeId, int type)
        {
            return await _troubleRepository.GetTroubleReportExcel(fromDate, toDate,employeeId,type);
        }
    }
}

