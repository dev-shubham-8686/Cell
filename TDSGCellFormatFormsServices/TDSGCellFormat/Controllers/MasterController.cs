using DocumentFormat.OpenXml.InkML;
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
    public class MasterController : Controller
    {
        private readonly IMasterService _masterService;

        ResponseHelper responseHelper = new ResponseHelper();
        AjaxResult Ajaxresponse = new AjaxResult();
        private AuthenticationHelper _authBL;

        private readonly TdsgCellFormatDivisionContext _context;
        private readonly AepplNewCloneStageContext _cloneContext;

        private readonly IHttpContextAccessor _httpContextAccessor;

        public MasterController(IMasterService masterService, TdsgCellFormatDivisionContext context, AepplNewCloneStageContext cloneContext, IHttpContextAccessor httpContextAccessor)
        {
            _masterService = masterService;
            this._context = context;
            this._cloneContext = cloneContext;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpGet("GetAllTroubles")]
        public async Task<IActionResult> GetAllTroubles()
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
            var res = _masterService.GetAllTroubles().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("GetAllCategories")]
        public async Task<IActionResult> GetAllCategories()
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
            var res = _masterService.GetAllCategories().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("costCenters")]
        public async Task<IActionResult> GetAllCostCenters()
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
            var res = _masterService.GetAllCostCenters().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("unitsOfMeasures")]
        public async Task<IActionResult> GetAllUnitsOfMeasure()
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
            var res = _masterService.GetAllUnitsOfMeasure().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpPost("unitsOfMeasures")]
        public async Task<IActionResult> CreateUnitOfMeasure([FromBody] UnitOfMeasureAdd unitOfMeasure)
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
            var createdUnitOfMeasure = await _masterService.CreateUnitOfMeasure(unitOfMeasure);
            if (createdUnitOfMeasure == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdUnitOfMeasure);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Save), createdUnitOfMeasure);
                return Created("unitsOfMeasures", ajaxResponse);
            }
        }

        [HttpPut("unitsOfMeasures")]
        public async Task<IActionResult> UpdateUnitOfMeasure([FromBody] UnitOfMeasureUpdate unitOfMeasure)
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
            var createdUnitOfMeasure = await _masterService.UpdateUnitOfMeasure(unitOfMeasure);
            if (createdUnitOfMeasure == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdUnitOfMeasure);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Save), createdUnitOfMeasure);
                return Ok(ajaxResponse);
            }
        }


        [HttpGet("GetAllMaterials")]
        public async Task<IActionResult> GetAllMaterials()
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
            var res = _masterService.GetAllMaterials().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("GetAllEmployees")]
        ///IQueryable<EmployeeMasterView> GetAllEmployees()
        public async Task<IActionResult> GetAllEmployees()
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
            var res = _masterService.GetAllEmployees().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("GetEmployeeDetailsById")]
        public async Task<IActionResult> GetAllEmployeeDetailsById(int id, string email)
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
            var res = _masterService.GetEmployeeDetailsById(id, email).ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("GetAllAreas")]
        public async Task<IActionResult> GetAllAreas()
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

            var res = _masterService.GetAllAreas().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("GetAllMachines")]
        public async Task<IActionResult> GetAllMachines()
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

            var res = _masterService.GetAllMachines().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("GetAllSubMachines")]
        public async Task<IActionResult> GetAllSubMachines()
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

            var res = _masterService.GetAllSubMachines().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("GetAllDevice")]
        public async Task<IActionResult> GetAllDevice()
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
            var res = _masterService.GetAllDevice().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("GetAllSubDevice")]
        public async Task<IActionResult> GetAllSubDevice()
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
            var res = _masterService.GetAllSubDevice().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("GetAllSection")]
        public async Task<IActionResult> GetAllSection()
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
            var res = _masterService.GetAllSection().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("GetSectionHead")]
        public async Task<IActionResult> GetSectionHead()
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
            var res = _masterService.GetSectionHead().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("GetAllFunction")]
        public async Task<IActionResult> GetAllFunction()
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
            var res = _masterService.GetAllFunction().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }


        //[HttpGet("GetAllSections")]
        //public async Task<IActionResult> GetAllSections(int departmentId)
        //{
        //    var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
        //    // Call the IsValidAuthentication method
        //    AjaxResult authResult;
        //    bool isValidAuth = authHelper.IsValidAuthentication(out authResult);
            
        //    if (!isValidAuth)
        //    {
        //        // Return unauthorized response if authentication fails
        //        Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
        //        return Unauthorized(Ajaxresponse);
        //    }
        //    var res = _masterService.GetAllSections(departmentId).ToList();
        //    if (res.Count > 0)
        //        Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
        //    else
        //        Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

        //    return Ok(Ajaxresponse);
        //}

        [HttpGet("GetCheckedBy")]
        public async Task<IActionResult> GetCheckedBy()
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

            var res = _masterService.GetCheckedBy().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
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

            var res = _masterService.GetAllEmployee().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("GetAllAdvisors")]
        public async Task<IActionResult> GetAllAdvisors()
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

            var res = _masterService.GetAllAdvisors().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("GetAllAdvisor")]
        ///IQueryable<EmployeeMasterView> GetAllEmployees()
        public async Task<IActionResult> GetAllAdvisorEmp()
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
            var res = _masterService.GetAllAdvisorEmp().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("GetResultMonitor")]
        public async Task<IActionResult> GetAllResultMonitor()
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
            var res = _masterService.GetAllResultMonitor().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("GetImpCategory")]
        public async Task<IActionResult> GetImprovementCategory()
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
            var res = _masterService.GetImprovementCategory().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        #region Master Table Api...


        #region AddOrUpdate Master API


        [HttpPost("MasterTbl/AddUpdateArea")]
        public async Task<IActionResult> AddUpdateAreaMaster([FromBody] AreaDtoAdd areaAdd)
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
            var createdarea = await _masterService.AddUpdateAreaTableMaster(areaAdd);
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Save), createdarea);
                return Created("Area", ajaxResponse);
            }
        }

        [HttpPost("MasterTbl/AddUpdateCategory")]
        public async Task<IActionResult> AddUpdateCategoryMaster([FromBody] CategoryAdd categoryAdd)
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
            var createdCategory = await _masterService.AddUpdateCategoryMaster(categoryAdd);
            if (createdCategory == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdCategory);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Save), createdCategory);
                return Created("Category", ajaxResponse);
            }
        }

        [HttpPost("MasterTbl/AddUpdateImpCategoryMaster")]
        public async Task<IActionResult> AddUpdateImpCategoryMaster([FromBody] ImprovementCategoryAdd category)
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
            var createdCategory = await _masterService.AddUpdateImpCategoryMaster(category);
            if (createdCategory == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdCategory);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Save), createdCategory);
                return Created("Category", ajaxResponse);
            }
        }

        [HttpPost("MasterTbl/AddUpdateCostCenterMaster")]
        public async Task<IActionResult> AddUpdateCostCenterMaster([FromBody] CostCenterAdd costCenter)
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
            var createdarea = _masterService.AddUpdateCostCenterMaster(costCenter);
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }


        [HttpPost("MasterTbl/AddUpdateCellDivisionRole")]
        public async Task<IActionResult> AddUpdateCellDivisionRoleMaster([FromBody] CellDivisionRoleMasterAdd cellDivisionRoleMasterAdd)
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
            var createCellDivisionRole = await _masterService.AddUpdateCellDivisionRoleMaster(cellDivisionRoleMasterAdd);
            if (createCellDivisionRole == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createCellDivisionRole);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Save), createCellDivisionRole);
                return Created("CellDivisionRole", ajaxResponse);
            }
        }

        [HttpPost("MasterTbl/AddUpdateCPCGroup")]
        public async Task<IActionResult> AddUpdateCPCGroupMaster([FromBody] CPCGroupMasterAdd cPCGroupMasterAdd)
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
            var createCPCGroup = await _masterService.AddUpdateCPCGroupMaster(cPCGroupMasterAdd);
            if (createCPCGroup == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createCPCGroup);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Save), createCPCGroup);
                return Created("CPCGroup", ajaxResponse);
            }
        }

        [HttpPost("MasterTbl/AddUpdateDevice")]
        public async Task<IActionResult> AddUpdateDeviceMaster([FromBody] DeviceAdd deviceAdd)
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
            var createdUnitOfMeasure = await _masterService.AddUpdateDeviceMaster(deviceAdd);
            if (createdUnitOfMeasure == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdUnitOfMeasure);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Save), createdUnitOfMeasure);
                return Created("Device", ajaxResponse);
            }
        }

        //[HttpPost("AddUpdateSubDevice")]
        //public async Task<IActionResult> AddUpdateSubDeviceMaster([FromBody] SubDeviceAdd subDeviceAdd)
        //{
        //    var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
        //    // Call the IsValidAuthentication method
        //    AjaxResult authResult;
        //    bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

        //    if (!isValidAuth)
        //    {
        //        // Return unauthorized response if authentication fails
        //        Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
        //        return Unauthorized(Ajaxresponse);
        //    }
        //    var createdUnitOfMeasure = await _masterService.AddUpdateSubDeviceMaster(subDeviceAdd);
        //    if (createdUnitOfMeasure == null)
        //    {
        //        var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdUnitOfMeasure);
        //        return BadRequest(ajaxResponse);
        //    }
        //    else
        //    {
        //        var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Save), createdUnitOfMeasure);
        //        return Created("SubDevice", ajaxResponse);
        //    }
        //}

        [HttpPost("MasterTbl/AddUpdateEquipment")]
        public async Task<IActionResult> AddUpdateEquipmentMaster([FromBody] EquipmentMasterAdd equipmentMasterAdd)
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
            var createdUnitOfMeasure = await _masterService.AddUpdateEquipmentMaster(equipmentMasterAdd);
            if (createdUnitOfMeasure == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdUnitOfMeasure);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Save), createdUnitOfMeasure);
                return Created("Equipment", ajaxResponse);
            }
        }

        [HttpPost("MasterTbl/AddUpdateMachine")]
        public async Task<IActionResult> AddUpdateMachineMaster([FromBody] MachineAdd machineAdd)
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
            var createdUnitOfMeasure = await _masterService.AddUpdateMachineMaster(machineAdd);
            if (createdUnitOfMeasure == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdUnitOfMeasure);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Save), createdUnitOfMeasure);
                return Created("Machine", ajaxResponse);
            }
        }

        [HttpPost("MasterTbl/AddUpdateSubMachine")]
        public async Task<IActionResult> AddUpdateSubMachine([FromBody] SubMachineAdd subMachineAdd)
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
            var createdUnitOfMeasure = await _masterService.AddUpdateSubMachineMaster(subMachineAdd);
            if (createdUnitOfMeasure == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdUnitOfMeasure);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Save), createdUnitOfMeasure);
                return Created("SubMachine", ajaxResponse);
            }
        }

        [HttpPost("MasterTbl/AddUpdateMaterial")]
        public async Task<IActionResult> AddUpdateMaterialMaster([FromBody] MaterialAdd materialAdd)
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
            var createdUnitOfMeasure = await _masterService.AddUpdateMaterialMaster(materialAdd);
            if (createdUnitOfMeasure == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdUnitOfMeasure);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Save), createdUnitOfMeasure);
                return Created("Material", ajaxResponse);
            }
        }

        [HttpPost("MasterTbl/AddUpdateResultMonitoring")]
        public async Task<IActionResult> AddUpdateResultMonitoringMaster([FromBody] ResultMonitoringMasterAdd resultMonitoringMasterAdd)
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
            var createdUnitOfMeasure = await _masterService.AddUpdateResultMonitoringMaster(resultMonitoringMasterAdd);
            if (createdUnitOfMeasure == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdUnitOfMeasure);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Save), createdUnitOfMeasure);
                return Created("ResultMonitoring", ajaxResponse);
            }
        }

        //[HttpPost("AddUpdateFunction")]
        //public async Task<IActionResult> AddUpdateFunctionMaster([FromBody] FunctionMasterAdd functionMasterAdd)
        //{
        //    var authHelper = new AuthenticationHelper(_context, _cloneContext, _httpContextAccessor);
        //    // Call the IsValidAuthentication method
        //    AjaxResult authResult;
        //    bool isValidAuth = authHelper.IsValidAuthentication(out authResult);

        //    if (!isValidAuth)
        //    {
        //        // Return unauthorized response if authentication fails
        //        Ajaxresponse = responseHelper.ResponseMessage(authResult.StatusCode, authResult.Message, authResult.ResultType);
        //        return Unauthorized(Ajaxresponse);
        //    }
        //    var createdUnitOfMeasure = await _masterService.AddUpdateFunctionMaster(functionMasterAdd);
        //    if (createdUnitOfMeasure == null)
        //    {
        //        var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdUnitOfMeasure);
        //        return BadRequest(ajaxResponse);
        //    }
        //    else
        //    {
        //        var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Save), createdUnitOfMeasure);
        //        return Created("Function", ajaxResponse);
        //    }
        //}

        [HttpPost("MasterTbl/AddUpdateSectionHeadEmp")]
        public async Task<IActionResult> AddUpdateSectionHeadEmpMaster([FromBody] SectionHeadEmpMasterAdd sectionHeadEmpMasterAdd)
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
            var createdUnitOfMeasure = await _masterService.AddUpdateSectionHeadEmpMaster(sectionHeadEmpMasterAdd);
            if (createdUnitOfMeasure == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdUnitOfMeasure);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Save), createdUnitOfMeasure);
                return Created("SectionHeadEmp", ajaxResponse);
            }
        }

        [HttpPost("MasterTbl/AddUpdateSection")]
        public async Task<IActionResult> AddUpdateSectionMaster([FromBody] SectionMasterAdd sectionMasterAdd)
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
            var createdUnitOfMeasure = await _masterService.AddUpdateSectionMaster(sectionMasterAdd);
            if (createdUnitOfMeasure == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdUnitOfMeasure);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Save), createdUnitOfMeasure);
                return Created("Section", ajaxResponse);
            }
        }

        [HttpPost("MasterTbl/AddUpdateTroubleType")]
        public async Task<IActionResult> AddUpdateTroubleTypeMaster([FromBody] TroubleTypeAdd troubleTypeAdd)
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
            var createdUnitOfMeasure = await _masterService.AddUpdateTroubleTypeMaster(troubleTypeAdd);
            if (createdUnitOfMeasure == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdUnitOfMeasure);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Save), createdUnitOfMeasure);
                return Created("TroubleType", ajaxResponse);
            }
        }

        [HttpPost("MasterTbl/AddUpdateUnitOfMeasureMaster")]
        public async Task<IActionResult> AddUpdateUnitOfMeasureMaster([FromBody] UnitOfMeasureDtoAdd unitOfMeasure)
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
            var createdUnitOfMeasure = await _masterService.AddUpdateUnitOfMeasureMaster(unitOfMeasure);
            if (createdUnitOfMeasure == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdUnitOfMeasure);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Save), createdUnitOfMeasure);
                return Created("unitsOfMeasures", ajaxResponse);
            }
        }
        #endregion

        #region Remove Master API
        [HttpDelete("MasterTbl/DeleteArea")]
        public async Task<IActionResult> DeleteAreaMaster(int areaId)
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
            var createdarea = await _masterService.DeleteAreaMaster(areaId);
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpDelete("MasterTbl/DeleteCategory")]
        public async Task<IActionResult> DeleteCategory(int id)
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
            var createdarea = await _masterService.DeleteCategory(id);
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpDelete("MasterTbl/DeleteImpCategoryMaster")]
        public async Task<IActionResult> DeleteImpCategoryMaster(int id)
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
            var createdarea = await _masterService.DeleteImpCategoryMaster(id);
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }


        [HttpDelete("MasterTbl/DeleteCostCenter")]
        public async Task<IActionResult> DeleteCostCenter(int id)
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
            var createdarea = await _masterService.DeleteCostCenter(id);
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpDelete("MasterTbl/DeleteCellDivisionRole")]
        public async Task<IActionResult> DeleteCellDivisionRole(int id)
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
            var createdarea = await _masterService.DeleteCellDivisionRole(id);
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpDelete("MasterTbl/DeleteCPCGroup")]
        public async Task<IActionResult> DeleteCPCGroup(int id)
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
            var createdarea = await _masterService.DeleteCPCGroup(id);
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpDelete("MasterTbl/DeleteDevice")]
        public async Task<IActionResult> DeleteDevice(int id)
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
            var createdarea = await _masterService.DeleteDevice(id);
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpDelete("MasterTbl/DeleteSubDevice")]
        public async Task<IActionResult> DeleteSubDevice(int id)
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
            var createdarea = await _masterService.DeleteSubDevice(id);
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpDelete("MasterTbl/DeleteEquipment")]
        public async Task<IActionResult> DeleteEquipment(int id)
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
            var createdarea = await _masterService.DeleteEquipment(id);
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpDelete("MasterTbl/DeleteMachine")]
        public async Task<IActionResult> DeleteMachine(int id)
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
            var createdarea = await _masterService.DeleteMachine(id);
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpDelete("MasterTbl/DeleteSubMachine")]
        public async Task<IActionResult> DeleteSubMachine(int id)
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
            var createdarea = await _masterService.DeleteSubMachine(id);
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpDelete("MasterTbl/DeleteMaterial")]
        public async Task<IActionResult> DeleteMaterial(int id)
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
            var createdarea = await _masterService.DeleteMaterial(id);
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpDelete("MasterTbl/DeleteResultMonitoring")]
        public async Task<IActionResult> DeleteResultMonitoring(int id)
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
            var createdarea = await _masterService.DeleteResultMonitoring(id);
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpDelete("MasterTbl/DeleteFunction")]
        public async Task<IActionResult> DeleteFunction(int id)
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
            var createdarea = await _masterService.DeleteFunction(id);
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpDelete("MasterTbl/DeleteSectionHeadEmp")]
        public async Task<IActionResult> DeleteSectionHeadEmp(int id)
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
            var createdarea = await _masterService.DeleteSectionHeadEmp(id);
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpDelete("MasterTbl/DeleteSection")]
        public async Task<IActionResult> DeleteSection(int id)
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
            var createdarea = await _masterService.DeleteSection(id);
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpDelete("MasterTbl/DeleteTroubleType")]
        public async Task<IActionResult> DeleteTroubleType(int id)
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
            var createdarea = await _masterService.DeleteTroubleType(id);
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpDelete("MasterTbl/DeleteUnitOfMeasure")]
        public async Task<IActionResult> DeleteUnitOfMeasure(int id)
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
            var createdarea = await _masterService.DeleteUnitOfMeasure(id);
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }
        #endregion

        #region Get Master API
        [HttpGet("MasterTbl/GetAllCellDivisionRoles")]
        public async Task<IActionResult> GetAllCellDivisionRoles()
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

            var res = _masterService.GetAllCellDivisionRoles().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("MasterTbl/GetAllCPCGroups")]
        public async Task<IActionResult> GetAllCPCGroups()
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

            var res = _masterService.GetAllCPCGroups().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("MasterTbl/GetAllEquipments")]
        public async Task<IActionResult> GetAllEquipments()
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

            var res = _masterService.GetAllEquipments().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("MasterTbl/GetAllSectionHeadEmps")]
        public async Task<IActionResult> GetAllSectionHeadEmps()
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

            var res = _masterService.GetAllSectionHeadEmps().ToList();
            if (res.Count > 0)
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.RetrivedSuccess), res);
            else
                Ajaxresponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.DataNotFound), res);

            return Ok(Ajaxresponse);
        }

        [HttpGet("MasterTbl/GetAreaMaster")]
        public async Task<IActionResult> GetAreaMaster()
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
            var createdarea = _masterService.GetAllAreaMaster();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpGet("MasterTbl/GetCategoryMaster")]
        public async Task<IActionResult> GetCategoryMaster()
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
            var createdarea = _masterService.GetAllCategoryMaster();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

       

        [HttpGet("MasterTbl/GetCellDivisionRoleMaster")]
        public async Task<IActionResult> GetCellDivisionRoleMaster()
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
            var createdarea = _masterService.GetAllCellDivisionRoleMaster();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpGet("MasterTbl/GetCPCGroupMaster")]
        public async Task<IActionResult> GetCPCGroupMaster()
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
            var createdarea = _masterService.GetAllCPCGroupMaster();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpGet("MasterTbl/GetDeviceMaster")]
        public async Task<IActionResult> GetDeviceMaster()
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
            var createdarea = _masterService.GetAllDeviceMaster();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpGet("MasterTbl/GetEquipmentMaster")]
        public async Task<IActionResult> GetEquipmentMaster()
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
            var createdarea = _masterService.GetAllEquipmentMaster();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpGet("MasterTbl/GetMachineMaster")]
        public async Task<IActionResult> GetMachineMaster()
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
            var createdarea = _masterService.GetAllMachineMaster();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpGet("MasterTbl/GetSubMachineMaster")]
        public async Task<IActionResult> GetSubMachineMaster()
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
            var createdarea = _masterService.GetAllSubMachineMaster();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpGet("MasterTbl/GetMaterialMaster")]
        public async Task<IActionResult> GetMaterialMaster()
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
            var createdarea = _masterService.GetAllMaterialMaster();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpGet("MasterTbl/GetResultMonitoringMaster")]
        public async Task<IActionResult> GetResultMonitoringMaster()
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
            var createdarea = _masterService.GetAllResultMonitoringMaster();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpGet("MasterTbl/GetFunctionMaster")]
        public async Task<IActionResult> GetFunctionMaster()
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
            var createdarea = _masterService.GetAllFunctionMaster();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpGet("MasterTbl/GetSectionHeadEmpMaster")]
        public async Task<IActionResult> GetSectionHeadEmpMaster()
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
            var createdarea = _masterService.GetAllSectionHeadEmpMaster();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpGet("MasterTbl/GetSectionMaster")]
        public async Task<IActionResult> GetSectionMaster()
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
            var createdarea = _masterService.GetAllSectionMaster();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpGet("MasterTbl/GetImpCategoryMaster")]
        public async Task<IActionResult> GetImpCategoryMaster()
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
            var createdarea = _masterService.GetImpCategoryMaster();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpGet("MasterTbl/GetTroubleTypeMaster")]
        public async Task<IActionResult> GetTroubleTypeMaster()
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
            var createdarea = _masterService.GetAllTroubleTypeMaster();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpGet("MasterTbl/GetUnitOfMeasureMaster")]
        public async Task<IActionResult> GetUnitOfMeasureMaster()
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
            var createdarea = _masterService.GetAllUnitOfMeasureMaster();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }
        #endregion

        #region Selection Master API
        [HttpGet("MasterTbl/GetAllDivisionMasterSelection")]
        public async Task<IActionResult> GetAllDivisionMasterSelection()
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
            var createdarea = _masterService.GetAllDivisionMasterSelection();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpGet("MasterTbl/GetAllSubDeviceMasterSelection")]
        public async Task<IActionResult> GetAllSubDeviceMasterSelection()
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
            var createdarea = _masterService.GetAllSubDeviceMasterSelection();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpGet("MasterTbl/GetAllCostCenterSelection")]
        public async Task<IActionResult> GetAllCostCenterSelection()
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
            var createdarea = _masterService.GetAllCostCenterSelection();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpGet("MasterTbl/GetAllUOMSelection")]
        public async Task<IActionResult> GetAllUOMSelection()
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
            var createdarea = _masterService.GetAllUOMSelection();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpGet("MasterTbl/GetAllMasterEmployeeSelection")]
        public async Task<IActionResult> GetAllMasterEmployeeSelection()
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
            var createdarea = _masterService.GetAllMasterEmployeeSelection();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpGet("MasterTbl/GetAllSectionMasterSelection")]
        public async Task<IActionResult> GetAllSectionMasterSelection()
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
            var createdarea = _masterService.GetAllSectionMasterSelection().ToList();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }

        [HttpGet("MasterTbl/GetAllCategorySelection")]
        public async Task<IActionResult> GetAllCategorySelection()
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
            var createdarea = _masterService.GetAllCategorySelection().ToList();
            if (createdarea == null)
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Error, Enums.GetEnumDescription(Enums.Message.NotSave), createdarea);
                return BadRequest(ajaxResponse);
            }
            else
            {
                var ajaxResponse = responseHelper.ResponseMessage(Enums.Status.Success, Enums.GetEnumDescription(Enums.Message.Delete), createdarea);
                return Ok(ajaxResponse);
            }
        }
        #endregion


        #endregion
    }
}
