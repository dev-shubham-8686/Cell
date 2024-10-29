using DocumentFormat.OpenXml.Bibliography;
using Microsoft.EntityFrameworkCore;
using PnP.Framework.Extensions;
using TDSGCellFormat.Common;
using TDSGCellFormat.Extensions;
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

        public AdjustMentReportRepository(TdsgCellFormatDivisionContext context)
            : base(context)
        {
            _sprocRepository = new SprocRepository(context);
            this._context = context;
        }

        public async Task<AjaxResult> GetAllAdjustmentData(
         int pageIndex, int pageSize, int createdBy = 0, string sortColumn = "", string orderBy = "", string searchValue = "")
        {
            var result = new AjaxResult();

            result.ReturnValue = await _sprocRepository.GetStoredProcedure("[dbo].[SPP_GetAllAdjustMentReportData]")
                 .WithSqlParams(
                        ("@CreatedBy", createdBy),
                        ("@PageIndex", pageIndex),
                        ("@PageSize", pageSize),
                        ("@SortColumn", sortColumn),
                        ("@Order", orderBy),
                        ("@Where", searchValue)
                ).ExecuteStoredProcedureAsync<AdjustmentReportView>();

            return result;
        }

        public IQueryable<AdjustMentReportRequest> GetAll()
        {
            IQueryable<AdjustMentReportRequest> res = _context.AdjustmentReports
                .Join(_context.Photos, ar => ar.AdjustMentReportId, arp => arp.AdjustmentReportId, (ar, arp) => new { ar, arp })
                .Where(n => n.ar.IsDeleted == false)
                .Select(n => new AdjustMentReportRequest
                {
                    AdjustMentReportId = n.ar.AdjustMentReportId,
                    Area = n.ar.Area,
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
                    ConditionAfterAdjustment = n.ar.ConditionAfterAdjustment,
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
                    IsDeleted = x.IsDeleted,
                    SequenceId = x.SequenceId,
                    CreatedBy = x.CreatedBy,
                    CreatedDate = x.CreatedDate,
                    ModifiedBy = x.ModifiedBy,
                    ModifiedDate = x.ModifiedDate,
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
                    IsDeleted = x.IsDeleted,
                    SequenceId = x.SequenceId,
                    CreatedBy = x.CreatedBy,
                    CreatedDate = x.CreatedDate,
                    ModifiedBy = x.ModifiedBy,
                    ModifiedDate = x.ModifiedDate,
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
                Area = res.Area,
                MachineName = res.MachineName,
                SubMachineName = !string.IsNullOrEmpty(res.SubMachineName) ? res.SubMachineName.Split(',').Select(s => int.Parse(s.Trim())).ToList() : new List<int>(),
                RequestBy = res.RequestBy,
                CheckedBy = res.CheckedBy,
                DescribeProblem = res.DescribeProblem,
                Observation = res.Observation,
                RootCause = res.RootCause,
                AdjustmentDescription = res.AdjustmentDescription,
                Photos = GetAdjustmentReportPhotos(Id),
                ConditionAfterAdjustment = res.ConditionAfterAdjustment,
                Status = res.Status,
                IsSubmit = res.IsSubmit,
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
                    EmployeeId = request.EmployeeId,
                    DescribeProblem = request.DescribeProblem,
                    Observation = request.Observation,
                    RootCause = request.RootCause,
                    AdjustmentDescription = request.AdjustmentDescription,
                    ConditionAfterAdjustment = request.ConditionAfterAdjustment,
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
                            DueDate = !string.IsNullOrEmpty(changeReport.DueDate) ? DateOnly.Parse(changeReport.DueDate) : (DateOnly?)null,
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
                existingReport.Area = request.Area;
                existingReport.MachineName = request.MachineName;
                existingReport.SubMachineName = request.SubMachineName != null && request.SubMachineName.Count > 0 ? string.Join(",", request.SubMachineName) : "";
                existingReport.EmployeeId = request.EmployeeId;
                existingReport.RequestBy = request.RequestBy;
                existingReport.CheckedBy = request.CheckedBy;
                existingReport.DescribeProblem = request.DescribeProblem;
                existingReport.Observation = request.Observation;
                existingReport.RootCause = request.RootCause;
                existingReport.AdjustmentDescription = request.AdjustmentDescription;
                existingReport.ConditionAfterAdjustment = request.ConditionAfterAdjustment;
                existingReport.Status = request.Status;
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
                            existingChange.DueDate = !string.IsNullOrEmpty(changeReport.DueDate) ? DateOnly.Parse(changeReport.DueDate) : (DateOnly?)null;
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
                                DueDate = !string.IsNullOrEmpty(changeReport.DueDate) ? DateOnly.Parse(changeReport.DueDate) : (DateOnly?)null,
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

                if (request.Photos != null)
                {
                    if (request.Photos.BeforeImages != null && request.Photos.AfterImages != null)
                    {
                        var totalRecordsToInsert = request.Photos.BeforeImages.Concat(request.Photos.AfterImages).ToList();
                        totalRecordsToInsert.ForEach(x => x.AdjustmentReportId = request.AdjustMentReportId);

                        _context.Photos.AddRange(totalRecordsToInsert);
                    }
                }

                await _context.SaveChangesAsync();
                res.ReturnValue = new
                {
                    AdjustmentReportId = existingReport.AdjustMentReportId,
                    AdjustmentReportNo = existingReport.ReportNo
                };
                res.StatusCode = Status.Success;
                res.Message = Enums.AdjustMentSave;
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
    }
}
