using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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
    public class EquipmentImprovementController : Controller
    {
        private readonly IApplicationImprovementService _applicationService;
        private AuthenticationHelper _authBL;
        private readonly TdsgCellFormatDivisionContext _context;
        private readonly AepplNewCloneStageContext _cloneContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        ResponseHelper responseHelper = new ResponseHelper();
        AjaxResult Ajaxresponse = new AjaxResult();

        public EquipmentImprovementController(IApplicationImprovementService applicationService, TdsgCellFormatDivisionContext context, AepplNewCloneStageContext cloneContext, IHttpContextAccessor httpContextAccessor)
        {
            _applicationService = applicationService;
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

            var userDetails = await _applicationService.GetUserRole(email);
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
            var res = _applicationService.GetAll().ToList();
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

            var res = _applicationService.GetById(Id);
            if (res != null)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpPost("AddOrUpdate")]
        public async Task<IActionResult> POST(EquipmentImprovementApplicationAdd report)
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
                var result = await _applicationService.AddOrUpdateReport(report);
                if (result != null)
                {
                    Ajaxresponse = responseHelper.ResponseMessage(result.StatusCode, result.Message, result.ReturnValue);
                }
                else
                {
                    Ajaxresponse = responseHelper.ResponseMessage(result.StatusCode, result.Message, result.ReturnValue);

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

            var result = await _applicationService.DeleteReport(Id);
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

        [HttpGet("EqupimentList")]
        public async Task<IActionResult> GetEqupimentImprovementList(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
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
            var res = await _applicationService.GetEqupimentImprovementList(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
            if (res != null)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("EqupimentApproverList")]
        public async Task<IActionResult> GetEqupimentImprovementApproverList(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
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

            var res = await _applicationService.GetEqupimentImprovementApproverList(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
            if (res != null)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpPost("Pullback")]
        public async Task<IActionResult> PullBackRequest(EquipmentPullBack data)
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

            var res = await _applicationService.PullBackRequest(data);
            if (res != null)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, res.Message, res.ReturnValue);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, res.Message, res.ReturnValue);

            return Ok(Ajaxresponse);
        }

        [HttpPost("UpdateApproveAskToAmend")]
        public async Task<IActionResult> UpdateApproveAskToAmend(EquipmentApproveAsktoAmend data)
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

            var res = await _applicationService.UpdateApproveAskToAmend(data);
            if (res != null)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, res.Message, res.ReturnValue);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, res.Message, res.ReturnValue);

            return Ok(Ajaxresponse);
        }

        [HttpPost("UpdateTargetData")]
        public async Task<IActionResult> UpdateTargetDates(EquipmentApprovalData data)
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

            var res = await _applicationService.UpdateTargetDates(data);
            if (res != null)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, res.Message, res.ReturnValue);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, res.Message, res.ReturnValue);

            return Ok(Ajaxresponse);
        }

        [HttpGet("GettargetDate")]
        public IActionResult GetEquipmentTargetDate(int equipmentId, bool toshibaDiscussion)
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

            var res = _applicationService.GetEquipmentTargetDate(equipmentId, toshibaDiscussion);
            if (res != null)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("GetApprorverFlowData")]
        public async Task<IActionResult> GetEquipmentWorkFlowData(int equipmentId)
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
            // Call the service method
            var (workflowOne, workflowTwo) = await _applicationService.GetEquipmentWorkFlowData(equipmentId);

            // Prepare response data
            var result = new
            {
                WorkflowOne = workflowOne,
                WorkflowTwo = workflowTwo
            };

            // Generate response message based on result
            if (workflowOne.Any() || workflowTwo.Any())
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), result);
            }
            else
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), result);
            }

            return Ok(Ajaxresponse);
            
        }

        [HttpGet("GetCurrentApprover")]
        public IActionResult GetCurrentApproverTask(int equipmentId, int userId)
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

            var result = _applicationService.GetCurrentApproverTask(equipmentId, userId);
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

        [HttpGet("GetHistoryData")]
        public IActionResult GetHistoryData(int equipmentId)
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
            var result = _applicationService.GetHistoryData(equipmentId);

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


        [HttpGet("EquipmentListingExcel")]

        public async Task<IActionResult> GetEquipmentExcel(DateTime fromDate, DateTime todate, int employeeId, int type)
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

            var result = await _applicationService.GetEquipmentExcel(fromDate, todate, employeeId, type);
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

    }
}
