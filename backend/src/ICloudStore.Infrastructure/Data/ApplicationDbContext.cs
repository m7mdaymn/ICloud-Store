using ICloudStore.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace ICloudStore.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, int>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // Catalog
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Brand> Brands => Set<Brand>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<ProductCategory> ProductCategories => Set<ProductCategory>();

    // Inventory
    public DbSet<Unit> Units => Set<Unit>();
    public DbSet<UnitMedia> UnitMedia => Set<UnitMedia>();
    public DbSet<ProductStock> ProductStocks => Set<ProductStock>();
    public DbSet<ProductMedia> ProductMedia => Set<ProductMedia>();
    public DbSet<ProductAttribute> ProductAttributes => Set<ProductAttribute>();

    // Payments
    public DbSet<UnitPaymentInfo> UnitPaymentInfos => Set<UnitPaymentInfo>();
    public DbSet<UnitInstallmentPlan> UnitInstallmentPlans => Set<UnitInstallmentPlan>();
    public DbSet<ProductPaymentInfo> ProductPaymentInfos => Set<ProductPaymentInfo>();
    public DbSet<ProductInstallmentPlan> ProductInstallmentPlans => Set<ProductInstallmentPlan>();

    // Customer Features
    public DbSet<Wishlist> Wishlists => Set<Wishlist>();
    public DbSet<RecentlyViewed> RecentlyViewedItems => Set<RecentlyViewed>();

    // CMS
    public DbSet<HomeSection> HomeSections => Set<HomeSection>();
    public DbSet<HomeSectionItem> HomeSectionItems => Set<HomeSectionItem>();

    // Settings
    public DbSet<ThemeSetting> ThemeSettings => Set<ThemeSetting>();
    public DbSet<StoreSetting> StoreSettings => Set<StoreSetting>();
    public DbSet<SocialLink> SocialLinks => Set<SocialLink>();

    // Operations
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<LeadLog> LeadLogs => Set<LeadLog>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Identity table names
        builder.Entity<ApplicationUser>().ToTable("Users");
        builder.Entity<ApplicationRole>().ToTable("Roles");
        builder.Entity<IdentityUserRole<int>>().ToTable("UserRoles");
        builder.Entity<IdentityUserClaim<int>>().ToTable("UserClaims");
        builder.Entity<IdentityUserLogin<int>>().ToTable("UserLogins");
        builder.Entity<IdentityRoleClaim<int>>().ToTable("RoleClaims");
        builder.Entity<IdentityUserToken<int>>().ToTable("UserTokens");

        // Category hierarchy
        builder.Entity<Category>()
            .HasOne(c => c.ParentCategory)
            .WithMany(c => c.SubCategories)
            .HasForeignKey(c => c.ParentCategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Category>()
            .HasIndex(c => c.SlugAr).IsUnique();
        builder.Entity<Category>()
            .HasIndex(c => c.SlugEn).IsUnique();

        // Brand
        builder.Entity<Brand>()
            .HasIndex(b => b.SlugAr).IsUnique();
        builder.Entity<Brand>()
            .HasIndex(b => b.SlugEn).IsUnique();

        // Product
        builder.Entity<Product>()
            .HasIndex(p => p.SlugAr).IsUnique();
        builder.Entity<Product>()
            .HasIndex(p => p.SlugEn).IsUnique();

        builder.Entity<Product>()
            .HasOne(p => p.Brand)
            .WithMany(b => b.Products)
            .HasForeignKey(p => p.BrandId)
            .OnDelete(DeleteBehavior.SetNull);

        // Product Categories (many-to-many)
        builder.Entity<ProductCategory>()
            .HasKey(pc => new { pc.ProductId, pc.CategoryId });

        builder.Entity<ProductCategory>()
            .HasOne(pc => pc.Product)
            .WithMany(p => p.ProductCategories)
            .HasForeignKey(pc => pc.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<ProductCategory>()
            .HasOne(pc => pc.Category)
            .WithMany(c => c.ProductCategories)
            .HasForeignKey(pc => pc.CategoryId)
            .OnDelete(DeleteBehavior.Cascade);

        // Product Stock (one-to-one)
        builder.Entity<ProductStock>()
            .HasOne(ps => ps.Product)
            .WithOne(p => p.ProductStock)
            .HasForeignKey<ProductStock>(ps => ps.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<ProductStock>()
            .Property(ps => ps.PriceEGP)
            .HasPrecision(18, 2);

        // Product Media
        builder.Entity<ProductMedia>()
            .HasOne(pm => pm.Product)
            .WithMany(p => p.ProductMedia)
            .HasForeignKey(pm => pm.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Product Attributes
        builder.Entity<ProductAttribute>()
            .HasOne(pa => pa.Product)
            .WithMany(p => p.ProductAttributes)
            .HasForeignKey(pa => pa.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Product Payment Info (one-to-one)
        builder.Entity<ProductPaymentInfo>()
            .HasOne(pp => pp.Product)
            .WithOne(p => p.PaymentInfo)
            .HasForeignKey<ProductPaymentInfo>(pp => pp.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        // Product Installment Plans
        builder.Entity<ProductInstallmentPlan>()
            .HasOne(pip => pip.Product)
            .WithMany(p => p.InstallmentPlans)
            .HasForeignKey(pip => pip.ProductId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<ProductInstallmentPlan>()
            .Property(pip => pip.MonthlyAmount)
            .HasPrecision(18, 2);
        builder.Entity<ProductInstallmentPlan>()
            .Property(pip => pip.DownPaymentAmount)
            .HasPrecision(18, 2);
        builder.Entity<ProductInstallmentPlan>()
            .Property(pip => pip.DownPaymentPercent)
            .HasPrecision(5, 2);

        // Unit
        builder.Entity<Unit>()
            .HasOne(u => u.Product)
            .WithMany(p => p.Units)
            .HasForeignKey(u => u.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Unit>()
            .Property(u => u.PriceEGP)
            .HasPrecision(18, 2);

        // Unit Media
        builder.Entity<UnitMedia>()
            .HasOne(um => um.Unit)
            .WithMany(u => u.Media)
            .HasForeignKey(um => um.UnitId)
            .OnDelete(DeleteBehavior.Cascade);

        // Unit Payment Info (one-to-one)
        builder.Entity<UnitPaymentInfo>()
            .HasOne(up => up.Unit)
            .WithOne(u => u.PaymentInfo)
            .HasForeignKey<UnitPaymentInfo>(up => up.UnitId)
            .OnDelete(DeleteBehavior.Cascade);

        // Unit Installment Plans
        builder.Entity<UnitInstallmentPlan>()
            .HasOne(uip => uip.Unit)
            .WithMany(u => u.InstallmentPlans)
            .HasForeignKey(uip => uip.UnitId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<UnitInstallmentPlan>()
            .Property(uip => uip.MonthlyAmount)
            .HasPrecision(18, 2);
        builder.Entity<UnitInstallmentPlan>()
            .Property(uip => uip.DownPaymentAmount)
            .HasPrecision(18, 2);
        builder.Entity<UnitInstallmentPlan>()
            .Property(uip => uip.DownPaymentPercent)
            .HasPrecision(5, 2);

        // Wishlist
        builder.Entity<Wishlist>()
            .HasOne(w => w.User)
            .WithMany(u => u.Wishlists)
            .HasForeignKey(w => w.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<Wishlist>()
            .HasIndex(w => new { w.UserId, w.TargetType, w.TargetId })
            .IsUnique();

        // Recently Viewed
        builder.Entity<RecentlyViewed>()
            .HasOne(rv => rv.User)
            .WithMany(u => u.RecentlyViewedItems)
            .HasForeignKey(rv => rv.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Home Section
        builder.Entity<HomeSectionItem>()
            .HasOne(hsi => hsi.HomeSection)
            .WithMany(hs => hs.Items)
            .HasForeignKey(hsi => hsi.HomeSectionId)
            .OnDelete(DeleteBehavior.Cascade);

        // Refresh Token
        builder.Entity<RefreshToken>()
            .HasOne(rt => rt.User)
            .WithMany(u => u.RefreshTokens)
            .HasForeignKey(rt => rt.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Lead Log
        builder.Entity<LeadLog>()
            .HasOne(ll => ll.User)
            .WithMany()
            .HasForeignKey(ll => ll.UserId)
            .OnDelete(DeleteBehavior.SetNull);

        // Store Setting unique key
        builder.Entity<StoreSetting>()
            .HasIndex(ss => ss.Key)
            .IsUnique();

        // Global query filters for soft delete
        builder.Entity<Category>().HasQueryFilter(c => !c.IsDeleted);
        builder.Entity<Brand>().HasQueryFilter(b => !b.IsDeleted);
        builder.Entity<Product>().HasQueryFilter(p => !p.IsDeleted);
        builder.Entity<Unit>().HasQueryFilter(u => !u.IsDeleted);
        builder.Entity<ProductStock>().HasQueryFilter(ps => !ps.IsDeleted);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAt = DateTime.UtcNow;
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAt = DateTime.UtcNow;
                    break;
            }
        }
        return base.SaveChangesAsync(cancellationToken);
    }
}
