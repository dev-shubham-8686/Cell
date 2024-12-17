using Castle.Components.DictionaryAdapter.Xml;
using ClosedXML.Excel;
using Dapper;
using DocumentFormat.OpenXml.Bibliography;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.EntityFrameworkCore;
using OfficeOpenXml;
using Org.BouncyCastle.Asn1.X509;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Net.Mail;
using System.Text;
using TDSGCellFormat.Common;
using TDSGCellFormat.Helper;
using TDSGCellFormat.Interface.Repository;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using TDSGCellFormat.Models.View;
using IronPdf;
using static TDSGCellFormat.Common.Enums;
using PnP.Framework.Modernization.Cache;
using System.Text.RegularExpressions;
using static IronPdf.PdfPrintOptions;
using PnP.Framework.Extensions;

namespace TDSGCellFormat.Implementation.Repository
{
    public class TechnicalInstructionRepository : BaseRepository<TechnicalInstructionSheet>, ITechnicalInsurtuctionRepository
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly TdsgCellFormatDivisionContext _context;
        private readonly AepplNewCloneStageContext _cloneContext;


        public TechnicalInstructionRepository(TdsgCellFormatDivisionContext context, AepplNewCloneStageContext cloneContext, IConfiguration configuration)
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

        #region Not Use

        public IQueryable<TechnicalInstructionAdd> GetAll()
        {

            IQueryable<TechnicalInstructionAdd> res = _context.TechnicalInstructionSheets
                                  .Where(n => n.IsDeleted == false)  // Filter out deleted records
                                  .Select(n => new TechnicalInstructionAdd
                                  {
                                      TechnicalId = n.TechnicalId,
                                      when = n.When.HasValue ? n.When.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                                      title = n.Title,
                                      purpose = n.Purpose,
                                      productType = n.ProductType,
                                      quantity = n.Quantity,
                                      outline = n.Outline,
                                      tisApplicabilityDate = n.TISApplicable.HasValue ? n.TISApplicable.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                                      attachment = n.Attachment,
                                      status = n.Status,
                                      userId = n.CreatedBy,
                                      // Add other properties as needed
                                  });

            return res;

        }
        #endregion

        public async Task<string> GetTechnicalInstructionList(int createdBy, int skip, int take, string order, string orderBy, string searchColumn, string searchValue)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var command = new SqlCommand("GetTechnicalInstructionList", connection)
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

