using Dapper;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Linq.Expressions;
using System.Net.NetworkInformation;
using TDSGCellFormat.Common;
using TDSGCellFormat.Interface.Repository;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Models.View;
using static TDSGCellFormat.Common.Enums;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Http.HttpResults;
using DocumentFormat.OpenXml.Drawing.Charts;
using DocumentFormat.OpenXml.Spreadsheet;
using System.Buffers;
using DocumentFormat.OpenXml.Bibliography;
using Microsoft.Extensions.Configuration.UserSecrets;
using TDSGCellFormat.Helper;
using DocumentFormat.OpenXml.InkML;
using Microsoft.IdentityModel.Tokens;

namespace TDSGCellFormat.Implementation.Repository
{
    public class TroubleReportRepository : BaseRepository<TroubleReports>, ITroubleReportRepository
    {
        private readonly TdsgCellFormatDivisionContext _context;
        private readonly AepplNewCloneStageContext _cloneContext;
        private readonly string _connectionString;



        public TroubleReportRepository(TdsgCellFormatDivisionContext context, IConfiguration configuration, AepplNewCloneStageContext cloneContext)
            : base(context)
        {
            this._context = context;
            this._cloneContext = cloneContext;
            _connectionString = configuration.GetConnectionString("DefaultConnection");

        }

        #region CRUD operation
        public List<TroubleReportAdd> GetAll()
        {
            var reports = _context.TroubleReports
                                  .Where(n => n.IsDeleted == false && n.IsActive == true)
                                  .Select(n => new
                                  {
                                      TroubleReportId = n.TroubleReportId,
                                      When = n.When,
                                      BreakDownMin = n.BreakDownMin,
                                      ReportTitle = n.ReportTitle,
                                      Process = n.Process,
                                      ProcessingLot = n.ProcessingLot,
                                      NG = n.NG,
                                      PCA = n.PCA,
                                      PHLotAndQuantity = n.PHLotAndQuantity,
                                      NGLotAndQuantity = n.NGLotAndQuantity,
                                      ProductHold = n.ProductHold,
                                      TroubleType = n.TroubleType,
                                      OtherTroubleType = n.OtherTroubleType,
                                      RootCause = n.RootCause,
                                      Restarted = n.Restarted,
                                      EmployeeId = n.EmployeeId,
                                      TroubleBriefExplanation = n.TroubleBriefExplanation,
                                      ImmediateCorrectiveAction = n.ImmediateCorrectiveAction,
                                      Closure = n.Closure,
                                      IsAdjustMentReport = n.IsAdjustMentReport,
                                      AdjustmentReport = n.AdjustmentReport,
                                      CompletionDate = n.CompletionDate,
                                      CreatedDate = n.CreatedDate,
                                      CreatedBy = n.CreatedBy,
                                      WorkSubmittedDate = n.WorkSubmittedDate,
                                      IsSubmit = n.IsSubmit,
                                      IsDeleted = n.IsDeleted
                                  })
                                  .AsEnumerable() // Switch to client-side processing
                                  .Select(n => new TroubleReportAdd
                                  {
                                      TroubleReportId = n.TroubleReportId,
                                      when = n.When.HasValue ? n.When.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                                      breakDownMin = n.BreakDownMin,
                                      reportTitle = n.ReportTitle,
                                      process = n.Process,
                                      processingLot = n.ProcessingLot,
                                      NG = n.NG,
                                      pca = n.PCA.HasValue ? n.PCA.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                                      PHlotAndQuantity = n.PHLotAndQuantity,
                                      NGlotAndQuantity = n.NGLotAndQuantity,
                                      ProductHold = n.ProductHold,
                                      troubleType = !string.IsNullOrEmpty(n.TroubleType) ? n.TroubleType.Split(",", StringSplitOptions.RemoveEmptyEntries).Select(t => Int32.Parse(t)).ToList<int>() : new List<int>(),
                                      otherTroubleType = n.OtherTroubleType,
                                      rootCause = n.RootCause,
                                      restarted = n.Restarted,
                                      employeeId = !string.IsNullOrEmpty(n.EmployeeId) ? n.EmployeeId.Split(",", StringSplitOptions.RemoveEmptyEntries).Select(t => Int32.Parse(t)).ToList<int>() : new List<int>(),

                                      troubleBriefExplanation = n.TroubleBriefExplanation,
                                      immediateCorrectiveAction = n.ImmediateCorrectiveAction,
                                      closure = n.Closure.HasValue ? n.Closure.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                                      isAdjustMentReport = n.IsAdjustMentReport,
                                      adjustmentReport = n.AdjustmentReport,
                                      completionDate = n.CompletionDate.HasValue ? n.CompletionDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                                      CreatedDate = n.CreatedDate,
                                      CreatedBy = n.CreatedBy,
                                      WorkSubmittedDate = n.WorkSubmittedDate,
                                      isSubmit = n.IsSubmit,
                                      IsDeleted = n.IsDeleted,
                                      WorkDoneData = new List<WorkDoneSection>() // Initialize the list
                                  })
                                  .ToList(); // Execute the query and get the list of reports

            // Now populate the WorkDoneData for each report
            foreach (var report in reports)
            {
                report.WorkDoneData = _context.WorkDoneDetails
                    .Where(x => x.TroubleReportId == report.TroubleReportId && x.IsDeleted == false)
                    .Select(wd => new WorkDoneSection
                    {
                        workDoneId = wd.WorkDoneId,
                        troubleReportId = wd.TroubleReportId,
                        comment = wd.Comment,
                        employeeId = wd.EmployeeId,
                        lead = wd.Lead

                    }).ToList();
            }

            return reports;
        }

        public TroubleReportAdd GetById(int Id)
        {
            var res = _context.TroubleReports
                              .Where(n => n.IsDeleted == false && n.TroubleReportId == Id)
                              .FirstOrDefault();
            var departmentHead = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == res.CreatedBy).Select(x => x.DepartmentID).FirstOrDefault();
            var head = _cloneContext.DepartmentMasters.Where(x => x.DepartmentID == departmentHead).Select(x => x.Head).FirstOrDefault();
            if (res == null)
            {
                return null;
            }

            TroubleReportAdd troubleData = new TroubleReportAdd
            {
                TroubleReportId = res.TroubleReportId,
                when = res.When.HasValue ? res.When.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                troubleReportNo = res.TroubleReportNo,
                breakDownMin = res.BreakDownMin,
                reportTitle = res.ReportTitle,
                process = res.Process,
                processingLot = res.ProcessingLot,
                NG = res.NG,
                PHlotAndQuantity = res.PHLotAndQuantity,
                NGlotAndQuantity = res.NGLotAndQuantity,
                ProductHold = res.ProductHold,
                troubleType = !string.IsNullOrEmpty(res.TroubleType) ? res.TroubleType.Split(',').Select(s => int.Parse(s.Trim())).ToList() : new List<int>(),
                otherTroubleType = res.OtherTroubleType,
                rootCause = res.RootCause,
                employeeId = !string.IsNullOrEmpty(res.EmployeeId) ? res.EmployeeId.Split(',').Select(s => int.Parse(s.Trim())).ToList() : new List<int>(),
                restarted = res.Restarted,
                troubleBriefExplanation = res.TroubleBriefExplanation,
                immediateCorrectiveAction = res.ImmediateCorrectiveAction,
                closure = res.Closure.HasValue ? res.Closure.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                pca = res.PCA.HasValue ? res.PCA.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                isAdjustMentReport = res.IsAdjustMentReport,
                adjustmentReport = res.AdjustmentReport,
                completionDate = res.CompletionDate.HasValue ? res.CompletionDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                status = res.Status,
                workFlowStatus = res.WorkFlowStatus,
                isSubmit = res.IsSubmit,
                sequenceNumber = _context.TroubleReportApproverTaskMasters.Where(x => x.TroubleReportId == Id && x.IsActive == true && x.Status == ApprovalTaskStatus.Approved.ToString())
                                           .OrderByDescending(x => x.CreatedDate).Select(x => x.SequenceNo).FirstOrDefault(),
                approverTaskId = _context.TroubleReportApproverTaskMasters.Where(x => x.TroubleReportId == Id && x.IsActive == true && x.Status == ApprovalTaskStatus.UnderAmendment.ToString())
                                           .Select(x => x.ApproverTaskId).FirstOrDefault(),
                CreatedBy = res.CreatedBy,
                isReOpen = res.IsReOpen,
                remarks = res.Remarks,
                troubleRevisedId = res.TroubleReviseId,
                reportLevel = res.ReportLevel,
                permanantCorrectiveAction = res.PermanantCorrectiveAction,
                departmentHeadId = head

            };

            var workData = _context.WorkDoneDetails
                                   .Where(x => x.TroubleReportId == troubleData.TroubleReportId && x.IsDeleted == false)
                                   .ToList();

