using DocumentFormat.OpenXml.Bibliography;
using TDSGCellFormat.Entities;
using TDSGCellFormat.Interface.Repository;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using static TDSGCellFormat.Common.Enums;

namespace TDSGCellFormat.Implementation.Repository
{
    public class AdjustMentReportRepository : BaseRepository<AdjustmentReport>, IAdjustMentReportRepository
    {
        private readonly TdsgCellFormatDivisionContext _context;

        public AdjustMentReportRepository(TdsgCellFormatDivisionContext context)
            : base(context)
        {
            this._context = context;
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
                    WorkFlowStatus = n.ar.WorkFlowStatus,
                    IsSubmit = n.ar.IsSubmit,
                    CreatedDate = n.ar.CreatedDate,
                    CreatedBy = n.ar.CreatedBy,
                    ModifiedDate = n.ar.ModifiedDate,
                    ModifiedBy = n.ar.ModifiedBy,
                    IsDeleted = n.ar.IsDeleted,
                });

            return res;
        }

        public List<Photos>? GetAdjustmentReportPhotos(int adjustmentReportId)
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
                    CreatedBy = x.CreatedBy,
                    CreatedDate = x.CreatedDate,
                    ModifiedBy = x.ModifiedBy,
                    ModifiedDate = x.ModifiedDate,
                })
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
                    CreatedBy = x.CreatedBy,
                    CreatedDate = x.CreatedDate,
                    ModifiedBy = x.ModifiedBy,
                    ModifiedDate = x.ModifiedDate,
                })
                .ToList();

            return null;//new Photos(){ BeforeImages = beforeImages,AfterImages = afterImages};
        }

        public AdjustMentReportRequest GetById(int Id)
        {
            AdjustMentReportRequest? res = _context.AdjustmentReports
                                  .Where(n => n.IsDeleted == false && n.AdjustMentReportId == Id)
                                  .Select(n => new AdjustMentReportRequest
                                  {
                                      AdjustMentReportId = n.AdjustMentReportId,
                                      Area = n.Area,
                                      MachineName = n.MachineName,
                                      SubMachineName = !string.IsNullOrEmpty(n.SubMachineName) ? n.SubMachineName.Split(",", StringSplitOptions.RemoveEmptyEntries).Select(t => Int32.Parse(t)).ToList<int>() : new List<int>(),
                                      ReportNo = n.ReportNo,
                                      RequestBy = n.RequestBy,
                                      CheckedBy = n.CheckedBy,
                                      DescribeProblem = n.DescribeProblem,
                                      Observation = n.Observation,
                                      RootCause = n.RootCause,
                                      AdjustmentDescription = n.AdjustmentDescription,
                                      //Photos = n.Photos,
                                      ConditionAfterAdjustment = n.ConditionAfterAdjustment,
                                      Status = n.Status,
                                      WorkFlowStatus = n.WorkFlowStatus,
                                      IsSubmit = n.IsSubmit,
                                      CreatedDate = n.CreatedDate,
                                      CreatedBy = n.CreatedBy,
                                      ModifiedDate = n.ModifiedDate,
                                      ModifiedBy = n.ModifiedBy,
                                      IsDeleted = n.IsDeleted,
                                  }).FirstOrDefault();
            return res;
        }

        public async Task<AjaxResult> AddOrUpdateReport(AdjustMentReportRequest request)
        {
            var res = new AjaxResult();
            var existingReport = await _context.AdjustmentReports.FindAsync(request.AdjustMentReportId);
            if (existingReport == null)
            {
                var newReport = new AdjustmentReport()
                {
                    Area = request.Area,
                    MachineName = request.MachineName,
                    SubMachineName = request.SubMachineName != null && request.SubMachineName.Count > 0 ? string.Join(",", request.SubMachineName) : "",
                    ReportNo = request.ReportNo,
                    RequestBy = request.RequestBy,
                    CheckedBy = request.CheckedBy,
                    DescribeProblem = request.DescribeProblem,
                    Observation = request.Observation,
                    RootCause = request.RootCause,
                    AdjustmentDescription = request.AdjustmentDescription,
                    ConditionAfterAdjustment = request.ConditionAfterAdjustment,
                    Status = request.Status,
                    WorkFlowStatus = request.WorkFlowStatus,
                    IsSubmit = request.IsSubmit,
                    CreatedDate = DateTime.Now,
                    CreatedBy = request.CreatedBy,
                    IsDeleted = false,
                };

                await _context.AdjustmentReports.AddAsync(newReport);

                // Get ID of newly added record
                request.AdjustMentReportId = newReport.AdjustMentReportId;

                if (request.ChangeRiskManagement != null)
                {
                    await _context.ChangeRiskManagements.AddRangeAsync(request.ChangeRiskManagement);
                }

                if (request.Photos != null)
                {
                    foreach (var record in request.Photos)
                    {
                        if (record.BeforeImages != null && record.AfterImages != null)
                        {
                            var totalRecordsToInsert = record.BeforeImages.Concat(record.AfterImages).ToList();
                            totalRecordsToInsert.ForEach(x => x.AdjustmentReportId = request.AdjustMentReportId);

                            _context.Photos.AddRange(totalRecordsToInsert);
                        }
                    }
                }

                await _context.SaveChangesAsync();
                res.Message = "Record Created Successfully";
            }
            else
            {
                existingReport.Area = request.Area;
                existingReport.MachineName = request.MachineName;
                existingReport.SubMachineName = request.SubMachineName != null && request.SubMachineName.Count > 0 ? string.Join(",", request.SubMachineName) : "";
                existingReport.ReportNo = request.ReportNo;
                existingReport.RequestBy = request.RequestBy;
                existingReport.CheckedBy = request.CheckedBy;
                existingReport.DescribeProblem = request.DescribeProblem;
                existingReport.Observation = request.Observation;
                existingReport.RootCause = request.RootCause;
                existingReport.AdjustmentDescription = request.AdjustmentDescription;
                existingReport.ConditionAfterAdjustment = request.ConditionAfterAdjustment;
                existingReport.Status = request.Status;
                existingReport.WorkFlowStatus = request.WorkFlowStatus;
                existingReport.IsSubmit = request.IsSubmit;
                existingReport.ModifiedDate = DateTime.Now;
                existingReport.ModifiedBy = request.ModifiedBy;

                var changeRiskManagements = _context.ChangeRiskManagements.Where(x => x.AdjustMentReportId == request.AdjustMentReportId).ToList();
                if (changeRiskManagements == null)
                {
                    if (request.ChangeRiskManagement != null)
                    {
                        await _context.ChangeRiskManagements.AddRangeAsync(request.ChangeRiskManagement);
                    }
                }
                else
                {
                    if (request.ChangeRiskManagement != null)
                    {
                        var changeRiskManagementToUpdate = changeRiskManagements
                          .Where(u => request.ChangeRiskManagement.Select(l2 => l2.ChangeRiskManagementId)
                                            .Contains(u.ChangeRiskManagementId)).ToList();

                        int newRecords = request.ChangeRiskManagement.Count(x => x.ChangeRiskManagementId == 0);
                        int totalRecords = changeRiskManagements.Count;
                        int deleted = totalRecords - changeRiskManagementToUpdate.Count;

                        if (deleted > 0)
                        {
                            var deletedRecords = changeRiskManagements.Except(changeRiskManagementToUpdate).Where(u => request.ChangeRiskManagement.Select(l2 => l2.ChangeRiskManagementId)
                                            .Contains(u.ChangeRiskManagementId));

                            foreach (var record in deletedRecords)
                            {
                                var entity = await _context.ChangeRiskManagements.FindAsync(record.ChangeRiskManagementId);
                                if (entity != null)
                                {
                                    entity.IsDeleted = true;
                                    _context.ChangeRiskManagements.Update(entity);
                                }
                            }
                        }

                        if (changeRiskManagementToUpdate.Count != 0)
                        {
                            foreach (var entity in changeRiskManagements)
                            {
                                var record = changeRiskManagementToUpdate.First(r => r.ChangeRiskManagementId == entity.ChangeRiskManagementId);
                                if (record != null)
                                {
                                    entity.Changes = record.Changes;
                                    entity.FunctionId = record.FunctionId;
                                    entity.RisksWithChanges = record.RisksWithChanges;
                                    entity.Factors = record.Factors;
                                    entity.CounterMeasures = record.CounterMeasures;
                                    entity.DueDate = record.DueDate;
                                    entity.PersonInCharge = record.PersonInCharge;
                                    entity.Results = record.Results;
                                    entity.Status = record.Status;
                                    entity.CreatedBy = record.CreatedBy;
                                    entity.CreatedDate = record.CreatedDate;
                                    entity.ModifiedBy = record.ModifiedBy;
                                    entity.ModifiedDate = record.ModifiedDate;
                                    entity.IsDeleted = record.IsDeleted;
                                }
                            }
                        }

                        if (newRecords > 0)
                        {
                            await _context.ChangeRiskManagements.AddRangeAsync(request.ChangeRiskManagement.Where(x => x.ChangeRiskManagementId == 0));
                        }
                    }
                }

                await _context.SaveChangesAsync();
                res.Message = "Record Updated Successfully";
            }
            res.ReturnValue = request;
            return res;
        }

        //public async Task UpdateChangeRiskManagementAsync(List<ChangeRiskManagement>? recordsToUpdate)
        //{
        //    var idsToUpdate = recordsToUpdate.Select(r => r.ChangeRiskManagementId).ToList();

        //    // Get the entities to update in a single query
        //    var entitiesToUpdate = _context.ChangeRiskManagements
        //        .Where(e => idsToUpdate.Contains(e.ChangeRiskManagementId))
        //        .ToList();

        //    foreach (var entity in entitiesToUpdate)
        //    {
        //        var record = recordsToUpdate.First(r => r.ChangeRiskManagementId == entity.ChangeRiskManagementId);
        //        entity.Changes = record.Changes;
        //        entity.FunctionId = record.FunctionId;
        //        entity.RisksWithChanges = record.RisksWithChanges;
        //        entity.Factors = record.Factors;
        //        entity.CounterMeasures = record.CounterMeasures;
        //        entity.DueDate = record.DueDate;
        //        entity.PersonInCharge = record.PersonInCharge;
        //        entity.Results = record.Results;
        //        entity.Status = record.Status;
        //        entity.CreatedBy = record.CreatedBy;
        //        entity.CreatedDate = record.CreatedDate;
        //        entity.ModifiedBy = record.ModifiedBy;
        //        entity.ModifiedDate = record.ModifiedDate;
        //        entity.IsDeleted = record.IsDeleted;
        //    }

        //    await _context.SaveChangesAsync();
        //}


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
