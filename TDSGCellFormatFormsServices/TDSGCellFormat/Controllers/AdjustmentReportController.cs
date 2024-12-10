using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.InkML;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using Microsoft.ApplicationInsights.Extensibility.Implementation;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TDSGCellFormat.Common;
using TDSGCellFormat.Helper;
using TDSGCellFormat.Interface.Service;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using static TDSGCellFormat.Common.Enums;

namespace TDSGCellFormat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdjustmentReportController : Controller
    {
        private readonly IAdjustMentReportService _tdsgService;
        private AuthenticationHelper _authBL;
        private readonly TdsgCellFormatDivisionContext _context;
        private readonly AepplNewCloneStageContext _cloneContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        ResponseHelper responseHelper = new ResponseHelper();
        AjaxResult Ajaxresponse = new AjaxResult();

        public AdjustmentReportController(IAdjustMentReportService tdsgService, TdsgCellFormatDivisionContext context, AepplNewCloneStageContext cloneContext, IHttpContextAccessor httpContextAccessor)
        {
            _tdsgService = tdsgService;
            this._context = context;
            this._cloneContext = cloneContext;
            _httpContextAccessor = httpContextAccessor;
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

            var userDetails = await _tdsgService.GetUserRole(email);
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



        [HttpGet("GetAllAdjustmentData")]
        public async Task<IActionResult> GetAllAdjustmentData(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
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

            var res = await _tdsgService.GetAllAdjustmentData(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
            if (res != null)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("MyAdjustmentReq")]
        public async Task<IActionResult> GetAllAdjustmentMyReqData(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
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

            var res = await _tdsgService.GetAllAdjustmentDataMyReq(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
            if (res != null)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }


        [HttpGet("AdjustmentApprovalList")]
        public async Task<IActionResult> GetApprovalList(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
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

            var res = await _tdsgService.GetAllAdjustmentApproverData(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
            if (res != null)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("GetAdjustmentReport")]
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

            var res = _tdsgService.GetAll().ToList();
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

            var res = _tdsgService.GetById(Id);
            if (res != null)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpPost("AddOrUpdate")]
        public async Task<IActionResult> POST(AdjustMentReportRequest report)
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

            var result = await _tdsgService.AddOrUpdateReport(report);
            if (result != null)
            {
                Ajaxresponse = responseHelper.ResponseMessage(result.StatusCode, result.Message, result.ReturnValue);
            }
            else
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotValid), ModelState.Values);
                //return Ok(Ajaxresponse);
            }
            return Ok(Ajaxresponse);
        }

        [HttpDelete("Delete/{Id}")]
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

            var result = await _tdsgService.DeleteReport(Id);
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

        [HttpDelete("DeleteAttachment/{Id}")]
        public async Task<IActionResult> DeleteAttachment(int Id)
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

            var result = await _tdsgService.DeleteAttachment(Id);
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


        [HttpGet("GetEmployeeDetailsById")]
        public async Task<IActionResult> GetEmployeeDetailsById(int id = 0, string email = "")
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

            var result = await _tdsgService.GetEmployeeDetailsById(id, email);
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


        [HttpPost("UpdateApproveAskToAmend")]
        public async Task<IActionResult> UpdateApproveAskToAmend(ApproveAsktoAmend asktoAmend)
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

            var result = await _tdsgService.UpdateApproveAskToAmend(asktoAmend);
            if (result != null)
            {
                Ajaxresponse = responseHelper.ResponseMessage(result.StatusCode, result.Message, result.ReturnValue);
            }
            else
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotValid), ModelState.Values);
                //return Ok(Ajaxresponse);
            }
            return Ok(Ajaxresponse);
        }

        [HttpPost("PullBack")]
        public async Task<IActionResult> PullBackRequest(PullBackRequest data)
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

            var res = await _tdsgService.PullBackRequest(data);
            if (res != null)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, res.Message, res.ReturnValue);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, res.Message, res.ReturnValue);

            return Ok(Ajaxresponse);

        }

        [HttpGet("GetApprorverFlowData")]
        public async Task<IActionResult> GetApproverData(int Id)
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

            var result = await _tdsgService.GeAdjustmentReportWorkFlow(Id);
            if (result != null)
            {
                Ajaxresponse = responseHelper.ResponseMessage(result.StatusCode, result.Message, result.ReturnValue);
            }
            else
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotValid), ModelState.Values);
                //return Ok(Ajaxresponse);
            }
            return Ok(Ajaxresponse);
        }

        [HttpGet("GetCurrentApprover")]
        public async Task<IActionResult> GetCurrentApproverTask(int Id, int userId)
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

            var result = await _tdsgService.GetCurrentApproverTask(Id, userId);
            if (result != null)
            {
                Ajaxresponse = responseHelper.ResponseMessage(result.StatusCode, result.Message, result.ReturnValue);
            }
            else
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotValid), ModelState.Values);
                //return Ok(Ajaxresponse);
            }
            return Ok(Ajaxresponse);
        }

        [HttpGet("AdjustmentExcelListing")]
        public async Task<IActionResult> GetAdjustmentExcel(DateTime fromDate, DateTime todate, int employeeId, int type)
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

            var result = await _tdsgService.GetAdjustmentReportExcel(fromDate, todate, employeeId, type);
            if (result != null)
            {
                Ajaxresponse = responseHelper.ResponseMessage(result.StatusCode, result.Message, result.ReturnValue);
            }
            else
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotValid), ModelState.Values);
                //return Ok(Ajaxresponse);
            }
            return Ok(Ajaxresponse);

        }

        [HttpGet("AdjustmentReportPDF")]
        public async Task<IActionResult> ExportToPdf(int adjustmentreportId)
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

            var result = await _tdsgService.ExportToPdf(adjustmentreportId);
            if (result != null)
            {
                Ajaxresponse = responseHelper.ResponseMessage(result.StatusCode, result.Message, result.ReturnValue);
            }
            else
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotValid), ModelState.Values);
                //return Ok(Ajaxresponse);
            }
            return Ok(Ajaxresponse);
        }

        [HttpGet("GetSectionHead")]
        public async Task<IActionResult> GetSectionHead(int adjustmentreportId)
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

            var result = await _tdsgService.GetSectionHead(adjustmentreportId);
            if (result != null)
            {
                Ajaxresponse = responseHelper.ResponseMessage(result.StatusCode, result.Message, result.ReturnValue);
            }
            else
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotValid), ModelState.Values);
                //return Ok(Ajaxresponse);
            }
            return Ok(Ajaxresponse);
        }

        [HttpGet("GetDepartmentHead")]
        public async Task<IActionResult> GetDepartmentHead(int adjustmentreportId)
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

            var result = await _tdsgService.GetDepartmentHead(adjustmentreportId);
            if (result != null)
            {
                Ajaxresponse = responseHelper.ResponseMessage(result.StatusCode, result.Message, result.ReturnValue);
            }
            else
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotValid), ModelState.Values);
                //return Ok(Ajaxresponse);
            }
            return Ok(Ajaxresponse);
        }

        [HttpGet("GetAdditionalDepartmentHeads")]
        public async Task<IActionResult> GetAdditionalDepartments(int departmentId)
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

            var res = await _tdsgService.GetAdditionalDepartmentHeads(departmentId);
            if (res != null)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }


        [HttpGet("GetHistoryData")]
        public IActionResult GetHistoryData(int adjustmentId)
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

            var result = _tdsgService.GetHistoryData(adjustmentId);

            if (result != null)
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), result);
            }
            else
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), result);
            }
            return Ok(Ajaxresponse);
        }

        #region AdvisorData 
        [HttpGet("GetAdvisorData")]
        public IActionResult GetAdvisorData(int adjustmentReportId)
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

            var res = _tdsgService.GetAdvisorData(adjustmentReportId);
            if (res != null)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }


        [HttpPost("InsertAdvisor")]
        public async Task<IActionResult> AddOrUpdateAdvisorData(AdjustmentAdvisor request)
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

            var result = await _tdsgService.AddOrUpdateAdvisorData(request);
            if (result != null)
            {
                Ajaxresponse = responseHelper.ResponseMessage(result.StatusCode, result.Message, result.ReturnValue);
            }
            else
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotValid), ModelState.Values);
                //return Ok(Ajaxresponse);
            }
            return Ok(Ajaxresponse);
        }

        [HttpGet("CellDepartment")]
     
        public async Task<IActionResult> AdditionalDepartments(int departmentId)
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

            var res = await _tdsgService.GetAdditionalDepartments(departmentId);
            if (res != null)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }
        #endregion

    }
}
