using ICloudStore.Application.Common;
using ICloudStore.Application.DTOs;
using ICloudStore.Application.Interfaces;
using ICloudStore.Domain.Entities;
using ICloudStore.Domain.Enums;
using ICloudStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace ICloudStore.Infrastructure.Services;

public class ProductService : IProductService
{
    private readonly ApplicationDbContext _context;

    public ProductService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<PagedResult<ProductListDto>>> GetProductsAsync(
        PaginationParams pagination,
        int? categoryId = null,
        int? brandId = null,
        InventoryMode? inventoryMode = null,
        bool includeInactive = false)
    {
        var query = _context.Products
            .Include(p => p.Brand)
            .Include(p => p.ProductCategories)
            .Include(p => p.ProductMedia)
            .Include(p => p.ProductStock)
            .Include(p => p.Units)
            .AsQueryable();

        if (!includeInactive)
            query = query.Where(p => p.IsActive);

        if (categoryId.HasValue)
            query = query.Where(p => p.ProductCategories.Any(pc => pc.CategoryId == categoryId));

        if (brandId.HasValue)
            query = query.Where(p => p.BrandId == brandId);

        if (inventoryMode.HasValue)
            query = query.Where(p => p.InventoryMode == inventoryMode);

        var totalCount = await query.CountAsync();

        var products = await query
            .OrderBy(p => p.SortOrder)
            .ThenByDescending(p => p.CreatedAt)
            .Skip((pagination.PageNumber - 1) * pagination.PageSize)
            .Take(pagination.PageSize)
            .ToListAsync();

        var result = new PagedResult<ProductListDto>
        {
            Items = products.Select(MapToListDto).ToList(),
            TotalCount = totalCount,
            PageNumber = pagination.PageNumber,
            PageSize = pagination.PageSize
        };

        return ApiResponse<PagedResult<ProductListDto>>.SuccessResult(result);
    }

    public async Task<ApiResponse<ProductDto>> GetProductByIdAsync(int id)
    {
        var product = await _context.Products
            .Include(p => p.Brand)
            .Include(p => p.ProductCategories).ThenInclude(pc => pc.Category)
            .Include(p => p.ProductMedia)
            .Include(p => p.ProductStock)
            .Include(p => p.ProductAttributes)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
            return ApiResponse<ProductDto>.FailResult("المنتج غير موجود");

        return ApiResponse<ProductDto>.SuccessResult(MapToDto(product));
    }

    public async Task<ApiResponse<ProductDto>> GetProductBySlugAsync(string slug, string language)
    {
        var product = language == "ar"
            ? await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.ProductCategories).ThenInclude(pc => pc.Category)
                .Include(p => p.ProductMedia)
                .Include(p => p.ProductStock)
                .Include(p => p.ProductAttributes)
                .FirstOrDefaultAsync(p => p.SlugAr == slug)
            : await _context.Products
                .Include(p => p.Brand)
                .Include(p => p.ProductCategories).ThenInclude(pc => pc.Category)
                .Include(p => p.ProductMedia)
                .Include(p => p.ProductStock)
                .Include(p => p.ProductAttributes)
                .FirstOrDefaultAsync(p => p.SlugEn == slug);

        if (product == null)
            return ApiResponse<ProductDto>.FailResult("المنتج غير موجود");

