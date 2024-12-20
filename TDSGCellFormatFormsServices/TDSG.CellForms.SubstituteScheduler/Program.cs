using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using TDSGCellFormat.Models;
using TDSG.CellForms.SubstituteScheduler.Scheduler;

public class Program
{
    public static void Main(string[] args)
    {
        var host = CreateHostBuilder(args).Build();
        // Access the configuration
        var config = host.Services.GetRequiredService<IConfiguration>();
        var dbContext = host.Services.GetRequiredService<TdsgCellFormatDivisionContext>();
        var context = host.Services.GetRequiredService<AepplNewCloneStageContext>();

        AdjustmentReportScheduler adjustmentReport = new AdjustmentReportScheduler(config, dbContext,context);
        adjustmentReport.AdjustmentSubstituteCheck();

        EquipmentImprovementScheduler equipment = new EquipmentImprovementScheduler(config, dbContext, context);
        equipment.EquipmentSubstituteCheck();
        // Exit the application after processing
        Environment.Exit(0);
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