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
                                     when = n.When.HasValue ? n.When.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                                     //deviceName = !string.IsNullOrEmpty(n.DeviceName) ? n.DeviceName.Split(',').Select(s => int.Parse(s.Trim())).ToList() : new List<int>(),
                                     purpose = n.Purpose,
                                     currentSituation = n.CurrentSituation,
                                     improvement = n.Imrovement,
                                     Status = n.Status,
                                     CreatedDate = n.CreatedDate,
                                     CreatedBy = n.CreatedBy
                                     // Add other properties as needed
                                 });

            return res;
        }

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
                when = res.When.HasValue ? res.When.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                deviceName = !string.IsNullOrEmpty(res.DeviceId) ? res.DeviceId.Split(',').Select(s => int.Parse(s.Trim())).ToList() : new List<int>(),
                purpose = res.Purpose,
                currentSituation = res.CurrentSituation,
                improvement = res.Imrovement,
                targetDate = res.TargetDate.HasValue ? res.TargetDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                actualDate = res.ActualDate.HasValue ? res.ActualDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                resultStatus = res.ResultStatus,
                pcrnDocName = res.PCRNDocName,
                pcrnFilePath = res.PCRNDocFilePath,
                Status = res.Status,
                CreatedDate = res.CreatedDate,
                CreatedBy = res.CreatedBy
                // Add other properties as needed
            };

            var changeRiskManagement = _context.ChangeRiskManagement.Where(x => x.EquipmentImprovementId == Id && x.IsDeleted == false).ToList();
            if (changeRiskManagement != null)
            {
                applicationData.ChangeRiskManagementDetails = changeRiskManagement.Select(section => new ChangeRiskManagementData
                {
                    ChangeRiskManagementId = section.ChangeRiskManagementId,
                    changes = section.Changes,
                    functionId = section.FunctionId,
                    riskAssociated = section.RiskAssociatedWithChanges,
                    factor = section.Factor,
                    counterMeasures = section.CounterMeasures,
                    dueDate = section.DueDate,
                    personInCharge = section.PersonInCharge,
                    results = section.Results

                }).ToList();

            }

            var equipmentCurrAttach = _context.EquipmentCurrSituationAttachment.Where(x => x.EquipmentImprovementId == Id && x.IsDeleted == false).ToList();
            if (equipmentCurrAttach != null)
            {
                applicationData.EquipmentCurrSituationAttachmentDetails = equipmentCurrAttach.Select(attach => new EquipmentCurrSituationAttachData
                {
                    EquipmentCurrSituationAttachmentId = attach.EquipmentCurrentSituationAttachmentId,
                    currSituationDocFilePath = attach.CurrSituationDocFilePath,
                    currSituationDocName = attach.CurrSituationDocName
                }).ToList();
            }

            var equipmentImprovementAttach = _context.EquipmentImprovementAttachment.Where(x => x.EquipmentImprovementId == Id && x.IsDeleted == false).ToList();
            if (equipmentCurrAttach != null)
            {
                applicationData.EquipmentImprovementAttachmentDetails = equipmentImprovementAttach.Select(attach => new EquipmentImprovementAttachData
                {
                    EquipmentImprovementAttachmentId = attach.EquipmentImprovementAttachmentId,
                    improvementDocName = attach.ImprovementDocName,
                    improvementDocFilePath = attach.ImprovementDocFilePath
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

                    newReport.When = DateTime.Parse(report.when);
                    newReport.DeviceId = report.deviceName != null ? string.Join(",", report.deviceName) : string.Empty;
                    newReport.Purpose = report.purpose;
                    newReport.CurrentSituation = report.currentSituation;
                    newReport.Imrovement = report.improvement;
                    newReport.PCRNDocName = report.pcrnDocName;
                    newReport.PCRNDocFilePath = report.pcrnFilePath;
                    newReport.ResultStatus = report.resultStatus;
                    newReport.ActualDate = !string.IsNullOrEmpty(report.actualDate) ? DateTime.Parse(report.actualDate) : (DateTime?)null;
                    newReport.TargetDate = !string.IsNullOrEmpty(report.targetDate) ? DateTime.Parse(report.targetDate) : (DateTime?)null;
                    newReport.IsDeleted = false;
                    newReport.CreatedDate = DateTime.Now;
                    newReport.CreatedBy = report.CreatedBy;
                    newReport.ModifiedDate = DateTime.Now;
                    newReport.ModifiedBy = report.CreatedBy;
                    _context.EquipmentImprovementApplication.Add(newReport);
                    await _context.SaveChangesAsync();

                    applicationImprovementId = newReport.EquipmentImprovementId;

                    var applicationEqipMentParams = new Microsoft.Data.SqlClient.SqlParameter("@EquipmentImprovementId", applicationImprovementId);
                    await _context.Set<TroubleReportNumberResult>()
                                .FromSqlRaw("EXEC [dbo].[SPP_GenerateEquipmentImprovementNumber] @EquipmentImprovementId", applicationEqipMentParams)
                                .ToListAsync();

                    if (report.ChangeRiskManagementDetails != null)
                    {
                        foreach (var changeReport in report.ChangeRiskManagementDetails)
                        {
                            var changeRiskData = new ChangeRiskManagement()
                            {
                                EquipmentImprovementId = newReport.EquipmentImprovementId,
                                Changes = changeReport.changes,
                                FunctionId = changeReport.functionId,
                                RiskAssociatedWithChanges = changeReport.riskAssociated,
                                Factor = changeReport.factor,
                                CounterMeasures = changeReport.counterMeasures,
                                DueDate = changeReport.dueDate,
                                PersonInCharge = changeReport.personInCharge,
                                Results = changeReport.results,
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
                                CurrSituationDocName = attach.currSituationDocName,
                                CurrSituationDocFilePath = attach.currSituationDocFilePath,
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
                                ImprovementDocFilePath = attach.improvementDocFilePath,
                                ImprovementDocName = attach.improvementDocName,
                                IsDeleted = false,
                                CreatedBy = attach.CreatedBy,
                                CreatedDate = DateTime.Now,
                            };
                            _context.EquipmentImprovementAttachment.Add(attachment);
                        }
                        await _context.SaveChangesAsync();
                    }

                    res.ReturnValue = applicationImprovementId;
                    res.Message = Enums.ApplicationEquipment;
                }
                else
                {
                    existingReport.When = DateTime.Parse(report.when);
                    existingReport.DeviceId = report.deviceName != null ? string.Join(",", report.deviceName) : string.Empty;
                    existingReport.Purpose = report.purpose;
                    existingReport.CurrentSituation = report.currentSituation;
                    existingReport.Imrovement = report.improvement;
                    existingReport.PCRNDocName = report.pcrnDocName;
                    existingReport.PCRNDocFilePath = report.pcrnFilePath;
                    existingReport.ResultStatus = report.resultStatus;
                    existingReport.ActualDate = !string.IsNullOrEmpty(report.actualDate) ? DateTime.Parse(report.actualDate) : (DateTime?)null;
                    existingReport.TargetDate = !string.IsNullOrEmpty(report.targetDate) ? DateTime.Parse(report.targetDate) : (DateTime?)null;
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
                            var existingChangeRiskData = _context.ChangeRiskManagement.Where(x => x.EquipmentImprovementId == changeReport.ApplicationImprovementId).FirstOrDefault();
                            if (existingChangeRiskData != null)
                            {
                                existingChangeRiskData.Changes = changeReport.changes;
                                existingChangeRiskData.FunctionId = changeReport.functionId;
                                existingChangeRiskData.RiskAssociatedWithChanges = changeReport.riskAssociated;
                                existingChangeRiskData.Factor = changeReport.factor;
                                existingChangeRiskData.CounterMeasures = changeReport.counterMeasures;
                                existingChangeRiskData.DueDate = changeReport.dueDate;
                                existingChangeRiskData.PersonInCharge = changeReport.personInCharge;
                                existingChangeRiskData.Results = changeReport.results;
                                existingChangeRiskData.ModifiedBy = changeReport.ModifiedBy;
                                existingChangeRiskData.ModifiedDate = DateTime.Now;
                                existingChangeRiskData.IsDeleted = false;
                            }
                            else
                            {
                                var changeRiskData = new ChangeRiskManagement()
                                {
                                    EquipmentImprovementId = existingReport.EquipmentImprovementId,
                                    Changes = changeReport.changes,
                                    FunctionId = changeReport.functionId,
                                    RiskAssociatedWithChanges = changeReport.riskAssociated,
                                    Factor = changeReport.factor,
                                    CounterMeasures = changeReport.counterMeasures,
                                    DueDate = changeReport.dueDate,
                                    PersonInCharge = changeReport.personInCharge,
                                    Results = changeReport.results,
                                    CreatedBy = changeReport.CreatedBy,
                                    CreatedDate = DateTime.Now,
                                    IsDeleted = false,
                                };
                                _context.ChangeRiskManagement.Add(changeRiskData);
                            }
                            _context.SaveChanges();
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
                                existingAttachData.CurrSituationDocName = attach.currSituationDocName;
                                existingAttachData.CurrSituationDocFilePath = attach.currSituationDocFilePath;
                                existingAttachData.IsDeleted = false;
                                existingAttachData.ModifiedBy = attach.ModifiedBy;
                                existingAttachData.ModifiedDate = DateTime.Now;
                            }
                            else
                            {
                                var attachment = new EquipmentCurrSituationAttachment()
                                {
                                    EquipmentImprovementId = existingReport.EquipmentImprovementId,
                                    CurrSituationDocName = attach.currSituationDocName,
                                    CurrSituationDocFilePath = attach.currSituationDocFilePath,
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
                                existingAttachData.ImprovementDocName = attach.improvementDocName;
                                existingAttachData.ImprovementDocFilePath = attach.improvementDocFilePath;
                                existingAttachData.IsDeleted = false;
                                existingAttachData.ModifiedBy = attach.ModifiedBy;
                                existingAttachData.ModifiedDate = DateTime.Now;
                            }
                            else
                            {
                                var attachment = new EquipmentImprovementAttachment()
                                {
                                    EquipmentImprovementId = existingReport.EquipmentImprovementId,
                                    ImprovementDocName = attach.improvementDocName,
                                    ImprovementDocFilePath = attach.improvementDocFilePath,
                                    IsDeleted = false,
                                    CreatedBy = attach.CreatedBy,
                                    CreatedDate = DateTime.Now,
                                };
                                _context.EquipmentImprovementAttachment.Add(attachment);
                            }
                            await _context.SaveChangesAsync();
                        }
                    }

                    res.Message = Enums.ApplicationEquipment;
                    res.ReturnValue = existingReport.EquipmentImprovementId;
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

    }
}
