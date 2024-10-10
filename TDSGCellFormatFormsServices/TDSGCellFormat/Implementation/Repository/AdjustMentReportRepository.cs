using DocumentFormat.OpenXml.Bibliography;
using Microsoft.EntityFrameworkCore;
using TDSGCellFormat.Common;
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
            var res = _context.AdjustmentReports.Where(x => x.AdjustMentReportId == Id && x.IsDeleted == false).FirstOrDefault();

            if(res == null)
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
                    DueDate = section.DueDate.HasValue ? section.DueDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                    PersonInCharge = section.PersonInCharge,
                    Results = section.Results

                }).ToList();

            }

            return adjustmentData;
        }

        public async Task<AjaxResult> AddOrUpdateReport(AdjustMentReportRequest request)
        {
            var res = new AjaxResult();
            int AdjustMentReportId = 0;
            var existingReport = await _context.AdjustmentReports.FindAsync(request.AdjustMentReportId);
            if (existingReport == null)
            {
                var newReport = new AdjustmentReport()
                {
                    Area = request.Area,
                    MachineName = request.MachineName,
                    SubMachineName = request.SubMachineName != null && request.SubMachineName.Count > 0 ? string.Join(",", request.SubMachineName) : "",
                    //ReportNo = request.ReportNo,
                    RequestBy = request.RequestBy,
                    CheckedBy = request.CheckedBy,
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
                AdjustMentReportId = newReport.AdjustMentReportId;

                var applicationEqipMentParams = new Microsoft.Data.SqlClient.SqlParameter("@AdjustmentReportId", AdjustMentReportId);
                await _context.Set<TroubleReportNumberResult>()
                               .FromSqlRaw("EXEC [dbo].[SPP_GenerateAdjustmentReportNumber] @AdjustmentReportId", applicationEqipMentParams)
                               .ToListAsync();

                var adjustmentReportNo = _context.AdjustmentReports.Where(x => x.AdjustMentReportId == AdjustMentReportId && x.IsDeleted == false).Select(x => x.ReportNo).FirstOrDefault();

                if (request.ChangeRiskManagement_AdjustmentReport != null)
                {
                    foreach(var changeReport in request.ChangeRiskManagement_AdjustmentReport)
                    {
                        var changeRiskData = new ChangeRiskManagement_AdjustmentReport()
                        {
                            AdjustMentReportId = AdjustMentReportId,
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

                //if (request.Photos != null)
                //{
                //    foreach (var record in request.Photos)
                //    {
                //        if (record.BeforeImages != null && record.AfterImages != null)
                //        {
                //            var totalRecordsToInsert = record.BeforeImages.Concat(record.AfterImages).ToList();
                //            totalRecordsToInsert.ForEach(x => x.AdjustmentReportId = request.AdjustMentReportId);

                //            _context.Photos.AddRange(totalRecordsToInsert);
                //        }
                //    }
                //}

                await _context.SaveChangesAsync();
                res.ReturnValue = new
                {
                    AdjustmentReportId = AdjustMentReportId,
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
               // existingReport.ReportNo = request.ReportNo;
                existingReport.RequestBy = request.RequestBy;
                existingReport.CheckedBy = request.CheckedBy;
                existingReport.DescribeProblem = request.DescribeProblem;
                existingReport.Observation = request.Observation;
                existingReport.RootCause = request.RootCause;
                existingReport.AdjustmentDescription = request.AdjustmentDescription;
                existingReport.ConditionAfterAdjustment = request.ConditionAfterAdjustment;
                existingReport.Status = request.Status;
                //existingReport.WorkFlowStatus = request.WorkFlowStatus;
                existingReport.IsSubmit = request.IsSubmit;
                existingReport.ModifiedDate = DateTime.Now;
                existingReport.ModifiedBy = request.ModifiedBy;
                await _context.SaveChangesAsync();

                var existingChangeRisk = _context.ChangeRiskManagement_AdjustmentReport.Where(x => x.AdjustMentReportId == existingReport.AdjustMentReportId).ToList();
                MarkAsDeleted(existingChangeRisk, existingReport.CreatedBy, DateTime.Now);
                _context.SaveChanges();

                if (request.ChangeRiskManagement_AdjustmentReport != null)
                {
                    foreach(var changeReport in request.ChangeRiskManagement_AdjustmentReport)
                    {
                        var existingChange = _context.ChangeRiskManagement_AdjustmentReport.Where(x => x.AdjustMentReportId == changeReport.AdjustMentReportId && x.ChangeRiskManagementId == changeReport.ChangeRiskManagementId).FirstOrDefault();
                        if(existingChange != null)
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
                //else
                //{
                //    if (request.ChangeRiskManagement_AdjustmentReport != null)
                //    {
                //        var changeRiskManagementToUpdate = changeRiskManagements
                //          .Where(u => request.ChangeRiskManagement_AdjustmentReport.Select(l2 => l2.ChangeRiskManagementId)
                //                            .Contains(u.ChangeRiskManagementId)).ToList();

                //        int newRecords = request.ChangeRiskManagement_AdjustmentReport.Count(x => x.ChangeRiskManagementId == 0);
                //        int totalRecords = changeRiskManagements.Count();
                //        int deleted = totalRecords - changeRiskManagementToUpdate.Count();

                //        if (deleted > 0)
                //        {
                //            var deletedRecords = changeRiskManagements.Except(changeRiskManagementToUpdate)
                //                .Where(u => request.ChangeRiskManagement_AdjustmentReport
                //                .Select(l2 => l2.ChangeRiskManagementId).Contains(u.ChangeRiskManagementId));

                //            foreach (var record in deletedRecords)
                //            {
                //                var entity = await _context.ChangeRiskManagement_AdjustmentReport.FindAsync(record.ChangeRiskManagementId);
                //                if (entity != null)
                //                {
                //                    entity.IsDeleted = true;
                //                    _context.ChangeRiskManagement_AdjustmentReport.Update(entity);
                //                }
                //            }
                //        }

                //        if (changeRiskManagementToUpdate.Count() != 0)
                //        {
                //            foreach (var entity in changeRiskManagementToUpdate)
                //            {
                //                var record =changeRiskManagements.First(r => r.ChangeRiskManagementId == entity.ChangeRiskManagementId);
                //                if (record != null)
                //                {
                //                    entity.Changes = record.Changes;
                //                    entity.FunctionId = record.FunctionId;
                //                    entity.RisksWithChanges = record.RisksWithChanges;
                //                    entity.Factors = record.Factors;
                //                    entity.CounterMeasures = record.CounterMeasures;
                //                    entity.DueDate = record.DueDate;
                //                    entity.PersonInCharge = record.PersonInCharge;
                //                    entity.Results = record.Results;
                //                    entity.Status = record.Status;
                //                    entity.CreatedBy = record.CreatedBy;
                //                    entity.CreatedDate = record.CreatedDate;
                //                    entity.ModifiedBy = record.ModifiedBy;
                //                    entity.ModifiedDate = record.ModifiedDate;
                //                    entity.IsDeleted = record.IsDeleted;
                //                }
                //            }
                //        }

                //        if (newRecords > 0)
                //        {
                //            //await _context.ChangeRiskManagement_AdjustmentReport.AddRangeAsync(request.ChangeRiskManagement_AdjustmentReport.Where(x => x.ChangeRiskManagementId == 0));
                //        }
                //    }

                //    if (request.Photos != null)
                //    {
                //        var oldBeforeImages = _context.Photos.Where(x => x.AdjustmentReportId == request.AdjustMentReportId && x.IsOldPhoto == true && (x.IsDeleted == false || x.IsDeleted == null));
                //        var oldAfterImages = _context.Photos.Where(x => x.AdjustmentReportId == request.AdjustMentReportId && x.IsOldPhoto == false && (x.IsDeleted == false || x.IsDeleted == null));
                //    }
                //}

                await _context.SaveChangesAsync();
                res.ReturnValue = new
                {
                    AdjustmentReportId = existingReport.AdjustMentReportId,
                    AdjustmentReportNo = existingReport.ReportNo
                };
                res.StatusCode = Status.Success;
                res.Message = Enums.AdjustMentSave;
            }
            res.ReturnValue = request;
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
