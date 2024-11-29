using TDSGCellFormat.Interface.Repository;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using static TDSGCellFormat.Common.Enums;
using TDSGCellFormat.Common;
using TDSGCellFormat.Helper;
using Microsoft.EntityFrameworkCore;
using TDSGCellFormat.Models.View;
using System.Data;
using System.Data.SqlClient;
using ClosedXML.Excel;
using Dapper;
using System.Text;
using System.Globalization;
using System.Text.RegularExpressions;


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

        #region GetUserRole
        public async Task<GetEquipmentUser> GetUserRole(string userEmail)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var parameters = new DynamicParameters();
                parameters.Add("@UserEmail", userEmail, DbType.String, ParameterDirection.Input, 150);

                var result = await connection.QueryFirstOrDefaultAsync<GetEquipmentUser>(
                    "dbo.SPP_GetUserDetails_EQP",
                    parameters,
                    commandType: CommandType.StoredProcedure
                );

                return result;
            }
        }
        #endregion

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
                AreaId = !string.IsNullOrEmpty(res.AreaId) ? res.AreaId.Split(',').Select(s => int.Parse(s.Trim())).ToList() : new List<int>(),
                MachineName = res.MachineId,
                SubMachineName = !string.IsNullOrEmpty(res.SubMachineId) ? res.SubMachineId.Split(',').Select(s => int.Parse(s.Trim())).ToList() : new List<int>(),
                otherSubMachine = res.OtherSubMachine,
                OtherMachineName = res.OtherMachineName,
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
                WorkflowStatus = res.WorkFlowStatus,
                CreatedDate = res.CreatedDate,
                CreatedBy = res.CreatedBy,
                IsSubmit = res.IsSubmit,
                ToshibaApprovalRequired = res.ToshibaApprovalRequired,
                ToshibaApprovalTargetDate = res.ToshibaApprovalTargetDate.HasValue ? res.ToshibaApprovalTargetDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                ToshibaTeamDiscussion = res.ToshibaTeamDiscussion,
                ToshibaDiscussionTargetDate = res.ToshibaDiscussionTargetDate.HasValue ? res.ToshibaDiscussionTargetDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                IsPcrnRequired = res.IsPcrnRequired,
                WorkflowLevel = res.WorkFlowLevel
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


            applicationData.ResultAfterImplementation = new ResultAfterImplementation
            {
                TargetDate = res.TargetDate.HasValue ? res.TargetDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                ActualDate = res.ActualDate.HasValue ? res.ActualDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                ResultStatus = res.ResultStatus,
                IsResultSubmit = res.IsResultSubmit,
                ResultMonitoringDate = res.ResultMonitorDate.HasValue ? res.ResultMonitorDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                ResultMonitoringId = res.ResultMonitoring,
                PCRNNumber = res.PCRNNumber
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
                    newReport.OtherMachineName = report.MachineName != null && report.MachineName == -1
                          ? report.OtherMachineName
                          : "";
                    newReport.SubMachineId = report.SubMachineName != null ? string.Join(",", report.SubMachineName) : string.Empty;
                    newReport.OtherSubMachine = report.SubMachineName != null && report.SubMachineName.Contains(-2)
                           ? report.otherSubMachine
                           : "";
                    newReport.SectionId = report.SectionId;
                    //newReport.SectionHeadId = report.SectionHeadId;
                    newReport.AreaId = report.AreaId != null ? string.Join(",", report.AreaId) : string.Empty;
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
                    newReport.IsLogicalAmend = false;
                    newReport.ToshibaApprovalRequired = false;
                    newReport.WorkFlowStatus = ApprovalTaskStatus.Draft.ToString();

                    // Assign SectionHeadId based on the conditions
                    if (report.SectionId == 1)
                    {
                        newReport.SectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.SectionHeadMasterId == 1 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault();
                    }
                    else if (report.SectionId == 2)
                    {
                        newReport.SectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.SectionHeadMasterId == 2 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault(); ;
                    }
                    else if (report.SectionId == 3)
                    {
                        if (report.AreaId != null && report.AreaId.Contains(1))
                        {
                            newReport.SectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.SectionHeadMasterId == 3 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault(); ;
                        }
                        else if (report.AreaId != null && (report.AreaId.Contains(2) || report.AreaId.Contains(3)))
                        {
                            newReport.SectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.SectionHeadMasterId == 4 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault(); ;
                        }
                    }
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
                                EquipmentImprovementId = applicationImprovementId,
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
                            var updatedUrl = attach.CurrSituationDocFilePath.Replace($"/{report.CreatedBy}/", $"/{equipmentNo}/");
                            ///EqReportDocuments/EQReportDocs/Current Situation Attachments/MaterialConsumption_2024-10-09.xlsx
                            var attachment = new EquipmentCurrSituationAttachment()
                            {

                                EquipmentImprovementId = applicationImprovementId,
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
                            var updatedUrl = attach.ImprovementDocFilePath.Replace($"/{report.CreatedBy}/", $"/{equipmentNo}/");
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
                        var data = await SubmitRequest(applicationImprovementId, report.CreatedBy);
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
                        var formData = await EditFormData(report);
                        if (formData.StatusCode == Enums.Status.Success)
                        {
                            res.Message = formData.Message;
                        }
                    }
                    if (report.ResultAfterImplementation != null)
                    {
                        if (report.ModifiedBy == _context.AdminApprovers.Where(x => x.IsActive == true).Select(x => x.AdminId).FirstOrDefault())
                        {
                            var formData = await EditFormData(report);
                            if (formData.StatusCode == Enums.Status.Success)
                            {
                                res.Message = formData.Message;
                            }
                            var nextData = await EditResult(report);
                            if (nextData.StatusCode == Enums.Status.Success)
                            {
                                res.Message = nextData.Message;
                            }
                        }
                        if (existingReport.IsLogicalAmend == true)
                        {
                            var formData = await EditFormData(report);
                            if (formData.StatusCode == Enums.Status.Success)
                            {
                                res.Message = formData.Message;
                            }
                        }
                        else
                        {
                            var nextData = await EditResult(report);
                            if (nextData.StatusCode == Enums.Status.Success)
                            {
                                res.Message = nextData.Message;
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


                await _context.CallEquipmentApproverMaterix(createdBy, equipmentId);

                var notificationHelper = new NotificationHelper(_context, _cloneContext);
                await notificationHelper.SendEquipmentEmail(equipmentId, EmailNotificationAction.Submitted, string.Empty, 0);

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

                var notificationHelper = new NotificationHelper(_context, _cloneContext);
                await notificationHelper.SendEquipmentEmail(equipmentId, EmailNotificationAction.ReSubmitted, string.Empty, 0);

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

        public async Task<AjaxResult> EditFormData(EquipmentImprovementApplicationAdd report)
        {
            var res = new AjaxResult();
            try
            {
                var existingReport = await _context.EquipmentImprovementApplication.FindAsync(report.EquipmentImprovementId);
                existingReport.MachineId = report.MachineName;
                existingReport.OtherMachineName = report.MachineName != null && report.MachineName == -1
                      ? report.OtherMachineName
                      : "";
                existingReport.SubMachineId = report.SubMachineName != null ? string.Join(",", report.SubMachineName) : string.Empty;
                existingReport.OtherSubMachine = report.SubMachineName != null && report.SubMachineName.Contains(-2)
                           ? report.otherSubMachine
                           : "";
                existingReport.SectionId = report.SectionId;
                existingReport.SectionHeadId = report.SectionHeadId;
                existingReport.AreaId = report.AreaId != null ? string.Join(",", report.AreaId) : string.Empty;
                existingReport.ImprovementName = report.ImprovementName;
                existingReport.Purpose = report.Purpose;
                existingReport.CurrentSituation = report.CurrentSituation;
                existingReport.Imrovement = report.Improvement;
                existingReport.ModifiedDate = DateTime.Now;
                existingReport.ModifiedBy = report.ModifiedBy;
                existingReport.IsSubmit = report.IsSubmit;

                // Assign SectionHeadId based on the conditions
                if (report.SectionId == 1)
                {
                    existingReport.SectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.SectionHeadMasterId == 1 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault();
                }
                else if (report.SectionId == 2)
                {
                    existingReport.SectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.SectionHeadMasterId == 2 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault(); ;
                }
                else if (report.SectionId == 3)
                {
                    if (report.AreaId != null && report.AreaId.Contains(1))
                    {
                        existingReport.SectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.SectionHeadMasterId == 3 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault(); ;
                    }
                    else if (report.AreaId != null && (report.AreaId.Contains(2) || report.AreaId.Contains(3)))
                    {
                        existingReport.SectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.SectionHeadMasterId == 4 && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault(); ;
                    }
                }
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
                        var updatedUrl = attach.CurrSituationDocFilePath.Replace($"/{report.CreatedBy}/", $"/{existingReport.EquipmentImprovementNo}/");
                        var existingAttachData = _context.EquipmentCurrSituationAttachment.Where(x => x.EquipmentImprovementId == attach.EquipmentImprovementId && x.EquipmentCurrentSituationAttachmentId == attach.EquipmentCurrSituationAttachmentId).FirstOrDefault();
                        if (existingAttachData != null)
                        {
                            existingAttachData.CurrSituationDocName = attach.CurrSituationDocName;
                            existingAttachData.CurrSituationDocFilePath = attach.CurrSituationDocFilePath;
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
                        var updatedUrl = attach.ImprovementDocFilePath.Replace($"/{report.CreatedBy}/", $"/{existingReport.EquipmentImprovementNo}/");
                        var existingAttachData = _context.EquipmentImprovementAttachment.Where(x => x.EquipmentImprovementId == attach.EquipmentImprovementId && x.EquipmentImprovementAttachmentId == attach.EquipmentImprovementAttachmentId).FirstOrDefault();
                        if (existingAttachData != null)
                        {
                            existingAttachData.ImprovementDocName = attach.ImprovementDocName;
                            existingAttachData.ImprovementDocFilePath = attach.ImprovementDocFilePath;
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

                //var existingPCRN = _context.EquipmentPCRNAttachments.Where(x => x.EquipmentImprovementId == existingReport.EquipmentImprovementId).ToList();
                //MarkAsDeleted(existingPCRN, existingReport.CreatedBy, DateTime.Now);
                //_context.SaveChanges();

                /* if (report.PcrnAttachments != null)
                 {

                     var pcrndata = report.PcrnAttachments;
                     var existingPcrn = _context.EquipmentPCRNAttachments.Where(x => x.PCRNId == pcrndata.PcrnAttachmentId && x.EquipmentImprovementId == existingReport.EquipmentImprovementId).FirstOrDefault();
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
                         else if (report.IsSubmit == true && report.IsAmendReSubmitTask == false)
                         {
                             existingReport.Status = ApprovalTaskStatus.UnderToshibaApproval.ToString();
                             existingReport.IsSubmit = true;

                             var qcTeamData = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == existingReport.EquipmentImprovementId && x.IsActive == true && x.SequenceNo == 5 && x.WorkFlowlevel == 1).FirstOrDefault();
                             if (qcTeamData != null)
                             {
                                 qcTeamData.Status = ApprovalTaskStatus.UnderToshibaApproval.ToString();
                                 await _context.SaveChangesAsync();
                             }
                         }
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
                         else if (report.IsSubmit == true && report.IsAmendReSubmitTask == false)
                         {
                             existingReport.Status = ApprovalTaskStatus.UnderToshibaApproval.ToString();
                             existingReport.IsSubmit = true;

                             var qcTeamData = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == existingReport.EquipmentImprovementId && x.IsActive == true && x.SequenceNo == 5 && x.WorkFlowlevel == 1).FirstOrDefault();
                             if (qcTeamData != null)
                             {
                                 qcTeamData.Status = ApprovalTaskStatus.UnderToshibaApproval.ToString();
                                 await _context.SaveChangesAsync();
                             }
                         }
                         //await _context.SaveChangesAsync();
                         _context.EquipmentPCRNAttachments.Add(pcrn);
                         await _context.SaveChangesAsync();


                     }

                 }*/

                res.ReturnValue = new
                {
                    EquipmentImprovementId = existingReport.EquipmentImprovementId,
                    EquipmentImprovementNo = existingReport.EquipmentImprovementNo
                };
                res.StatusCode = Enums.Status.Success;
                res.Message = Enums.EquipmentSave;


                if (report.IsSubmit == true && report.IsAmendReSubmitTask == false && existingReport.IsLogicalAmend == false)
                {
                    var data = await SubmitRequest(existingReport.EquipmentImprovementId, existingReport.CreatedBy);
                    if (data.StatusCode == Enums.Status.Success)
                    {
                        res.Message = Enums.EquipmentSubmit;
                    }

                }
                else if (report.IsSubmit == true && report.IsAmendReSubmitTask == true && existingReport.IsLogicalAmend == false)
                {
                    var data = await Resubmit(existingReport.EquipmentImprovementId, existingReport.CreatedBy);
                    if (data.StatusCode == Enums.Status.Success)
                    {
                        res.Message = Enums.EquipmentResubmit;
                    }

                }
                else if (report.IsSubmit == true && report.IsAmendReSubmitTask == true && existingReport.IsLogicalAmend == true)
                {
                    existingReport.Status = ApprovalTaskStatus.LogicalAmendmentInReview.ToString();
                    existingReport.WorkFlowLevel = 2;
                    await _context.SaveChangesAsync();

                    var approverTask = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == existingReport.EquipmentImprovementId && x.IsActive == true && x.WorkFlowlevel == 2).ToList();
                    if (approverTask != null)
                    {
                        approverTask.ForEach(a =>
                        {
                            a.IsActive = false;
                            a.ModifiedBy = existingReport.ModifiedBy;
                            a.ModifiedDate = DateTime.Now;
                        });
                        await _context.SaveChangesAsync();
                    }

                    res.Message = Enums.EquipmentResubmit;

                    await _context.CallEquipmentApproverMaterix(existingReport.CreatedBy, existingReport.EquipmentImprovementId);

                    InsertHistoryData(existingReport.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Requestor", "ReSubmit the Form", ApprovalTaskStatus.LogicalAmendmentInReview.ToString(), Convert.ToInt32(report.CreatedBy), HistoryAction.ReSubmitted.ToString(), 0);
                }
                else
                {
                    InsertHistoryData(existingReport.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Requestor", "Update the Form", existingReport.Status, Convert.ToInt32(report.CreatedBy), HistoryAction.Save.ToString(), 0);
                }
                return res;
            }

            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Equpment Editformdata");
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

                //if (!(data.ResultMonitoringId == 1 && (data.ResultStatus != null || !string.IsNullOrEmpty(data.ResultStatus))))
                //{
                //    existingReport.ResultMonitorDate = !string.IsNullOrEmpty(data.ResultMonitoringDate) ? DateTime.Parse(data.ResultMonitoringDate) : (DateTime?)null;
                //}
                if ((data.ResultMonitoringId == 2 || data.ResultMonitoringId == 3))
                {
                    existingReport.ResultMonitorDate = !string.IsNullOrEmpty(data.ResultMonitoringDate) ? DateTime.Parse(data.ResultMonitoringDate) : (DateTime?)null;

                }
                else if ((data.ResultMonitoringId == 1 && (string.IsNullOrEmpty(data.ResultStatus))))

                {
                    existingReport.ResultMonitorDate = !string.IsNullOrEmpty(data.ResultMonitoringDate) ? DateTime.Parse(data.ResultMonitoringDate) : (DateTime?)null;
                }
                existingReport.IsResultSubmit = data.IsResultSubmit;
                existingReport.ResultMonitoring = data.ResultMonitoringId;
                existingReport.PCRNNumber = data.PCRNNumber;
                existingReport.WorkFlowLevel = 2;

                if (data.TargetDate != null && data.ActualDate == null)
                {
                    existingReport.Status = ApprovalTaskStatus.UnderImplementation.ToString();

                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendEquipmentEmail(existingReport.EquipmentImprovementId, EmailNotificationAction.UnderImplementation, string.Empty, 0);
                }
                if (data.TargetDate != null && data.ActualDate != null)
                {
                    existingReport.Status = ApprovalTaskStatus.ResultMonitoring.ToString();

                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendEquipmentEmail(existingReport.EquipmentImprovementId, EmailNotificationAction.ResultMonitoring, string.Empty, 0);
                }

                await _context.SaveChangesAsync();
                res.StatusCode = Enums.Status.Success;
                res.Message = Enums.EquipmentSave;

                if (data.IsResultSubmit == true && data.IsResultAmendSubmit == false)
                {
                    var resultSubmit = await ResultSubmit(existingReport.EquipmentImprovementId, report.ModifiedBy);
                    if (resultSubmit.StatusCode == Enums.Status.Success)
                    {
                        res.Message = Enums.EquipmentSubmit;
                    }
                }
                else if (data.IsResultSubmit == true && data.IsResultAmendSubmit == true)
                {
                    var resubmit = await ResultResubmit(existingReport.EquipmentImprovementId, report.ModifiedBy);
                    if (resubmit.StatusCode == Enums.Status.Success)
                    {
                        res.Message = Enums.EquipmentResubmit;
                    }
                }
                else
                {
                    InsertHistoryData(existingReport.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Requestor", "Update the Form", existingReport.Status, Convert.ToInt32(report.CreatedBy), HistoryAction.Save.ToString(), 0);
                }


            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "EditResult");
                //return res;
            }
            return res;
        }

        public async Task<AjaxResult> ResultSubmit(int equipmentId, int? userId)
        {
            var res = new AjaxResult();
            try
            {
                var equipment = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == equipmentId && x.IsDeleted == false).FirstOrDefault();
                if (equipment != null)
                {
                    equipment.Status = ApprovalTaskStatus.InReview.ToString();
                    //equipment.WorkFlowStatus = ApprovalTaskStatus.ResultMonitoring.ToString();
                    equipment.WorkFlowLevel = 2;
                    equipment.IsResultSubmit = true;
                    await _context.SaveChangesAsync();

                    var approverTask = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == equipmentId && x.IsActive == true && x.WorkFlowlevel == 2).ToList();
                    if (approverTask != null)
                    {
                        approverTask.ForEach(a =>
                        {
                            a.IsActive = false;
                            a.ModifiedBy = userId;
                            a.ModifiedDate = DateTime.Now;
                        });
                        await _context.SaveChangesAsync();
                    }


                    equipment.IsLogicalAmend = false;
                    await _context.SaveChangesAsync();
                }

                InsertHistoryData(equipmentId, FormType.EquipmentImprovement.ToString(), "Requestor", "Submit the form", ApprovalTaskStatus.ResultMonitoring.ToString(), Convert.ToInt32(userId), HistoryAction.Submit.ToString(), 0);

                 await _context.CallEquipmentApproverMaterix(userId, equipmentId);


                var notificationHelper = new NotificationHelper(_context, _cloneContext);
                await notificationHelper.SendEquipmentEmail(equipmentId, EmailNotificationAction.ResultSubmit, string.Empty, 0);
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

        public async Task<AjaxResult> ResultResubmit(int equipmentId, int? userId)
        {
            var res = new AjaxResult();
            try
            {
                var equipmentApproverTask = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == equipmentId && x.IsActive == true && x.Status == ApprovalTaskStatus.LogicalAmendment.ToString()).FirstOrDefault();

                var equipment = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == equipmentId && x.IsDeleted == false).FirstOrDefault();

                var approverTask = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == equipmentId && x.IsActive == true && x.WorkFlowlevel == 2).ToList();
                approverTask.ForEach(a =>
                {
                    a.IsActive = false;
                    a.ModifiedBy = userId;
                    a.ModifiedDate = DateTime.Now;
                });
                await _context.SaveChangesAsync();
                // equipmentApproverTask.Status = ApprovalTaskStatus.LogicalAmendmentInReview.ToString();
                equipment.Status = ApprovalTaskStatus.LogicalAmendmentInReview.ToString();
                await _context.SaveChangesAsync();

                InsertHistoryData(equipmentId, FormType.EquipmentImprovement.ToString(), "Requestor", "ReSubmit the Form", ApprovalTaskStatus.LogicalAmendmentInReview.ToString(), Convert.ToInt32(userId), HistoryAction.ReSubmitted.ToString(), 0);

                await _context.CallEquipmentApproverMaterix(userId, equipmentId);


                var notificationHelper = new NotificationHelper(_context, _cloneContext);
                await notificationHelper.SendEquipmentEmail(equipmentId, EmailNotificationAction.ReSubmitted, string.Empty, 0);

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

                var reportApprover = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == Id).ToList();

                reportApprover.ForEach(a =>
                {
                    a.IsActive = false;
                    a.ModifiedDate = DateTime.Now;
                });
                await _context.SaveChangesAsync();

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
            var admin = _context.AdminApprovers.Where(x => x.FormName == ProjectType.Equipment.ToString() && x.IsActive == true).Select(x => x.AdminId).FirstOrDefault();
            var listData = await _context.GetEquipmentImprovementApplication(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
            var equpmentData = new List<EquipmentImprovementView>();
            foreach (var item in listData)
            {
                if(createdBy == admin || item.Status != ApprovalTaskStatus.Draft.ToString())
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

        public async Task<List<EquipmentImprovementView>> GetEqupimentImprovementMyRequestList(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
        {
            var listData = await _context.GetEqupimentImprovementMyRequestList(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
            var equpmentData = new List<EquipmentImprovementView>();
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
                    if(equipmentTask.WorkFlowLevel == 1)
                    {
                        equipmentTask.IsSubmit = false;
                        equipmentTask.IsResultSubmit = false;
                        equipmentTask.Status = ApprovalTaskStatus.Draft.ToString();
                        equipmentTask.WorkFlowStatus = ApprovalTaskStatus.Draft.ToString();
                        equipmentTask.WorkFlowLevel = 1;
                        equipmentTask.ModifiedBy = data.userId;
                        equipmentTask.IsPcrnRequired = false;
                        // mention the WorkFlow status 
                        await _context.SaveChangesAsync();

                        InsertHistoryData(equipmentTask.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Requestor", "PullBack by", ApprovalTaskStatus.Draft.ToString(), Convert.ToInt32(data.userId), HistoryAction.PullBack.ToString(), 0);
                        var notificationHelper = new NotificationHelper(_context, _cloneContext);
                        await notificationHelper.SendEquipmentEmail(data.equipmentId, EmailNotificationAction.PullBack, string.Empty, 0);

                        var approverTask = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == data.equipmentId && x.IsActive == true && x.WorkFlowlevel == 1).ToList();
                        approverTask.ForEach(a =>
                        {
                            a.IsActive = false;
                            a.ModifiedBy = data.userId;
                            a.ModifiedDate = DateTime.Now;
                        });
                        await _context.SaveChangesAsync();


                    }
                    else
                    {
                        equipmentTask.IsSubmit = true;
                        equipmentTask.IsResultSubmit = false;
                        equipmentTask.Status = ApprovalTaskStatus.ResultMonitoring.ToString();
                        equipmentTask.WorkFlowStatus = ApprovalTaskStatus.W1Completed.ToString();
                        equipmentTask.WorkFlowLevel = 2;
                        equipmentTask.ModifiedBy = data.userId;
                        equipmentTask.IsPcrnRequired = false;
                        // mention the WorkFlow status 
                        await _context.SaveChangesAsync();

                        InsertHistoryData(equipmentTask.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Requestor", "PullBack by", ApprovalTaskStatus.ResultMonitoring.ToString(), Convert.ToInt32(data.userId), HistoryAction.PullBack.ToString(), 0);
                        var notificationHelper = new NotificationHelper(_context, _cloneContext);
                        await notificationHelper.SendEquipmentEmail(data.equipmentId, EmailNotificationAction.PullBack, string.Empty, 0);

                        var approverTask = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == data.equipmentId && x.IsActive == true && x.WorkFlowlevel == 2).ToList();
                        approverTask.ForEach(a =>
                        {
                            a.IsActive = false;
                            a.ModifiedBy = data.userId;
                            a.ModifiedDate = DateTime.Now;
                        });
                        await _context.SaveChangesAsync();


                    }


                }
                res.Message = Enums.EquipmentPullback;
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
                    equipmentData.Status = ApprovalTaskStatus.Rejected.ToString();
                    equipmentData.ModifiedBy = data.CurrentUserId;
                    equipmentData.ActionTakenBy = data.CurrentUserId;
                    equipmentData.ActionTakenDate = DateTime.Now;
                    equipmentData.ModifiedDate = DateTime.Now;
                    equipmentData.Comments = data.Comment;

                    await _context.SaveChangesAsync();
                    res.Message = Enums.EquipmentReject;

                    var equipment = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == data.EquipmentId && x.IsDeleted == false).FirstOrDefault();
                    equipment.Status = ApprovalTaskStatus.Rejected.ToString();
                    equipment.WorkFlowStatus = ApprovalTaskStatus.Rejected.ToString();
                    await _context.SaveChangesAsync();

                    InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), equipmentData.Role, data.Comment, ApprovalTaskStatus.Rejected.ToString(), Convert.ToInt32(data.CurrentUserId), HistoryAction.Rejected.ToString(), 0);

                    // InsertHistoryData(requestTaskData.MaterialConsumptionId, FormType.MaterialConsumption.ToString(), requestTaskData.Role, requestTaskData.Comments, requestTaskData.Status, Convert.ToInt32(requestTaskData.ModifiedBy), ApprovalTaskStatus.UnderAmendment.ToString(), 0);
                    //
                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.Rejected, data.Comment, data.ApproverTaskId);
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
                    //equipment.WorkFlowStatus = ApprovalTaskStatus.UnderAmendment.ToString();
                    await _context.SaveChangesAsync();

                    InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), equipmentData.Role, data.Comment, ApprovalTaskStatus.UnderAmendment.ToString(), Convert.ToInt32(data.CurrentUserId), HistoryAction.UnderAmendment.ToString(), 0);

                    // InsertHistoryData(requestTaskData.MaterialConsumptionId, FormType.MaterialConsumption.ToString(), requestTaskData.Role, requestTaskData.Comments, requestTaskData.Status, Convert.ToInt32(requestTaskData.ModifiedBy), ApprovalTaskStatus.UnderAmendment.ToString(), 0);
                    //
                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.Amended, data.Comment, data.ApproverTaskId);
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
                    equipment.IsLogicalAmend = true;
                    //equipment.WorkFlowStatus = ApprovalTaskStatus.LogicalAmendment.ToString();
                    await _context.SaveChangesAsync();
                    InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), equipmentData.Role, data.Comment, ApprovalTaskStatus.LogicalAmendment.ToString(), Convert.ToInt32(data.CurrentUserId), HistoryAction.LogicalAmendment.ToString(), 0);

                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.LogicalAmend, data.Comment, data.ApproverTaskId);
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

                    InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), equipmentData.Role, data.Comment, equipmentData.Status, Convert.ToInt32(data.CurrentUserId), HistoryAction.Approved.ToString(), 0);


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
                        else if (approvalData.EmailAttachments != null && approvalData.EmailAttachments.Count > 0)
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
                            InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), equipmentData.Role, data.Comment, equipmentData.Status, Convert.ToInt32(data.CurrentUserId), HistoryAction.ToshibaApproved.ToString(), 0);

                        }
                        else if (approvalData.IsToshibaDiscussion == false)
                        {
                            equipment.ToshibaApprovalRequired = true;
                            equipment.ToshibaApprovalComment = approvalData.Comment;
                            //equipment.ToshibaApprovalTargetDate = !string.IsNullOrEmpty(approvalData.TargetDate) ? DateTime.Parse(approvalData.TargetDate) : (DateTime?)null;
                            equipment.ToshibaApprovalTargetDate = !string.IsNullOrEmpty(approvalData.TargetDate)?
                                                     DateTime.ParseExact(approvalData.TargetDate, "dd-MM-yyyy", CultureInfo.InvariantCulture)
                                                    : (DateTime?)null;
                            equipment.Status = ApprovalTaskStatus.UnderToshibaApproval.ToString();
                            equipmentData.Status = ApprovalTaskStatus.UnderToshibaApproval.ToString();
                            equipment.IsPcrnRequired = approvalData.IsPcrnRequired;

                            InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), equipmentData.Role, data.Comment, equipmentData.Status, Convert.ToInt32(data.CurrentUserId), HistoryAction.ToshibaApprovalRequired.ToString(), 0);

                            var notificationHelper = new NotificationHelper(_context, _cloneContext);
                            await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.ToshibaTeamApproval, data.Comment, 0);
                           

                            if(approvalData.IsPcrnRequired == true)
                            {
                                //var notificationHelper = new NotificationHelper(_context, _cloneContext);
                                await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.PcrnRequired, string.Empty, 0);
                            }
                            /*  //if pcrnpending then changes the status accordingly 
                              if (approvalData.IsPcrnRequired == true)
                              {
                                  equipment.IsSubmit = false;
                                  equipment.Status = ApprovalTaskStatus.PCRNPending.ToString();
                                  equipmentData.Status = ApprovalTaskStatus.PCRNPending.ToString();
                                  await _context.SaveChangesAsync();

                                  InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), equipmentData.Role, data.Comment, equipmentData.Status, Convert.ToInt32(data.CurrentUserId), HistoryAction.PCRNRequired.ToString(), 0);

                              }
                              await _context.SaveChangesAsync();*/

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

                                var notificationHelper = new NotificationHelper(_context, _cloneContext);
                                if (nextTask.WorkFlowlevel == 1)
                                {
                                    await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.Approved, data.Comment, nextTask.ApproverTaskId);
                                }
                                else
                                {
                                    await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.ResultApprove, data.Comment, nextTask.ApproverTaskId);
                                }
                                //var notificationHelper = new NotificationHelper(_context, _cloneContext);
                                //await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.Approved, data.Comment, data.ApproverTaskId);

                                var equipmentForm = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == data.EquipmentId && x.IsDeleted == false && x.IsDeleted == false).FirstOrDefault();


                                //if there is another task are pending then status will be in InReview
                                if (equipmentForm != null)
                                {
                                    if (equipmentForm.WorkFlowLevel == 1)
                                    {
                                        equipmentForm.Status = ApprovalTaskStatus.InReview.ToString();
                                        equipmentForm.WorkFlowStatus = ApprovalTaskStatus.InReview.ToString();
                                        await _context.SaveChangesAsync();
                                    }
                                    if (equipmentForm.WorkFlowLevel == 2)
                                    {
                                        equipmentForm.Status = ApprovalTaskStatus.LogicalAmendmentInReview.ToString();
                                        equipmentForm.WorkFlowStatus = ApprovalTaskStatus.LogicalAmendmentInReview.ToString();
                                        await _context.SaveChangesAsync();
                                    }

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
                                    equipmentForm.WorkFlowStatus = ApprovalTaskStatus.W1Completed.ToString();
                                    await _context.SaveChangesAsync();

                                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                                    await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.W1Completed, data.Comment, data.ApproverTaskId);
                                }
                                else
                                {
                                    if (equipmentForm.IsLogicalAmend == true)
                                    {
                                        equipmentForm.Status = ApprovalTaskStatus.ResultMonitoring.ToString();
                                        equipmentForm.WorkFlowStatus = ApprovalTaskStatus.W1Completed.ToString();
                                        equipmentForm.IsLogicalAmend = false;
                                        equipmentForm.ResultMonitoring = null;
                                        equipmentForm.ResultStatus = null;
                                        equipmentForm.ResultMonitorDate = null;
                                        equipmentForm.IsResultSubmit = false;
                                        equipmentForm.TargetDate = null;
                                        equipmentForm.ActualDate = null;
                                        await _context.SaveChangesAsync();
                                    }
                                    else
                                    {
                                        equipmentForm.Status = ApprovalTaskStatus.Completed.ToString();
                                        equipmentForm.WorkFlowStatus = ApprovalTaskStatus.Completed.ToString();
                                        await _context.SaveChangesAsync();

                                        var notificationHelper = new NotificationHelper(_context, _cloneContext);
                                        await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.Completed, data.Comment, data.ApproverTaskId);
                                    }

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
                if (data.IsToshibaDiscussion == true && (equipment.ToshibaTeamDiscussion == false || equipment.ToshibaTeamDiscussion == null) && equipment.ToshibaDiscussionTargetDate == null)
                {
                    equipment.ToshibaTeamDiscussion = true;
                    //equipment.ToshibaDiscussionTargetDate = !string.IsNullOrEmpty(data.TargetDate) ? DateTime.Parse(data.TargetDate) : (DateTime?)null;
                    equipment.ToshibaDiscussionTargetDate = !string.IsNullOrEmpty(data.TargetDate)
                             ? DateTime.ParseExact(data.TargetDate, "dd-MM-yyyy", CultureInfo.InvariantCulture)
                              : (DateTime?)null;

                    equipment.Status = ApprovalTaskStatus.ToshibaTechnicalReview.ToString();
                    equipment.ToshibaDicussionComment = data.Comment;
                    equipment.IsPcrnRequired = data.IsPcrnRequired;
                    await _context.SaveChangesAsync();

                    InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Advisor", data.Comment, ApprovalTaskStatus.ToshibaTechnicalReview.ToString(), Convert.ToInt32(data.EmployeeId), HistoryAction.ToshibaDiscussionRequired.ToString(), 0);
                    
                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.ToshibaTeamDiscussion, data.Comment, 0);
               
                }
                else if (data.IsToshibaDiscussion == true)
                {
                    equipment.ToshibaTeamDiscussion = true;
                    // equipment.ToshibaDiscussionTargetDate = !string.IsNullOrEmpty(data.TargetDate) ? DateTime.Parse(data.TargetDate) : (DateTime?)null;
                    equipment.ToshibaDiscussionTargetDate = !string.IsNullOrEmpty(data.TargetDate)
                             ? DateTime.ParseExact(data.TargetDate, "dd-MM-yyyy", CultureInfo.InvariantCulture)
                              : (DateTime?)null;
                    equipment.Status = ApprovalTaskStatus.ToshibaTechnicalReview.ToString();
                    equipment.ToshibaDicussionComment = data.Comment;
                    equipment.IsPcrnRequired = data.IsPcrnRequired;
                    await _context.SaveChangesAsync();

                    InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Advisor", data.Comment, equipment.Status, Convert.ToInt32(data.EmployeeId), HistoryAction.Update.ToString(), 0);

                }
                else
                {
                    equipment.ToshibaApprovalRequired = true;
                    //equipment.ToshibaApprovalTargetDate = !string.IsNullOrEmpty(data.TargetDate) ? DateTime.Parse(data.TargetDate) : (DateTime?)null; ;
                    equipment.ToshibaApprovalTargetDate = !string.IsNullOrEmpty(data.TargetDate)
                            ? DateTime.ParseExact(data.TargetDate, "dd-MM-yyyy", CultureInfo.InvariantCulture)
                             : (DateTime?)null;
                    equipment.Status = ApprovalTaskStatus.UnderToshibaApproval.ToString();
                    equipment.ToshibaApprovalComment = data.Comment;
                    equipment.IsPcrnRequired = data.IsPcrnRequired;
                    await _context.SaveChangesAsync();

                    var approverdata = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == data.EquipmentId && x.SequenceNo == 5 && x.IsActive == true).Select(x => x.AssignedToUserId).FirstOrDefault();

                    InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Quality Review Team", data.Comment, equipment.Status, Convert.ToInt32(approverdata), HistoryAction.Update.ToString(), 0);

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
            equipmentTargetData.IsPcrnRequired = res.IsPcrnRequired;
            return equipmentTargetData;
        }

        public async Task<(List<EquipmentApproverTaskMasterAdd> WorkflowOne, List<EquipmentApproverTaskMasterAdd> WorkflowTwo)> GetEquipmentWorkFlowData(int equipmentId)
        {
            // Fetch all workflow data for the given equipmentId
            var approverData = await _context.GetEquipmentWorkFlowData(equipmentId);

            // Separate lists based on workflow level
            var workflowOne = new List<EquipmentApproverTaskMasterAdd>();
            var workflowTwo = new List<EquipmentApproverTaskMasterAdd>();

            // Process each entry and add to respective workflow list
            foreach (var entry in approverData)
            {
                if (entry.WorkFlowlevel == 1)
                {
                    workflowOne.Add(entry);
                }
                else if (entry.WorkFlowlevel == 2)
                {
                    workflowTwo.Add(entry);
                }
            }

            // Return the two lists as a tuple
            return (workflowOne, workflowTwo);
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


                // Check if data is returned
                if (excelData == null || excelData.Count == 0)
                {
                    res.StatusCode = Enums.Status.Error;
                    res.Message = "No data found for the specified parameters.";
                    return res;
                }

                using (var workbook = new XLWorkbook())
                {
                    var worksheet = workbook.Worksheets.Add("Equipment Improvement");

                    // Get properties and determine columns to exclude
                    //var properties = excelData.GetType().GetGenericArguments()[0].GetProperties();

                    // Reflect properties based on Type
                    var properties = type == 1
                        ? typeof(EquipmentExcelViewForType1).GetProperties()
                        : typeof(EquipmentExcelViewForType2).GetProperties();


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

                                // Apply the FormatStatus function to format status fields
                                if (property.Name == "Status" && value != null)
                                {
                                    stringValue = FormatStatus(stringValue);
                                }


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

        private string FormatStatus(string status)
        {
            if (string.IsNullOrEmpty(status)) return status;

            // Replace underscores with spaces and add spaces before uppercase letters
            var formattedStatus = Regex.Replace(status, "([a-z])([A-Z])", "$1 $2");

            // Add a comma before "InReview" or similar keywords
            // Add a comma before "In Review" only for "Logical Amendment In Review"
            if (formattedStatus.Contains("Logical Amendment In Review"))
            {
                formattedStatus = formattedStatus.Replace("In Review", ", In Review");
            }
            else
            {
                formattedStatus = formattedStatus.Replace("InReview", "In Review"); // Adjust this to any similar terms

            }

            return formattedStatus;
        }


        public async Task<IEnumerable<EquipmentPdfDTO>> GetEquipmentPdfData(int equipmentId)
        {
            var parameters = new { EquipmentId = equipmentId };
            var query = "EXEC dbo.EquipmentFromPdf @EquipmentId";

            using (var connection = new SqlConnection(_connectionString))
            {
                return await connection.QueryAsync<EquipmentPdfDTO>(query, parameters);
            }
        }

        private static readonly Dictionary<string, string> ColumnHeaderMapping = new Dictionary<string, string>
{

            {"EquipmentImprovementNo","Application No" },
             {"IssueDate","Issue Date" },
             {"MachineName","Machine Name" },
              {"OtherMachineName","Other Machine Name" },
              {"SubMachineName","Sub Machine Name" },
                {"OtherSubMachine","Other Sub Machine Name" },
                 {"SectionName","Section Name" },
                   {"ImprovementName","Improvement Name" },
                    {"CurrentApprover","Current Approver" }

};

        private string CapitalizeFirstLetter(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            return char.ToUpper(input[0]) + input.Substring(1);
        }

        public async Task<AjaxResult> ExportToPdf(int equipmentId)
        {
            var res = new AjaxResult();
            try
            {
                var equipmentData = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == equipmentId && x.IsDeleted == false).FirstOrDefault();

                var data = await GetEquipmentPdfData(equipmentId);

                var approvalData = await _context.GetEquipmentWorkFlowData(equipmentId);


                StringBuilder sb = new StringBuilder();
                string? htmlTemplatePath = _configuration["TemplateSettings:PdfTemplate"];
                string baseDirectory = AppContext.BaseDirectory;
                DirectoryInfo? directoryInfo = new DirectoryInfo(baseDirectory);

                //enable while work in local 
                string projectRootDirectory = Path.GetFullPath(Path.Combine(baseDirectory, @"..\..\..\"));

                string templateFile = "EquipmentPDF.html";

                string templateFilePath = Path.Combine(baseDirectory, htmlTemplatePath, templateFile);
               
                string? htmlTemplate = System.IO.File.ReadAllText(templateFilePath);
                sb.Append(htmlTemplate);

                sb.Replace("#EquipmentNo#", equipmentData?.EquipmentImprovementNo);
                sb.Replace("#Date#", equipmentData?.When?.ToString("dd-MM-yyyy") ?? "N/A");
                if (equipmentData != null)
                {
                    var machineName = _context.Machines.Where(x => x.MachineId == equipmentData.MachineId).Select(x => x.MachineName).FirstOrDefault();
                    var applicant = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == equipmentData.CreatedBy).Select(x => x.EmployeeName).FirstOrDefault();
                    sb.Replace("#MachineName#", machineName);
                    sb.Replace("#ApplicantName#", applicant);
                }
                sb.Replace("#Purpose#", equipmentData?.Purpose);
                sb.Replace("#currentSituations#", equipmentData?.CurrentSituation);
                sb.Replace("#Improvement#", equipmentData?.Imrovement);

                // Add checkbox logic based on EquipmentData.ToshibaApprovalRequired
                if (equipmentData?.ToshibaApprovalRequired == true)
                {
                    sb.Replace("#ToshibaApprovalRequiredChecked#", "checked");
                    sb.Replace("#NoToshibaApprovalRequiredChecked#", "");
                }
                else
                {
                    sb.Replace("#ToshibaApprovalRequiredChecked#", "");
                    sb.Replace("#NoToshibaApprovalRequiredChecked#", "checked");
                }

                var baseUrl = "https://synopsandbox.sharepoint.com/sites/Training2024";
                var currAttachmentUrl = _context.EquipmentCurrSituationAttachment.Where(x => x.EquipmentImprovementId == equipmentId
                         && x.IsDeleted == false)
                          .Select(x => $"{baseUrl}{x.CurrSituationDocFilePath}")
                          .ToList();

                var impAttachmentUrl = _context.EquipmentImprovementAttachment.Where(x => x.EquipmentImprovementId == equipmentId
                                 && x.IsDeleted == false)
                                  .Select(x => $"{baseUrl}{x.ImprovementDocFilePath}")
                                  .ToList();

                StringBuilder currentSituationAttachments = new StringBuilder();
                StringBuilder improvementAttachments = new StringBuilder();

                foreach (var url1 in currAttachmentUrl)
                {
                    //if (url1.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) ||
                    //             url1.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase) ||
                    //             url1.EndsWith(".png", StringComparison.OrdinalIgnoreCase) ||
                    //             url1.EndsWith(".gif", StringComparison.OrdinalIgnoreCase))
                    //{
                    //    // Add image tag
                    //    currentSituationAttachments.AppendLine($"<img src=\"{url1}\" alt=\"Attachment\" style=\"max-width: 100%; height: auto; margin-top: 10px;\" />");
                    //}
                    //else
                    //{
                        currentSituationAttachments.Append($"<a href=\"{url1}\" target=\"_blank\">{Path.GetFileName(url1)}</a><br>");
                   // }
                    
                }


                foreach (var url2 in impAttachmentUrl)
                {
                    //if (url2.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) ||
                    //             url2.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase) ||
                    //             url2.EndsWith(".png", StringComparison.OrdinalIgnoreCase) ||
                    //             url2.EndsWith(".gif", StringComparison.OrdinalIgnoreCase))
                    //{
                    //    // Add image tag
                    //    improvementAttachments.AppendLine($"<img src=\"{url2}\" alt=\"Attachment\" style=\"max-width: 100%; height: auto; margin-top: 10px;\" />");
                    //}
                    //else
                    //{
                        improvementAttachments.Append($"<a href=\"{url2}\" target=\"_blank\">{Path.GetFileName(url2)}</a><br>");

                   // }
                }

                // Replace placeholders in the HTML template
                sb.Replace("#CurrentSituationAttachments#", currentSituationAttachments.ToString());
                sb.Replace("#ImprovementAttachments#", improvementAttachments.ToString());

                StringBuilder tableBuilder = new StringBuilder();
                int serialNumber = 1;

                if(data != null && data.Any())
                {
                    foreach (var item in data)
                    {
                        tableBuilder.Append("<tr style=\"padding:10px; height: 20px;\">");

                        // Add the serial number to the first column
                        tableBuilder.Append("<td style=\"width: 3%; border: 1px solid black; height: 20px; padding: 5px\">" + serialNumber++ + "</td>");

                        // Add the rest of the data to the respective columns
                        tableBuilder.Append("<td style=\"width: 11%; border: 1px solid black; height: 20px; padding: 5px\">" + item.Changes + "</td>");
                        tableBuilder.Append("<td style=\"width: 11%; border: 1px solid black; height: 20px; padding: 5px\">" + item.FunctionId + "</td>");
                        tableBuilder.Append("<td style=\"width: 11%; border: 1px solid black; height: 20px; padding: 5px\">" + item.RiskAssociatedWithChanges + "</td>");
                        tableBuilder.Append("<td style=\"width: 11%; border: 1px solid black; height: 20px; padding: 5px\">" + item.Factor + "</td>");
                        tableBuilder.Append("<td style=\"width: 11%; border: 1px solid black; height: 20px; padding: 5px\">" + item.CounterMeasures + "</td>");
                        tableBuilder.Append("<td style=\"width: 11%; border: 1px solid black; height: 20px; padding: 5px\">" + item.DueDate + "</td>");
                        tableBuilder.Append("<td style=\"width: 11%; border: 1px solid black; height: 20px; padding: 5px\">" + item.PersonInCharge + "</td>");
                        tableBuilder.Append("<td style=\"width: 20%; border: 1px solid black; height: 20px; padding: 5px\">" + item.Results + "</td>");

                        tableBuilder.Append("</tr>");
                    }
                }
                

                sb.Replace("#ChangeriskTable#", tableBuilder.ToString());

                string approveSectioneHead = approvalData.FirstOrDefault(a => a.SequenceNo == 1)?.employeeNameWithoutCode ?? "N/A";
                string approvedByDepHead = approvalData.FirstOrDefault(a => a.SequenceNo == 3)?.employeeNameWithoutCode ?? "N/A";
                string approvedByDivHead = approvalData.FirstOrDefault(a => a.SequenceNo == 4)?.employeeNameWithoutCode ?? "N/A";
                string approvedByAdvisor = approvalData.FirstOrDefault(a => a.SequenceNo == 2)?.employeeNameWithoutCode ?? "N/A";
                string advisorComment = approvalData.FirstOrDefault(a => a.SequenceNo == 2)?.Comments ?? "N/A";
                string advisorDate = approvalData.FirstOrDefault(a => a.SequenceNo == 2)?.ActionTakenDate?.ToString("dd-MM-yyyy") ?? "N/A";
                string approverByQT = approvalData.FirstOrDefault(a => a.SequenceNo == 5)?.Comments ?? "N/A";
                string QtTeamDate = approvalData.FirstOrDefault(a => a.SequenceNo == 5)?.ActionTakenDate?.ToString("dd-MM-yyyy") ?? "N/A";

                sb.Replace("#SectionHeadName#", approveSectioneHead);
                sb.Replace("#DepartmentHeadName#", approvedByDepHead);
                sb.Replace("#DivisionHeadName#", approvedByDivHead);
                sb.Replace("#AdvisorName#", approvedByAdvisor);
                sb.Replace("#AdvisorComment#", advisorComment);
                sb.Replace("#AdvisorDate#", advisorDate);
                sb.Replace("#QTOneComment#", approverByQT);
                sb.Replace("#QTOneDate#", QtTeamDate);

                sb.Replace("#ResultStatus#", equipmentData?.ResultStatus);
                sb.Replace("#TargetDate#", equipmentData?.TargetDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#ActualDate#", equipmentData?.ActualDate?.ToString("dd-MM-yyyy") ?? "N/A");

                // Create PDF using SelectPDF
                var converter = new SelectPdf.HtmlToPdf();
                converter.Options.ExternalLinksEnabled = true; // Ensure external links (like images) are enabled
                SelectPdf.PdfDocument pdfDoc = converter.ConvertHtmlString(sb.ToString());

                // Convert the PDF to a byte array
                byte[] pdfBytes = pdfDoc.Save();

                // Encode the PDF as a Base64 string
                string base64String = Convert.ToBase64String(pdfBytes);

                // Set response values
                res.StatusCode = Enums.Status.Success;
                res.Message = Enums.MaterialPdf;
                res.ReturnValue = base64String; // Send the Base64 string to the frontend

                return res;

                //using (var ms = new MemoryStream())
                //{
                //    Document document = new Document(PageSize.A3, 10f, 10f, 10f, 30f);
                //    PdfWriter writer = PdfWriter.GetInstance(document, ms);
                //    document.Open();

                //    // Convert the StringBuilder HTML content to a PDF using iTextSharp
                //    using (var sr = new StringReader(sb.ToString()))
                //    {
                //        XMLWorkerHelper.GetInstance().ParseXHtml(writer, document, sr);
                //    }

                //    document.Close();

                //    // Convert the PDF to a byte array
                //    byte[] pdfBytes = ms.ToArray();

                //    // Encode the PDF as a Base64 string
                //    string base64String = Convert.ToBase64String(pdfBytes);

                //    // Set response values
                //    res.StatusCode = Enums.Status.Success;
                //    res.Message = Enums.MaterialPdf;
                //    res.ReturnValue = base64String; // Send the Base64 string to the frontend

                //    return res;
                //}
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex.Message;
                res.StatusCode = Enums.Status.Error;

                // Log the exception using your logging mechanism
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Equipment ExportToPdf");

            }
            return res;
        }

        #endregion
    }
}