        return ApiResponse<ProductDto>.SuccessResult(MapToDto(product));
    }

    public async Task<ApiResponse<ProductDto>> CreateProductAsync(CreateProductDto dto)
    {
        var product = new Product
        {
            NameAr = dto.NameAr,
            NameEn = dto.NameEn,
            SlugAr = GenerateSlug(dto.NameAr),
            SlugEn = GenerateSlug(dto.NameEn),
            DescriptionAr = dto.DescriptionAr,
            DescriptionEn = dto.DescriptionEn,
            ShortDescriptionAr = dto.ShortDescriptionAr,
            ShortDescriptionEn = dto.ShortDescriptionEn,
            BrandId = dto.BrandId,
            InventoryMode = dto.InventoryMode,
            IsActive = dto.IsActive,
            SortOrder = dto.SortOrder
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        // Add categories
        foreach (var catId in dto.CategoryIds)
        {
            _context.ProductCategories.Add(new ProductCategory
            {
                ProductId = product.Id,
                CategoryId = catId,
                IsPrimary = catId == dto.PrimaryCategoryId
            });
        }
        await _context.SaveChangesAsync();

        return await GetProductByIdAsync(product.Id);
    }

    public async Task<ApiResponse<ProductDto>> UpdateProductAsync(int id, UpdateProductDto dto)
    {
        var product = await _context.Products
            .Include(p => p.ProductCategories)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (product == null)
            return ApiResponse<ProductDto>.FailResult("المنتج غير موجود");

        product.NameAr = dto.NameAr;
        product.NameEn = dto.NameEn;
        product.SlugAr = GenerateSlug(dto.NameAr);
        product.SlugEn = GenerateSlug(dto.NameEn);
        product.DescriptionAr = dto.DescriptionAr;
        product.DescriptionEn = dto.DescriptionEn;
        product.ShortDescriptionAr = dto.ShortDescriptionAr;
        product.ShortDescriptionEn = dto.ShortDescriptionEn;
        product.BrandId = dto.BrandId;
        product.InventoryMode = dto.InventoryMode;
        product.IsActive = dto.IsActive;
        product.SortOrder = dto.SortOrder;

        // Update categories
        _context.ProductCategories.RemoveRange(product.ProductCategories);
        foreach (var catId in dto.CategoryIds)
        {
            _context.ProductCategories.Add(new ProductCategory
            {
                ProductId = product.Id,
                CategoryId = catId,
                IsPrimary = catId == dto.PrimaryCategoryId
            });
        }

        await _context.SaveChangesAsync();

        return await GetProductByIdAsync(id);
    }

    public async Task<ApiResponse<bool>> DeleteProductAsync(int id)
    {
        var product = await _context.Products.FindAsync(id);
        if (product == null)
            return ApiResponse<bool>.FailResult("المنتج غير موجود");

        product.IsDeleted = true;
        product.DeletedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true, "تم حذف المنتج بنجاح");
    }

    public async Task<ApiResponse<bool>> RestoreProductAsync(int id)
    {
        var product = await _context.Products.IgnoreQueryFilters().FirstOrDefaultAsync(p => p.Id == id);
        if (product == null)
            return ApiResponse<bool>.FailResult("المنتج غير موجود");

        product.IsDeleted = false;
        product.DeletedAt = null;
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true, "تم استعادة المنتج بنجاح");
    }

    // Stock
    public async Task<ApiResponse<ProductStockDto>> GetProductStockAsync(int productId)
    {
        var stock = await _context.ProductStocks.FirstOrDefaultAsync(s => s.ProductId == productId);
        if (stock == null)
            return ApiResponse<ProductStockDto>.SuccessResult(new ProductStockDto(0, 0, false));

        return ApiResponse<ProductStockDto>.SuccessResult(
            new ProductStockDto(stock.QuantityAvailable, stock.PriceEGP, stock.IsActive));
    }

    public async Task<ApiResponse<ProductStockDto>> CreateProductStockAsync(CreateProductStockDto dto)
    {
        var existing = await _context.ProductStocks.FirstOrDefaultAsync(s => s.ProductId == dto.ProductId);
        if (existing != null)
            return ApiResponse<ProductStockDto>.FailResult("المخزون موجود بالفعل");

        var stock = new ProductStock
        {
            ProductId = dto.ProductId,
            QuantityAvailable = dto.QuantityAvailable,
            PriceEGP = dto.PriceEGP,
            IsActive = dto.IsActive
        };

        _context.ProductStocks.Add(stock);
        await _context.SaveChangesAsync();

        return ApiResponse<ProductStockDto>.SuccessResult(
            new ProductStockDto(stock.QuantityAvailable, stock.PriceEGP, stock.IsActive));
    }

    public async Task<ApiResponse<ProductStockDto>> UpdateProductStockAsync(int productId, UpdateProductStockDto dto)
    {
        var stock = await _context.ProductStocks.FirstOrDefaultAsync(s => s.ProductId == productId);
        if (stock == null)
        {
            stock = new ProductStock { ProductId = productId };
            _context.ProductStocks.Add(stock);
        }

        stock.QuantityAvailable = dto.QuantityAvailable;
        stock.PriceEGP = dto.PriceEGP;
        stock.IsActive = dto.IsActive;
        await _context.SaveChangesAsync();

        return ApiResponse<ProductStockDto>.SuccessResult(
            new ProductStockDto(stock.QuantityAvailable, stock.PriceEGP, stock.IsActive));
    }

    // Attributes
    public async Task<ApiResponse<List<ProductAttributeDto>>> GetProductAttributesAsync(int productId)
    {
        var attrs = await _context.ProductAttributes
            .Where(a => a.ProductId == productId)
            .OrderBy(a => a.SortOrder)
            .ToListAsync();

        return ApiResponse<List<ProductAttributeDto>>.SuccessResult(
            attrs.Select(a => new ProductAttributeDto(a.Id, a.Key, a.ValueAr, a.ValueEn, a.SortOrder)).ToList());
    }

    public async Task<ApiResponse<ProductAttributeDto>> AddProductAttributeAsync(CreateProductAttributeDto dto)
    {
        var attr = new ProductAttribute
        {
            ProductId = dto.ProductId,
            Key = dto.Key,
            ValueAr = dto.ValueAr,
            ValueEn = dto.ValueEn,
            SortOrder = dto.SortOrder
        };

        _context.ProductAttributes.Add(attr);
        await _context.SaveChangesAsync();

        return ApiResponse<ProductAttributeDto>.SuccessResult(
            new ProductAttributeDto(attr.Id, attr.Key, attr.ValueAr, attr.ValueEn, attr.SortOrder));
    }

    public async Task<ApiResponse<ProductAttributeDto>> UpdateProductAttributeAsync(int id, UpdateProductAttributeDto dto)
    {
        var attr = await _context.ProductAttributes.FindAsync(id);
        if (attr == null)
            return ApiResponse<ProductAttributeDto>.FailResult("السمة غير موجودة");

        attr.Key = dto.Key;
        attr.ValueAr = dto.ValueAr;
        attr.ValueEn = dto.ValueEn;
        attr.SortOrder = dto.SortOrder;
        await _context.SaveChangesAsync();

        return ApiResponse<ProductAttributeDto>.SuccessResult(
            new ProductAttributeDto(attr.Id, attr.Key, attr.ValueAr, attr.ValueEn, attr.SortOrder));
    }

    public async Task<ApiResponse<bool>> DeleteProductAttributeAsync(int id)
    {
        var attr = await _context.ProductAttributes.FindAsync(id);
        if (attr == null)
            return ApiResponse<bool>.FailResult("السمة غير موجودة");

        _context.ProductAttributes.Remove(attr);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    // Payment Info
    public async Task<ApiResponse<ProductPaymentInfoDto>> GetProductPaymentInfoAsync(int productId)
    {
        var info = await _context.ProductPaymentInfos.FirstOrDefaultAsync(p => p.ProductId == productId);
        if (info == null)
            return ApiResponse<ProductPaymentInfoDto>.SuccessResult(new ProductPaymentInfoDto(null, null));

        return ApiResponse<ProductPaymentInfoDto>.SuccessResult(
            new ProductPaymentInfoDto(info.PaymentDetailsAr, info.PaymentDetailsEn));
    }

    public async Task<ApiResponse<ProductPaymentInfoDto>> SaveProductPaymentInfoAsync(int productId, UpdateProductPaymentInfoDto dto)
    {
        var info = await _context.ProductPaymentInfos.FirstOrDefaultAsync(p => p.ProductId == productId);
        if (info == null)
        {
            info = new ProductPaymentInfo { ProductId = productId };
            _context.ProductPaymentInfos.Add(info);
        }

        info.PaymentDetailsAr = dto.PaymentDetailsAr;
        info.PaymentDetailsEn = dto.PaymentDetailsEn;
        await _context.SaveChangesAsync();

        return ApiResponse<ProductPaymentInfoDto>.SuccessResult(
            new ProductPaymentInfoDto(info.PaymentDetailsAr, info.PaymentDetailsEn));
    }

    public async Task<ApiResponse<List<InstallmentPlanDto>>> GetProductInstallmentPlansAsync(int productId)
    {
        var plans = await _context.ProductInstallmentPlans
            .Where(p => p.ProductId == productId)
            .OrderBy(p => p.SortOrder)
            .ToListAsync();

        return ApiResponse<List<InstallmentPlanDto>>.SuccessResult(
            plans.Select(p => new InstallmentPlanDto(
                p.Id, p.ProgramName, p.DurationMonths, p.MonthlyAmount,
                p.DownPaymentAmount, p.DownPaymentPercent,
                p.NotesAr, p.NotesEn, p.IsActive, p.SortOrder)).ToList());
    }

    public async Task<ApiResponse<InstallmentPlanDto>> AddProductInstallmentPlanAsync(int productId, CreateInstallmentPlanDto dto)
    {
        var plan = new ProductInstallmentPlan
        {
            ProductId = productId,
            ProgramName = dto.ProgramName,
            DurationMonths = dto.DurationMonths,
            MonthlyAmount = dto.MonthlyAmount,
            DownPaymentAmount = dto.DownPaymentAmount,
            DownPaymentPercent = dto.DownPaymentPercent,
            NotesAr = dto.NotesAr,
            NotesEn = dto.NotesEn,
            IsActive = dto.IsActive,
            SortOrder = dto.SortOrder
        };

        _context.ProductInstallmentPlans.Add(plan);
        await _context.SaveChangesAsync();

        return ApiResponse<InstallmentPlanDto>.SuccessResult(
            new InstallmentPlanDto(plan.Id, plan.ProgramName, plan.DurationMonths, plan.MonthlyAmount,
                plan.DownPaymentAmount, plan.DownPaymentPercent, plan.NotesAr, plan.NotesEn, plan.IsActive, plan.SortOrder));
    }

    public async Task<ApiResponse<InstallmentPlanDto>> UpdateProductInstallmentPlanAsync(int planId, UpdateInstallmentPlanDto dto)
    {
        var plan = await _context.ProductInstallmentPlans.FindAsync(planId);
        if (plan == null)
            return ApiResponse<InstallmentPlanDto>.FailResult("خطة التقسيط غير موجودة");

        plan.ProgramName = dto.ProgramName;
        plan.DurationMonths = dto.DurationMonths;
        plan.MonthlyAmount = dto.MonthlyAmount;
        plan.DownPaymentAmount = dto.DownPaymentAmount;
        plan.DownPaymentPercent = dto.DownPaymentPercent;
        plan.NotesAr = dto.NotesAr;
        plan.NotesEn = dto.NotesEn;
        plan.IsActive = dto.IsActive;
        plan.SortOrder = dto.SortOrder;

        await _context.SaveChangesAsync();

        return ApiResponse<InstallmentPlanDto>.SuccessResult(
            new InstallmentPlanDto(plan.Id, plan.ProgramName, plan.DurationMonths, plan.MonthlyAmount,
                plan.DownPaymentAmount, plan.DownPaymentPercent, plan.NotesAr, plan.NotesEn, plan.IsActive, plan.SortOrder));
    }

    public async Task<ApiResponse<bool>> DeleteProductInstallmentPlanAsync(int planId)
    {
        var plan = await _context.ProductInstallmentPlans.FindAsync(planId);
        if (plan == null)
            return ApiResponse<bool>.FailResult("خطة التقسيط غير موجودة");

        _context.ProductInstallmentPlans.Remove(plan);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    private static ProductListDto MapToListDto(Product product)
    {
        decimal? price = null;
        int? availableUnits = null;

        if (product.InventoryMode == InventoryMode.Stock)
        {
            price = product.ProductStock?.PriceEGP;
        }
        else
        {
            var units = product.Units?.Where(u => !u.IsDeleted && u.Status == UnitStatus.Available).ToList();
            availableUnits = units?.Count;
            price = units?.MinBy(u => u.PriceEGP)?.PriceEGP;
        }

        return new ProductListDto(
            product.Id,
            product.NameAr,
            product.NameEn,
            product.SlugAr,
            product.SlugEn,
            product.Brand?.NameAr,
            product.Brand?.NameEn,
            product.InventoryMode,
            product.IsActive,
            product.ProductMedia?.FirstOrDefault(m => m.IsCover)?.FilePath ?? product.ProductMedia?.FirstOrDefault()?.FilePath,
            price,
            availableUnits
        );
    }

    private static ProductDto MapToDto(Product product)
    {
        return new ProductDto(
            product.Id,
            product.NameAr,
            product.NameEn,
            product.SlugAr,
            product.SlugEn,
            product.DescriptionAr,
            product.DescriptionEn,
            product.ShortDescriptionAr,
            product.ShortDescriptionEn,
            product.BrandId,
            product.Brand?.NameAr,
            product.Brand?.NameEn,
            product.InventoryMode,
            product.IsActive,
            product.SortOrder,
            product.ProductCategories?.Select(pc => new ProductCategoryDto(
                pc.CategoryId, pc.Category?.NameAr ?? "", pc.Category?.NameEn ?? "", pc.IsPrimary)).ToList(),
            product.ProductMedia?.OrderBy(m => m.SortOrder)
                .Select(m => new ProductMediaDto(m.Id, m.FilePath, m.FileName, m.IsCover, m.SortOrder)).ToList(),
            product.ProductStock != null
                ? new ProductStockDto(product.ProductStock.QuantityAvailable, product.ProductStock.PriceEGP, product.ProductStock.IsActive)
                : null,
            product.ProductAttributes?.OrderBy(a => a.SortOrder)
                .Select(a => new ProductAttributeDto(a.Id, a.Key, a.ValueAr, a.ValueEn, a.SortOrder)).ToList()
        );
    }

    private static string GenerateSlug(string text)
    {
        var slug = text.ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("آ", "a").Replace("أ", "a").Replace("إ", "e").Replace("ا", "a")
            .Replace("ب", "b").Replace("ت", "t").Replace("ث", "th")
            .Replace("ج", "g").Replace("ح", "h").Replace("خ", "kh")
            .Replace("د", "d").Replace("ذ", "z").Replace("ر", "r")
            .Replace("ز", "z").Replace("س", "s").Replace("ش", "sh")
            .Replace("ص", "s").Replace("ض", "d").Replace("ط", "t")
            .Replace("ظ", "z").Replace("ع", "a").Replace("غ", "gh")
            .Replace("ف", "f").Replace("ق", "q").Replace("ك", "k")
            .Replace("ل", "l").Replace("م", "m").Replace("ن", "n")
            .Replace("ه", "h").Replace("و", "w").Replace("ي", "y")
            .Replace("ى", "a").Replace("ة", "a").Replace("ء", "")
            .Replace("ئ", "y").Replace("ؤ", "w");

        slug = Regex.Replace(slug, @"[^a-z0-9\-]", "");
        slug = Regex.Replace(slug, @"-+", "-");
        return slug.Trim('-');
    }
}
