using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TDSGCellFormat.Models;
using Microsoft.EntityFrameworkCore;
using TDSG.TroubleReport.Scheduler;
using Microsoft.Extensions.Configuration;

public class Program
{
    public static void Main(string[] args)
    {
        var host = CreateHostBuilder(args).Build();

        // Access the configuration
        var config = host.Services.GetRequiredService<IConfiguration>();
        
        // Get the connection string from appsettings.json
        string connectionString = config.GetConnectionString("DefaultConnection");

        //Console.WriteLine($"Connecting to database with connection string: {connectionString}");

        string? templateFile = null;
        string? emailSubject = null;
        
        using (var scope = host.Services.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<TdsgCellFormatDivisionContext>();
            var context = scope.ServiceProvider.GetRequiredService<AepplNewCloneStageContext>();
            var icaReport = dbContext.TroubleReports
                                   .Where(tr => tr.ImmediateCorrectiveAction == null &&
                                                EF.Functions.DateDiffHour(tr.When, DateTime.Now) >= 48 && tr.IsDeleted == false)
                                   .ToList();
            var reminderEmails = new ReminderEmails(dbContext, context);

            foreach (var report in icaReport)
            {
                DateTime now = DateTime.Now;
                DateTime lastEmailSent = (DateTime)(report?.LastEmailSent ?? report?.When); // Use the report creation time if no email was sent
                TimeSpan hoursSinceLastEmail = now - lastEmailSent;
                //int hoursSinceLastEmail = (int)hours.TotalHours;
                //double hoursSinceLastEmail = difference.TotalHours;
                //var emailFlag = report.RaiserEmailSent;
                var raiser = dbContext.TroubleReports.Where(x => x.TroubleReportId == report.TroubleReportId).Select(x => x.CreatedBy).FirstOrDefault();
                var sectionHead = context.EmployeeMasters.Where(x => x.EmployeeID == raiser && x.IsActive == true).Select(x => x.ReportingManagerId).ToList();

                var departMentHead = (from em in context.EmployeeMasters
                                      join dm in context.DepartmentMasters on em.DepartmentID equals dm.DepartmentID
                                      where em.EmployeeID == raiser && em.IsActive == true
                                      select dm.Head).ToList();

                var divisionHead = (from e in context.EmployeeMasters
                                    join dm in context.DepartmentMasters on e.DepartmentID equals dm.DepartmentID
                                    join div in context.DivisionMasters on dm.DivisionID equals div.DivisionID
                                    where e.EmployeeID == raiser && e.IsActive == true
                                    select new
                                    {
                                        Head = div.Head,
                                        DeputyDivisionHead = div.DeputyDivisionHead
                                    }).ToList();

               // var twentyFourHours = TimeSpan.FromHours(24);
                templateFile = "TroubleReport_ICA.html";
                emailSubject = $"ICA Reminder for Trouble Report Number: {report.TroubleReportNo}";
                if (report.RaiserEmailSent < 3 && hoursSinceLastEmail.TotalHours >= 24)
                {
                    //send an email to workdone people for 3 days
                    var workDonePeople = dbContext.WorkDoneDetails.Where(x => x.TroubleReportId == report.TroubleReportId && x.IsDeleted == false).Select(x => x.EmployeeId).ToList();

                    reminderEmails.SendEmailReminder(report.TroubleReportId, templateFile, emailSubject,workDonePeople);
                    report.RaiserEmailSent += 1;
                    report.LastEmailSent = now;
                }
                else if (report.RaiserEmailSent == 3 && report.ManagerEmailSent < 3 && hoursSinceLastEmail.TotalHours >= 24)
                {
                    //send an email to manager
                    //var raiser = dbContext.TroubleReports.Where(x => x.TroubleReportId == report.TroubleReportId).Select(x => x.CreatedBy).FirstOrDefault();
                    reminderEmails.SendEmailReminder(report.TroubleReportId, templateFile, emailSubject,sectionHead);
                    report.ManagerEmailSent += 1;
                    report.LastEmailSent = now;
                }
                else if (report.ManagerEmailSent == 3 && report.DepartMentHeadEmailSent <3 && hoursSinceLastEmail.TotalHours >= 24)
                {
                    //email to department head


                    reminderEmails.SendEmailReminder(report.TroubleReportId, templateFile, emailSubject, departMentHead);
                    report.DepartMentHeadEmailSent += 1;
                    report.LastEmailSent = now;
                }
                else if(report.DepartMentHeadEmailSent == 3 && report.DivisionHeadEmailSent < 3 && hoursSinceLastEmail.TotalHours >= 24)
                {

                    var combinedList = divisionHead.SelectMany(d => new List<int?> { d.Head, d.DeputyDivisionHead })
                                     .Where(id => id.HasValue) // Optional: filter out nulls if needed
                                     .ToList();
                    //send an email to division Head
                    reminderEmails.SendEmailReminder(report.TroubleReportId, templateFile, emailSubject,  combinedList); // If RaiserEmailSent is 3 or more, skip sending any more emails
                    report.DivisionHeadEmailSent += 1;
                    report.LastEmailSent = now;
                }

                dbContext.SaveChanges(); // Save the changes to the database
                Console.WriteLine($"Sending email for Report ID: {report.TroubleReportId}, Email Type: {report.RaiserEmailSent + 1}");
               // Console.WriteLine(_configuration);
             

            }


            //change the fields for the RCA count
            var rcaReport = dbContext.TroubleReports
                                   .Where(tr => tr.ImmediateCorrectiveAction == null &&
                                                EF.Functions.DateDiffDay(tr.When, DateTime.Now) >= 7 && tr.IsDeleted == false)
                                   .ToList();

            foreach (var rca in rcaReport)
            {
                DateTime now = DateTime.Now;
                DateTime rcaLastEmailSent = (DateTime)(rca?.LastRCAEmailSent ?? rca?.When); // Use the report creation time if no email was sent
                TimeSpan hoursSinceLastEmail = now - rcaLastEmailSent;
                //var emailFlag = report.RaiserEmailSent;
                var raiser = dbContext.TroubleReports.Where(x => x.TroubleReportId == rca.TroubleReportId && x.IsDeleted == false).Select(x => x.CreatedBy).FirstOrDefault();
                var sectionHead = context.EmployeeMasters.Where(x => x.EmployeeID == raiser && x.IsActive == true).Select(x => x.ReportingManagerId).ToList();

                var departMentHead = (from em in context.EmployeeMasters
                                      join dm in context.DepartmentMasters on em.DepartmentID equals dm.DepartmentID
                                      where em.EmployeeID == raiser && em.IsActive == true
                                      select dm.Head).ToList();

                var divisionHead = (from e in context.EmployeeMasters
                                    join dm in context.DepartmentMasters on e.DepartmentID equals dm.DepartmentID
                                    join div in context.DivisionMasters on dm.DivisionID equals div.DivisionID
                                    where e.EmployeeID == raiser && e.IsActive == true
                                    select new
                                    {
                                        Head = div.Head,
                                        DeputyDivisionHead = div.DeputyDivisionHead
                                    }).ToList();
            
                //var emailFlag = report.RaiserEmailSent;
                templateFile = "TroubleReport_RCA.html";
                emailSubject = $"RCA Reminder for Trouble Report Number: {rca.TroubleReportNo}";
                if (rca.RaiseEmailRCA < 3 && hoursSinceLastEmail.TotalHours >= 24)
                {
                    //send an email to workdone people for 3 days
                    var workDonePeople = dbContext.WorkDoneDetails.Where(x => x.TroubleReportId == rca.TroubleReportId && x.IsDeleted == false).Select(x => x.EmployeeId).ToList();

                    reminderEmails.SendEmailReminder(rca.TroubleReportId, templateFile, emailSubject,  workDonePeople);
                    rca.RaiseEmailRCA += 1;
                    rca.LastRCAEmailSent = now;
                }
                else if (rca.RaiseEmailRCA == 3 && rca.ManagerEmailRCA < 3 && hoursSinceLastEmail.TotalHours >= 24)
                {
                    //send an email to manager
                    //var raiser = dbContext.TroubleReports.Where(x => x.TroubleReportId == report.TroubleReportId).Select(x => x.CreatedBy).FirstOrDefault();
                    reminderEmails.SendEmailReminder(rca.TroubleReportId, templateFile, emailSubject, sectionHead);
                    rca.ManagerEmailRCA += 1;
                    rca.LastRCAEmailSent = now;
                }
                else if (rca.ManagerEmailRCA == 3 && rca.DepartMentHeadEmailRCA < 3 && hoursSinceLastEmail.TotalHours >= 24)
                {
                    //email to department head
                    reminderEmails.SendEmailReminder(rca.TroubleReportId, templateFile, emailSubject, departMentHead);
                    rca.DepartMentHeadEmailRCA += 1;
                    rca.LastRCAEmailSent = now;
                }
                else if (rca.DepartMentHeadEmailRCA == 3 && rca.DivisionHeadRCAEmail < 3 && hoursSinceLastEmail.TotalHours >= 24)
                {
                    //send an email to division Head
                    var combinedList = divisionHead.SelectMany(d => new List<int?> { d.Head, d.DeputyDivisionHead })
                                     .Where(id => id.HasValue) // Optional: filter out nulls if needed
                                     .ToList();
                    
                    reminderEmails.SendEmailReminder(rca.TroubleReportId, templateFile, emailSubject,  combinedList); // If RaiserEmailSent is 3 or more, skip sending any more emails
                }

                dbContext.SaveChanges(); // Save the changes to the database
                Console.WriteLine($"Sending email for Report ID: {rca.TroubleReportId}, Email Type: {rca.RaiserEmailSent + 1}");
            }


        }
    }

