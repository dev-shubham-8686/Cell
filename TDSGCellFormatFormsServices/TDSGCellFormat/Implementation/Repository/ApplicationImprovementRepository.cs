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
using Dapper;

namespace TDSGCellFormat.Implementation.Repository
{
    public class ApplicationImprovementRepository : BaseRepository<EquipmentImprovementApplication>, IApplicationImprovementRepository
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly TdsgCellFormatDivisionContext _context;

        public ApplicationImprovementRepository(TdsgCellFormatDivisionContext context, IConfiguration configuration)
            : base(context)
        {
            this._context = context;
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
                TargetDate = res.TargetDate.HasValue ? res.TargetDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                ActualDate = res.ActualDate.HasValue ? res.ActualDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                ResultStatus = res.ResultStatus,
                // PcrnDocName = res.PCRNDocName,
                // PcrnFilePath = res.PCRNDocFilePath,
                Status = res.Status,
                CreatedDate = res.CreatedDate,
                CreatedBy = res.CreatedBy,
                IsSubmit = res.IsSubmit
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
            if (equipmentCurrAttach != null)
            {
                applicationData.EquipmentImprovementAttachmentDetails = equipmentImprovementAttach.Select(attach => new EquipmentImprovementAttachData
                {
                    EquipmentImprovementAttachmentId = attach.EquipmentImprovementAttachmentId,
                    ImprovementDocName = attach.ImprovementDocName,
                    ImprovementDocFilePath = attach.ImprovementDocFilePath
                }).ToList();
            }

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
                    newReport.ResultStatus = report.ResultStatus;
                    newReport.ActualDate = !string.IsNullOrEmpty(report.ActualDate) ? DateTime.Parse(report.ActualDate) : (DateTime?)null;
                    newReport.TargetDate = !string.IsNullOrEmpty(report.TargetDate) ? DateTime.Parse(report.TargetDate) : (DateTime?)null;
                    newReport.IsDeleted = false;
                    newReport.CreatedDate = DateTime.Now;
                    newReport.CreatedBy = report.CreatedBy;
                    newReport.ModifiedDate = DateTime.Now;
                    newReport.ModifiedBy = report.CreatedBy;
                    newReport.IsSubmit = report.IsSubmit;
                    newReport.IsResultSubmit = report.IsResultSubmit;
                    //newReport.IsSubmit = false;
                    newReport.Status = ApprovalTaskStatus.Draft.ToString();
                    newReport.WorkFlowLevel = 0;
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
                            var attachment = new EquipmentCurrSituationAttachment()
                            {
                                EquipmentImprovementId = newReport.EquipmentImprovementId,
                                CurrSituationDocName = attach.CurrSituationDocName,
                                CurrSituationDocFilePath = attach.CurrSituationDocFilePath,
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
                            var attachment = new EquipmentImprovementAttachment()
                            {
                                EquipmentImprovementId = newReport.EquipmentImprovementId,
                                ImprovementDocFilePath = attach.ImprovementDocFilePath,
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
                    res.StatusCode = Status.Success;
                    res.Message = Enums.EquipmentSave;

                    if (report.IsSubmit == true)
                    {
                        var data = await SubmitRequest(applicationImprovementId, report.CreatedBy);
                        if (data.StatusCode == Status.Success)
                        {
                            res.Message = Enums.EquipmentSubmit;
                        }

                    }
                }
                else
                {
                    // existingReport.When = DateTime.Parse(report.When);
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
                    existingReport.ResultStatus = report.ResultStatus;
                    existingReport.ActualDate = !string.IsNullOrEmpty(report.ActualDate) ? DateTime.Parse(report.ActualDate) : (DateTime?)null;
                    existingReport.TargetDate = !string.IsNullOrEmpty(report.TargetDate) ? DateTime.Parse(report.TargetDate) : (DateTime?)null;
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
                                    CurrSituationDocFilePath = attach.CurrSituationDocFilePath,
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
                                    ImprovementDocFilePath = attach.ImprovementDocFilePath,
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
                    res.StatusCode = Status.Success;
                    res.Message = Enums.EquipmentSave;
                }
                //res.ReturnValue = report;
                return res;
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Application Equipment AddOrUpdate");
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
                //InsertHistoryData(materialConsumptionId, FormType.MaterialConsumption.ToString(), "Requestor", "Submit the Form", ApprovalTaskStatus.InReview.ToString(), Convert.ToInt32(userId), HistoryAction.Submit.ToString(), 0);

                _context.CallEquipmentApproverMaterix(createdBy, equipmentId);

                //var notificationHelper = new NotificationHelper(_context, _cloneContext);
                //await notificationHelper.SendMaterialConsumptionEmail(materialConsumptionId, EmailNotificationAction.Submitted, string.Empty, 0);
                res.Message = Enums.EquipmentSubmit;
                res.StatusCode = Status.Success;

            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Material SubmitRequest");
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

        public async Task<List<EquipmentImprovementView>> GetEqupimentImprovementApproverList(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
        {
            var listData = await _context.GetEquipmentImprovementApproverList(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
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
                    }
                }
                res.Message = Enums.MaterialPullback;
                res.StatusCode = Status.Success;
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
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
                                     && x.Status == ApprovalTaskStatus.InReview.ToString()).FirstOrDefault();
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

                    // InsertHistoryData(requestTaskData.MaterialConsumptionId, FormType.MaterialConsumption.ToString(), requestTaskData.Role, requestTaskData.Comments, requestTaskData.Status, Convert.ToInt32(requestTaskData.ModifiedBy), ApprovalTaskStatus.UnderAmendment.ToString(), 0);
                    //
                    // var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    // await notificationHelper.SendMaterialConsumptionEmail(materialConsumptionId, EmailNotificationAction.Amended, comment, ApproverTaskId);
                    //equipmentData.WorkFlowSta = ApprovalTaskStatus.Reject.ToString();
                }

                if (data.Type == ApprovalStatus.Approved)
                {
                    equipmentData.Status = ApprovalTaskStatus.UnderAmendment.ToString();
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
                        if (approvalData.AdvisorId != 0)
                        {
                            var advisorData = new EquipmentAdvisorMaster();
                            advisorData.EmployeeId = approvalData.AdvisorId;
                            advisorData.WorkFlowlevel = equipment.WorkFlowLevel;
                            advisorData.IsActive = true;
                            advisorData.EquipmentImprovementId = data.EquipmentId;
                            _context.EquipmentAdvisorMasters.Add(advisorData);
                            await _context.SaveChangesAsync();

                            var equipmentAdv = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == data.EquipmentId && x.AssignedToUserId == 0 && x.Role == "Advisor" && x.IsActive == true && x.SequenceNo == 2 && x.WorkFlowlevel == 1).FirstOrDefault();
                            equipmentAdv.AssignedToUserId = approvalData.AdvisorId;
                            await _context.SaveChangesAsync();
                        }
                        else
                        {
                            equipment.ToshibaApprovalRequired = true;
                            equipment.ToshibaApprovalTargetDate = approvalData.TargetDate;
                            //equipment.WorkFlowStatus =
                            await _context.SaveChangesAsync();
                        }

                    }

