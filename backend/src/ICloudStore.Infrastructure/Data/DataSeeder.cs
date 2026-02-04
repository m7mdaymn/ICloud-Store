using ICloudStore.Domain.Entities;
using ICloudStore.Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace ICloudStore.Infrastructure.Data;

public static class DataSeeder
{
    public static async Task SeedAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<ApplicationRole>>();

        // Apply pending migrations
        await context.Database.MigrateAsync();

        // Seed Roles
        await SeedRolesAsync(roleManager);

        // Seed Users
        await SeedUsersAsync(userManager);

        // Seed Categories
        await SeedCategoriesAsync(context);

        // Seed Brands
        await SeedBrandsAsync(context);

        // Seed Store Settings
        await SeedStoreSettingsAsync(context);

        // Seed Theme Settings
        await SeedThemeSettingsAsync(context);
    }

    private static async Task SeedRolesAsync(RoleManager<ApplicationRole> roleManager)
    {
        var roles = new[] { "Admin", "Staff", "Customer" };
        
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new ApplicationRole 
                { 
                    Name = role,
                    Description = role switch
                    {
                        "Admin" => "مدير النظام - صلاحيات كاملة",
                        "Staff" => "موظف - صلاحيات المنتجات والمخزون",
                        "Customer" => "عميل - صلاحيات المشاهدة والمفضلة",
                        _ => role
                    }
                });
            }
        }
    }

    private static async Task SeedUsersAsync(UserManager<ApplicationUser> userManager)
    {
        // Admin User
        if (await userManager.FindByEmailAsync("admin@icloudstore.eg") == null)
        {
            var admin = new ApplicationUser
            {
                UserName = "admin@icloudstore.eg",
                Email = "admin@icloudstore.eg",
                FullName = "مدير النظام",
                PhoneNumber = "01000000001",
                EmailConfirmed = true,
                IsActive = true
            };
            var result = await userManager.CreateAsync(admin, "Admin@123");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(admin, "Admin");
            }
        }

        // Staff User
        if (await userManager.FindByEmailAsync("staff@icloudstore.eg") == null)
        {
            var staff = new ApplicationUser
            {
                UserName = "staff@icloudstore.eg",
                Email = "staff@icloudstore.eg",
                FullName = "موظف المبيعات",
                PhoneNumber = "01000000002",
                EmailConfirmed = true,
                IsActive = true
            };
            var result = await userManager.CreateAsync(staff, "Staff@123");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(staff, "Staff");
            }
        }

        // Customer User
        if (await userManager.FindByEmailAsync("customer@example.com") == null)
        {
            var customer = new ApplicationUser
            {
                UserName = "customer@example.com",
                Email = "customer@example.com",
                FullName = "عميل تجريبي",
                PhoneNumber = "01000000003",
                EmailConfirmed = true,
                IsActive = true
            };
            var result = await userManager.CreateAsync(customer, "Customer@123");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(customer, "Customer");
            }
        }
    }

    private static async Task SeedCategoriesAsync(ApplicationDbContext context)
    {
        if (await context.Categories.IgnoreQueryFilters().AnyAsync())
            return;

        var categories = new List<Category>
        {
            // Main Device Categories
            new Category { NameAr = "آيفون", NameEn = "iPhone", SlugAr = "iphone", SlugEn = "iphone", SortOrder = 1, IsActive = true },
            new Category { NameAr = "آيباد / تابلت", NameEn = "iPad / Tablets", SlugAr = "ipad-tablets", SlugEn = "ipad-tablets", SortOrder = 2, IsActive = true },
            new Category { NameAr = "ماك", NameEn = "Mac", SlugAr = "mac", SlugEn = "mac", SortOrder = 3, IsActive = true },
            new Category { NameAr = "سامسونج", NameEn = "Samsung", SlugAr = "samsung", SlugEn = "samsung", SortOrder = 4, IsActive = true },
            new Category { NameAr = "إكسسوارات", NameEn = "Accessories", SlugAr = "accessories", SlugEn = "accessories", SortOrder = 5, IsActive = true }
        };

        context.Categories.AddRange(categories);
        await context.SaveChangesAsync();

        // Get Accessories category for subcategories
        var accessoriesCategory = await context.Categories.FirstOrDefaultAsync(c => c.SlugEn == "accessories");
        if (accessoriesCategory != null)
        {
            var subCategories = new List<Category>
            {
                new Category { NameAr = "شواحن", NameEn = "Chargers", SlugAr = "chargers", SlugEn = "chargers", ParentCategoryId = accessoriesCategory.Id, SortOrder = 1, IsActive = true },
                new Category { NameAr = "كابلات", NameEn = "Cables", SlugAr = "cables", SlugEn = "cables", ParentCategoryId = accessoriesCategory.Id, SortOrder = 2, IsActive = true },
                new Category { NameAr = "جرابات", NameEn = "Cases", SlugAr = "cases", SlugEn = "cases", ParentCategoryId = accessoriesCategory.Id, SortOrder = 3, IsActive = true },
                new Category { NameAr = "واقيات شاشة", NameEn = "Screen Protectors", SlugAr = "screen-protectors", SlugEn = "screen-protectors", ParentCategoryId = accessoriesCategory.Id, SortOrder = 4, IsActive = true },
                new Category { NameAr = "سماعات", NameEn = "Headphones", SlugAr = "headphones", SlugEn = "headphones", ParentCategoryId = accessoriesCategory.Id, SortOrder = 5, IsActive = true },
                new Category { NameAr = "باور بانك", NameEn = "Power Banks", SlugAr = "power-banks", SlugEn = "power-banks", ParentCategoryId = accessoriesCategory.Id, SortOrder = 6, IsActive = true },
                new Category { NameAr = "أخرى", NameEn = "Others", SlugAr = "others", SlugEn = "others", ParentCategoryId = accessoriesCategory.Id, SortOrder = 7, IsActive = true }
            };

            context.Categories.AddRange(subCategories);
            await context.SaveChangesAsync();
        }
    }

    private static async Task SeedBrandsAsync(ApplicationDbContext context)
    {
        if (await context.Brands.IgnoreQueryFilters().AnyAsync())
            return;

        var brands = new List<Brand>
        {
            new Brand { NameAr = "آبل", NameEn = "Apple", SlugAr = "apple", SlugEn = "apple", SortOrder = 1, IsActive = true },
            new Brand { NameAr = "سامسونج", NameEn = "Samsung", SlugAr = "samsung", SlugEn = "samsung", SortOrder = 2, IsActive = true },
            new Brand { NameAr = "أنكر", NameEn = "Anker", SlugAr = "anker", SlugEn = "anker", SortOrder = 3, IsActive = true },
            new Brand { NameAr = "باسيوس", NameEn = "Baseus", SlugAr = "baseus", SlugEn = "baseus", SortOrder = 4, IsActive = true },
            new Brand { NameAr = "جرين ليون", NameEn = "Green Lion", SlugAr = "green-lion", SlugEn = "green-lion", SortOrder = 5, IsActive = true }
        };

        context.Brands.AddRange(brands);
        await context.SaveChangesAsync();
    }

    private static async Task SeedStoreSettingsAsync(ApplicationDbContext context)
    {
        if (await context.StoreSettings.AnyAsync())
            return;

        var settings = new List<StoreSetting>
        {
            new StoreSetting { Key = "StoreName", ValueAr = "iCloud Store", ValueEn = "iCloud Store" },
            new StoreSetting { Key = "WhatsAppNumber", ValueAr = "201000000000", ValueEn = "201000000000" },
            new StoreSetting { Key = "PhoneNumber", ValueAr = "+20 100 000 0000", ValueEn = "+20 100 000 0000" },
            new StoreSetting { Key = "SupportEmail", ValueAr = "support@icloudstore.eg", ValueEn = "support@icloudstore.eg" },
            new StoreSetting { Key = "Address", ValueAr = "القاهرة، مصر", ValueEn = "Cairo, Egypt" },
            new StoreSetting { Key = "WorkingHours", ValueAr = "السبت - الخميس: 10 ص - 10 م", ValueEn = "Sat - Thu: 10 AM - 10 PM" }
        };

        context.StoreSettings.AddRange(settings);
        await context.SaveChangesAsync();
    }

    private static async Task SeedThemeSettingsAsync(ApplicationDbContext context)
    {
        if (await context.ThemeSettings.AnyAsync())
            return;

        var theme = new ThemeSetting
        {
            ActiveTheme = "Light",
            AccentColor = "#25D366" // WhatsApp Green
        };

        context.ThemeSettings.Add(theme);
        await context.SaveChangesAsync();
    }
}