            if (workData != null)
            {
                troubleData.WorkDoneData = workData.Select(section => new WorkDoneSection
                {
                    workDoneId = section.WorkDoneId,
                    troubleReportId = section.TroubleReportId,
                    comment = section.Comment,
                    employeeId = section.EmployeeId,
                    lead = section.Lead
                }).ToList();
            }

            var attachment = _context.TroubleAttachments.Where(x => x.TroubleReportId == troubleData.TroubleReportId && x.IsDeleted == false)
                                   .ToList();

            if (attachment != null)
            {
                troubleData.TroubleAttachmentDetails = attachment.Select(x => new troubleAttachment
                {
                    attachmentId = x.TroubleAttachmentId,
                    uid = x.TroubleAttachmentId.ToString(),
                    troubleReportId = x.TroubleReportId,
                    url = x.DocumentFilePath,
                    name = x.DocumentName,
                    status = "done"
                }).ToList();
            }

            return troubleData;
        }


        //first time when raise come he will add the data 
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

        public async Task<AjaxResult> AddOrUpdateReport(TroubleReportAdd report)
        {
            var res = new AjaxResult();
            try
            {
                int troubleReportId = 0;
                var existingReport = _context.TroubleReports.Where(x => x.TroubleReportId == report.TroubleReportId && x.IsDeleted == false && x.IsActive == true).FirstOrDefault();

                if (existingReport == null)
                {
                    var newReport = new TroubleReports();

                    newReport.When = !string.IsNullOrEmpty(report.when) ? DateTime.Parse(report.when) : (DateTime?)null;
                    newReport.BreakDownMin = report.breakDownMin;
                    newReport.ReportTitle = report.reportTitle;
                    newReport.Process = report.process;
                    newReport.ProcessingLot = report.processingLot;
                    newReport.NG = report.NG;
                    newReport.PHLotAndQuantity = report.PHlotAndQuantity;
                    newReport.NGLotAndQuantity = report.NGlotAndQuantity;
                    newReport.ProductHold = report.ProductHold;
                    newReport.TroubleType = report.troubleType != null ? string.Join(",", report.troubleType) : string.Empty;
                    //newReport.OtherTroubleType = report.troubleType != null ? report.troubleType.Contains(-1) ? report.otherTroubleType : "" ;
                    newReport.OtherTroubleType = report.troubleType != null && report.troubleType.Contains(-1)
                            ? report.otherTroubleType
                            : "";
                    newReport.EmployeeId = report.employeeId != null && report.employeeId.Count > 0 ? string.Join(",", report.employeeId) : "";
                    newReport.Restarted = report.restarted;
                    newReport.TroubleBriefExplanation = report.troubleBriefExplanation;
                    newReport.ImmediateCorrectiveAction = report.immediateCorrectiveAction;
                    newReport.Closure = !string.IsNullOrEmpty(report.closure) ? DateTime.Parse(report.closure) : (DateTime?)null;
                    newReport.PCA = !string.IsNullOrEmpty(report.pca) ? DateTime.Parse(report.pca) : (DateTime?)null;
                    newReport.RootCause = report.rootCause;
                    newReport.IsAdjustMentReport = report.isAdjustMentReport;
                    newReport.AdjustmentReport = report.adjustmentReport;
                    newReport.CompletionDate = !string.IsNullOrEmpty(report.completionDate) ? DateTime.Parse(report.completionDate) : (DateTime?)null;
                    newReport.Remarks = report.remarks;
                    newReport.IsDeleted = false;
                    newReport.CreatedDate = DateTime.Now;
                    newReport.CreatedBy = report.CreatedBy;
                    newReport.WorkSubmittedDate = DateTime.Now;
                    newReport.ModifiedBy = report.ModifiedBy;
                    newReport.IsSubmit = false;
                    newReport.IsReview = false;
                    newReport.IsReOpen = false;
                    newReport.RaiserEmailSent = 0;
                    newReport.ManagerEmailSent = 0;
                    newReport.DepartMentHeadEmailSent = 0;
                    newReport.DivisionHeadEmailSent = 0;
                    newReport.RaiseEmailRCA = 0;
                    newReport.ManagerEmailRCA = 0;
                    newReport.DepartMentHeadEmailRCA = 0;
                    newReport.DivisionHeadRCAEmail = 0;
                    newReport.IsActive = true;
                    newReport.Status = ApprovalTaskStatus.Draft.ToString();
                    newReport.WorkFlowStatus = ApprovalTaskStatus.Draft.ToString();
                    newReport.ReportLevel = 0;
                    newReport.PermanantCorrectiveAction = report.permanantCorrectiveAction;
                    //Status = ApprovalTaskStatus.InReview.ToString(),
                    _context.TroubleReports.Add(newReport);
                    await _context.SaveChangesAsync();
                    troubleReportId = newReport.TroubleReportId;

                    var troubleReportIdParam = new Microsoft.Data.SqlClient.SqlParameter("@TroubleReportId", troubleReportId);
                    var isSubmitParam = new Microsoft.Data.SqlClient.SqlParameter("@IsSubmit", report.isSubmit);

                    var result = await _context.Set<TroubleReportNumberResult>()
                                      .FromSqlRaw("EXEC [dbo].[SPP_GenerateTroubleReportNumber] @TroubleReportId, @IsSubmit", troubleReportIdParam, isSubmitParam)
                                      .ToListAsync();

                    if (report.WorkDoneData != null)
                    {
                        foreach (var workDone in report.WorkDoneData)
                        {
                            var workData = new WorkDoneDetail()
                            {
                                EmployeeId = workDone.employeeId,
                                Lead = workDone.lead,
                                Comment = workDone.comment,
                                TroubleReportId = newReport.TroubleReportId,
                                CreatedBy = workDone.CreatedBy,
                                CreatedDate = DateTime.Now,
                                IsDeleted = false,
                                IsSaved = workDone.isSaved
                            };

                            _context.WorkDoneDetails.Add(workData);
                        }
                    }
                    await _context.SaveChangesAsync();

                    if (report.TroubleAttachmentDetail != null)
                    {
                        foreach (var attach in report.TroubleAttachmentDetail)
                        {
                            var attachment = new TroubleAttachment()
                            {
                                TroubleReportId = newReport.TroubleReportId,
                                DocumentName = attach.documentName,
                                DocumentFilePath = attach.documentFilePath,
                                IsDeleted = false,
                                CreatedBy = attach.CreatedBy,
                                CreatedDate = DateTime.Now,
                            };
                            _context.TroubleAttachments.Add(attachment);
                        }
                    }
                    await _context.SaveChangesAsync();

                    InsertHistoryData(newReport.TroubleReportId, FormType.TroubleReport.ToString(), "Raiser", "Update Status as Draft", "Draft", Convert.ToInt32(report.CreatedBy), HistoryAction.Save.ToString(), 0);
                    // res.StatusCode = Status.Success;
                    res.ReturnValue = troubleReportId;
                    res.Message = Enums.TroubleSave;
                }
                else
                {
                    existingReport.When = !string.IsNullOrEmpty(report.when) ? DateTime.Parse(report.when) : (DateTime?)null;
                    existingReport.BreakDownMin = report.breakDownMin;
                    existingReport.ReportTitle = report.reportTitle;
                    existingReport.Process = report.process;
                    existingReport.ProcessingLot = report.processingLot;
                    existingReport.NG = report.NG;
                    existingReport.PHLotAndQuantity = report.PHlotAndQuantity;
                    existingReport.NGLotAndQuantity = report.NGlotAndQuantity;
                    existingReport.ProductHold = report.ProductHold;
                    existingReport.TroubleType = report.troubleType != null ? string.Join(",", report.troubleType) : string.Empty;
                    //newReport.OtherTroubleType = report.troubleType != null ? report.troubleType.Contains(-1) ? report.otherTroubleType : "" ;
                    existingReport.OtherTroubleType = report.troubleType != null && report.troubleType.Contains(-1)
                            ? report.otherTroubleType
                            : "";
                    existingReport.EmployeeId = report.employeeId != null && report.employeeId.Count > 0 ? string.Join(",", report.employeeId) : "";
                    existingReport.Restarted = report.restarted;
                    existingReport.TroubleBriefExplanation = report.troubleBriefExplanation;
                    //existingReport.ImmediateCorrectiveAction = report.immediateCorrectiveAction;
                    existingReport.Closure = !string.IsNullOrEmpty(report.closure) ? DateTime.Parse(report.closure) : (DateTime?)null;
                    existingReport.PCA = !string.IsNullOrEmpty(report.pca) ? DateTime.Parse(report.pca) : (DateTime?)null;
                    //existingReport.RootCause = report.rootCause;
                    existingReport.IsAdjustMentReport = report.isAdjustMentReport;
                    existingReport.AdjustmentReport = report.adjustmentReport;
                    existingReport.CompletionDate = !string.IsNullOrEmpty(report.completionDate) ? DateTime.Parse(report.completionDate) : (DateTime?)null;
                    existingReport.Remarks = report.remarks;
                    existingReport.IsDeleted = false;
                    existingReport.IsActive = true;
                    existingReport.WorkSubmittedDate = DateTime.Now;
                    existingReport.ModifiedBy = report.ModifiedBy;
                    existingReport.PermanantCorrectiveAction = report.permanantCorrectiveAction;

                    var changeStatus = _context.TroubleReports.Where(x => x.TroubleReportId == existingReport.TroubleReportId && (x.Status == ApprovalTaskStatus.Reviewed.ToString() || x.Status == ApprovalTaskStatus.ReviewDeclined.ToString())).FirstOrDefault();
                    if (changeStatus != null)
                    {
                        existingReport.Status = ApprovalTaskStatus.InProcess.ToString();
                    }
                    if (report.immediateCorrectiveAction != null)
                    {
                        var icaField = _context.TroubleReports.Where(x => x.TroubleReportId == report.TroubleReportId && x.IsDeleted == false && x.IsActive == true && x.ImmediateCorrectiveAction == null).FirstOrDefault();
                        if (icaField != null)
                        {
                            existingReport.ImmediateCorrectiveAction = report.immediateCorrectiveAction;
                            existingReport.ICADate = DateTime.Now;
                        }
                        else
                        {
                            existingReport.ImmediateCorrectiveAction = report.immediateCorrectiveAction;
                        }
                    }
                    else
                    {
                        existingReport.ImmediateCorrectiveAction = report.immediateCorrectiveAction;
                    }


                    if (report.rootCause != null)
                    {
                        var icaField = _context.TroubleReports.Where(x => x.TroubleReportId == report.TroubleReportId && x.IsDeleted == false && x.IsActive == true && x.RootCause == null).FirstOrDefault();
                        if (icaField != null)
                        {
                            existingReport.RootCause = report.rootCause;
                            existingReport.RCADate = DateTime.Now;
                        }
                        else
                        {
                            existingReport.RootCause = report.rootCause;
                        }
                    }
                    else
                    {
                        existingReport.RootCause = report.rootCause;
                    }
                    await _context.SaveChangesAsync();


                    var existingWorkDoneData = _context.WorkDoneDetails.Where(x => x.TroubleReportId == existingReport.TroubleReportId).ToList();
                    MarkAsDeleted(existingWorkDoneData, existingReport.CreatedBy, DateTime.Now);
                    _context.SaveChanges();

                    //check for each data in Workdone and if any data exist then update otherwise add
                    if (report.WorkDoneData != null)
                    {
                        foreach (var data in report.WorkDoneData)
                        {
                            var existingWorkData = _context.WorkDoneDetails.FirstOrDefault(x => x.TroubleReportId == existingReport.TroubleReportId && x.EmployeeId == data.employeeId);
                            if (existingWorkData != null)
                            {

                                existingWorkData.EmployeeId = data.employeeId;
                                existingWorkData.Lead = data.lead;
                                existingWorkData.Comment = data.comment;
                                existingWorkData.ModifiedBy = data.ModifiedBy;
                                existingWorkData.ModifiedDate = DateTime.Now;
                                existingWorkData.IsDeleted = false;
                                existingWorkData.IsSaved = data.isSaved;
                                await _context.SaveChangesAsync();
                            }
                            else
                            {

                                var workData = new WorkDoneDetail()
                                {
                                    EmployeeId = data.employeeId,
                                    Lead = data.lead,
                                    Comment = data.comment,
                                    TroubleReportId = existingReport.TroubleReportId,
                                    CreatedBy = data.CreatedBy,
                                    CreatedDate = DateTime.Now,
                                    IsDeleted = false,
                                    IsSaved = data.isSaved
                                };

                                _context.WorkDoneDetails.Add(workData);

                                await _context.SaveChangesAsync();
                            }
                            await _context.SaveChangesAsync();
                        }
                    }


                    var existingAttachedData = _context.TroubleAttachments.Where(x => x.TroubleReportId == existingReport.TroubleReportId).ToList();
                    MarkAsDeleted(existingAttachedData, existingReport.CreatedBy, DateTime.Now);
                    _context.SaveChanges();

                    if (report.TroubleAttachmentDetail != null)
                    {
                        foreach (var attach in report.TroubleAttachmentDetail)
                        {
                            var existingAttachmentData = _context.TroubleAttachments.FirstOrDefault(x => x.TroubleReportId == existingReport.TroubleReportId && x.TroubleAttachmentId == attach.TroubleAttachmentId);

                            if (existingAttachmentData != null)
                            {
                                existingAttachmentData.TroubleReportId = existingReport.TroubleReportId;
                                existingAttachmentData.DocumentName = attach.documentName;
                                existingAttachmentData.DocumentFilePath = attach.documentFilePath;
                                existingAttachmentData.IsDeleted = false;
                                existingAttachmentData.ModifiedBy = attach.ModifiedBy;
                                existingAttachmentData.ModifiedDate = DateTime.Now;
                                await _context.SaveChangesAsync();
                            }
                            else
                            {
                                var attachment = new TroubleAttachment()
                                {
                                    TroubleReportId = existingReport.TroubleReportId,
                                    DocumentName = attach.documentName,
                                    DocumentFilePath = attach.documentFilePath,
                                    IsDeleted = false,
                                    CreatedBy = attach.CreatedBy,
                                    CreatedDate = DateTime.Now,
                                };
                                _context.TroubleAttachments.Add(attachment);
                                await _context.SaveChangesAsync();
                            }
                            await _context.SaveChangesAsync();
                        }
                    }
                    string? RoleName = null;
                    var role = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == report.TroubleReportId && x.ReviewerId == report.ModifiedBy).Select(x => x.ProcessName).FirstOrDefault();
                    if (role != null)
                    {
                        RoleName = role;
                    }
                    else
                    {
                        RoleName = "Raiser";
                    }
                    //string? RoleName = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == report.ModifiedBy).Select(x => x.EmployeeName).FirstOrDefault();
                    InsertHistoryData(existingReport.TroubleReportId, FormType.TroubleReport.ToString(), RoleName, "Form saved successfully ", existingReport.Status.ToString(), Convert.ToInt32(report.ModifiedBy), HistoryAction.Save.ToString(), 0);

                    res.Message = Enums.TroubleSave;
                    res.ReturnValue = existingReport.TroubleReportId;
                }

                return res;

            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "AddOrUpdate");
                return res;
            }
        }

        public async Task<AjaxResult> DeleteReport(int Id)
        {
            var res = new AjaxResult();
            var report = _context.TroubleReports.Where(x => x.TroubleReportId == Id && x.IsDeleted == false && x.IsActive == true).FirstOrDefault();
            if (report == null)
            {
                res.StatusCode = Status.Error;
                res.Message = "Record Not Found";
            }
            else
            {
                report.IsDeleted = true;
                report.IsActive = false;
                //report.ModifiedDate = DateTime.Now;
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

        #endregion

        #region Send to manager  

        //after adding data Raiser will send the data to the manager and manager will add the data in that 
        public async Task<AjaxResult> SendManager(int troubleReportId, int userId)
        {
            var res = new AjaxResult();
            var managerData = new TroubleReportReviewerTaskMaster();
            try
            {
                managerData.ReviewerTaskMasterId = 0;
                managerData.TroubleReportId = troubleReportId;
                managerData.ReviewerId = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == userId).Select(x => x.ReportingManagerId).FirstOrDefault();
                managerData.DisplayName = Enums.ReportingManager;
                managerData.ProcessName = Enums.ReportingManager;
                managerData.IsActive = true;
                managerData.IsClsoed = false;
                managerData.IsSubmit = false;
                managerData.Status = ApprovalTaskStatus.InProcess.ToString();
                managerData.CreatedBy = userId;
                managerData.CreatedDate = DateTime.Now;
                managerData.ModifiedDate = DateTime.Now;
                managerData.ModifiedBy = userId;
                _context.Add(managerData);
                await _context.SaveChangesAsync();
                res.StatusCode = Status.Success;
                res.Message = Enums.TroubleNotifyManager;
                InsertHistoryData(troubleReportId, FormType.TroubleReport.ToString(), "Raiser", "Form Send to Manager", ApprovalTaskStatus.InProcess.ToString(), userId, HistoryAction.SendToManager.ToString(), 0);

                var notificationHelper = new NotificationHelper(_context,_cloneContext);
                await notificationHelper.SendEmail(troubleReportId , EmailNotificationAction.NotifyManager,null,0);
                InsertHistoryData(troubleReportId, FormType.TroubleReport.ToString(), "Raiser", "emailsent", ApprovalTaskStatus.InProcess.ToString(), userId, HistoryAction.SendToManager.ToString(), 0);


                var troubleData = _context.TroubleReports.Where(x => x.TroubleReportId == troubleReportId && x.IsDeleted == false && x.IsActive == true).FirstOrDefault();
                if (troubleData != null)
                {
                    troubleData.Status = ApprovalTaskStatus.InProcess.ToString();
                    troubleData.IsReview = false;
                    await _context.SaveChangesAsync();
                }
            }

            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "SendManager");
                return res;

            }
            return res;
        }
        #endregion

        #region Notify workDoneMemebrs 

        //after manager add the data he will notify the work done members that they are added in the work 
        public async Task<AjaxResult> NotifyWorkDoneMembers(int troubleReportId, int userId)
        {
            var res = new AjaxResult();
            var notifyMembersData = new TroubleReportReviewerTaskMaster();
            try
            {
                var managerData = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == troubleReportId && x.DisplayName == Enums.ReportingManager && x.IsActive == true && x.IsClsoed == false).FirstOrDefault();
                if (managerData != null)
                {
                    managerData.Status = ApprovalTaskStatus.Completed.ToString();
                    _context.SaveChanges();
                }
                var workDoneLeadExist = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == troubleReportId && x.DisplayName == Enums.WorkDoneLead && x.IsActive == true && x.IsClsoed == false).FirstOrDefault();
                if (workDoneLeadExist != null)
                {
                    workDoneLeadExist.ReviewerId = _context.WorkDoneDetails.Where(x => x.TroubleReportId == troubleReportId && x.Lead == true && x.IsDeleted == false).Select(x => x.EmployeeId).FirstOrDefault();
                    workDoneLeadExist.ModifiedDate = DateTime.Now;
                    workDoneLeadExist.ModifiedBy = userId;
                    await _context.SaveChangesAsync();
                }
                else
                {
                    notifyMembersData.ReviewerTaskMasterId = 0;
                    notifyMembersData.TroubleReportId = troubleReportId;
                    notifyMembersData.ReviewerId = _context.WorkDoneDetails.Where(x => x.TroubleReportId == troubleReportId && x.Lead == true && x.IsDeleted == false).Select(x => x.EmployeeId).FirstOrDefault();
                    notifyMembersData.DisplayName = Enums.WorkDoneLead;
                    notifyMembersData.ProcessName = Enums.WorkDoneLead;
                    notifyMembersData.IsActive = true;
                    notifyMembersData.IsSubmit = false;
                    notifyMembersData.IsClsoed = false;
                    notifyMembersData.Status = ApprovalTaskStatus.InProcess.ToString();
                    notifyMembersData.CreatedBy = userId;
                    notifyMembersData.CreatedDate = DateTime.Now;
                    notifyMembersData.ModifiedDate = DateTime.Now;
                    notifyMembersData.ModifiedBy = userId;

                    _context.Add(notifyMembersData);
                    await _context.SaveChangesAsync();
                }
                res.StatusCode = Status.Success;
                res.Message = Enums.TroubleNotifyMembers;

                var troubleData = _context.TroubleReports.Where(x => x.TroubleReportId == troubleReportId && x.IsDeleted == false && x.IsActive == true).FirstOrDefault();
                if (troubleData != null)
                {
                    troubleData.Status = ApprovalTaskStatus.InProcess.ToString();
                    troubleData.IsReview = false;
                    var workDone = _context.WorkDoneDetails.Where(x => x.TroubleReportId == troubleData.TroubleReportId && x.Lead == true && x.IsDeleted == false).FirstOrDefault();
                    if(workDone != null)
                    {
                        troubleData.ReportLevel = 1;
                    }
                    await _context.SaveChangesAsync();
                }
                var notificationHelper = new NotificationHelper(_context, _cloneContext);
                await notificationHelper.SendEmail(troubleReportId, EmailNotificationAction.NotifyWokrDone, null, 0);
                InsertHistoryData(troubleReportId, FormType.TroubleReport.ToString(), Enums.ReportingManager, "WorkDone People Notify", ApprovalTaskStatus.InProcess.ToString(), userId, HistoryAction.NotifyMembers.ToString(), 0);

            }

            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "NotifyWorkDoneMembers");
                return res;
            }
            return res;
        }
        #endregion

        #region Review ManagerTask

        //after workdone lead notify Managers for review 
        public async Task<AjaxResult> ReviewByManagers(int troubleReportId, int userId)
        {
            var res = new AjaxResult();

            try
            {
                var workDoneMember = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == troubleReportId && x.ReviewerId == userId && x.IsActive == true && x.IsClsoed == false).FirstOrDefault();
                if (workDoneMember != null)
                {
                    workDoneMember.Status = ApprovalTaskStatus.UnderReview.ToString();
                    await _context.SaveChangesAsync();
                }

                var troubleData = _context.TroubleReports.Where(x => x.TroubleReportId == troubleReportId && x.IsDeleted == false && x.IsActive == true).FirstOrDefault();
                if (troubleData != null)
                {
                    troubleData.Status = ApprovalTaskStatus.UnderReview.ToString();
                    troubleData.IsReview = true;
                    await _context.SaveChangesAsync();
                }

               

                var reportingManagerData = _context.TroubleReportReviewerTaskMasters.
                                  Where(x => x.TroubleReportId == troubleReportId && x.IsActive == true && x.IsClsoed == false && x.DisplayName == Enums.ReviewReportingManager).FirstOrDefault();
                var workDoneManagerTask = _context.TroubleReportReviewerTaskMasters.
                                 Where(x => x.TroubleReportId == troubleReportId && x.IsActive == true && x.IsClsoed == false && x.DisplayName == Enums.WorkDoneManager).FirstOrDefault();

                if (workDoneManagerTask != null && reportingManagerData != null)
                {
                    var reportinManager = _context.TroubleReportReviewerTaskMasters.
                                Where(x => x.TroubleReportId == troubleReportId && x.IsActive == true && x.IsClsoed == false &&
                                x.DisplayName == Enums.ReviewReportingManager).FirstOrDefault();
                    if (reportinManager != null)
                    {
                        reportinManager.Status = ApprovalTaskStatus.InProcess.ToString();
                    }

                    var workDoneManager = _context.TroubleReportReviewerTaskMasters.
                                      Where(x => x.TroubleReportId == troubleReportId && x.IsActive == true && x.IsClsoed == false &&
                                      x.DisplayName == Enums.WorkDoneManager).FirstOrDefault();
                    if (workDoneManager != null)
                    {
                        workDoneManager.Status = ApprovalTaskStatus.InProcess.ToString();
                    }
                    await _context.SaveChangesAsync();
                }
                else
                {
                    var tasks = new List<TroubleReportReviewerTaskMaster>
                  {
                   new TroubleReportReviewerTaskMaster
                   {
                    TroubleReportId = troubleReportId,
                    ReviewerId = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == troubleReportId && x.DisplayName == Enums.ReportingManager && x.ProcessName == Enums.ReportingManager && x.IsActive == true).Select(x=> x.ReviewerId).FirstOrDefault(), // Assuming fixed EmployeeId for ReportingManager
                    DisplayName =  Enums.ReviewReportingManager,
                    ProcessName = Enums.ReportingManager,
                    Status = ApprovalTaskStatus.InProcess.ToString(),
                    IsActive = true,
                    IsSubmit = false,
                    IsClsoed = false,
                    CreatedBy = userId,
                    CreatedDate = DateTime.Now,
                    ModifiedDate = DateTime.Now,
                    ModifiedBy = userId
                   },
                   new TroubleReportReviewerTaskMaster
                   {
                    TroubleReportId = troubleReportId,
                    ReviewerId = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == userId).Select(x => x.ReportingManagerId).FirstOrDefault(), // Assuming fixed EmployeeId for ReportingManager
                    DisplayName =  Enums.WorkDoneManager,
                    ProcessName = Enums.WorkDoneManager,
                    Status = ApprovalTaskStatus.InProcess.ToString(),
                    IsActive = true,
                    IsSubmit = false,
                    IsClsoed = false,
                    CreatedBy = userId,
                    CreatedDate = DateTime.Now,
                    ModifiedDate = DateTime.Now,
                    ModifiedBy = userId
                   }
                  };

                    _context.TroubleReportReviewerTaskMasters.AddRange(tasks);
                }

                await _context.SaveChangesAsync();

                var notificationHelper = new NotificationHelper(_context, _cloneContext);
                await notificationHelper.SendEmail(troubleReportId, EmailNotificationAction.NotifyReviewManager, null, 0);

                InsertHistoryData(troubleReportId, FormType.TroubleReport.ToString(), Enums.WorkDoneLead, "Send for Managers Review", ApprovalTaskStatus.UnderReview.ToString(), userId, HistoryAction.ReviewByManager.ToString(), 0);
                res.StatusCode = Status.Success;
                res.Message = Enums.TroubleReviewManager;
            }

            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "ReviewByManagers");
                return res;
            }
            return res;
        }

        //after reviewing form the manager will send their review as APPROVE or REJECT 
        public async Task<AjaxResult> ManagerReviewTask(int troubleReportId, int userId, string status, string comment)
        {
            var res = new AjaxResult();
            try
            {
                if (status == ApprovalTaskStatus.ReviewDeclined.ToString())
                {
                    var reportinManager = _context.TroubleReportReviewerTaskMasters.
                                 Where(x => x.TroubleReportId == troubleReportId && x.IsActive == true && x.IsClsoed == false &&
                                 x.DisplayName == Enums.ReviewReportingManager).FirstOrDefault();
                    res.Message = Enums.TroubleDecline;
                    if (reportinManager != null)
                    {
                        reportinManager.Status = ApprovalTaskStatus.Decline.ToString();
                        reportinManager.Comment = comment;

                    }
                    var workDoneManager = _context.TroubleReportReviewerTaskMasters.
                                      Where(x => x.TroubleReportId == troubleReportId && x.IsActive == true && x.IsClsoed == false &&
                                      x.DisplayName == Enums.WorkDoneManager).FirstOrDefault();
                    if (workDoneManager != null)
                    {
                        workDoneManager.Status = ApprovalTaskStatus.Decline.ToString();
                        workDoneManager.Comment = comment;

                    }

                    var troubleData = _context.TroubleReports.Where(x => x.TroubleReportId == troubleReportId && x.IsDeleted == false).FirstOrDefault();
                    if (troubleData != null)
                    {
                        troubleData.Status = ApprovalTaskStatus.ReviewDeclined.ToString();
                        troubleData.IsReview = false;

                    }
                    await _context.SaveChangesAsync();
                    var changeStatus = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == troubleReportId
                                     && x.DisplayName == Enums.WorkDoneLead && x.IsActive == true && x.IsClsoed == false).FirstOrDefault();
                    if (changeStatus != null)
                    {
                        changeStatus.Status = ApprovalTaskStatus.InProcess.ToString();
                        changeStatus.IsSubmit = true;
                        await _context.SaveChangesAsync();
                    }
                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendEmail(troubleReportId, EmailNotificationAction.Decline, comment, userId);
                    InsertHistoryData(troubleReportId, FormType.TroubleReport.ToString(), "Review Manager", comment, ApprovalTaskStatus.ReviewDeclined.ToString(), userId, HistoryAction.Decline.ToString(), 0);

                }
                else
                {
                    var reviewedData = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == troubleReportId && x.ReviewerId == userId && x.IsActive == true && x.IsClsoed == false && x.Status == ApprovalTaskStatus.InProcess.ToString()).FirstOrDefault();
                    if (reviewedData != null)
                    {
                        reviewedData.Status = ApprovalTaskStatus.Allow.ToString();
                        reviewedData.Comment = comment;
                        res.Message = Enums.TroubleAllow;

                        await _context.SaveChangesAsync();
                    }
                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendEmail(troubleReportId, EmailNotificationAction.Allow, comment, userId);
                    InsertHistoryData(troubleReportId, FormType.TroubleReport.ToString(), "Review Manager", comment, ApprovalTaskStatus.Allow.ToString(), userId, HistoryAction.Allow.ToString(), 0);

                }

                var reportinManagerTask = _context.TroubleReportReviewerTaskMasters.
                                  Where(x => x.TroubleReportId == troubleReportId && x.IsActive == true && x.IsClsoed == false &&
                                  x.DisplayName == Enums.ReviewReportingManager && x.Status == ApprovalTaskStatus.Allow.ToString()).FirstOrDefault();
                var workDoneManagerTask = _context.TroubleReportReviewerTaskMasters.
                                  Where(x => x.TroubleReportId == troubleReportId && x.IsActive == true && x.IsClsoed == false &&
                                  x.DisplayName == Enums.WorkDoneManager && x.Status == ApprovalTaskStatus.Allow.ToString()).FirstOrDefault();

                if (reportinManagerTask != null && workDoneManagerTask != null)
                {
                    var changeStatus = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == troubleReportId && x.DisplayName == Enums.WorkDoneLead && x.IsActive == true && x.IsClsoed == false).FirstOrDefault();
                    if (changeStatus != null)
                    {
                        changeStatus.Status = ApprovalTaskStatus.InProcess.ToString();
                        changeStatus.IsSubmit = true;
                        await _context.SaveChangesAsync();

                        var troubleData = _context.TroubleReports.Where(x => x.TroubleReportId == troubleReportId && x.IsDeleted == false).FirstOrDefault();
                        if (troubleData != null)
                        {
                            troubleData.Status = ApprovalTaskStatus.Reviewed.ToString();
                            troubleData.IsReview = false;

                            if(troubleData.ReportLevel == 1 && troubleData.ICADate != null)
                            {
                                troubleData.ReportLevel = 2;
                            }
                            else if(troubleData.ReportLevel == 2 && troubleData.RCADate != null && troubleData.PCA != null)
                            {
                                troubleData.ReportLevel = 3;
                            }
                            else if ((troubleData.ReportLevel == 3 && troubleData.PCA !=null && troubleData.Closure != null) ||
                                 (troubleData.IsAdjustMentReport == true && troubleData.AdjustmentReport != null))
                            {
                                troubleData.ReportLevel = 4;
                            }
                            await _context.SaveChangesAsync();
                        }
                    }
                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendEmail(troubleReportId, EmailNotificationAction.AllowBoth, null, 0);

                }
                //res.StatusCode = Status.Success;


            }

            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "ManagerReviewTask");
                //return res;
            }
            return res;
        }
        #endregion

        #region Submit Actions 
        public async Task<AjaxResult> SubmitRequest(TroubleReport_OnSubmit onSubmit)
        {
            var res = new AjaxResult();
            try
            {
                bool finalResult = false;
                var trouble = _context.TroubleReports.Where(x => x.TroubleReportId == onSubmit.troubleReportId && x.IsActive == true).FirstOrDefault();
                if (onSubmit.isSubmit == true && onSubmit.isAmendReSubmitTask == false)
                {
                    trouble.WorkFlowStatus = ApprovalTaskStatus.UnderApproval.ToString();
                    trouble.IsSubmit = true;
                    trouble.Status = ApprovalTaskStatus.UnderApproval.ToString();
                    trouble.IsReview = false;

                    var troubleNum = _context.TroubleReports.Where(x => x.TroubleReportId == onSubmit.troubleReportId && x.IsActive == true && x.TroubleReviseId == null).FirstOrDefault();
                    if (troubleNum != null)
                    {
                        var troubleReportIdParam = new Microsoft.Data.SqlClient.SqlParameter("@TroubleReportId", onSubmit.troubleReportId);
                        var isSubmitParam = new Microsoft.Data.SqlClient.SqlParameter("@IsSubmit", onSubmit.isSubmit);

                        var result = await _context.Set<TroubleReportNumberResult>()
                                          .FromSqlRaw("EXEC [dbo].[SPP_GenerateTroubleReportNumber] @TroubleReportId, @IsSubmit", troubleReportIdParam, isSubmitParam)
                                          .ToListAsync();
                        await _context.SaveChangesAsync();
                    }
                    var processTask = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == onSubmit.troubleReportId && x.IsActive == true && x.IsClsoed == false && x.DisplayName == Enums.WorkDoneLead).FirstOrDefault();
                    if (processTask != null)
                    {
                        processTask.Status = ApprovalTaskStatus.Completed.ToString();
                    }
                    await _context.SaveChangesAsync();
                    res.Message = Enums.TroubleSubmit;
                    InsertHistoryData(onSubmit.troubleReportId, FormType.TroubleReport.ToString(), Enums.WorkDoneLead, "Submit the Form ", ApprovalTaskStatus.UnderApproval.ToString(), Convert.ToInt16(onSubmit.modifiedBy), HistoryAction.Submit.ToString(), 0);
                    //history
                    //InsertHistoryData(trouble.TroubleReportId, "Trouble", Enums.WorkDoneLead, "Update Status as In Review", "InReview", trouble.CreatedBy ?? 0, "Submit", 0);

                    //wrkFLow entry
                    _context.CallTroubleReportApproverMatrix(trouble.CreatedBy, trouble.TroubleReportId);
                    //mail notification - of that form is submitted

                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendEmail(onSubmit.troubleReportId, EmailNotificationAction.Submitted, onSubmit.comment, 0);

                    //approver process
                     ApprovedCheck(trouble.TroubleReportId, trouble.CreatedBy ?? 0);
                }

                if (onSubmit.isAmendReSubmitTask == true && onSubmit.isSubmit == true)
                {
                    var processTask = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == onSubmit.troubleReportId && x.IsActive == true && x.IsClsoed == false && x.DisplayName == Enums.WorkDoneLead).FirstOrDefault();
                    if (processTask != null)
                    {
                        processTask.Status = ApprovalTaskStatus.Completed.ToString();
                        await _context.SaveChangesAsync();
                    }
                    res.Message = Enums.TroubleResubmit;

                    ReSubmitApproverTask(onSubmit.troubleReportId, onSubmit.approverTaskId ?? 0, onSubmit.modifiedBy ?? 0, onSubmit.comment);
                }
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "SubmitRequest");
                //return res;
            }
            return res;
        }
        private bool ApprovedCheck(int troubleReportId, int userId)
        {
            var approverDetails = _context.TroubleReportApproverTaskMasters.Where(x => x.TroubleReportId == troubleReportId && x.IsActive == true && x.AssignedToUserId == userId).ToList();
            bool result = false;
            if (approverDetails.Count() > 0)
            {
                var inReviewTask = approverDetails.Where(x => x.Status == ApprovalTaskStatus.UnderApproval.ToString() && x.SequenceNo == 1).FirstOrDefault();
                if (inReviewTask != null)
                {
                    //send an email
                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    notificationHelper.SendEmail(troubleReportId, EmailNotificationAction.Approved, null, 0);

                }
            }
            return result;
        }


        public void ReSubmitApproverTask(int troubleReportId, int approverTaskId, int ModifiedBy, string comment)
        {
            var troubleApproverTaskMaster = _context.TroubleReportApproverTaskMasters.FirstOrDefault(x => x.TroubleReportId == troubleReportId && x.ApproverTaskId == approverTaskId && x.Status == ApprovalTaskStatus.UnderAmendment.ToString() && x.IsActive == true);
            if (troubleApproverTaskMaster != null)
            {
                troubleApproverTaskMaster.Status = ApprovalTaskStatus.UnderApproval.ToString();
                troubleApproverTaskMaster.ModifiedBy = ModifiedBy;
                troubleApproverTaskMaster.ModifiedDate = DateTime.Now;
                //troubleApproverTaskMaster.Comments = comment;
                _context.SaveChanges();

                //insert the history 
                InsertHistoryData(troubleReportId, FormType.TroubleReport.ToString(), Enums.WorkDoneLead, comment, troubleApproverTaskMaster.Status, Convert.ToInt32(troubleApproverTaskMaster.ModifiedBy), ApprovalTaskStatus.ReSubmitted.ToString(), 0);

                //send an email 
                var notificationHelper = new NotificationHelper(_context, _cloneContext);
                notificationHelper.SendEmail(troubleReportId, EmailNotificationAction.ReSubmitted, comment, 0);

            }

        }

        #endregion

        #region Approver and Ask to amend 
        public async Task<AjaxResult> UpdateApproveAskToAmend(int ApproverTaskId, int CurrentUserId, ApprovalStatus type, string comment, int troubleReportId)
        {

            var res = new AjaxResult();
            ///bool result = false;
            try
            {
                var requestTaskData = _context.TroubleReportApproverTaskMasters.Where(x => x.ApproverTaskId == ApproverTaskId && x.IsActive == true
                                       && x.TroubleReportId == troubleReportId
                                       && x.Status == ApprovalTaskStatus.UnderApproval.ToString()).FirstOrDefault();
                if (requestTaskData == null)
                {
                    res.Message = "Trouble Report request does not have any review task";
                    return res;
                }

                if (type == ApprovalStatus.Approved)
                {
                    requestTaskData.Status = ApprovalTaskStatus.Approved.ToString();
                    requestTaskData.ModifiedBy = CurrentUserId;
                    requestTaskData.ActionTakenBy = CurrentUserId;
                    requestTaskData.ActionTakenDate = DateTime.Now;
                    requestTaskData.ModifiedDate = DateTime.Now;
                    requestTaskData.Comments = comment;

                    await _context.SaveChangesAsync();

                    res.Message = Enums.TroubleApprove;
                    //Insert the history 
                    InsertHistoryData(requestTaskData.TroubleReportId, FormType.TroubleReport.ToString(), requestTaskData.Role, requestTaskData.Comments, requestTaskData.Status, Convert.ToInt32(requestTaskData.ModifiedBy), ApprovalTaskStatus.Approved.ToString(), 0);
                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendEmail(troubleReportId, EmailNotificationAction.ApproveInformed, comment, ApproverTaskId);
                  
                    //send an email - that it task has been approvedz


                    var divisonHeadTask = _context.TroubleReportApproverTaskMasters.Where(x => x.TroubleReportId == troubleReportId && x.IsActive == true
                                               && x.Status == ApprovalTaskStatus.Approved.ToString() && x.ApproverTaskId == ApproverTaskId && x.SequenceNo == 3).FirstOrDefault();
                    if (divisonHeadTask != null)
                    {
                        var divisonHeadTask2 = _context.TroubleReportApproverTaskMasters.Where(x => x.TroubleReportId == troubleReportId && x.IsActive == true
                                   && x.Status == ApprovalTaskStatus.UnderApproval.ToString() && x.SequenceNo == 3).FirstOrDefault();
                        if (divisonHeadTask2 != null)
                        {
                            divisonHeadTask2.Status = ApprovalTaskStatus.Approved.ToString();
                            divisonHeadTask2.IsActive = false;
                            await _context.SaveChangesAsync();
                        }

                    }

                    var currentApproverTask = _context.TroubleReportApproverTaskMasters.Where(x => x.TroubleReportId == requestTaskData.TroubleReportId && x.IsActive == true
                                          && x.ApproverTaskId == ApproverTaskId && x.Status == ApprovalTaskStatus.Approved.ToString()).FirstOrDefault();
                    if (currentApproverTask != null)
                    {
                        var nextApproveTask = _context.TroubleReportApproverTaskMasters.Where(x => x.TroubleReportId == requestTaskData.TroubleReportId && x.IsActive == true
                                 && x.Status == ApprovalTaskStatus.Pending.ToString() && x.SequenceNo == (requestTaskData.SequenceNo) + 1).ToList();
                        if (nextApproveTask.Any())
                        {
                            foreach (var nextTask in nextApproveTask)
                            {
                                nextTask.Status = ApprovalTaskStatus.UnderApproval.ToString();
                                nextTask.ModifiedDate = DateTime.Now;
                                await _context.SaveChangesAsync();
                                await notificationHelper.SendEmail(troubleReportId, EmailNotificationAction.Approved, null, nextTask.ApproverTaskId);
                            }
                            // Notification code (if applicable)
                        }
                        else
                        {
                            var troubleData = _context.TroubleReports.Where(x => x.TroubleReportId == troubleReportId && x.IsDeleted == false && x.IsActive == true).FirstOrDefault();
                            if (troubleData != null)
                            {
                                troubleData.Status = ApprovalTaskStatus.Completed.ToString();
                                troubleData.CompletionDate = DateTime.Now;
                                troubleData.IsReview = false;
                                await _context.SaveChangesAsync();
                               await notificationHelper.SendEmail(troubleReportId, EmailNotificationAction.Completed, null, 0);
                            }
                        }
                    }
                }

                if (type == ApprovalStatus.AskToAmend)
                {
                    requestTaskData.Status = ApprovalTaskStatus.UnderAmendment.ToString();
                    requestTaskData.ModifiedBy = CurrentUserId;
                    requestTaskData.ActionTakenBy = CurrentUserId;
                    requestTaskData.ActionTakenDate = DateTime.Now;
                    requestTaskData.ModifiedDate = DateTime.Now;
                    requestTaskData.Comments = comment;

                    _context.SaveChanges();
                    res.Message = Enums.TroubleAskToAmend;
                    var troubleReview = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == troubleReportId && x.IsActive == true && x.IsClsoed == false && x.DisplayName == Enums.WorkDoneLead).FirstOrDefault();
                    if (troubleReview != null)
                    {
                        troubleReview.Status = ApprovalTaskStatus.InProcess.ToString();
                        troubleReview.IsSubmit = true;
                        await _context.SaveChangesAsync();
                    }

                    //Insert the history 
                    InsertHistoryData(requestTaskData.TroubleReportId, FormType.TroubleReport.ToString(), requestTaskData.Role, requestTaskData.Comments, requestTaskData.Status, Convert.ToInt32(requestTaskData.ModifiedBy), ApprovalTaskStatus.UnderAmendment.ToString(), 0);
                    //send an email - that it task has been amended
                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendEmail(troubleReportId, EmailNotificationAction.Amended, comment, ApproverTaskId);

                }

                if (type == ApprovalStatus.Rejected)
                {
                    requestTaskData.Status = ApprovalTaskStatus.Rejected.ToString();
                    requestTaskData.IsReject = true;
                    requestTaskData.ModifiedBy = CurrentUserId;
                    requestTaskData.ActionTakenBy = CurrentUserId;
                    requestTaskData.ActionTakenDate = DateTime.Now;
                    requestTaskData.ModifiedDate = DateTime.Now;
                    requestTaskData.Comments = comment;

                    _context.SaveChanges();
                    res.Message = Enums.TroubleReject;

                    var troubleData = _context.TroubleReports.Where(x => x.TroubleReportId == troubleReportId && x.IsDeleted == false).FirstOrDefault();
                    if (troubleData != null)
                    {
                        troubleData.Status = ApprovalTaskStatus.Rejected.ToString();
                        troubleData.ModifiedBy = CurrentUserId;
                        troubleData.IsActive = false;
                        await _context.SaveChangesAsync();
                    }

                    var troubleReisonData = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == troubleReportId && x.IsActive == true && x.IsClsoed == false).ToList();
                    if (troubleReisonData != null)
                    {
                        foreach (var trouble in troubleReisonData)
                        {
                            trouble.Status = ApprovalTaskStatus.Rejected.ToString();
                            trouble.IsClsoed = true;
                            trouble.ModifiedBy = CurrentUserId;
                            trouble.IsActive = false;
                            await _context.SaveChangesAsync();
                        }
                    }

                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendEmail(troubleReportId, EmailNotificationAction.Rejected, null, 0);

                    InsertHistoryData(requestTaskData.TroubleReportId, FormType.TroubleReport.ToString(), requestTaskData.Role, requestTaskData.Comments, requestTaskData.Status, Convert.ToInt32(requestTaskData.ModifiedBy), ApprovalTaskStatus.Rejected.ToString(), 0);

                }
                return res;
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "UpdateApproveAskToAmend");
                return res;
            }
        }
        #endregion

        #region Pullback
        public async Task<AjaxResult> PullbackRequest(int troubleReportId, int userId, string comment)
        {
            var res = new AjaxResult();
            //bool result = false;
            try
            {
                var trouble = _context.TroubleReports.Where(x => x.TroubleReportId == troubleReportId).FirstOrDefault();

                if (trouble != null)
                {
                    trouble.IsSubmit = false;
                    trouble.Status = ApprovalTaskStatus.InProcess.ToString();
                    trouble.ModifiedBy = userId;

                    await _context.SaveChangesAsync();
                    res.StatusCode = Status.Success;
                    res.Message = Enums.TroublePullBack;
                    //history 
                    InsertHistoryData(troubleReportId, FormType.TroubleReport.ToString(), Enums.WorkDoneLead, comment, ApprovalTaskStatus.PullBack.ToString(), userId, ApprovalTaskStatus.PullBack.ToString(), 0);
                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendEmail(troubleReportId, EmailNotificationAction.PullBack, null, 0);

                    //mail for pullback

                    var approverTaskDetails = _context.TroubleReportApproverTaskMasters.Where(x => x.TroubleReportId == troubleReportId).ToList();
                    approverTaskDetails.ForEach(a =>
                    {
                        a.IsActive = false;
                        a.ModifiedBy = userId;
                        a.ModifiedDate = DateTime.Now;
                    });
                    await _context.SaveChangesAsync();

                    var processTask = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == troubleReportId && x.IsActive == true && x.IsClsoed == false && x.DisplayName == Enums.WorkDoneLead).FirstOrDefault();
                    if (processTask != null)
                    {
                        processTask.Status = ApprovalTaskStatus.InProcess.ToString();
                        processTask.IsSubmit = true;
                    }
                    await _context.SaveChangesAsync();

                    var troubleTask = _context.TroubleReports.Where(x => x.TroubleReportId == troubleReportId && x.IsActive == true && x.IsDeleted == false).FirstOrDefault();
                    if (troubleTask != null)
                    {
                        troubleTask.Status = ApprovalTaskStatus.InProcess.ToString();
                        troubleTask.IsSubmit = false;
                    }
                    await _context.SaveChangesAsync();
                }
                return res;
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "PullbackRequest");
                return res;
            }
        }
        #endregion

        #region ReOpen the form
        public async Task<AjaxResult> ReOpenTroubleForm(int troubleReportId, int userId)
        {
            var res = new AjaxResult();
            try
            {

                var trouble = _context.TroubleReports.Where(x => x.TroubleReportId == troubleReportId).FirstOrDefault();
                if (trouble != null)
                {
                    trouble.IsReOpen = true;
                    var internalFlow = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == troubleReportId && x.IsActive == true && x.IsClsoed == false).ToList();
                    internalFlow.ForEach(a =>
                    {
                        a.IsClsoed = true;
                        a.ModifiedDate = DateTime.Now;
                    });
                    await _context.SaveChangesAsync();

                    var troubleRevise = new TroubleReports();
                    troubleRevise.TroubleReviseId = troubleReportId;
                    troubleRevise.IsReOpen = false;
                    troubleRevise.ReportTitle = trouble.ReportTitle;
                    troubleRevise.Status = ApprovalTaskStatus.Draft.ToString();
                    troubleRevise.CreatedDate = DateTime.Now;
                    troubleRevise.IsActive = true;
                    troubleRevise.IsDeleted = false;
                    troubleRevise.CreatedBy = userId;
                    troubleRevise.IsSubmit = false;
                    troubleRevise.IsReview = false;
                    troubleRevise.IsReOpen = false;
                    troubleRevise.RaiserEmailSent = 0;
                    troubleRevise.ManagerEmailSent = 0;
                    troubleRevise.DepartMentHeadEmailSent = 0;
                    _context.TroubleReports.Add(troubleRevise);
                    await _context.SaveChangesAsync();

                    var troubleNum = _context.TroubleReports.Where(x => x.TroubleReportId == troubleRevise.TroubleReportId && x.IsActive == true && x.TroubleReviseId == troubleRevise.TroubleReviseId).FirstOrDefault();
                    if (troubleNum != null)
                    {
                        var troubleReportIdParam = new Microsoft.Data.SqlClient.SqlParameter("@TroubleReportId", troubleRevise.TroubleReportId);
                        var troubleReportReviseIdParam = new Microsoft.Data.SqlClient.SqlParameter("@TroubleRevisionId", troubleRevise.TroubleReviseId);

                        var result = await _context.Set<TroubleReportNumberResult>()
                                          .FromSqlRaw("EXEC [dbo].[SPP_GenerateTroubleRevisionNumber] @TroubleReportId,@TroubleRevisionId", troubleReportIdParam, troubleReportReviseIdParam)
                                          .ToListAsync();
                        await _context.SaveChangesAsync();
                    }
                    res.StatusCode = Status.Success;
                    res.Message = Enums.TroubleReOpen;
                    res.ReturnValue = troubleRevise.TroubleReportId;
                    InsertHistoryData(troubleReportId, FormType.TroubleReport.ToString(), null, null, ApprovalTaskStatus.ReOpen.ToString(), userId, ApprovalTaskStatus.ReOpen.ToString(), 0);
                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendEmail(troubleReportId, EmailNotificationAction.Reopen, null, userId);
                }

            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "ReOpenTroubleForm");
                // return res;
            }
            return res;
        }
        #endregion

        #region Listing screen 
        public async Task<string> GetTroubleListingScreen(int createdOne, int pageIndex, int pageSize, string order, string orderBy, string searchColumn, string searchValue)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var command = new SqlCommand("GetTroubleReportsWithRevisions", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@CreatedOne", createdOne);
                command.Parameters.AddWithValue("@PageIndex", pageIndex);
                command.Parameters.AddWithValue("@PageSize", pageSize);
                command.Parameters.AddWithValue("@Order", order);
                command.Parameters.AddWithValue("@OrderBy", orderBy);
                command.Parameters.AddWithValue("@SearchColumn", searchColumn);
                command.Parameters.AddWithValue("@SearchValue", searchValue);

                await connection.OpenAsync();
                var jsonResult = await command.ExecuteScalarAsync();

                return jsonResult.ToString();

            }
        }

        public async Task<string> GetReviseDataListing(int troubleReportId)
        {

            using (var connection = new SqlConnection(_connectionString))
            {
                var command = new SqlCommand("ReviseListingData", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@TroubleReportId", troubleReportId);

                await connection.OpenAsync();
                var jsonResult = await command.ExecuteScalarAsync();

                return jsonResult.ToString();

            }
        }

        public async Task<string> GetReviewListingScreen(int createdOne, int pageIndex, int pageSize, string order, string orderBy, string searchColumn, string searchValue)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var command = new SqlCommand("GetReviewerTasks", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@EmployeeId", createdOne);
                command.Parameters.AddWithValue("@PageIndex", pageIndex);
                command.Parameters.AddWithValue("@PageSize", pageSize);
                command.Parameters.AddWithValue("@Order", order);
                command.Parameters.AddWithValue("@OrderBy", orderBy);
                command.Parameters.AddWithValue("@SearchColumn", searchColumn);
                command.Parameters.AddWithValue("@SearchValue", searchValue);

                await connection.OpenAsync();
                var jsonResult = await command.ExecuteScalarAsync();
                return jsonResult.ToString();
            }
        }

        public async Task<string> GetApproverListingScreen(int createdOne, int pageIndex, int pageSize, string order, string orderBy, string searchColumn, string searchValue)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var command = new SqlCommand("GetTroubleApproverTasks", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@EmployeeId", createdOne);
                command.Parameters.AddWithValue("@PageIndex", pageIndex);
                command.Parameters.AddWithValue("@PageSize", pageSize);
                command.Parameters.AddWithValue("@Order", order);
                command.Parameters.AddWithValue("@OrderBy", orderBy);
                command.Parameters.AddWithValue("@SearchColumn", searchColumn);
                command.Parameters.AddWithValue("@SearchValue", searchValue);

                await connection.OpenAsync();
                var jsonResult = await command.ExecuteScalarAsync();
                return jsonResult.ToString();
            }
        }
        #endregion

        #region ApproverDetails
        public async Task<List<TroubleReportApproverTaskMasterAdd>> GetTroubelReportApproverData(int troubelReportId)
        {
            var approverData = await _context.GetTroubleReportWorkFlowData(troubelReportId);
            // Process data to combine entries for SequenceNo = 3
            var processedData = new List<TroubleReportApproverTaskMasterAdd>();
            //var approverData = await _context.GetMaterialWorkFlowData(materialConsumptionId);
            //var processedData = new List<MaterialConsumptionApproverTaskMasterAdd>();
            foreach (var entry in approverData)
            {
                processedData.Add(entry);
            }
            return processedData;
          /*  foreach (var entry in approverData)
            {
                if (entry.SequenceNo == 3 && (entry.Status == ApprovalTaskStatus.Pending.ToString() || entry.Status == ApprovalTaskStatus.UnderApproval.ToString()))
                {
                    // Check if a placeholder entry for SequenceNo = 3 is already added
                    var existingEntry = processedData.FirstOrDefault(e => e.SequenceNo == 3);

                    if (existingEntry == null)
                    {
                        // Add a placeholder entry
                        processedData.Add(new TroubleReportApproverTaskMasterAdd
                        {
                            ApproverTaskId = 0,
                            FormType = entry.FormType,
                            TroubleReportId = entry.TroubleReportId,
                            AssignedToUserId = 0,
                            DelegateUserId = 0,
                            DelegateBy = 0,
                            DelegateOn = null,
                            Status = entry.Status, // or UnderApproval
                            Role = null,
                            DisplayName = null,
                            SequenceNo = 3,
                            Comments = null,
                            ActionTakenBy = null,
                            ActionTakenDate = null,
                            CreatedBy = entry.CreatedBy,
                            CreatedDate = entry.CreatedDate,
                            IsActive = true,
                            employeeName = null,
                            employeeNameWithoutCode = null,
                            email = null,
                            processName = entry.processName
                        });
                    }
                }
                else
                {
                    // Add entry as is
                    processedData.Add(entry);
                }
            }*/

           // return processedData;
        }
        //GetUserDetailsView
        public async Task<GetUserDetailsView> GetUserRole(string userEmail)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var parameters = new DynamicParameters();
                parameters.Add("@UserEmail", userEmail, DbType.String, ParameterDirection.Input, 150);

                var result = await connection.QueryFirstOrDefaultAsync<GetUserDetailsView>(
                    "dbo.SPP_GetUserDetails",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result;
            }
        }

        public ApproverTaskId_dto GetCurrentApproverTask(int troubleReportId, int userId)
        {
            var troubleApprovers = _context.TroubleReportApproverTaskMasters.FirstOrDefault(x => x.TroubleReportId == troubleReportId && x.AssignedToUserId == userId && x.Status == ApprovalTaskStatus.UnderApproval.ToString() && x.IsActive == true);
            var data = new ApproverTaskId_dto();
            if (troubleApprovers != null)
            {
                data.approverTaskId = troubleApprovers.ApproverTaskId;
                data.userId = troubleApprovers.AssignedToUserId ?? 0;
                data.status = troubleApprovers.Status;
                data.seqNumber = troubleApprovers.SequenceNo;

            }
            return data;
        }
        #endregion

        #region InternalFlowData
        public TroubleReportInternalFlowView GetCurrentTask(int troubleReportId, int userId)
        {
            var troubleInternalFlowData = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == troubleReportId && x.IsActive == true && x.ReviewerId == userId).OrderByDescending(x => x.CreatedDate).FirstOrDefault();
            var data = new TroubleReportInternalFlowView();

            if (troubleInternalFlowData != null)
            {
                data.reviewerTaskMasterId = troubleInternalFlowData.ReviewerTaskMasterId;
                data.troubleReportId = troubleInternalFlowData.TroubleReportId;
                data.reviewerId = troubleInternalFlowData.ReviewerId;
                data.displayName = troubleInternalFlowData.DisplayName;
                data.processName = troubleInternalFlowData.ProcessName;
                data.comment = troubleInternalFlowData.Comment;
                data.status = troubleInternalFlowData.Status;
                data.isSubmit = troubleInternalFlowData.IsSubmit;

                var trouble = _context.TroubleReports.Where(x => x.TroubleReportId == troubleReportId && x.IsDeleted == false && x.Status == ApprovalTaskStatus.UnderReview.ToString() && x.IsReview == true).FirstOrDefault();
                if (trouble != null)
                {
                    data.isReviewed = true;
                }
                else
                {
                    data.isReviewed = false;
                }

                bool isAnySaved = _context.WorkDoneDetails.Where(w => w.TroubleReportId == troubleReportId && w.IsSaved == true).Any();

                if (isAnySaved)
                {
                    data.isSaved = true;
                }
                else
                {
                    data.isSaved = false;
                }

            }
            return data;
        }

        public List<TroubleReportInternalFlowView> GetTroubleInernalFlow(int troubleReportId)
        {
            var troubleInernalFlowData = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == troubleReportId && x.IsActive == true).ToList();

            return troubleInernalFlowData.Select(x => new TroubleReportInternalFlowView()
            {
                reviewerTaskMasterId = x.ReviewerTaskMasterId,
                troubleReportId = x.TroubleReportId,
                reviewerId = x.ReviewerId,
                displayName = x.DisplayName,
                processName = x.ProcessName,
                comment = x.Comment,
                status = x.Status
            }).ToList();
        }

        #endregion

        #region HistoryData 

        public void InsertHistoryData(int formId, string formtype, string role, string comment, string status, int actionByUserID, string actionType, int delegateUserId)
        {
            var res = new AjaxResult();
            var troubleReportHistoryData = new TroubleReportHistoryMaster()
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
            _context.TroubleReportHistoryMasters.Add(troubleReportHistoryData);
            _context.SaveChanges();
        }

        public List<TroubleReportHistoryView> GetHistoryData(int troubleReportId)
        {
            var troubleHistorydata = _context.TroubleReportHistoryMasters.Where(x => x.FormID == troubleReportId && x.IsActive == true).ToList();

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

        #region Excel Data 

        public async Task<AjaxResult> GetTroubleReportExcel(DateTime fromDate, DateTime toDate, int employeeId, int type)
        {
            var res = new AjaxResult();

            try
            {
                var excelData = await _context.GetTroubleReportExcel(fromDate, toDate, employeeId, type);

                // Assume excelData is a list of objects retrieved from the stored procedure
                using (var workbook = new XLWorkbook())
                {
                    var worksheet = workbook.Worksheets.Add("Trouble Reports");

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
                commonHelper.LogException(ex, "GetTroubleReportExcel");
                return res;
            }
        }

        private static readonly Dictionary<string, string> ColumnHeaderMapping = new Dictionary<string, string>
{
    { "DateofReportGeneration", "Date of Report Generation" },
    { "DateofCompletion", "Date of Completion" },
            {"TroubleReportNo", "Trouble report No" },
            { "WorkDoneBy" ,"Work Done By"},
            {"SectionHead" ,"Section Head" },
            {"ReportTitle" ,"Report Title" }
};

        private string CapitalizeFirstLetter(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            return char.ToUpper(input[0]) + input.Substring(1);
        }

        #endregion
    }
}
