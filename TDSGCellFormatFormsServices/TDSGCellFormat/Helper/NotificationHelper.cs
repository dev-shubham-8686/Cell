using Azure.Core;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Http;
using Microsoft.Graph.Models;
using Microsoft.SharePoint.Client.Sharing;
using System.Net;
using System.Net.Mail;
using System.Text;
using TDSGCellFormat.Common;
using TDSGCellFormat.Models;
using TDSGCellFormat.Models.Add;
using static TDSGCellFormat.Common.Enums;

namespace TDSGCellFormat.Helper
{
    public class NotificationHelper
    {
        private readonly TdsgCellFormatDivisionContext _context;
        private readonly AepplNewCloneStageContext _cloneContext;
        private readonly IConfiguration _configuration;

        public NotificationHelper(TdsgCellFormatDivisionContext context, AepplNewCloneStageContext cloneContext)
        {
            this._context = context;
            this._cloneContext = cloneContext;

            /* var basePath = Path.Combine(Directory.GetCurrentDirectory(), "..", "TDSGCellFormat");
             var configurationBuilder = new ConfigurationBuilder()
                 .SetBasePath(basePath)
                 .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
             _configuration = configurationBuilder.Build();*/

            var basePath = Path.Combine(Directory.GetCurrentDirectory());
            var configurationBuilder = new ConfigurationBuilder()
                .SetBasePath(basePath)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);
            _configuration = configurationBuilder.Build();

        }

