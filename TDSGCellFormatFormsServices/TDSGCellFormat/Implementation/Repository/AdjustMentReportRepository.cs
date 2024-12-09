using ClosedXML.Excel;
using Dapper;
using DocumentFormat.OpenXml.InkML;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Text;
using TDSGCellFormat.Common;
using TDSGCellFormat.Extensions;
using TDSGCellFormat.Helper;
using TDSGCellFormat.Interface.Repository;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Models.View;
using static TDSGCellFormat.Common.Enums;
using Microsoft.Graph.Models;
using Microsoft.AspNetCore.Http.HttpResults;

namespace TDSGCellFormat.Implementation.Repository
{
    public class AdjustMentReportRepository : BaseRepository<AdjustmentReport>, IAdjustMentReportRepository
    {
        private readonly TdsgCellFormatDivisionContext _context;
        private readonly ISprocRepository _sprocRepository;
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly AepplNewCloneStageContext _cloneContext;

        public AdjustMentReportRepository(TdsgCellFormatDivisionContext context, AepplNewCloneStageContext cloneContext, IConfiguration configuration)
            : base(context)
        {
            _sprocRepository = new SprocRepository(context);
            this._context = context;
            // _configuration = configuration;
            this._cloneContext = cloneContext;

            _connectionString = configuration.GetConnectionString("DefaultConnection");
            var basePath = Path.Combine(Directory.GetCurrentDirectory());
            var configurationBuilder = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
            _configuration = configurationBuilder.Build();
        }

        #region GetUserRole
        public async Task<GetEquipmentUser> GetUserRole(string userEmail)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var parameters = new DynamicParameters();
                parameters.Add("@UserEmail", userEmail, DbType.String, ParameterDirection.Input, 150);

                var result = await connection.QueryFirstOrDefaultAsync<GetEquipmentUser>(
                    "dbo.SPP_GetUserDetails_ADJ",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result;
            }
        }
        #endregion

        #region Listing screen 

