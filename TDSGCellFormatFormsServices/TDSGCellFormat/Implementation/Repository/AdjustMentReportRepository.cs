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

namespace TDSGCellFormat.Implementation.Repository
{
    public class AdjustMentReportRepository : BaseRepository<AdjustmentReport>, IAdjustMentReportRepository
    {
        private readonly TdsgCellFormatDivisionContext _context;
        private readonly ISprocRepository _sprocRepository;
        private readonly IConfiguration _configuration;

        public AdjustMentReportRepository(TdsgCellFormatDivisionContext context, IConfiguration configuration)
            : base(context)
        {
            _sprocRepository = new SprocRepository(context);
            this._context = context;
            _configuration = configuration;
        }

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

            AdjustMentReportRequest adjustmentData = new AdjustMentReportRequest()
            {
                AdjustMentReportId = res.AdjustMentReportId,
                ReportNo = res.ReportNo,
                Area = !string.IsNullOrEmpty(res.Area) ? res.Area.Split(',').Select(s => int.Parse(s.Trim())).ToList() : new List<int>(),
                MachineName = res.MachineName,
                SubMachineName = !string.IsNullOrEmpty(res.SubMachineName) ? res.SubMachineName.Split(',').Select(s => int.Parse(s.Trim())).ToList() : new List<int>(),
                RequestBy = res.RequestBy,
                CheckedBy = res.CheckedBy,
                DescribeProblem = res.DescribeProblem,
                Observation = res.Observation,
                RootCause = res.RootCause,
                AdjustmentDescription = res.AdjustmentDescription,
                Photos = GetAdjustmentReportPhotos(Id),
                ChangeRiskManagementRequired = res.ChangeRiskManagementRequired,
                //ConditionAfterAdjustment = res.ConditionAfterAdjustment,
                Status = res.Status,
                IsSubmit = res.IsSubmit,
                //EmployeeId = res.EmployeeId,
                CreatedBy = res.CreatedBy,
                CreatedDate = res.CreatedDate,
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
                    var newReport = new AdjustmentReport()
                    {
                        Area = request.Area != null && request.Area.Count > 0 ? string.Join(",", request.Area) : "",
                        MachineName = request.MachineName,
                        SubMachineName = request.SubMachineName != null && request.SubMachineName.Count > 0 ? string.Join(",", request.SubMachineName) : "",
                        ReportNo = adjustmentReportNo.ToString(),
                        RequestBy = request.RequestBy,
                        CheckedBy = request.CheckedBy,
                        //  EmployeeId = request.EmployeeId,
                        DescribeProblem = request.DescribeProblem,
                        Observation = request.Observation,
                        RootCause = request.RootCause,
                        AdjustmentDescription = request.AdjustmentDescription,
                        // ConditionAfterAdjustment = request.ConditionAfterAdjustment,
                        ChangeRiskManagementRequired = request.ChangeRiskManagementRequired,
                        Status = ApprovalTaskStatus.Draft.ToString(),
                        IsSubmit = request.IsSubmit,
                        CreatedDate = DateTime.Now,
                        CreatedBy = request.CreatedBy,
                        IsDeleted = false
                    };

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

                    if (request.Photos != null)
                    {
                        if (request.Photos.BeforeImages != null && request.Photos.AfterImages != null)
                        {
                            var totalRecordsToInsert = request.Photos.BeforeImages.Concat(request.Photos.AfterImages).ToList();
                            totalRecordsToInsert.ForEach(x => x.AdjustmentReportId = adjustMentReportId);

                            _context.Photos.AddRange(totalRecordsToInsert);
                        }
                    }

                    await _context.SaveChangesAsync();

                    if (request.IsSubmit == true && request.IsAmendReSubmitTask == false)
                    {
                        var data = await SubmitRequest(adjustMentReportId, request.EmployeeId);
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

                    res.ReturnValue = new
                    {
                        AdjustmentReportId = adjustMentReportId,
                        AdjustmentReportNo = adjustmentReportNo
                    };
                    res.StatusCode = Status.Success;
                    res.Message = Enums.AdjustMentSave;
                }
                else
                {
                    existingReport.Area = request.Area != null && request.Area.Count > 0 ? string.Join(",", request.Area) : ""; ;
                    existingReport.MachineName = request.MachineName;
                    existingReport.SubMachineName = request.SubMachineName != null && request.SubMachineName.Count > 0 ? string.Join(",", request.SubMachineName) : "";
                    //existingReport.EmployeeId = request.EmployeeId;
                    existingReport.RequestBy = request.RequestBy;
                    existingReport.CheckedBy = request.CheckedBy;
                    existingReport.DescribeProblem = request.DescribeProblem;
                    existingReport.Observation = request.Observation;
                    existingReport.RootCause = request.RootCause;
                    existingReport.AdjustmentDescription = request.AdjustmentDescription;
                    //existingReport.ConditionAfterAdjustment = request.ConditionAfterAdjustment;
                    existingReport.ChangeRiskManagementRequired = request.ChangeRiskManagementRequired;
                    existingReport.Status = request.Status ?? ApprovalTaskStatus.Draft.ToString();
                    existingReport.IsSubmit = request.IsSubmit;
                    existingReport.ModifiedDate = DateTime.Now;
                    existingReport.ModifiedBy = request.ModifiedBy;
                    await _context.SaveChangesAsync();

                    var existingChangeRiskManagement = _context.ChangeRiskManagement_AdjustmentReport.Where(x => x.AdjustMentReportId == existingReport.AdjustMentReportId && x.IsDeleted == false).ToList();
                    existingChangeRiskManagement.ForEach(x => x.IsDeleted = true);
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

                    var existingPhotos = _context.Photos.Where(x => x.AdjustmentReportId == existingReport.AdjustMentReportId).ToList();
                    existingPhotos.ForEach(x => x.IsDeleted = true);
                    _context.SaveChanges();

                    if (request.Photos != null && request.Photos.BeforeImages != null && request.Photos.AfterImages != null)
                    {
                        var beforeImages = request.Photos.BeforeImages;
                        var afterImages = request.Photos.AfterImages;

                        foreach (var attach in beforeImages)
                        {
                            var updatedUrl = attach.DocumentFilePath.Replace($"/{request.EmployeeId}/", $"/{existingReport.ReportNo}/");
                            var existingAttachData = _context.Photos.Where(x => x.AdjustmentReportId == attach.AdjustmentReportId && x.AdjustmentReportPhotoId == attach.AdjustmentReportPhotoId).FirstOrDefault();
                            if (existingAttachData != null)
                            {
                                existingAttachData.DocumentName = attach.DocumentName;
                                existingAttachData.DocumentFilePath = attach.DocumentFilePath;
                                existingAttachData.SequenceId = attach.SequenceId;
                                existingAttachData.IsDeleted = false;
                                existingAttachData.ModifiedBy = attach.ModifiedBy;
                                existingAttachData.ModifiedDate = DateTime.Now;
                            }
                            else
                            {

                                var attachment = new AdjustmentReportPhoto()
                                {
                                    AdjustmentReportId = existingReport.AdjustMentReportId,
                                    DocumentName = attach.DocumentName,
                                    DocumentFilePath = updatedUrl,
                                    SequenceId = attach.SequenceId,
                                    IsOldPhoto = attach.IsOldPhoto,
                                    IsDeleted = false,
                                    CreatedBy = attach.CreatedBy,
                                    CreatedDate = DateTime.Now,
                                };
                                _context.Photos.Add(attachment);
                            }
                            await _context.SaveChangesAsync();
                        }

                        foreach (var attach in afterImages)
                        {
                            var updatedUrl = attach.DocumentFilePath.Replace($"/{request.EmployeeId}/", $"/{existingReport.ReportNo}/");
                            var existingAttachData = _context.Photos.Where(x => x.AdjustmentReportId == attach.AdjustmentReportId && x.AdjustmentReportPhotoId == attach.AdjustmentReportPhotoId).FirstOrDefault();
                            if (existingAttachData != null)
                            {
                                existingAttachData.DocumentName = attach.DocumentName;
                                existingAttachData.DocumentFilePath = attach.DocumentFilePath;
                                existingAttachData.SequenceId = attach.SequenceId;
                                existingAttachData.IsDeleted = false;
                                existingAttachData.ModifiedBy = attach.ModifiedBy;
                                existingAttachData.ModifiedDate = DateTime.Now;
                            }
                            else
                            {

                                var attachment = new AdjustmentReportPhoto()
                                {
                                    AdjustmentReportId = existingReport.AdjustMentReportId,
                                    DocumentName = attach.DocumentName,
                                    DocumentFilePath = updatedUrl,
                                    SequenceId = attach.SequenceId,
                                    IsOldPhoto = attach.IsOldPhoto,
                                    IsDeleted = false,
                                    CreatedBy = attach.CreatedBy,
                                    CreatedDate = DateTime.Now,
                                };
                                _context.Photos.Add(attachment);
                            }
                            await _context.SaveChangesAsync();
                        }
                    }

                    await _context.SaveChangesAsync();

                    if (request.IsSubmit == true && request.IsAmendReSubmitTask == false)
                    {
                        var data = await SubmitRequest(existingReport.AdjustMentReportId, existingReport.CreatedBy);
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

                    res.ReturnValue = new
                    {
                        AdjustmentReportId = existingReport.AdjustMentReportId,
                        AdjustmentReportNo = existingReport.ReportNo
                    };
                    res.StatusCode = Status.Success;
                    res.Message = Enums.AdjustMentSave;
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


        public async Task<AjaxResult> SubmitRequest(int adjustmentReportId, int? createdBy)
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

                _context.CallAdjustmentReportApproverMaterix(createdBy, adjustmentReportId);

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
                var adjustmentApproverTask = _context.AdjustmentReportApproverTaskMasters.Where(x => x.AdjustmentReportId == adjustmentReportId && x.IsActive == true).ToList();
                // equipmentApproverTask.Status = ApprovalTaskStatus.InReview.ToString();
                // await _context.SaveChangesAsync();

                var adjustment = _context.AdjustmentReports.Where(x => x.AdjustMentReportId == adjustmentReportId && x.IsDeleted == false).FirstOrDefault();

                adjustmentApproverTask.ForEach(x => x.IsActive = false);

                _context.CallAdjustmentReportApproverMaterix(createdBy, adjustmentReportId);

                adjustment.Status = ApprovalTaskStatus.InReview.ToString();
                adjustment.IsSubmit = true;
                await _context.SaveChangesAsync();

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
                res.StatusCode = Status.Error;
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
                    res.StatusCode = Status.Success;
                    res.Message = "Record deleted successfully.";
                }
                else
                {
                    res.StatusCode = Status.Error;
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
                res.StatusCode = Status.Error;
                res.Message = "Record Not Found";
            }
            else
            {
                photos.IsDeleted = true;
                photos.ModifiedDate = DateTime.Now;
                int rowsAffected = await _context.SaveChangesAsync();

                if (rowsAffected > 0)
                {
                    res.StatusCode = Status.Success;
                    res.Message = "Record deleted successfully.";
                }
                else
                {
                    res.StatusCode = Status.Error;
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
                res.StatusCode = Status.Error;
                return res;
            }
            else
            {
                res.Message = "Employee Details Fetched Successfully";
                res.StatusCode = Status.Success;
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

                    if (asktoAmend.AdvisorId != null && asktoAmend.AdvisorId > 0)
                    {
                        var advisorData = new AdjustmentAdvisorMaster();
                        advisorData.AdvisorId = asktoAmend.AdvisorId ?? 0;
                        advisorData.EmployeeId = asktoAmend.CurrentUserId;
                        advisorData.IsActive = true;
                        advisorData.AdjustmentReportId = asktoAmend.AdjustmentId;
                        _context.AdjustmentAdvisorMasters.Add(advisorData);
                        await _context.SaveChangesAsync();

                        var approverTask = _context.AdjustmentReportApproverTaskMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.AssignedToUserId == 0 && x.Role == "Advisor" && x.IsActive == true && x.SequenceNo == 3).FirstOrDefault();
                        approverTask.AssignedToUserId = asktoAmend.AdvisorId;
                        await _context.SaveChangesAsync();
                    }

                    if (asktoAmend.AdditionalDepartmentHeads != null && asktoAmend.AdditionalDepartmentHeads.Count > 0)
                    {
                        foreach (var data in asktoAmend.AdditionalDepartmentHeads)
                        {
                            var additionalDepartmentHead = new AdjustmentAdditionalDepartmentHeadMaster();
                            additionalDepartmentHead.ApprovalSequence = data.ApprovalSequence;
                            additionalDepartmentHead.DepartmentHeadId = data.DepartmentHead;
                            additionalDepartmentHead.EmployeeId = asktoAmend.CurrentUserId;
                            additionalDepartmentHead.IsActive = true;
                            additionalDepartmentHead.AdjustmentReportId = asktoAmend.AdjustmentId;
                            _context.AdjustmentAdditionalDepartmentHeadMasters.Add(additionalDepartmentHead);
                            await _context.SaveChangesAsync();
                        }

                        var otherdepartmenthead1 = _context.AdjustmentReportApproverTaskMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.AssignedToUserId == 0 && x.Role == "Other Department Head 1" && x.IsActive == true && x.SequenceNo == 5).FirstOrDefault();
                        if (otherdepartmenthead1 != null)
                        {
                            otherdepartmenthead1.AssignedToUserId = asktoAmend.AdditionalDepartmentHeads.Where(x => x.ApprovalSequence == 1).Select(x => x.DepartmentHead).FirstOrDefault();
                            await _context.SaveChangesAsync();
                        }

                        var otherdepartmenthead2 = _context.AdjustmentReportApproverTaskMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.AssignedToUserId == 0 && x.Role == "Other Department Head 2" && x.IsActive == true && x.SequenceNo == 6).FirstOrDefault();
                        if (otherdepartmenthead2 != null)
                        {
                            otherdepartmenthead2.AssignedToUserId = asktoAmend.AdditionalDepartmentHeads.Where(x => x.ApprovalSequence == 2).Select(x => x.DepartmentHead).FirstOrDefault();
                            await _context.SaveChangesAsync();
                        }

                        var otherdepartmenthead3 = _context.AdjustmentReportApproverTaskMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.AssignedToUserId == 0 && x.Role == "Other Department Head 3" && x.IsActive == true && x.SequenceNo == 7).FirstOrDefault();
                        if (otherdepartmenthead3 != null)
                        {
                            otherdepartmenthead3.AssignedToUserId = asktoAmend.AdditionalDepartmentHeads.Where(x => x.ApprovalSequence == 3).Select(x => x.DepartmentHead).FirstOrDefault();
                            await _context.SaveChangesAsync();
                        }

                        var currentApproverTask = _context.AdjustmentReportApproverTaskMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.IsActive == true
                                                     && x.ApproverTaskId == asktoAmend.ApproverTaskId && x.Status == ApprovalTaskStatus.Approved.ToString()).FirstOrDefault();
                        if (currentApproverTask != null)
                        {
                            var nextApproveTask = _context.AdjustmentReportApproverTaskMasters.Where(x => x.AdjustmentReportId == requestTaskData.AdjustmentReportId && x.IsActive == true
                                     && x.Status == ApprovalTaskStatus.Pending.ToString() && x.SequenceNo == (requestTaskData.SequenceNo) + 1).ToList();

                            if (nextApproveTask.Any())
                            {
                                foreach (var nextTask in nextApproveTask)
                                {
                                    nextTask.Status = ApprovalTaskStatus.InReview.ToString();
                                    nextTask.ModifiedDate = DateTime.Now;
                                    await _context.SaveChangesAsync();
                                }
                            }
                        }
                    }
                    if (asktoAmend.Type == ApprovalStatus.AskToAmend)
                    {
                        requestTaskData.Status = ApprovalTaskStatus.UnderAmendment.ToString();
                        requestTaskData.ModifiedBy = asktoAmend.CurrentUserId;
                        requestTaskData.ActionTakenBy = asktoAmend.CurrentUserId;
                        requestTaskData.ActionTakenDate = DateTime.Now;
                        requestTaskData.ModifiedDate = DateTime.Now;
                        requestTaskData.Comments = asktoAmend.Comment;

                        _context.SaveChanges();
                        res.Message = Enums.AdjustMentAsktoAmend;

                        var adjustmentReport = _context.AdjustmentReports.Where(x => x.AdjustMentReportId == asktoAmend.AdjustmentId && x.IsDeleted == false).FirstOrDefault();
                        adjustmentReport.Status = ApprovalTaskStatus.UnderAmendment.ToString();
                        //equipment.WorkFlowStatus = ApprovalTaskStatus.UnderAmendment.ToString();
                        await _context.SaveChangesAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
            }
            return res;
        }

        public async Task<AjaxResult> PullBackRequest(int Id, int userId, string comment)
        {
            var res = new AjaxResult();
            try
            {
                var materialConsumption = _context.AdjustmentReports.Where(x => x.AdjustMentReportId == Id && x.IsDeleted == false).FirstOrDefault();
                if (materialConsumption != null)
                {
                    materialConsumption.IsSubmit = false;
                    materialConsumption.Status = ApprovalTaskStatus.Draft.ToString();
                    materialConsumption.ModifiedBy = userId;

                    await _context.SaveChangesAsync();

                    var approverTaskDetails = _context.AdjustmentReportApproverTaskMasters.Where(x => x.AdjustmentReportId == Id).ToList();
                    approverTaskDetails.ForEach(a =>
                    {
                        a.IsActive = false;
                        a.ModifiedBy = userId;
                        a.ModifiedDate = DateTime.Now;
                    });
                    await _context.SaveChangesAsync();

                    res.StatusCode = Status.Success;
                }
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                return res;
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
                        res.StatusCode = Status.Success;
                        res.Message = "File downloaded successfully";
                        res.ReturnValue = base64String;
                        return res;
                    }
                }

            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
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

                sb.Replace("#area#", data.FirstOrDefault()?.AreaName);
                sb.Replace("#reportno#", data.FirstOrDefault()?.ReportNo);
                sb.Replace("#requestor#", data.FirstOrDefault()?.Requestor);
                sb.Replace("#machinename#", data.FirstOrDefault()?.MachineName);
                sb.Replace("#checkedby#", data.FirstOrDefault()?.CheckedBy);
                sb.Replace("#machineid#", data.FirstOrDefault()?.MachineId.ToString());
                sb.Replace("#when#", data.FirstOrDefault()?.WhenDate);
                sb.Replace("#describeproblem#", data.FirstOrDefault()?.DescribeProblem);
                sb.Replace("#observation#", data.FirstOrDefault()?.Observation);
                sb.Replace("#rootcause#", data.FirstOrDefault()?.RootCause);
                sb.Replace("#adjustmentdesciption#", data.FirstOrDefault()?.AdjustmentDescription);
                sb.Replace("#conditionafteradjustment#", data.FirstOrDefault()?.ConditionAfterAdjustment);
                //sb.Replace("#Remarks#", data.FirstOrDefault()?.Remarks);

                StringBuilder tableBuilder = new StringBuilder();
                //foreach (var item in data)
                //{
                //    tableBuilder.Append("<tr style=\"padding:10px; height: 20px;\">");

                //    // Add the serial number to the first column
                //    tableBuilder.Append("<td style=\"width:5%; border:0.25px; height: 20px; padding: 5px\">" + serialNumber++ + "</td>");

                //    // Add the rest of the data to the respective columns
                //    tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.Title + "</td>");
                //    //tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.MaterialDescription + "</td>");
                //    //tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.MaterialNo + "</td>");
                //    tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.Quantity + "</td>");
                //    //tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.UOM + "</td>");
                //    //tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.CostCenter + "</td>");
                //    //tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.GLCode + "</td>");
                //    tableBuilder.Append("<td style=\"width:20%; border:0.25px; height: 20px; padding: 5px\">" + item.Purpose + "</td>");

                //    tableBuilder.Append("</tr>");
                //}
                //sb.Replace("#ItemTable#", tableBuilder.ToString());

                //string reqName = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == materialdata.CreatedBy && x.IsActive == true).Select(x => x.EmployeeName).FirstOrDefault();
                string approvedBySectionHead = approverData.FirstOrDefault(a => a.SequenceNo == 2)?.employeeNameWithoutCode ?? "N/A";
                string approvedByDepartmentHead = approverData.FirstOrDefault(a => a.SequenceNo == 4)?.employeeNameWithoutCode ?? "N/A";
                string approvedByDivisionHead = approverData.FirstOrDefault(a => a.SequenceNo == 9)?.employeeNameWithoutCode ?? "N/A";

                sb.Replace("#sectionhead#", approvedBySectionHead);
                sb.Replace("#departmenthead#", approvedByDepartmentHead);
                sb.Replace("#divisionhead#", approvedByDivisionHead);
                sb.Replace("#remarks#", "Remarks");

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
                    res.StatusCode = Status.Success;
                    res.Message = Enums.AdjustMentPdf;
                    res.ReturnValue = base64String; // Send the Base64 string to the frontend

                    return res;
                }
            }

            catch (Exception ex)
            {
                res.Message = "Fail " + ex.Message;
                res.StatusCode = Status.Error;

                // Log the exception using your logging mechanism
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "ExportToPdf");

                return res;
            }
        }

        public async Task<IEnumerable<AdjustmentReportPdfView>> GetAdjustmentData(int adjustmentId)
        {
            return await _sprocRepository.GetStoredProcedure("[dbo].[AdjustmentReportExcel]")
                .WithSqlParams(
                    ("@AdjustmentReportId", adjustmentId)
                ).ExecuteStoredProcedureAsync<AdjustmentReportPdfView>();

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
                    res.StatusCode = Status.Error;
                }
                else
                {
                    res.Message = "Details Fetched Successfully";
                    res.StatusCode = Status.Success;
                    res.ReturnValue = sectionHeadId;
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions
                res.Message = $"An error occurred: {ex.Message}";
                res.StatusCode = Status.Error;
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
                    res.StatusCode = Status.Error;
                }
                else
                {
                    res.Message = "Details Fetched Successfully";
                    res.StatusCode = Status.Success;
                    res.ReturnValue = departmentHeadId;
                }
            }
            catch (Exception ex)
            {
                // Handle exceptions
                res.Message = $"An error occurred: {ex.Message}";
                res.StatusCode = Status.Error;
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
                res.StatusCode = Status.Error;
                return res;
            }
            else
            {
                res.Message = "Employee Details Fetched Successfully";
                res.StatusCode = Status.Success;
                res.ReturnValue = result;
            }
            return res;
        }

        #endregion
    }
}