        public bool SendEmailNotification(List<string> toAddressIds, List<string> ccAddress, StringBuilder emailBody, string emailSubject)
        {
            bool emailSent = false;
            string? smtpUserName = _configuration["SMTPUserName"];
            string? smtpPassword = _configuration["SMTPPassword"];

            try
            {
                if (toAddressIds?.Count > 0 && emailBody?.Length > 0)
                {
                    string? IsDevelopmentStage = _configuration["IsDevelopmentStage"]?.ToUpper();
                    if (IsDevelopmentStage == "NO")
                    {
                        List<string> ccAddressIds = new List<string>();

                        if (ccAddress?.Count > 0)
                        {
                            foreach (var ccAddressObj in ccAddress)
                            {
                                ccAddressIds.Add(ccAddressObj);
                            }
                            //mailMessage.CC.Add("jipanchal@synoptek.com");
                        }
                        emailSent = SendEmailBySharePoint(toAddressIds, ccAddressIds, emailSubject, emailBody);
                        return emailSent;
                    }
                    else
                    {
                        string? emailFromAddress = _configuration["MailSettings:From"];
                        string? host = _configuration["MailSettings:Host"];

                        using (MailMessage mailMessage = new MailMessage())
                        {
                            mailMessage.From = new MailAddress(emailFromAddress);
                            if (toAddressIds?.Count > 0)
                            {
                                foreach (var toAddress in toAddressIds)
                                {
                                    mailMessage.To.Add(toAddress);
                                }
                            }
                            mailMessage.Subject = emailSubject;
                            mailMessage.Body = emailBody?.ToString();
                            mailMessage.IsBodyHtml = true;

                            if (ccAddress?.Count > 0)
                            {
                                foreach (var ccAddressObj in ccAddress)
                                {
                                    mailMessage.CC.Add(ccAddressObj);
                                }
                            }
                            //mailMessage.CC.Add("jipanchal@synoptek.com");

                            using (SmtpClient smtpClient = new SmtpClient(host))
                            {
                                smtpClient.Send(mailMessage);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                var commonHelper = new CommonHelper(_context, _cloneContext);
                commonHelper.LogException(ex, "SendEmailNotification");
                return false;
            }

            return emailSent;
        }

        private bool SendEmailBySharePoint(List<string> toAddress, List<string> ccAddress, string subject, StringBuilder body)
        {
            bool emailSent = false;
            try
            {
                string IsMailSendBySMTPSP = _configuration["IsMailSendBySMTPSP"].ToUpper();
                if (IsMailSendBySMTPSP == "YES")
                {
                    string smtpUserName = _configuration["SMTPUserName"];
                    string smtpPassword = _configuration["SMTPPassword"];

                    using (MailMessage mm = new MailMessage())
                    {
                        mm.Subject = subject;
                        mm.Body = body.ToString();
                        mm.From = new MailAddress(smtpUserName, _configuration["SmtpSettings:From"]);

                        if (toAddress?.Count > 0)
                        {
                            foreach (var toId in toAddress)
                            {
                                mm.To.Add(toId);
                            }
                        }

                        if (ccAddress?.Count > 0)
                        {
                            foreach (var ccId in ccAddress)
                            {
                                // Ensure ccId is not null or empty before adding
                                if (!string.IsNullOrEmpty(ccId))
                                {
                                    mm.CC.Add(ccId);
                                }
                            }
                        }

                        mm.IsBodyHtml = true;
                        //mm.CC.Add("jipanchal@synoptek.com");
                        //mm.CC.Add("bdavawala@synoptek.com");
                        using (SmtpClient smtp = new SmtpClient(_configuration["MailSettings:Host"]))
                        {
                            smtp.EnableSsl = Convert.ToBoolean(_configuration["MailSettings:EnableSsl"]);
                            smtp.UseDefaultCredentials = false;
                            smtp.Credentials = new NetworkCredential(smtpUserName, smtpPassword);
                            smtp.Port = Convert.ToInt32(_configuration["MailSettings:Port"]);
                            smtp.Send(mm);
                            emailSent = true;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                var commonHelper = new CommonHelper(_context, _cloneContext);
                commonHelper.LogException(ex, "SendEmailBySharePoint");
                return false;
            }

            return emailSent;
        }


        public async Task<bool> DelegateEmail(int formId, EmailNotificationAction emailNotificationAction, int? userId, int delegateId, int? assignedToUserId, string reportNo, string formType,string comment, int requestId)
        {
            bool emailSent = false;
            try
            {
                string? templateDirectory = _configuration["TemplateSettings:Normal_Mail"];
                string? AdminEmailNotification = _configuration["AdminEmailNotification"];

                List<string> emailToAddressList = new List<string>();
                List<string> emailCCAddressList = new List<string>();

                StringBuilder emailBody = new StringBuilder();

                string? templateFile = null, templateFilePath = null;

                string emailSubject = $"[{formType} Delegate Information!] " + reportNo;

                string? baseUrl = _configuration["SPSiteUrl"];
                string? documentationLink = null;


                // Mapping formType to the appropriate URL
                if (formType == FormType.AdjustmentReport.ToString())
                {
                    documentationLink = baseUrl + _configuration["AdjustmentURL"];
                }
                else if (formType == FormType.EquipmentImprovement.ToString())
                {
                    documentationLink = baseUrl + _configuration["EquipmentURL"];
                }
                else if (formType == FormType.MaterialConsumption.ToString())
                {
                    documentationLink = baseUrl + _configuration["MaterialURL"];
                }
                else if (formType == FormType.TechnicalInstruction.ToString())
                {
                    documentationLink = baseUrl + _configuration["TISURL"];
                }

                if (formId > 0)
                {
                    var EmployeeRequestUser = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == userId && x.IsActive == true).FirstOrDefault();
                    var DelegateUser = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == delegateId && x.IsActive == true).FirstOrDefault();
                    var ApproverUser = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == assignedToUserId && x.IsActive == true).FirstOrDefault();

                    templateFile = "EmailTemplate_Delegate.html";

                    if (!string.IsNullOrEmpty(templateFile))
                    {
                        string baseDirectory = AppContext.BaseDirectory;
                        templateFilePath = Path.Combine(baseDirectory, templateDirectory, templateFile);

                        if (!string.IsNullOrEmpty(templateFilePath))
                        {
                            emailBody.Append(System.IO.File.ReadAllText(templateFilePath));
                        }

                        if (emailBody?.Length > 0)
                        {
                            //  docLink = documentLink.Replace("#", "?action=approval#") + "edit/" + requestId;
                            string docLink = documentationLink.Replace("#", "?action=approval#") + "edit/" + requestId;

                            if(formType == FormType.TechnicalInstruction.ToString())
                            {
                                docLink = documentationLink.Replace("#", "?action=approval#") + "form/edit/" + requestId;
                            }

                            emailBody = emailBody.Replace("#ControlNo#", reportNo);
                            emailBody = emailBody.Replace("#Comment#", comment);
                            emailBody = emailBody.Replace("#ApprovedBy#", ApproverUser.EmployeeName);
                            emailBody = emailBody.Replace("#AdminUserName#", EmployeeRequestUser.EmployeeName);
                            emailBody = emailBody.Replace("#AdminEmailID#", AdminEmailNotification);
                            emailBody = emailBody.Replace("#FormName#", formType);
                            emailBody = emailBody.Replace("#DocumentationLink#", docLink);

                            emailToAddressList.Add(DelegateUser.Email);
                            emailCCAddressList.Add(EmployeeRequestUser.Email);
                            emailCCAddressList.Add(ApproverUser.Email);

                            emailSent = SendEmailNotification(emailToAddressList.Distinct().ToList(), emailCCAddressList.Distinct().ToList(), emailBody, emailSubject);
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                var commonHelper = new CommonHelper(_context, _cloneContext);
                commonHelper.LogException(ex, "Delegate Email");
                return false;
            }
            emailSent = true;
            return emailSent;
        }

        public async Task<bool> SendEmail(int requestId, EmailNotificationAction emailNotification, string comment = null, int nextApproverTaskId = 0)
        {
            bool emailSent = false;
            try
            {
                string? templateDirectory = _configuration["TemplateSettings:Normal_Mail"];

                //TroubleReports troubleReports = new TroubleReports();
                List<string?> emailToAddressList = new List<string?>();
                List<string?> emailCCAddressList = new List<string?>();
                string? emailSubject = null;
                bool isApprovedtask = false;
                bool isInReviewTask = false, isInReviewPullBack = false;
                bool isIsAmendTask = false;
                bool isRequestorinToEmail = false, isReqCCMail = false;

                bool isWorkDoneLeadinTOMail = false;
                bool isWorkDoneLeadCC = false;
                bool isWorkMembers = false;
                bool notifyRM = false, notifyRMCC = false, notifyWMCC = false;
                bool notifyReviewManager = false;
                string? rmName = null, rmEmail = null;
                bool isReOpen = false;
                string? reopenMemName = null, reopenMemEmail = null;
                string? workManagerName = null, workManagerEmail = null;
                string? requesterUserName = null, requesterUserEmail = null;
                string? workDoneName = null, workDoneEmail = null;
                string? workDoneLeadName = null, workDoneLeadEmail = null;
                string? workDonePeopleName = null, workDonePeopleEmail = null;
                string? templateFile = null, templateFilePath = null;
                string? AdminEmailNotification = _configuration["AdminEmailNotification"];
                bool approvelink = false;
                bool isEditable = false;
                //string? templateFilePath = null;

                //prod link
                // string? documentLink = _configuration["SPSiteUrl"] +
                // "/SitePages/Trouble-Report.aspx#/";_configuration["AdjustmentURL"];

                //stage link
                //string? documentLink = _configuration["SPSiteUrl"] +
                // "/SitePages/CellFormatStage.aspx#/";

                string? documentLink = _configuration["SPSiteUrl"] +
                _configuration["AdjustmentURL"]; ;

                StringBuilder emailBody = new StringBuilder();
                if (requestId > 0)
                {
                    var troubleReports = _context.TroubleReports.Where(x => x.TroubleReportId == requestId && x.IsDeleted == false).FirstOrDefault();
                    var reportLevel = troubleReports.ReportLevel;
                    if (troubleReports != null)
                    {
                        if (troubleReports.CreatedBy > 0)
                        {
                            EmployeeMaster? requesterUserDetail = _cloneContext.EmployeeMasters.FirstOrDefault(x => x.EmployeeID == troubleReports.CreatedBy);
                            requesterUserName = requesterUserDetail?.EmployeeName;
                            requesterUserEmail = requesterUserDetail?.Email;
                        }
                        var workDoneData = _context.WorkDoneDetails.Where(x => x.TroubleReportId == requestId && x.IsDeleted == false).Select(x => x.EmployeeId).ToList();
                        var workDoneEmails = new List<string?>();
                        if (workDoneData.Count > 0)
                        {
                            foreach (var employee in workDoneData)
                            {
                                EmployeeMaster? workDonePeople = _cloneContext.EmployeeMasters.FirstOrDefault(x => x.EmployeeID == employee);
                                workDoneName = workDonePeople?.EmployeeName;
                                workDoneEmails.Add(workDonePeople?.Email);
                            }
                        }


                        #region WokrDone Poeple
                        var workDoneLead = _context.WorkDoneDetails.Where(x => x.TroubleReportId == requestId && x.IsDeleted == false && x.Lead == true).Select(x => x.EmployeeId).FirstOrDefault();
                        if (workDoneLead != null)
                        {
                            EmployeeMaster? workDoneLeadData = _cloneContext.EmployeeMasters.FirstOrDefault(x => x.EmployeeID == workDoneLead);
                            workDoneLeadName = workDoneLeadData?.EmployeeName;
                            workDoneLeadEmail = workDoneLeadData?.Email;
                        }

                        // var workdDoneManager = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == requestId && x.IsClsoed == false && x.ProcessName == Enums.WorkDoneManager).Select(x => x.ReviewerId).FirstOrDefault();
                        if (workDoneLead != null)
                        {
                            var workDoneManager = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == workDoneLead).Select(x => x.ReportingManagerId).FirstOrDefault();
                            EmployeeMaster? workDoneManagerData = _cloneContext.EmployeeMasters.FirstOrDefault(x => x.EmployeeID == workDoneManager);
                            workManagerName = workDoneManagerData?.EmployeeName;
                            workManagerEmail = workDoneManagerData?.Email;
                        }
                        var workDoneMembers = _context.WorkDoneDetails.Where(x => x.TroubleReportId == requestId && x.IsDeleted == false && x.Lead == false).Select(x => x.EmployeeId).ToList();
                        var workDonePoepleEmails = new List<string?>();
                        if (workDoneMembers.Count > 0)
                        {
                            foreach (var people in workDoneMembers)
                            {
                                EmployeeMaster? workDonePeopleData = _cloneContext.EmployeeMasters.FirstOrDefault(x => x.EmployeeID == people);
                                workDonePeopleName = workDonePeopleData?.EmployeeName;
                                workDonePoepleEmails.Add(workDonePeopleData?.Email);
                            }

                        }
                        #endregion

                        var reportingManager = _context.TroubleReportReviewerTaskMasters.Where(x => x.TroubleReportId == requestId && x.IsClsoed == false && x.ProcessName == Enums.ReportingManager).Select(x => x.ReviewerId).FirstOrDefault();
                        if (reportingManager != null)
                        {
                            EmployeeMaster? reportingManagerData = _cloneContext.EmployeeMasters.FirstOrDefault(x => x.EmployeeID == reportingManager);
                            rmName = reportingManagerData?.EmployeeName;
                            rmEmail = reportingManagerData?.Email;
                        }




                        var approverData = await _context.GetTroubleReportWorkFlowData(requestId);
                        switch (emailNotification)
                        {
                            case EmailNotificationAction.Submitted:
                                templateFile = "TroubleReport_Submitted.html";
                                emailSubject = string.Format("[Action required!] Trouble Report_{0} has been Submitted for Approval", troubleReports.TroubleReportNo);
                                isReqCCMail = true;
                                isInReviewTask = true;
                                approvelink = true;
                                notifyWMCC = true;
                                isWorkMembers = true;
                                isWorkDoneLeadCC = true;
                                break;

                            case EmailNotificationAction.ReSubmitted:
                                templateFile = "TroubleReport_ReSubmitted.html";
                                emailSubject = string.Format("[Action required!] Trouble Report_{0} has been Resubmitted", troubleReports.TroubleReportNo);
                                isIsAmendTask = true;
                                isInReviewTask = true;
                                isReqCCMail = true;
                                notifyWMCC = true;
                                isWorkMembers = true;
                                isWorkDoneLeadCC = true;
                                break;

                            case EmailNotificationAction.Approved:
                                templateFile = "TroubleReport_Approved.html";
                                emailSubject = string.Format("[Action required!] Trouble Report_{0} has been Approved /rejected/ Asked for Amendment", troubleReports.TroubleReportNo);
                                isInReviewTask = true;
                                isApprovedtask = true;
                                approvelink = true;
                                notifyWMCC = true;
                                notifyRMCC = true;
                                isReqCCMail = true;
                                isWorkDoneLeadCC = true;
                                isWorkMembers = true;
                                break;

                            case EmailNotificationAction.ApproveInformed:
                                templateFile = "TroubleReport_ApprovedInfo.html";
                                emailSubject = string.Format("[Action taken!] Trouble Report_{0} has been Approved", troubleReports.TroubleReportNo);
                                isApprovedtask = true;
                                isWorkDoneLeadinTOMail = true;
                                isReqCCMail = true;
                                isWorkMembers = true;
                                notifyWMCC = true;
                                notifyRMCC = true;
                                break;

                            case EmailNotificationAction.PullBack:
                                templateFile = "TroubleReport_PullBack.html";
                                emailSubject = string.Format("[Action taken!] Trouble Report {0} has been PullBacked", troubleReports.TroubleReportNo);
                                isApprovedtask = true;
                                isRequestorinToEmail = true;
                                notifyRM = true;
                                notifyReviewManager = true;
                                isInReviewPullBack = true;
                                isReqCCMail = true;
                                notifyWMCC = true;
                                isWorkDoneLeadinTOMail = true;
                                isWorkMembers = true;
                                break;

                            case EmailNotificationAction.Amended:
                                templateFile = "TroubleReport_AskForAmendment.html";
                                emailSubject = string.Format("[Action required!] Trouble Report_{0} has been Asked for Amendment", troubleReports.TroubleReportNo);
                                isIsAmendTask = true;
                                isWorkDoneLeadinTOMail = true;
                                isEditable = true;
                                notifyRMCC = true;
                                isReqCCMail = true;
                                notifyWMCC = true;
                                isWorkMembers = true;
                                break;

                            case EmailNotificationAction.Reopen:
                                templateFile = "TroubleReport_ReOpen.html";
                                emailSubject = string.Format("[Action required!] Trouble Report {0} has been ReOpened", troubleReports.TroubleReportNo);
                                isReqCCMail = true;
                                isReOpen = true;
                                isWorkDoneLeadinTOMail = true;
                                isWorkMembers = true;
                                break;

                            case EmailNotificationAction.Rejected:
                                templateFile = "TroubleReport_Rejected.html";
                                emailSubject = string.Format("[Action taken!] Trouble Report_{0} has been Rejected", troubleReports.TroubleReportNo);
                                isWorkDoneLeadinTOMail = true;
                                notifyRMCC = true;
                                isReqCCMail = true;
                                notifyWMCC = true;
                                isWorkMembers = true;
                                break;

                            case EmailNotificationAction.NotifyManager:
                                templateFile = "TroubleReport_NotifyRM.html";
                                emailSubject = string.Format("[Action required!] Assign Work Done Members for {0}", troubleReports.TroubleReportNo);
                                isReqCCMail = true;
                                notifyRM = true;
                                isEditable = true;
                                break;

                            case EmailNotificationAction.NotifyWokrDone:
                                templateFile = "TroubleReport_NotifyWorkDone.html";
                                emailSubject = string.Format("[Action required!] Provide ICA for {0} ", troubleReports.TroubleReportNo);
                                isWorkDoneLeadinTOMail = true;
                                isWorkMembers = true;
                                notifyRMCC = true;
                                isReqCCMail = true;
                                notifyWMCC = true;
                                isEditable = true;
                                break;

                            case EmailNotificationAction.NotifyReviewManager:
                                templateFile = "TroubleReport_ReviewManager.html";
                                //  emailSubject = string.Format("[Action required!] Approval required {0}", troubleReports.TroubleReportNo);
                                switch (reportLevel)
                                {
                                    case 3:
                                        emailSubject = string.Format("[Action required!] Review PCA & Closure Date for {0} ", troubleReports.TroubleReportNo);
                                        break;
                                    case 2:
                                        emailSubject = string.Format("[Action required!] Review RCA & PCA Date for {0} ", troubleReports.TroubleReportNo);
                                        break;
                                    case 1:
                                        emailSubject = string.Format("[Action required!] Review ICA for {0} ", troubleReports.TroubleReportNo);
                                        break;
                                    default:
                                        break;
                                }
                                notifyRM = true;
                                isReqCCMail = true;
                                isWorkMembers = true;
                                isWorkDoneLeadCC = true;
                                notifyReviewManager = true;
                                break;

                            case EmailNotificationAction.Allow:
                                templateFile = "TroubleReport_Allow.html";
                                //emailSubject = string.Format("[Information] {0}", troubleReports.TroubleReportNo);
                                switch (reportLevel)
                                {
                                    case 3:
                                        emailSubject = string.Format("[Action taken!] PCA & Closure Date Approved for {0} ", troubleReports.TroubleReportNo);
                                        break;
                                    case 2:
                                        emailSubject = string.Format("[Action taken!] RCA & PCA Date Approved for {0} ", troubleReports.TroubleReportNo);
                                        break;
                                    case 1:
                                        emailSubject = string.Format("[Action taken!] ICA Approved for {0} ", troubleReports.TroubleReportNo);
                                        break;
                                    default:
                                        break;
                                }
                                isWorkMembers = true;
                                isWorkDoneLeadinTOMail = true;
                                isReqCCMail = true;
                                notifyWMCC = true;
                                notifyRMCC = true;
                                break;

                            case EmailNotificationAction.AllowBoth:
                                templateFile = "TroubleReport_AllowBoth.html";
                                //emailSubject = string.Format("[Action required!] Both Manager Allowed {0}", troubleReports.TroubleReportNo);
                                switch (reportLevel)
                                {
                                    case 4:
                                        emailSubject = string.Format("[Action taken!] PCA & Closure Date Approved for {0} ", troubleReports.TroubleReportNo);
                                        break;
                                    case 3:
                                        emailSubject = string.Format("[Action taken!] RCA & PCA Date Approved for {0} ", troubleReports.TroubleReportNo);
                                        break;
                                    case 2:
                                        emailSubject = string.Format("[Action taken!] ICA Approved for {0} ", troubleReports.TroubleReportNo);
                                        break;
                                    default:
                                        break;
                                }
                                isWorkDoneLeadinTOMail = true;
                                isEditable = true;
                                isWorkMembers = true;
                                isReqCCMail = true;
                                notifyRMCC = true;
                                notifyWMCC = true;
                                break;

                            case EmailNotificationAction.Decline:
                                templateFile = "TroubleReport_Decline.html";
                                //emailSubject = string.Format("[Information] Trouble Report Request Declined {0}", troubleReports.TroubleReportNo);
                                switch (reportLevel)
                                {
                                    case 3:
                                        emailSubject = string.Format("[Action taken!] PCA & Closure Date Rejected for {0} ", troubleReports.TroubleReportNo);
                                        break;
                                    case 2:
                                        emailSubject = string.Format("[Action taken!] RCA & PCA Date Rejected for {0} ", troubleReports.TroubleReportNo);
                                        break;
                                    case 1:
                                        emailSubject = string.Format("[Action taken!] ICA Rejected for {0} ", troubleReports.TroubleReportNo);
                                        break;
                                    default:
                                        break;
                                }
                                isWorkDoneLeadinTOMail = true;
                                isWorkMembers = true;
                                isEditable = true;
                                isReqCCMail = true;
                                notifyWMCC = true;
                                notifyRMCC = true;
                                break;

                            case EmailNotificationAction.Completed:
                                templateFile = "TroubleReport_Completed.html";
                                emailSubject = string.Format("[Action taken!] Trouble Report {0} has been Approved and Completed", troubleReports.TroubleReportNo);
                                isReqCCMail = true;
                                isApprovedtask = true;
                                notifyWMCC = true;
                                isWorkDoneLeadinTOMail = true;
                                isWorkMembers = true;
                                break;

                            default:
                                break;
                        }

                        if (isReqCCMail)
                        {
                            emailCCAddressList.Add(requesterUserEmail);
                        }

                        if (isRequestorinToEmail)
                        {
                            emailToAddressList.Add(requesterUserEmail);
                            emailCCAddressList.Remove(requesterUserEmail);
                        }


                        if (isWorkDoneLeadinTOMail)
                        {
                            emailToAddressList.Add(workDoneLeadEmail);
                        }

                        if (isWorkDoneLeadCC)
                        {
                            emailCCAddressList.Add(workDoneLeadEmail);
                        }

                        if (isWorkMembers)
                        {
                            foreach (var email in workDonePoepleEmails)
                            {
                                emailCCAddressList.Add(email);
                            }
                        }

                        if (isReOpen)
                        {
                            EmployeeMaster? reopenMemData = _cloneContext.EmployeeMasters.FirstOrDefault(x => x.EmployeeID == nextApproverTaskId);
                            reopenMemName = reopenMemData?.EmployeeName;
                            reopenMemEmail = reopenMemData?.Email;
                            emailToAddressList.Add(reopenMemEmail);
                        }

                        if (notifyRM)
                        {
                            emailToAddressList.Add(rmEmail);
                        }
                        if (notifyRMCC)
                        {
                            emailCCAddressList.Add(rmEmail);
                        }

                        if (notifyWMCC)
                        {
                            emailCCAddressList.Add(workManagerEmail);
                        }

                        if (notifyReviewManager)
                        {
                            emailToAddressList.Add(workManagerEmail);
                        }

                        if (isInReviewTask)
                        {
                            if (nextApproverTaskId > 0)
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.UnderApproval.ToString() && item.ApproverTaskId == nextApproverTaskId)
                                    {
                                        emailToAddressList.Add(item.email);
                                    }
                                }
                            }
                            else
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.UnderApproval.ToString())
                                    {
                                        emailToAddressList.Add(item.email);
                                    }
                                }
                            }
                        }

                        if (isInReviewPullBack)
                        {
                            if (nextApproverTaskId > 0)
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.UnderApproval.ToString() && item.ApproverTaskId == nextApproverTaskId)
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                            }
                            else
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.UnderApproval.ToString())
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                            }
                        }

