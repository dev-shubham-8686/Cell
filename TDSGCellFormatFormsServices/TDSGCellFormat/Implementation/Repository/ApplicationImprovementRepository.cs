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
using Microsoft.Graph.Models;
using System.DirectoryServices.ActiveDirectory;


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

        #region Delegate 
        public async Task<AjaxResult> InsertDelegate(DelegateUser request)
        {
            //request.ActiveUserId -> actual userId whom the task is Assigned
            var res = new AjaxResult();
            try
            {
                var equipment = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.AssignedToUserId == request.activeUserId 
                                                                                      && (x.Status == ApprovalTaskStatus.Pending.ToString() || x.Status == ApprovalTaskStatus.InReview.ToString())
                                                                                && x.EquipmentImprovementId == request.FormId && x.IsActive == true).ToList();
                if (equipment != null)
                {
                    foreach (var user in equipment)
                    {
                        user.DelegateUserId = request.DelegateUserId;
                        user.DelegateBy = request.UserId;
                        user.DelegateOn = DateTime.Now;
                        await _context.SaveChangesAsync();
                    }
                    InsertHistoryData(request.FormId, FormType.EquipmentImprovement.ToString(), "TDSG Admin", request.Comments, ApprovalTaskStatus.InReview.ToString(), Convert.ToInt32(request.UserId), HistoryAction.Delegate.ToString(), 0);


                    var existingAdjDelegate = _context.CellDelegateMasters.Where(x => x.RequestId == request.FormId && x.FormName == ProjectType.Equipment.ToString() && x.EmployeeId == request.activeUserId).FirstOrDefault();
                    if (existingAdjDelegate != null)
                    {
                        existingAdjDelegate.DelegateUserId = request.DelegateUserId;
                        existingAdjDelegate.ModifiedDate = DateTime.Now;
                    }
                    else
                    {
                        var adjustmentDelegate = new CellDelegateMaster();
                        adjustmentDelegate.RequestId = request.FormId;
                        adjustmentDelegate.FormName = ProjectType.Equipment.ToString();
                        adjustmentDelegate.EmployeeId = request.activeUserId;
                        adjustmentDelegate.DelegateUserId = request.DelegateUserId;
                        adjustmentDelegate.CreatedDate = DateTime.Now;
                        adjustmentDelegate.CreatedBy = request.UserId;
                        _context.CellDelegateMasters.Add(adjustmentDelegate);
                    }

                    await _context.SaveChangesAsync();
                    var equipmentData = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == request.FormId && x.IsDeleted == false).FirstOrDefault();

                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.DelegateEmail(request.FormId, EmailNotificationAction.delegateUser, request.UserId, request.DelegateUserId, request.activeUserId, equipmentData.EquipmentImprovementNo, FormType.EquipmentImprovement.ToString(), request.Comments, request.FormId);

                    res.StatusCode = Enums.Status.Success;
                    res.Message = Enums.Delegate;
                }
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context, _cloneContext);
                commonHelper.LogException(ex, "Adjustment AddOrUpdate");

            }
            return res;
        }
        #endregion

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
                ImprovementCategory = !string.IsNullOrEmpty(res.ImprovementCategory) ? res.ImprovementCategory.Split(',').Select(s => int.Parse(s.Trim())).ToList() : new List<int>(),
                OtherImprovementCategory = res.OtherImprovementCategory,
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
                    newReport.ImprovementCategory = report.ImprovementCategory != null ? string.Join(",", report.ImprovementCategory) : string.Empty;
                    newReport.OtherImprovementCategory = report.ImprovementCategory != null && report.ImprovementCategory.Contains(-1)
                           ? report.OtherImprovementCategory
                           : "";
                    newReport.SectionId = report.SectionId;
                    //newReport.SectionHeadId = report.SectionHeadId;
                    newReport.AreaId = report.AreaId != null ? string.Join(",", report.AreaId) : string.Empty;
                    newReport.ImprovementName = report.ImprovementName;
                    newReport.Purpose = report.Purpose;
                    newReport.CurrentSituation = report.CurrentSituation;
                    newReport.Imrovement = report.Improvement;
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
                    //  newReport.ToshibaApprovalRequired = null;
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
                                CurrImageBytes = attach.CurrentImgBytes,
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
                                ImpImageBytes = attach.ImprovementImgBytes,
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
                        var data = await Resubmit(existingReport.EquipmentImprovementId, report.ModifiedBy);
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
                var commonHelper = new CommonHelper(_context, _cloneContext);
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

                var adminId = _context.AdminApprovers.Where(x => x.FormName == ProjectType.Equipment.ToString() && x.IsActive == true).Select(x => x.AdminId).FirstOrDefault();
                if (createdBy == adminId)
                {
                    InsertHistoryData(equipmentId, FormType.EquipmentImprovement.ToString(), "Admin", "Submit the Form", ApprovalTaskStatus.InReview.ToString(), Convert.ToInt32(adminId), HistoryAction.Submit.ToString(), 0);

                }
                else
                {
                    InsertHistoryData(equipmentId, FormType.EquipmentImprovement.ToString(), "Requestor", "Submit the Form", ApprovalTaskStatus.InReview.ToString(), Convert.ToInt32(createdBy), HistoryAction.Submit.ToString(), 0);

                }
                await _context.CallEquipmentApproverMaterix(equipment.CreatedBy, equipmentId);

                var notificationHelper = new NotificationHelper(_context, _cloneContext);
                await notificationHelper.SendEquipmentEmail(equipmentId, EmailNotificationAction.Submitted, string.Empty, 0);

                res.Message = Enums.EquipmentSubmit;
                res.StatusCode = Enums.Status.Success;

            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context, _cloneContext);
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
                    equipmentApproverTask.Comments = string.Empty;
                    equipment.Status = ApprovalTaskStatus.UnderToshibaApproval.ToString();
                    await _context.SaveChangesAsync();
                    InsertHistoryData(equipmentId, FormType.EquipmentImprovement.ToString(), "Requestor", "ReSubmit the Form", ApprovalTaskStatus.UnderToshibaApproval.ToString(), Convert.ToInt32(createdBy), HistoryAction.ReSubmitted.ToString(), 0);
                }
                else
                {
                    equipmentApproverTask.Status = ApprovalTaskStatus.InReview.ToString();
                    equipmentApproverTask.Comments = string.Empty;
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
                var commonHelper = new CommonHelper(_context, _cloneContext);
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
                existingReport.ImprovementCategory = report.ImprovementCategory != null ? string.Join(",", report.ImprovementCategory) : string.Empty;
                existingReport.OtherImprovementCategory = report.ImprovementCategory != null && report.ImprovementCategory.Contains(-1)
                       ? report.OtherImprovementCategory
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
                        var existingAttachData = _context.EquipmentCurrSituationAttachment.Where(x => x.EquipmentImprovementId == report.EquipmentImprovementId && x.EquipmentCurrentSituationAttachmentId == attach.EquipmentCurrSituationAttachmentId).FirstOrDefault();
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
                                CurrImageBytes = attach.CurrentImgBytes,
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
                        var existingAttachData = _context.EquipmentImprovementAttachment.Where(x => x.EquipmentImprovementId == report.EquipmentImprovementId && x.EquipmentImprovementAttachmentId == attach.EquipmentImprovementAttachmentId).FirstOrDefault();
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
                                ImpImageBytes = attach.ImprovementImgBytes,
                                IsDeleted = false,
                                CreatedBy = attach.CreatedBy,
                                CreatedDate = DateTime.Now,
                            };
                            _context.EquipmentImprovementAttachment.Add(attachment);
                        }
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

                var adminId = _context.AdminApprovers.Where(x => x.FormName == ProjectType.Equipment.ToString() && x.IsActive == true).Select(x => x.AdminId).FirstOrDefault();
                if (report.IsSubmit == true && report.IsAmendReSubmitTask == false && existingReport.IsLogicalAmend == false)
                {
                    var data = await SubmitRequest(existingReport.EquipmentImprovementId, report.ModifiedBy);
                    if (data.StatusCode == Enums.Status.Success)
                    {
                        res.Message = Enums.EquipmentSubmit;
                    }

                }
                else if (report.IsSubmit == true && report.IsAmendReSubmitTask == true && existingReport.IsLogicalAmend == false)
                {
                    var data = await Resubmit(existingReport.EquipmentImprovementId, report.ModifiedBy);
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
                    if (report.ModifiedBy == adminId)
                    {
                        InsertHistoryData(existingReport.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Admin", "ReSubmit the Form", ApprovalTaskStatus.LogicalAmendmentInReview.ToString(), Convert.ToInt32(adminId), HistoryAction.ReSubmitted.ToString(), 0);

                    }
                    else
                    {
                        InsertHistoryData(existingReport.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Requestor", "ReSubmit the Form", ApprovalTaskStatus.LogicalAmendmentInReview.ToString(), Convert.ToInt32(report.ModifiedBy), HistoryAction.ReSubmitted.ToString(), 0);

                    }
                }
                else
                {
                    if (report.ModifiedBy == adminId)
                    {
                        InsertHistoryData(existingReport.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Admin", "Update the Form", existingReport.Status, Convert.ToInt32(adminId), HistoryAction.Save.ToString(), 0);

                    }
                    else
                    {
                        InsertHistoryData(existingReport.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Requestor", "Update the Form", existingReport.Status, Convert.ToInt32(report.ModifiedBy), HistoryAction.Save.ToString(), 0);

                    }
                }
                return res;
            }

            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context, _cloneContext);
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
                    var adminId = _context.AdminApprovers.Where(x => x.FormName == ProjectType.Equipment.ToString() && x.IsActive == true).Select(x => x.AdminId).FirstOrDefault();

                    if (report.ModifiedBy == adminId)
                    {
                        InsertHistoryData(existingReport.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Admin", "Update Result after Implementation in Form", existingReport.Status, Convert.ToInt32(adminId), HistoryAction.Save.ToString(), 0);

                    }
                    else
                    {
                        InsertHistoryData(existingReport.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Requestor", "Update Result after Implementation in Form", existingReport.Status, Convert.ToInt32(report.ModifiedBy), HistoryAction.Save.ToString(), 0);

                    }
                }


            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context, _cloneContext);
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
                var adminId = _context.AdminApprovers.Where(x => x.FormName == ProjectType.Equipment.ToString() && x.IsActive == true).Select(x => x.AdminId).FirstOrDefault();
                if (userId == adminId)
                {
                    InsertHistoryData(equipmentId, FormType.EquipmentImprovement.ToString(), "Admin", "Submit the form", ApprovalTaskStatus.InReview.ToString(), Convert.ToInt32(adminId), HistoryAction.Submit.ToString(), 0);
                }
                else
                {
                    InsertHistoryData(equipmentId, FormType.EquipmentImprovement.ToString(), "Requestor", "Submit the form", ApprovalTaskStatus.InReview.ToString(), Convert.ToInt32(userId), HistoryAction.Submit.ToString(), 0);
                }

                await _context.CallEquipmentApproverMaterix(equipment.CreatedBy, equipmentId);

                var notificationHelper = new NotificationHelper(_context, _cloneContext);
                await notificationHelper.SendEquipmentEmail(equipmentId, EmailNotificationAction.ResultSubmit, string.Empty, 0);
                res.Message = Enums.EquipmentSubmit;
                res.StatusCode = Enums.Status.Success;

            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context, _cloneContext);
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
                // var equipmentApproverTask = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == equipmentId && x.IsActive == true && x.Status == ApprovalTaskStatus.LogicalAmendment.ToString()).FirstOrDefault();

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
                equipment.Status = ApprovalTaskStatus.InReview.ToString();
                await _context.SaveChangesAsync();

                var adminId = _context.AdminApprovers.Where(x => x.FormName == ProjectType.Equipment.ToString() && x.IsActive == true).Select(x => x.AdminId).FirstOrDefault();
                if (userId == adminId)
                {
                    InsertHistoryData(equipmentId, FormType.EquipmentImprovement.ToString(), "Admin", "ReSubmit the Form", ApprovalTaskStatus.InReview.ToString(), Convert.ToInt32(adminId), HistoryAction.ReSubmitted.ToString(), 0);
                }
                else
                {
                    InsertHistoryData(equipmentId, FormType.EquipmentImprovement.ToString(), "Requestor", "ReSubmit the Form", ApprovalTaskStatus.InReview.ToString(), Convert.ToInt32(userId), HistoryAction.ReSubmitted.ToString(), 0);
                }


                await _context.CallEquipmentApproverMaterix(equipment.CreatedBy, equipmentId);


                var notificationHelper = new NotificationHelper(_context, _cloneContext);
                await notificationHelper.SendEquipmentEmail(equipmentId, EmailNotificationAction.ReSubmitted, string.Empty, 0);

                res.Message = Enums.EquipmentResubmit;
                res.StatusCode = Enums.Status.Success;
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context, _cloneContext);
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
                // if(createdBy == admin || item.Status != ApprovalTaskStatus.Draft.ToString())
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
                    if (equipmentTask.WorkFlowLevel == 1)
                    {
                        equipmentTask.IsSubmit = false;
                        equipmentTask.IsResultSubmit = false;
                        equipmentTask.Status = ApprovalTaskStatus.Draft.ToString();
                        equipmentTask.WorkFlowStatus = ApprovalTaskStatus.Draft.ToString();
                        equipmentTask.WorkFlowLevel = 1;
                        equipmentTask.ModifiedBy = data.userId;
                        equipmentTask.ModifiedDate = DateTime.Now;
                        equipmentTask.IsPcrnRequired = false;
                        // mention the WorkFlow status 
                        await _context.SaveChangesAsync();

                        InsertHistoryData(equipmentTask.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Requestor", data.comment, ApprovalTaskStatus.Draft.ToString(), Convert.ToInt32(data.userId), HistoryAction.PullBack.ToString(), 0);
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
                        equipmentTask.ModifiedDate = DateTime.Now;
                        equipmentTask.IsPcrnRequired = false;
                        // mention the WorkFlow status 
                        await _context.SaveChangesAsync();

                        InsertHistoryData(equipmentTask.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Requestor", data.comment, ApprovalTaskStatus.ResultMonitoring.ToString(), Convert.ToInt32(data.userId), HistoryAction.PullBack.ToString(), 0);
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
                var commonHelper = new CommonHelper(_context, _cloneContext);
                commonHelper.LogException(ex, "Equipment PullbackRequest");

            }
            return res;
        }

        #endregion

        #region WorkFlow actions

        public async Task<AjaxResult> UpdateApproveAskToAmend(EquipmentApproveAsktoAmend data)
        {
            var res = new AjaxResult();
            var commonHelper = new CommonHelper(_context, _cloneContext);
            try
            {
                var notificationHelper = new NotificationHelper(_context, _cloneContext);
                var equipmentData = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.ApproverTaskId == data.ApproverTaskId && x.IsActive == true
                                     && x.EquipmentImprovementId == data.EquipmentId
                                     && (x.Status == ApprovalTaskStatus.InReview.ToString() || x.Status == ApprovalTaskStatus.UnderToshibaApproval.ToString()
                                     || x.Status == ApprovalTaskStatus.ToshibaTechnicalReview.ToString() || x.Status == ApprovalTaskStatus.LogicalAmendmentInReview.ToString())).FirstOrDefault();
                
                int substituteUserId = 0;
                bool IsSubstitute = false;
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

                    InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), equipmentData.Role, data.Comment, ApprovalTaskStatus.Rejected.ToString(), Convert.ToInt32(data.CurrentUserId), HistoryAction.Reject.ToString(), 0);

                    // InsertHistoryData(requestTaskData.MaterialConsumptionId, FormType.MaterialConsumption.ToString(), requestTaskData.Role, requestTaskData.Comments, requestTaskData.Status, Convert.ToInt32(requestTaskData.ModifiedBy), ApprovalTaskStatus.UnderAmendment.ToString(), 0);
                    //
                    //var notificationHelper = new NotificationHelper(_context, _cloneContext);
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

                    InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), equipmentData.Role, data.Comment, ApprovalTaskStatus.UnderAmendment.ToString(), Convert.ToInt32(data.CurrentUserId), HistoryAction.AskToAmend.ToString(), 0);

                    // InsertHistoryData(requestTaskData.MaterialConsumptionId, FormType.MaterialConsumption.ToString(), requestTaskData.Role, requestTaskData.Comments, requestTaskData.Status, Convert.ToInt32(requestTaskData.ModifiedBy), ApprovalTaskStatus.UnderAmendment.ToString(), 0);
                    //
                    //var notificationHelper = new NotificationHelper(_context, _cloneContext);
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

                    //var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.LogicalAmend, data.Comment, data.ApproverTaskId);
                }

                if (data.Type == ApprovalStatus.Approved)
                {
                    bool approvalHistory = true;

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

                        else if (approvalData.EmailAttachments != null && approvalData.EmailAttachments.Count > 0)
                        {
                            approvalHistory = false;
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
                            approvalHistory = false;
                            equipment.ToshibaApprovalRequired = true;
                            equipment.ToshibaApprovalComment = approvalData.Comment;
                            //equipment.ToshibaApprovalTargetDate = !string.IsNullOrEmpty(approvalData.TargetDate) ? DateTime.Parse(approvalData.TargetDate) : (DateTime?)null;
                            equipment.ToshibaApprovalTargetDate = !string.IsNullOrEmpty(approvalData.TargetDate) ?
                                                     DateTime.ParseExact(approvalData.TargetDate, "dd-MM-yyyy", CultureInfo.InvariantCulture)
                                                    : (DateTime?)null;
                            equipment.Status = ApprovalTaskStatus.UnderToshibaApproval.ToString();
                            equipmentData.Status = ApprovalTaskStatus.UnderToshibaApproval.ToString();
                            equipment.IsPcrnRequired = approvalData.IsPcrnRequired;

                            InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), equipmentData.Role, data.Comment, equipmentData.Status, Convert.ToInt32(data.CurrentUserId), HistoryAction.ToshibaApprovalRequired.ToString(), 0);
                            if (equipment.IsPcrnRequired == true)
                            {
                                InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), equipmentData.Role, data.Comment, equipmentData.Status, Convert.ToInt32(data.CurrentUserId), HistoryAction.PCRNRequired.ToString(), 0);

                            }
                            else
                            {
                                InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), equipmentData.Role, data.Comment, equipmentData.Status, Convert.ToInt32(data.CurrentUserId), HistoryAction.PCRNNotRequired.ToString(), 0);

                            }
                            //var notificationHelper = new NotificationHelper(_context, _cloneContext);
                            await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.ToshibaTeamApproval, data.Comment, 0);
                        }

                    }

                    if (approvalHistory)
                    {
                        InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), equipmentData.Role, data.Comment, equipmentData.Status, Convert.ToInt32(data.CurrentUserId), HistoryAction.Approved.ToString(), 0);
                    }

                    var currentApproverTask = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == data.EquipmentId && x.IsActive == true
                                               && x.ApproverTaskId == data.ApproverTaskId && x.Status == ApprovalTaskStatus.Approved.ToString()).FirstOrDefault();
                    if (currentApproverTask != null)
                    {
                        //var nextTask = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == equipmentData.EquipmentImprovementId && x.IsActive == true
                        // && x.Status == ApprovalTaskStatus.Pending.ToString() && x.SequenceNo == (equipmentData.SequenceNo) + 1).FirstOrDefault();

                        var nextTask = _context.EquipmentImprovementApproverTaskMasters
                                        .Where(x => x.EquipmentImprovementId == equipmentData.EquipmentImprovementId && x.IsActive == true
                                         && x.Status == ApprovalTaskStatus.Pending.ToString() && x.SequenceNo == (equipmentData.SequenceNo) + 1)
                                        .FirstOrDefault();


                        if (nextTask != null)
                        {
                            substituteUserId = commonHelper.CheckSubstituteDelegate((int)nextTask.AssignedToUserId, ProjectType.Equipment.ToString());
                            IsSubstitute = commonHelper.CheckSubstituteDelegateCheck((int)nextTask.AssignedToUserId, ProjectType.Equipment.ToString());
                            nextTask.AssignedToUserId = substituteUserId;
                            nextTask.IsSubstitute = IsSubstitute;
                            await _context.SaveChangesAsync();

                            var currentAssignedUser = currentApproverTask.DelegateUserId > 0 ? currentApproverTask.DelegateUserId : currentApproverTask.AssignedToUserId;
                            var nextAssignedUser = nextTask.DelegateUserId > 0 ? nextTask.DelegateUserId : nextTask.AssignedToUserId;

                            if (currentAssignedUser == nextAssignedUser)
                            {
                                nextTask.Comments = currentApproverTask.Comments;
                                nextTask.ActionTakenBy = currentApproverTask.AssignedToUserId;
                                nextTask.ActionTakenDate = currentApproverTask.ActionTakenDate;
                                nextTask.ModifiedBy = data.CurrentUserId;
                                nextTask.ModifiedDate = DateTime.Now;
                                nextTask.Status = ApprovalTaskStatus.AutoApproved.ToString();
                                nextTask.ModifiedDate = DateTime.Now;
                                await _context.SaveChangesAsync();

                                InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), equipmentData.Role, data.Comment, equipmentData.Status, Convert.ToInt32(data.CurrentUserId), HistoryAction.AutoApproved.ToString(), 0);

                                //var notificationHelper = new NotificationHelper(_context, _cloneContext);
                                await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.AutoApproved, data.Comment, nextTask.ApproverTaskId);

                                var nextPendingTask = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == equipmentData.EquipmentImprovementId
                                        && x.IsActive == true
                                      && x.Status == ApprovalTaskStatus.Pending.ToString() && x.SequenceNo == (nextTask.SequenceNo) + 1).FirstOrDefault();

                                if (nextPendingTask != null)
                                {
                                    substituteUserId = commonHelper.CheckSubstituteDelegate((int)nextPendingTask.AssignedToUserId, ProjectType.AdjustMentReport.ToString());
                                    IsSubstitute = commonHelper.CheckSubstituteDelegateCheck((int)nextPendingTask.AssignedToUserId, ProjectType.AdjustMentReport.ToString());

                                    nextPendingTask.AssignedToUserId = substituteUserId;
                                    nextPendingTask.IsSubstitute = IsSubstitute;
                                    nextPendingTask.Status = ApprovalTaskStatus.InReview.ToString();
                                    nextPendingTask.ModifiedDate = DateTime.Now;
                                    await _context.SaveChangesAsync();

                                    if (nextTask.WorkFlowlevel == 1)
                                    {
                                        await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.Approved, data.Comment, nextPendingTask.ApproverTaskId);
                                    }
                                    else
                                    {
                                        await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.ResultApprove, data.Comment, nextPendingTask.ApproverTaskId);
                                    }
                                }
                                else
                                {
                                    await CompleteFormTask(data);
                                }



                            }
                            else
                            {
                                // int substituteUserId = 0;
                                // int substitutePer = nextTask.AssignedToUserId ?? 0;
                                // substituteUserId = commonHelper.CheckSubstituteDelegate(substitutePer, FormType.AdjustmentReport.ToString());
                                //
                                // nextTask.AssignedToUserId = substituteUserId;

                                nextTask.Status = ApprovalTaskStatus.InReview.ToString();
                                nextTask.ModifiedDate = DateTime.Now;
                                await _context.SaveChangesAsync();

                                //var notificationHelper = new NotificationHelper(_context, _cloneContext);
                                if (nextTask.WorkFlowlevel == 1)
                                {
                                    await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.Approved, data.Comment, nextTask.ApproverTaskId);
                                }
                                else
                                {
                                    await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.ResultApprove, data.Comment, nextTask.ApproverTaskId);
                                }

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
                            }

                        }

                        else
                        {
                            // Call the HandleElsePart function here
                            await CompleteFormTask(data);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                //var commonHelper = new CommonHelper(_context, _cloneContext);
                commonHelper.LogException(ex, "Equipment UpdateApproveAskToAmend");

            }
            return res;

        }

        private async Task CompleteFormTask(EquipmentApproveAsktoAmend data)
        {
            var res = new AjaxResult();
            try
            {
                var notificationHelper = new NotificationHelper(_context, _cloneContext);
                var equipmentForm = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == data.EquipmentId && x.IsDeleted == false && x.IsDeleted == false).FirstOrDefault();
                if (equipmentForm != null)
                {
                    if (equipmentForm.WorkFlowLevel == 1)
                    {
                        equipmentForm.Status = ApprovalTaskStatus.Approved.ToString();
                        equipmentForm.WorkFlowStatus = ApprovalTaskStatus.W1Completed.ToString();
                        await _context.SaveChangesAsync();

                        //var notificationHelper = new NotificationHelper(_context, _cloneContext);
                        await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.W1Completed, data.Comment, data.ApproverTaskId);

                        if (equipmentForm.IsPcrnRequired == true)
                        {
                            //var notificationHelper = new NotificationHelper(_context, _cloneContext);
                            await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.PcrnRequired, string.Empty, 0);
                        }
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
                            //var notificationHelper = new NotificationHelper(_context, _cloneContext);
                            await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.ResultApprove, data.Comment, data.ApproverTaskId);

                        }
                        else
                        {
                            equipmentForm.Status = ApprovalTaskStatus.Completed.ToString();
                            equipmentForm.WorkFlowStatus = ApprovalTaskStatus.Completed.ToString();
                            await _context.SaveChangesAsync();

                            //var notificationHelper = new NotificationHelper(_context, _cloneContext);
                            await notificationHelper.SendEquipmentEmail(data.EquipmentId, EmailNotificationAction.Completed, data.Comment, data.ApproverTaskId);
                        }

                    }

                    //await notificationHelper.SendMaterialConsumptionEmail(materialConsumptionId, EmailNotificationAction.Completed, null, 0);
                }
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context, _cloneContext);
                commonHelper.LogException(ex, "Equipment CompleteFormTask");

            }
            //return res;
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

                    var adminId = _context.AdminApprovers.Where(x => x.FormName == ProjectType.Equipment.ToString() && x.IsActive == true).Select(x => x.AdminId).FirstOrDefault();
                    if (data.EmployeeId == adminId)
                    {
                        InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Admin", data.Comment, ApprovalTaskStatus.ToshibaTechnicalReview.ToString(), Convert.ToInt32(data.EmployeeId), HistoryAction.ToshibaDiscussionRequired.ToString(), 0);
                    }
                    else
                    {
                        InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Advisor", data.Comment, ApprovalTaskStatus.ToshibaTechnicalReview.ToString(), Convert.ToInt32(data.EmployeeId), HistoryAction.ToshibaDiscussionRequired.ToString(), 0);
                    }


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


                    var adminId = _context.AdminApprovers.Where(x => x.FormName == ProjectType.Equipment.ToString() && x.IsActive == true).Select(x => x.AdminId).FirstOrDefault();
                    if (data.EmployeeId == adminId)
                    {
                        InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Admin", data.Comment, equipment.Status, Convert.ToInt32(data.EmployeeId), HistoryAction.UpdateTargetDate.ToString(), 0);
                    }
                    else
                    {
                        InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Advisor", data.Comment, equipment.Status, Convert.ToInt32(data.EmployeeId), HistoryAction.UpdateTargetDate.ToString(), 0);
                    }


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

                    var adminId = _context.AdminApprovers.Where(x => x.FormName == ProjectType.Equipment.ToString() && x.IsActive == true).Select(x => x.AdminId).FirstOrDefault();
                    if (data.EmployeeId == adminId)
                    {
                        InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Admin", data.Comment, equipment.Status, Convert.ToInt32(adminId), HistoryAction.UpdateTargetDate.ToString(), 0);
                        if (equipment.IsPcrnRequired == true)
                        {
                            InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Admin", data.Comment, equipment.Status, Convert.ToInt32(adminId), HistoryAction.PCRNRequired.ToString(), 0);

                        }
                        else
                        {
                            InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Admin", data.Comment, equipment.Status, Convert.ToInt32(adminId), HistoryAction.PCRNNotRequired.ToString(), 0);

                        }
                    }
                    else
                    {
                        InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Quality Review Team", data.Comment, equipment.Status, Convert.ToInt32(approverdata), HistoryAction.UpdateTargetDate.ToString(), 0);
                        if (equipment.IsPcrnRequired == true)
                        {
                            InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Quality Review Team", data.Comment, equipment.Status, Convert.ToInt32(approverdata), HistoryAction.PCRNRequired.ToString(), 0);

                        }
                        else
                        {
                            InsertHistoryData(equipment.EquipmentImprovementId, FormType.EquipmentImprovement.ToString(), "Quality Review Team", data.Comment, equipment.Status, Convert.ToInt32(approverdata), HistoryAction.PCRNNotRequired.ToString(), 0);

                        }
                    }




                }
                res.Message = Enums.EquipmentDateUpdate;
                res.StatusCode = Enums.Status.Success;

            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context, _cloneContext);
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
            var materialDelegateApprovers = _context.EquipmentImprovementApproverTaskMasters.FirstOrDefault(x => x.EquipmentImprovementId == equipmentId && x.DelegateUserId == userId && x.DelegateUserId != 0 &&
           (x.Status == ApprovalTaskStatus.InReview.ToString() || x.Status == ApprovalTaskStatus.UnderToshibaApproval.ToString()
           || x.Status == ApprovalTaskStatus.ToshibaTechnicalReview.ToString() || x.Status == ApprovalTaskStatus.LogicalAmendmentInReview.ToString()) && x.IsActive == true);

            var data = new ApproverTaskId_dto();

            if (materialDelegateApprovers != null)
            {
                data.approverTaskId = materialDelegateApprovers.ApproverTaskId;
                data.userId = materialDelegateApprovers.AssignedToUserId ?? 0;
                data.status = materialDelegateApprovers.Status;
                data.seqNumber = materialDelegateApprovers.SequenceNo;
            }

            var materialApprovers = _context.EquipmentImprovementApproverTaskMasters.FirstOrDefault(x => x.EquipmentImprovementId == equipmentId && x.AssignedToUserId == userId && x.DelegateUserId == 0 &&
            (x.Status == ApprovalTaskStatus.InReview.ToString() || x.Status == ApprovalTaskStatus.UnderToshibaApproval.ToString()
            || x.Status == ApprovalTaskStatus.ToshibaTechnicalReview.ToString() || x.Status == ApprovalTaskStatus.LogicalAmendmentInReview.ToString()) && x.IsActive == true);

            //var data = new ApproverTaskId_dto();
            if (materialApprovers != null)
            {
                data.approverTaskId = materialApprovers.ApproverTaskId;
                data.userId = materialApprovers.AssignedToUserId ?? 0;
                data.status = materialApprovers.Status;
                data.seqNumber = materialApprovers.SequenceNo;

            }
            return data;
        }

        public async Task<AjaxResult> GetEmailAttachment(int id)
        {
            var res = new AjaxResult();
            var processedDataList = new List<EquipmentAttachment>();
            var equipment = _context.EquipmentEmailAttachments.Where(x => x.EquipmentImprovementId == id && x.IsDeleted == false).ToList();
            if (equipment != null && equipment.Any())
            {
                // Process each found attachment
                foreach (var item in equipment)
                {
                    var processedData = new EquipmentAttachment
                    {
                        EquipmentId = (int)item.EquipmentImprovementId,
                        EmailAttachmentId = item.EquipmentEmailAttachmenId,
                        EmailDocFilePath = item.EmailFilePath,
                        EmailDocName = item.EmailDocName
                    };
                    processedDataList.Add(processedData);
                }

            }

            res.ReturnValue = processedDataList;

            return res;
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

                // Additional filtering for Type = 3
                if (type == 3)
                {
                    var adminId = _context.AdminApprovers
                        .Where(x => x.FormName == ProjectType.Equipment.ToString() && x.IsActive == true)
                        .Select(x => x.AdminId)
                        .FirstOrDefault();

                    excelData = excelData
                        .Where(item => employeeId == adminId ||
                                       item.GetType().GetProperty("Status")?.GetValue(item)?.ToString() != ApprovalTaskStatus.Draft.ToString())
                        .ToList<object>();
                }

                using (var workbook = new XLWorkbook())
                {
                    var worksheet = workbook.Worksheets.Add("Equipment Improvement");

                    // Get properties and determine columns to exclude
                    //var properties = excelData.GetType().GetGenericArguments()[0].GetProperties();

                    // Reflect properties based on Type
                    var properties = (type == 1 || type == 3)
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
                var commonHelper = new CommonHelper(_context, _cloneContext);
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
                    {"CurrentApprover","Current Approver" },
                {"ImprovementCategory","Improvement Category" },
                 {"OtherImprovementCategory","Other Improvement Category" }

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
                    if (!string.IsNullOrEmpty(machineName))
                    {
                        sb.Replace("#MachineName#", machineName);
                    }
                    else if (!string.IsNullOrEmpty(equipmentData.OtherMachineName))
                    {
                        sb.Replace("#MachineName#", "Other - " + equipmentData.OtherMachineName);
                    }

                    var impCategoryId = string.IsNullOrEmpty(equipmentData.ImprovementCategory)
                                            ? new List<int>()  // Return an empty list if the string is null or empty
                                            : equipmentData.ImprovementCategory.Split(',')
                                                                                .Select(id => int.Parse(id))
                                        .ToList();
                    // var impCategoryId = equipmentData.ImprovementCategory.Split(',').Select(id => int.Parse(id)).ToList();
                    var impCategoryNames = new List<string>();
                    var impCategoryString = string.Empty;


                    foreach (var id in impCategoryId)
                    {
                        if (id == -1)
                        {
                           
                            if (!string.IsNullOrEmpty(equipmentData.OtherImprovementCategory))
                            {
                                impCategoryNames.Add("Other - " + equipmentData.OtherImprovementCategory); // Add "Other" category with its name
                            }
                        }

                        // Query database or use a dictionary/cache to get the name
                        var impCatName = _context.ImprovementCategoryMasters.Where(x => x.ImprovementCategoryId == id && x.IsDeleted == false).Select(x => x.ImprovementCategoryName).FirstOrDefault(); // Replace this with your actual DB logic
                        if (!string.IsNullOrEmpty(impCatName))
                        {
                            impCategoryNames.Add(impCatName);
                        }
                    }
                    impCategoryString = string.Join(", ", impCategoryNames);


                    sb.Replace("#ImpCategory#", impCategoryString);

                    sb.Replace("#ApplicantName#", applicant);
                    sb.Replace("#clsReq#", applicant);
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
                if (equipmentData?.ToshibaApprovalRequired == false)
                {
                    sb.Replace("#ToshibaApprovalRequiredChecked#", "");
                    sb.Replace("#NoToshibaApprovalRequiredChecked#", "checked");
                }

                //local
                //var baseUrl = "https://synopsandbox.sharepoint.com/sites/Training2024";
                //stage
                var baseUrl = _configuration["SPSiteUrl"];

                var currAttachmentUrl = _context.EquipmentCurrSituationAttachment.Where(x => x.EquipmentImprovementId == equipmentId
                         && x.IsDeleted == false)
                          .ToList();

                var impAttachmentUrl = _context.EquipmentImprovementAttachment.Where(x => x.EquipmentImprovementId == equipmentId
                                 && x.IsDeleted == false)
                                  .ToList();

                StringBuilder currentSituationImages = new StringBuilder();
                StringBuilder currentSituationOtherFiles = new StringBuilder();

                StringBuilder improvementImages = new StringBuilder();
                StringBuilder improvementOtherFiles = new StringBuilder();

                var imageExtensions = new List<string> { ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".tiff", ".webp", ".svg",".heif",".heic", ".cr2", ".nef", ".arw",".dng",".psd",".ico",".cur",
                                ".apng", ".tga",".pcx",".xcf" };
                // Separate images and non-images
                var currSitImageFiles = currAttachmentUrl.Where(url => imageExtensions.Any(ext => url.CurrSituationDocFilePath.EndsWith(ext, StringComparison.OrdinalIgnoreCase))).ToList();
                var currSitFiles = currAttachmentUrl.Except(currSitImageFiles).ToList();

                foreach (var url1 in currSitImageFiles)
                {
                    string bfrUrl = $"{baseUrl}{url1.CurrSituationDocFilePath}";

                    currentSituationImages.AppendLine($"<div style=\"display: inline-block; width: 48%; margin: 1%; text-align: center;\">");
                    currentSituationImages.AppendLine($"<img src=\"{url1.CurrImageBytes}\" alt=\"Attachment\" style=\"max-width: 100%; height: auto; display: block; margin-left: auto; margin-right: auto;\" />");
                    currentSituationImages.AppendLine("</div>");

                }
                // Then append other non-image files
                foreach (var url1 in currSitFiles)
                {
                    string bfrUrl = $"{baseUrl}{url1.CurrSituationDocFilePath}";
                    currentSituationOtherFiles.Append($"<a href=\"{bfrUrl}\" target=\"_blank\">{Path.GetFileName(bfrUrl)}</a><br>");
                }

                // Combine both image and non-image content
                sb.Replace("#CurrentSituationAttachments#", currentSituationImages.ToString() + currentSituationOtherFiles.ToString());

                // Separate images and non-images
                var impImageFiles = impAttachmentUrl.Where(url => imageExtensions.Any(ext => url.ImprovementDocFilePath.EndsWith(ext, StringComparison.OrdinalIgnoreCase))).ToList();
                var impFiles = impAttachmentUrl.Except(impImageFiles).ToList();

                foreach (var url2 in impImageFiles)
                {
                    // Add image tag
                    improvementImages.AppendLine($"<div style=\"display: inline-block; width: 48%; margin: 1%; text-align: center;\">");
                    improvementImages.AppendLine($"<img src=\"{url2.ImpImageBytes}\" alt=\"Attachment\" style=\"max-width: 100%; height: auto; display: block; margin-left: auto; margin-right: auto;\" />");
                    improvementImages.AppendLine("</div>");

                }
                // Then append other non-image files
                foreach (var url2 in impFiles)
                {
                    string bfrUrl = $"{baseUrl}{url2.ImprovementDocFilePath}";
                    improvementOtherFiles.Append($"<a href=\"{bfrUrl}\" target=\"_blank\">{Path.GetFileName(bfrUrl)}</a><br>");
                }

                sb.Replace("#ImprovementAttachments#", improvementImages.ToString() + improvementOtherFiles.ToString());

                StringBuilder tableBuilder = new StringBuilder();
                int serialNumber = 1;

                if (data.Any())
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
                        DateTime parsedDate;
                        tableBuilder.Append($"<td style=\"width: 11%; border: 1px solid black; height: 20px; padding: 5px\">{(DateTime.TryParse(item.DueDate, out parsedDate) ? parsedDate.ToString("dd-MM-yyyy") : "")}</td>");

                        tableBuilder.Append("<td style=\"width: 11%; border: 1px solid black; height: 20px; padding: 5px\">" + item.PersonInCharge + "</td>");
                        tableBuilder.Append("<td style=\"width: 20%; border: 1px solid black; height: 20px; padding: 5px\">" + item.Results + "</td>");

                        tableBuilder.Append("</tr>");
                    }
                }


                sb.Replace("#ChangeriskTable#", tableBuilder.ToString());

                string approveSectioneHead = approvalData.FirstOrDefault(a => a.SequenceNo == 1 && a.ActionTakenBy != null)?.employeeNameWithoutCode ?? "N/A";
                string approvedByDepHead = approvalData.FirstOrDefault(a => a.SequenceNo == 3 && a.ActionTakenBy != null)?.employeeNameWithoutCode ?? "N/A";
                string approvedByDivHead = approvalData.FirstOrDefault(a => a.SequenceNo == 5 && a.ActionTakenBy != null)?.employeeNameWithoutCode ?? "N/A";
                string approvedByDeptDivHead = approvalData.FirstOrDefault(a => a.SequenceNo == 4 && a.ActionTakenBy != null)?.employeeNameWithoutCode ?? "N/A";
                string approvedByQT= approvalData.FirstOrDefault(a => a.SequenceNo == 6 && a.ActionTakenBy != null)?.employeeNameWithoutCode ?? "N/A";

                string approvedByAdvisor = approvalData.FirstOrDefault(a => a.SequenceNo == 2 && a.ActionTakenBy != null)?.employeeNameWithoutCode ?? "N/A";

                string advisorComment = approvalData.FirstOrDefault(a => a.SequenceNo == 2)?.Comments ?? "N/A";
                string advisorDate = approvalData.FirstOrDefault(a => a.SequenceNo == 2)?.ActionTakenDate?.ToString("dd-MM-yyyy") ?? "N/A";

                sb.Replace("#SectionHeadName#", approveSectioneHead);
                sb.Replace("#DepartmentHeadName#", approvedByDepHead);
                sb.Replace("#DivisionHeadName#", approvedByDivHead);
                sb.Replace("#Advisor#", approvedByAdvisor);
                sb.Replace("#DeputyDivisionHeadName#", approvedByDeptDivHead);
                sb.Replace("#QualityTeamReview#", approvedByQT);

                sb.Replace("#AdvisorName#", approvedByAdvisor);
                sb.Replace("#AdvisorComment#", advisorComment);
                sb.Replace("#AdvisorDate#", advisorDate);

                if (equipmentData.WorkFlowLevel == 2 && equipmentData.Status == ApprovalTaskStatus.InReview.ToString())
                {
                    sb.Replace("#clsSectionHead#", approveSectioneHead);
                }
                else
                {
                    sb.Replace("#clsSectionHead#", "N/A");
                }

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
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex.Message;
                res.StatusCode = Enums.Status.Error;

                // Log the exception using your logging mechanism
                var commonHelper = new CommonHelper(_context, _cloneContext);
                commonHelper.LogException(ex, "Equipment ExportToPdf");

            }
            return res;
        }

        #endregion
    }
}