        public async Task<List<AdjustmentReportView>> GetAllAdjustmentData(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
        {
            //var admin = _context.AdminApprovers.Where(x => x.FormName == ProjectType.Equipment.ToString() && x.IsActive == true).Select(x => x.AdminId).FirstOrDefault();
            var listData = await _context.GetAdjustmentReportList(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
            var adjustmentData = new List<AdjustmentReportView>();
            foreach (var item in listData)
            {
                //  if (createdBy == admin || item.Status != ApprovalTaskStatus.Draft.ToString())
                adjustmentData.Add(item);
            }
            return adjustmentData;
        }

        public async Task<List<AdjustmentReportView>> GetAllAdjustmentDataMyReq(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
        {
            //var admin = _context.AdminApprovers.Where(x => x.FormName == ProjectType.Equipment.ToString() && x.IsActive == true).Select(x => x.AdminId).FirstOrDefault();
            var listData = await _context.GetAdjustmentReportMyReqList(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
            var adjustmentData = new List<AdjustmentReportView>();
            foreach (var item in listData)
            {
                //  if (createdBy == admin || item.Status != ApprovalTaskStatus.Draft.ToString())
                adjustmentData.Add(item);
            }
            return adjustmentData;
        }

        public async Task<List<AdjustmentReportApproverView>> GetAllAdjustmentApproverData(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
        {
            //var admin = _context.AdminApprovers.Where(x => x.FormName == ProjectType.Equipment.ToString() && x.IsActive == true).Select(x => x.AdminId).FirstOrDefault();
            var listData = await _context.GetAdjustmentReportApproverList(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
            var adjustmentData = new List<AdjustmentReportApproverView>();
            foreach (var item in listData)
            {
                //  if (createdBy == admin || item.Status != ApprovalTaskStatus.Draft.ToString())
                adjustmentData.Add(item);
            }
            return adjustmentData;
        }

        #endregion

        #region CRUD
        public IQueryable<AdjustMentReportRequest> GetAll()
        {
            IQueryable<AdjustMentReportRequest> res = _context.AdjustmentReports
                .Join(_context.Photos, ar => ar.AdjustMentReportId, arp => arp.AdjustmentReportId, (ar, arp) => new { ar, arp })
                .Where(n => n.ar.IsDeleted == false)
                .Select(n => new AdjustMentReportRequest
                {
                    AdjustMentReportId = n.ar.AdjustMentReportId,
                    Area = !string.IsNullOrEmpty(n.ar.Area) ? n.ar.Area.Split(",", StringSplitOptions.RemoveEmptyEntries).Select(t => Int32.Parse(t)).ToList<int>() : new List<int>(),
                    MachineName = n.ar.MachineName,
                    SubMachineName = !string.IsNullOrEmpty(n.ar.SubMachineName) ? n.ar.SubMachineName.Split(",", StringSplitOptions.RemoveEmptyEntries).Select(t => Int32.Parse(t)).ToList<int>() : new List<int>(),
                    ReportNo = n.ar.ReportNo,
                    RequestBy = n.ar.RequestBy,
                    CheckedBy = n.ar.CheckedBy,
                    DescribeProblem = n.ar.DescribeProblem,
                    Observation = n.ar.Observation,
                    RootCause = n.ar.RootCause,
                    AdjustmentDescription = n.ar.AdjustmentDescription,
                    //Photos = n.arp.DocumentFilePath
                    //ConditionAfterAdjustment = n.ar.ConditionAfterAdjustment,
                    Status = n.ar.Status,
                    IsSubmit = n.ar.IsSubmit,
                    CreatedDate = n.ar.CreatedDate,
                    CreatedBy = n.ar.CreatedBy,
                    ModifiedDate = n.ar.ModifiedDate,
                    ModifiedBy = n.ar.ModifiedBy,
                    IsDeleted = n.ar.IsDeleted,
                });

            return res;
        }

        public Photos? GetAdjustmentReportPhotos(int adjustmentReportId)
        {
            var a = _context.Photos.Where(x => x.AdjustmentReportId == adjustmentReportId && x.IsDeleted == false).ToList();
            var beforeImages = a.Where(x => x.IsOldPhoto == true)
                .Select(x => new AdjustmentReportPhoto
                {
                    AdjustmentReportPhotoId = x.AdjustmentReportPhotoId,
                    AdjustmentReportId = x.AdjustmentReportId,
                    DocumentName = x.DocumentName,
                    DocumentFilePath = x.DocumentFilePath,
                    IsOldPhoto = x.IsOldPhoto,
                    SequenceId = x.SequenceId,
                }).OrderBy(o => o.SequenceId)
                .ToList();

            var afterImages = a.Where(x => x.IsOldPhoto == false)
                .Select(x => new AdjustmentReportPhoto
                {
                    AdjustmentReportPhotoId = x.AdjustmentReportPhotoId,
                    AdjustmentReportId = x.AdjustmentReportId,
                    DocumentName = x.DocumentName,
                    DocumentFilePath = x.DocumentFilePath,
                    IsOldPhoto = x.IsOldPhoto,
                    SequenceId = x.SequenceId,
                }).OrderBy(o => o.SequenceId)
                .ToList();

            return new Photos() { BeforeImages = beforeImages, AfterImages = afterImages };
        }

        public AdjustMentReportRequest GetById(int Id)
        {
            var res = _context.AdjustmentReports.FirstOrDefault(x => x.AdjustMentReportId == Id && (!x.IsDeleted.HasValue || !x.IsDeleted.Value));

            if (res == null)
            {
                return null;
            }

            var reqDepId = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == res.CreatedBy).Select(x => x.DepartmentID).FirstOrDefault();
            var reqDepHead = _cloneContext.DepartmentMasters.Where(x => x.DepartmentID == reqDepId).Select(x => x.Head).FirstOrDefault();
            var deputyDivisionHead = _context.CellDivisionRoleMasters.Where(x => x.DivisionId == 1).Select(x => x.DeputyDivisionHead).FirstOrDefault();
            var advisorId = _context.AdjustmentAdvisorMasters.Where(x => x.AdjustmentReportId == Id && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault();

            AdjustMentReportRequest adjustmentData = new AdjustMentReportRequest()
            {
                AdjustMentReportId = res.AdjustMentReportId,
                ReportNo = res.ReportNo,
                When = res.When.HasValue ? res.When.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                Area = !string.IsNullOrEmpty(res.Area) ? res.Area.Split(',').Select(s => int.Parse(s.Trim())).ToList() : new List<int>(),
                SectionId = res.SectionId,
                MachineName = res.MachineName,
                OtherMachineName = res.OtherMachineName,
                SubMachineName = !string.IsNullOrEmpty(res.SubMachineName) ? res.SubMachineName.Split(',').Select(s => int.Parse(s.Trim())).ToList() : new List<int>(),
                OtherSubMachineName = res.OtherSubMachineName,
                RequestBy = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == res.CreatedBy && x.IsActive == true).Select(x => x.EmployeeName).FirstOrDefault(),
                CheckedBy = res.CheckedBy,
                DescribeProblem = res.DescribeProblem,
                Observation = res.Observation,
                RootCause = res.RootCause,
                AdjustmentDescription = res.AdjustmentDescription,
                Photos = GetAdjustmentReportPhotos(Id),
                ChangeRiskManagementRequired = res.ChangeRiskManagementRequired,
                ConditionAfterAdjustment = res.ConditionAfterAdjustment,
                Status = res.Status,
                IsSubmit = res.IsSubmit,
                CreatedBy = res.CreatedBy,
                CreatedDate = res.CreatedDate,
                DepartmentHeadId = reqDepHead,
                DeputyDivHead = deputyDivisionHead,
                AdvisorId = advisorId
            };

            var changeRiskManagement = _context.ChangeRiskManagement_AdjustmentReport.Where(x => x.AdjustMentReportId == Id && x.IsDeleted == false).ToList();
            if (changeRiskManagement != null)
            {
                adjustmentData.ChangeRiskManagement_AdjustmentReport = changeRiskManagement.Select(section => new ChangeRiskManagement_AdjustmentReports
                {
                    ChangeRiskManagementId = section.ChangeRiskManagementId,
                    Changes = section.Changes,
                    FunctionId = section.FunctionId,
                    RiskAssociated = section.RisksWithChanges,
                    Factor = section.Factors,
                    CounterMeasures = section.CounterMeasures,
                    DueDate = section.DueDate.HasValue ? section.DueDate.Value.ToString("dd-MM-yyyy") : string.Empty,
                    PersonInCharge = section.PersonInCharge,
                    Results = section.Results

                }).ToList();
            }


            var adjustmentAfterImage = _context.AdjustmentAfterImages.Where(x => x.AdjustmentReportId == Id && x.IsDeleted == false).ToList();
            if (adjustmentAfterImage != null)
            {
                adjustmentData.AfterImages = adjustmentAfterImage.Select(attach => new AdjustmentAfterImageData
                {
                    AdjustmentAfterImageId = attach.AdjustmentAfterImageId,
                    AfterImgName = attach.AfterImageDocFilePath,
                    AfterImgPath = attach.AfterImageDocName
                }).ToList();
            }

            var adjustmentBeforeImage = _context.AdjustmentBeforeImages.Where(x => x.AdjustmentReportId == Id && x.IsDeleted == false).ToList();
            if (adjustmentBeforeImage != null)
            {
                adjustmentData.BeforeImages  = adjustmentBeforeImage.Select(attach => new AdjustmentBeforeImageData
                {
                    AdjustmentBeforeImageId = attach.AdjustmentBeforeImageId,
                    BeforeImgName = attach.BeforeImageDocName,
                    BeforeImgPath = attach.BeforeImageDocFilePath
                }).ToList();
            }

            return adjustmentData;
        }

        public async Task<AjaxResult> AddOrUpdateReport(AdjustMentReportRequest request)
        {
            var res = new AjaxResult();
            try
            {
                int adjustMentReportId = 0;
                var existingReport = await _context.AdjustmentReports.FindAsync(request.AdjustMentReportId);
                if (existingReport == null)
                {
                    var adjustmentReportNo = await GenerateAdjustmentReportNumberAsync();
                    var newReport = new AdjustmentReport();
                    newReport.ReportNo = adjustmentReportNo.ToString();
                    newReport.When = !string.IsNullOrEmpty(request.When) ? DateTime.Parse(request.When) : (DateTime?)null;
                    newReport.Area = request.Area != null && request.Area.Count > 0 ? string.Join(",", request.Area) : "";
                    newReport.MachineName = request.MachineName;
                    newReport.OtherMachineName = request.MachineName != null && request.MachineName == -1
                    ? request.OtherMachineName
                          : "";
                    newReport.SubMachineName = request.SubMachineName != null && request.SubMachineName.Count > 0 ? string.Join(",", request.SubMachineName) : "";
                    newReport.OtherSubMachineName = request.SubMachineName != null && request.SubMachineName.Contains(-2)
                          ? request.OtherSubMachineName
                          : "";
                    newReport.SectionId = request.SectionId;
                    newReport.CheckedBy = request.CheckedBy;
                    //  EmployeeId = request.EmployeeId,
                    newReport.DescribeProblem = request.DescribeProblem;
                    newReport.Observation = request.Observation;
                    newReport.RootCause = request.RootCause;
                    newReport.AdjustmentDescription = request.AdjustmentDescription;
                    newReport.ConditionAfterAdjustment = request.ConditionAfterAdjustment;
                    newReport.ChangeRiskManagementRequired = request.ChangeRiskManagementRequired;
                    newReport.Status = ApprovalTaskStatus.Draft.ToString();
                    newReport.IsSubmit = request.IsSubmit;
                    newReport.CreatedDate = DateTime.Now;
                    newReport.CreatedBy = request.CreatedBy;
                    newReport.IsDeleted = false;
                    newReport.ModifiedBy = request.ModifiedBy;
                    newReport.ModifiedDate = DateTime.Now;
                    // Assign SectionHeadId based on the conditions
                    if (request.SectionId == 1)
                    {
                        newReport.SectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.SectionHeadMasterId == 1 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault();
                    }
                    else if (request.SectionId == 2)
                    {
                        newReport.SectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.SectionHeadMasterId == 2 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault(); ;
                    }
                    else if (request.SectionId == 3)
                    {
                        if (request.Area != null && request.Area.Contains(1))
                        {
                            newReport.SectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.SectionHeadMasterId == 3 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault(); ;
                        }
                        else if (request.Area != null && (request.Area.Contains(2) || request.Area.Contains(3)))
                        {
                            newReport.SectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.SectionHeadMasterId == 4 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault(); ;
                        }
                    }

                    _context.AdjustmentReports.Add(newReport);
                    await _context.SaveChangesAsync();

                    // Get ID of newly added record
                    adjustMentReportId = newReport.AdjustMentReportId;

                    if (request.ChangeRiskManagement_AdjustmentReport != null)
                    {
                        foreach (var changeReport in request.ChangeRiskManagement_AdjustmentReport)
                        {
                            var changeRiskData = new ChangeRiskManagement_AdjustmentReport()
                            {
                                AdjustMentReportId = adjustMentReportId,
                                Changes = changeReport.Changes,
                                FunctionId = changeReport.FunctionId,
                                RisksWithChanges = changeReport.RiskAssociated,
                                Factors = changeReport.Factor,
                                CounterMeasures = changeReport.CounterMeasures,
                                DueDate = !string.IsNullOrEmpty(changeReport.DueDate) ? DateOnly.FromDateTime(DateTime.Parse(changeReport.DueDate)) : (DateOnly?)null,
                                PersonInCharge = changeReport.PersonInCharge,
                                Results = changeReport.Results,
                                CreatedBy = changeReport.CreatedBy,
                                CreatedDate = DateTime.Now,
                                IsDeleted = false,
                            };
                            _context.ChangeRiskManagement_AdjustmentReport.Add(changeRiskData);
                        }
                        await _context.SaveChangesAsync();
                    }
                    if (request.BeforeImages != null)
                    {
                        foreach (var attach in request.BeforeImages)
                        {
                            var updatedUrl = attach.BeforeImgPath.Replace($"/{request.CreatedBy}/", $"/{adjustmentReportNo}/");
                            ///EqReportDocuments/EQReportDocs/Current Situation Attachments/MaterialConsumption_2024-10-09.xlsx
                            var attachment = new AdjustmentBeforeImage()
                            {

                                AdjustmentReportId = adjustMentReportId,
                                BeforeImageDocName = attach.BeforeImgName,
                                BeforeImageDocFilePath = updatedUrl,
                                IsDeleted = false,
                                CreatedBy = attach.CreatedBy,
                                CreatedDate = DateTime.Now,
                            };
                            _context.AdjustmentBeforeImages.Add(attachment);
                        }
                        await _context.SaveChangesAsync();
                    }

                    if (request.AfterImages != null)
                    {
                        foreach (var attach in request.AfterImages)
                        {
                            var updatedUrl = attach.AfterImgPath.Replace($"/{request.CreatedBy}/", $"/{adjustmentReportNo}/");
                            ///EqReportDocuments/EQReportDocs/Current Situation Attachments/MaterialConsumption_2024-10-09.xlsx
                            var attachment = new AdjustmentAfterImage()
                            {

                                AdjustmentReportId = adjustMentReportId,
                                AfterImageDocName = attach.AfterImgName,
                                AfterImageDocFilePath = updatedUrl,
                                IsDeleted = false,
                                CreatedBy = attach.CreatedBy,
                                CreatedDate = DateTime.Now,
                            };
                            _context.AdjustmentAfterImages.Add(attachment);
                        }
                        await _context.SaveChangesAsync();
                    }

                    await _context.SaveChangesAsync();

                    res.ReturnValue = new
                    {
                        AdjustmentReportId = adjustMentReportId,
                        AdjustmentReportNo = adjustmentReportNo
                    };
                    res.StatusCode = Enums.Status.Success;
                    res.Message = Enums.AdjustMentSave;

                    if (request.IsSubmit == true && request.IsAmendReSubmitTask == false)
                    {
                        var data = await SubmitRequest(adjustMentReportId, request.EmployeeId, request.AdvisorId);
                        if (data.StatusCode == Enums.Status.Success)
                        {
                            res.Message = Enums.AdjustMentSubmit;
                        }

                    }

                    else if (request.IsSubmit == true && request.IsAmendReSubmitTask == true)
                    {
                        var data = await Resubmit(adjustMentReportId, request.EmployeeId);
                        if (data.StatusCode == Enums.Status.Success)
                        {
                            res.Message = Enums.AdjustMentSubmit;
                        }
                    }
                    else
                    {
                        InsertHistoryData(adjustMentReportId, FormType.AjustmentReport.ToString(), "Requestor", "Update Status as Draft", ApprovalTaskStatus.Draft.ToString(), Convert.ToInt32(request.CreatedBy), HistoryAction.Save.ToString(), 0);
                    }

                
                }
                else
                {
                    existingReport.When = !string.IsNullOrEmpty(request.When) ? DateTime.Parse(request.When) : (DateTime?)null;
                    existingReport.Area = request.Area != null && request.Area.Count > 0 ? string.Join(",", request.Area) : "";
                    existingReport.MachineName = request.MachineName;
                    existingReport.OtherMachineName = request.MachineName != null && request.MachineName == -1
                    ? request.OtherMachineName
                          : "";
                    existingReport.SubMachineName = request.SubMachineName != null && request.SubMachineName.Count > 0 ? string.Join(",", request.SubMachineName) : "";
                    existingReport.OtherSubMachineName = request.SubMachineName != null && request.SubMachineName.Contains(-2)
                          ? request.OtherSubMachineName
                          : "";
                    existingReport.SectionId = request.SectionId;
                    existingReport.CheckedBy = request.CheckedBy;
                    existingReport.DescribeProblem = request.DescribeProblem;
                    existingReport.Observation = request.Observation;
                    existingReport.RootCause = request.RootCause;
                    existingReport.AdjustmentDescription = request.AdjustmentDescription;
                    existingReport.ConditionAfterAdjustment = request.ConditionAfterAdjustment;
                    existingReport.ChangeRiskManagementRequired = request.ChangeRiskManagementRequired;
                    //existingReport.Status = request.Status ?? ApprovalTaskStatus.Draft.ToString();
                    //existingReport.IsSubmit = request.IsSubmit;
                    existingReport.ModifiedDate = DateTime.Now;
                    existingReport.ModifiedBy = request.ModifiedBy;

                    if (request.SectionId == 1)
                    {
                        existingReport.SectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.SectionHeadMasterId == 1 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault();
                    }
                    else if (request.SectionId == 2)
                    {
                        existingReport.SectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.SectionHeadMasterId == 2 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault(); ;
                    }
                    else if (request.SectionId == 3)
                    {
                        if (request.Area != null && request.Area.Contains(1))
                        {
                            existingReport.SectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.SectionHeadMasterId == 3 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault(); ;
                        }
                        else if (request.Area != null && (request.Area.Contains(2) || request.Area.Contains(3)))
                        {
                            existingReport.SectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.SectionHeadMasterId == 4 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault(); ;
                        }
                    }
                    await _context.SaveChangesAsync();

                    var existingChangeRiskManagement = _context.ChangeRiskManagement_AdjustmentReport.Where(x => x.AdjustMentReportId == existingReport.AdjustMentReportId && x.IsDeleted == false).ToList();
                    MarkAsDeleted(existingChangeRiskManagement, existingReport.CreatedBy, DateTime.Now);
                    _context.SaveChanges();

                    if (request.ChangeRiskManagement_AdjustmentReport != null)
                    {
                        foreach (var changeReport in request.ChangeRiskManagement_AdjustmentReport)
                        {
                            var existingChange = _context.ChangeRiskManagement_AdjustmentReport.Where(x => x.AdjustMentReportId == changeReport.AdjustMentReportId && x.ChangeRiskManagementId == changeReport.ChangeRiskManagementId).FirstOrDefault();
                            if (existingChange != null)
                            {
                                existingChange.Changes = changeReport.Changes;
                                existingChange.FunctionId = changeReport.FunctionId;
                                existingChange.RisksWithChanges = changeReport.RiskAssociated;
                                existingChange.Factors = changeReport.Factor;
                                existingChange.CounterMeasures = changeReport.CounterMeasures;
                                existingChange.DueDate = !string.IsNullOrEmpty(changeReport.DueDate) ? DateOnly.FromDateTime(DateTime.Parse(changeReport.DueDate)) : (DateOnly?)null;
                                existingChange.PersonInCharge = changeReport.PersonInCharge;
                                existingChange.Results = changeReport.Results;
                                existingChange.ModifiedBy = changeReport.ModifiedBy;
                                existingChange.ModifiedDate = DateTime.Now;
                                existingChange.IsDeleted = false;
                            }
                            else
                            {
                                var changeRiskData = new ChangeRiskManagement_AdjustmentReport()
                                {
                                    AdjustMentReportId = existingReport.AdjustMentReportId,
                                    Changes = changeReport.Changes,
                                    FunctionId = changeReport.FunctionId,
                                    RisksWithChanges = changeReport.RiskAssociated,
                                    Factors = changeReport.Factor,
                                    CounterMeasures = changeReport.CounterMeasures,
                                    DueDate = !string.IsNullOrEmpty(changeReport.DueDate) ? DateOnly.FromDateTime(DateTime.Parse(changeReport.DueDate)) : (DateOnly?)null,
                                    PersonInCharge = changeReport.PersonInCharge,
                                    Results = changeReport.Results,
                                    CreatedBy = changeReport.CreatedBy,
                                    CreatedDate = DateTime.Now,
                                    IsDeleted = false,
                                };
                                _context.ChangeRiskManagement_AdjustmentReport.Add(changeRiskData);
                            }
                            await _context.SaveChangesAsync();
                        }
                    }

                    var existingAfterImage = _context.AdjustmentAfterImages.Where(x => x.AdjustmentReportId == existingReport.AdjustMentReportId).ToList();
                    MarkAsDeleted(existingAfterImage, existingReport.CreatedBy, DateTime.Now);
                    _context.SaveChanges();

                    if (request.AfterImages != null)
                    {
                        foreach (var attach in request.AfterImages)
                        {
                            var updatedUrl = attach.AfterImgPath.Replace($"/{request.CreatedBy}/", $"/{existingReport.ReportNo}/");
                            var existingAttachData = _context.AdjustmentAfterImages.Where(x => x.AdjustmentReportId == attach.AdjustmentreportId && x.AdjustmentAfterImageId == attach.AdjustmentAfterImageId).FirstOrDefault();
                            if (existingAttachData != null)
                            {
                                existingAttachData.AfterImageDocName = attach.AfterImgName;
                                existingAttachData.AfterImageDocFilePath = attach.AfterImgPath;
                                existingAttachData.IsDeleted = false;
                                existingAttachData.ModifiedBy = attach.ModifiedBy;
                                existingAttachData.ModifiedDate = DateTime.Now;
                            }
                            else
                            {

                                var attachment = new AdjustmentAfterImage()
                                {
                                    AdjustmentReportId = existingReport.AdjustMentReportId,
                                    AfterImageDocName = attach.AfterImgName,
                                    AfterImageDocFilePath = updatedUrl,
                                    IsDeleted = false,
                                    CreatedBy = attach.CreatedBy,
                                    CreatedDate = DateTime.Now,
                                };
                                _context.AdjustmentAfterImages.Add(attachment);
                            }
                            await _context.SaveChangesAsync();
                        }
                    }

                    var existingBeforeImage = _context.AdjustmentAfterImages.Where(x => x.AdjustmentReportId == existingReport.AdjustMentReportId).ToList();
                    MarkAsDeleted(existingBeforeImage, existingReport.CreatedBy, DateTime.Now);
                    _context.SaveChanges();

                    if (request.BeforeImages != null)
                    {
                        foreach (var attach in request.BeforeImages)
                        {
                            var updatedUrl = attach.BeforeImgPath.Replace($"/{request.CreatedBy}/", $"/{existingReport.ReportNo}/");
                            var existingAttachData = _context.AdjustmentBeforeImages.Where(x => x.AdjustmentReportId == attach.AdjustmentreportId && x.AdjustmentBeforeImageId == attach.AdjustmentBeforeImageId).FirstOrDefault();
                            if (existingAttachData != null)
                            {
                                existingAttachData.BeforeImageDocName = attach.BeforeImgName;
                                existingAttachData.BeforeImageDocFilePath = attach.BeforeImgPath;
                                existingAttachData.IsDeleted = false;
                                existingAttachData.ModifiedBy = attach.ModifiedBy;
                                existingAttachData.ModifiedDate = DateTime.Now;
                            }
                            else
                            {

                                var attachment = new AdjustmentBeforeImage()
                                {
                                    AdjustmentReportId = existingReport.AdjustMentReportId,
                                    BeforeImageDocName = attach.BeforeImgName,
                                    BeforeImageDocFilePath = updatedUrl,
                                    IsDeleted = false,
                                    CreatedBy = attach.CreatedBy,
                                    CreatedDate = DateTime.Now,
                                };
                                _context.AdjustmentBeforeImages.Add(attachment);
                            }
                            await _context.SaveChangesAsync();
                        }
                    }



                    await _context.SaveChangesAsync();

                    res.ReturnValue = new
                    {
                        AdjustmentReportId = existingReport.AdjustMentReportId,
                        AdjustmentReportNo = existingReport.ReportNo
                    };
                    res.StatusCode = Enums.Status.Success;
                    res.Message = Enums.AdjustMentSave;

                    if (request.IsSubmit == true && request.IsAmendReSubmitTask == false)
                    {
                        var data = await SubmitRequest(existingReport.AdjustMentReportId, existingReport.CreatedBy, request.AdvisorId);
                        if (data.StatusCode == Enums.Status.Success)
                        {
                            res.Message = Enums.AdjustMentSubmit;
                        }

                    }

                    else if (request.IsSubmit == true && request.IsAmendReSubmitTask == true)
                    {
                        var data = await Resubmit(existingReport.AdjustMentReportId, existingReport.CreatedBy);
                        if (data.StatusCode == Enums.Status.Success)
                        {
                            res.Message = Enums.AdjustMentSubmit;
                        }
                    }

                    else
                    {
                        InsertHistoryData(adjustMentReportId, FormType.AjustmentReport.ToString(), "Requestor", "Update the form ", existingReport.Status, Convert.ToInt32(request.CreatedBy), HistoryAction.Save.ToString(), 0);
                    }

                    
                }
            }

            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Adjustment AddOrUpdate");

            }
            return res;
        }

        private void MarkAsDeleted<T>(IEnumerable<T> items, int? createdBy, DateTime now) where T : class
        {
            foreach (var item in items)
            {
                var itemType = item.GetType();

                var isDeletedProp = itemType.GetProperty("IsDeleted");
                if (isDeletedProp != null)
                {
                    isDeletedProp.SetValue(item, true);
                }

                var modifiedByProp = itemType.GetProperty("ModifiedBy");
                if (modifiedByProp != null)
                {
                    modifiedByProp.SetValue(item, createdBy);
                }

                var modifiedDateProp = itemType.GetProperty("ModifiedDate");
                if (modifiedDateProp != null)
                {
                    modifiedDateProp.SetValue(item, now);
                }
            }
        }

        public async Task<AjaxResult> SubmitRequest(int adjustmentReportId, int? createdBy, int? AdvisorId)
        {
            var res = new AjaxResult();
            try
            {
                var adjustment = _context.AdjustmentReports.Where(x => x.AdjustMentReportId == adjustmentReportId && x.IsDeleted == false).FirstOrDefault();
                if (adjustment != null)
                {
                    adjustment.Status = ApprovalTaskStatus.InReview.ToString();
                    adjustment.IsSubmit = true;
                    await _context.SaveChangesAsync();
                }

                if (AdvisorId != null && AdvisorId > 0)
                {
                    var advisorData = new AdjustmentAdvisorMaster();
                    advisorData.EmployeeId = AdvisorId;
                    advisorData.IsActive = true;
                    advisorData.AdjustmentReportId = adjustmentReportId;
                    _context.AdjustmentAdvisorMasters.Add(advisorData);
                    await _context.SaveChangesAsync();
                }

                InsertHistoryData(adjustmentReportId, FormType.AjustmentReport.ToString(), "Requestor", "Submit the Form", ApprovalTaskStatus.InReview.ToString(), Convert.ToInt32(createdBy), HistoryAction.Submit.ToString(), 0);

                await _context.CallAdjustmentReportApproverMaterix(createdBy, adjustmentReportId);

                var notificationHelper = new NotificationHelper(_context, _cloneContext);
                await notificationHelper.SendAdjustmentEmai(adjustmentReportId, EmailNotificationAction.Submitted, string.Empty, 0);

                res.Message = Enums.AdjustMentSubmit;
                res.StatusCode = Enums.Status.Success;

            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Adjustment SubmitRequest");
                //return res;
            }
            return res;
        }

        public async Task<AjaxResult> Resubmit(int adjustmentReportId, int? createdBy)
        {
            var res = new AjaxResult();
            try
            {
                var adjustmentApproverTask = _context.AdjustmentReportApproverTaskMasters.Where(x => x.AdjustmentReportId == adjustmentReportId && x.IsActive == true && x.Status == ApprovalTaskStatus.UnderAmendment.ToString()).FirstOrDefault();

                var adjusment = _context.AdjustmentReports.Where(x => x.AdjustMentReportId == adjustmentReportId && x.IsDeleted == false).FirstOrDefault();
                if (adjustmentApproverTask != null)
                {
                    adjustmentApproverTask.Status = ApprovalTaskStatus.InReview.ToString();
                    adjusment.Status = ApprovalTaskStatus.InReview.ToString();
                    await _context.SaveChangesAsync();
                }
                InsertHistoryData(adjustmentReportId, FormType.AjustmentReport.ToString(), "Requestor", "ReSubmit the Form", ApprovalTaskStatus.InReview.ToString(), Convert.ToInt32(createdBy), HistoryAction.ReSubmitted.ToString(), 0);
               
                var notificationHelper = new NotificationHelper(_context, _cloneContext);
                await notificationHelper.SendAdjustmentEmai(adjustmentReportId, EmailNotificationAction.ReSubmitted, string.Empty, 0);
                res.Message = Enums.AdjustMentReSubmit;
                res.StatusCode = Enums.Status.Success;
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Adjustment Resubmit");
                //return res;
            }
            return res;
        }


        public async Task<string> GenerateAdjustmentReportNumberAsync()
        {
            using (var transaction = await _context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Declare variables
                    string adjustmentNo;
                    int nextNumber;

                    // Get all relevant report numbers first (client-side evaluation)
                    var reportNumbers = await _context.AdjustmentReports
                        .Where(ar => ar.ReportNo.StartsWith("ADJUST"))
                        .Select(ar => ar.ReportNo)
                        .ToListAsync(); // Bring the data into memory

                    // Extract the numerical part, parse it, and find the maximum number
                    nextNumber = reportNumbers
                        .Select(rn => int.TryParse(rn.AsSpan(rn.Length - 3), out var num) ? num : 0)
                        .DefaultIfEmpty(0)
                        .Max();

                    // Increment the number
                    nextNumber += 1;

                    // Generate the new adjustment number
                    adjustmentNo = $"ADJUST-{nextNumber.ToString().PadLeft(3, '0')}";

                    // Save changes
                    await _context.SaveChangesAsync();

                    // Commit the transaction
                    await transaction.CommitAsync();

                    // Return the generated adjustment number
                    return adjustmentNo;
                }
                catch (Exception)
                {
                    // Rollback the transaction in case of an error
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }

        public async Task<AjaxResult> DeleteReport(int Id)
        {
            var res = new AjaxResult();
            var report = await _context.AdjustmentReports.FindAsync(Id);
            if (report == null)
            {
                res.StatusCode = Enums.Status.Error;
                res.Message = "Record Not Found";
            }
            else
            {
                report.IsDeleted = true;
                report.ModifiedDate = DateTime.Now;
                var changeRiskManagement = await _context.ChangeRiskManagement_AdjustmentReport.Where(x => x.AdjustMentReportId == Id).ToListAsync();
                if (changeRiskManagement.Count > 0)
                {
                    changeRiskManagement.ForEach(x => x.IsDeleted = true);
                }

                int rowsAffected = await _context.SaveChangesAsync();

                if (rowsAffected > 0)
                {
                    res.StatusCode = Enums.Status.Success;
                    res.Message = "Record deleted successfully.";
                }
                else
                {
                    res.StatusCode = Enums.Status.Error;
                    res.Message = "Record deletion failed.";
                }
            }
            return res;
        }

        public async Task<AjaxResult> DeleteAttachment(int Id)
        {
            var res = new AjaxResult();
            var photos = await _context.Photos.FindAsync(Id);
            if (photos == null)
            {
                res.StatusCode = Enums.Status.Error;
                res.Message = "Record Not Found";
            }
            else
            {
                photos.IsDeleted = true;
                photos.ModifiedDate = DateTime.Now;
                int rowsAffected = await _context.SaveChangesAsync();

                if (rowsAffected > 0)
                {
                    res.StatusCode = Enums.Status.Success;
                    res.Message = "Record deleted successfully.";
                }
                else
                {
                    res.StatusCode = Enums.Status.Error;
                    res.Message = "Record deletion failed.";
                }
            }
            return res;
        }

        public async Task<AjaxResult> GetEmployeeDetailsById(int id, string email)
        {
            var res = new AjaxResult();
            var result = await _sprocRepository.GetStoredProcedure("[dbo].[SPP_GetEmployeeDetails]")
                                            .WithSqlParams(
                                                 ("@ID", id),
                                                 ("@email", email)
                                            ).ExecuteStoredProcedureAsync<EmployeeDetailsView>();
            if (result == null)
            {
                res.Message = "Employee Data not found";
                res.StatusCode = Enums.Status.Error;
                return res;
            }
            else
            {
                res.Message = "Employee Details Fetched Successfully";
                res.StatusCode = Enums.Status.Success;
                res.ReturnValue = result.FirstOrDefault();
            }
            return res;
        }

        #endregion

        #region Approval Flow 

        public async Task<AjaxResult> UpdateApproveAskToAmend(ApproveAsktoAmend asktoAmend)
        {
            var res = new AjaxResult();
            ///bool result = false;
            try
            {
                var requestTaskData = _context.AdjustmentReportApproverTaskMasters.Where(x => x.ApproverTaskId == asktoAmend.ApproverTaskId && x.IsActive == true
                                     && x.AdjustmentReportId == asktoAmend.AdjustmentId
                                     && x.Status == ApprovalTaskStatus.InReview.ToString()).FirstOrDefault();
                if (requestTaskData == null)
                {
                    res.Message = "Adjustment Report request does not have any review task";
                    return res;
                }

                if (asktoAmend.Type == ApprovalStatus.Approved)
                {
                    requestTaskData.Status = ApprovalTaskStatus.Approved.ToString();
                    requestTaskData.ModifiedBy = asktoAmend.CurrentUserId;
                    requestTaskData.ActionTakenBy = asktoAmend.CurrentUserId;
                    requestTaskData.ActionTakenDate = DateTime.Now;
                    requestTaskData.ModifiedDate = DateTime.Now;
                    requestTaskData.Comments = asktoAmend.Comment;
                    await _context.SaveChangesAsync();


                    res.Message = Enums.AdjustMentApprove;

                    InsertHistoryData(asktoAmend.AdjustmentId, FormType.EquipmentImprovement.ToString(), requestTaskData.Role, asktoAmend.Comment, ApprovalTaskStatus.Approved.ToString(), Convert.ToInt32(asktoAmend.CurrentUserId), HistoryAction.Approved.ToString(), 0);

                    if(asktoAmend.IsDivHeadRequired == true)
                    {
                        var divisionHead = _context.AdjustmentReportApproverTaskMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId &&  x.IsActive == false && x.SequenceNo == 8)
                                  .OrderByDescending(x => x.ApproverTaskId)
                                .FirstOrDefault();
                        if (divisionHead != null)
                        {
                            divisionHead.IsActive = true;
                            await _context.SaveChangesAsync();
                        }
                    }
                    //if (asktoAmend.AdvisorId != null && asktoAmend.AdvisorId > 0)
                    //{
                    //    var advisorData = new AdjustmentAdvisorMaster();
                    //    advisorData.EmployeeId = asktoAmend.AdvisorId;
                    //    advisorData.IsActive = true;
                    //    advisorData.AdjustmentReportId = asktoAmend.AdjustmentId;
                    //    _context.AdjustmentAdvisorMasters.Add(advisorData);
                    //    await _context.SaveChangesAsync();
                    //}

                    if (asktoAmend.AdditionalDepartmentHeads != null && asktoAmend.AdditionalDepartmentHeads.Count > 0)
                    {
                        foreach (var data in asktoAmend.AdditionalDepartmentHeads)
                        {
                            var additionalDepartmentHead = new AdjustmentAdditionalDepartmentHeadMaster();
                            additionalDepartmentHead.ApprovalSequence = data.ApprovalSequence;
                            additionalDepartmentHead.DepartmentId = data.DepartmentId;
                            additionalDepartmentHead.EmployeeId = data.EmployeeId;
                            additionalDepartmentHead.IsActive = true;
                            additionalDepartmentHead.AdjustmentReportId = asktoAmend.AdjustmentId;
                            _context.AdjustmentAdditionalDepartmentHeadMasters.Add(additionalDepartmentHead);
                            await _context.SaveChangesAsync();
                        }

                        var otherdepartmenthead1 = _context.AdjustmentReportApproverTaskMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.AssignedToUserId == 0 && x.Role == "Other Department Head 1" && x.IsActive == false && x.SequenceNo == 4)
                                                 .OrderByDescending(x => x.ApproverTaskId)
                                               .FirstOrDefault();
                        var departmentHead1 = _context.AdjustmentAdditionalDepartmentHeadMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.ApprovalSequence == 1 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault();
                        var departmentId1 = _context.AdjustmentAdditionalDepartmentHeadMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.ApprovalSequence == 1 && x.IsActive == true).Select(x => x.DepartmentId).FirstOrDefault();
                        var departMentName1 = _cloneContext.DepartmentMasters.Where(x => x.DepartmentID == departmentId1).Select(x => x.Name).FirstOrDefault();
                        //var departmentName1 = (from aad in _context.AdjustmentAdditionalDepartmentHeadMasters
                        //                       join dm in _cloneContext.DepartmentMasters
                        //                       on aad.DepartmentId equals dm.DepartmentID
                        //                       where aad.AdjustmentReportId == asktoAmend.AdjustmentId
                        //                             && aad.ApprovalSequence == 1
                        //                             && aad.IsActive == true
                        //                       select dm.Name).FirstOrDefault();

                        if (otherdepartmenthead1 != null && departmentHead1 > 0)
                        {
                            otherdepartmenthead1.AssignedToUserId = departmentHead1;
                            otherdepartmenthead1.IsActive = true;
                            otherdepartmenthead1.DisplayName = departMentName1;
                            await _context.SaveChangesAsync();
                        }

                        var otherdepartmenthead2 = _context.AdjustmentReportApproverTaskMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.AssignedToUserId == 0 && x.Role == "Other Department Head 2" && x.IsActive == false && x.SequenceNo == 5)
                                           .OrderByDescending(x => x.ApproverTaskId)
                                          .FirstOrDefault();
                        var departmentHead2 = _context.AdjustmentAdditionalDepartmentHeadMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.ApprovalSequence == 2 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault();
                        var departmentId2 = _context.AdjustmentAdditionalDepartmentHeadMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.ApprovalSequence == 2 && x.IsActive == true).Select(x => x.DepartmentId).FirstOrDefault();
                        var departMentName2 = _cloneContext.DepartmentMasters.Where(x => x.DepartmentID == departmentId2).Select(x => x.Name).FirstOrDefault();
                        if (otherdepartmenthead2 != null && departmentHead2 > 0)
                        {
                            otherdepartmenthead2.AssignedToUserId = departmentHead2;
                            otherdepartmenthead2.IsActive = true;
                            otherdepartmenthead2.DisplayName = departMentName2;
                            await _context.SaveChangesAsync();
                        }

                        var otherdepartmenthead3 = _context.AdjustmentReportApproverTaskMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.AssignedToUserId == 0 && x.Role == "Other Department Head 3" && x.IsActive == false && x.SequenceNo == 6)
                                                .OrderByDescending(x => x.ApproverTaskId)
                                                .FirstOrDefault();
                        var departmentHead3 = _context.AdjustmentAdditionalDepartmentHeadMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.ApprovalSequence == 3 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault();
                        var departmentId3 = _context.AdjustmentAdditionalDepartmentHeadMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.ApprovalSequence == 3 && x.IsActive == true).Select(x => x.DepartmentId).FirstOrDefault();
                        var departMentName3 = _cloneContext.DepartmentMasters.Where(x => x.DepartmentID == departmentId3).Select(x => x.Name).FirstOrDefault();

                        if (otherdepartmenthead3 != null && departmentHead3 > 0)
                        {
                            otherdepartmenthead3.AssignedToUserId = departmentHead3;
                            otherdepartmenthead3.IsActive = true;
                            otherdepartmenthead3.DisplayName = departMentName3;
                            await _context.SaveChangesAsync();
                        }

                    }

                    var currentApproverTask = _context.AdjustmentReportApproverTaskMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.IsActive == true
                                                   && x.ApproverTaskId == asktoAmend.ApproverTaskId && x.Status == ApprovalTaskStatus.Approved.ToString()).FirstOrDefault();