                    // equipment.Status = ApprovalTaskStatus.UnderAmendment.ToString();
                    // equipment.WorkFlowStatus = ApprovalTaskStatus.UnderAmendment.ToString();
                    // _context.SaveChangesAsync();

                    // InsertHistoryData(requestTaskData.MaterialConsumptionId, FormType.MaterialConsumption.ToString(), requestTaskData.Role, requestTaskData.Comments, requestTaskData.Status, Convert.ToInt32(requestTaskData.ModifiedBy), ApprovalTaskStatus.UnderAmendment.ToString(), 0);
                    //
                    // var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    // await notificationHelper.SendMaterialConsumptionEmail(materialConsumptionId, EmailNotificationAction.Amended, comment, ApproverTaskId);
                    //equipmentData.WorkFlowSta = ApprovalTaskStatus.Reject.ToString();

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
                                //await _context.SaveChangesAsync();
                                //await notificationHelper.SendMaterialConsumptionEmail(materialConsumptionId, EmailNotificationAction.Approved, null, nextTask.ApproverTaskId);

                            }
                            // Notification code (if applicable)
                        }
                        else
                        {
                            var equipmentForm = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == data.EquipmentId && x.IsDeleted == false && x.IsDeleted == false).FirstOrDefault();
                            if (equipmentForm != null)
                            {
                                equipmentForm.Status = ApprovalTaskStatus.Completed.ToString();
                                equipmentForm.WorkFlowStatus = ApprovalTaskStatus.W1Completed.ToString();
                                await _context.SaveChangesAsync();
                                //await notificationHelper.SendMaterialConsumptionEmail(materialConsumptionId, EmailNotificationAction.Completed, null, 0);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
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
                if(data.IsToshibaDiscussion == true)
                {
                    equipment.ToshibaTeamDiscussion = true;
                    equipment.ToshibaDiscussionTargetDate = data.TargetDate;
                    await _context.SaveChangesAsync();
                }
                else
                {
                    equipment.ToshibaApprovalRequired = true;
                    equipment.ToshibaApprovalTargetDate = data.TargetDate;
                    await _context.SaveChangesAsync();
                }
                res.Message = Enums.EquipmentDateUpdate;
                res.StatusCode = Status.Success;

            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
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
            if(toshibaDiscussion == true)
            {
                equipmentTargetData.TargetDate = res.ToshibaDiscussionTargetDate;
            }
            else
            {
                equipmentTargetData.TargetDate = res.ToshibaApprovalTargetDate;
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
        #endregion


    }
}