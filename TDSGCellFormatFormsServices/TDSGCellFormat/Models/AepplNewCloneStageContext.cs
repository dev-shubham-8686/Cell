using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using TDSG_VehicleRequisitionSubstitution.Models;

namespace TDSGCellFormat.Models;

public partial class AepplNewCloneStageContext : DbContext
{
    public AepplNewCloneStageContext(string empConnectionstring)
        : this(new DbContextOptionsBuilder<AepplNewCloneStageContext>()
               .UseSqlServer(empConnectionstring, options => options.CommandTimeout(600))
               .Options)
    {
    }

    public AepplNewCloneStageContext(DbContextOptions<AepplNewCloneStageContext> options)
        : base(options)
    {
    }
    public AepplNewCloneStageContext()
        :base()
    {

    }
    public virtual DbSet<SubstituteMaster> SubstituteMasters { get; set; }
    public virtual DbSet<EmployeeInfoMaster> EmployeeInfoMasters { get; set; }

    public virtual DbSet<EmployeeMaster> EmployeeMasters { get; set; }

    public virtual DbSet<EmployeeRelation> EmployeeRelations { get; set; }
    public virtual DbSet<AuthSession> AuthSessions { get; set; }
    public virtual DbSet<DepartmentMaster> DepartmentMasters { get; set; }
    public virtual DbSet<DivisionMaster> DivisionMasters { get; set; }
    public virtual DbSet<SectionHeadMaster> SectionHeadMasters { get; set; }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (!optionsBuilder.IsConfigured)
        {
            // Use a connection string from a configuration file or environment variable
            optionsBuilder.UseSqlServer("Data Source = 172.30.222.38;Initial Catalog=AEPPL_NEW_Clone_Stage;User Id=sa;Password=Made1981@;TrustServerCertificate=True;");
        }

        // Enable lazy loading proxies
        optionsBuilder.UseLazyLoadingProxies();
    }
    //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    //    => optionsBuilder.UseSqlServer("Server = 192.168.100.30;Database=AEPPL_NEW_Clone_Stage;User Id=sa;Password=Made1981@;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
       /* modelBuilder.UseCollation("SQL_Latin1_General_CP1_CI_AS");

        modelBuilder.Entity<EmployeeInfoMaster>(entity =>
        {
            entity.HasKey(e => e.EmployeeInfoId);

            entity.ToTable("EmployeeInfoMaster");

            entity.Property(e => e.Address1).HasMaxLength(500);
            entity.Property(e => e.Address2).HasMaxLength(500);
            entity.Property(e => e.Address3).HasMaxLength(500);
            entity.Property(e => e.BloodGroupId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.City)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Country)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.CreatedDate).HasColumnType("datetime");
            entity.Property(e => e.EmployeeCode)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Gender)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.MaritalStatus)
                .HasMaxLength(10)
                .IsUnicode(false);
            entity.Property(e => e.ModifiedDate).HasColumnType("datetime");
            entity.Property(e => e.Nationality)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.PanCardNumber)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.State)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.ZipCode)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<EmployeeMaster>(entity =>
        {
            entity.HasKey(e => e.EmployeeId);

            entity.ToTable("EmployeeMaster", tb => tb.HasTrigger("trg_InsertOrUpdateDesignationMaster"));

            entity.Property(e => e.EmployeeId).HasColumnName("EmployeeID");
            entity.Property(e => e.CmroleId).HasColumnName("CMRoleId");
            entity.Property(e => e.CostCenter)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.DepartmentId).HasColumnName("DepartmentID");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.EmpBirthDate).HasColumnType("datetime");
            entity.Property(e => e.EmpContact)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.EmpCreatedDate).HasColumnType("datetime");
            entity.Property(e => e.EmpDesignation)
                .HasMaxLength(250)
                .IsUnicode(false);
            entity.Property(e => e.EmpModifiedDate).HasColumnType("datetime");
            entity.Property(e => e.EmpSecondaryEmail)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeCode)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeName)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeType)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.JoiningDate).HasColumnType("datetime");
            entity.Property(e => e.MarriageDate).HasColumnType("datetime");
            entity.Property(e => e.PlantId)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("PlantID");
            entity.Property(e => e.ReportingManagerId).HasColumnName("ReportingManagerID");
            entity.Property(e => e.Spid).HasColumnName("SPID");
            entity.Property(e => e.TerminationDate).HasColumnType("datetime");

            entity.HasOne(d => d.Department).WithMany(p => p.EmployeeMasters)
                .HasForeignKey(d => d.DepartmentId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EmployeeMaster_DepartmentMaster");

            entity.HasOne(d => d.Role).WithMany(p => p.EmployeeMasters)
                .HasForeignKey(d => d.RoleId)
                .HasConstraintName("FK_EmployeeMaster_RoleMaster");
        });

        modelBuilder.Entity<EmployeeRelation>(entity =>
        {
            entity.HasKey(e => e.EmpRelationId);

            entity.ToTable("EmployeeRelation");

            entity.Property(e => e.EmployeeCode)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.EmployeeDob)
                .HasColumnType("datetime")
                .HasColumnName("EmployeeDOB");
            entity.Property(e => e.LastModifiedBy).HasColumnType("datetime");
            entity.Property(e => e.LastModifiedBySystem).HasColumnType("datetime");
            entity.Property(e => e.Name)
                .HasMaxLength(500)
                .IsUnicode(false);
            entity.Property(e => e.RelatedPersonIdExternal)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.RelationshipType)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<UniqueDesignation>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("UniqueDesignation");

            entity.Property(e => e.EmpDesignation)
                .HasMaxLength(250)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Uommaster>(entity =>
        {
            entity.HasKey(e => e.Uomid);

            entity.ToTable("UOMMaster");

            entity.Property(e => e.Uomid).HasColumnName("UOMID");
            entity.Property(e => e.Description)
                .HasMaxLength(30)
                .IsUnicode(false);
            entity.Property(e => e.Spid).HasColumnName("SPID");
            entity.Property(e => e.UoMcode)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasColumnName("UoMCode");
        });*/

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