    static IHostBuilder CreateHostBuilder(string[] args) =>
       Host.CreateDefaultBuilder(args)
           .ConfigureAppConfiguration((hostingContext, config) =>
           {
               // Get the base directory and navigate to the project root
               string baseDirectory = AppContext.BaseDirectory;
               //string projectRoot = Path.GetFullPath(Path.Combine(baseDirectory, @"..\..\..\..\TDSGCellFormat"));

               // Path to appsettings.json in the project root
               string pathToSettings = Path.Combine(baseDirectory, "appsettings.json");

               // Output the settings path for debugging
              // Console.WriteLine($"Settings Path: {pathToSettings}");

               // Load the appsettings.json from the project root
               config.AddJsonFile(pathToSettings, optional: false, reloadOnChange: true)
                     .AddEnvironmentVariables();
           })
           .ConfigureServices((context, services) =>
           {
               // Retrieve the connection strings from appsettings.json
               var cellString = context.Configuration.GetConnectionString("DefaultConnection");
               var aepplConnectionString = context.Configuration.GetConnectionString("EmployeeConnection");

               // Register TdsgCellFormatDivisionContext
               services.AddDbContext<TdsgCellFormatDivisionContext>(options =>
                   options.UseSqlServer(cellString));

               // Register AepplNewCloneStageContext
               services.AddDbContext<AepplNewCloneStageContext>(options =>
                   options.UseSqlServer(aepplConnectionString));

               // Register the configuration in DI
               services.AddSingleton<IConfiguration>(context.Configuration);
               services.AddSingleton<IConfiguration>(context.Configuration);
           });
}