                    if (currentApproverTask != null)
                    {
                        // var nextApproveTask = _context.AdjustmentReportApproverTaskMasters.Where(x => x.AdjustmentReportId == requestTaskData.AdjustmentReportId && x.IsActive == true
                        //&& x.Status == ApprovalTaskStatus.Pending.ToString() && x.SequenceNo == (requestTaskData.SequenceNo) + 1).ToList();
                        var nextApproveTask = _context.AdjustmentReportApproverTaskMasters
                                                      .Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId
                                                       && x.IsActive == true
                                                       && x.Status == ApprovalTaskStatus.Pending.ToString()
                                                       && x.SequenceNo > currentApproverTask.SequenceNo)
                                                             .OrderBy(x => x.SequenceNo) // Ensure tasks are processed in sequence order
                                                             .FirstOrDefault();
                        if (nextApproveTask != null)
                        {

                            nextApproveTask.Status = ApprovalTaskStatus.InReview.ToString();
                            nextApproveTask.ModifiedDate = DateTime.Now;
                            await _context.SaveChangesAsync();

                        }
                        else
                        {
                            var adjustmentData = _context.AdjustmentReports.Where(x => x.AdjustMentReportId == asktoAmend.AdjustmentId && x.IsDeleted == false && x.IsDeleted == false).FirstOrDefault();
                            if (adjustmentData != null)
                            {
                                adjustmentData.Status = ApprovalTaskStatus.Completed.ToString();
                                await _context.SaveChangesAsync();
                            }
                        }
                    }

                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendEquipmentEmail(asktoAmend.AdjustmentId, EmailNotificationAction.Approved, asktoAmend.Comment, asktoAmend.ApproverTaskId);
                }


                if (asktoAmend.Type == ApprovalStatus.AskToAmend)
                {
                    requestTaskData.Status = ApprovalTaskStatus.UnderAmendment.ToString();
                    requestTaskData.ModifiedBy = asktoAmend.CurrentUserId;
                    requestTaskData.ActionTakenBy = asktoAmend.CurrentUserId;
                    requestTaskData.ActionTakenDate = DateTime.Now;
                    requestTaskData.ModifiedDate = DateTime.Now;
                    requestTaskData.Comments = asktoAmend.Comment;

                    await _context.SaveChangesAsync();
                    res.Message = Enums.AdjustMentAsktoAmend;

                    var adjustmentReport = _context.AdjustmentReports.Where(x => x.AdjustMentReportId == asktoAmend.AdjustmentId && x.IsDeleted == false).FirstOrDefault();
                    adjustmentReport.Status = ApprovalTaskStatus.UnderAmendment.ToString();
                    //equipment.WorkFlowStatus = ApprovalTaskStatus.UnderAmendment.ToString();
                    await _context.SaveChangesAsync();

                    InsertHistoryData(asktoAmend.AdjustmentId, FormType.EquipmentImprovement.ToString(), requestTaskData.Role, asktoAmend.Comment, ApprovalTaskStatus.UnderAmendment.ToString(), Convert.ToInt32(asktoAmend.CurrentUserId), HistoryAction.UnderAmendment.ToString(), 0);
                    
                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendEquipmentEmail(asktoAmend.AdjustmentId, EmailNotificationAction.Amended, asktoAmend.Comment, asktoAmend.ApproverTaskId);
                }


            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Adjustment UpdateApproveAskToAmend");
            }
            return res;
        }


        public async Task<AjaxResult> PullBackRequest(PullBackRequest data)
        {
            var res = new AjaxResult();
            try
            {
                var adjustment = _context.AdjustmentReports.Where(x => x.AdjustMentReportId == data.AdjustmentReportId && x.IsDeleted == false).FirstOrDefault();
                if (adjustment != null)
                {
                    adjustment.IsSubmit = false;
                    adjustment.Status = ApprovalTaskStatus.Draft.ToString();
                    adjustment.ModifiedBy = data.userId;

                    await _context.SaveChangesAsync();

                    var approverTaskDetails = _context.AdjustmentReportApproverTaskMasters.Where(x => x.AdjustmentReportId == data.AdjustmentReportId).ToList();
                    approverTaskDetails.ForEach(a =>
                    {
                        a.IsActive = false;
                        a.ModifiedBy = data.userId;
                        a.ModifiedDate = DateTime.Now;
                    });
                    await _context.SaveChangesAsync();

                    var advisorId = _context.AdjustmentAdvisorMasters.Where(x => x.AdjustmentReportId == data.AdjustmentReportId && x.IsActive == true).FirstOrDefault();
                    if (advisorId != null)
                    {
                        advisorId.IsActive = false;
                        await _context.SaveChangesAsync();
                    }

                    InsertHistoryData(data.AdjustmentReportId, FormType.AjustmentReport.ToString(), "Requestor", data.comment, ApprovalTaskStatus.Draft.ToString(), Convert.ToInt32(data.userId), HistoryAction.PullBack.ToString(), 0);


                    InsertHistoryData(data.AdjustmentReportId, FormType.AjustmentReport.ToString(), "Requestor",data.comment, ApprovalTaskStatus.Draft.ToString(), Convert.ToInt32(data.userId), HistoryAction.PullBack.ToString(), 0);
                   
                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendAdjustmentEmai(data.AdjustmentReportId, EmailNotificationAction.PullBack, string.Empty, 0);
                    res.StatusCode = Enums.Status.Success;
                    res.Message = Enums.AdjustMentPullback;
                }
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Adjustment PullBack");
                // return res;
            }
            return res;
        }

        public async Task<AjaxResult> GeAdjustmentReportWorkFlow(int Id)
        {
            var res = new AjaxResult();
            var approverData = await _context.GeAdjustmentReportWorkFlow(Id);
            var processedData = new List<AdjustmentReportApproverTaskMasterAdd>();
            foreach (var entry in approverData)
            {
                processedData.Add(entry);
            }
            res.ReturnValue = processedData;
            return res;
        }

        public async Task<AjaxResult> GetCurrentApproverTask(int Id, int userId)
        {
            var res = new AjaxResult();
            var materialApprovers = await _context.AdjustmentReportApproverTaskMasters.FirstOrDefaultAsync(x => x.AdjustmentReportId == Id && x.AssignedToUserId == userId && x.Status == ApprovalTaskStatus.InReview.ToString() && x.IsActive == true);
            var data = new ApproverTaskId_dto();
            if (materialApprovers != null)
            {
                data.approverTaskId = materialApprovers.ApproverTaskId;
                data.userId = materialApprovers.AssignedToUserId ?? 0;
                data.status = materialApprovers.Status;
                data.seqNumber = materialApprovers.SequenceNo;
            }
            res.ReturnValue = data;
            return res;
        }

        #endregion

        #region Advisor flow

        public async Task<AjaxResult> AddOrUpdateAdvisorData(AdjustmentAdvisor request)
        {
            var res = new AjaxResult();
            try
            {
                var advisor = _context.AdjustmentAdvisorMasters.Where(x => x.AdjustmentAdvisorId == x.AdjustmentAdvisorId && x.AdjustmentReportId == request.AdjustmentReportId && x.IsActive == true && x.EmployeeId == request.AdvisorId).FirstOrDefault();
                if (advisor != null) 
                {
                    advisor.Comment = request.Comment;
                    await _context.SaveChangesAsync();
                }
                res.Message = Enums.AdjustmentUdpated;
                res.StatusCode = Enums.Status.Success;
            }
            catch(Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "AddOrUpdateAdvisorData");
            }
            return res;
        }

        public AdjustmentAdvisor GetAdvisorData(int adjustmentReportId)
        {
            var res = _context.AdjustmentAdvisorMasters.Where(x => x.AdjustmentReportId == adjustmentReportId && x.IsActive == true).FirstOrDefault();
            
            if(res == null)
            {
                return null;
            }

            var advisorData = new AdjustmentAdvisor();
            advisorData.AdjustmentAdvisorId = res.AdjustmentAdvisorId;
            advisorData.AdjustmentReportId = res.AdjustmentReportId;
            advisorData.Comment = res.Comment;

            return advisorData;
        }

        #endregion 

        #region Excel and Pdf

        public async Task<AjaxResult> GetAdjustmentReportExcel(DateTime fromDate, DateTime todate, int employeeId, int type)
        {
            var res = new AjaxResult();

            try
            {
                var excelData = await _sprocRepository.GetStoredProcedure("[dbo].[GetAdjustmentReportExcel]")
                .WithSqlParams(
                    ("@FromDate", fromDate),
                    ("@ToDate", todate),
                    ("@EmployeeId", employeeId),
                    ("@Type", type)
                ).ExecuteStoredProcedureAsync<AdjustmentReportExcelView>();

                using (var workbook = new XLWorkbook())
                {
                    var worksheet = workbook.Worksheets.Add("Adjustment Report");

                    // Get properties and determine columns to exclude
                    var properties = excelData.GetType().GetGenericArguments()[0].GetProperties();
                    var columnsToExclude = new List<int>(); // Adjust this list based on your exclusion logic

                    // Write header, excluding specified columns
                    int columnIndex = 1;

                    foreach (var property in properties)
                    {
                        if (!columnsToExclude.Contains(Array.IndexOf(properties, property)))
                        {
                            var cell = worksheet.Cell(1, columnIndex);
                            string headerText = ColumnHeaderMapping.ContainsKey(property.Name) ? ColumnHeaderMapping[property.Name] : CapitalizeFirstLetter(property.Name);
                            cell.Value = headerText;

                            // Apply style to the header cell
                            cell.Style.Fill.BackgroundColor = XLColor.LightBlue;
                            cell.Style.Font.Bold = true;
                            cell.Style.Border.BottomBorder = XLBorderStyleValues.Thick;
                            columnIndex++;
                        }
                    }

                    // Write data, excluding specified columns
                    for (int i = 0; i < excelData.Count; i++)
                    {
                        var item = excelData[i];
                        columnIndex = 1;

                        foreach (var property in properties)
                        {
                            if (!columnsToExclude.Contains(Array.IndexOf(properties, property)))
                            {
                                var value = property.GetValue(item, null);
                                string stringValue = value != null ? value.ToString() : string.Empty;

                                worksheet.Cell(i + 2, columnIndex).Value = stringValue;
                                columnIndex++;
                            }
                        }
                    }

                    // Add filter to the header row
                    worksheet.Range(1, 1, 1, columnIndex - 1).SetAutoFilter();

                    // Adjust column widths to fit the content
                    worksheet.Columns().AdjustToContents();

                    // Save the workbook to a memory stream
                    using (var stream = new MemoryStream())
                    {
                        workbook.SaveAs(stream);
                        stream.Position = 0;

                        // Convert the memory stream to a byte array
                        byte[] byteArray = stream.ToArray();
                        string base64String = Convert.ToBase64String(byteArray);

                        // Return the byte array as part of your AjaxResult
                        res.StatusCode = Enums.Status.Success;
                        res.Message = "File downloaded successfully";
                        res.ReturnValue = base64String;
                        return res;
                    }
                }

            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "GetAdjustmentReportExcel");
                return res;
            }
        }

        private static readonly Dictionary<string, string> ColumnHeaderMapping = new Dictionary<string, string>
        {
            {"CreatedDate", "When" },
            {"AreaName","Area" },
        };

        private string CapitalizeFirstLetter(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            return char.ToUpper(input[0]) + input.Substring(1);
        }

        public async Task<AjaxResult> ExportToPdf(int adjustMentReportId)
        {
            var res = new AjaxResult();
            try
            {
                var adjustMentReportData = _context.AdjustmentReports.Where(x => x.AdjustMentReportId == adjustMentReportId && x.IsDeleted == false).FirstOrDefault();

                //normal data
                var data = await GetAdjustmentData(adjustMentReportId);

                //approvers data
                var approverData = await _context.GeAdjustmentReportWorkFlow(adjustMentReportId);

                StringBuilder sb = new StringBuilder();
                string? htmlTemplatePath = _configuration["TemplateSettings:PdfTemplate"];
                string baseDirectory = AppContext.BaseDirectory;
                DirectoryInfo? directoryInfo = new DirectoryInfo(baseDirectory);

                string templateFile = "AdjustmentReportPDF.html";

                string templateFilePath = Path.Combine(baseDirectory, htmlTemplatePath, templateFile);

                string? htmlTemplate = System.IO.File.ReadAllText(templateFilePath);
                sb.Append(htmlTemplate);

                var machineName = _context.Machines.Where(x => x.MachineId == adjustMentReportData.MachineName).Select(x => x.MachineName).FirstOrDefault();
                var applicant = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == adjustMentReportData.CreatedBy).Select(x => x.EmployeeName).FirstOrDefault();
                var checkedBy = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == adjustMentReportData.CheckedBy).Select(x => x.EmployeeName).FirstOrDefault();

                
                var areaIds = adjustMentReportData.Area.Split(',').Select(id => int.Parse(id)).ToList();

                var areaNames = new List<string>();
                foreach (var id in areaIds)
                {
                    // Query database or use a dictionary/cache to get the name
                    var areaName = _context.Areas.Where(x => x.AreaId == id && x.IsActive == true).Select(x => x.AreaName).FirstOrDefault(); // Replace this with your actual DB logic
                    if (!string.IsNullOrEmpty(areaName))
                    {
                        areaNames.Add(areaName);
                    }
                }

                var areaNamesString = string.Join(", ", areaNames);

                sb.Replace("#area#", areaNamesString);
                sb.Replace("#reportno#", adjustMentReportData.ReportNo);
                sb.Replace("#requestor#", applicant);
                sb.Replace("#machinename#", machineName);
                sb.Replace("#checkedby#", checkedBy);
                sb.Replace("#when#", adjustMentReportData.When?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#describeproblem#", adjustMentReportData.DescribeProblem);
                sb.Replace("#observation#", adjustMentReportData.Observation);
                sb.Replace("#rootcause#", adjustMentReportData.RootCause);
                sb.Replace("#adjustmentdesciption#", adjustMentReportData.AdjustmentDescription);
                sb.Replace("#conditionafteradjustment#", adjustMentReportData.ConditionAfterAdjustment);
                //sb.Replace("#Remarks#", data.FirstOrDefault()?.Remarks);

                StringBuilder tableBuilder = new StringBuilder();

                string approvedBySectionHead = approverData.FirstOrDefault(a => a.SequenceNo == 2)?.employeeNameWithoutCode ?? "N/A";
                string approvedByDepartmentHead = approverData.FirstOrDefault(a => a.SequenceNo == 3)?.employeeNameWithoutCode ?? "N/A";
                string approvedByDivisionHead = approverData.FirstOrDefault(a => a.SequenceNo == 7)?.employeeNameWithoutCode ?? "N/A";

                sb.Replace("#sectionhead#", approvedBySectionHead);
                sb.Replace("#departmenthead#", approvedByDepartmentHead);
                sb.Replace("#divisionhead#", approvedByDivisionHead);


                using (var ms = new MemoryStream())
                {
                    Document document = new Document(iTextSharp.text.PageSize.A3, 10f, 10f, 10f, 30f);
                    PdfWriter writer = PdfWriter.GetInstance(document, ms);
                    document.Open();

                    // Convert the StringBuilder HTML content to a PDF using iTextSharp
                    using (var sr = new StringReader(sb.ToString()))
                    {
                        iTextSharp.tool.xml.XMLWorkerHelper.GetInstance().ParseXHtml(writer, document, sr);
                    }

                    document.Close();

                    // Convert the PDF to a byte array
                    byte[] pdfBytes = ms.ToArray();

                    // Encode the PDF as a Base64 string
                    string base64String = Convert.ToBase64String(pdfBytes);

                    // Set response values
                    res.StatusCode = Enums.Status.Success;
                    res.Message = Enums.AdjustMentPdf;
                    res.ReturnValue = base64String; // Send the Base64 string to the frontend

                    return res;
                }
            }

            catch (Exception ex)
            {
                res.Message = "Fail " + ex.Message;
                res.StatusCode = Enums.Status.Error;

                // Log the exception using your logging mechanism
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "ExportToPdf");

                return res;
            }
        }

        public async Task<IEnumerable<AdjustmentReportPdfView>> GetAdjustmentData(int adjustmentId)
        {
            var parameters = new { AdjustmentId = adjustmentId };
            var query = "EXEC dbo.AdjustementFormPdf @AdjustmentId";

            using (var connection = new SqlConnection(_connectionString))
            {
                return await connection.QueryAsync<AdjustmentReportPdfView>(query, parameters);
            }
        }



        public async Task<AjaxResult> GetSectionHead(int adjustmentReportId)
        {
            var res = new AjaxResult();
            try
            {
                var sectionHeadIdParam = new SqlParameter("@SectionHeadId", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                var adjustmentReportIdParam = new SqlParameter("@AdjustmentReportId", SqlDbType.Int)
                {
                    Value = adjustmentReportId
                };

                // Call the stored procedure
                _context.Database.ExecuteSqlRaw(
                    "EXEC [dbo].[SPP_GetSectionHead] @AdjustmentReportId, @SectionHeadId OUT",
                    adjustmentReportIdParam,
                    sectionHeadIdParam);

                // Retrieve the output parameter value
                int sectionHeadId = (int)sectionHeadIdParam.Value;

                if (sectionHeadId == 0) // Assuming 0 means no data found
                {
                    res.Message = "Data not found";
                    res.StatusCode = Enums.Status.Error;
                }
                else
                {
                    res.Message = "Details Fetched Successfully";
                    res.StatusCode = Enums.Status.Success;
                    res.ReturnValue = sectionHeadId;
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions
                res.Message = $"An error occurred: {ex.Message}";
                res.StatusCode = Enums.Status.Error;
            }

            return res;
        }

        public async Task<AjaxResult> GetDepartmentHead(int adjustmentReportId)
        {
            var res = new AjaxResult();

            try
            {
                var departmentHeadIdParam = new SqlParameter("@DepartmentHeadId", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                var adjustmentReportIdParam = new SqlParameter("@AdjustmentReportId", SqlDbType.Int)
                {
                    Value = adjustmentReportId
                };

                // Call the stored procedure
                _context.Database.ExecuteSqlRaw(
                    "EXEC [dbo].[SPP_GetDepartmentHead] @AdjustmentReportId, @DepartmentHeadId OUT",
                    adjustmentReportIdParam,
                    departmentHeadIdParam);

                // Retrieve the output parameter value
                int departmentHeadId = (int)departmentHeadIdParam.Value;

                if (departmentHeadId == 0) // Assuming 0 means no data found
                {
                    res.Message = "Data not found";
                    res.StatusCode = Enums.Status.Error;
                }
                else
                {
                    res.Message = "Details Fetched Successfully";
                    res.StatusCode = Enums.Status.Success;
                    res.ReturnValue = departmentHeadId;
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions
                res.Message = $"An error occurred: {ex.Message}";
                res.StatusCode = Enums.Status.Error;
            }

            return res;
        }

        public async Task<AjaxResult> GetAdditionalDepartmentHeads()
        {
            var res = new AjaxResult();
            var result = await _sprocRepository.GetStoredProcedure("[dbo].[SPP_GetAdditionalDepartmentHeads]")
                .ExecuteStoredProcedureAsync<DepartmentHeadsView>();

            if (result == null)
            {
                res.Message = "Data not found";
                res.StatusCode = Enums.Status.Error;
                return res;
            }
            else
            {
                res.Message = "Employee Details Fetched Successfully";
                res.StatusCode = Enums.Status.Success;
                res.ReturnValue = result;
            }
            return res;
        }

        #endregion

        #region History Section

        public void InsertHistoryData(int formId, string formtype, string role, string comment, string status, int actionByUserID, string actionType, int delegateUserId)
        {
            var res = new AjaxResult();
            var adjustmentHistory = new AdjustmentHistoryMaster()
            {
                FormID = formId,
                FormType = formtype,
                ActionTakenDateTime = DateTime.Now,
                ActionTakenByUserID = actionByUserID,
                Role = role,
                Status = status,
                Comment = comment,
                ActionType = actionType,
                DelegateUserId = delegateUserId,
                IsActive = true
            };
            _context.AdjustmentHistoryMasters.Add(adjustmentHistory);
            _context.SaveChanges();
        }

        public List<TroubleReportHistoryView> GetHistoryData(int adjustmentId)
        {
            var troubleHistorydata = _context.AdjustmentHistoryMasters.Where(x => x.FormID == adjustmentId && x.IsActive == true).ToList();

            return troubleHistorydata.Select(x => new TroubleReportHistoryView()
            {
                historyID = x.HistoryID,
                formID = x.FormID,
                status = x.Status,
                actionTakenDateTime = x.ActionTakenDateTime?.ToString("dd-MM-yyyy HH:mm:ss"),
                actionType = x.ActionType,
                role = x.Role,
                comment = x.Comment,
                actionTakenBy = _cloneContext.EmployeeMasters
                                  .Where(emp => emp.EmployeeID == x.ActionTakenByUserID)
                                  .Select(emp => emp.EmployeeName)
                                  .FirstOrDefault() ?? "Unknown"
            }).ToList();
        }
        #endregion


    }
}