                        if (isApprovedtask)
                        {
                            if (nextApproverTaskId > 0)
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.Approved.ToString() && item.ApproverTaskId == nextApproverTaskId)
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                            }
                            else
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.Approved.ToString())
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                            }
                        }
                        if (isIsAmendTask)
                        {
                            if (nextApproverTaskId > 0)
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.UnderAmendment.ToString() && item.ApproverTaskId == nextApproverTaskId)
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                            }
                            else
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.UnderAmendment.ToString())
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }

                            }
                        }
                        if (!string.IsNullOrEmpty(templateFile))
                        {
                            string baseDirectory = AppContext.BaseDirectory;
                            // string action = null;
                            string docLink = documentLink + "form/view/" + requestId;

                            templateFilePath = Path.Combine(baseDirectory, templateDirectory, templateFile);
                            if (!string.IsNullOrEmpty(templateFilePath))
                            {
                                emailBody.Append(System.IO.File.ReadAllText(templateFilePath));
                            }
                            if (emailBody?.Length > 0)
                            {
                                if (approvelink)
                                {
                                    //docLink += "?action=approval";
                                    docLink = documentLink.Replace("#", "?action=approval#") + "form/view/" + requestId;
                                }
                                else
                                {
                                    if (isEditable)
                                    {
                                        docLink = documentLink + "form/edit/" + requestId;
                                    }
                                    else
                                    {
                                        docLink = documentLink + "form/view/" + requestId;
                                    }

                                }
                                emailBody = emailBody.Replace("#TroubleLink#", docLink);
                                emailBody = emailBody.Replace("#TroubleReportNo#", troubleReports.TroubleReportNo);
                                emailBody = emailBody.Replace("#ReportTitle#", troubleReports.ReportTitle);
                                if (nextApproverTaskId == reportingManager)
                                {
                                    emailBody = emailBody.Replace("#ReviewManager#", rmName);
                                }
                                else
                                {
                                    emailBody = emailBody.Replace("#ReviewManager#", workManagerName);
                                }
                                emailBody = emailBody.Replace("#EmployeeName#", requesterUserName);
                                emailBody = emailBody.Replace("#RequestorName#", requesterUserName);
                                emailBody = emailBody.Replace("#AdminEmailID#", AdminEmailNotification);
                                emailBody = emailBody.Replace("#Raiser#", requesterUserName);
                                emailBody = emailBody.Replace("#WorkDoneLead#", workDoneLeadName);
                                emailBody = emailBody.Replace("#Manager#", rmName);
                                emailBody = emailBody.Replace("#Comment#", comment);
                                emailBody = emailBody.Replace("#AmendmendBy#", "");
                                emailBody = emailBody.Replace("#ApprovedBy#", "");

                                // Remove common addresses from emailCCAddressList and only keep them in emailToAddressList
                                var distinctToAddresses = emailToAddressList.Distinct().ToList();
                                var distinctCCAddresses = emailCCAddressList.Except(emailToAddressList).Distinct().ToList();

                                // Call SendEmailNotification with filtered lists
                                emailSent = SendEmailNotification(distinctToAddresses, distinctCCAddresses, emailBody, emailSubject);

                                // emailSent = SendEmailNotification(emailToAddressList.Distinct().ToList(), emailCCAddressList.Distinct().ToList(), emailBody, emailSubject);
                                // InsertHistoryData(troubleReportId, FormType.TroubleReport.ToString(), "Raiser", "Form Send to Manager", ApprovalTaskStatus.InProcess.ToString(), userId, HistoryAction.SendToManager.ToString(), 0);

                                var requestData = new EmailLogMaster()
                                {
                                    FormId = requestId,
                                    EmailBody = emailBody.ToString(),
                                    EmailCC = string.Join(",", emailCCAddressList.Distinct().ToList()),
                                    EmailTo = string.Join(",", emailToAddressList.Distinct().ToList()),
                                    EmailSubject = emailSubject.ToString(),
                                    EmailSentTime = DateTime.Now,
                                    isDelete = false,
                                    IsEmailSent = emailSent,
                                };
                                _context.EmailLogMasters.Add(requestData);
                                await _context.SaveChangesAsync();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                var commonHelper = new CommonHelper(_context, _cloneContext);
                commonHelper.LogException(ex, "SendEmail");
                return false;
            }
            emailSent = true;
            return emailSent;
        }

        public async Task<bool> SendMaterialConsumptionEmail(int requestId, EmailNotificationAction emailNotification, string comment = null, int nextApproverTaskId = 0)
        {
            bool emailSent = false;
            try
            {
                StringBuilder emailBody = new StringBuilder();

                string? templateDirectory = _configuration["TemplateSettings:Normal_Mail"];

                //TroubleReports troubleReports = new TroubleReports();
                List<string?> emailToAddressList = new List<string?>();
                List<string?> emailCCAddressList = new List<string?>();
                string? emailSubject = null;
                string? templateFile = null, templateFilePath = null;
                bool isApprovedtask = false;
                bool isInReviewTask = false;
                bool isRequestorinToEmail = false;
                bool isRequestorinCCEmail = false;
                bool isDepartMentHead = false;
                bool isIsAmendTask = false;
                string? requesterUserName = null, requesterUserEmail = null;
                string? departmentHeadName = null, departmentHeadEmail = null;
                bool approvelink = false;
                bool cpcDeptPeople = false;
                string? AdminEmailNotification = _configuration["AdminEmailNotification"];

                //stage link
                // string? documentLink = _configuration["SPSiteUrl"] +
                // "/SitePages/MaterialConsumptionSlip.aspx#/form/";

                //prod link
                // string? documentLink = _configuration["SPSiteUrl"] +
                //"/SitePages/MaterialConsumptionSlip.aspx#/form/";

                string? documentLink = _configuration["SPSiteUrl"] +
                _configuration["MaterialURL"];

                if (requestId > 0)
                {
                    var materialData = _context.MaterialConsumptionSlips.Where(x => x.MaterialConsumptionSlipId == requestId && x.IsDeleted == false).FirstOrDefault();
                    var materialNum = _context.MaterialConsumptionSlips.Where(x => x.MaterialConsumptionSlipId == requestId && x.IsDeleted == false).Select(x => x.MaterialConsumptionSlipNo).FirstOrDefault();
                    if (materialData != null)
                    {
                        if (materialData.CreatedBy > 0)
                        {
                            EmployeeMaster? requestorUserDetails = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == materialData.CreatedBy && x.IsActive == true).FirstOrDefault();
                            requesterUserName = requestorUserDetails?.EmployeeName;
                            requesterUserEmail = requestorUserDetails?.Email;

                            ///requestorUserDetails.DepartMentId in DepartmentMaster 
                            var departMentHead = _cloneContext.DepartmentMasters.Where(x => x.DepartmentID == requestorUserDetails.DepartmentID && x.IsActive == true).Select(x => x.Head).FirstOrDefault();
                            EmployeeMaster? departMentHeadDetails = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == departMentHead && x.IsActive == true).FirstOrDefault();
                            departmentHeadName = departMentHeadDetails?.EmployeeName;
                            departmentHeadEmail = departMentHeadDetails?.Email;
                        }
                        var approverData = await _context.GetMaterialWorkFlowData(requestId);

                        switch (emailNotification)
                        {
                            case EmailNotificationAction.Submitted:
                                templateFile = "MaterialConsumption_Submitted.html";
                                emailSubject = string.Format("[Action required!] MCS_{0} has been Submitted for Approval", materialData.MaterialConsumptionSlipNo);
                                isInReviewTask = true;
                                approvelink = true;
                                isRequestorinCCEmail = true;
                                break;

                            case EmailNotificationAction.ReSubmitted:
                                templateFile = "MaterialConsumption_ReSubmitted.html";
                                emailSubject = string.Format("[Action required!] MCS_{0} has been amended", materialData.MaterialConsumptionSlipNo);
                                isInReviewTask = true;
                                approvelink = true;
                                isRequestorinCCEmail = true;
                                break;

                            case EmailNotificationAction.Approved:
                                templateFile = "MaterialConsumption_Approved.html";
                                emailSubject = string.Format("[Action required!] MCS_{0} has been Submitted for Approval", materialData.MaterialConsumptionSlipNo);
                                isInReviewTask = true;
                                isApprovedtask = true;
                                approvelink = true;
                                isRequestorinCCEmail = true;
                                break;

                            case EmailNotificationAction.ApproveInformed:
                                templateFile = "MaterialConsumption_ApprovedInfo.html";
                                emailSubject = string.Format("[Action taken!] MCS_{0} has been Approved", materialData.MaterialConsumptionSlipNo);
                                isRequestorinToEmail = true;
                                break;

                            case EmailNotificationAction.Amended:
                                templateFile = "MaterialConsumption_AskForAmendment .html";
                                emailSubject = string.Format("[Action taken!] MCS_{0} has been Asked for Amendment", materialData.MaterialConsumptionSlipNo);
                                isRequestorinToEmail = true;
                                approvelink = true;
                                break;

                            case EmailNotificationAction.PullBack:
                                templateFile = "MaterialConsumption_PullBack.html";
                                emailSubject = string.Format("[Action taken!] MCS_{0} has been Pull Backed", materialData.MaterialConsumptionSlipNo);
                                isApprovedtask = true;
                                isInReviewTask = true;
                                isRequestorinCCEmail = true;
                                break;

                            case EmailNotificationAction.Completed:
                                templateFile = "MaterialConsumption_Completed.html";
                                emailSubject = string.Format("[Action required!]  MCS_{0} has been Approved and Submitted for close request", materialData.MaterialConsumptionSlipNo);
                                isRequestorinToEmail = true;
                                cpcDeptPeople = true;
                                break;

                            case EmailNotificationAction.Closed:
                                templateFile = "MaterialConsumption_Closed.html";
                                emailSubject = string.Format("[Action Taken] MCS_{0} has been Closed", materialData.MaterialConsumptionSlipNo);
                                isDepartMentHead = true;
                                break;

                            default:
                                break;
                        }

                        if (isRequestorinToEmail)
                        {
                            emailToAddressList.Add(requesterUserEmail);
                            emailCCAddressList.Remove(requesterUserEmail);
                        }
                        if (isRequestorinCCEmail)
                        {
                            emailCCAddressList.Add(requesterUserEmail);
                        }

                        if (cpcDeptPeople)
                        {
                            var cpcDeptPeopleList = _context.CPCGroupMasters.Where(x => x.IsActive == true).Select(x => x.Email).ToList();

                            foreach (var cepDept in cpcDeptPeopleList)
                            {
                                emailCCAddressList.Add(cepDept);
                            }

                        }

                        if (isDepartMentHead)
                        {
                            var cpcDeptPeopleList = _context.CPCGroupMasters.Where(x => x.IsActive == true).Select(x => x.Email).ToList();

                            if (nextApproverTaskId == materialData.CreatedBy)
                            {
                                foreach (var cepDept in cpcDeptPeopleList)
                                {
                                    emailToAddressList.Add(cepDept);
                                }
                            }
                            else
                            {
                                // all cpc people will be in to and req in cc
                                emailCCAddressList.Add(requesterUserEmail);
                                foreach (var cepDept in cpcDeptPeopleList)
                                {
                                    emailToAddressList.Add(cepDept);
                                }
                            }
                        }

                        if (isInReviewTask)
                        {
                            if (nextApproverTaskId > 0)
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.InReview.ToString() && item.ApproverTaskId == nextApproverTaskId)
                                    {
                                        emailToAddressList.Add(item.email);
                                    }
                                }
                            }
                            else
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.InReview.ToString())
                                    {
                                        emailToAddressList.Add(item.email);
                                    }
                                }
                            }
                        }

                        if (isApprovedtask)
                        {
                            if (nextApproverTaskId > 0)
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.Approved.ToString() && item.ApproverTaskId == nextApproverTaskId)
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                            }
                            else
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.Approved.ToString())
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                            }
                        }

                        if (isIsAmendTask)
                        {
                            if (nextApproverTaskId > 0)
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.UnderAmendment.ToString() && item.ApproverTaskId == nextApproverTaskId)
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                            }
                        }

                        if (!string.IsNullOrEmpty(templateFile))
                        {
                            string baseDirectory = AppContext.BaseDirectory;
                            string docLink = documentLink + "view/" + requestId;
                            templateFilePath = Path.Combine(baseDirectory, templateDirectory, templateFile);
                            if (!string.IsNullOrEmpty(templateFilePath))
                            {
                                emailBody.Append(System.IO.File.ReadAllText(templateFilePath));
                            }
                            if (emailBody?.Length > 0)
                            {
                                if (approvelink)
                                {
                                    docLink = documentLink.Replace("#", "?action=approval#") + "edit/" + requestId;
                                }
                                else
                                {
                                    docLink = documentLink + "view/" + requestId;
                                }

                                emailBody = emailBody.Replace("#MaterialLink#", docLink);
                                emailBody = emailBody.Replace("#MaterialConsumptionNo#", materialNum);
                                emailBody = emailBody.Replace("#Requestor#", requesterUserName);
                                emailBody = emailBody.Replace("#Comment#", comment);
                                emailBody = emailBody.Replace("#AdminEmailID#", AdminEmailNotification);
                                emailSent = SendEmailNotification(emailToAddressList.Distinct().ToList(), emailCCAddressList.Distinct().ToList(), emailBody, emailSubject);
                                var requestData = new EmailLogMaster()
                                {
                                    FormId = requestId,
                                    EmailBody = emailBody.ToString(),
                                    EmailCC = string.Join(",", emailCCAddressList.Distinct().ToList()),
                                    EmailTo = string.Join(",", emailToAddressList.Distinct().ToList()),
                                    EmailSubject = emailSubject.ToString(),
                                    EmailSentTime = DateTime.Now,
                                    isDelete = false,
                                    IsEmailSent = emailSent,
                                };
                                _context.EmailLogMasters.Add(requestData);
                                await _context.SaveChangesAsync();
                            }
                        }

                    }
                }

            }
            catch (Exception ex)
            {
                var commonHelper = new CommonHelper(_context, _cloneContext);
                commonHelper.LogException(ex, "SendMaterialConsumptionEmail");
                return false;
            }
            emailSent = true;
            return emailSent;
        }

        public async Task<bool> SendEquipmentEmail(int requestId, EmailNotificationAction emailNotification, string comment = null, int nextApproverTaskId = 0)
        {
            bool emailSent = false;
            try
            {
                StringBuilder emailBody = new StringBuilder();

                string? templateDirectory = _configuration["TemplateSettings:Normal_Mail"];

                //TroubleReports troubleReports = new TroubleReports();
                List<string?> emailToAddressList = new List<string?>();
                List<string?> emailCCAddressList = new List<string?>();
                string? emailSubject = null;
                string? templateFile = null, templateFilePath = null;
                bool isApprovedtask = false;
                bool isInReviewTask = false;
                bool isRequestorinToEmail = false;
                bool isRequestorinCCEmail = false;
                bool isSectionHeadIncc = false, isSectionHeadInTo = false;
                bool isIsAmendTask = false, allApprover = false, isLogicalAmend = false;
                string? requesterUserName = null, requesterUserEmail = null;
                int reqDeptId = 0;
                bool approvelink = false;
                string? AdminEmailNotification = _configuration["AdminEmailNotification"];
                string? Role = null;
                bool isEditable = false, isPullBacked = false;

                //stage link
                string? documentLink = _configuration["SPSiteUrl"] +
                     _configuration["EquipmentURL"];


                //prod link
                //string? documentLink = _configuration["SPSiteUrl"] +
                //"/SitePages/MaterialConsumptionSlip.aspx#/form/";

                if (requestId > 0)
                {
                    var equipmentData = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == requestId && x.IsDeleted == false).FirstOrDefault();
                    var equipmentNo = _context.EquipmentImprovementApplication.Where(x => x.EquipmentImprovementId == requestId && x.IsDeleted == false).Select(x => x.EquipmentImprovementNo).FirstOrDefault();
                    var sectionName = _context.SectionMasters.Where(x => x.SectionId == equipmentData.SectionId && x.IsActive == true).Select(x => x.SectionName).FirstOrDefault();
                    var areaIds = equipmentData.AreaId.Split(',').Select(id => int.Parse(id)).ToList();
                    var areaNames = new List<string>();
                    foreach (var id in areaIds)
                    {
                        // Query database or use a dictionary/cache to get the name
                        var areaName = _context.Areas.Where(x => x.AreaId == id && x.IsActive == true).Select(x => x.AreaName).FirstOrDefault(); // Replace this with your actual DB logic
                        if (!string.IsNullOrEmpty(areaName))
                        {
                            areaNames.Add(areaName);
                        }
                    }

                    var areaNamesString = string.Join(", ", areaNames);

                    if (equipmentData != null)
                    {
                        if (equipmentData.CreatedBy > 0)
                        {
                            EmployeeMaster? requestorUserDetails = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == equipmentData.CreatedBy && x.IsActive == true).FirstOrDefault();
                            requesterUserName = requestorUserDetails?.EmployeeName;
                            requesterUserEmail = requestorUserDetails?.Email;
                            reqDeptId = requestorUserDetails.DepartmentID;
                        }

                        var approverData = await _context.GetEquipmentWorkFlowData(requestId);


                        switch (emailNotification)
                        {
                            case EmailNotificationAction.Submitted:
                                templateFile = "Equipment_Submitted.html";
                                emailSubject = string.Format("[Action required!] Equipment Improvement_{0} has been Submitted for Approval", equipmentNo);
                                isInReviewTask = true;
                                approvelink = true;
                                break;

                            case EmailNotificationAction.ReSubmitted:
                                templateFile = "Equipment_Resubmitted.html";
                                emailSubject = string.Format("[Action required!] Equipment Improvement_{0} has been Resubmitted for Approval", equipmentNo);
                                isInReviewTask = true;
                                approvelink = true;
                                isRequestorinCCEmail = true;
                                break;

                            case EmailNotificationAction.Approved:
                                templateFile = "Equipment_Approved.html";
                                emailSubject = string.Format("[Action taken!] Equipment Improvement_{0} has been Approved", equipmentNo);
                                isInReviewTask = true;
                                approvelink = true;
                                isRequestorinCCEmail = true;
                                break;

                            case EmailNotificationAction.AutoApproved:
                                templateFile = "Equipment_AutoApprove.html";
                                emailSubject = string.Format("[Action taken!] Equipment Improvement_{0} has been Auto Approved", equipmentNo);

                                approvelink = true;
                                isRequestorinCCEmail = true;
                                break;

                            case EmailNotificationAction.Amended:
                                templateFile = "Equipment_Amend.html";
                                emailSubject = string.Format("[Action taken!] Equipment Improvement_{0} has been Asked for Amendment", equipmentNo);
                                isRequestorinToEmail = true;
                                isIsAmendTask = true;
                                isEditable = true;
                                break;

                            case EmailNotificationAction.LogicalAmend:
                                templateFile = "Equipment_LogicalAmend.html";
                                emailSubject = string.Format("[Action taken!] Equipment Improvement_{0} has been Asked for Logical Amendment", equipmentNo);
                                isRequestorinToEmail = true;
                                isLogicalAmend = true;
                                isEditable = true;
                                break;

                            case EmailNotificationAction.Rejected:
                                templateFile = "Equipment_Rejected.html";
                                emailSubject = string.Format("[Action taken!] Equipment Improvement_{0} has been Rejected", equipmentNo);
                                isRequestorinToEmail = true;
                                allApprover = true;
                                break;

                            case EmailNotificationAction.PullBack:
                                templateFile = "Equipment_PullBack.html";
                                emailSubject = string.Format("[Action taken!] Equipment Improvement_{0} has been Pull Backed", equipmentNo);
                                isRequestorinCCEmail = true;
                                isPullBacked = true;
                                break;

                            case EmailNotificationAction.Completed:
                                templateFile = "Equipment_Completed.html";
                                emailSubject = string.Format("[Action taken!]  Equipment Improvement_{0} has been Completed", equipmentNo);
                                isRequestorinToEmail = true;
                                allApprover = true;
                                break;

                            case EmailNotificationAction.W1Completed:
                                templateFile = "Equipment_W1Completed.html";
                                emailSubject = string.Format("[Action taken!] Equipment Improvement_{0} has been Approved", equipmentNo);
                                isSectionHeadIncc = true;
                                isRequestorinToEmail = true;
                                isEditable = true;
                                break;

                            case EmailNotificationAction.UnderImplementation:
                                templateFile = "Equipment_UnderImplementation.html";
                                emailSubject = string.Format("[Action taken!] Equipment Improvement_{0} Target Date Entered", equipmentNo);
                                isSectionHeadInTo = true;
                                break;

                            case EmailNotificationAction.ResultMonitoring:
                                templateFile = "Equipment_ResultSubmit.html";
                                emailSubject = string.Format("[Action taken!] Equipment Improvement_{0} Actual Date Entered", equipmentNo);
                                isSectionHeadInTo = true;
                                break;

                            case EmailNotificationAction.ResultSubmit:
                                templateFile = "Equipment_ResultSubmit.html";
                                emailSubject = string.Format("[Action required!] Equipment Improvement_{0} Result Section has been Submitted for Approval", equipmentNo);
                                isSectionHeadInTo = true;
                                approvelink = true;
                                break;

                            case EmailNotificationAction.ResultApprove:
                                templateFile = "Equipment_ResultApprove.html";
                                emailSubject = string.Format("[Action taken!] Equipment Improvement_{0} Result Section has been Approved", equipmentNo);
                                isRequestorinToEmail = true;
                                allApprover = true;
                                break;

                            case EmailNotificationAction.ToshibaTeamDiscussion:
                                templateFile = "Equipment_ToshibaTeamDiscussion.html";
                                emailSubject = string.Format("[Action taken!]  Equipment Improvement_{0} Toshiba Team Discussion Required", equipmentNo);
                                isRequestorinCCEmail = true;
                                break;

                            case EmailNotificationAction.ToshibaTeamApproval:
                                templateFile = "Equipment_ToshibaTeamApproval.html";
                                emailSubject = string.Format("[Action taken!]  Equipment Improvement_{0} Toshiba Team Approval Required", equipmentNo);
                                isRequestorinCCEmail = true;
                                break;

                            case EmailNotificationAction.PcrnRequired:
                                templateFile = "Equipment_PcrnRequired.html";
                                emailSubject = string.Format("[Action required!]  Equipment Improvement_{0} PCRN Required", equipmentNo);
                                isRequestorinToEmail = true;
                                isEditable = true;

                                break;
                            default:
                                break;
                        }

                        if (isPullBacked)
                        {
                            foreach (var item in approverData)
                            {
                                if (item.Status != ApprovalTaskStatus.Pending.ToString())
                                {
                                    emailToAddressList.Add(item.email);
                                }
                            }
                        }

                        if (emailNotification == EmailNotificationAction.AutoApproved)
                        {
                            foreach (var item in approverData)
                            {
                                if (item.Status != ApprovalTaskStatus.AutoApproved.ToString())
                                {
                                    emailToAddressList.Add(item.email);
                                }
                            }
                        }

                        if (isInReviewTask)
                        {
                            if (nextApproverTaskId > 0)
                            {
                                foreach (var item in approverData)
                                {
                                    var task = approverData.FirstOrDefault(item =>
                                                       item.Status == ApprovalTaskStatus.InReview.ToString()
                                                       && item.ApproverTaskId == nextApproverTaskId);
                                    if (task != null)
                                    {
                                        if (task.SequenceNo == 3)
                                        {
                                            var userOtherDepId = _cloneContext.DepartmentMasters.Where(x => x.DepartmentID != reqDeptId && x.IsActive == true && x.DivisionID == 1 && (x.HRMSDeptName == "CP01-DP-1003" || x.HRMSDeptName == "CP01-DP-1004" || x.HRMSDeptName == "CP01-DP-1002")).Select(x => x.Head).ToList();
                                            foreach (var dept in userOtherDepId)
                                            {
                                                var deptEmail = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == dept && x.IsActive == true).Select(x => x.Email).FirstOrDefault();

                                                emailCCAddressList.Add(deptEmail);
                                            }
                                            var sectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.EmployeeId == equipmentData.SectionHeadId).Select(x => x.EmployeeId).FirstOrDefault();


                                            var sectionEmail = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == sectionHeadId && x.IsActive == true).Select(x => x.Email).FirstOrDefault();

                                            emailCCAddressList.Add(sectionEmail);

                                            emailToAddressList.Add(task.email);
                                        }
                                        else if (item.SequenceNo == 2)
                                        {
                                            emailToAddressList.Add(task.email);
                                        }
                                        else
                                        {
                                            var sectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.EmployeeId != equipmentData.SectionHeadId).Select(x => x.EmployeeId).ToList();
                                            foreach (var section in sectionHeadId)
                                            {
                                                var sectionEmail = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == section && x.IsActive == true).Select(x => x.Email).FirstOrDefault();

                                                emailCCAddressList.Add(sectionEmail);
                                            }
                                            emailToAddressList.Add(task.email);
                                        }
                                    }

                                }
                            }
                            else
                            {
                                foreach (var item in approverData)
                                {
                                    var task = approverData.FirstOrDefault(item =>
                                                       item.Status == ApprovalTaskStatus.InReview.ToString()
                                                       );
                                    if (task != null)
                                    {
                                        if (task.SequenceNo == 3)
                                        {
                                            var userOtherDepId = _cloneContext.DepartmentMasters.Where(x => x.DepartmentID != reqDeptId && x.IsActive == true && x.DivisionID == 1 && (x.HRMSDeptName == "CP01-DP-1003" || x.HRMSDeptName == "CP01-DP-1004" || x.HRMSDeptName == "CP01-DP-1002")).Select(x => x.Head).ToList();
                                            foreach (var dept in userOtherDepId)
                                            {
                                                var deptEmail = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == dept && x.IsActive == true).Select(x => x.Email).FirstOrDefault();

                                                emailCCAddressList.Add(deptEmail);
                                            }

                                            var sectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.EmployeeId == equipmentData.SectionHeadId).Select(x => x.EmployeeId).FirstOrDefault();


                                            var sectionEmail = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == sectionHeadId && x.IsActive == true).Select(x => x.Email).FirstOrDefault();

                                            emailCCAddressList.Add(sectionEmail);

                                            emailToAddressList.Add(task.email);
                                        }
                                        else if (task.SequenceNo == 2)
                                        {
                                            emailToAddressList.Add(task.email);
                                        }
                                        else if (task.SequenceNo == 1)
                                        {
                                            var sectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.EmployeeId != equipmentData.SectionHeadId).Select(x => x.EmployeeId).ToList();
                                            foreach (var section in sectionHeadId)
                                            {
                                                var sectionEmail = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == section && x.IsActive == true).Select(x => x.Email).FirstOrDefault();

                                                emailCCAddressList.Add(sectionEmail);
                                            }
                                            emailToAddressList.Add(task.email);
                                        }
                                        else
                                        {
                                            var sectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.EmployeeId == equipmentData.SectionHeadId).Select(x => x.EmployeeId).FirstOrDefault();

                                            var sectionEmail = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == sectionHeadId && x.IsActive == true).Select(x => x.Email).FirstOrDefault();

                                            emailCCAddressList.Add(sectionEmail);
                                            emailToAddressList.Add(task.email);
                                        }
                                    }
                                }
                            }
                        }

                        if (isApprovedtask)
                        {
                            if (nextApproverTaskId > 0)
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.Approved.ToString() && item.ApproverTaskId == nextApproverTaskId)
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                            }
                            else
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.Approved.ToString())
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                            }
                        }

                        if (isRequestorinCCEmail)
                        {
                            emailCCAddressList.Add(requesterUserEmail);

                            if (emailNotification == EmailNotificationAction.ToshibaTeamApproval || emailNotification == EmailNotificationAction.ToshibaTeamDiscussion)
                            {
                                foreach (var item in approverData)
                                {
                                    if ((item.SequenceNo == 2 || item.SequenceNo == 5) && item.WorkFlowlevel == 1)
                                    {
                                        emailToAddressList.Add(item.email);
                                    }
                                }
                            }
                        }

                        if (isRequestorinToEmail)
                        {
                            emailToAddressList.Add(requesterUserEmail);
                        }

                        if (isSectionHeadIncc)
                        {
                            foreach (var item in approverData)
                            {
                                if (item.SequenceNo == 1 && item.WorkFlowlevel == 1)
                                {
                                    emailCCAddressList.Add(item.email);
                                }
                            }
                        }

                        if (isSectionHeadInTo)
                        {
                            foreach (var item in approverData)
                            {
                                if (item.SequenceNo == 1 && item.WorkFlowlevel == 1)
                                {
                                    emailToAddressList.Add(item.email);
                                }
                            }
                            if (emailNotification == EmailNotificationAction.ResultSubmit)
                            {
                                var sectionHeadId = _context.SectionHeadEmpMasters.Where(x => x.EmployeeId != equipmentData.SectionHeadId).Select(x => x.EmployeeId).ToList();
                                foreach (var section in sectionHeadId)
                                {
                                    var sectionEmail = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == section && x.IsActive == true).Select(x => x.Email).FirstOrDefault();

                                    emailCCAddressList.Add(sectionEmail);
                                }
                            }
                        }

                        if (isIsAmendTask)
                        {
                            if (nextApproverTaskId > 0)
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.UnderAmendment.ToString() && item.ApproverTaskId == nextApproverTaskId)
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                            }
                        }

                        if (isLogicalAmend)
                        {
                            if (nextApproverTaskId > 0)
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.LogicalAmendment.ToString() && item.ApproverTaskId == nextApproverTaskId)
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                                //foreach (var i in approverData)
                                //{
                                //    if (i.SequenceNo == 2 && i.WorkFlowlevel == 1)
                                //    {
                                //        emailToAddressList.Add(i.email);
                                //    }
                                //}
                            }
                        }

                        if (allApprover)
                        {
                            foreach (var item in approverData)
                            {
                                emailCCAddressList.Add(item.email);
                            }
                        }

                        if (nextApproverTaskId > 0)
                        {
                            var approvalData = _context.EquipmentImprovementApproverTaskMasters.Where(x => x.EquipmentImprovementId == requestId && (x.Status != ApprovalTaskStatus.InReview.ToString() || x.Status != ApprovalTaskStatus.Pending.ToString()) && x.IsActive == true)
                                .OrderByDescending(x => x.ApproverTaskId)
                                .FirstOrDefault();
                            Role = approvalData?.Role;
                        }

                        if (!string.IsNullOrEmpty(templateFile))
                        {
                            string baseDirectory = AppContext.BaseDirectory;
                            string docLink = documentLink + "view/" + requestId;
                            templateFilePath = Path.Combine(baseDirectory, templateDirectory, templateFile);
                            if (!string.IsNullOrEmpty(templateFilePath))
                            {
                                emailBody.Append(System.IO.File.ReadAllText(templateFilePath));
                            }
                            if (emailBody?.Length > 0)
                            {
                                if (approvelink)
                                {
                                    docLink = documentLink.Replace("#", "?action=approval#") + "edit/" + requestId;
                                }
                                else
                                {
                                    if (isEditable)
                                    {
                                        docLink = documentLink + "edit/" + requestId;
                                    }
                                    else
                                    {
                                        docLink = documentLink + "view/" + requestId;
                                    }

                                }

                                emailBody = emailBody.Replace("#EquipmentLink#", docLink);
                                emailBody = emailBody.Replace("#ApplicationNo#", equipmentNo);
                                emailBody = emailBody.Replace("#Improvement#", equipmentData.ImprovementName);
                                emailBody = emailBody.Replace("#Area#", areaNamesString);
                                emailBody = emailBody.Replace("#Section#", sectionName);
                                emailBody = emailBody.Replace("#Requestor#", requesterUserName);
                                emailBody = emailBody.Replace("#Comment#", comment);
                                emailBody = emailBody.Replace("#Role#", Role);
                                emailBody = emailBody.Replace("#AdminEmailID#", AdminEmailNotification);
                                emailSent = SendEmailNotification(emailToAddressList.Distinct().ToList(), emailCCAddressList.Distinct().ToList(), emailBody, emailSubject);
                                var requestData = new EmailLogMaster()
                                {
                                    FormId = requestId,
                                    EmailBody = emailBody.ToString(),
                                    EmailCC = string.Join(",", emailCCAddressList.Distinct().ToList()),
                                    EmailTo = string.Join(",", emailToAddressList.Distinct().ToList()),
                                    EmailSubject = emailSubject.ToString(),
                                    EmailSentTime = DateTime.Now,
                                    isDelete = false,
                                    IsEmailSent = emailSent,
                                };
                                _context.EmailLogMasters.Add(requestData);
                                await _context.SaveChangesAsync();
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                var commonHelper = new CommonHelper(_context, _cloneContext);
                commonHelper.LogException(ex, "SendEquipmentEmail");
                return false;
            }
            emailSent = true;
            return emailSent;
        }

        public async Task<bool> SendTechanicalInstructionEmail(int requestId, EmailNotificationAction emailNotification, string comment = null, int nextApproverTaskId = 0)
        {
            bool emailSent = false;
            try
            {
                StringBuilder emailBody = new StringBuilder();

                string? templateDirectory = _configuration["TemplateSettings:Normal_Mail"];

                List<string?> emailToAddressList = new List<string?>();
                List<string?> emailCCAddressList = new List<string?>();
                string? emailSubject = null;
                string? templateFile = null, templateFilePath = null;
                bool isApprovedtask = false;
                bool isInReviewTask = false;
                bool isRequestorinToEmail = false;
                bool isRequestorinCCEmail = false;
                bool isDepartMentHead = false;
                bool isIsAmendTask = false;
                string? requesterUserName = null, requesterUserEmail = null;
                string? departmentHeadName = null, departmentHeadEmail = null;
                bool approvelink = false;
                bool userEditLinkFromEmail = false;
                bool cpcDeptPeople = false;
                string? AdminEmailNotification = _configuration["AdminEmailNotification"];
                string? documentLink = _configuration["SPSiteUrl"] +
                    _configuration["TISURL"];
                //"/SitePages/Technical-Instruction-Sheet.aspx#/";
                bool allPersonInCc = false;
                //string? documentLink = _configuration["SPSiteUrl"] +
                //"/SitePages/TechInstructionSheet.aspx#/";

                if (requestId > 0)
                {
                    var materialData = _context.TechnicalInstructionSheets.Where(x => x.TechnicalId == requestId && x.IsDeleted == false).FirstOrDefault();
                    var materialNum = _context.TechnicalInstructionSheets.Where(x => x.TechnicalId == requestId && x.IsDeleted == false).Select(x => x.CTINumber).FirstOrDefault();
                    var Title = materialData.Title;
                    if (materialData != null)
                    {
                        if (materialData.CreatedBy > 0)
                        {
                            EmployeeMaster? requestorUserDetails = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == materialData.CreatedBy && x.IsActive == true).FirstOrDefault();
                            requesterUserName = requestorUserDetails?.EmployeeName;
                            requesterUserEmail = requestorUserDetails?.Email;

                            ///requestorUserDetails.DepartMentId in DepartmentMaster 
                            var departMentHead = _cloneContext.DepartmentMasters.Where(x => x.DepartmentID == requestorUserDetails.DepartmentID && x.IsActive == true).Select(x => x.Head).FirstOrDefault();
                            EmployeeMaster? departMentHeadDetails = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == departMentHead && x.IsActive == true).FirstOrDefault();
                            departmentHeadName = departMentHeadDetails?.EmployeeName;
                            departmentHeadEmail = departMentHeadDetails?.Email;
                        }

                        var approverData = await _context.GetTechnicalWorkFlowData(requestId);

                        switch (emailNotification)
                        {
                            case EmailNotificationAction.Submitted:
                                templateFile = "TechnicalInstruction_Submitted.html";
                                emailSubject = string.Format("[Action required!] TIS_{0} has been Submitted for Approval", materialData.CTINumber);
                                isInReviewTask = true;
                                approvelink = true;
                                isRequestorinCCEmail = true;
                                break;

                            case EmailNotificationAction.ReSubmitted:
                                templateFile = "TechnicalInstruction_ReSubmitted.html";
                                emailSubject = string.Format("[Action required!] TIS_{0} has been amended", materialData.CTINumber);
                                isInReviewTask = true;
                                approvelink = true;
                                isRequestorinCCEmail = true;
                                break;

                            case EmailNotificationAction.Approved:
                                templateFile = "TechnicalInstruction_Approved.html";
                                emailSubject = string.Format("[Action required!] TIS_{0} has been Submitted for Approval", materialData.CTINumber);
                                isInReviewTask = true;
                                isApprovedtask = true;
                                approvelink = true;
                                isRequestorinCCEmail = true;
                                break;

                            case EmailNotificationAction.ApproveInformed:
                                templateFile = "TechnicalInstruction_ApprovedInfo.html";
                                emailSubject = string.Format("[Action taken!] TIS_{0} has been Approved", materialData.CTINumber);
                                isRequestorinToEmail = true;
                                break;

                            case EmailNotificationAction.Amended:
                                templateFile = "TechnicalInstruction_AskForAmendment.html";
                                emailSubject = string.Format("[Action taken!] TIS_{0} has been Asked for Amendment", materialData.CTINumber);
                                isRequestorinToEmail = true;
                                userEditLinkFromEmail = true;
                                approvelink = true;
                                break;

                            case EmailNotificationAction.PullBack:
                                templateFile = "TechnicalInstruction_PullBack.html";
                                emailSubject = string.Format("[Action taken!] TIS_{0} has been Pull Backed", materialData.CTINumber);
                                isApprovedtask = true;
                                isInReviewTask = true;
                                isRequestorinCCEmail = true;
                                break;

                            case EmailNotificationAction.Completed:
                                templateFile = "TechnicalInstruction_Completed.html";
                                emailSubject = string.Format("[Action required!]  TIS_{0} has been Approved and Submitted for close request", materialData.CTINumber);
                                isRequestorinToEmail = true;
                                cpcDeptPeople = true;
                                allPersonInCc = true;
                                break;

                            case EmailNotificationAction.Closed:
                                templateFile = "TechnicalInstruction_Closed.html";
                                emailSubject = string.Format("[Action Taken] TIS_{0} has been Closed", materialData.CTINumber);
                                isDepartMentHead = true;
                                isRequestorinToEmail = true;
                                allPersonInCc = true;
                                break;

                            default:
                                break;
                        }

                        if (isRequestorinToEmail)
                        {
                            emailToAddressList.Add(requesterUserEmail);
                            emailCCAddressList.Remove(requesterUserEmail);
                        }

                        if (isRequestorinCCEmail)
                        {
                            emailCCAddressList.Add(requesterUserEmail);
                        }

                        if (isInReviewTask)
                        {
                            if (nextApproverTaskId > 0)
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.InReview.ToString() && item.ApproverTaskId == nextApproverTaskId)
                                    {
                                        emailToAddressList.Add(item.email);
                                    }
                                }
                            }
                            else
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.InReview.ToString())
                                    {
                                        emailToAddressList.Add(item.email);
                                    }
                                }
                            }
                        }

                        if (isApprovedtask)
                        {
                            if (nextApproverTaskId > 0)
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.Approved.ToString() && item.ApproverTaskId == nextApproverTaskId)
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                            }
                            else
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.Approved.ToString())
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                            }
                        }

                        if (isIsAmendTask)
                        {
                            if (nextApproverTaskId > 0)
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.UnderAmendment.ToString() && item.ApproverTaskId == nextApproverTaskId)
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                            }
                        }

                        if (allPersonInCc)
                        {
                            foreach (var item in approverData)
                            {

                                if (item.Status == ApprovalTaskStatus.Approved.ToString())
                                {
                                    emailCCAddressList.Add(item.email);
                                }
                            }
                        }

                        if (!string.IsNullOrEmpty(templateFile))
                        {
                            string baseDirectory = AppContext.BaseDirectory;
                            string docLink = documentLink + "form/view/" + requestId;
                            templateFilePath = Path.Combine(baseDirectory, templateDirectory, templateFile);
                            if (!string.IsNullOrEmpty(templateFilePath))
                            {
                                emailBody.Append(System.IO.File.ReadAllText(templateFilePath));
                            }
                            if (emailBody?.Length > 0)
                            {
                                if (userEditLinkFromEmail == true && approvelink == true)
                                {
                                    docLink = documentLink + "form/edit/" + requestId;
                                }
                                else if (approvelink)
                                {

                                    docLink = documentLink.Replace("#", "?action=approval#") + "form/view/" + requestId;
                                }
                                else
                                {
                                    docLink = documentLink + "form/view/" + requestId;
                                }

                                emailBody = emailBody.Replace("#TechnicalLink#", docLink);
                                emailBody = emailBody.Replace("#CTINumber#", materialNum);
                                emailBody = emailBody.Replace("#Title#", Title);
                                emailBody = emailBody.Replace("#Requestor#", requesterUserName);
                                emailBody = emailBody.Replace("#Comment#", comment);
                                emailBody = emailBody.Replace("#AdminEmailID#", AdminEmailNotification);
                                emailSent = SendEmailNotification(emailToAddressList.Distinct().ToList(), emailCCAddressList.Distinct().ToList(), emailBody, emailSubject);
                                var requestData = new EmailLogMaster()
                                {
                                    FormId = requestId,
                                    EmailBody = emailBody.ToString(),
                                    EmailCC = string.Join(",", emailCCAddressList.Distinct().ToList()),
                                    EmailTo = string.Join(",", emailToAddressList.Distinct().ToList()),
                                    EmailSubject = emailSubject.ToString(),
                                    EmailSentTime = DateTime.Now,
                                    isDelete = false,
                                    IsEmailSent = emailSent,
                                };
                                _context.EmailLogMasters.Add(requestData);
                                await _context.SaveChangesAsync();
                            }
                        }

                    }
                }

            }
            catch (Exception ex)
            {
                var commonHelper = new CommonHelper(_context, _cloneContext);
                commonHelper.LogException(ex, "SendTechnicalInstructionEmail");
                return false;
            }
            emailSent = true;
            return emailSent;
        }

        public async Task<bool> SendAdjustmentEmail(int requestId, EmailNotificationAction emailNotification, string comment = null, int nextApproverTaskId = 0)
        {
            bool emailSent = false;
            try
            {
                StringBuilder emailBody = new StringBuilder();

                string? templateDirectory = _configuration["TemplateSettings:Normal_Mail"];

                //TroubleReports troubleReports = new TroubleReports();
                List<string?> emailToAddressList = new List<string?>();
                List<string?> emailCCAddressList = new List<string?>();
                string? emailSubject = null;
                string? templateFile = null, templateFilePath = null;
                bool isApprovedtask = false;
                bool isInReviewTask = false;
                bool isRequestorinToEmail = false;
                bool isRequestorinCCEmail = false;
                bool isDepartMentHead = false;
                bool isIsAmendTask = false, isPullBacked = false;
                string? requesterUserName = null, requesterUserEmail = null;
                string? advisorName = null, advisorEmail = null;
                string? departmentHeadName = null, departmentHeadEmail = null;
                bool approvelink = false;
                bool isEditable = false, allApprover = false;
                bool cpcDeptPeople = false, isAdvisor = false;
                int reqDeptId = 0;
                string? Role = null;
                string? AdminEmailNotification = _configuration["AdminEmailNotification"];
                string? documentLink = _configuration["SPSiteUrl"] +
                      _configuration["AdjustmentURL"];



                if (requestId > 0)
                {
                    var adjustmentData = _context.AdjustmentReports.Where(x => x.AdjustMentReportId == requestId && x.IsDeleted == false).FirstOrDefault();
                    var adjustmentNo = _context.AdjustmentReports.Where(x => x.AdjustMentReportId == requestId && x.IsDeleted == false).Select(x => x.ReportNo).FirstOrDefault();
                    var sectionName = _context.SectionMasters.Where(x => x.SectionId == adjustmentData.SectionId && x.IsActive == true).Select(x => x.SectionName).FirstOrDefault();

                    var advisorComments = _context.AdjustmentAdvisorMasters.Where(x => x.AdjustmentReportId == requestId && x.IsActive == true).Select(x => x.Comment).FirstOrDefault();

                    var areaIds = adjustmentData.Area.Split(',').Select(id => int.Parse(id)).ToList();
                    var areaNames = new List<string>();
                    foreach (var id in areaIds)
                    {
                        // Query database or use a dictionary/cache to get the name
                        var areaName = _context.Areas.Where(x => x.AreaId == id && x.IsActive == true).Select(x => x.AreaName).FirstOrDefault(); // Replace this with your actual DB logic
                        if (!string.IsNullOrEmpty(areaName))
                        {
                            areaNames.Add(areaName);
                        }
                    }

                    var areaNamesString = string.Join(", ", areaNames);

                    if (adjustmentData != null)
                    {
                        if (adjustmentData.CreatedBy > 0)
                        {
                            EmployeeMaster? requestorUserDetails = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == adjustmentData.CreatedBy && x.IsActive == true).FirstOrDefault();
                            requesterUserName = requestorUserDetails?.EmployeeName;
                            requesterUserEmail = requestorUserDetails?.Email;
                            reqDeptId = requestorUserDetails.DepartmentID;
                        }

                        var advisorId = _context.AdjustmentAdvisorMasters.Where(x => x.AdjustmentReportId == adjustmentData.AdjustMentReportId && x.IsActive == true).Select(x => x.EmployeeId).FirstOrDefault();
                        if (advisorId > 0)
                        {
                            EmployeeMaster? advisorDetails = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == advisorId && x.IsActive == true).FirstOrDefault();
                            advisorEmail = advisorDetails?.Email;

                        }

                        var approverData = await _context.GeAdjustmentReportWorkFlow(requestId);


                        switch (emailNotification)
                        {
                            case EmailNotificationAction.AdvisorData:
                                templateFile = "Adjustment_Advisor.html";
                                emailSubject = string.Format("[Action required!] Adjustment_{0} Advisor Update the comments", adjustmentData.ReportNo);
                                isRequestorinToEmail = true;
                                break;

                            case EmailNotificationAction.Submitted:
                                templateFile = "Adjustment_Submitted.html";
                                emailSubject = string.Format("[Action required!] Adjustment_{0} has been Submitted for Approval", adjustmentData.ReportNo);
                                isInReviewTask = true;
                                approvelink = true;
                                isAdvisor = true;
                                break;

                            case EmailNotificationAction.ReSubmitted:
                                templateFile = "Adjustment_Resubmitted.html";
                                emailSubject = string.Format("[Action required!] Adjustment_{0} has been Resubmitted", adjustmentData.ReportNo);
                                isInReviewTask = true;
                                approvelink = true;
                                isRequestorinCCEmail = true;
                                break;

                            case EmailNotificationAction.Approved:
                                templateFile = "Adjustment_Approved.html";
                                emailSubject = string.Format("[Action required!] Adjustment_{0} has been Approved", adjustmentData.ReportNo);
                                isInReviewTask = true;
                                approvelink = true;
                                isRequestorinCCEmail = true;
                                break;

                            case EmailNotificationAction.AutoApproved:
                                templateFile = "Equipment_AutoApprove.html";
                                emailSubject = string.Format("[Action taken!] Adjustment_{0} has been Auto Approved", adjustmentData.ReportNo);
                                approvelink = true;
                                isRequestorinCCEmail = true;
                                break;


                            case EmailNotificationAction.Amended:
                                templateFile = "Adjustment_Amend.html";
                                emailSubject = string.Format("[Action taken!] Adjustment_{0} has been Asked for Amendment", adjustmentData.ReportNo);
                                isRequestorinToEmail = true;
                                isIsAmendTask = true;
                                isEditable = true;
                                break;

                            case EmailNotificationAction.PullBack:
                                templateFile = "Adjustment_PullBack.html";
                                emailSubject = string.Format("[Action taken!] Adjustment_{0} has been Pull Backed", adjustmentData.ReportNo);
                                isRequestorinCCEmail = true;
                                isPullBacked = true;
                                break;

                            case EmailNotificationAction.Completed:
                                templateFile = "Adjustment_Completed.html";
                                emailSubject = string.Format("[Action taken!] Adjustment_{0} has been Approved and completed", adjustmentData.ReportNo);
                                isRequestorinToEmail = true;
                                allApprover = true;
                                isDepartMentHead = true;
                                break;

                            default:
                                break;
                        }

                        if (isPullBacked)
                        {
                            foreach (var item in approverData)
                            {
                                if (item.Status != ApprovalTaskStatus.Pending.ToString())
                                {
                                    emailToAddressList.Add(item.email);
                                }
                            }
                        }

                        if (isRequestorinCCEmail)
                        {
                            emailCCAddressList.Add(requesterUserEmail);
                        }
                        if (isRequestorinToEmail)
                        {
                            emailToAddressList.Add(requesterUserEmail);
                        }

                        if (isAdvisor)
                        {
                            emailToAddressList.Add(advisorEmail);
                        }

                        if (isIsAmendTask)
                        {
                            if (nextApproverTaskId > 0)
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.UnderAmendment.ToString() && item.ApproverTaskId == nextApproverTaskId)
                                    {
                                        emailCCAddressList.Add(item.email);
                                    }
                                }
                            }
                        }

                        if (allApprover)
                        {
                            foreach (var item in approverData)
                            {
                                emailCCAddressList.Add(item.email);
                            }
                        }

                        if (isDepartMentHead)
                        {

                            var userOtherDepId = _cloneContext.DepartmentMasters.Where(x => x.DepartmentID != reqDeptId && x.IsActive == true && x.DivisionID == 1 && (x.HRMSDeptName == "CP01-DP-1003" || x.HRMSDeptName == "CP01-DP-1004" || x.HRMSDeptName == "CP01-DP-1002")).Select(x => x.Head).ToList();
                            foreach (var dept in userOtherDepId)
                            {
                                var deptEmail = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == dept && x.IsActive == true).Select(x => x.Email).FirstOrDefault();

                                emailCCAddressList.Add(deptEmail);
                            }
                        }

                        if (isInReviewTask)
                        {
                            if (nextApproverTaskId > 0)
                            {
                                foreach (var item in approverData)
                                {
                                    var task = approverData.FirstOrDefault(item =>
                                                item.Status == ApprovalTaskStatus.InReview.ToString()
                                                && item.ApproverTaskId == nextApproverTaskId);

                                    var approved = approverData
                                                      .Where(item => item.Status == ApprovalTaskStatus.Approved.ToString())
                                                      .OrderByDescending(item => item.ApproverTaskId)
                                                      .FirstOrDefault();
                                    if (task != null)
                                    {
                                        if (task.SequenceNo == 1 || approved.SequenceNo == 2 || approved.SequenceNo == 7 || approved.SequenceNo == 8)
                                        {
                                            var userOtherDepId = _cloneContext.DepartmentMasters.Where(x => x.DepartmentID != reqDeptId && x.IsActive == true && x.DivisionID == 1 && (x.HRMSDeptName == "CP01-DP-1003" || x.HRMSDeptName == "CP01-DP-1004" || x.HRMSDeptName == "CP01-DP-1002")).Select(x => x.Head).ToList();
                                            foreach (var dept in userOtherDepId)
                                            {
                                                var deptEmail = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == dept && x.IsActive == true).Select(x => x.Email).FirstOrDefault();

                                                emailCCAddressList.Add(deptEmail);
                                            }
                                        }
                                    }
                                    if (item.Status == ApprovalTaskStatus.InReview.ToString() && item.ApproverTaskId == nextApproverTaskId)
                                    {
                                        emailToAddressList.Add(item.email);
                                    }
                                }
                            }
                            else
                            {
                                foreach (var item in approverData)
                                {
                                    if (item.Status == ApprovalTaskStatus.InReview.ToString())
                                    {
                                        emailToAddressList.Add(item.email);
                                    }

                                    var userOtherDepId = _cloneContext.DepartmentMasters.Where(x => x.DepartmentID != reqDeptId && x.IsActive == true && x.DivisionID == 1 && (x.HRMSDeptName == "CP01-DP-1003" || x.HRMSDeptName == "CP01-DP-1004" || x.HRMSDeptName == "CP01-DP-1002")).Select(x => x.Head).ToList();
                                    foreach (var dept in userOtherDepId)
                                    {
                                        var deptEmail = _cloneContext.EmployeeMasters.Where(x => x.EmployeeID == dept && x.IsActive == true).Select(x => x.Email).FirstOrDefault();

                                        emailCCAddressList.Add(deptEmail);
                                    }
                                }
                            }
                        }

                        if (nextApproverTaskId > 0)
                        {
                            var approvalData = _context.AdjustmentReportApproverTaskMasters.Where(x => x.AdjustmentReportId == requestId && (x.Status != ApprovalTaskStatus.InReview.ToString() && x.Status != ApprovalTaskStatus.Pending.ToString()) && x.IsActive == true)
                                .OrderByDescending(x => x.ApproverTaskId)
                                .FirstOrDefault();
                            Role = approvalData?.Role;
                        }

                        if (!string.IsNullOrEmpty(templateFile))
                        {
                            string baseDirectory = AppContext.BaseDirectory;
                            string docLink = documentLink + "view/" + requestId;
                            templateFilePath = Path.Combine(baseDirectory, templateDirectory, templateFile);
                            if (!string.IsNullOrEmpty(templateFilePath))
                            {
                                emailBody.Append(System.IO.File.ReadAllText(templateFilePath));
                            }
                            if (emailBody?.Length > 0)
                            {
                                if (approvelink)
                                {
                                    docLink = documentLink.Replace("#", "?action=approval#") + "edit/" + requestId;
                                }
                                else
                                {
                                    if (isEditable)
                                    {
                                        docLink = documentLink + "edit/" + requestId;
                                    }
                                    else
                                    {
                                        docLink = documentLink + "view/" + requestId;
                                    }

                                }

                                emailBody = emailBody.Replace("#Requestor#", requesterUserName);
                                emailBody = emailBody.Replace("#AdjustmentLink#", docLink);
                                emailBody = emailBody.Replace("#ApplicationNo#", adjustmentNo);
                                //emailBody = emailBody.Replace("#Improvement#", equipmentData.ImprovementName);
                                emailBody = emailBody.Replace("#Area#", areaNamesString);
                                emailBody = emailBody.Replace("#Section#", sectionName);
                                emailBody = emailBody.Replace("#Comment#", comment);
                                emailBody = emailBody.Replace("#AdvComment#", advisorComments);
                                emailBody = emailBody.Replace("#Role#", Role);
                                emailBody = emailBody.Replace("#AdminEmailID#", AdminEmailNotification);
                                emailSent = SendEmailNotification(emailToAddressList.Distinct().ToList(), emailCCAddressList.Distinct().ToList(), emailBody, emailSubject);
                                var requestData = new EmailLogMaster()
                                {
                                    FormId = requestId,
                                    EmailBody = emailBody.ToString(),
                                    EmailCC = string.Join(",", emailCCAddressList.Distinct().ToList()),
                                    EmailTo = string.Join(",", emailToAddressList.Distinct().ToList()),
                                    EmailSubject = emailSubject.ToString(),
                                    EmailSentTime = DateTime.Now,
                                    isDelete = false,
                                    IsEmailSent = emailSent,
                                };
                                _context.EmailLogMasters.Add(requestData);
                                await _context.SaveChangesAsync();
                            }
                        }
                    }
                }



            }
            catch (Exception ex)
            {
                var commonHelper = new CommonHelper(_context, _cloneContext);
                commonHelper.LogException(ex, "Send Adjustment");
                return false;
            }
            emailSent = true;
            return emailSent;
        }


        public async Task<bool> SendTechanicalInstructionEmailToCellDevision(int requestId, List<string?> emailToAddressList, List<string?> emailCCAddressList, string emailBody)
        {
            return false;
        }

    }
}