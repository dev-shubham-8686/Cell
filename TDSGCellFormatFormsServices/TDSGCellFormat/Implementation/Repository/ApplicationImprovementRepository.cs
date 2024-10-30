using TDSGCellFormat.Interface.Repository;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Common;
using TDSGCellFormat.Helper;
using Microsoft.EntityFrameworkCore;
using TDSGCellFormat.Models.View;
using System.Data;
using iTextSharp.text;
using iTextSharp.text.pdf;
using iTextSharp.tool.xml;
using ClosedXML.Excel;
using Microsoft.Graph.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using PnP.Framework.Extensions;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.ApplicationInsights.Extensibility.Implementation;


namespace TDSGCellFormat.Implementation.Repository
{
    public class ApplicationImprovementRepository : BaseRepository<EquipmentImprovementApplication>, IApplicationImprovementRepository
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly TdsgCellFormatDivisionContext _context;
        private readonly AepplNewCloneStageContext _cloneContext;

        public ApplicationImprovementRepository(TdsgCellFormatDivisionContext context, AepplNewCloneStageContext cloneContext, IConfiguration configuration)
            : base(context)
        {
            this._context = context;
            this._cloneContext = cloneContext;

            _connectionString = configuration.GetConnectionString("DefaultConnection");
            var basePath = Path.Combine(Directory.GetCurrentDirectory());
            var configurationBuilder = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
            _configuration = configurationBuilder.Build();
        }

        public IQueryable<EquipmentImprovementApplicationAdd> GetAll()
        {
            IQueryable<EquipmentImprovementApplicationAdd> res = _context.EquipmentImprovementApplication
                                 .Where(n => n.IsDeleted == false)  // Filter out deleted records
                                 .Select(n => new EquipmentImprovementApplicationAdd
                                 {
                                     EquipmentImprovementId = n.EquipmentImprovementId,
                                     When = n.When.HasValue ? n.When.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                                     //deviceName = !string.IsNullOrEmpty(n.DeviceName) ? n.DeviceName.Split(',').Select(s => int.Parse(s.Trim())).ToList() : new List<int>(),
                                     Purpose = n.Purpose,
                                     CurrentSituation = n.CurrentSituation,
                                     Improvement = n.Imrovement,
                                     Status = n.Status,
                                     CreatedDate = n.CreatedDate,
                                     CreatedBy = n.CreatedBy
                                     // Add other properties as needed
                                 });

            return res;
        }

        #region CRUD 
        public EquipmentImprovementApplicationAdd GetById(int Id)
        {
            var res = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == Id && x.IsDeleted == false).FirstOrDefault();

            if (res == null)
            {
                return null;// set message like that
            }

            EquipmentImprovementApplicationAdd applicationData = new EquipmentImprovementApplicationAdd()
            {
                EquipmentImprovementId = res.EquipmentImprovementId,
                EquipmentImprovementNo = res.EquipmentImprovementNo,
                When = res.When.HasValue ? res.When.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                AreaId = res.AreaId,
                MachineName = res.MachineId,
                SubMachineName = !string.IsNullOrEmpty(res.SubMachineId) ? res.SubMachineId.Split(',').Select(s => int.Parse(s.Trim())).ToList() : new List<int>(),
                Purpose = res.Purpose,
                SectionId = res.SectionId,
                SectionHeadId = res.SectionHeadId,
                ImprovementName = res.ImprovementName,
                CurrentSituation = res.CurrentSituation,
                Improvement = res.Imrovement,
                // TargetDate = res.TargetDate.HasValue ? res.TargetDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                // ActualDate = res.ActualDate.HasValue ? res.ActualDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                // ResultStatus = res.ResultStatus,
                // PcrnDocName = res.PCRNDocName,
                // PcrnFilePath = res.PCRNDocFilePath,
                AdvisorId = _context.EquipmentAdvisorMasters.Where(x => x.EquipmentImprovementId == Id && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault(),
                Status = res.Status,
                CreatedDate = res.CreatedDate,
                CreatedBy = res.CreatedBy,
                IsSubmit = res.IsSubmit,
                ToshibaApprovalRequired = res.ToshibaApprovalRequired,
                ToshibaApprovalTargetDate = res.ToshibaApprovalTargetDate.HasValue ? res.ToshibaApprovalTargetDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                ToshibaTeamDiscussion = res.ToshibaTeamDiscussion,
                ToshibaDiscussionTargetDate = res.ToshibaDiscussionTargetDate.HasValue ? res.ToshibaDiscussionTargetDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                IsPcrnRequired = res.IsPcrnRequired
                // Add other properties as needed
            };

            var changeRiskManagement = _context.ChangeRiskManagement.Where(x => x.EquipmentImprovementId == Id && x.IsDeleted == false).ToList();
            if (changeRiskManagement != null)
            {
                applicationData.ChangeRiskManagementDetails = changeRiskManagement.Select(section => new ChangeRiskManagementData
                {
                    ChangeRiskManagementId = section.ChangeRiskManagementId,
                    Changes = section.Changes,
                    FunctionId = section.FunctionId,
                    RiskAssociated = section.RiskAssociatedWithChanges,
                    Factor = section.Factor,
                    CounterMeasures = section.CounterMeasures,
                    DueDate = section.DueDate.HasValue ? section.DueDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                    PersonInCharge = section.PersonInCharge,
                    Results = section.Results

                }).ToList();
            }

            var equipmentCurrAttach = _context.EquipmentCurrSituationAttachment.Where(x => x.EquipmentImprovementId == Id && x.IsDeleted == false).ToList();
            if (equipmentCurrAttach != null)
            {
                applicationData.EquipmentCurrSituationAttachmentDetails = equipmentCurrAttach.Select(attach => new EquipmentCurrSituationAttachData
                {
                    EquipmentCurrSituationAttachmentId = attach.EquipmentCurrentSituationAttachmentId,
                    CurrSituationDocFilePath = attach.CurrSituationDocFilePath,
                    CurrSituationDocName = attach.CurrSituationDocName
                }).ToList();
            }

            var equipmentImprovementAttach = _context.EquipmentImprovementAttachment.Where(x => x.EquipmentImprovementId == Id && x.IsDeleted == false).ToList();
            if (equipmentImprovementAttach != null)
            {
                applicationData.EquipmentImprovementAttachmentDetails = equipmentImprovementAttach.Select(attach => new EquipmentImprovementAttachData
                {
                    EquipmentImprovementAttachmentId = attach.EquipmentImprovementAttachmentId,
                    ImprovementDocName = attach.ImprovementDocName,
                    ImprovementDocFilePath = attach.ImprovementDocFilePath
                }).ToList();
            }

            var pcrnAttachment = _context.EquipmentPCRNAttachments.Where(x => x.EquipmentImprovementId == Id && x.IsDeleted == false).FirstOrDefault();
            if (pcrnAttachment != null)
            {
                applicationData.PcrnAttachments = new PcrnAttachment
                {
                    PcrnAttachmentId = pcrnAttachment.PCRNId,
                    EquipmentImprovementId = pcrnAttachment.EquipmentImprovementId,
                    PcrnDocName = pcrnAttachment.PCRNDocFileName,
                    PcrnFilePath = pcrnAttachment.PCRNDocFileName,
                    IsDeleted = pcrnAttachment.IsDeleted
                };
            }

            applicationData.ResultAfterImplementation = new ResultAfterImplementation
            {
                TargetDate = res.TargetDate.HasValue ? res.TargetDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                ActualDate = res.ActualDate.HasValue ? res.ActualDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                ResultStatus = res.ResultStatus,
                IsResultSubmit = res.IsResultSubmit,
                ResultMonitoringDate = res.ResultMonitorDate.HasValue ? res.ResultMonitorDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
            };


            return applicationData;
        }

