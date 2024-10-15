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
                MachineName = res.MachineId,
                SubMachineName = !string.IsNullOrEmpty(res.SubMachineId) ? res.SubMachineId.Split(',').Select(s => int.Parse(s.Trim())).ToList() : new List<int>(),
                Purpose = res.Purpose,
                SectionId = res.SectionId,
                ImprovementName = res.ImprovementName,
                CurrentSituation = res.CurrentSituation,
                Improvement = res.Imrovement,
                TargetDate = res.TargetDate.HasValue ? res.TargetDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                ActualDate = res.ActualDate.HasValue ? res.ActualDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                ResultStatus = res.ResultStatus,
                PcrnDocName = res.PCRNDocName,
                PcrnFilePath = res.PCRNDocFilePath,
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
                    newReport.ImprovementName = report.ImprovementName;
                    newReport.Purpose = report.Purpose;
                    newReport.CurrentSituation = report.CurrentSituation;
                    newReport.Imrovement = report.Improvement;
                    newReport.PCRNDocName = report.PcrnDocName;
                    newReport.PCRNDocFilePath = report.PcrnFilePath;
                    newReport.ResultStatus = report.ResultStatus;
                    newReport.ActualDate = !string.IsNullOrEmpty(report.ActualDate) ? DateTime.Parse(report.ActualDate) : (DateTime?)null;
                    newReport.TargetDate = !string.IsNullOrEmpty(report.TargetDate) ? DateTime.Parse(report.TargetDate) : (DateTime?)null;
                    newReport.IsDeleted = false;
                    newReport.CreatedDate = DateTime.Now;
                    newReport.CreatedBy = report.CreatedBy;
                    newReport.ModifiedDate = DateTime.Now;
                    newReport.ModifiedBy = report.CreatedBy;
                    newReport.IsSubmit = report.IsSubmit;
                    newReport.Status = ApprovalTaskStatus.Draft.ToString();
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
                }
                else
                {
                    existingReport.When = DateTime.Parse(report.When);
                    existingReport.MachineId = report.MachineName;
                    existingReport.SubMachineId = report.SubMachineName != null ? string.Join(",", report.SubMachineName) : string.Empty;
                    existingReport.SectionId = report.SectionId;
                    existingReport.ImprovementName = report.ImprovementName;
                    existingReport.Purpose = report.Purpose;
                    existingReport.CurrentSituation = report.CurrentSituation;
                    existingReport.Imrovement = report.Improvement;
                    existingReport.PCRNDocName = report.PcrnDocName;
                    existingReport.PCRNDocFilePath = report.PcrnFilePath;
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

    }
}
