using Dapper;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using TDSGCellFormat.Common;
using TDSGCellFormat.Helper;
using TDSGCellFormat.Interface.Repository;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Models.View;
using static TDSGCellFormat.Common.Enums;
using iTextSharp.text.html.simpleparser;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.SharePoint.Client;
using PnP.Framework;
using iTextSharp.tool.xml;
using System.IO;
using ClosedXML.Excel;


namespace TDSGCellFormat.Implementation.Repository
{
    public class MaterialConsumptionRepository : BaseRepository<MaterialConsumptionSlip>, IMatrialConsumptionRepository
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly TdsgCellFormatDivisionContext _context;
        private readonly AepplNewCloneStageContext _cloneContext;

        public MaterialConsumptionRepository(TdsgCellFormatDivisionContext context, AepplNewCloneStageContext cloneContext, IConfiguration configuration)
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

        public async Task<object> GetMaterialConsumptionList(int createdBy, int skip, int take, string order, string orderBy, string searchColumn, string searchValue)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var command = new SqlCommand("GetMaterialConsumptionSlips", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@createdOne", createdBy);
                command.Parameters.AddWithValue("@skip", skip);
                command.Parameters.AddWithValue("@take", take);
                command.Parameters.AddWithValue("@order", order);
                command.Parameters.AddWithValue("@orderBy", orderBy);
                command.Parameters.AddWithValue("@searchColumn", searchColumn);
                command.Parameters.AddWithValue("@searchValue", searchValue);

                await connection.OpenAsync();
                var jsonResult = await command.ExecuteScalarAsync();

                return jsonResult;


            }
        }

        public async Task<List<MaterialConsumptionListView>> GetMaterialConsumptionList1(int createdBy, int skip, int take, string? order, string? orderBy, string? searchColumn, string? searchValue)
        {
            var listData = await _context.GetMaterialConsumptionList(createdBy, skip, take, order, orderBy, searchColumn, searchValue);
            var equpmentData = new List<MaterialConsumptionListView>();
            foreach (var item in listData)
            {
                equpmentData.Add(item);
            }
            return equpmentData;
        }

        public async Task<object> GetMaterialConsumptionApproverList(int createdBy, int skip, int take, string order, string orderBy, string searchColumn, string searchValue)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var command = new SqlCommand("GetMaterialConsumptionApproverList", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@EmployeeId", createdBy);
                command.Parameters.AddWithValue("@skip", skip);
                command.Parameters.AddWithValue("@take", take);
                command.Parameters.AddWithValue("@order", order);
                command.Parameters.AddWithValue("@orderBy", orderBy);
                command.Parameters.AddWithValue("@searchColumn", searchColumn);
                command.Parameters.AddWithValue("@searchValue", searchValue);

                await connection.OpenAsync();
                var jsonResult = await command.ExecuteScalarAsync();

                return jsonResult;
            }
        }

        public MaterialConsumptionSlipView GetById(int Id)
        {
            var materialConsumptionSlips = _context.MaterialConsumptionSlips
                        .Where(n => n.IsDeleted == false && n.MaterialConsumptionSlipId == Id)
                        .FirstOrDefault();

            if (materialConsumptionSlips == null)
                return null;

            var materialConsumptionSlipItems = _context.MaterialConsumptionSlipItem
                .Where(n => n.MaterialConsumptionSlipId == materialConsumptionSlips.MaterialConsumptionSlipId && n.IsDeleted == false)
                .ToList();

            var materialConsumptionSlipItemIds = materialConsumptionSlipItems
                .Select(a => a.MaterialConsumptionSlipItemId)
                .ToList();

            var requestor = _cloneContext.EmployeeMasters
                    .Where(e => e.EmployeeID == materialConsumptionSlips.CreatedBy)
                    .FirstOrDefault();

            var department = _cloneContext.DepartmentMasters
                .Where(e => e.DepartmentID == requestor.DepartmentID)
                .Select(d => d.Name)
                .FirstOrDefault();

            var materialConsumptionSlipAdd = new MaterialConsumptionSlipView()
            {
                materialConsumptionSlipId = materialConsumptionSlips.MaterialConsumptionSlipId,
                materialConsumptionSlipNo = materialConsumptionSlips.MaterialConsumptionSlipNo,
                createdDate = materialConsumptionSlips.CreatedDate?.ToString("dd-MM-yyyy"),
                requestor = requestor.EmployeeName,
                department = department,
                remarks = materialConsumptionSlips.Remarks,
                userId = materialConsumptionSlips.CreatedBy,
                status = materialConsumptionSlips.Status,
                isSubmit = materialConsumptionSlips.IsSubmit,
                employeeCode = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == materialConsumptionSlips.CreatedBy && x.IsActive == true).Select(x => x.EmployeeCode).FirstOrDefault(),
                seqNumber = _context.MaterialConsumptionApproverTaskMasters.Where(x => x.MaterialConsumptionId == Id && x.IsActive == true && x.Status == ApprovalTaskStatus.Approved.ToString())
                                           .OrderByDescending(x => x.CreatedDate).Select(x => x.SequenceNo).FirstOrDefault(),
                cpcDeptHead = _cloneContext.DepartmentMasters.Where(x => x.HRMSDeptName == "CP01-DP-1001").Select(x => x.Head).FirstOrDefault(),
                items = materialConsumptionSlipItems.Select(item => new MaterialConsumptionSlipItemAdd
                {
                    materialConsumptionSlipItemId = item.MaterialConsumptionSlipItemId,
                    categoryId = item.CategoryId,
                    materialId = item.MaterialId,
                    quantity = Convert.ToDouble(item.Quantity),
                    purpose = item.Purpose,
                    glCode = item.GLCode,
                    attachments = []
                }).ToList()
            };

            foreach (var item in materialConsumptionSlipAdd?.items)
            {
                var attachments = _context.MaterialConsumptionSlipItemAttachment
                    .Where(a => a.MaterialConsumptionSlipItemId == item.materialConsumptionSlipItemId && a.IsDeleted == false)
                    .ToList();

                item.attachments = attachments.Select(a => new MaterialConsumptionSlipItemAttachmentAdd
                {
                    materialConsumptionSlipItemAttachmentId = a.MaterialConsumptionSlipItemAttachmentId,
                    name = a.DocumentName,
                    url = a.DocumentFilePath
                }).ToList();
            }

            return materialConsumptionSlipAdd;
        }

        public async Task<AjaxResult> AddOrUpdateReport(MaterialConsumptionSlipAdd report)
        {
            var res = new AjaxResult();
            var existingReport = await _context.MaterialConsumptionSlips.FindAsync(report.materialConsumptionSlipId);
            int materialConsumptionId = 0;
            if (existingReport == null)
            {
                var newMaterialConsumptionSlip = new MaterialConsumptionSlip()
                {
                    MaterialConsumptionSlipNo = "",
                    When = DateTime.Now,
                    Remarks = report.remarks,
                    IsDeleted = false,
                    IsSubmit = report.isSubmit,
                    CreatedBy = report.userId,
                    CreatedDate = DateTime.Now,
                    ModifiedBy = report.userId,
                    ModifiedDate = DateTime.Now,
                    IsClosed = false,
                    Status = ApprovalTaskStatus.Draft.ToString()
                };

                _context.MaterialConsumptionSlips.Add(newMaterialConsumptionSlip);
                await _context.SaveChangesAsync();


                var materialConsumptionSlipIdParams = new Microsoft.Data.SqlClient.SqlParameter("@materialConsumptionSlipId", newMaterialConsumptionSlip.MaterialConsumptionSlipId);
                await _context.Set<TroubleReportNumberResult>()
                            .FromSqlRaw("EXEC [dbo].[SPP_GenerateMaterialConsumptionSlipNumber] @materialConsumptionSlipId", materialConsumptionSlipIdParams)
                            .ToListAsync();

                var troubleReportnum = _context.MaterialConsumptionSlips.Where(x => x.MaterialConsumptionSlipId == newMaterialConsumptionSlip.MaterialConsumptionSlipId && x.IsDeleted == false).Select(x => x.MaterialConsumptionSlipNo).FirstOrDefault();
                
                foreach (var item in report.items)
                {
                    var newMaterialConsumptionSlipItem = new MaterialConsumptionSlipItem()
                    {
                        MaterialConsumptionSlipId = newMaterialConsumptionSlip.MaterialConsumptionSlipId,
                        CategoryId = item.categoryId,
                        MaterialId = item.materialId,
                        Quantity = item.quantity,
                        GLCode = item.glCode,
                        Purpose = item.purpose,
                        IsDeleted = false,
                        CreatedBy = report.userId,
                        CreatedDate = DateTime.Now,
                        ModifiedBy = report.userId,
                        ModifiedDate = DateTime.Now,
                    };

                    _context.MaterialConsumptionSlipItem.Add(newMaterialConsumptionSlipItem);
                    await _context.SaveChangesAsync();
                    //// Replace the subpath with the troubleReportnum
                   
                    if (item.attachments != null && item.attachments.Count > 0)
                    {
                        foreach (var attachment in item.attachments)
                        {
                            var updatedUrl = attachment.url.Replace("/materialConsumptionSlip/", $"/{troubleReportnum}/");
                            var newAttachment = new MaterialConsumptionSlipItemAttachment()
                            {
                                MaterialConsumptionSlipItemId = newMaterialConsumptionSlipItem.MaterialConsumptionSlipItemId,
                                DocumentName = attachment.name,
                                DocumentFilePath = updatedUrl,
                                IsDeleted = false,
                                CreatedBy = report.userId,
                                CreatedDate = DateTime.Now,
                                ModifiedBy = report.userId,
                                ModifiedDate = DateTime.Now,
                            };

                            _context.MaterialConsumptionSlipItemAttachment.Add(newAttachment);
                        }

                        await _context.SaveChangesAsync();
                    }
                }

                res.StatusCode = Status.Success;
                res.Message = Enums.MaterialSave;
                res.ReturnValue = new
                {
                    MaterialConsumptionId = newMaterialConsumptionSlip.MaterialConsumptionSlipId,
                    MaterialConsumptionSlipNo = troubleReportnum
                }; 
                materialConsumptionId = newMaterialConsumptionSlip.MaterialConsumptionSlipId;

                if (report.isSubmit == true && report.isAmendReSubmitTask == false)
                {
                    var data = await SubmitRequest(materialConsumptionId, report.userId);
                    if (data.StatusCode == Status.Success)
                    {
                        res.Message = Enums.MaterialSubmit;
                    }

                }
                else if (report.isSubmit == true && report.isAmendReSubmitTask == true)
                {
                    await ReSubmitRequest(materialConsumptionId, report.userId, report.Comment);
                    res.Message = Enums.MaterialResubmit;
                }
                else
                {
                    InsertHistoryData(newMaterialConsumptionSlip.MaterialConsumptionSlipId, FormType.MaterialConsumption.ToString(), "Requestor", "Update Status as Draft", "Draft", Convert.ToInt32(report.userId), HistoryAction.Save.ToString(), 0);
                }
                
            }
            else
            {
                var materialConsumptionSlips = _context.MaterialConsumptionSlips
                        .Where(n => n.IsDeleted == false && n.MaterialConsumptionSlipId == report.materialConsumptionSlipId)
                        .FirstOrDefault();

                if (materialConsumptionSlips == null)
                    return null;

                var materialConsumptionSlipItems = _context.MaterialConsumptionSlipItem
                        .Where(n => n.MaterialConsumptionSlipId == materialConsumptionSlips.MaterialConsumptionSlipId)
                        .ToList();

                materialConsumptionSlips.Remarks = report.remarks;
                materialConsumptionSlips.ModifiedBy = report.userId;
                materialConsumptionSlips.ModifiedDate = DateTime.Now;

                await _context.SaveChangesAsync();


                var removedMaterialConsumptionSlipItem = materialConsumptionSlipItems
                    .Where(item => !report.items.Where(i => i.materialConsumptionSlipItemId.HasValue).Select(i => i.materialConsumptionSlipItemId).Contains(item.MaterialConsumptionSlipId))
                    .ToList();

                foreach (var item in removedMaterialConsumptionSlipItem)
                {
                    item.IsDeleted = true;
                }

                await _context.SaveChangesAsync();

                foreach (var item in report.items)
                {
                    var materialConsumptionSlipItem = materialConsumptionSlipItems
                        .Where(i => i.MaterialConsumptionSlipItemId == item.materialConsumptionSlipItemId)
                        .SingleOrDefault();

                    if (materialConsumptionSlipItem == null)
                    {
                        var newMaterialConsumptionSlipItem = new MaterialConsumptionSlipItem()
                        {
                            MaterialConsumptionSlipId = materialConsumptionSlips.MaterialConsumptionSlipId,
                            CategoryId = item.categoryId,
                            MaterialId = item.materialId,
                            Quantity = item.quantity,
                            GLCode = item.glCode,
                            Purpose = item.purpose,
                            IsDeleted = false,
                            CreatedBy = report.userId,
                            CreatedDate = DateTime.Now,
                            ModifiedBy = report.userId,
                            ModifiedDate = DateTime.Now,
                        };

                        _context.MaterialConsumptionSlipItem.Add(newMaterialConsumptionSlipItem);
                        await _context.SaveChangesAsync();

                        if (item.attachments != null && item.attachments.Count > 0)
                        {
                            foreach (var attachment in item.attachments)
                            {
                                var newAttachment = new MaterialConsumptionSlipItemAttachment()
                                {
                                    MaterialConsumptionSlipItemId = newMaterialConsumptionSlipItem.MaterialConsumptionSlipItemId,
                                    DocumentName = attachment.name,
                                    DocumentFilePath = attachment.url,
                                    IsDeleted = false,
                                    CreatedBy = report.userId,
                                    CreatedDate = DateTime.Now,
                                    ModifiedBy = report.userId,
                                    ModifiedDate = DateTime.Now,
                                };

                                _context.MaterialConsumptionSlipItemAttachment.Add(newAttachment);
                            }
                            await _context.SaveChangesAsync();
                        }
                    }
                    else
                    {
                        materialConsumptionSlipItem.CategoryId = item.categoryId;
                        materialConsumptionSlipItem.MaterialId = item.materialId;
                        materialConsumptionSlipItem.Quantity = item.quantity;
                        materialConsumptionSlipItem.GLCode = item.glCode;
                        materialConsumptionSlipItem.Purpose = item.purpose;
                        materialConsumptionSlipItem.ModifiedBy = report.userId;
                        materialConsumptionSlipItem.ModifiedDate = DateTime.Now;
                        materialConsumptionSlipItem.IsDeleted = false;
                        await _context.SaveChangesAsync();

                        var materialAttachItem = _context.MaterialConsumptionSlipItemAttachment.Where(x => x.MaterialConsumptionSlipItemId == item.materialConsumptionSlipItemId).ToList();

                        foreach (var attach in materialAttachItem)
                        {
                            attach.IsDeleted = true;
                        }
                        await _context.SaveChangesAsync();

                        if (item.attachments != null && item.attachments.Count > 0)
                        {
                            foreach (var attachItem in item.attachments)
                            {
                                var attachData = _context.MaterialConsumptionSlipItemAttachment.Where(x => x.MaterialConsumptionSlipItemAttachmentId == attachItem.materialConsumptionSlipItemAttachmentId).FirstOrDefault();
                                if (attachData == null)
                                {
                                    var newAttachment = new MaterialConsumptionSlipItemAttachment()
                                    {
                                        MaterialConsumptionSlipItemId = materialConsumptionSlipItem.MaterialConsumptionSlipItemId,
                                        DocumentName = attachItem.name,
                                        DocumentFilePath = attachItem.url,
                                        IsDeleted = false,
                                        CreatedBy = report.userId,
                                        CreatedDate = DateTime.Now,
                                        ModifiedBy = report.userId,
                                        ModifiedDate = DateTime.Now,
                                    };

                                    _context.MaterialConsumptionSlipItemAttachment.Add(newAttachment);
                                    await _context.SaveChangesAsync();
                                }
                                else
                                {
                                    attachData.DocumentName = attachItem.name;
                                    attachData.DocumentFilePath = attachItem.url;
                                    attachData.IsDeleted = false;
                                    attachData.ModifiedBy = report.userId;
                                    attachData.ModifiedDate = DateTime.Now;
                                    await _context.SaveChangesAsync();
                                }
                            }
                        }
                    }

                    await _context.SaveChangesAsync();

                }
               // InsertHistoryData(materialConsumptionSlips.MaterialConsumptionSlipId, FormType.MaterialConsumption.ToString(), "Requestor", "Update Status as Draft", "Draft", Convert.ToInt32(report.userId), HistoryAction.Save.ToString(), 0);

                res.StatusCode = Status.Success;
                res.Message = Enums.MaterialSave;
                res.ReturnValue = new
                {
                    MaterialConsumptionId = materialConsumptionSlips?.MaterialConsumptionSlipId,
                    MaterialConsumptionSlipNo = materialConsumptionSlips?.MaterialConsumptionSlipNo
                };
                materialConsumptionId = materialConsumptionSlips.MaterialConsumptionSlipId;

                if(report.seqNumber == 0)
                {
                    if (report.isSubmit == true && report.isAmendReSubmitTask == false)
                    {
                        var data = await SubmitRequest(materialConsumptionId, report.userId);
                        if (data.StatusCode == Status.Success)
                        {
                            res.Message = Enums.MaterialSubmit;
                        }

                    }
                    else if (report.isSubmit == true && report.isAmendReSubmitTask == true)
                    {
                        await ReSubmitRequest(materialConsumptionId, report.userId, report.Comment);
                        res.Message = Enums.MaterialResubmit;
                    }
                    else
                    {
                        InsertHistoryData(materialConsumptionSlips.MaterialConsumptionSlipId, FormType.MaterialConsumption.ToString(), "Requestor", "Update Status as Draft", "Draft", Convert.ToInt32(report.userId), HistoryAction.Save.ToString(), 0);
                    }
                }
                else
                {
                    if(report.seqNumber == 1)
                    {
                        InsertHistoryData(materialConsumptionSlips.MaterialConsumptionSlipId, FormType.MaterialConsumption.ToString(), "DepartMent Head", "Updated By DepartmentHead", "InReview", Convert.ToInt32(report.userId), HistoryAction.Save.ToString(), 0);

                    }
                    else
                    {
                        InsertHistoryData(materialConsumptionSlips.MaterialConsumptionSlipId, FormType.MaterialConsumption.ToString(), "CPC DepartMent Head", "Updated By CPC DepartmentHead", "InReview", Convert.ToInt32(report.userId), HistoryAction.Save.ToString(), 0);

                    }

                }

            }

            
            return res;
        }

        public async Task<AjaxResult> DeleteReport(int Id)
        {
            var res = new AjaxResult();
            var report =  _context.MaterialConsumptionSlips.Where(x => x.MaterialConsumptionSlipId == Id && x.IsDeleted == false).FirstOrDefault();
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
        
        public async Task<AjaxResult> SubmitRequest(int materialConsumptionId, int userId)
        {
            var res = new AjaxResult();
            try
            {
                var matrialConsumption = _context.MaterialConsumptionSlips.Where(x => x.MaterialConsumptionSlipId == materialConsumptionId && x.IsDeleted == false).FirstOrDefault();
                if (matrialConsumption != null)
                {
                    matrialConsumption.Status = ApprovalTaskStatus.InReview.ToString();
                    matrialConsumption.IsSubmit = true;
                    await _context.SaveChangesAsync();
                }
                InsertHistoryData(materialConsumptionId, FormType.MaterialConsumption.ToString(), "Requestor", "Submit the Form", ApprovalTaskStatus.InReview.ToString(), Convert.ToInt32(userId), HistoryAction.Submit.ToString(), 0);

                _context.CallMaterialConsumptionApproverMatrix(userId, materialConsumptionId);

                var notificationHelper = new NotificationHelper(_context, _cloneContext);
                await notificationHelper.SendMaterialConsumptionEmail(materialConsumptionId, EmailNotificationAction.Submitted, string.Empty, 0);
                res.Message = Enums.MaterialSubmit;
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

        public async Task<AjaxResult> UpdateApproveAskToAmend(int ApproverTaskId, int CurrentUserId, ApprovalStatus type, string comment, int materialConsumptionId)
        {
            var res = new AjaxResult();
            ///bool result = false;
            try
            {
                var requestTaskData = _context.MaterialConsumptionApproverTaskMasters.Where(x => x.ApproverTaskId == ApproverTaskId && x.IsActive == true
                                     && x.MaterialConsumptionId == materialConsumptionId
                                     && x.Status == ApprovalTaskStatus.InReview.ToString()).FirstOrDefault();
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
                    res.Message = Enums.MaterialApprove;

                    InsertHistoryData(requestTaskData.MaterialConsumptionId, FormType.MaterialConsumption.ToString(), requestTaskData.Role, requestTaskData.Comments, requestTaskData.Status, Convert.ToInt32(requestTaskData.ModifiedBy), ApprovalTaskStatus.Approved.ToString(), 0);
                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendMaterialConsumptionEmail(materialConsumptionId, EmailNotificationAction.ApproveInformed, comment, ApproverTaskId);

                    var currentApproverTask = _context.MaterialConsumptionApproverTaskMasters.Where(x => x.MaterialConsumptionId == materialConsumptionId && x.IsActive == true
                                                 && x.ApproverTaskId == ApproverTaskId && x.Status == ApprovalTaskStatus.Approved.ToString()).FirstOrDefault();
                    if (currentApproverTask != null)
                    {
                        var nextApproveTask = _context.MaterialConsumptionApproverTaskMasters.Where(x => x.MaterialConsumptionId == requestTaskData.MaterialConsumptionId && x.IsActive == true
                                 && x.Status == ApprovalTaskStatus.Pending.ToString() && x.SequenceNo == (requestTaskData.SequenceNo) + 1).ToList();
                        if (nextApproveTask.Any())
                        {
                            foreach (var nextTask in nextApproveTask)
                            {
                                nextTask.Status = ApprovalTaskStatus.InReview.ToString();
                                nextTask.ModifiedDate = DateTime.Now;
                                await _context.SaveChangesAsync();
                                await notificationHelper.SendMaterialConsumptionEmail(materialConsumptionId, EmailNotificationAction.Approved, null, nextTask.ApproverTaskId);

                            }
                            // Notification code (if applicable)
                        }
                        else
                        {
                            var troubleData = _context.MaterialConsumptionSlips.Where(x => x.MaterialConsumptionSlipId == materialConsumptionId && x.IsDeleted == false && x.IsDeleted == false).FirstOrDefault();
                            if (troubleData != null)
                            {
                                troubleData.Status = ApprovalTaskStatus.Completed.ToString();
                                await _context.SaveChangesAsync();
                                await notificationHelper.SendEmail(materialConsumptionId, EmailNotificationAction.Completed, null, 0);
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
                    res.Message = Enums.MaterialAsktoAmend;

                    var materialData = _context.MaterialConsumptionSlips.Where(x => x.MaterialConsumptionSlipId == materialConsumptionId && x.IsDeleted == false).FirstOrDefault();
                    materialData.Status = ApprovalTaskStatus.UnderAmendment.ToString();
                    InsertHistoryData(requestTaskData.MaterialConsumptionId, FormType.MaterialConsumption.ToString(), requestTaskData.Role, requestTaskData.Comments, requestTaskData.Status, Convert.ToInt32(requestTaskData.ModifiedBy), ApprovalTaskStatus.UnderAmendment.ToString(), 0);

                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendMaterialConsumptionEmail(materialConsumptionId, EmailNotificationAction.Amended, comment, ApproverTaskId);


                }
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Material UpdateApproveAskToAmend");

            }
            return res;
        }

        public async Task<AjaxResult> ReSubmitRequest(int materialConsumptionId, int userId, string comment)
        {
            var res = new AjaxResult();
            try
            {
                var matrialConsumption = _context.MaterialConsumptionSlips.Where(x => x.MaterialConsumptionSlipId == materialConsumptionId && x.IsDeleted == false).FirstOrDefault();
                if (matrialConsumption != null)
                {
                    matrialConsumption.Status = ApprovalTaskStatus.InReview.ToString();
                    await _context.SaveChangesAsync();
                }
                res.Message = Enums.MaterialResubmit;
                res.StatusCode = Status.Success;
                var approverTaskDetails = _context.MaterialConsumptionApproverTaskMasters.Where(x => x.MaterialConsumptionId == materialConsumptionId).ToList();
                approverTaskDetails.ForEach(a =>
                {
                    a.IsActive = false;
                    a.ModifiedBy = userId;
                    a.ModifiedDate = DateTime.Now;
                });
                await _context.SaveChangesAsync();
                _context.CallMaterialConsumptionApproverMatrix(userId, materialConsumptionId);
                InsertHistoryData(materialConsumptionId, FormType.MaterialConsumption.ToString(), "Requestor", "ReSubmit the Form", ApprovalTaskStatus.InReview.ToString(), Convert.ToInt32(userId), HistoryAction.ReSubmitted.ToString(), 0);
                var notificationHelper = new NotificationHelper(_context, _cloneContext);
                await notificationHelper.SendMaterialConsumptionEmail(materialConsumptionId, EmailNotificationAction.ReSubmitted, comment, 0);
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Material ReSubmitRequest");
                //return res;
            }
            return res;
        }

        public async Task<AjaxResult> PullBackRequest(int materialConsumptionId, int userId, string comment)
        {
            var res = new AjaxResult();
            try
            {
                var materialConsumption = _context.MaterialConsumptionSlips.Where(x => x.MaterialConsumptionSlipId == materialConsumptionId && x.IsDeleted == false).FirstOrDefault();
                if (materialConsumption != null)
                {
                    materialConsumption.IsSubmit = false;
                    materialConsumption.Status = ApprovalTaskStatus.Draft.ToString();
                    materialConsumption.ModifiedBy = userId;

                    await _context.SaveChangesAsync();

                    InsertHistoryData(materialConsumptionId, FormType.TroubleReport.ToString(), Enums.WorkDoneLead, comment, ApprovalTaskStatus.PullBack.ToString(), userId, ApprovalTaskStatus.PullBack.ToString(), 0);
                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendMaterialConsumptionEmail(materialConsumptionId, EmailNotificationAction.PullBack, comment, 0);

                    var approverTaskDetails = _context.MaterialConsumptionApproverTaskMasters.Where(x => x.MaterialConsumptionId == materialConsumptionId).ToList();
                    approverTaskDetails.ForEach(a =>
                    {
                        a.IsActive = false;
                        a.ModifiedBy = userId;
                        a.ModifiedDate = DateTime.Now;
                    });
                    await _context.SaveChangesAsync();

                    res.Message = Enums.MaterialPullback;
                    res.StatusCode = Status.Success;
                }
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Material PullbackRequest");
                return res;
            }
            return res;
        }

        public async Task<List<MaterialConsumptionApproverTaskMasterAdd>> GetMaterialConsumptionWorkFlow(int materialConsumptionId)
        {
            var approverData = await _context.GetMaterialWorkFlowData(materialConsumptionId);
            var processedData = new List<MaterialConsumptionApproverTaskMasterAdd>();
            foreach (var entry in approverData)
            {
                processedData.Add(entry);
            }
            return processedData;
        }

        public ApproverTaskId_dto GetCurrentApproverTask(int materialConsumptionId, int userId)
        {
            var materialApprovers = _context.MaterialConsumptionApproverTaskMasters.FirstOrDefault(x => x.MaterialConsumptionId == materialConsumptionId && x.AssignedToUserId == userId && x.Status == ApprovalTaskStatus.InReview.ToString() && x.IsActive == true);
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

        public void InsertHistoryData(int formId, string formtype, string role, string comment, string status, int actionByUserID, string actionType, int delegateUserId)
        {
            var res = new AjaxResult();
            var materialHistoryData = new MaterialConsumptionHistoryMaster()
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
            _context.MaterialConsumptionHistoryMasters.Add(materialHistoryData);
            _context.SaveChanges();
        }

        public List<TroubleReportHistoryView> GetHistoryData(int materialConsumptionId)
        {
            var troubleHistorydata = _context.MaterialConsumptionHistoryMasters.Where(x => x.FormID == materialConsumptionId && x.IsActive == true).ToList();

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

        public async Task<AjaxResult> CloseMaterial(ScrapNoteAdd report)
        {
            var res = new AjaxResult();
            try
            {
                var materialData = _context.MaterialConsumptionSlips.Where(x => x.MaterialConsumptionSlipId == report.MaterialConsumptionId && x.IsDeleted == false && x.IsClosed == false).FirstOrDefault();
                if (materialData != null)
                {
                    materialData.IsClosed = true;
                    materialData.IsScraped = report.isScraped;

                    materialData.ScrapRemarks = report.scrapRemarks;
                    materialData.ScrapTicketNo = report.scrapTicketNo;
                    materialData.Status = ApprovalTaskStatus.Closed.ToString();
                    await _context.SaveChangesAsync();
                    if(report.userId == materialData.CreatedBy)
                    {
                        InsertHistoryData(report.MaterialConsumptionId, FormType.TroubleReport.ToString(), Enums.WorkDoneLead, "Request is Closed by Requestor", ApprovalTaskStatus.Closed.ToString(), report.userId, ApprovalTaskStatus.Closed.ToString(), 0);
                    }
                    else
                    {
                        InsertHistoryData(report.MaterialConsumptionId, FormType.TroubleReport.ToString(), Enums.WorkDoneLead, "Request is Closed by CPC DepartmentHead", ApprovalTaskStatus.Closed.ToString(), report.userId, ApprovalTaskStatus.Closed.ToString(), 0);

                    }


                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendMaterialConsumptionEmail(report.MaterialConsumptionId, EmailNotificationAction.Closed, string.Empty, report.userId);

                }
                res.Message = Enums.MaterialClose;
                res.StatusCode = Status.Success;
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "CloseMaterial");
                return res;
            }
            return res;
        }


        #region Export to excel
        public async Task<IEnumerable<MaterialConsumptionSlipDto>> GetMaterialConsumptionSlipData(int materialConsumptionId)
        {
            var parameters = new { MaterialConsumptionSlipId = materialConsumptionId };
            var query = "EXEC dbo.MaterialConsumptionSlipExcel @MaterialConsumptionSlipId";

            using (var connection = new SqlConnection(_connectionString))
            {
                return await connection.QueryAsync<MaterialConsumptionSlipDto>(query, parameters);
            }
        }

        public async Task<AjaxResult> ExportMaterialConsumptionToExcel(int materialConsumptionId)
        {
            var res = new AjaxResult();

            try
            {

                // Fetch the data based on the provided ID
                var data = await GetMaterialConsumptionSlipData(materialConsumptionId);

                if (data == null || !data.Any())
                {
                    res.StatusCode = Status.Error;
                    res.Message = "No data found for the given Material Consumption ID.";
                    return res;
                }
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (var package = new ExcelPackage())
                {
                    var worksheet = package.Workbook.Worksheets.Add("Material Consumption Slip");

                    // Add Request No and Date at the top
                    worksheet.Cells[1, 1].Value = "Requestor Dept:";
                    worksheet.Cells[1, 1].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    worksheet.Cells[1, 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightPink);
                    worksheet.Cells[1, 2].Value = data.FirstOrDefault()?.Department;

                    worksheet.Cells[1, 4].Value = "Request No:";
                    worksheet.Cells[1, 4].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    worksheet.Cells[1, 4].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightPink);
                    worksheet.Cells[1, 5].Value = data.FirstOrDefault()?.RequestNo; // Assuming same request number for all records

                    worksheet.Cells[1, 7].Value = "Date:";
                    worksheet.Cells[1, 7].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    worksheet.Cells[1, 7].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightPink);
                    worksheet.Cells[1, 8].Value = data.FirstOrDefault()?.Date.ToString("dd/MM/yyyy"); // Format the date

                    // Add some space between the top info and the table header
                    int startRow = 3;

                    // Add header row
                    worksheet.Cells[startRow, 1].Value = "Sr. No.";
                    worksheet.Cells[startRow, 1].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    worksheet.Cells[startRow, 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightBlue);

                    worksheet.Cells[startRow, 2].Value = "Category";
                    worksheet.Cells[startRow, 2].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    worksheet.Cells[startRow, 2].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightBlue);

                    worksheet.Cells[startRow, 3].Value = "Material Description";
                    worksheet.Cells[startRow, 3].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    worksheet.Cells[startRow, 3].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightBlue);

                    worksheet.Cells[startRow, 4].Value = "Material No";
                    worksheet.Cells[startRow, 4].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    worksheet.Cells[startRow, 4].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightBlue);

                    worksheet.Cells[startRow, 5].Value = "Quantity";
                    worksheet.Cells[startRow, 5].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    worksheet.Cells[startRow, 5].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightBlue);

                    worksheet.Cells[startRow, 6].Value = "UOM";
                    worksheet.Cells[startRow, 6].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    worksheet.Cells[startRow, 6].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightBlue);

                    worksheet.Cells[startRow, 7].Value = "Cost Center";
                    worksheet.Cells[startRow, 7].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    worksheet.Cells[startRow, 7].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightBlue);

                    worksheet.Cells[startRow, 8].Value = "Purpose";
                    worksheet.Cells[startRow, 8].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    worksheet.Cells[startRow, 8].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightBlue);
                    worksheet.Cells[startRow, 8].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                    worksheet.Cells[startRow, 8].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                    worksheet.Cells[startRow, 8].Style.WrapText = true;

                    // Add data rows
                    int row = startRow + 1;
                    int serialNumber = 1;

                    foreach (var item in data)
                    {
                        worksheet.Cells[row, 1].Value = serialNumber++;
                        worksheet.Cells[row, 2].Value = item.Category;
                        worksheet.Cells[row, 3].Value = item.MaterialDescription;
                        worksheet.Cells[row, 4].Value = item.MaterialNo;
                        worksheet.Cells[row, 5].Value = item.Quantity;
                        worksheet.Cells[row, 6].Value = item.UOM;
                        worksheet.Cells[row, 7].Value = item.CostCenter;
                        worksheet.Cells[row, 8].Value = item.Purpose;
                        row++;
                    }

                    // Add Remarks at the end
                    worksheet.Cells[row + 1, 1].Value = "Remarks :";
                    worksheet.Cells[row + 1, 1].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    worksheet.Cells[row + 1, 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightPink);
                    worksheet.Cells[row + 1, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                    worksheet.Cells[row + 1, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                    worksheet.Cells[row + 1, 1].Style.WrapText = true;
                    worksheet.Cells[row + 1, 2].Value = data.FirstOrDefault()?.Remarks;


                    // Adjust column widths to fit the content
                    worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                    // Convert the Excel package to a byte array
                    var excelBytes = package.GetAsByteArray();

                    // Convert byte array to base64 string
                    string base64String = Convert.ToBase64String(excelBytes);

                    // Set the response
                    res.StatusCode = Status.Success;
                    res.Message = Enums.MaterialExcel;
                    res.ReturnValue = base64String;
                    return res;
                }
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex.Message;
                res.StatusCode = Status.Error;

                // Log the exception using your logging mechanism
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "ExportMaterialConsumptionToExcel");

                return res;
            }
        }

        public async Task<AjaxResult> ExportToPdf(int materialConsumptionId)
        {
            var res = new AjaxResult();
            try
            {
                var materialdata = _context.MaterialConsumptionSlips.Where(x => x.MaterialConsumptionSlipId == materialConsumptionId && x.IsDeleted == false).FirstOrDefault();
                //normal data
                var data = await GetMaterialConsumptionSlipData(materialConsumptionId);

                //approvers data
                var approverData = await _context.GetMaterialWorkFlowData(materialConsumptionId);
               
                StringBuilder sb = new StringBuilder();
                string? htmlTemplatePath = _configuration["TemplateSettings:PdfTemplate"];
                string baseDirectory = AppContext.BaseDirectory;
                DirectoryInfo? directoryInfo = new DirectoryInfo(baseDirectory);

                string templateFile = "MaterialConsumptionPDF.html";

                string templateFilePath = Path.Combine(baseDirectory, htmlTemplatePath, templateFile);

                string? htmlTemplate = System.IO.File.ReadAllText(templateFilePath);
                sb.Append(htmlTemplate);

                sb.Replace("#MaterialNo#", data.FirstOrDefault()?.RequestNo);
                sb.Replace("#RequestorDept#", data.FirstOrDefault()?.Department);
                sb.Replace("#Date#", data.FirstOrDefault()?.Date.ToString("dd-MM-yyyy"));
                sb.Replace("#Remarks#", data.FirstOrDefault()?.Remarks);

                StringBuilder tableBuilder = new StringBuilder();
                int serialNumber = 1;
                foreach (var item in data)
                {
                    tableBuilder.Append("<tr style=\"padding:10px; height: 20px;\">");

                    // Add the serial number to the first column
                    tableBuilder.Append("<td style=\"width:10%; border:0.25px; height: 20px; padding: 5px\">" + serialNumber++ + "</td>");

                    // Add the rest of the data to the respective columns
                    tableBuilder.Append("<td style=\"width:10%; border:0.25px; height: 20px; padding: 5px\">" + item.Category + "</td>");
                    tableBuilder.Append("<td style=\"width:20%; border:0.25px; height: 20px; padding: 5px\">" + item.MaterialDescription + "</td>");
                    tableBuilder.Append("<td style=\"width:10%; border:0.25px; height: 20px; padding: 5px\">" + item.MaterialNo + "</td>");
                    tableBuilder.Append("<td style=\"width:10%; border:0.25px; height: 20px; padding: 5px\">" + item.Quantity + "</td>");
                    tableBuilder.Append("<td style=\"width:10%; border:0.25px; height: 20px; padding: 5px\">" + item.UOM + "</td>");
                    tableBuilder.Append("<td style=\"width:10%; border:0.25px; height: 20px; padding: 5px\">" + item.CostCenter + "</td>");
                    tableBuilder.Append("<td style=\"width:10%; border:0.25px; height: 20px; padding: 5px\">" + item.GLCode + "</td>");
                    tableBuilder.Append("<td style=\"width:20%; border:0.25px; height: 20px; padding: 5px\">" + item.Purpose + "</td>");

                    tableBuilder.Append("</tr>");
                }
                sb.Replace("#ItemTable#", tableBuilder.ToString());

                string reqName = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == materialdata.CreatedBy && x.IsActive == true).Select(x => x.EmployeeName).FirstOrDefault();
                string approvedByDepHead = approverData.FirstOrDefault(a => a.SequenceNo == 1)?.employeeNameWithoutCode ?? "N/A";
                string approvedByCPC = approverData.FirstOrDefault(a => a.SequenceNo == 2)?.employeeNameWithoutCode ?? "N/A";
                string approvedByDivHead = approverData.FirstOrDefault(a => a.SequenceNo == 3)?.employeeNameWithoutCode ?? "N/A";

                sb.Replace("#RequestorName#", reqName);
                sb.Replace("#HODName#", approvedByDepHead);
                sb.Replace("#CPCName#", approvedByCPC);
                sb.Replace("#DivHeadName#", approvedByDivHead);

                DateTime? depHeadDate = approverData.FirstOrDefault(a => a.SequenceNo == 1)?.ActionTakenDate;
                DateTime? cpcDate = approverData.FirstOrDefault(a => a.SequenceNo == 2)?.ActionTakenDate;
                DateTime? divHeadDate = approverData.FirstOrDefault(a => a.SequenceNo == 3)?.ActionTakenDate;

                sb.Replace("#CreatedDate#", materialdata.CreatedDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#HODapproveDate#", depHeadDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#CPCapproveDate#", cpcDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#DivHeadapproveDate#", divHeadDate?.ToString("dd-MM-yyyy") ?? "N/A");

                using (var ms = new MemoryStream())
                {
                    Document document = new Document(PageSize.A3, 10f, 10f, 10f, 30f);
                    PdfWriter writer = PdfWriter.GetInstance(document, ms);
                    document.Open();

                    // Convert the StringBuilder HTML content to a PDF using iTextSharp
                    using (var sr = new StringReader(sb.ToString()))
                    {
                        XMLWorkerHelper.GetInstance().ParseXHtml(writer, document, sr);
                    }

                    document.Close();

                    // Convert the PDF to a byte array
                    byte[] pdfBytes = ms.ToArray();

                    // Encode the PDF as a Base64 string
                    string base64String = Convert.ToBase64String(pdfBytes);

                    // Set response values
                    res.StatusCode = Status.Success;
                    res.Message = Enums.MaterialPdf;
                    res.ReturnValue = base64String; // Send the Base64 string to the frontend

                    return res;
                }
            }

            catch (Exception ex)
            {
                res.Message = "Fail " + ex.Message;
                res.StatusCode = Status.Error;

                // Log the exception using your logging mechanism
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "ExportToPdf");

                return res;
            }
        }

        public async Task<AjaxResult> GetMaterialConsumptionExcel(DateTime fromDate, DateTime toDate, int employeeId, int type)
        {
            var res = new AjaxResult();

            try
            {

                var excelData = await _context.GetMaterialExcel(fromDate, toDate, employeeId, type);
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
                commonHelper.LogException(ex, "GetMaterialConsumptionExcel");
                return res;
            }
        }

        private static readonly Dictionary<string, string> ColumnHeaderMapping = new Dictionary<string, string>
{
    { "WhenDate", "When Date" },
            {"MaterialConsumptionSlipNo","Request No" }
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