        public async Task<AjaxResult> AddOrUpdateReport(EquipmentImprovementApplicationAdd report)
        {
            var res = new AjaxResult();
            try
            {
                var existingReport = await _context.EquipmentImprovementApplication.FindAsync(report.EquipmentImprovementId);
                int applicationImprovementId = 0;
                if (existingReport == null)
                {
                    var newReport = new EquipmentImprovementApplication();

                    newReport.When = DateTime.Now;
                    newReport.MachineId = report.MachineName;
                    newReport.SubMachineId = report.SubMachineName != null ? string.Join(",", report.SubMachineName) : string.Empty;
                    newReport.SectionId = report.SectionId;
                    newReport.SectionHeadId = report.SectionHeadId;
                    newReport.AreaId = report.AreaId;
                    newReport.ImprovementName = report.ImprovementName;
                    newReport.Purpose = report.Purpose;
                    newReport.CurrentSituation = report.CurrentSituation;
                    newReport.Imrovement = report.Improvement;
                    // newReport.PCRNDocName = report.PcrnDocName;
                    // newReport.PCRNDocFilePath = report.PcrnFilePath;
                    //newReport.ResultStatus = report.ResultStatus;
                    // newReport.ActualDate = !string.IsNullOrEmpty(report.ActualDate) ? DateTime.Parse(report.ActualDate) : (DateTime?)null;
                    // newReport.TargetDate = !string.IsNullOrEmpty(report.TargetDate) ? DateTime.Parse(report.TargetDate) : (DateTime?)null;
                    newReport.IsDeleted = false;
                    newReport.CreatedDate = DateTime.Now;
                    newReport.CreatedBy = report.CreatedBy;
                    newReport.ModifiedDate = DateTime.Now;
                    newReport.ModifiedBy = report.CreatedBy;
                    newReport.IsSubmit = report.IsSubmit;
                    newReport.IsResultSubmit = false;
                    newReport.IsSubmit = report.IsSubmit;
                    newReport.Status = ApprovalTaskStatus.Draft.ToString();
                    newReport.WorkFlowLevel = 0;
                    newReport.ToshibaApprovalRequired = false;
                    newReport.WorkFlowStatus = ApprovalTaskStatus.Draft.ToString();
                    _context.EquipmentImprovementApplication.Add(newReport);
                    await _context.SaveChangesAsync();

                    applicationImprovementId = newReport.EquipmentImprovementId;

                    var applicationEqipMentParams = new Microsoft.Data.SqlClient.SqlParameter("@EquipmentImprovementId", applicationImprovementId);
                    await _context.Set<TroubleReportNumberResult>()
                                .FromSqlRaw("EXEC [dbo].[SPP_GenerateEquipmentImprovementNumber] @EquipmentImprovementId", applicationEqipMentParams)
                                .ToListAsync();

                    var equipmentNo = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == newReport.EquipmentImprovementId && x.IsDeleted == false).Select(x => x.EquipmentImprovementNo).FirstOrDefault();

                    if (report.ChangeRiskManagementDetails != null)
                    {
                        foreach (var changeReport in report.ChangeRiskManagementDetails)
                        {
                            var changeRiskData = new ChangeRiskManagement()
                            {
                                EquipmentImprovementId = newReport.EquipmentImprovementId,
                                Changes = changeReport.Changes,
                                FunctionId = changeReport.FunctionId,
                                RiskAssociatedWithChanges = changeReport.RiskAssociated,
                                Factor = changeReport.Factor,
                                CounterMeasures = changeReport.CounterMeasures,
                                DueDate = !string.IsNullOrEmpty(changeReport.DueDate) ? DateTime.Parse(changeReport.DueDate) : (DateTime?)null,
                                PersonInCharge = changeReport.PersonInCharge,
                                Results = changeReport.Results,
                                CreatedBy = changeReport.CreatedBy,
                                CreatedDate = DateTime.Now,
                                IsDeleted = false,
                            };
                            _context.ChangeRiskManagement.Add(changeRiskData);
                        }
                        await _context.SaveChangesAsync();
                    }

                    if (report.EquipmentCurrSituationAttachmentDetails != null)
                    {
                        foreach (var attach in report.EquipmentCurrSituationAttachmentDetails)
                        {
                            var updatedUrl = attach.CurrSituationDocFilePath.Replace("/EQReportDocs/", $"/{equipmentNo}/");
                            ///EqReportDocuments/EQReportDocs/Current Situation Attachments/MaterialConsumption_2024-10-09.xlsx
                            var attachment = new EquipmentCurrSituationAttachment()
                            {

                                EquipmentImprovementId = newReport.EquipmentImprovementId,
                                CurrSituationDocName = attach.CurrSituationDocName,
                                CurrSituationDocFilePath = updatedUrl,
                                IsDeleted = false,
                                CreatedBy = attach.CreatedBy,
                                CreatedDate = DateTime.Now,
                            };
                            _context.EquipmentCurrSituationAttachment.Add(attachment);
                        }
                        await _context.SaveChangesAsync();
                    }

                    if (report.EquipmentImprovementAttachmentDetails != null)
                    {
                        foreach (var attach in report.EquipmentImprovementAttachmentDetails)
                        {
                            var updatedUrl = attach.ImprovementDocFilePath.Replace("/EQReportDocs/", $"/{equipmentNo}/");
                            var attachment = new EquipmentImprovementAttachment()
                            {
                                EquipmentImprovementId = newReport.EquipmentImprovementId,
                                ImprovementDocFilePath = updatedUrl,
                                ImprovementDocName = attach.ImprovementDocName,
                                IsDeleted = false,
                                CreatedBy = attach.CreatedBy,
                                CreatedDate = DateTime.Now,
                            };
                            _context.EquipmentImprovementAttachment.Add(attachment);
                        }
                        await _context.SaveChangesAsync();
                    }

                    res.ReturnValue = new
                    {
                        EquipmentImprovementId = applicationImprovementId,
                        EquipmentImprovementNo = equipmentNo
                    };


                    res.StatusCode = Enums.Status.Success;
                    res.Message = Enums.EquipmentSave;

                    if (report.IsSubmit == true && report.IsAmendReSubmitTask == false)
                    {
                        var data = await SubmitRequest(existingReport.EquipmentImprovementId, report.CreatedBy);
                        if (data.StatusCode == Enums.Status.Success)
                        {
                            res.Message = Enums.EquipmentSubmit;
                        }

                    }
                    else if (report.IsSubmit == true && report.IsAmendReSubmitTask == true)
                    {
                        var data = await Resubmit(existingReport.EquipmentImprovementId, report.CreatedBy);
                        if (data.StatusCode == Enums.Status.Success)
                        {
                            res.Message = Enums.EquipmentResubmit;
                        }

                    }
                    else
                    {
                        InsertHistoryData(applicationImprovementId, FormType.EquipmentImprovement.ToString(), "Requestor", "Update Status as Draft", ApprovalTaskStatus.Draft.ToString(), Convert.ToInt32(report.CreatedBy), HistoryAction.Save.ToString(), 0);
                    }
                }
                else
                {
                    if (report.ResultAfterImplementation == null)
                    {
                        var formData = await Editformdata(report);
                        if (formData.StatusCode == Enums.Status.Success)
                        {
                            res.Message = Enums.EquipmentSubmit;
                        }
                    }
                    if (report.ResultAfterImplementation != null)
                    {
                        if (report.ModifiedBy == _context.AdminApprovers.Where(x => x.IsActive == true).Select(x => x.AdminId).FirstOrDefault())
                        {
                            var formData = await Editformdata(report);
                            if (formData.StatusCode == Enums.Status.Success)
                            {
                                res.Message = Enums.EquipmentSubmit;
                            }
                            var nextData = await EditResult(report);
                            if (nextData.StatusCode == Enums.Status.Success)
                            {
                                res.Message = Enums.EquipmentSubmit;
                            }
                        }
                        else
                        {
                            var nextData = await EditResult(report);
                            if (nextData.StatusCode == Enums.Status.Success)
                            {
                                res.Message = Enums.EquipmentSubmit;
                            }
                        }
                    }

                }
                //res.ReturnValue = report;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Application Equipment Submit");
                return res;
            }
        }


        public async Task<AjaxResult> SubmitRequest(int equipmentId, int? createdBy)
        {
            var res = new AjaxResult();
            try
            {
                var equipment = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == equipmentId && x.IsDeleted == false).FirstOrDefault();
                if (equipment != null)
                {
                    equipment.Status = ApprovalTaskStatus.InReview.ToString();
                    equipment.WorkFlowStatus = ApprovalTaskStatus.InReview.ToString();
                    equipment.WorkFlowLevel = 1;
                    equipment.IsSubmit = true;
                    await _context.SaveChangesAsync();
                }
                InsertHistoryData(equipmentId, FormType.EquipmentImprovement.ToString(), "Requestor", "Submit the Form", ApprovalTaskStatus.InReview.ToString(), Convert.ToInt32(createdBy), HistoryAction.Submit.ToString(), 0);


                _context.CallEquipmentApproverMaterix(createdBy, equipmentId);

                //var notificationHelper = new NotificationHelper(_context, _cloneContext);
                //await notificationHelper.SendMaterialConsumptionEmail(materialConsumptionId, EmailNotificationAction.Submitted, string.Empty, 0);
                res.Message = Enums.EquipmentSubmit;
                res.StatusCode = Enums.Status.Success;

            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Material SubmitRequest");
                //return res;
            }
            return res;
        }

        public async Task<AjaxResult> Resubmit(int equipmentId, int? createdBy)
        {
            var res = new AjaxResult();
            try
            {
                var equipmentApproverTask = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == equipmentId && x.IsActive == true && x.Status == ApprovalTaskStatus.UnderAmendment.ToString()).FirstOrDefault();
                // equipmentApproverTask.Status = ApprovalTaskStatus.InReview.ToString();
                // await _context.SaveChangesAsync();

                var equipment = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == equipmentId && x.IsDeleted == false).FirstOrDefault();
                if (equipmentApproverTask.SequenceNo == 5 && equipment.ToshibaApprovalRequired == true)
                {
                    equipmentApproverTask.Status = ApprovalTaskStatus.UnderToshibaApproval.ToString();
                    equipment.Status = ApprovalTaskStatus.UnderToshibaApproval.ToString();
                    await _context.SaveChangesAsync();
                    InsertHistoryData(equipmentId, FormType.EquipmentImprovement.ToString(), "Requestor", "ReSubmit the Form", ApprovalTaskStatus.UnderToshibaApproval.ToString(), Convert.ToInt32(createdBy), HistoryAction.ReSubmitted.ToString(), 0);
                }
                else
                {
                    equipmentApproverTask.Status = ApprovalTaskStatus.InReview.ToString();
                    equipment.Status = ApprovalTaskStatus.InReview.ToString();
                    await _context.SaveChangesAsync();
                    InsertHistoryData(equipmentId, FormType.EquipmentImprovement.ToString(), "Requestor", "ReSubmit the Form", ApprovalTaskStatus.InReview.ToString(), Convert.ToInt32(createdBy), HistoryAction.ReSubmitted.ToString(), 0);
                }



                // equipment.Status = ApprovalTaskStatus.InReview.ToString();
                // await _context.SaveChangesAsync();

                res.Message = Enums.EquipmentResubmit;
                res.StatusCode = Enums.Status.Success;
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Application Equipment Resubmit");
                //return res;
            }
            return res;
        }

        public async Task<AjaxResult> Editformdata(EquipmentImprovementApplicationAdd report)
        {
            var res = new AjaxResult();
            try
            {
                var existingReport = await _context.EquipmentImprovementApplication.FindAsync(report.EquipmentImprovementId);
                existingReport.MachineId = report.MachineName;
                existingReport.SubMachineId = report.SubMachineName != null ? string.Join(",", report.SubMachineName) : string.Empty;
                existingReport.SectionId = report.SectionId;
                existingReport.SectionHeadId = report.SectionHeadId;
                existingReport.AreaId = report.AreaId;
                existingReport.ImprovementName = report.ImprovementName;
                existingReport.Purpose = report.Purpose;
                existingReport.CurrentSituation = report.CurrentSituation;
                existingReport.Imrovement = report.Improvement;
                ///existingReport.PCRNDocName = report.PcrnDocName;
                // existingReport.PCRNDocFilePath = report.PcrnFilePath;
                // existingReport.ResultStatus = report.ResultStatus;
                //existingReport.ActualDate = !string.IsNullOrEmpty(report.ActualDate) ? DateTime.Parse(report.ActualDate) : (DateTime?)null;
                //existingReport.TargetDate = !string.IsNullOrEmpty(report.TargetDate) ? DateTime.Parse(report.TargetDate) : (DateTime?)null;
                existingReport.ModifiedDate = DateTime.Now;
                existingReport.ModifiedBy = report.ModifiedBy;
                await _context.SaveChangesAsync();

                var existingChangeRisk = _context.ChangeRiskManagement.Where(x => x.EquipmentImprovementId == existingReport.EquipmentImprovementId).ToList();
                MarkAsDeleted(existingChangeRisk, existingReport.CreatedBy, DateTime.Now);
                _context.SaveChanges();

                if (report.ChangeRiskManagementDetails != null)
                {
                    foreach (var changeReport in report.ChangeRiskManagementDetails)
                    {
                        var existingChangeRiskData = _context.ChangeRiskManagement.Where(x => x.EquipmentImprovementId == changeReport.ApplicationImprovementId && x.ChangeRiskManagementId == changeReport.ChangeRiskManagementId).FirstOrDefault();
                        if (existingChangeRiskData != null)
                        {
                            existingChangeRiskData.Changes = changeReport.Changes;
                            existingChangeRiskData.FunctionId = changeReport.FunctionId;
                            existingChangeRiskData.RiskAssociatedWithChanges = changeReport.RiskAssociated;
                            existingChangeRiskData.Factor = changeReport.Factor;
                            existingChangeRiskData.CounterMeasures = changeReport.CounterMeasures;
                            existingChangeRiskData.DueDate = !string.IsNullOrEmpty(changeReport.DueDate) ? DateTime.Parse(changeReport.DueDate) : (DateTime?)null;
                            existingChangeRiskData.PersonInCharge = changeReport.PersonInCharge;
                            existingChangeRiskData.Results = changeReport.Results;
                            existingChangeRiskData.ModifiedBy = changeReport.ModifiedBy;
                            existingChangeRiskData.ModifiedDate = DateTime.Now;
                            existingChangeRiskData.IsDeleted = false;
                        }
                        else
                        {
                            var changeRiskData = new ChangeRiskManagement()
                            {
                                EquipmentImprovementId = existingReport.EquipmentImprovementId,
                                Changes = changeReport.Changes,
                                FunctionId = changeReport.FunctionId,
                                RiskAssociatedWithChanges = changeReport.RiskAssociated,
                                Factor = changeReport.Factor,
                                CounterMeasures = changeReport.CounterMeasures,
                                DueDate = !string.IsNullOrEmpty(changeReport.DueDate) ? DateTime.Parse(changeReport.DueDate) : (DateTime?)null,
                                PersonInCharge = changeReport.PersonInCharge,
                                Results = changeReport.Results,
                                CreatedBy = changeReport.CreatedBy,
                                CreatedDate = DateTime.Now,
                                IsDeleted = false,
                            };
                            _context.ChangeRiskManagement.Add(changeRiskData);
                        }
                        await _context.SaveChangesAsync();
                    }
                }

                var existingCurrSituationAttachment = _context.EquipmentCurrSituationAttachment.Where(x => x.EquipmentImprovementId == existingReport.EquipmentImprovementId).ToList();
                MarkAsDeleted(existingCurrSituationAttachment, existingReport.CreatedBy, DateTime.Now);
                _context.SaveChanges();

                if (report.EquipmentCurrSituationAttachmentDetails != null)
                {
                    foreach (var attach in report.EquipmentCurrSituationAttachmentDetails)
                    {
                        var updatedUrl = attach.CurrSituationDocFilePath.Replace("/EQReportDocs/", $"/{existingReport.EquipmentImprovementNo}/");
                        var existingAttachData = _context.EquipmentCurrSituationAttachment.Where(x => x.EquipmentImprovementId == attach.EquipmentImprovementId && x.EquipmentCurrentSituationAttachmentId == attach.EquipmentCurrSituationAttachmentId).FirstOrDefault();
                        if (existingAttachData != null)
                        {
                            existingAttachData.CurrSituationDocName = attach.CurrSituationDocName;
                            existingAttachData.CurrSituationDocFilePath = updatedUrl;
                            existingAttachData.IsDeleted = false;
                            existingAttachData.ModifiedBy = attach.ModifiedBy;
                            existingAttachData.ModifiedDate = DateTime.Now;
                        }
                        else
                        {

                            var attachment = new EquipmentCurrSituationAttachment()
                            {
                                EquipmentImprovementId = existingReport.EquipmentImprovementId,
                                CurrSituationDocName = attach.CurrSituationDocName,
                                CurrSituationDocFilePath = updatedUrl,
                                IsDeleted = false,
                                CreatedBy = attach.CreatedBy,
                                CreatedDate = DateTime.Now,
                            };
                            _context.EquipmentCurrSituationAttachment.Add(attachment);
                        }
                        await _context.SaveChangesAsync();
                    }
                }

                var existingImprovementAttachment = _context.EquipmentImprovementAttachment.Where(x => x.EquipmentImprovementId == existingReport.EquipmentImprovementId).ToList();
                MarkAsDeleted(existingImprovementAttachment, existingReport.CreatedBy, DateTime.Now);
                _context.SaveChanges();

                if (report.EquipmentImprovementAttachmentDetails != null)
                {
                    foreach (var attach in report.EquipmentImprovementAttachmentDetails)
                    {
                        var updatedUrl = attach.ImprovementDocFilePath.Replace("/EQReportDocs/", $"/{existingReport.EquipmentImprovementNo}/");
                        var existingAttachData = _context.EquipmentImprovementAttachment.Where(x => x.EquipmentImprovementId == attach.EquipmentImprovementId && x.EquipmentImprovementAttachmentId == attach.EquipmentImprovementAttachmentId).FirstOrDefault();
                        if (existingAttachData != null)
                        {
                            existingAttachData.ImprovementDocName = attach.ImprovementDocName;
                            existingAttachData.ImprovementDocFilePath = updatedUrl;
                            existingAttachData.IsDeleted = false;
                            existingAttachData.ModifiedBy = attach.ModifiedBy;
                            existingAttachData.ModifiedDate = DateTime.Now;
                        }
                        else
                        {
                            var attachment = new EquipmentImprovementAttachment()
                            {
                                EquipmentImprovementId = existingReport.EquipmentImprovementId,
                                ImprovementDocName = attach.ImprovementDocName,
                                ImprovementDocFilePath = updatedUrl,
                                IsDeleted = false,
                                CreatedBy = attach.CreatedBy,
                                CreatedDate = DateTime.Now,
                            };
                            _context.EquipmentImprovementAttachment.Add(attachment);
                        }
                        await _context.SaveChangesAsync();
                    }
                }

                var existingPCRN = _context.EquipmentPCRNAttachments.Where(x => x.EquipmentImprovementId == existingReport.EquipmentImprovementId).ToList();
                MarkAsDeleted(existingPCRN, existingReport.CreatedBy, DateTime.Now);
                _context.SaveChanges();

                if (report.PcrnAttachments != null)
                {
                    var pcrndata = report.PcrnAttachments;
                    var existingPcrn = _context.EquipmentPCRNAttachments.Where(x => x.PCRNId == pcrndata.PcrnAttachmentId && x.IsDeleted == false && x.EquipmentImprovementId == existingReport.EquipmentImprovementId).FirstOrDefault();
                    if (existingPcrn != null)
                    {
                        existingPcrn.PCRNDocFileName = pcrndata.PcrnDocName;
                        existingPcrn.PCRNDocFilePath = pcrndata.PcrnFilePath;
                        existingPcrn.ModifiedDate = DateTime.Now;
                        existingPcrn.ModifiedBy = report.ModifiedBy;
                        existingPcrn.IsDeleted = pcrndata.IsDeleted;

                        if (report.IsSubmit == false)
                        {
                            existingReport.Status = ApprovalTaskStatus.PCRNPending.ToString();

                        }
                        else
                        {
                            existingReport.Status = ApprovalTaskStatus.UnderToshibaApproval.ToString();
                            existingReport.IsSubmit = true;
                        }
                        await _context.SaveChangesAsync();

                        var qcTeamData = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == existingReport.EquipmentImprovementId && x.IsActive == true && x.SequenceNo == 5 && x.WorkFlowlevel == 1).FirstOrDefault();
                        qcTeamData.Status = ApprovalTaskStatus.UnderToshibaApproval.ToString();
                        await _context.SaveChangesAsync();
                    }
                    else
                    {
                        var pcrn = new EquipmentPCRNAttachment();
                        pcrn.EquipmentImprovementId = existingReport.EquipmentImprovementId;
                        pcrn.PCRNDocFileName = pcrndata.PcrnDocName;
                        pcrn.PCRNDocFilePath = pcrndata.PcrnFilePath;
                        pcrn.ModifiedDate = DateTime.Now;
                        pcrn.ModifiedBy = report.ModifiedBy;
                        pcrn.CreatedDate = DateTime.Now;
                        pcrn.CreatedBy = report.ModifiedBy;
                        pcrn.IsDeleted = false;

                        if (report.IsSubmit == false)
                        {
                            existingReport.Status = ApprovalTaskStatus.PCRNPending.ToString();
                        }
                        else
                        {
                            existingReport.Status = ApprovalTaskStatus.UnderToshibaApproval.ToString();
                            existingReport.IsSubmit = true;
                        }
                        _context.EquipmentPCRNAttachments.Add(pcrn);
                        await _context.SaveChangesAsync();

                        var qcTeamData = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == existingReport.EquipmentImprovementId && x.IsActive == true && x.SequenceNo == 5 && x.WorkFlowlevel == 1).FirstOrDefault();
                        qcTeamData.Status = ApprovalTaskStatus.UnderToshibaApproval.ToString();
                        await _context.SaveChangesAsync();
                    }

                }

                res.ReturnValue = new
                {
                    EquipmentImprovementId = existingReport.EquipmentImprovementId,
                    EquipmentImprovementNo = existingReport.EquipmentImprovementNo
                };
                res.StatusCode = Enums.Status.Success;
                res.Message = Enums.EquipmentSave;


                if (report.IsSubmit == true && report.IsAmendReSubmitTask == false && report.PcrnAttachments == null)
                {
                    var data = await SubmitRequest(existingReport.EquipmentImprovementId, report.CreatedBy);
                    if (data.StatusCode == Enums.Status.Success)
                    {
                        res.Message = Enums.EquipmentSubmit;
                    }

                }
                else if (report.IsSubmit == true && report.IsAmendReSubmitTask == true && report.PcrnAttachments == null)
                {
                    var data = await Resubmit(existingReport.EquipmentImprovementId, report.CreatedBy);
                    if (data.StatusCode == Enums.Status.Success)
                    {
                        res.Message = Enums.EquipmentResubmit;
                    }

                }
                else
                {
                    InsertHistoryData(existingReport.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Requestor", "Update Status as Draft", ApprovalTaskStatus.Draft.ToString(), Convert.ToInt32(report.CreatedBy), HistoryAction.Save.ToString(), 0);

                }
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Material Editformdata");
                //return res;
            }
            return res;
        }

        public async Task<AjaxResult> EditResult(EquipmentImprovementApplicationAdd report)
        {
            var res = new AjaxResult();
            try
            {
                var existingReport = await _context.EquipmentImprovementApplication.FindAsync(report.EquipmentImprovementId);
                var data = report.ResultAfterImplementation;
                existingReport.ResultStatus = data.ResultStatus;
                existingReport.ActualDate = !string.IsNullOrEmpty(data.ActualDate) ? DateTime.Parse(data.ActualDate) : (DateTime?)null;
                existingReport.TargetDate = !string.IsNullOrEmpty(data.TargetDate) ? DateTime.Parse(data.TargetDate) : (DateTime?)null;
                existingReport.IsResultSubmit = data.IsResultSubmit;
                existingReport.ResultMonitorDate = !string.IsNullOrEmpty(data.ResultMonitoringDate) ? DateTime.Parse(data.ResultMonitoringDate) : (DateTime?)null;
                if (data.TargetDate != null && data.ActualDate == null)
                {
                    existingReport.Status = ApprovalTaskStatus.UnderImplementation.ToString();
                }
                if (data.TargetDate != null && data.ActualDate != null)
                {
                    existingReport.Status = ApprovalTaskStatus.ResultMonitoring.ToString();
                }

                await _context.SaveChangesAsync();
                res.StatusCode = Enums.Status.Success;
                res.Message = Enums.EquipmentSave;

                if (data.IsResultSubmit == true && data.IsResultAmendSubmit == false)
                {
                    var resultSubmit = await ResultSubmit(existingReport.EquipmentImprovementId, report.CreatedBy);
                    if (resultSubmit.StatusCode == Enums.Status.Success)
                    {
                        res.Message = Enums.EquipmentSubmit;
                    }
                }
                else if (data.IsResultSubmit == true && data.IsResultAmendSubmit == true)
                {
                    var resubmit = await ResultResubmit(existingReport.EquipmentImprovementId, report.CreatedBy);
                    if (resubmit.StatusCode == Enums.Status.Success)
                    {
                        res.Message = Enums.EquipmentSubmit;
                    }
                }
                else
                {
                    InsertHistoryData(existingReport.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Requestor", "Update Status as Draft", ApprovalTaskStatus.Draft.ToString(), Convert.ToInt32(report.CreatedBy), HistoryAction.Save.ToString(), 0);
                }


            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Material Editformdata");
                //return res;
            }
            return res;
        }

        public async Task<AjaxResult> ResultSubmit(int equipmentId, int? createdBy)
        {
            var res = new AjaxResult();
            try
            {
                var equipment = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == equipmentId && x.IsDeleted == false).FirstOrDefault();
                if (equipment != null)
                {
                    equipment.Status = ApprovalTaskStatus.ResultMonitoring.ToString();
                    equipment.WorkFlowStatus = ApprovalTaskStatus.ResultMonitoring.ToString();
                    equipment.WorkFlowLevel = 2;
                    equipment.IsResultSubmit = true;
                    await _context.SaveChangesAsync();
                }
                InsertHistoryData(equipmentId, FormType.EquipmentImprovement.ToString(), "Requestor", "Submit the form", ApprovalTaskStatus.InReview.ToString(), Convert.ToInt32(createdBy), HistoryAction.Submit.ToString(), 0);

                _context.CallEquipmentApproverMaterix(createdBy, equipmentId);

                //var notificationHelper = new NotificationHelper(_context, _cloneContext);
                //await notificationHelper.SendMaterialConsumptionEmail(materialConsumptionId, EmailNotificationAction.Submitted, string.Empty, 0);
                res.Message = Enums.EquipmentSubmit;
                res.StatusCode = Enums.Status.Success;

            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Material SubmitRequest");
                //return res;
            }
            return res;
        }


        public async Task<AjaxResult> ResultResubmit(int equipmentId, int? createdBy)
        {
            var res = new AjaxResult();
            try
            {
                var equipmentApproverTask = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == equipmentId && x.IsActive == true && x.Status == ApprovalTaskStatus.LogicalAmendment.ToString()).FirstOrDefault();

                var equipment = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == equipmentId && x.IsDeleted == false).FirstOrDefault();

                equipmentApproverTask.Status = ApprovalTaskStatus.LogicalAmendmentInReview.ToString();
                equipment.Status = ApprovalTaskStatus.LogicalAmendmentInReview.ToString();
                await _context.SaveChangesAsync();
                InsertHistoryData(equipmentId, FormType.EquipmentImprovement.ToString(), "Requestor", "ReSubmit the Form", ApprovalTaskStatus.LogicalAmendmentInReview.ToString(), Convert.ToInt32(createdBy), HistoryAction.ReSubmitted.ToString(), 0);

                res.Message = Enums.EquipmentResubmit;
                res.StatusCode = Enums.Status.Success;
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Application Equipment Resubmit");
                //return res;
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

        public async Task<AjaxResult> DeleteReport(int Id)
        {
            var res = new AjaxResult();
            var report = await _context.EquipmentImprovementApplication.FindAsync(Id);
            if (report == null)
            {
                res.StatusCode = Enums.Status.Error;
                res.Message = "Record Not Found";
            }
            else
            {
                report.IsDeleted = true;
                report.ModifiedDate = DateTime.Now;
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

        #endregion

        #region Listing screen

        public async Task<List<EquipmentImprovementView>> GetEqupimentImprovementList(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
        {
            var listData = await _context.GetEquipmentImprovementApplication(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
            var equpmentData = new List<EquipmentImprovementView>();
            foreach (var item in listData)
            {
                equpmentData.Add(item);
            }
            return equpmentData;
        }

        public async Task<List<EquipmentImprovementApproverView>> GetEqupimentImprovementApproverList(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
        {
            var listData = await _context.GetEquipmentImprovementApproverList(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
            var equpmentData = new List<EquipmentImprovementApproverView>();
            foreach (var item in listData)
            {
                equpmentData.Add(item);
            }
            return equpmentData;
        }

        #endregion

        #region Pull Back requets 

        public async Task<AjaxResult> PullBackRequest(EquipmentPullBack data)
        {
            var res = new AjaxResult();
            try
            {
                var equipmentTask = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == data.equipmentId && x.IsDeleted == false).FirstOrDefault();
                if (equipmentTask != null)
                {
                    if (equipmentTask.WorkFlowLevel == 1)
                    {
                        equipmentTask.IsSubmit = false;
                        equipmentTask.IsResultSubmit = false;
                        equipmentTask.Status = ApprovalTaskStatus.Draft.ToString();
                        equipmentTask.ModifiedBy = data.userId;
                        // mention the WorkFlow status 
                        await _context.SaveChangesAsync();

                        var approverTask = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == data.equipmentId && x.IsActive == true && x.WorkFlowlevel == 1).ToList();
                        approverTask.ForEach(a =>
                        {
                            a.IsActive = false;
                            a.ModifiedBy = data.userId;
                            a.ModifiedDate = DateTime.Now;
                        });
                        await _context.SaveChangesAsync();

                        InsertHistoryData(equipmentTask.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Requestor", "PullBack by", ApprovalTaskStatus.Draft.ToString(), Convert.ToInt32(data.userId), HistoryAction.PullBack.ToString(), 0);

                    }
                    else
                    {
                        equipmentTask.IsSubmit = true;
                        equipmentTask.IsResultSubmit = false;
                        equipmentTask.Status = ApprovalTaskStatus.Draft.ToString();
                        equipmentTask.ModifiedBy = data.userId;
                        // mention the WorkFlow status
                        await _context.SaveChangesAsync();

                        var approverTask = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == data.equipmentId && x.IsActive == true && x.WorkFlowlevel == 2).ToList();
                        approverTask.ForEach(a =>
                        {
                            a.IsActive = false;
                            a.ModifiedBy = data.userId;
                            a.ModifiedDate = DateTime.Now;
                        });
                        await _context.SaveChangesAsync();

                        InsertHistoryData(equipmentTask.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Requestor", "PullBack by", ApprovalTaskStatus.Draft.ToString(), Convert.ToInt32(data.userId), HistoryAction.PullBack.ToString(), 0);

                    }
                }
                res.Message = Enums.MaterialPullback;
                res.StatusCode = Enums.Status.Success;
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Equipment PullbackRequest");

            }
            return res;
        }

        #endregion

        #region WorkFlow actions

        public async Task<AjaxResult> UpdateApproveAskToAmend(EquipmentApproveAsktoAmend data)
        {
            var res = new AjaxResult();
            try
            {
                var equipmentData = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.ApproverTaskId == data.ApproverTaskId && x.IsActive == true
                                     && x.EquipmentImprovementId == data.EquipmentId
                                     && (x.Status == ApprovalTaskStatus.InReview.ToString() || x.Status == ApprovalTaskStatus.UnderToshibaApproval.ToString() 
                                     || x.Status == ApprovalTaskStatus.ToshibaTechnicalReview.ToString() || x.Status == ApprovalTaskStatus.LogicalAmendmentInReview.ToString())).FirstOrDefault();
                //here change the task as Pending and not approved
                if (equipmentData == null)
                {
                    res.Message = "Equipment Consumption request does not have any review task";
                    return res;
                }

                if (data.Type == ApprovalStatus.Rejected)
                {
                    equipmentData.Status = ApprovalTaskStatus.Reject.ToString();
                    equipmentData.ModifiedBy = data.CurrentUserId;
                    equipmentData.ActionTakenBy = data.CurrentUserId;
                    equipmentData.ActionTakenDate = DateTime.Now;
                    equipmentData.ModifiedDate = DateTime.Now;
                    equipmentData.Comments = data.Comment;

                    await _context.SaveChangesAsync();
                    res.Message = Enums.EquipmentReject;

                    var equipment = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == data.EquipmentId && x.IsDeleted == false).FirstOrDefault();
                    equipment.Status = ApprovalTaskStatus.Reject.ToString();
                    equipment.WorkFlowStatus = ApprovalTaskStatus.Reject.ToString();
                    await _context.SaveChangesAsync();

                    InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), equipmentData.Role, data.Comment, ApprovalTaskStatus.Reject.ToString(), Convert.ToInt32(data.CurrentUserId), HistoryAction.Rejected.ToString(), 0);

                    // InsertHistoryData(requestTaskData.MaterialConsumptionId, FormType.MaterialConsumption.ToString(), requestTaskData.Role, requestTaskData.Comments, requestTaskData.Status, Convert.ToInt32(requestTaskData.ModifiedBy), ApprovalTaskStatus.UnderAmendment.ToString(), 0);
                    //
                    // var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    // await notificationHelper.SendMaterialConsumptionEmail(materialConsumptionId, EmailNotificationAction.Amended, comment, ApproverTaskId);
                    //equipmentData.WorkFlowSta = ApprovalTaskStatus.Reject.ToString();
                }

                if (data.Type == ApprovalStatus.AskToAmend)
                {
                    equipmentData.Status = ApprovalTaskStatus.UnderAmendment.ToString();
                    equipmentData.ModifiedBy = data.CurrentUserId;
                    equipmentData.ActionTakenBy = data.CurrentUserId;
                    equipmentData.ActionTakenDate = DateTime.Now;
                    equipmentData.ModifiedDate = DateTime.Now;
                    equipmentData.Comments = data.Comment;

                    await _context.SaveChangesAsync();
                    res.Message = Enums.EquipmentAsktoAmend;

                    var equipment = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == data.EquipmentId && x.IsDeleted == false).FirstOrDefault();
                    equipment.Status = ApprovalTaskStatus.UnderAmendment.ToString();
                    equipment.WorkFlowStatus = ApprovalTaskStatus.UnderAmendment.ToString();
                    await _context.SaveChangesAsync();

                    InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), equipmentData.Role, data.Comment, ApprovalTaskStatus.UnderAmendment.ToString(), Convert.ToInt32(data.CurrentUserId), HistoryAction.UnderAmendment.ToString(), 0);

                    // InsertHistoryData(requestTaskData.MaterialConsumptionId, FormType.MaterialConsumption.ToString(), requestTaskData.Role, requestTaskData.Comments, requestTaskData.Status, Convert.ToInt32(requestTaskData.ModifiedBy), ApprovalTaskStatus.UnderAmendment.ToString(), 0);
                    //
                    // var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    // await notificationHelper.SendMaterialConsumptionEmail(materialConsumptionId, EmailNotificationAction.Amended, comment, ApproverTaskId);
                    //equipmentData.WorkFlowSta = ApprovalTaskStatus.Reject.ToString();
                }

                if (data.Type == ApprovalStatus.LogicalAmendment)
                {
                    equipmentData.Status = ApprovalTaskStatus.LogicalAmendment.ToString();
                    equipmentData.ModifiedBy = data.CurrentUserId;
                    equipmentData.ActionTakenBy = data.CurrentUserId;
                    equipmentData.ActionTakenDate = DateTime.Now;
                    equipmentData.ModifiedDate = DateTime.Now;
                    equipmentData.Comments = data.Comment;

                    await _context.SaveChangesAsync();
                    res.Message = Enums.EquipmentAsktoAmend;

                    var equipment = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == data.EquipmentId && x.IsDeleted == false).FirstOrDefault();
                    equipment.Status = ApprovalTaskStatus.LogicalAmendment.ToString();
                    equipment.WorkFlowStatus = ApprovalTaskStatus.LogicalAmendment.ToString();
                    await _context.SaveChangesAsync();

                    InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), equipmentData.Role, data.Comment, ApprovalTaskStatus.LogicalAmendment.ToString(), Convert.ToInt32(data.CurrentUserId), HistoryAction.UnderAmendment.ToString(), 0);

                }

                if (data.Type == ApprovalStatus.Approved)
                {
                    equipmentData.Status = ApprovalTaskStatus.Approved.ToString();
                    equipmentData.ModifiedBy = data.CurrentUserId;
                    equipmentData.ActionTakenBy = data.CurrentUserId;
                    equipmentData.ActionTakenDate = DateTime.Now;
                    equipmentData.ModifiedDate = DateTime.Now;
                    equipmentData.Comments = data.Comment;


                    await _context.SaveChangesAsync();
                    res.Message = Enums.EquipmentApprove;

                    var equipment = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == data.EquipmentId && x.IsDeleted == false).FirstOrDefault();


                    if (data.EquipmentApprovalData != null)
                    {
                        var approvalData = data.EquipmentApprovalData;
                        if (approvalData.AdvisorId != 0 && approvalData.AdvisorId != null)
                        {
                            var advisorData = new EquipmentAdvisorMaster();
                            advisorData.EmployeeId = approvalData.AdvisorId;
                            advisorData.WorkFlowlevel = equipment.WorkFlowLevel;
                            advisorData.IsActive = true;
                            advisorData.EquipmentImprovementId = data.EquipmentId;
                            _context.EquipmentAdvisorMasters.Add(advisorData);
                            await _context.SaveChangesAsync();

                            if (equipment.WorkFlowLevel == 1)
                            {
                                var equipmentAdv = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == data.EquipmentId && x.AssignedToUserId == 0 && x.Role == "Advisor" && x.IsActive == true && x.SequenceNo == 2 && x.WorkFlowlevel == 1).FirstOrDefault();
                                equipmentAdv.AssignedToUserId = approvalData.AdvisorId;
                                await _context.SaveChangesAsync();
                            }

                        }
                        else if (approvalData.EmailAttachments != null)
                        {
                            //skip
                            //var attachment = approvalData.EmailAttachments;
                            foreach (var attachment in approvalData.EmailAttachments)
                            {
                                var email = new EquipmentEmailAttachment();
                                email.EquipmentImprovementId = data.EquipmentId;
                                email.EmailDocName = attachment.EmailDocName;
                                email.EmailFilePath = attachment.EmailDocFilePath;
                                email.IsDeleted = false;
                                email.CreatedDate = DateTime.Now;
                                email.ModifiedDate = DateTime.Now;
                                email.CreatedBy = data.CurrentUserId;
                                email.ModifiedBy = data.CurrentUserId;
                                _context.EquipmentEmailAttachments.Add(email);
                                await _context.SaveChangesAsync();
                            }
                        }
                        else
                        {
                            equipment.ToshibaApprovalRequired = true;
                            equipment.ToshibaApprovalComment = approvalData.Comment;
                            equipment.ToshibaApprovalTargetDate = !string.IsNullOrEmpty(approvalData.TargetDate) ? DateTime.Parse(approvalData.TargetDate) : (DateTime?)null;
                            equipment.Status = ApprovalTaskStatus.UnderToshibaApproval.ToString();
                            equipmentData.Status = ApprovalTaskStatus.UnderToshibaApproval.ToString();
                            equipment.IsPcrnRequired = approvalData.IsPcrnRequired;

                            //if pcrnpending then changes the status accordingly 
                            if (approvalData.IsPcrnRequired == true)
                            {
                                equipment.IsSubmit = false;
                                equipment.Status = ApprovalTaskStatus.PCRNPending.ToString();
                                equipmentData.Status = ApprovalTaskStatus.PCRNPending.ToString();
                                await _context.SaveChangesAsync();
                            }
                            await _context.SaveChangesAsync();

                        }

                    }

                    var currentApproverTask = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == data.EquipmentId && x.IsActive == true
                                               && x.ApproverTaskId == data.ApproverTaskId && x.Status == ApprovalTaskStatus.Approved.ToString()).FirstOrDefault();
                    if (currentApproverTask != null)
                    {
                        var nextApproveTask = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == equipmentData.EquipmentImprovementId && x.IsActive == true
                                 && x.Status == ApprovalTaskStatus.Pending.ToString() && x.SequenceNo == (equipmentData.SequenceNo) + 1).ToList();

                        if (nextApproveTask.Any())
                        {
                            foreach (var nextTask in nextApproveTask)
                            {
                                nextTask.Status = ApprovalTaskStatus.InReview.ToString();
                                nextTask.ModifiedDate = DateTime.Now;
                                await _context.SaveChangesAsync();

                                var equipmentForm = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == data.EquipmentId && x.IsDeleted == false && x.IsDeleted == false).FirstOrDefault();

                                //if there is another task are pending then status will be in InReview
                                if (equipmentForm != null)
                                {
                                    equipmentForm.Status = ApprovalTaskStatus.InReview.ToString();
                                    equipmentForm.WorkFlowStatus = ApprovalTaskStatus.InReview.ToString();
                                    await _context.SaveChangesAsync();
                                }
                                //await notificationHelper.SendMaterialConsumptionEmail(materialConsumptionId, EmailNotificationAction.Approved, null, nextTask.ApproverTaskId);

                            }
                            // Notification code (if applicable)
                        }
                        else
                        {
                            var equipmentForm = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == data.EquipmentId && x.IsDeleted == false && x.IsDeleted == false).FirstOrDefault();
                            if (equipmentForm != null)
                            {
                                if (equipmentForm.WorkFlowLevel == 1)
                                {
                                    equipmentForm.Status = ApprovalTaskStatus.Approved.ToString();
                                    equipmentForm.WorkFlowStatus = ApprovalTaskStatus.Approved.ToString();
                                    await _context.SaveChangesAsync();
                                }
                                else
                                {
                                    equipmentForm.Status = ApprovalTaskStatus.Completed.ToString();
                                    equipmentForm.WorkFlowStatus = ApprovalTaskStatus.Completed.ToString();
                                    await _context.SaveChangesAsync();
                                }

                                //await notificationHelper.SendMaterialConsumptionEmail(materialConsumptionId, EmailNotificationAction.Completed, null, 0);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Equipment UpdateApproveAskToAmend");

            }
            return res;

        }

        public async Task<AjaxResult> UpdateTargetDates(EquipmentApprovalData data)
        {
            var res = new AjaxResult();
            try
            {
                var equipment = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == data.EquipmentId && x.IsDeleted == false).FirstOrDefault();
                if (data.IsToshibaDiscussion == true)
                {
                    equipment.ToshibaTeamDiscussion = true;
                    equipment.ToshibaDiscussionTargetDate = !string.IsNullOrEmpty(data.TargetDate) ? DateTime.Parse(data.TargetDate) : (DateTime?)null;
                    equipment.Status = ApprovalTaskStatus.ToshibaTechnicalReview.ToString();
                    equipment.ToshibaDicussionComment = data.Comment;
                    await _context.SaveChangesAsync();
                }
                else
                {
                    equipment.ToshibaApprovalRequired = true;
                    equipment.ToshibaApprovalTargetDate = !string.IsNullOrEmpty(data.TargetDate) ? DateTime.Parse(data.TargetDate) : (DateTime?)null; ;
                    //equipment.Status = ApprovalTaskStatus.ToshibaTechnicalReview.ToString();
                    equipment.ToshibaApprovalComment = data.Comment;
                    await _context.SaveChangesAsync();
                }
                res.Message = Enums.EquipmentDateUpdate;
                res.StatusCode = Enums.Status.Success;

            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Equipment UpdateTargetDate");

            }
            return res;
        }


        public EquipmentApprovalData GetEquipmentTargetDate(int equipmentId, bool toshibaDiscussion)
        {
            var res = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == equipmentId && x.IsDeleted == false).FirstOrDefault();
            if (res == null)
            {
                return null;
            }

            var equipmentTargetData = new EquipmentApprovalData();
            if (toshibaDiscussion == true)
            {
                equipmentTargetData.TargetDate = res.ToshibaDiscussionTargetDate.HasValue ? res.ToshibaDiscussionTargetDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty;
            }
            else
            {
                equipmentTargetData.TargetDate = res.ToshibaApprovalTargetDate.HasValue ? res.ToshibaApprovalTargetDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty;
            }
            return equipmentTargetData;
        }

        public async Task<List<EquipmentApproverTaskMasterAdd>> GetEquipmentWorkFlowData(int equipmentId)
        {
            var approverData = await _context.GetEquipmentWorkFlowData(equipmentId);
            var processedData = new List<EquipmentApproverTaskMasterAdd>();
            foreach (var entry in approverData)
            {
                processedData.Add(entry);
            }
            return processedData;
        }

        public ApproverTaskId_dto GetCurrentApproverTask(int equipmentId, int userId)
        {
            var materialApprovers = _context.EquipmentImprovementApproverTaskMasters.FirstOrDefault(x => x.EquipmentImprovementId == equipmentId && x.AssignedToUserId == userId &&
            (x.Status == ApprovalTaskStatus.InReview.ToString() || x.Status == ApprovalTaskStatus.UnderToshibaApproval.ToString() 
            || x.Status == ApprovalTaskStatus.ToshibaTechnicalReview.ToString() || x.Status == ApprovalTaskStatus.LogicalAmendmentInReview.ToString()) && x.IsActive == true);

            var data = new ApproverTaskId_dto();
            if (materialApprovers != null)
            {
                data.approverTaskId = materialApprovers.ApproverTaskId;
                data.userId = materialApprovers.AssignedToUserId ?? 0;
                data.status = materialApprovers.Status;
                data.seqNumber = materialApprovers.SequenceNo;

            }
            return data;
        }
        #endregion


        #region History Section
        public void InsertHistoryData(int formId, string formtype, string role, string comment, string status, int actionByUserID, string actionType, int delegateUserId)
        {
            var res = new AjaxResult();
            var equipmentHistory = new EquipmentImprovementHistoryMaster()
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
            _context.EquipmentImprovementHistoryMasters.Add(equipmentHistory);
            _context.SaveChanges();
        }


        public List<TroubleReportHistoryView> GetHistoryData(int equipmentId)
        {
            var troubleHistorydata = _context.EquipmentImprovementHistoryMasters.Where(x => x.FormID == equipmentId && x.IsActive == true).ToList();

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

        #region Excel and pdf functionality
        public async Task<AjaxResult> GetEquipmentExcel(DateTime fromDate, DateTime toDate, int employeeId, int type)
        {
            var res = new AjaxResult();

            try
            {
                var excelData = await _context.GetEquipmentExcel(fromDate, toDate, employeeId, type);
                using (var workbook = new XLWorkbook())
                {
                    var worksheet = workbook.Worksheets.Add("Equipment Improvement");

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
                commonHelper.LogException(ex, "GetMaterialConsumptionExcel");
                return res;
            }
        }

        private static readonly Dictionary<string, string> ColumnHeaderMapping = new Dictionary<string, string>
{

            {"EquipmentImprovementNo","Request No" }
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