using DocumentFormat.OpenXml.Drawing;
using DocumentFormat.OpenXml.Office2010.Excel;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using TDSGCellFormat.Common;
using TDSGCellFormat.Helper;
using TDSGCellFormat.Implementation.Service;
using TDSGCellFormat.Interface.Repository;
using TDSGCellFormat.Interface.Service;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using static TDSGCellFormat.Common.Enums;

namespace TDSGCellFormat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TroubleReportController : Controller
    {
        private readonly ITroubleReportService _troubleService;
        private AuthenticationHelper _authBL;
        private readonly TdsgCellFormatDivisionContext _context;
        private readonly AepplNewCloneStageContext _cloneContext;
        private readonly IHttpContextAccessor _httpContextAccessor;
        ResponseHelper responseHelper = new ResponseHelper();
        AjaxResult Ajaxresponse = new AjaxResult();

        public TroubleReportController(ITroubleReportService troubleService, TdsgCellFormatDivisionContext context, AepplNewCloneStageContext cloneContext, IHttpContextAccessor httpContextAccessor)
        {
            _troubleService = troubleService;
            this._context = context;
            this._cloneContext = cloneContext;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost("GetLoginSession")]
        public ActionResult<string> GetLoginSession([FromBody] AuthParameter model)
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            var sessionResult = authHelper.CreateAuthSession(model.parameter, model.type);
            return Ok(sessionResult);
        }

        [HttpGet("Get")]
        public async Task<IActionResult> Get()
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            var res = _troubleService.GetAll().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("GetById")]
        public IActionResult GetById(int Id)
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            var res = _troubleService.GetById(Id);
            if (res != null)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("GetCurrentApprover")]
        public IActionResult GetCurrentApproverTask(int troubleReportId, int userId)
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            var data = _troubleService.GetCurrentApproverTask(troubleReportId, userId);
            return Ok(data);
        }

        [HttpPost("AddOrUpdate")]
        public async Task<IActionResult> POST(TroubleReportAdd report)
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            if (ModelState.IsValid)
            {
                var result = await _troubleService.AddOrUpdateReport(report);
                if (result != null)
                {
                    Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, result.Message, result.ReturnValue);
                }
                return Ok(Ajaxresponse);
            }
            else
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotValid), ModelState.Values);
                return Ok(Ajaxresponse);
            }

        }

        [HttpDelete("Delete")]

        public async Task<IActionResult> Delete(int Id)
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            var result = await _troubleService.DeleteReport(Id);
            if (result.StatusCode == Status.Success)
            {
                Ajaxresponse = responseHelper.ResponseMessage(result.StatusCode, result.Message, result.ReturnValue);
            }
            else
            {
                Ajaxresponse = responseHelper.ResponseMessage(result.StatusCode, result.Message, result.ReturnValue);
            }
            return Ok(Ajaxresponse);
        }

        [HttpGet("Trouble")]
        public async Task<IActionResult> GetTroubleListingScreen(
        int createdOne, int pageIndex, int pageSize, string order = "", string orderBy = "", string searchColumn = "", string searchValue = "")
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            var result = await _troubleService.GetTroubleListingScreen(createdOne, pageIndex, pageSize, order, orderBy, searchColumn, searchValue);
            return Ok(result);
        }

        [HttpGet("TroubleReview")]
        public async Task<IActionResult> GetReviewListingScreen(
        int createdOne, int pageIndex, int pageSize, string order = "", string orderBy = "", string searchColumn = "", string searchValue = "")
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            var result = await _troubleService.GetReviewListingScreen(createdOne, pageIndex, pageSize, order, orderBy, searchColumn, searchValue);
            return Ok(result);
        }

        [HttpGet("TroubleReviseList")]
        public async Task<IActionResult> GetReviseDataListing(int troubleReportId)
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            var result = await _troubleService.GetReviseDataListing(troubleReportId);
            return Ok(result);
        }


        [HttpGet("TroubleApprover")]
        public async Task<IActionResult> GetApproverListingScreen(
        int createdOne, int pageIndex, int pageSize, string order = "", string orderBy = "", string searchColumn = "", string searchValue = "")
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            var result = await _troubleService.GetApproverListingScreen(createdOne, pageIndex, pageSize, order, orderBy, searchColumn, searchValue);
            return Ok(result);
        }

        [HttpPost("SubmitRequest")]

        public async Task<IActionResult> SubmitRequest(TroubleReport_OnSubmit onSubmit)
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            var result = await _troubleService.SubmitRequest(onSubmit);
            return Ok(result);
        }
        [HttpPost("TroubleReopen")]
        public async Task<IActionResult> ReOpenTroubleForm(int troubleReportId, int userId)
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            var result = await _troubleService.ReOpenTroubleForm(troubleReportId, userId);
            return Ok(result);
        }

        [HttpPost("UpdateApproveAskToAmend")]
        public async Task<IActionResult> UpdateApproveAskToAmend(int ApproverTaskId, int CurrentUserId, ApprovalStatus type, string comment, int troubleReportId)
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            var result = await _troubleService.UpdateApproveAskToAmend(ApproverTaskId, CurrentUserId, type, comment, troubleReportId);
            return Ok(result);
        }

        [HttpPost("PullBack")]
        public async Task<IActionResult> PullbackRequest(int troubleReportId, int userId, string comment)
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            var result = await _troubleService.PullbackRequest(troubleReportId, userId, comment);
            return Ok(result);
        }

        [HttpGet("ApprorverData")]
        public async Task<IActionResult> GetTroubelReportApproverData(int troubelReportId)
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            var data = await _troubleService.GetTroubelReportApproverData(troubelReportId);
            return Ok(data);
        }

        [HttpPost("SendToManager")]
        public async Task<IActionResult> SendManager(int troubleReportId, int userId)
        {
            //AjaxResult authResult;
            //bool isValidAuth = true;

            //if (!isValidAuth)
            //{
            //    // Return unauthorized response if authentication fails
            //    var unauthorizedResponse = responseHelper.ResponseMessage(Enums.Status.Error, "In valid", null);
            //    return Unauthorized(unauthorizedResponse);
            //}
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            var data = await _troubleService.SendManager(troubleReportId, userId);
            return Ok(data);
        }

        [HttpPost("NotifyWorkDoneMembers")]
        public async Task<IActionResult> NotifyWorkDoneMembers(int troubleReportId, int userId)
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            var data = await _troubleService.NotifyWorkDoneMembers(troubleReportId, userId);
            return Ok(data);
        }

        [HttpPost("ReviewByManagers")]
        public async Task<IActionResult> ReviewByManagers(int troubleReportId, int userId)
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            var data = await _troubleService.ReviewByManagers(troubleReportId, userId);
            return Ok(data);
        }

        [HttpPost("ManagerReviewTask")]
        public async Task<IActionResult> ManagerReviewTask(int troubleReportId, int userId, string status, string comment)
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            var data = await _troubleService.ManagerReviewTask(troubleReportId, userId, status, comment);
            return Ok(data);
        }

        [HttpGet("GetHistoryData")]
        public IActionResult GetHistoryData(int troubleReportId)
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            var data = _troubleService.GetHistoryData(troubleReportId);
            return Ok(data);
        }


        [HttpGet("GetTroubleInernalFlow")]
        public IActionResult GetTroubleInernalFlow(int troubleReportId)
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            var data = _troubleService.GetTroubleInernalFlow(troubleReportId);
            return Ok(data);
        }

        [HttpGet("GetCurrentTask")]
        public IActionResult GetCurrentTask(int troubleReportId, int userId)
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }
            var data = _troubleService.GetCurrentTask(troubleReportId, userId);
            return Ok(data);
        }

        [HttpGet("GetUserRole")]
        public async Task<IActionResult> GetUserRole(string email)
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            if (!isValidAuth)
            {
                // Return unauthorized response if authentication fails
                Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                return Unauthorized(Ajaxresponse);
            }

            var userDetails = await _troubleService.GetUserRole(email);
            if (userDetails == null)
            {
                AjaxResult result = new AjaxResult();
                result.ResultType = (int)MessageType.NotAuthorize;
                result.StatusCode = Status.NotAuthorize;
                result.Message = Enums.TroubleAuthorization;

                return NotFound(result);
            }
            return Ok(userDetails);
        }

        [HttpGet("TroubleExcel")]

        public async Task<IActionResult> GetTroubleReportExcel(DateTime fromDate, DateTime todate, int employeeId, int type)
        {
            var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            // Call the IsValidAuthentication method
            AjaxResult authResult;
            bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            try
            {
                if (!isValidAuth)
                {
                    // Return unauthorized response if authentication fails
                    Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
                    return Unauthorized(Ajaxresponse);
                }

                var result = await _troubleService.GetTroubleReportExcel(fromDate, todate, employeeId, type);
                if (result.StatusCode == Status.Success)
                {
                    Ajaxresponse = responseHelper.ResponseMessage(result.StatusCode, result.Message, result.ReturnValue);
                }
                else
                {
                    Ajaxresponse = responseHelper.ResponseMessage(result.StatusCode, result.Message, result.ReturnValue);
                    //var commonHelper = new CommonHelper(_context);
                    //commonHelper.LogException(ex, "GetTroubleReportExcel");
                }
                return Ok(Ajaxresponse);
            }
            catch (Exception ex)
            {
                //res.Message = "Fail " + ex;
                //res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "GetTroubleReportExcel");
                Ajaxresponse = new AjaxResult
                {
                    StatusCode = Status.Error,
                    Message = "Failed to generate report: " + ex.Message
                };

                // Return the error response
                return StatusCode(StatusCodes.Status500InternalServerError, Ajaxresponse);
            }
        }
    }
}
