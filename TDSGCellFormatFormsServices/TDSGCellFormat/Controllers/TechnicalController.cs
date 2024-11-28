using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.InkML;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Buffers;
using TDSGCellFormat.Common;
using TDSGCellFormat.Helper;
using TDSGCellFormat.Implementation.Repository;
using TDSGCellFormat.Interface.Service;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using static TDSGCellFormat.Common.Enums;

namespace TDSGCellFormat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TechnicalController : Controller
    {
        private readonly ITechnicalInstructionService _technicalService;

        ResponseHelper responseHelper = new ResponseHelper();
        AjaxResult Ajaxresponse = new AjaxResult();
        private readonly TdsgCellFormatDivisionContext _context;
        private readonly AepplNewCloneStageContext _cloneContext;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public TechnicalController(ITechnicalInstructionService technicalService, TdsgCellFormatDivisionContext context, AepplNewCloneStageContext cloneContext, IHttpContextAccessor httpContextAccessor)
        {
            _technicalService = technicalService;
            this._context = context;
            this._cloneContext = cloneContext;
            _httpContextAccessor = httpContextAccessor;
        }
        [HttpGet("Get")]
        public async Task<IActionResult> Get(int createdBy, int skip, int take, string order = "", string orderBy = "", string searchColumn = "", string searchValue = "")
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
            var res = await _technicalService.GetTechnicalInsurtuctionListUpdate(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
            //if (res != null)
            //    Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            //else
            //    Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(res);
        }

        [HttpGet("AllList")]
        public async Task<IActionResult> GetAllList(int createdBy, int skip, int take, string order = "", string orderBy = "", string searchColumn = "", string searchValue = "")
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
            var res = await _technicalService.GetTechnicalInstructionList(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
            //if (res != null)
            //    Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            //else
            //    Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(res);
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
            var result = await _technicalService.GetTechnicalInstructionApproverList(createdBy, skip, take, order, orderBy, searchColumn, searchValue);

            //if (result != null)
            //{
            //    Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), result);
            //}
            //else
            //{
            //    Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), result);
            //}
            return Ok(result);
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

            var res = _technicalService.GetById(Id);
            if (res != null)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpPost("AddOrUpdate")]
        public async Task<IActionResult> POST(TechnicalInstructionAdd report)
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
                var result = await _technicalService.AddOrUpdateReport(report);
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

            var result = await _technicalService.DeleteReport(Id);
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

        [HttpGet("GetEquipmentMasterList")]
        public async Task<IActionResult> GetEquipmentMasterList()
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

            var res = await _technicalService.GetEquipmentMasterList();
            if (res.Count() > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpDelete("TechnicalAttachment")]
        public async Task<IActionResult> DeleteTechnicalAttachment(int TechnicalAttachmentId)
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

            var result = await _technicalService.DeleteTechnicalAttachment(TechnicalAttachmentId);
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

        [HttpPost("CreateTechnicalAttachment")]
        public async Task<IActionResult> CreateTechnicalAttachment(TechnicalAttachmentAdd technicalAttachmentAdd)
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
                var result = await _technicalService.CreateTechnicalAttachment(technicalAttachmentAdd);
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

        [HttpPost("UpdateApproveAskToAmend")]
        public async Task<IActionResult> UpdateApproveAskToAmend(int ApproverTaskId, int CurrentUserId, ApprovalStatus type, string comment, int technicalId)
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
            var result = await _technicalService.UpdateApproveAskToAmend(ApproverTaskId, CurrentUserId, type, comment, technicalId);
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
        public async Task<IActionResult> PullBackRequest(int technicalId, int userId, string comment)
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
            var result = await _technicalService.PullBackRequest(technicalId, userId, comment);
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
        public async Task<IActionResult> GetTechnicalApproverData(int technicalId)
        {
            //var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            //// Call the IsValidAuthentication method
            //AjaxResult authResult;
            //bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            //if (!isValidAuth)
            //{
            //    // Return unauthorized response if authentication fails
            //    Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
            //    return Unauthorized(Ajaxresponse);
            //}
            var result = await _technicalService.GetTechnicalInstructionWorkFlow(technicalId);
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
        public IActionResult GetCurrentApproverTask(int technicalId, int userId)
        {
            //var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
            //// Call the IsValidAuthentication method
            //AjaxResult authResult;
            //bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

            //if (!isValidAuth)
            //{
            //    // Return unauthorized response if authentication fails
            //    Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
            //    return Unauthorized(Ajaxresponse);
            //}
            var result = _technicalService.GetCurrentApproverTask(technicalId, userId);
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
        public IActionResult GetHistoryData(int technicalId)
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
            var result = _technicalService.GetHistoryData(technicalId);

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

        [HttpGet("TechnicalExcel")]
        public async Task<IActionResult> ExportTechnicalInstructionToExcel(int technicalId)
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

            var result = await _technicalService.ExportTechnicalInstructionToExcel(technicalId);
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
        [HttpGet("TechnicalPDF")]
        public async Task<IActionResult> ExportToPdf(int technicalId)
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
            var result = await _technicalService.ExportToPdf(technicalId);
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

        [HttpGet("TechnicalExcelListing")]
        public async Task<IActionResult> GetTechnicalInstructionExcel(DateTime fromDate, DateTime todate, int employeeId, int type)
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

            var result = await _technicalService.GetTechnicalInstructionExcel(fromDate, todate, employeeId, type);
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


        [HttpPost("CloseTechnical")]
        public async Task<IActionResult> CloseTechnical(Technical_ScrapNoteAdd report)
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
                var result = await _technicalService.CloseTechnical(report);
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

        [HttpPost("TechnicalReopen")]
        public async Task<IActionResult> ReOpenTechnicalForm(int technicalId, int userId)
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
            var result = await _technicalService.ReOpenTechnicalForm(technicalId, userId);
            return Ok(result);
        }

        [HttpGet("TechnicalReviseList")]
        public async Task<IActionResult> GetReviseDataListing(int technicalId)
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
            var result = await _technicalService.GetReviseDataListing(technicalId);
            return Ok(result);
        }

        [HttpDelete("TechnicalOutlineAttachment")]
        public async Task<IActionResult> DeleteTechnicalOutlineAttachment(int TechnicalOutlineAttachmentId)
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

            var result = await _technicalService.DeleteTechnicalOutlineAttachment(TechnicalOutlineAttachmentId);
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

        [HttpPost("CreateTechnicalOutlineAttachment")]
        public async Task<IActionResult> CreateTechnicalOutlineAttachment(TechnicalOutlineAttachmentAdd technicalOutlineAttachmentAdd)
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
                var result = await _technicalService.CreateTechnicalOutlineAttachment(technicalOutlineAttachmentAdd);
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

        [HttpGet("GetAllSections")]
        public async Task<IActionResult> GetAllSections()
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
            var res = _technicalService.GetAllSections().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpDelete("TechnicalClosureAttachment")]
        public async Task<IActionResult> DeleteTechnicalClosureAttachment(int TechnicalClosureAttachmentId)
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

            var result = await _technicalService.DeleteTechnicalClosureAttachment(TechnicalClosureAttachmentId);
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

        [HttpPost("ChangeRequestOwner")]
        public async Task<IActionResult> ChangeRequestOwner(int technicalId, int userId)
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
            var result = await _technicalService.ChangeRequestOwner(technicalId, userId);
            return Ok(result);
        }

        [HttpGet("GetAllEmployee")]
        public async Task<IActionResult> GetAllEmployee()
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
            var res = _technicalService.GetAllEmployee().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpPost("UpdateOutlineEditor")]
        public async Task<IActionResult> UpdateOutlineEditor(UpdateOutlineEditor updateOutlineEditor)
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
                var result = await _technicalService.UpdateOutlineEditor(updateOutlineEditor);
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
    }
}
