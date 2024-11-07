using Microsoft.AspNetCore.Mvc;
using TDSGCellFormat.Common;
using TDSGCellFormat.Helper;
using TDSGCellFormat.Interface.Service;
using TDSGCellFormat.Models.Add;
using static TDSGCellFormat.Common.Enums;

namespace TDSGCellFormat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdjustmentReportController : Controller
    {
        private readonly IAdjustMentReportService _tdsgService;

        ResponseHelper responseHelper = new ResponseHelper();
        AjaxResult Ajaxresponse = new AjaxResult();

        public AdjustmentReportController(IAdjustMentReportService tdsgService)
        {
            _tdsgService = tdsgService;
        }

        [HttpGet("GetAllAdjustmentData")]
        public async Task<IActionResult> GetAllAdjustmentData(
         int pageIndex, int pageSize, int createdBy = 0, string sortColumn = "", string orderBy = "DESC", string searchValue = "")
        {
            var result = await _tdsgService.GetAllAdjustmentData(pageIndex, pageSize, createdBy, sortColumn, orderBy, searchValue);
            if (result != null)
            {
                Ajaxresponse = responseHelper.ResponseMessage(result.StatusCode, result.Message, result.ReturnValue);
            }
            else
            {
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotValid), ModelState.Values);
            }
            return Ok(Ajaxresponse);
        }

        [HttpGet("GetAdjustmentReport")]
        public async Task<IActionResult> Get()
        {
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

        [HttpGet("GetApprovalList")]
        public async Task<IActionResult> GetApprovalList(int pageIndex, int pageSize, int createdBy = 0, string sortColumn = "", string orderBy = "DESC", string searchValue = "")
        {
            var result = await _tdsgService.GetAdjustmentReportApproverList(pageIndex, pageSize, createdBy, sortColumn , orderBy , searchValue);
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

        [HttpPost("UpdateApproveAskToAmend")]
        public async Task<IActionResult> UpdateApproveAskToAmend(int ApproverTaskId, int CurrentUserId, ApprovalStatus type, string comment, int Id)
        {
            var result = await _tdsgService.UpdateApproveAskToAmend(ApproverTaskId, CurrentUserId, type, comment, Id);
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
        public async Task<IActionResult> PullBackRequest(int Id, int userId, string comment)
        {
            var result = await _tdsgService.PullBackRequest(Id, userId, comment);
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

        [HttpGet("GetApprorverFlowData")]
        public async Task<IActionResult> GetApproverData(int Id)
        {
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
        public async Task<IActionResult> GetTechnicalInstructionExcel(DateTime fromDate, DateTime todate, int employeeId, int type)
        {
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
    }
}
