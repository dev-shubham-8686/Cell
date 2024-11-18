using DocumentFormat.OpenXml.InkML;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
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
    public class MaterialController : Controller
    {
        private readonly IMaterialConsumptionService _materialService;

        ResponseHelper responseHelper = new ResponseHelper();
        AjaxResult Ajaxresponse = new AjaxResult();

        private AuthenticationHelper _authBL;
        private readonly TdsgCellFormatDivisionContext _context;
        private readonly AepplNewCloneStageContext _cloneContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public MaterialController(IMaterialConsumptionService materialService, TdsgCellFormatDivisionContext context, AepplNewCloneStageContext cloneContext, IHttpContextAccessor httpContextAccessor)
        {
            _materialService = materialService;
            this._context = context;
            this._cloneContext = cloneContext;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> GetMaterialConsumptionList1(int createdBy, int skip, int take, string order = "", string orderBy = "", string searchColumn = "", string searchValue = "")
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
            var res = await _materialService.GetAll(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
            if (res != null)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }
        [HttpGet("materialList")]
        public async Task<IActionResult> Get(int createdBy, int skip, int take, string order = "", string orderBy = "", string searchColumn = "", string searchValue = "")
        {
            //var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            //// Call the IsValidAuthentication method
            //AjaxResult authResult;
            //bool isValidAuth = authHelper.IsValidAuthentication(out authResult);
            //
            //if (!isValidAuth)
            //{
            //    // Return unauthorized response if authentication fails
            //    Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
            //    return Unauthorized(Ajaxresponse);
            //}

            var res = await _materialService.GetAll(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
            if (res != null)
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            }
            else
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            }
            return Ok(Ajaxresponse);

        }

        [HttpGet("GetApprovalList")]
        public async Task<IActionResult> GetApprovalList(int createdBy, int skip, int take, string order = "", string orderBy = "", string searchColumn = "", string searchValue = "")
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
            var result = await _materialService.GetMaterialConsumptionApproverList(createdBy, skip, take, order, orderBy, searchColumn, searchValue);

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

            var res = _materialService.GetById(Id);
            if (res != null)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpPost("AddOrUpdate")]
        public async Task<IActionResult> POST(MaterialConsumptionSlipAdd report)
        {
           // var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
           // // Call the IsValidAuthentication method
           // AjaxResult authResult;
           // bool isValidAuth = authHelper.IsValidAuthentication(out authResult);
           //
           // if (!isValidAuth)
           // {
           //     // Return unauthorized response if authentication fails
           //     Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
           //     return Unauthorized(Ajaxresponse);
           // }
            if (ModelState.IsValid)
            {
                var result = await _materialService.AddOrUpdateReport(report);
                if (result != null)
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
            var result = await _materialService.DeleteReport(Id);
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
        public async Task<IActionResult> UpdateApproveAskToAmend(int ApproverTaskId, int CurrentUserId, ApprovalStatus type, string comment, int materialConsumptionId)
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
            var result = await _materialService.UpdateApproveAskToAmend(ApproverTaskId, CurrentUserId, type, comment, materialConsumptionId);
            if (result != null)
            {
                Ajaxresponse = responseHelper.ResponseMessage(result.StatusCode, result.Message, result.ReturnValue);
            }
            else
            {
                Ajaxresponse = responseHelper.ResponseMessage(result.StatusCode, result.Message, result.ReturnValue);
            }
            return Ok(Ajaxresponse);
            //var result = await _materialService.UpdateApproveAskToAmend(ApproverTaskId, CurrentUserId, type, comment, materialConsumptionId);
            //return Ok(result);
        }


        [HttpPost("PullBack")]
        public async Task<IActionResult> PullBackRequest(int materialConsumptionId, int userId, string comment)
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
            var result = await _materialService.PullBackRequest(materialConsumptionId, userId, comment);
            if (result != null)
            {
                Ajaxresponse = responseHelper.ResponseMessage(result.StatusCode, result.Message, result.ReturnValue);
            }
            else
            {
                Ajaxresponse = responseHelper.ResponseMessage(result.StatusCode, result.Message, result.ReturnValue);
            }
            return Ok(Ajaxresponse);
            //var result = await _materialService.PullBackRequest(materialConsumptionId, userId, comment);
            //return Ok(result);
        }

        [HttpGet("GetApprorverFlowData")]
        public async Task<IActionResult> GetMaterialConsumptionWorkFlow(int materialConsumptionId)
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
            var result = await _materialService.GetMaterialConsumptionWorkFlow(materialConsumptionId);
            if (result != null)
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), result);
            }
            else
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), result);
            }
            return Ok(Ajaxresponse);
            // var data = await _materialService.GetMaterialConsumptionWorkFlow(materialConsumptionId);
            //return Ok(data);
        }
        [HttpGet("GetCurrentApprover")]
        public IActionResult GetCurrentApproverTask(int materialConsumptionId, int userId)
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
            var result = _materialService.GetCurrentApproverTask(materialConsumptionId, userId);
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
        public IActionResult GetHistoryData(int materialConsumptionId)
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
            var result = _materialService.GetHistoryData(materialConsumptionId);

            if (result != null)
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), result);
            }
            else
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), result);
            }
            return Ok(Ajaxresponse);
            //var data = _materialService.GetHistoryData(materialConsumptionId);
            //return Ok(data);
        }


        [HttpPost("CloseMaterial")]
        public async Task<IActionResult> CloseMaterial(ScrapNoteAdd report)
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
                var result = await _materialService.CloseMaterial(report);
                if (result != null)
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

        [HttpGet("MaterialExcel")]

        public async Task<IActionResult> ExportMaterialConsumptionToExcel(int materialConsumptionId)
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

            var result = await _materialService.ExportMaterialConsumptionToExcel(materialConsumptionId);
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

        //Task<AjaxResult> ExportToPdf(int materialConsumptionId)
        [HttpGet("MaterialPDF")]

        public async Task<IActionResult> ExportToPdf(int materialConsumptionId)
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
            var result = await _materialService.ExportToPdf(materialConsumptionId);
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

        [HttpGet("MaterialExcelListing")]

        public async Task<IActionResult> GetMaterialConsumptionExcel(DateTime fromDate, DateTime todate, int employeeId, int type)
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

            var result = await _materialService.GetMaterialConsumptionExcel(fromDate, todate, employeeId, type);
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
