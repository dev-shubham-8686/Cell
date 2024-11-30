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
<<<<<<< Updated upstream
=======

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
                        var data = await SubmitRequest(adjustMentReportId, request.CreatedBy);
                        if (data.StatusCode == Enums.Status.Success)
                        {
                            res.Message = Enums.AdjustMentSubmit;
                        }

                    }

                    else if (request.IsSubmit == true && request.IsAmendReSubmitTask == true)
                    {
                        var data = await Resubmit(adjustMentReportId, request.CreatedBy);
                        if (data.StatusCode == Enums.Status.Success)
                        {
                            res.Message = Enums.AdjustMentSubmit;
                        }
                    }
                    else
                    {
                        InsertHistoryData(adjustMentReportId, FormType.AjustmentReport.ToString(), "Requestor", "Update Status as Draft", ApprovalTaskStatus.Draft.ToString(), Convert.ToInt32(request.CreatedBy), HistoryAction.Save.ToString(), 0);
                    }

                    res.ReturnValue = new
                    {
                        AdjustmentReportId = adjustMentReportId,
                        AdjustmentReportNo = adjustmentReportNo
                    };
                    res.StatusCode = Enums.Status.Success;
                    res.Message = Enums.AdjustMentSave;
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======

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


                    if (asktoAmend.AdvisorId != null && asktoAmend.AdvisorId > 0)
                    {
                        var advisorData = new AdjustmentAdvisorMaster();
                        advisorData.EmployeeId = asktoAmend.AdvisorId;
                        advisorData.IsActive = true;
                        advisorData.AdjustmentReportId = asktoAmend.AdjustmentId;
                        _context.AdjustmentAdvisorMasters.Add(advisorData);
                        await _context.SaveChangesAsync();

                    }

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

                        var otherdepartmenthead1 = _context.AdjustmentReportApproverTaskMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.AssignedToUserId == 0 && x.Role == "Other Department Head 1" && x.IsActive == false && x.SequenceNo == 4).FirstOrDefault();
                        var departmentHead1 = _context.AdjustmentAdditionalDepartmentHeadMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.ApprovalSequence == 1 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault();
                        var departmentId1 = _context.AdjustmentAdditionalDepartmentHeadMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.ApprovalSequence == 1 && x.IsActive == true).Select(x => x.DepartmentId).FirstOrDefault();
                        var departmentName1 = _cloneContext.DepartmentMasters.Where(x => x.DepartmentID == departmentId1).Select(x => x.Name).FirstOrDefault();
                            
                        if (otherdepartmenthead1 != null && departmentHead1 > 0)
                        {
                            otherdepartmenthead1.AssignedToUserId = departmentHead1;
                            otherdepartmenthead1.IsActive = true;
                            otherdepartmenthead1.DisplayName = departmentName1;
                            await _context.SaveChangesAsync();
                        }

                        var otherdepartmenthead2 = _context.AdjustmentReportApproverTaskMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.AssignedToUserId == 0 && x.Role == "Other Department Head 2" && x.IsActive == false && x.SequenceNo == 5).FirstOrDefault();
                        var departmentHead2 = _context.AdjustmentAdditionalDepartmentHeadMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.ApprovalSequence == 2 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault();
                        var departmentId2 = _context.AdjustmentAdditionalDepartmentHeadMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.ApprovalSequence == 2 && x.IsActive == true).Select(x => x.DepartmentId).FirstOrDefault();
                        var departmentName2 = _cloneContext.DepartmentMasters.Where(x => x.DepartmentID == departmentId2).Select(x => x.Name).FirstOrDefault();
                        if (otherdepartmenthead2 != null && departmentHead2 > 0)
                        {
                            otherdepartmenthead2.AssignedToUserId = departmentHead2;
                            otherdepartmenthead2.IsActive = true;
                            otherdepartmenthead2.DisplayName = departmentName2;
                            await _context.SaveChangesAsync();
                        }

                        var otherdepartmenthead3 = _context.AdjustmentReportApproverTaskMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.AssignedToUserId == 0 && x.Role == "Other Department Head 3" && x.IsActive == false && x.SequenceNo == 6).FirstOrDefault();
                        var departmentHead3 = _context.AdjustmentAdditionalDepartmentHeadMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.ApprovalSequence == 3 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault();
                        var departmentId3 = _context.AdjustmentAdditionalDepartmentHeadMasters.Where(x => x.AdjustmentReportId == asktoAmend.AdjustmentId && x.ApprovalSequence == 3 && x.IsActive == true).Select(x => x.DepartmentId).FirstOrDefault();
                        var departmentName3 = _cloneContext.DepartmentMasters.Where(x => x.DepartmentID == departmentId3).Select(x => x.Name).FirstOrDefault();
                        if (otherdepartmenthead3 != null && departmentHead3 > 0)
                        {
                            otherdepartmenthead3.AssignedToUserId = departmentHead3;
                            otherdepartmenthead3.IsActive = true;
                            otherdepartmenthead3.DisplayName = departmentName3;
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

        public async Task<AjaxResult> AdvisorCommets(AdvisorComment advisor)
        {
            var res = new AjaxResult();
            try
            {
                var advisorData = _context.AdjustmentAdvisorMasters.Where(x => x.AdjustmentAdvisorId == advisor.AdjustmentAdvisorId
                                  && x.AdjustmentReportId == advisor.AdjustmentReportId && x.IsActive == true).FirstOrDefault();
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Adjustment AdvisorCommets");
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

                    InsertHistoryData(data.AdjustmentReportId, FormType.AjustmentReport.ToString(), "Requestor",data.comment, ApprovalTaskStatus.Draft.ToString(), Convert.ToInt32(data.userId), HistoryAction.PullBack.ToString(), 0);

                    res.StatusCode = Enums.Status.Success;
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

                //sb.Replace("#area#", data.FirstOrDefault()?.AreaName);
                sb.Replace("#reportno#", adjustMentReportData.ReportNo);
               // sb.Replace("#requestor#", data.FirstOrDefault()?.Requestor);
                //sb.Replace("#machinename#", data.FirstOrDefault()?.MachineName);
                //sb.Replace("#checkedby#", data.FirstOrDefault()?.CheckedBy);
               // sb.Replace("#machineid#", data.FirstOrDefault()?.MachineId.ToString());
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
>>>>>>> Stashed changes
    }
}