                return Convert.ToString(jsonResult);


            }
        }

        #region ApproverList

        public async Task<string> GetTechnicalInstructionApproverList(int createdBy, int skip, int take, string order, string orderBy, string searchColumn, string searchValue)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var command = new SqlCommand("GetTechnicalInstructionApproverList", connection)
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

                return Convert.ToString(jsonResult);
            }
        }

        #endregion

        #region Form CRUD
        public async Task<string> GetTechnicalInsurtuctionListUpdate(int createdBy, int skip, int take, string order, string orderBy, string searchColumn, string searchValue)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var command = new SqlCommand("GetTechnicalInstructionListUpdate", connection)
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

                return Convert.ToString(jsonResult);


            }
        }

        public TechnicalInstructionView GetById(int Id)
        {
            var technicalInstruction = _context.TechnicalInstructionSheets
                                  .Where(n => n.IsDeleted == false && n.TechnicalId == Id).FirstOrDefault();

            if (technicalInstruction == null) return null;

            var requestor = _cloneContext.EmployeeMasters
                   .Where(e => e.EmployeeID == technicalInstruction.CreatedBy)
                   .FirstOrDefault();

            var department = _cloneContext.DepartmentMasters
                .Where(e => e.DepartmentID == requestor.DepartmentID)
                .Select(d => d.Name)
                .FirstOrDefault();

            var res = new TechnicalInstructionView
            {
                TechnicalId = technicalInstruction.TechnicalId,
                when = technicalInstruction.When.HasValue ? technicalInstruction.When.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                title = technicalInstruction.Title,
                issueDate = technicalInstruction.IssueDate.HasValue ? technicalInstruction.IssueDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                issuedBy = technicalInstruction.IssuedBy,
                ctiNumber = technicalInstruction.CTINumber,
                revisionNo = technicalInstruction.RevisionNo,
                purpose = technicalInstruction.Purpose,
                productType = technicalInstruction.ProductType,
                quantity = technicalInstruction.Quantity,
                outline = technicalInstruction.Outline,
                tisApplicabilityDate = technicalInstruction.TISApplicable.HasValue ? technicalInstruction.TISApplicable.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                lotNo = technicalInstruction.LotNo,
                targetClosureDate = technicalInstruction.TargetClosureDate.HasValue ? technicalInstruction.TargetClosureDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                attachment = technicalInstruction.Attachment,
                applicationStartDate = technicalInstruction.ApplicationStartDate.HasValue ? technicalInstruction.ApplicationStartDate.Value.ToString("dd-MM-yyyy HH:mm:ss") : string.Empty,
                applicationLotNo = technicalInstruction.ApplicationLotNo,
                applicationEquipment = technicalInstruction.ApplicationEquipment,
                status = technicalInstruction.Status,
                userId = technicalInstruction.CreatedBy,
                isSubmit = technicalInstruction.IsSubmit,
                employeeCode = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == technicalInstruction.CreatedBy && x.IsActive == true).Select(x => x.EmployeeCode).FirstOrDefault(),
                seqNumber = _context.TechnicalInstructionApproverTaskMasters.Where(x => x.TechnicalId == Id && x.IsActive == true && x.Status == ApprovalTaskStatus.Approved.ToString())
                                            .OrderByDescending(x => x.CreatedDate).Select(x => x.SequenceNo).FirstOrDefault(),
                sectionHead = _context.TechnicalInstructionApproverTaskMasters.Where(x => x.TechnicalId == Id && x.IsActive == true && x.SequenceNo == 1).Select(c => c.AssignedToUserId).FirstOrDefault(),
                requestor = requestor.EmployeeName,
                department = department,
                createdDate = technicalInstruction.CreatedDate?.ToString("dd-MM-yyyy"),
                isClosed = technicalInstruction.IsClosed,
                otherEquipment = technicalInstruction.OtherEquipment
            };

            if (technicalInstruction != null)
            {
                var getEquipments = _context.TechnicalEquipmentMasterItems
                                            .Where(c => c.TechnicalId == Id)
                                            .Select(c => c.EquipmentId)
                                            .ToList();

                res.equipmentIds = getEquipments.Any() ? getEquipments : new List<int?>();

                var getAttachments = _context.TechnicalAttachments.Where(c => c.IsDeleted == false && c.TechnicalId == Id)
               .Select(c => new TechnicalAttachmentAdd
               {
                   TechnicalAttachmentId = c.TechnicalAttachmentId,
                   TechnicalId = c.TechnicalId,
                   DocumentName = c.DocumentName,
                   DocumentFilePath = c.DocumentFilePath
               }).ToList();

                res.technicalAttachmentAdds = getAttachments.Any() ? getAttachments : new List<TechnicalAttachmentAdd?>();

                var getOutlineAttachments = _context.TechnicalOutlineAttachments.Where(c => c.IsDeleted == false && c.TechnicalId == Id)
               .Select(c => new TechnicalOutlineAttachmentAdd
               {
                   TechnicalOutlineAttachmentId = c.TechnicalOutlineAttachmentId,
                   TechnicalId = c.TechnicalId,
                   DocumentName = c.DocumentName,
                   DocumentFilePath = c.DocumentFilePath
               }).ToList();

                var getClosureAttachments = _context.TechnicalClosureAttachments.Where(c => c.IsDeleted == false && c.TechnicalId == Id)
                .Select(c => new TechnicalClosureAttachmentAdd
                {
                    TechnicalClosureAttachmentId = c.TechnicalClosureAttachmentId,
                    TechnicalId = c.TechnicalId,
                    DocumentName = c.DocumentName,
                    DocumentFilePath = c.DocumentFilePath
                }).ToList();

                res.technicalClosureAttachmentAdds = getClosureAttachments.Any() ? getClosureAttachments : new List<TechnicalClosureAttachmentAdd?>();
            }

            return res;

        }

        public async Task<AjaxResult> AddOrUpdateReport(TechnicalInstructionAdd report)
        {
            var res = new AjaxResult();

            var existingReport = await _context.TechnicalInstructionSheets.FindAsync(report.TechnicalId);
            int technicalId = 0;
            if (existingReport == null)
            {
                var newReport = new TechnicalInstructionSheet()
                {
                    When = !string.IsNullOrEmpty(report.when) ? DateTime.Parse(report.when) : (DateTime?)null,
                    Title = report.title,
                    IssueDate = !string.IsNullOrEmpty(report.issueDate) ? DateTime.Parse(report.issueDate) : (DateTime?)null,
                    IssuedBy = report.issuedBy,
                    CTINumber = "",
                    RevisionNo = 0,
                    Purpose = report.purpose,
                    ProductType = report.productType,
                    Quantity = report.quantity,
                    Outline = report.outline,
                    TISApplicable = !string.IsNullOrEmpty(report.tisApplicabilityDate) ? DateTime.Parse(report.tisApplicabilityDate) : (DateTime?)null,
                    LotNo = report.lotNo,
                    TargetClosureDate = !string.IsNullOrEmpty(report.targetClosureDate) ? DateTime.Parse(report.targetClosureDate) : (DateTime?)null,
                    Attachment = report.attachment,
                    ApplicationStartDate = !string.IsNullOrEmpty(report.applicationStartDate) ? DateTime.Parse(report.applicationStartDate) : (DateTime?)null,
                    ApplicationLotNo = report.applicationLotNo,
                    ApplicationEquipment = report.applicationEquipment,
                    IsDeleted = false,
                    CreatedDate = DateTime.Now,
                    CreatedBy = report.userId,
                    IsSubmit = report.isSubmit ?? false,
                    Status = ApprovalTaskStatus.Draft.ToString(),
                    //ModifiedDate = DateTime.Now,
                    //ModifiedBy = report.CreatedBy,
                    IsClosed = false,
                    IsReOpen = false
                };

                _context.TechnicalInstructionSheets.Add(newReport);

                await _context.SaveChangesAsync();

                _context.TechnicalRevisonMapLists.Add(new TechnicalRevisonMapList { TechnicalId = newReport.TechnicalId, UserId = report.userId });
                //newReport.CTINumber = $"CTI-{DateTime.Now.Year}-{newReport.TechnicalId:D4}";

                var technicalInstructionIdParams = new Microsoft.Data.SqlClient.SqlParameter("@technicalId", newReport.TechnicalId);
                _context.Set<TechnicalInstructionCTINumberResult>()
                           .FromSqlRaw("EXEC [dbo].[SPP_GenerateTechnicalInstructionCTINumber] @technicalId", technicalInstructionIdParams)
                           .ToList();


                var technicalInstructionCTINumber = await _context.TechnicalInstructionSheets.Where(c => c.TechnicalId == newReport.TechnicalId && c.IsDeleted == false).Select(c => c.CTINumber).FirstOrDefaultAsync();
                report.ctiNumber = technicalInstructionCTINumber;
                newReport.CTINumber = technicalInstructionCTINumber;

                if (report.equipmentIds != null && report.equipmentIds.Count > 0)
                {
                    if (report.equipmentIds[0] == -1)
                    {
                        newReport.OtherEquipment = report.otherEquipment;
                    }
                    else
                    {
                        var objs = report.equipmentIds.Select(id => new TechnicalEquipmentMasterItems
                        {
                            EquipmentId = id,
                            TechnicalId = newReport.TechnicalId
                        }).ToList();

                        _context.TechnicalEquipmentMasterItems.AddRange(objs);
                        //await _context.SaveChangesAsync();
                    }
                }

                if (report.technicalAttachmentAdds != null && report.technicalAttachmentAdds.Count > 0)
                {
                    var objs = report.technicalAttachmentAdds.Select(c => new TechnicalAttachment
                    {
                        DocumentName = c.DocumentName,
                        DocumentFilePath = $"/TechnicalSheetDocs/{newReport.CTINumber}/RelatedDocuments/{c.DocumentName}",
                        TechnicalId = newReport.TechnicalId,
                        IsDeleted = false,
                        CreatedDate = DateTime.Now,
                        CreatedBy = report.userId
                    }).ToList();

                    _context.TechnicalAttachments.AddRange(objs);
                    //await _context.SaveChangesAsync();
                }

                if (report.technicalOutlineAttachmentAdds != null && report.technicalOutlineAttachmentAdds.Count > 0)
                {
                    var objs = report.technicalOutlineAttachmentAdds.Select(c => new TechnicalOutlineAttachment
                    {
                        DocumentName = c.DocumentName,
                        DocumentFilePath = $"/TechnicalSheetDocs/{newReport.CTINumber}/OutlineAttachment/{c.DocumentName}",
                        TechnicalId = newReport.TechnicalId,
                        IsDeleted = false,
                        CreatedDate = DateTime.Now,
                        CreatedBy = report.userId
                    }).ToList();

                    _context.TechnicalOutlineAttachments.AddRange(objs);
                    //await _context.SaveChangesAsync();
                }

                await _context.SaveChangesAsync();

                report.TechnicalId = newReport.TechnicalId;
                //report.ctiNumber = newReport.CTINumber;


                technicalId = newReport.TechnicalId;
                if (report.isSubmit == true && report.isAmendReSubmitTask == false)
                {
                    //report.sectionId = 2;

                    var data = await SubmitRequest(technicalId, report.userId ?? 0, report.sectionId ?? 0);
                    if (data.StatusCode == Status.Success)
                    {
                        res.Message = Enums.TechnicalSubmit;
                    }

                }
                else if (report.isSubmit == true && report.isAmendReSubmitTask == true)
                {
                    await ReSubmitRequest(technicalId, report.userId ?? 0, report.comment ?? "ReSubmit Request", report.sectionId ?? 0);
                    res.Message = Enums.TechnicalResubmit;

                }
                else
                {
                    InsertHistoryData(newReport.TechnicalId, FormType.TechnicalInstruction.ToString(), "Requestor", "Update Status as Draft", "Draft", Convert.ToInt32(report.userId), HistoryAction.Save.ToString(), 0);
                }

                res.Message = "Record Created Successfully";
            }
            else
            {
                existingReport.When = !string.IsNullOrEmpty(report.when) ? DateTime.Parse(report.when) : (DateTime?)null;
                existingReport.Title = report.title;
                existingReport.IssueDate = !string.IsNullOrEmpty(report.issueDate) ? DateTime.Parse(report.issueDate) : (DateTime?)null;
                existingReport.IssuedBy = report.issuedBy;
                //existingReport.CTINumber = report.ctiNumber;
                //existingReport.RevisionNo = report.revisionNo;
                existingReport.Purpose = report.purpose;
                existingReport.ProductType = report.productType;
                existingReport.Quantity = report.quantity;
                existingReport.Outline = report.outline;
                existingReport.TISApplicable = !string.IsNullOrEmpty(report.tisApplicabilityDate) ? DateTime.Parse(report.tisApplicabilityDate) : (DateTime?)null;
                existingReport.TargetClosureDate = !string.IsNullOrEmpty(report.targetClosureDate) ? DateTime.Parse(report.targetClosureDate) : (DateTime?)null;
                existingReport.LotNo = report.lotNo;
                existingReport.Attachment = report.attachment;
                existingReport.ApplicationStartDate = !string.IsNullOrEmpty(report.applicationStartDate) ? DateTime.Parse(report.applicationStartDate) : (DateTime?)null;
                existingReport.ApplicationLotNo = report.applicationLotNo;
                existingReport.ApplicationEquipment = report.applicationEquipment;
                //existingReport.ProductType = report.productType;
                //existingReport.Quantity = report.quantity;
                //existingReport.Outline = report.outline;
                //existingReport.TISApplicable = DateTime.Parse(report.tisApplicabilityDate);
                //existingReport.Attachment = report.attachment;
                //existingReport.IsDeleted = false;
                existingReport.ModifiedDate = DateTime.Now;
                existingReport.ModifiedBy = report.userId;

                var getTechnicalEquipments = await _context.TechnicalEquipmentMasterItems
                                               .Where(c => c.TechnicalId == report.TechnicalId)
                                               .ToListAsync();

                _context.TechnicalEquipmentMasterItems.RemoveRange(getTechnicalEquipments);

                if (report.equipmentIds != null && report.equipmentIds.Count > 0)
                {
                    if (report.equipmentIds[0] == -1)
                    {
                        existingReport.OtherEquipment = report.otherEquipment;
                    }
                    else
                    {
                        existingReport.OtherEquipment = null;

                       var objs = report.equipmentIds.Select(id => new TechnicalEquipmentMasterItems
                        {
                            EquipmentId = id,
                            TechnicalId = report.TechnicalId
                        }).ToList();

                        _context.TechnicalEquipmentMasterItems.AddRange(objs);
                    }
                    
                }

                if (report.technicalAttachmentAdds != null && report.technicalAttachmentAdds.Count > 0)
                {
                    var objs = report.technicalAttachmentAdds.Select(c => new TechnicalAttachment
                    {
                        DocumentName = c.DocumentName,
                        DocumentFilePath = $"/TechnicalSheetDocs/{existingReport.CTINumber}/RelatedDocuments/{c.DocumentName}",
                        TechnicalId = report.TechnicalId,
                        IsDeleted = false,
                        CreatedDate = DateTime.Now,
                        CreatedBy = report.userId

                    }).ToList();

                    _context.TechnicalAttachments.AddRange(objs);
                    // await _context.SaveChangesAsync();
                }

                if (report.technicalOutlineAttachmentAdds != null && report.technicalOutlineAttachmentAdds.Count > 0)
                {
                    var objs = report.technicalOutlineAttachmentAdds.Select(c => new TechnicalOutlineAttachment
                    {
                        DocumentName = c.DocumentName,
                        DocumentFilePath = $"/TechnicalSheetDocs/{existingReport.CTINumber}/OutlineAttachment/{c.DocumentName}",
                        TechnicalId = report.TechnicalId,
                        IsDeleted = false,
                        CreatedDate = DateTime.Now,
                        CreatedBy = report.userId

                    }).ToList();

                    _context.TechnicalOutlineAttachments.AddRange(objs);
                    // await _context.SaveChangesAsync();
                }

                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }


                technicalId = existingReport.TechnicalId;

                if (report.seqNumber == 0)
                {
                    if (report.isSubmit == true && report.isAmendReSubmitTask == false)
                    {
                        var data = await SubmitRequest(technicalId, report.userId ?? 0, report.sectionId ?? 0);
                        if (data.StatusCode == Status.Success)
                        {
                            res.Message = Enums.TechnicalSubmit;
                        }

                    }
                    else if (report.isSubmit == true && report.isAmendReSubmitTask == true)
                    {
                        await ReSubmitRequest(technicalId, report.userId ?? 0, report.comment ?? "ReSubmit Request", report.sectionId ?? 0);
                        res.Message = Enums.TechnicalResubmit;
                    }
                    else
                    {
                        InsertHistoryData(technicalId, FormType.TechnicalInstruction.ToString(), "Requestor", "Update Status as Draft", "Draft", Convert.ToInt32(report.userId), HistoryAction.Save.ToString(), 0);
                    }
                }
                else
                {
                    if (report.seqNumber == 1)
                    {
                        InsertHistoryData(technicalId, FormType.TechnicalInstruction.ToString(), "DepartMent Head", "Updated By DepartmentHead", "InReview", Convert.ToInt32(report.userId), HistoryAction.Save.ToString(), 0);

                    }
                    else
                    {
                        InsertHistoryData(technicalId, FormType.TechnicalInstruction.ToString(), "CPC DepartMent Head", "Updated By CPC DepartmentHead", "InReview", Convert.ToInt32(report.userId), HistoryAction.Save.ToString(), 0);

                    }

                }
            }

            res.ReturnValue = report;
            return res;

        }

        public async Task<AjaxResult> DeleteReport(int Id)
        {
            var res = new AjaxResult();
            var report = await _context.TechnicalInstructionSheets.FindAsync(Id);
            if (report == null)
            {
                res.StatusCode = Status.Error;
                res.Message = "Record Not Found";
            }
            else
            {
                if(report.TechnicalReviseId != null && report.IsReOpen == false)
                {
                    var child_record = await _context.TechnicalInstructionSheets.FindAsync(report.TechnicalReviseId);
                    child_record.IsReOpen = false;
                    await _context.SaveChangesAsync();
                }

                report.IsDeleted = true;
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

        public async Task<AjaxResult> UpdateOutlineEditor(UpdateOutlineEditor updateOutlineEditor)
        {
            var res = new AjaxResult();
            var existingReport = await _context.TechnicalInstructionSheets.FindAsync(updateOutlineEditor.TechnicalId);

            if (existingReport != null)
            {
                existingReport.Outline = updateOutlineEditor.outline;
                //existingReport.OutlineImageBytes = updateOutlineEditor.outlineImageBytes;

                await _context.SaveChangesAsync();

                updateOutlineEditor.outline = existingReport.Outline;

                res.ReturnValue = updateOutlineEditor;
            }

            return res;
        }

        #endregion

        #region Attachment

        public async Task<IEnumerable<TechnicalAttachmentAdd>> GetTechnicalAttachmentList(int TechnicalId)
        {
            List<TechnicalAttachmentAdd> res = await _context.TechnicalAttachments.Where(c => c.IsDeleted == false && c.TechnicalId == TechnicalId)
                .Select(c => new TechnicalAttachmentAdd
                {
                    TechnicalAttachmentId = c.TechnicalAttachmentId,
                    TechnicalId = c.TechnicalId,
                    DocumentName = c.DocumentName,
                    DocumentFilePath = c.DocumentFilePath
                }).ToListAsync();

            return res;
        }

        public async Task<AjaxResult> DeleteTechnicalAttachment(int TechnicalAttachmentId)
        {
            var res = new AjaxResult();
            var report = await _context.TechnicalAttachments.FindAsync(TechnicalAttachmentId);
            if (report == null)
            {
                res.StatusCode = Status.Error;
                res.Message = "Record Not Found";
            }
            else
            {
                report.IsDeleted = true;
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

        public async Task<AjaxResult> DeleteTechnicalOutlineAttachment(int TechnicalOutlineAttachmentId)
        {
            var res = new AjaxResult();
            var report = await _context.TechnicalOutlineAttachments.FindAsync(TechnicalOutlineAttachmentId);
            if (report == null)
            {
                res.StatusCode = Status.Error;
                res.Message = "Record Not Found";
            }
            else
            {
                report.IsDeleted = true;
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

        public async Task<AjaxResult> CreateTechnicalAttachment(TechnicalAttachmentAdd technicalAttachmentAdd)
        {
            var res = new AjaxResult();

            var getTechnicalInstructionSheets = await _context.TechnicalInstructionSheets.FindAsync(technicalAttachmentAdd.TechnicalId);

            if (getTechnicalInstructionSheets != null)
            {
                var newTechnicalAttachment = new TechnicalAttachment
                {
                    DocumentName = technicalAttachmentAdd.DocumentName,
                    DocumentFilePath = $"/TechnicalSheetDocs/{getTechnicalInstructionSheets.CTINumber}/RelatedDocuments/{technicalAttachmentAdd.DocumentName}",
                    TechnicalId = technicalAttachmentAdd.TechnicalId,
                    IsDeleted = false,
                    CreatedBy = technicalAttachmentAdd.CreatedBy,
                    CreatedDate = DateTime.Now
                };

                _context.TechnicalAttachments.Add(newTechnicalAttachment);
                await _context.SaveChangesAsync();

                technicalAttachmentAdd.DocumentFilePath = newTechnicalAttachment.DocumentFilePath;
            }

            res.ReturnValue = technicalAttachmentAdd;
            return res;
        }

        public async Task<AjaxResult> CreateTechnicalOutlineAttachment(TechnicalOutlineAttachmentAdd technicalOutlineAttachmentAdd)
        {
            var res = new AjaxResult();

            var getTechnicalInstructionSheets = await _context.TechnicalInstructionSheets.FindAsync(technicalOutlineAttachmentAdd.TechnicalId);

            if (getTechnicalInstructionSheets != null)
            {
                var newTechnicalOutlineAttachment = new TechnicalOutlineAttachment
                {
                    DocumentName = technicalOutlineAttachmentAdd.DocumentName,
                    DocumentFilePath = $"/TechnicalSheetDocs/{getTechnicalInstructionSheets.CTINumber}/OutlineAttachment/{technicalOutlineAttachmentAdd.DocumentName}",
                    TechnicalId = technicalOutlineAttachmentAdd.TechnicalId,
                    IsDeleted = false,
                    CreatedBy = technicalOutlineAttachmentAdd.CreatedBy,
                    CreatedDate = DateTime.Now
                };

                _context.TechnicalOutlineAttachments.Add(newTechnicalOutlineAttachment);
                await _context.SaveChangesAsync();

                technicalOutlineAttachmentAdd.DocumentFilePath = technicalOutlineAttachmentAdd.DocumentFilePath;
            }

            res.ReturnValue = technicalOutlineAttachmentAdd;
            return res;
        }

        #endregion

        #region WrokFlow Request

        public void InsertHistoryData(int formId, string formtype, string role, string comment, string status, int actionByUserID, string actionType, int delegateUserId)
        {
            var res = new AjaxResult();
            var technicalInstructionHistoryData = new TechnicalInstructionHistoryMaster()
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
            _context.TechnicalInstructionHistoryMasters.Add(technicalInstructionHistoryData);
            _context.SaveChanges();
        }

        public async Task<AjaxResult> SubmitRequest(int technicalId, int userId, int sectionId)
        {
            var res = new AjaxResult();
            try
            {
                var technicalInstruction = _context.TechnicalInstructionSheets.Where(x => x.TechnicalId == technicalId && x.IsDeleted == false).FirstOrDefault();
                if (technicalInstruction != null)
                {
                    technicalInstruction.Status = ApprovalTaskStatus.InReview.ToString();
                    technicalInstruction.IsSubmit = true;
                    await _context.SaveChangesAsync();
                }
                InsertHistoryData(technicalId, FormType.TechnicalInstruction.ToString(), "Requestor", "Submit the Form", ApprovalTaskStatus.InReview.ToString(), Convert.ToInt32(userId), HistoryAction.Submit.ToString(), 0);

                _context.CallTechnicalInstructionApproverMatrix(userId, technicalId, sectionId);

                var notificationHelper = new NotificationHelper(_context, _cloneContext);
                await notificationHelper.SendTechanicalInstructionEmail(technicalId, EmailNotificationAction.Submitted, string.Empty, 0);
                res.Message = Enums.TechnicalSubmit;
                res.StatusCode = Status.Success;

            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Technical SubmitRequest");
                //return res;
            }
            return res;
        }

        public async Task<AjaxResult> ReSubmitRequest(int technicalId, int userId, string comment, int sectionId)
        {
            var res = new AjaxResult();
            try
            {
                var technicalInstruction = await _context.TechnicalInstructionSheets.Where(x => x.TechnicalId == technicalId && x.IsDeleted == false).FirstOrDefaultAsync();
                if (technicalInstruction != null)
                {
                    technicalInstruction.Status = ApprovalTaskStatus.InReview.ToString();
                    await _context.SaveChangesAsync();
                }
                res.Message = Enums.TechnicalResubmit;
                res.StatusCode = Status.Success;
                var approverTaskDetails = await _context.TechnicalInstructionApproverTaskMasters.Where(x => x.TechnicalId == technicalId).ToListAsync();
                approverTaskDetails.ForEach(a =>
                {
                    a.IsActive = false;
                    a.ModifiedBy = userId;
                    a.ModifiedDate = DateTime.Now;
                });

                await _context.SaveChangesAsync();
                _context.CallTechnicalInstructionApproverMatrix(userId, technicalId, sectionId);
                InsertHistoryData(technicalId, FormType.TechnicalInstruction.ToString(), "Requestor", "ReSubmit the Form", ApprovalTaskStatus.InReview.ToString(), Convert.ToInt32(userId), HistoryAction.ReSubmitted.ToString(), 0);
                var notificationHelper = new NotificationHelper(_context, _cloneContext);
                await notificationHelper.SendTechanicalInstructionEmail(technicalId, EmailNotificationAction.ReSubmitted, "ReSubmit the Form", 0);
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Technical ReSubmitRequest");
                //return res;
            }
            return res;
        }

        public async Task<AjaxResult> ReSubmitRequestV2(int technicalId, int userId, string comment, int? sectionId)
        {
            var res = new AjaxResult();
            try
            {
                var technicalInstruction = await _context.TechnicalInstructionSheets.Where(x => x.TechnicalId == technicalId && x.IsDeleted == false).FirstOrDefaultAsync();
                if (technicalInstruction != null)
                {
                    technicalInstruction.Status = ApprovalTaskStatus.InReview.ToString();
                    await _context.SaveChangesAsync();
                }
                res.Message = Enums.TechnicalResubmit;
                res.StatusCode = Status.Success;
                //var approverTaskDetails = await _context.TechnicalInstructionApproverTaskMasters.Where(x => x.TechnicalId == technicalId).ToListAsync();
                //approverTaskDetails.ForEach(a =>
                //{
                //    a.IsActive = false;
                //    a.ModifiedBy = userId;
                //    a.ModifiedDate = DateTime.Now;
                //});

                //When flow want to start as before under-amendment
                var approverTaskDetails_GetUnderAmendment = await _context.TechnicalInstructionApproverTaskMasters.Where(x => x.TechnicalId == technicalId && x.Status == ApprovalTaskStatus.UnderAmendment.ToString() && x.IsActive == true).FirstOrDefaultAsync();
                approverTaskDetails_GetUnderAmendment.Status = ApprovalTaskStatus.InReview.ToString();

                await _context.SaveChangesAsync();
                //_context.CallTechnicalInstructionApproverMatrix(userId, technicalId, sectionId);
                InsertHistoryData(technicalId, FormType.TechnicalInstruction.ToString(), "Requestor", comment, ApprovalTaskStatus.InReview.ToString(), Convert.ToInt32(userId), HistoryAction.ReSubmitted.ToString(), 0);
                var notificationHelper = new NotificationHelper(_context, _cloneContext);
                await notificationHelper.SendTechanicalInstructionEmail(technicalId, EmailNotificationAction.ReSubmitted, comment, 0);
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Technical ReSubmitRequest");
                //return res;
            }
            return res;
        }

        public async Task<AjaxResult> UpdateApproveAskToAmend(int ApproverTaskId, int CurrentUserId, ApprovalStatus type, string comment, int technicalId)
        {
            var res = new AjaxResult();
            ///bool result = false;
            try
            {
                var requestTaskData = _context.TechnicalInstructionApproverTaskMasters.Where(x => x.ApproverTaskId == ApproverTaskId && x.IsActive == true
                                     && x.TechnicalId == technicalId
                                     && x.Status == ApprovalTaskStatus.InReview.ToString()).FirstOrDefault();
                if (requestTaskData == null)
                {
                    res.Message = "Technical request does not have any review task";
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
                    res.Message = Enums.TechnicalApprove;

                    InsertHistoryData(requestTaskData.TechnicalId, FormType.TechnicalInstruction.ToString(), requestTaskData.Role, requestTaskData.Comments, requestTaskData.Status, Convert.ToInt32(requestTaskData.ModifiedBy), ApprovalTaskStatus.Approved.ToString(), 0);
                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendTechanicalInstructionEmail(technicalId, EmailNotificationAction.ApproveInformed, comment, ApproverTaskId);

                    var currentApproverTask = _context.TechnicalInstructionApproverTaskMasters.Where(x => x.TechnicalId == technicalId && x.IsActive == true
                                                 && x.ApproverTaskId == ApproverTaskId && x.Status == ApprovalTaskStatus.Approved.ToString()).FirstOrDefault();
                    if (currentApproverTask != null)
                    {
                        var nextApproveTask = _context.TechnicalInstructionApproverTaskMasters.Where(x => x.TechnicalId == requestTaskData.TechnicalId && x.IsActive == true
                                 && x.Status == ApprovalTaskStatus.Pending.ToString() && x.SequenceNo == (requestTaskData.SequenceNo) + 1).ToList();

                        if (nextApproveTask.Any())
                        {
                            foreach (var nextTask in nextApproveTask)
                            {
                                nextTask.Status = ApprovalTaskStatus.InReview.ToString();
                                nextTask.ModifiedDate = DateTime.Now;
                                await _context.SaveChangesAsync();
                                await notificationHelper.SendTechanicalInstructionEmail(technicalId, EmailNotificationAction.Approved, null, nextTask.ApproverTaskId);

                            }
                            // Notification code (if applicable)
                        }
                        else
                        {
                            var technicalData = _context.TechnicalInstructionSheets.Where(x => x.TechnicalId == technicalId && x.IsDeleted == false && x.IsDeleted == false).FirstOrDefault();
                            if (technicalData != null)
                            {
                                technicalData.Status = ApprovalTaskStatus.Completed.ToString();
                                await _context.SaveChangesAsync();
                                await notificationHelper.SendTechanicalInstructionEmail(technicalId, EmailNotificationAction.Completed, null, 0);
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
                    res.Message = Enums.TechnicalAsktoAmend;

                    var materialData = _context.TechnicalInstructionSheets.Where(x => x.TechnicalId == technicalId && x.IsDeleted == false).FirstOrDefault();
                    materialData.Status = ApprovalTaskStatus.UnderAmendment.ToString();
                    InsertHistoryData(requestTaskData.TechnicalId, FormType.TechnicalInstruction.ToString(), requestTaskData.Role, requestTaskData.Comments, requestTaskData.Status, Convert.ToInt32(requestTaskData.ModifiedBy), ApprovalTaskStatus.UnderAmendment.ToString(), 0);

                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendTechanicalInstructionEmail(technicalId, EmailNotificationAction.Amended, comment, ApproverTaskId);


                }
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Technical UpdateApproveAskToAmend");

            }
            return res;
        }

        public async Task<AjaxResult> PullBackRequest(int technicalId, int userId, string comment)
        {
            var res = new AjaxResult();
            try
            {
                var technicalInstruction = _context.TechnicalInstructionSheets.Where(x => x.TechnicalId == technicalId && x.IsDeleted == false).FirstOrDefault();
                if (technicalInstruction != null)
                {
                    technicalInstruction.IsSubmit = false;
                    technicalInstruction.Status = ApprovalTaskStatus.Draft.ToString();
                    technicalInstruction.ModifiedBy = userId;

                    await _context.SaveChangesAsync();

                    InsertHistoryData(technicalId, FormType.TroubleReport.ToString(), Enums.WorkDoneLead, comment, ApprovalTaskStatus.PullBack.ToString(), userId, ApprovalTaskStatus.PullBack.ToString(), 0);
                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendTechanicalInstructionEmail(technicalId, EmailNotificationAction.PullBack, comment, 0);

                    var approverTaskDetails = _context.TechnicalInstructionApproverTaskMasters.Where(x => x.TechnicalId == technicalId).ToList();
                    approverTaskDetails.ForEach(a =>
                    {
                        a.IsActive = false;
                        a.ModifiedBy = userId;
                        a.ModifiedDate = DateTime.Now;
                    });
                    await _context.SaveChangesAsync();

                    res.Message = Enums.TechnicalPullback;
                    res.StatusCode = Status.Success;
                }
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "Technical PullbackRequest");
                return res;
            }
            return res;
        }

        public async Task<List<TechnicalInstructionTaskMasterAdd>> GetTechnicalInstructionWorkFlow(int technicalId)
        {
            var approverData = await _context.GetTechnicalWorkFlowData(technicalId);
            var processedData = new List<TechnicalInstructionTaskMasterAdd>();
            foreach (var entry in approverData)
            {
                processedData.Add(entry);
            }
            return processedData;
        }

        public Technical_ApproverTaskId_dto GetCurrentApproverTask(int technicalId, int userId)
        {
            var materialApprovers = _context.TechnicalInstructionApproverTaskMasters.FirstOrDefault(x => x.TechnicalId == technicalId && x.AssignedToUserId == userId && x.Status == ApprovalTaskStatus.InReview.ToString() && x.IsActive == true);
            var data = new Technical_ApproverTaskId_dto();
            if (materialApprovers != null)
            {
                data.approverTaskId = materialApprovers.ApproverTaskId;
                data.userId = materialApprovers.AssignedToUserId ?? 0;
                data.status = materialApprovers.Status;
                data.seqNumber = materialApprovers.SequenceNo;

            }
            return data;
        }

        public List<TechnicalHistoryView> GetHistoryData(int technicalId)
        {
            var troubleHistorydata = _context.TechnicalInstructionHistoryMasters.Where(x => x.FormID == technicalId && x.IsActive == true).ToList();

            return troubleHistorydata.Select(x => new TechnicalHistoryView()
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

        #region Close Request

        public async Task<AjaxResult> CloseTechnical(Technical_ScrapNoteAdd report)
        {
            var res = new AjaxResult();
            try
            {
                var technicalData = _context.TechnicalInstructionSheets.Where(x => x.TechnicalId == report.TechnicalId && x.IsDeleted == false && x.IsClosed == false).FirstOrDefault();
                if (technicalData != null)
                {

                    if (report.technicalClosureAttachmentAdds != null && report.technicalClosureAttachmentAdds.Count > 0)
                    {
                        var objs = report.technicalClosureAttachmentAdds.Select(c => new TechnicalClosureAttachment
                        {
                            DocumentName = c.DocumentName,
                            DocumentFilePath = $"/TechnicalSheetDocs/{technicalData.CTINumber}/ClosureAttachment/{c.DocumentName}",
                            TechnicalId = technicalData.TechnicalId,
                            IsDeleted = false,
                            CreatedDate = DateTime.Now,
                            CreatedBy = report.userId
                        }).ToList();

                        _context.TechnicalClosureAttachments.AddRange(objs);
                        await _context.SaveChangesAsync();
                    }


                    technicalData.IsClosed = true;
                    //technicalData.IsScraped = report.isScraped;
                    technicalData.ClosedDate = DateTime.Now;
                    //technicalData.ScrapRemarks = report.scrapRemarks;
                    //technicalData.ScrapTicketNo = report.scrapTicketNo;
                    technicalData.Status = ApprovalTaskStatus.Closed.ToString();
                    await _context.SaveChangesAsync();

                    //var adminId = _context.AdminApprovers.Where(x => x.IsActive == true && x.FormName == "MaterialCosnumption").Select(x => x.AdminId).FirstOrDefault();
                    //if (adminId == report.userId)
                    //{
                    //    InsertHistoryData(report.TechnicalId, FormType.TechnicalInstruction.ToString(), "Admin", "Request is Closed by Admin", ApprovalTaskStatus.Closed.ToString(), report.userId, ApprovalTaskStatus.Closed.ToString(), 0);

                    //}
                    //else if (report.userId == technicalData.CreatedBy)
                    //{
                    //    InsertHistoryData(report.TechnicalId, FormType.TechnicalInstruction.ToString(), "Requestor", "Request is Closed by Requestor", ApprovalTaskStatus.Closed.ToString(), report.userId, ApprovalTaskStatus.Closed.ToString(), 0);
                    //}
                    //else
                    //{
                    //    InsertHistoryData(report.TechnicalId, FormType.TechnicalInstruction.ToString(), "CPC Department", "Request is Closed by CPC DepartmentHead", ApprovalTaskStatus.Closed.ToString(), report.userId, ApprovalTaskStatus.Closed.ToString(), 0);

                    //}

                    if (report.userId == technicalData.CreatedBy)
                    {
                        InsertHistoryData(report.TechnicalId, FormType.TechnicalInstruction.ToString(), "Requestor", "Request is Closed by Requestor", ApprovalTaskStatus.Closed.ToString(), report.userId, ApprovalTaskStatus.Closed.ToString(), 0);
                    }
                    else
                    {
                        InsertHistoryData(report.TechnicalId, FormType.TechnicalInstruction.ToString(), "Section Head", "Request is Closed by Section Head", ApprovalTaskStatus.Closed.ToString(), report.userId, ApprovalTaskStatus.Closed.ToString(), 0);

                    }

                    var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    await notificationHelper.SendTechanicalInstructionEmail(report.TechnicalId, EmailNotificationAction.Closed, string.Empty, report.userId);

                }
                res.Message = Enums.TechnicalClose;
                res.StatusCode = Enums.Status.Success;
            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Enums.Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "CloseTechnical");
                return res;
            }
            return res;
        }

        public async Task<AjaxResult> DeleteTechnicalClosureAttachment(int TechnicalClosureAttachmentId)
        {
            var res = new AjaxResult();
            var report = await _context.TechnicalClosureAttachments.FindAsync(TechnicalClosureAttachmentId);
            if (report == null)
            {
                res.StatusCode = Status.Error;
                res.Message = "Record Not Found";
            }
            else
            {
                report.IsDeleted = true;
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

        #region Export to excel and pdf

        public async Task<IEnumerable<TechnicalInstructionDto>> GetTechnicalInstructionData(int technicalId)
        {
            var parameters = new { TechnicalId = technicalId };
            var query = "EXEC dbo.TechnicalInstructionExcel @TechnicalId";

            using (var connection = new SqlConnection(_connectionString))
            {
                return await connection.QueryAsync<TechnicalInstructionDto>(query, parameters);
            }
        }

        public async Task<AjaxResult> ExportTechnicalInstructionToExcel(int technicalId)
        {
            var res = new AjaxResult();

            try
            {

                // Fetch the data based on the provided ID
                var data = await GetTechnicalInstructionData(technicalId);

                if (data == null || !data.Any())
                {
                    res.StatusCode = Status.Error;
                    res.Message = "No data found for the given Material Consumption ID.";
                    return res;
                }
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (var package = new ExcelPackage())
                {
                    var worksheet = package.Workbook.Worksheets.Add("Technaical Instruction Slip");

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

                    worksheet.Cells[startRow, 2].Value = "Title";
                    worksheet.Cells[startRow, 2].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    worksheet.Cells[startRow, 2].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightBlue);

                    worksheet.Cells[startRow, 3].Value = "Quantity";
                    worksheet.Cells[startRow, 3].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    worksheet.Cells[startRow, 3].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightBlue);

                    worksheet.Cells[startRow, 4].Value = "Purpose";
                    worksheet.Cells[startRow, 4].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    worksheet.Cells[startRow, 4].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightBlue);
                    worksheet.Cells[startRow, 4].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                    worksheet.Cells[startRow, 4].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                    worksheet.Cells[startRow, 4].Style.WrapText = true;

                    // Add data rows
                    int row = startRow + 1;
                    int serialNumber = 1;

                    foreach (var item in data)
                    {
                        worksheet.Cells[row, 1].Value = serialNumber++;
                        worksheet.Cells[row, 2].Value = item.Title;
                        worksheet.Cells[row, 3].Value = item.Quantity;
                        worksheet.Cells[row, 4].Value = item.Purpose;
                        row++;
                    }

                    // Add Remarks at the end
                    //worksheet.Cells[row + 1, 1].Value = "Remarks :";
                    //worksheet.Cells[row + 1, 1].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    //worksheet.Cells[row + 1, 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.LightPink);
                    //worksheet.Cells[row + 1, 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                    //worksheet.Cells[row + 1, 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                    //worksheet.Cells[row + 1, 1].Style.WrapText = true;
                    //worksheet.Cells[row + 1, 2].Value = data.FirstOrDefault()?.Remarks;


                    // Adjust column widths to fit the content
                    worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

                    // Convert the Excel package to a byte array
                    var excelBytes = package.GetAsByteArray();

                    // Convert byte array to base64 string
                    string base64String = Convert.ToBase64String(excelBytes);

                    // Set the response
                    res.StatusCode = Status.Success;
                    res.Message = Enums.TechnicalExcel;
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
                commonHelper.LogException(ex, "ExportTechnicalInstructionToExcel");

                return res;
            }
        }

        public async Task<AjaxResult> ExportToPdf(int technicalId)
        {
            var res = new AjaxResult();
            try
            {
                var materialdata = _context.TechnicalInstructionSheets.Where(x => x.TechnicalId == technicalId && x.IsDeleted == false).FirstOrDefault();

                var getEquipments = from tech in _context.TechnicalEquipmentMasterItems
                                    join equip in _context.EquipmentMasters
                                    on tech.EquipmentId equals equip.EquipmentId
                                    where tech.TechnicalId == materialdata.TechnicalId
                                    select new
                                    {
                                        EquipmentId = tech.EquipmentId,
                                        EquipmentName = equip.EquipmentName
                                    };

                var equipmentList = getEquipments.ToList();
                string commaSeparatedEquipmentNames = "";

                if (equipmentList != null && equipmentList.Count() > 0)
                {
                    var equipmentNames = equipmentList.Select(e => e.EquipmentName);
                    commaSeparatedEquipmentNames = string.Join(", ", equipmentNames);
                }

                //normal data
                var data = await GetTechnicalInstructionData(technicalId);

                //approvers data
                var approverData = await _context.GetTechnicalWorkFlowData(technicalId);

                StringBuilder sb = new StringBuilder();
                string? htmlTemplatePath = _configuration["TemplateSettings:PdfTemplate"];
                string baseDirectory = AppContext.BaseDirectory;
                DirectoryInfo? directoryInfo = new DirectoryInfo(baseDirectory);

                string templateFile = "TechnicalInstructionPDF.html";

                string templateFilePath = Path.Combine(baseDirectory, htmlTemplatePath, templateFile);

                string? htmlTemplate = System.IO.File.ReadAllText(templateFilePath);
                sb.Append(htmlTemplate);

                sb.Replace("#TechnicalNo#", data.FirstOrDefault()?.RequestNo);
                sb.Replace("#RequestorDept#", data.FirstOrDefault()?.Department);
                sb.Replace("#Date#", data.FirstOrDefault()?.Date.ToString("dd-MM-yyyy"));
                //sb.Replace("#Remarks#", data.FirstOrDefault()?.Remarks);
                sb.Replace("#issueDate#", materialdata.IssueDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#issuedBy#", materialdata.IssuedBy?.ToString() ?? "");
                sb.Replace("#title#", materialdata.Title?.ToString() ?? "");
                sb.Replace("#ctiNumber#", materialdata.CTINumber?.ToString() ?? "");
                sb.Replace("#revisionNo#", materialdata.RevisionNo?.ToString() ?? "");
                sb.Replace("#purpose#", materialdata.Purpose?.ToString() ?? "");
                sb.Replace("#productType#", materialdata.ProductType?.ToString() ?? "");
                sb.Replace("#quantity#", materialdata.Quantity?.ToString() ?? "");
                sb.Replace("#outline#", materialdata.Outline?.ToString() ?? "");
                sb.Replace("#tisApplicabilityDate#", materialdata.TISApplicable?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#targetClosureDate#", materialdata.TargetClosureDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#applicationStartDate#", materialdata.ApplicationStartDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#applicationLotNo#", materialdata.ApplicationLotNo?.ToString() ?? "");
                sb.Replace("#equipmentList#", commaSeparatedEquipmentNames ?? "");

                //var base64Images = await GetBase64ImagesForTechnicalInstruction(technicalId); // List of Base64 image strings
                sb.Replace("#technicalOutlineAttachment#", null ?? "");


                StringBuilder tableBuilder = new StringBuilder();
                int serialNumber = 1;
                //foreach (var item in data)
                //{
                //    tableBuilder.Append("<tr style=\"padding:10px; height: 20px;\">");

                //    // Add the serial number to the first column
                //    tableBuilder.Append("<td style=\"width:5%; border:0.25px; height: 20px; padding: 5px\">" + serialNumber++ + "</td>");

                //    // Add the rest of the data to the respective columns
                //    tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.Title + "</td>");
                //    //tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.MaterialDescription + "</td>");
                //    //tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.MaterialNo + "</td>");
                //    tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.Quantity + "</td>");
                //    //tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.UOM + "</td>");
                //    //tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.CostCenter + "</td>");
                //    //tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.GLCode + "</td>");
                //    tableBuilder.Append("<td style=\"width:20%; border:0.25px; height: 20px; padding: 5px\">" + item.Purpose + "</td>");

                //    tableBuilder.Append("</tr>");
                //}
                //sb.Replace("#ItemTable#", tableBuilder.ToString());

                string reqName = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == materialdata.CreatedBy && x.IsActive == true).Select(x => x.EmployeeName).FirstOrDefault() ?? "";
                string approvedByDepHead = approverData.FirstOrDefault(a => a.SequenceNo == 1)?.employeeNameWithoutCode ?? "N/A";
                string approvedByCPC = approverData.FirstOrDefault(a => a.SequenceNo == 2)?.employeeNameWithoutCode ?? "N/A";
                string approvedByDivHead = approverData.FirstOrDefault(a => a.SequenceNo == 3)?.employeeNameWithoutCode ?? "N/A";

                sb.Replace("#RequestorName#", reqName);
                sb.Replace("#SectionHeadName#", approvedByDepHead);
                sb.Replace("#CMFDepartmentHeadName#", approvedByCPC);
                sb.Replace("#CQCDepartmentHeadName#", approvedByDivHead);

                DateTime? depHeadDate = approverData.FirstOrDefault(a => a.SequenceNo == 1)?.ActionTakenDate;
                DateTime? cpcDate = approverData.FirstOrDefault(a => a.SequenceNo == 2)?.ActionTakenDate;
                DateTime? divHeadDate = approverData.FirstOrDefault(a => a.SequenceNo == 3)?.ActionTakenDate;

                sb.Replace("#CreatedDate#", materialdata.CreatedDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#SectionHeadapproveDate#", depHeadDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#CMFapproveDate#", cpcDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#CQCapproveDate#", divHeadDate?.ToString("dd-MM-yyyy") ?? "N/A");

                using (var ms = new MemoryStream())
                {
                    Document document = new Document(iTextSharp.text.PageSize.A3, 10f, 10f, 10f, 30f);
                    PdfWriter writer = PdfWriter.GetInstance(document, ms);
                    document.Open();

                    PdfContentByte canvas = writer.DirectContentUnder;


                    // Convert the StringBuilder HTML content to a PDF using iTextSharp
                    using (var sr = new StringReader(sb.ToString()))
                    {
                        iTextSharp.tool.xml.XMLWorkerHelper.GetInstance().ParseXHtml(writer, document, sr);
                    }


                    //float xPosition = 100f; // Starting X position for the first image (adjust as needed)
                    //float yPosition = 500f; // Fixed Y position (adjust as needed)
                    //float imageWidth = 150; // Width of the image
                    //float imageSpacing = 170f; // Spacing betwe01 images

                    //foreach (var base64Image in base64Images)
                    //{
                    //    if (!string.IsNullOrEmpty(base64Image))
                    //    {
                    //        //byte[] imageBytes = Convert.FromBase64String(base64Image);
                    //        //using (MemoryStream ms1 = new MemoryStream(imageBytes))
                    //        //{
                    //        //    Image image = Image.GetInstance(ms1);
                    //        //    image.ScaleToFit(imageWidth, imageWidth);  // Scale the image as needed

                    //        //    // Check if the image exceeds the page width and wrap to the next line
                    //        //    if (xPosition + imageSpacing > document.PageSize.Width - 100f)  // Check if image exceeds page width
                    //        //    {
                    //        //        xPosition = 100f;  // Reset X position to start a new row
                    //        //        yPosition -= imageSpacing;  // Move down for the new row (adjust spacing as needed)
                    //        //    }

                    //        //    // Set the position of the image
                    //        //    image.SetAbsolutePosition(xPosition, yPosition);  // Position each image horizontally

                    //        //    // Add the image to the document
                    //        //    document.Add(image);

                    //        //    // Adjust the xPosition for the next image (move right)
                    //        //    xPosition += imageSpacing; // Move right for the next image (adjust spacing as needed)
                    //        //}
                    //    }
                    //}

                    document.Close();

                    // Convert the PDF to a byte array
                    byte[] pdfBytes = ms.ToArray();

                    // Encode the PDF as a Base64 string
                    string base64String = Convert.ToBase64String(pdfBytes);

                    // Set response values
                    res.StatusCode = Status.Success;
                    res.Message = Enums.TechnicalPdf;
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
        public async Task<AjaxResult> ExportToPdf_v2(int technicalId)
        {
            var res = new AjaxResult();
            try
            {
                var materialdata = _context.TechnicalInstructionSheets.Where(x => x.TechnicalId == technicalId && x.IsDeleted == false).FirstOrDefault();

                var getEquipments = from tech in _context.TechnicalEquipmentMasterItems
                                    join equip in _context.EquipmentMasters
                                    on tech.EquipmentId equals equip.EquipmentId
                                    where tech.TechnicalId == materialdata.TechnicalId
                                    select new
                                    {
                                        EquipmentId = tech.EquipmentId,
                                        EquipmentName = equip.EquipmentName
                                    };

                var equipmentList = getEquipments.ToList();
                string commaSeparatedEquipmentNames = "";

                if (equipmentList != null && equipmentList.Count() > 0)
                {
                    var equipmentNames = equipmentList.Select(e => e.EquipmentName);
                    commaSeparatedEquipmentNames = string.Join(", ", equipmentNames);
                }

                //normal data
                var data = await GetTechnicalInstructionData(technicalId);

                //approvers data
                var approverData = await _context.GetTechnicalWorkFlowData(technicalId);

                StringBuilder sb = new StringBuilder();
                string? htmlTemplatePath = _configuration["TemplateSettings:PdfTemplate"];
                string baseDirectory = AppContext.BaseDirectory;
                DirectoryInfo? directoryInfo = new DirectoryInfo(baseDirectory);

                string templateFile = "TechnicalInstructionPDF.html";

                string templateFilePath = Path.Combine(baseDirectory, htmlTemplatePath, templateFile);

                string? htmlTemplate = System.IO.File.ReadAllText(templateFilePath);
                sb.Append(htmlTemplate);

                sb.Replace("#TechnicalNo#", data.FirstOrDefault()?.RequestNo);
                sb.Replace("#RequestorDept#", data.FirstOrDefault()?.Department);
                sb.Replace("#Date#", data.FirstOrDefault()?.Date.ToString("dd-MM-yyyy"));
                //sb.Replace("#Remarks#", data.FirstOrDefault()?.Remarks);
                sb.Replace("#issueDate#", materialdata.IssueDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#issuedBy#", materialdata.IssuedBy?.ToString() ?? "");
                sb.Replace("#title#", materialdata.Title?.ToString() ?? "");
                sb.Replace("#ctiNumber#", materialdata.CTINumber?.ToString() ?? "");
                sb.Replace("#revisionNo#", materialdata.RevisionNo?.ToString() ?? "");
                sb.Replace("#purpose#", materialdata.Purpose?.ToString() ?? "");
                sb.Replace("#productType#", materialdata.ProductType?.ToString() ?? "");
                sb.Replace("#quantity#", materialdata.Quantity?.ToString() ?? "");
                sb.Replace("#outline#", materialdata.Outline?.ToString() ?? "");
                sb.Replace("#tisApplicabilityDate#", materialdata.TISApplicable?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#targetClosureDate#", materialdata.TargetClosureDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#applicationStartDate#", materialdata.ApplicationStartDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#applicationLotNo#", materialdata.ApplicationLotNo?.ToString() ?? "");
                sb.Replace("#equipmentList#", commaSeparatedEquipmentNames ?? "");

                //var base64Images = await GetBase64ImagesForTechnicalInstruction(technicalId); // List of Base64 image strings
                sb.Replace("#technicalOutlineAttachment#", null ?? "");


                StringBuilder tableBuilder = new StringBuilder();
                int serialNumber = 1;
                //foreach (var item in data)
                //{
                //    tableBuilder.Append("<tr style=\"padding:10px; height: 20px;\">");

                //    // Add the serial number to the first column
                //    tableBuilder.Append("<td style=\"width:5%; border:0.25px; height: 20px; padding: 5px\">" + serialNumber++ + "</td>");

                //    // Add the rest of the data to the respective columns
                //    tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.Title + "</td>");
                //    //tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.MaterialDescription + "</td>");
                //    //tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.MaterialNo + "</td>");
                //    tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.Quantity + "</td>");
                //    //tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.UOM + "</td>");
                //    //tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.CostCenter + "</td>");
                //    //tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.GLCode + "</td>");
                //    tableBuilder.Append("<td style=\"width:20%; border:0.25px; height: 20px; padding: 5px\">" + item.Purpose + "</td>");

                //    tableBuilder.Append("</tr>");
                //}
                //sb.Replace("#ItemTable#", tableBuilder.ToString());

                string reqName = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == materialdata.CreatedBy && x.IsActive == true).Select(x => x.EmployeeName).FirstOrDefault() ?? "";
                string approvedByDepHead = approverData.FirstOrDefault(a => a.SequenceNo == 1)?.employeeNameWithoutCode ?? "N/A";
                string approvedByCPC = approverData.FirstOrDefault(a => a.SequenceNo == 2)?.employeeNameWithoutCode ?? "N/A";
                string approvedByDivHead = approverData.FirstOrDefault(a => a.SequenceNo == 3)?.employeeNameWithoutCode ?? "N/A";

                sb.Replace("#ReqName#", reqName);
                sb.Replace("#SectionHead#", approvedByDepHead);
                sb.Replace("#CMFHead#", approvedByCPC);
                sb.Replace("#CQCHead#", approvedByDivHead);

                DateTime? depHeadDate = approverData.FirstOrDefault(a => a.SequenceNo == 1)?.ActionTakenDate;
                DateTime? cpcDate = approverData.FirstOrDefault(a => a.SequenceNo == 2)?.ActionTakenDate;
                DateTime? divHeadDate = approverData.FirstOrDefault(a => a.SequenceNo == 3)?.ActionTakenDate;

                sb.Replace("#CreatedDate#", materialdata.CreatedDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#SectionHeadapproveDate#", depHeadDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#CMFapproveDate#", cpcDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#CQCapproveDate#", divHeadDate?.ToString("dd-MM-yyyy") ?? "N/A");

                // Replace all image URLs with base64 data
                //string updatedHtmlContent = ConvertImagesToBase64(sb.ToString());

                var renderer = new HtmlToPdf();

                // Convert <img> tags to <a> tags
                //string updatedHtml = Regex.Replace(sb.ToString(), @"<img\s+[^>]*src\s*=\s*['""]([^'""]+)['""][^>]*>",
                //    "<a href='$1'><img src='$1' alt='Linked Image'/>Linked Image</a>");

                // Convert <img> tags to <a> tags with target="_blank" and a descriptive link name
                string updatedHtml = Regex.Replace(sb.ToString(),
                    @"<img\s+[^>]*src\s*=\s*['""]([^'""]+)['""][^>]*>",
                    "<a href='$1' target='_blank' rel='noopener noreferrer'>Linked Image</a>");


                var PDF = renderer.RenderHtmlAsPdf(updatedHtml.ToString());

                string tempPath = Path.GetTempFileName();
                PDF.SaveAs(tempPath);

                byte[] PDFBytes = File.ReadAllBytes(tempPath);

                // Clean up the temporary file
                File.Delete(tempPath);

                string base64StringPDF = Convert.ToBase64String(PDFBytes);

                // Set response values
                res.StatusCode = Status.Success;
                res.Message = Enums.TechnicalPdf;
                res.ReturnValue = base64StringPDF; // Send the Base64 string to the frontend

                return res;

                #region old
                //using (var ms = new MemoryStream())
                //{
                //    Document document = new Document(iTextSharp.text.PageSize.A3, 10f, 10f, 10f, 30f);
                //    PdfWriter writer = PdfWriter.GetInstance(document, ms);
                //    document.Open();

                //    PdfContentByte canvas = writer.DirectContentUnder;


                //    // Convert the StringBuilder HTML content to a PDF using iTextSharp
                //    using (var sr = new StringReader(sb.ToString()))
                //    {
                //        iTextSharp.tool.xml.XMLWorkerHelper.GetInstance().ParseXHtml(writer, document, sr);
                //    }


                //    //float xPosition = 100f; // Starting X position for the first image (adjust as needed)
                //    //float yPosition = 500f; // Fixed Y position (adjust as needed)
                //    //float imageWidth = 150; // Width of the image
                //    //float imageSpacing = 170f; // Spacing betwe01 images

                //    //foreach (var base64Image in base64Images)
                //    //{
                //    //    if (!string.IsNullOrEmpty(base64Image))
                //    //    {
                //    //        //byte[] imageBytes = Convert.FromBase64String(base64Image);
                //    //        //using (MemoryStream ms1 = new MemoryStream(imageBytes))
                //    //        //{
                //    //        //    Image image = Image.GetInstance(ms1);
                //    //        //    image.ScaleToFit(imageWidth, imageWidth);  // Scale the image as needed

                //    //        //    // Check if the image exceeds the page width and wrap to the next line
                //    //        //    if (xPosition + imageSpacing > document.PageSize.Width - 100f)  // Check if image exceeds page width
                //    //        //    {
                //    //        //        xPosition = 100f;  // Reset X position to start a new row
                //    //        //        yPosition -= imageSpacing;  // Move down for the new row (adjust spacing as needed)
                //    //        //    }

                //    //        //    // Set the position of the image
                //    //        //    image.SetAbsolutePosition(xPosition, yPosition);  // Position each image horizontally

                //    //        //    // Add the image to the document
                //    //        //    document.Add(image);

                //    //        //    // Adjust the xPosition for the next image (move right)
                //    //        //    xPosition += imageSpacing; // Move right for the next image (adjust spacing as needed)
                //    //        //}
                //    //    }
                //    //}

                //    document.Close();

                //    // Convert the PDF to a byte array
                //    byte[] pdfBytes = ms.ToArray();

                //    // Encode the PDF as a Base64 string
                //    string base64String = Convert.ToBase64String(pdfBytes);

                //    // Set response values
                //    res.StatusCode = Status.Success;
                //    res.Message = Enums.TechnicalPdf;
                //    res.ReturnValue = base64String; // Send the Base64 string to the frontend

                //    return res;
                //}

                #endregion

            }

            catch (Exception ex)
            {
                res.Message = "Fail " + ex.Message;
                res.StatusCode = Status.Error;

                // Log the exception using your logging mechanism
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "ExportToPdf_v2");

                return res;
            }
        }
        public async Task<AjaxResult> ExportToPdf_v3(int technicalId)
        {
            var res = new AjaxResult();
            try
            {
                var materialdata = _context.TechnicalInstructionSheets.Where(x => x.TechnicalId == technicalId && x.IsDeleted == false).FirstOrDefault();

                var getEquipments = from tech in _context.TechnicalEquipmentMasterItems
                                    join equip in _context.EquipmentMasters
                                    on tech.EquipmentId equals equip.EquipmentId
                                    where tech.TechnicalId == materialdata.TechnicalId
                                    select new
                                    {
                                        EquipmentId = tech.EquipmentId,
                                        EquipmentName = equip.EquipmentName
                                    };

                var equipmentList = getEquipments.ToList();
                string commaSeparatedEquipmentNames = "";

                if (equipmentList != null && equipmentList.Count() > 0)
                {
                    var equipmentNames = equipmentList.Select(e => e.EquipmentName);
                    commaSeparatedEquipmentNames = string.Join(", ", equipmentNames);
                }

                if(materialdata.OtherEquipment != null)
                {
                    commaSeparatedEquipmentNames = materialdata.OtherEquipment;
                }

                //get histroy data
                var revesionHistroy = "";
                if(materialdata.TechnicalReviseId != null)
                {
                    var get_child_record_Id = await _context.TechnicalInstructionSheets.Where(c => c.TechnicalId == materialdata.TechnicalReviseId).Select(c => c.TechnicalId).SingleOrDefaultAsync();
                    
                    if(get_child_record_Id != null && get_child_record_Id > 0)
                    {
                        var get_comment = await _context.TechnicalInstructionHistoryMasters.Where(c => c.FormID == get_child_record_Id && c.Status == ApprovalTaskStatus.ReOpen.ToString()).OrderByDescending(c => c.ActionTakenDateTime).FirstOrDefaultAsync();

                        if(revesionHistroy != null)
                        {
                            revesionHistroy = get_comment.Comment;
                        }
                        
                    }
                }

                var Attachments_String = "";
                var get_attachemnts = await _context.TechnicalAttachments
                    .Where(c => c.TechnicalId == materialdata.TechnicalId && c.IsDeleted == false)
                    .ToListAsync();

                string? documentLink = _configuration["SPSiteUrl"];

                if (get_attachemnts != null && get_attachemnts.Count > 0)
                {
                    Attachments_String += @"<ul style='list-style-type: none; margin: 0;'>";
                    foreach (var a in get_attachemnts)
                    {
                        // Assuming `DocumentUrl` contains the file's URL or relative path
                        Attachments_String += $"<li><a href='{documentLink}{a.DocumentFilePath}' target='_blank'>{a.DocumentName}</a></li>";
                    }
                    Attachments_String += "</ul>";
                }

                //normal data
                var data = await GetTechnicalInstructionData(technicalId);

                //approvers data
                var approverData = await _context.GetTechnicalWorkFlowData(technicalId);

                StringBuilder sb = new StringBuilder();
                string? htmlTemplatePath = _configuration["TemplateSettings:PdfTemplate"];
                string baseDirectory = AppContext.BaseDirectory;
                DirectoryInfo? directoryInfo = new DirectoryInfo(baseDirectory);

                string templateFile = "TechnicalInstructionPDF_v2.html";

                string templateFilePath = Path.Combine(baseDirectory, htmlTemplatePath, templateFile);

                string? htmlTemplate = System.IO.File.ReadAllText(templateFilePath);
                sb.Append(htmlTemplate);

                sb.Replace("#TechnicalNo#", data.FirstOrDefault()?.RequestNo);
                sb.Replace("#RequestorDept#", data.FirstOrDefault()?.Department);
                sb.Replace("#Date#", data.FirstOrDefault()?.Date.ToString("dd-MM-yyyy"));
                //sb.Replace("#Remarks#", data.FirstOrDefault()?.Remarks);
                sb.Replace("#issueDate#", materialdata.IssueDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#issuedBy#", materialdata.IssuedBy?.ToString() ?? "");
                sb.Replace("#title#", materialdata.Title?.ToString() ?? "");
                sb.Replace("#ctiNumber#", materialdata.CTINumber?.ToString() ?? "");
                sb.Replace("#revisionNo#", materialdata.RevisionNo?.ToString() ?? "");
                sb.Replace("#purpose#", materialdata.Purpose?.ToString() ?? "");
                sb.Replace("#productType#", materialdata.ProductType?.ToString() ?? "");
                sb.Replace("#quantity#", materialdata.Quantity?.ToString() ?? "");
                sb.Replace("#outline#", materialdata.Outline?.ToString() ?? "");
                sb.Replace("#tisApplicabilityDate#", materialdata.TISApplicable?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#targetClosureDate#", materialdata.TargetClosureDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#applicationStartDate#", materialdata.ApplicationStartDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#applicationLotNo#", materialdata.ApplicationLotNo?.ToString() ?? "");
                sb.Replace("#equipmentList#", commaSeparatedEquipmentNames ?? "");
                sb.Replace("#revisionHistroy#", revesionHistroy ?? "");
                //var base64Images = await GetBase64ImagesForTechnicalInstruction(technicalId); // List of Base64 image strings
                sb.Replace("#technicalOutlineAttachment#", null ?? "");
                sb.Replace("#relatedDocument#", Attachments_String ?? "");

                StringBuilder tableBuilder = new StringBuilder();
                int serialNumber = 1;
                //foreach (var item in data)
                //{
                //    tableBuilder.Append("<tr style=\"padding:10px; height: 20px;\">");

                //    // Add the serial number to the first column
                //    tableBuilder.Append("<td style=\"width:5%; border:0.25px; height: 20px; padding: 5px\">" + serialNumber++ + "</td>");

                //    // Add the rest of the data to the respective columns
                //    tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.Title + "</td>");
                //    //tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.MaterialDescription + "</td>");
                //    //tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.MaterialNo + "</td>");
                //    tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.Quantity + "</td>");
                //    //tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.UOM + "</td>");
                //    //tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.CostCenter + "</td>");
                //    //tableBuilder.Append("<td style=\"width:15%; border:0.25px; height: 20px; padding: 5px\">" + item.GLCode + "</td>");
                //    tableBuilder.Append("<td style=\"width:20%; border:0.25px; height: 20px; padding: 5px\">" + item.Purpose + "</td>");

                //    tableBuilder.Append("</tr>");
                //}
                //sb.Replace("#ItemTable#", tableBuilder.ToString());

                string reqName = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == materialdata.CreatedBy && x.IsActive == true).Select(x => x.EmployeeName).FirstOrDefault() ?? "";
                string approvedByDepHead = approverData.FirstOrDefault(a => a.SequenceNo == 1)?.employeeNameWithoutCode ?? "N/A";
                string approvedByCPC = approverData.FirstOrDefault(a => a.SequenceNo == 2)?.employeeNameWithoutCode ?? "N/A";
                string approvedByDivHead = approverData.FirstOrDefault(a => a.SequenceNo == 3)?.employeeNameWithoutCode ?? "N/A";

                sb.Replace("#ReqName#", reqName);
                sb.Replace("#SectionHead#", approvedByDepHead);
                sb.Replace("#CMFHead#", approvedByCPC);
                sb.Replace("#CQCHead#", approvedByDivHead);

                DateTime? depHeadDate = approverData.FirstOrDefault(a => a.SequenceNo == 1)?.ActionTakenDate;
                DateTime? cpcDate = approverData.FirstOrDefault(a => a.SequenceNo == 2)?.ActionTakenDate;
                DateTime? divHeadDate = approverData.FirstOrDefault(a => a.SequenceNo == 3)?.ActionTakenDate;

                sb.Replace("#CreatedDate#", materialdata.CreatedDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#SectionHeadapproveDate#", depHeadDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#CMFapproveDate#", cpcDate?.ToString("dd-MM-yyyy") ?? "N/A");
                sb.Replace("#CQCapproveDate#", divHeadDate?.ToString("dd-MM-yyyy") ?? "N/A");

                // Replace all image URLs with base64 data
                //string updatedHtmlContent = ConvertImagesToBase64(sb.ToString());

                var renderer = new HtmlToPdf();

                // Convert <img> tags to <a> tags
                //string updatedHtml = Regex.Replace(sb.ToString(), @"<img\s+[^>]*src\s*=\s*['""]([^'""]+)['""][^>]*>",
                //    "<a href='$1'><img src='$1' alt='Linked Image'/>Linked Image</a>");

                // Convert <img> tags to <a> tags with target="_blank" and a descriptive link name
                //string updatedHtml = Regex.Replace(sb.ToString(),
                //    @"<img\s+[^>]*src\s*=\s*['""]([^'""]+)['""][^>]*>",
                //    "<a href='$1' target='_blank' rel='noopener noreferrer'>Linked Image</a>");

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

                //var PDF = renderer.RenderHtmlAsPdf(sb.ToString());
                //// Set the paper size to A4 or a custom size
                //// Set paper size, margins, and enable scale to fit
                //renderer.PrintOptions.MarginTop = 0;
                //renderer.PrintOptions.MarginBottom = 0;
                //renderer.PrintOptions.MarginLeft = 0;
                //renderer.PrintOptions.MarginRight = 0;
                //renderer.PrintOptions.PaperSize = PdfPaperSize.A4;

                //// Ensure the HTML content scales to fit the page width
                //renderer.PrintOptions.FitToPaperWidth = true;

                //string tempPath = Path.GetTempFileName();
                //PDF.SaveAs(tempPath);

                //byte[] PDFBytes = File.ReadAllBytes(tempPath);

                //// Clean up the temporary file
                //File.Delete(tempPath);

                //string base64StringPDF = Convert.ToBase64String(PDFBytes);

                //// Set response values
                //res.StatusCode = Status.Success;
                //res.Message = Enums.TechnicalPdf;
                //res.ReturnValue = base64StringPDF; // Send the Base64 string to the frontend

                //return res;

                #region old
                //using (var ms = new MemoryStream())
                //{
                //    Document document = new Document(iTextSharp.text.PageSize.A3, 10f, 10f, 10f, 30f);
                //    PdfWriter writer = PdfWriter.GetInstance(document, ms);
                //    document.Open();

                //    PdfContentByte canvas = writer.DirectContentUnder;


                //    // Convert the StringBuilder HTML content to a PDF using iTextSharp
                //    using (var sr = new StringReader(sb.ToString()))
                //    {
                //        iTextSharp.tool.xml.XMLWorkerHelper.GetInstance().ParseXHtml(writer, document, sr);
                //    }


                //    //float xPosition = 100f; // Starting X position for the first image (adjust as needed)
                //    //float yPosition = 500f; // Fixed Y position (adjust as needed)
                //    //float imageWidth = 150; // Width of the image
                //    //float imageSpacing = 170f; // Spacing betwe01 images

                //    //foreach (var base64Image in base64Images)
                //    //{
                //    //    if (!string.IsNullOrEmpty(base64Image))
                //    //    {
                //    //        //byte[] imageBytes = Convert.FromBase64String(base64Image);
                //    //        //using (MemoryStream ms1 = new MemoryStream(imageBytes))
                //    //        //{
                //    //        //    Image image = Image.GetInstance(ms1);
                //    //        //    image.ScaleToFit(imageWidth, imageWidth);  // Scale the image as needed

                //    //        //    // Check if the image exceeds the page width and wrap to the next line
                //    //        //    if (xPosition + imageSpacing > document.PageSize.Width - 100f)  // Check if image exceeds page width
                //    //        //    {
                //    //        //        xPosition = 100f;  // Reset X position to start a new row
                //    //        //        yPosition -= imageSpacing;  // Move down for the new row (adjust spacing as needed)
                //    //        //    }

                //    //        //    // Set the position of the image
                //    //        //    image.SetAbsolutePosition(xPosition, yPosition);  // Position each image horizontally

                //    //        //    // Add the image to the document
                //    //        //    document.Add(image);

                //    //        //    // Adjust the xPosition for the next image (move right)
                //    //        //    xPosition += imageSpacing; // Move right for the next image (adjust spacing as needed)
                //    //        //}
                //    //    }
                //    //}

                //    document.Close();

                //    // Convert the PDF to a byte array
                //    byte[] pdfBytes = ms.ToArray();

                //    // Encode the PDF as a Base64 string
                //    string base64String = Convert.ToBase64String(pdfBytes);

                //    // Set response values
                //    res.StatusCode = Status.Success;
                //    res.Message = Enums.TechnicalPdf;
                //    res.ReturnValue = base64String; // Send the Base64 string to the frontend

                //    return res;
                //}

                #endregion

            }

            catch (Exception ex)
            {
                res.Message = "Fail " + ex.Message;
                res.StatusCode = Status.Error;

                // Log the exception using your logging mechanism
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "ExportToPdf_v3");

                return res;
            }
        }

        private static string ConvertImagesToBase64(string htmlContent)
        {
            // Regex to find image tags with src attributes
            string imgTagPattern = @"<img\s+[^>]*src=['""]([^'""]+)['""][^>]*>";
            var matches = Regex.Matches(htmlContent, imgTagPattern, RegexOptions.IgnoreCase);

            foreach (Match match in matches)
            {
                string imageUrl = match.Groups[1].Value;
                string base64Image = GetImageAsBase64(imageUrl);

                if (!string.IsNullOrEmpty(base64Image))
                {
                    // Replace the src with the base64 data
                    string base64Src = $"data:image/jpeg;base64,{base64Image}";
                    htmlContent = htmlContent.Replace(imageUrl, base64Src);
                }
            }

            return htmlContent;
        }

        private static string GetImageAsBase64(string imageUrl)
        {
            try
            {
                byte[] imageBytes;

                if (imageUrl.StartsWith("http", StringComparison.OrdinalIgnoreCase))
                {
                    // Download image from URL
                    using (var webClient = new WebClient())
                    {
                        imageBytes = webClient.DownloadData(imageUrl);
                    }
                }
                else
                {
                    // Load image from local file path
                    imageBytes = File.ReadAllBytes(imageUrl);
                }

                return Convert.ToBase64String(imageBytes);
            }
            catch
            {
                // Handle exceptions (e.g., file not found, invalid URL)
                return null;
            }
        }

        //public async Task<string> GetBase64ImagesForTechnicalInstruction(int technicalId)
        //{
        //    var images = new List<string>();
        //    var str = "";
        //    try
        //    {
        //        // Retrieve list of Base64 images for the given TechnicalId
        //        var technicalOutlintDocs = await _context.TechnicalOutlineAttachments.Where(c => c.TechnicalId == technicalId && c.IsDeleted == false).ToListAsync();

        //        //foreach (var t in technicalOutlintDocs)
        //        //{
        //        //    using (var webClient = new WebClient())
        //        //    {
        //        //        var imageUrl = $"https://synopsandbox.sharepoint.com/sites/e-app-stage{t.DocumentFilePath}";
        //        //        byte[] imageBytes = await webClient.DownloadDataTaskAsync(imageUrl);
        //        //        string base64Image = Convert.ToBase64String(imageBytes);
        //        //        images.Add(base64Image);
        //        //    }
        //        //}

        //        foreach(var t in technicalOutlintDocs)
        //        {
        //            var imageUrl = $"https://synopsandbox.sharepoint.com/sites/e-app-stage{t.DocumentFilePath}";
        //            images.Add(imageUrl);
        //        }
        //        //string imageUrl = "https://picsum.photos/seed/picsum/200/300";

        //        int index = 1;
        //       foreach(var img in images)
        //       {
        //            str += $"<li>< a href = \"{img}\" target = \"_blank\" >Link{index}</a></li>";
        //            index = + 1;
        //       }


        //    }
        //    catch(Exception ex)
        //    {

        //    }
        //    return str;
        //}

        public async Task<AjaxResult> GetTechnicalInstructionExcel(DateTime fromDate, DateTime toDate, int employeeId, int type)
        {
            var res = new AjaxResult();

            try
            {
                var excelData = await _context.GetTechnicalExcel(fromDate, toDate, employeeId, type);
                using (var workbook = new XLWorkbook())
                {
                    var worksheet = workbook.Worksheets.Add("Technical Instruction");

                    // Get properties and determine columns to exclude
                    var properties = excelData.GetType().GetGenericArguments()[0].GetProperties();
                    var columnsToExclude = new List<int>() { 8 }; // Adjust this list based on your exclusion logic

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
                commonHelper.LogException(ex, "GetTechnicalInstructionExcel");
                return res;
            }
        }

        private static readonly Dictionary<string, string> ColumnHeaderMapping = new Dictionary<string, string>
        {
            {"RequestedDate", "Requested Date" },
            {"CTINumber","Request No" },
            {"HasAttachments","Attachment" },
            {"TargetClosureDate","Closure Date" },
            {"EquipmentNames","Equipment" },
            //{"ClosedDate","Closed Date" }
        };

        private string CapitalizeFirstLetter(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            return char.ToUpper(input[0]) + input.Substring(1);
        }
        #endregion

        #region ReOpen(Revision) the form
        public async Task<AjaxResult> ReOpenTechnicalForm(int technicalId, int userId, string comment)
        {
            var res = new AjaxResult();
            try
            {

                var technical = await _context.TechnicalInstructionSheets.Where(x => x.TechnicalId == technicalId).FirstOrDefaultAsync();
                if (technical != null)
                {
                    technical.IsReOpen = true;
                    //var internalFlow = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == troubleReportId && x.IsActive == true && x.IsClsoed == false).ToList();
                    //internalFlow.ForEach(a =>
                    //{
                    //    a.IsClsoed = true;
                    //    a.ModifiedDate = DateTime.Now;
                    //});
                    if (technical.RevisionNo == null || technical.RevisionNo == 0)
                    {
                        technical.RevisionNo = 0;//GetFormattedCTISuffix(technical.CTINumber ?? "");
                    }
                    //technical.RevisionNo = (technical.RevisionNo ?? 0) + 1;
                    await _context.SaveChangesAsync();

                    //add map - 1 in create time
                    
                    var technicalRevise = new TechnicalInstructionSheet();
                    technicalRevise.TechnicalReviseId = technicalId;
                    technicalRevise.IsReOpen = false;
                    //technicalRevise.Title = technical.Title;
                    technicalRevise.Status = ApprovalTaskStatus.Draft.ToString();
                    technicalRevise.CreatedDate = DateTime.Now;
                    //technicalRevise.IsActive = true;
                    technicalRevise.IsDeleted = false;
                    technicalRevise.CreatedBy = userId;
                    technicalRevise.IsSubmit = false;
                    technicalRevise.IsClosed = false;
                    technicalRevise.ApplicationStartDate = DateTime.Now;
                    //technicalRevise.IsReview = false;

                    _context.TechnicalInstructionSheets.Add(technicalRevise);
                    await _context.SaveChangesAsync();

                    //add map - 2
                    _context.TechnicalRevisonMapLists.Add(new TechnicalRevisonMapList { TechnicalId = technicalRevise.TechnicalId, UserId = userId });
                    await _context.SaveChangesAsync();

                    //add privious mapping - 3
                    // Retrieve the list of user IDs directly, excluding the current user.
                    var getMaps = await _context.TechnicalRevisonMapLists
                        .Where(c => c.UserId != userId && c.TechnicalId == technicalId)
                        .Select(c => c.UserId)
                        .ToListAsync();

                    // Prepare the list only if there are results.
                    if (getMaps != null && getMaps.Any())
                    {
                        var maps = getMaps.Select(mapUserId => new TechnicalRevisonMapList
                        {
                            TechnicalId = technicalRevise.TechnicalId,
                            UserId = mapUserId
                        }).ToList();

                        // Bulk add and save changes.
                        _context.TechnicalRevisonMapLists.AddRange(maps);
                        await _context.SaveChangesAsync();
                    }

                    var troubleNewReviseNum = await _context.TechnicalInstructionSheets.Where(x => x.TechnicalId == technicalRevise.TechnicalId && x.TechnicalReviseId == technicalRevise.TechnicalReviseId).FirstOrDefaultAsync();
                    if (troubleNewReviseNum != null)
                    {
                        var technicalIdParam = new Microsoft.Data.SqlClient.SqlParameter("@TechnicalId", technicalRevise.TechnicalId);
                        var ttechnicalReviseIdParam = new Microsoft.Data.SqlClient.SqlParameter("@TechnicalRevisionId", technicalRevise.TechnicalReviseId);

                        var result = await _context.Set<TechnicalNumberResult>()
                                          .FromSqlRaw("EXEC [dbo].[SPP_GenerateTechnicalRevisionNumber] @TechnicalId,@TechnicalRevisionId", technicalIdParam, ttechnicalReviseIdParam)
                                          .ToListAsync();
                        await _context.SaveChangesAsync();

                        var getUpdatedCTIRequest = await _context.TechnicalInstructionSheets.Where(x => x.TechnicalId == technicalRevise.TechnicalId && x.TechnicalReviseId == technicalRevise.TechnicalReviseId).FirstOrDefaultAsync();

                        if (getUpdatedCTIRequest != null)
                        {
                            try
                            {
                                var ss1 = result.Select(c => c.CTINumber).FirstOrDefault();
                                getUpdatedCTIRequest.RevisionNo = GetFormattedCTISuffix(ss1 ?? "");
                                //getUpdatedCTIRequest.OldCreatedBy = OldCreatedBy;
                                await _context.SaveChangesAsync();
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine(ex.Message);
                            }

                        }
                    }
                    res.StatusCode = Status.Success;
                    res.Message = Enums.TechnicalReOpen;
                    res.ReturnValue = technicalRevise.TechnicalId;
                    InsertHistoryData(technicalId, FormType.TechnicalInstruction.ToString(), null, comment, ApprovalTaskStatus.ReOpen.ToString(), userId, ApprovalTaskStatus.ReOpen.ToString(), 0);
                    //var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    //await notificationHelper.SendEmail(technicalId, EmailNotificationAction.Reopen, null, userId);
                }

            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "ReOpenTechnicalForm");
                // return res;
            }
            return res;
        }

        public async Task<string> GetReviseDataListing(int technicalId)
        {

            using (var connection = new SqlConnection(_connectionString))
            {
                var command = new SqlCommand("TechnicalReviseListingData", connection)
                {
                    CommandType = CommandType.StoredProcedure
                };
                command.Parameters.AddWithValue("@TechnicalId", technicalId);

                await connection.OpenAsync();
                var jsonResult = await command.ExecuteScalarAsync();

                return Convert.ToString(jsonResult.ToString());

            }
        }

        public int GetFormattedCTISuffix(string ctiNumber)
        {
            // Split the CTI number by '-' to check for a suffix
            var parts = ctiNumber.Split('-');

            // If a suffix exists and can be parsed as an integer, return it
            if (parts.Length >= 4 && int.TryParse(parts[^1], out int numericSuffix))
            {
                return numericSuffix;
            }

            // Return 0 if no valid suffix exists
            return 0;
        }

        public async Task<AjaxResult> ChangeRequestOwner(int technicalId, int userId, string comment)
        {
            var res = new AjaxResult();
            try
            {

                var technical = await _context.TechnicalInstructionSheets.Where(x => x.TechnicalId == technicalId).FirstOrDefaultAsync();
                if (technical != null)
                {
                    //int? OldCreatedBy = technical.CreatedBy;
                    technical.IsReOpen = true;
                    //var internalFlow = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == troubleReportId && x.IsActive == true && x.IsClsoed == false).ToList();
                    //internalFlow.ForEach(a =>
                    //{
                    //    a.IsClsoed = true;
                    //    a.ModifiedDate = DateTime.Now;
                    //});
                    if (technical.RevisionNo == null || technical.RevisionNo == 0)
                    {
                        technical.RevisionNo = 0;//GetFormattedCTISuffix(technical.CTINumber ?? "");
                    }
                    //technical.RevisionNo = (technical.RevisionNo ?? 0) + 1;
                    await _context.SaveChangesAsync();

                    var technicalRevise = new TechnicalInstructionSheet();
                    technicalRevise.TechnicalReviseId = technicalId;
                    technicalRevise.IsReOpen = false;
                    //technicalRevise.Title = technical.Title;
                    technicalRevise.Status = ApprovalTaskStatus.Draft.ToString();
                    technicalRevise.CreatedDate = DateTime.Now;
                    //technicalRevise.IsActive = true;
                    technicalRevise.IsDeleted = false;
                    //technical.OldCreatedBy = OldCreatedBy;
                    technicalRevise.CreatedBy = userId;
                    technicalRevise.IsSubmit = false;
                    technicalRevise.IsClosed = false;
                    technicalRevise.ApplicationStartDate = DateTime.Now;
                    //technicalRevise.IsReview = false;


                    _context.TechnicalInstructionSheets.Add(technicalRevise);
                    await _context.SaveChangesAsync();

                    //add map - 2
                    _context.TechnicalRevisonMapLists.Add(new TechnicalRevisonMapList { TechnicalId = technicalRevise.TechnicalId, UserId = userId });
                    await _context.SaveChangesAsync();

                    //add privious mapping - 3
                    // Retrieve the list of user IDs directly, excluding the current user.
                    var getMaps = await _context.TechnicalRevisonMapLists
                        .Where(c => c.UserId != userId && c.TechnicalId == technicalId)
                        .Select(c => c.UserId)
                        .ToListAsync();

                    // Prepare the list only if there are results.
                    if (getMaps != null && getMaps.Any())
                    {
                        var maps = getMaps.Select(mapUserId => new TechnicalRevisonMapList
                        {
                            TechnicalId = technicalRevise.TechnicalId,
                            UserId = mapUserId
                        }).ToList();

                        // Bulk add and save changes.
                        _context.TechnicalRevisonMapLists.AddRange(maps);
                        await _context.SaveChangesAsync();
                    }

                    var troubleNewReviseNum = await _context.TechnicalInstructionSheets.Where(x => x.TechnicalId == technicalRevise.TechnicalId && x.TechnicalReviseId == technicalRevise.TechnicalReviseId).FirstOrDefaultAsync();
                    if (troubleNewReviseNum != null)
                    {
                        var technicalIdParam = new Microsoft.Data.SqlClient.SqlParameter("@TechnicalId", technicalRevise.TechnicalId);
                        var ttechnicalReviseIdParam = new Microsoft.Data.SqlClient.SqlParameter("@TechnicalRevisionId", technicalRevise.TechnicalReviseId);

                        var result = await _context.Set<TechnicalNumberResult>()
                                          .FromSqlRaw("EXEC [dbo].[SPP_GenerateTechnicalRevisionNumber] @TechnicalId,@TechnicalRevisionId", technicalIdParam, ttechnicalReviseIdParam)
                                          .ToListAsync();

                        await _context.SaveChangesAsync();

                        var getUpdatedCTIRequest = await _context.TechnicalInstructionSheets.Where(x => x.TechnicalId == technicalRevise.TechnicalId && x.TechnicalReviseId == technicalRevise.TechnicalReviseId).FirstOrDefaultAsync();

                        if (getUpdatedCTIRequest != null)
                        {
                            try
                            {
                                var ss1 = result.Select(c => c.CTINumber).FirstOrDefault();
                                getUpdatedCTIRequest.RevisionNo = GetFormattedCTISuffix(ss1 ?? "");
                                //getUpdatedCTIRequest.OldCreatedBy = OldCreatedBy;
                                await _context.SaveChangesAsync();

                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine(ex.Message);
                            }

                        }

                    }
                    res.StatusCode = Status.Success;
                    res.Message = Enums.TechnicalReOpen;
                    res.ReturnValue = technicalRevise.TechnicalId;
                    InsertHistoryData(technicalId, FormType.TechnicalInstruction.ToString(), null, comment, ApprovalTaskStatus.ReOpen.ToString(), userId, ApprovalTaskStatus.ReOpen.ToString(), 0);
                    //var notificationHelper = new NotificationHelper(_context, _cloneContext);
                    //await notificationHelper.SendEmail(technicalId, EmailNotificationAction.Reopen, null, userId);
                }

            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "ChangeRequestOwner");
                // return res;
            }
            return res;
        }

        public async Task<AjaxResult> ChangeRequestOwner_V0(int technicalId, int userId)
        {
            var res = new AjaxResult();

            try
            {
                var technical = await _context.TechnicalInstructionSheets.Where(x => x.TechnicalId == technicalId).FirstOrDefaultAsync();
                if (technical != null)
                {
                    technical.OldCreatedBy = technical.CreatedBy;
                    technical.CreatedBy = userId;

                    await _context.SaveChangesAsync();

                    res.StatusCode = Status.Success;
                    res.Message = Enums.TechnicalReOpen;
                    res.ReturnValue = technical.TechnicalId;

                    InsertHistoryData(technicalId, FormType.TechnicalInstruction.ToString(), null, null, "ChangeRequestOwner", userId, "ChangeRequestOwner", 0);
                }

            }
            catch (Exception ex)
            {
                res.Message = "Fail " + ex;
                res.StatusCode = Status.Error;
                var commonHelper = new CommonHelper(_context);
                commonHelper.LogException(ex, "ChangeRequestOwner_V0");
            }

            return res;
        }
        #endregion

        #region Master API
        public async Task<IEnumerable<EquipmentMasterView>> GetEquipmentMasterList()
        {
            List<EquipmentMasterView> res = await _context.EquipmentMasters.Where(c => c.IsActive == true)
               .Select(c => new EquipmentMasterView { EquipmentId = c.EquipmentId, EquipmentName = c.EquipmentName }).ToListAsync();

            return res;
        }

        public IQueryable<SectionHeadSelectionView> GetAllSections()
        {

            IQueryable<SectionHeadSelectionView> res = _context.SectionHeadEmpMasters.Where(x => x.IsActive == true)
                                           .Select(x => new SectionHeadSelectionView
                                           {
                                               sectionHeadId = x.SectionHeadMasterId,
                                               head = x.EmployeeId,
                                               headName = x.SectionHeadName,
                                               sectionName = _context.SectionMasters
                                               .Where(c => c.SectionId == x.SectionId)
                                               .Select(c => c.SectionName)
                                               .FirstOrDefault()
                                           });
            return res;
        }

        public IQueryable<TechnicalEmployeeMasterView> GetAllEmployee()
        {

            IQueryable<TechnicalEmployeeMasterView> res = _cloneContext.EmployeeMasters.Where(x => x.IsActive == true)
                                           .Select(x => new TechnicalEmployeeMasterView
                                           {
                                               Email = x.Email,
                                               EmployeeID = x.EmployeeID,
                                               EmployeeName = x.EmployeeName
                                           });
            return res;
        }
        #endregion

        #region NotifyCellDivPart
        public async Task<NotifyCellDivPartView> NotifyCellDivPart(int technicalId)
        {
            NotifyCellDivPartView notifyCellDivPartView = new NotifyCellDivPartView();
            try
            {
                
                var pdf = await ExportToPdf_v3(technicalId);

                notifyCellDivPartView.pdf = pdf.ReturnValue;

                var get_cell_dept_id = await _cloneContext.DepartmentMasters
                .Where(c => c.Name == "Cell Production" && c.IsActive == true).Select(c => c.DepartmentID)
                .SingleOrDefaultAsync();

                if (get_cell_dept_id != null)
                {
                    var get_emps = await _cloneContext.EmployeeMasters
                        .Where(c => c.DepartmentID == get_cell_dept_id && c.IsActive == true)
                        .Select(c => c.Email)
                        .ToListAsync();

                    notifyCellDivPartView.emails = get_emps.Any() ? string.Join(";", get_emps) : null;

                    // Return a comma-separated string if there are any emails, otherwise return null.
                    return notifyCellDivPartView;
                }

            }
            catch (Exception ex)
            {

            }

            
            return notifyCellDivPartView;
        }
        #endregion

        #region Master
        #endregion

    }
}
