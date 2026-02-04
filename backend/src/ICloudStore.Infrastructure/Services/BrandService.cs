using ICloudStore.Application.Common;
using ICloudStore.Application.DTOs;
using ICloudStore.Application.Interfaces;
using ICloudStore.Domain.Entities;
using ICloudStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace ICloudStore.Infrastructure.Services;

public class BrandService : IBrandService
{
    private readonly ApplicationDbContext _context;

    public BrandService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<BrandDto>>> GetAllBrandsAsync(bool includeInactive = false)
    {
        var query = _context.Brands.AsQueryable();
        
        if (!includeInactive)
            query = query.Where(b => b.IsActive);

        var brands = await query
            .OrderBy(b => b.SortOrder)
            .ThenBy(b => b.NameEn)
            .Select(b => new BrandDto(
                b.Id,
                b.NameAr,
                b.NameEn,
                b.SlugAr,
                b.SlugEn,
                b.LogoPath,
                b.SortOrder,
                b.IsActive
            ))
            .ToListAsync();

        return ApiResponse<List<BrandDto>>.SuccessResult(brands);
    }

    public async Task<ApiResponse<BrandDto>> GetBrandByIdAsync(int id)
    {
        var brand = await _context.Brands.FindAsync(id);
        if (brand == null)
            return ApiResponse<BrandDto>.FailResult("العلامة التجارية غير موجودة");

        return ApiResponse<BrandDto>.SuccessResult(MapToDto(brand));
    }

    public async Task<ApiResponse<BrandDto>> GetBrandBySlugAsync(string slug)
    {
        var brand = await _context.Brands.FirstOrDefaultAsync(b => b.SlugEn == slug || b.SlugAr == slug);
        if (brand == null)
            return ApiResponse<BrandDto>.FailResult("العلامة التجارية غير موجودة");

        return ApiResponse<BrandDto>.SuccessResult(MapToDto(brand));
    }

    public async Task<ApiResponse<BrandDto>> CreateBrandAsync(CreateBrandDto dto)
    {
        var slugEn = GenerateSlug(dto.NameEn);
        var slugAr = GenerateSlug(dto.NameAr);

        // Check slug uniqueness
        var existingSlug = await _context.Brands.AnyAsync(b => b.SlugEn == slugEn);
        if (existingSlug)
            slugEn = $"{slugEn}-{DateTime.UtcNow.Ticks}";

        var maxOrder = await _context.Brands.MaxAsync(b => (int?)b.SortOrder) ?? 0;

        var brand = new Brand
        {
            NameAr = dto.NameAr,
            NameEn = dto.NameEn,
            SlugAr = slugAr,
            SlugEn = slugEn,
            IsActive = dto.IsActive,
            SortOrder = dto.SortOrder > 0 ? dto.SortOrder : maxOrder + 1
        };

        _context.Brands.Add(brand);
        await _context.SaveChangesAsync();

        return ApiResponse<BrandDto>.SuccessResult(MapToDto(brand), "تم إنشاء العلامة التجارية بنجاح");
    }

    public async Task<ApiResponse<BrandDto>> UpdateBrandAsync(int id, UpdateBrandDto dto)
    {
        var brand = await _context.Brands.FindAsync(id);
        if (brand == null)
            return ApiResponse<BrandDto>.FailResult("العلامة التجارية غير موجودة");

        brand.NameAr = dto.NameAr;
        brand.NameEn = dto.NameEn;
        brand.IsActive = dto.IsActive;
        brand.SortOrder = dto.SortOrder;

        // Regenerate slug if name changed
        var newSlugEn = GenerateSlug(dto.NameEn);
        if (newSlugEn != brand.SlugEn)
        {
            var existingSlug = await _context.Brands.AnyAsync(b => b.SlugEn == newSlugEn && b.Id != id);
            brand.SlugEn = existingSlug ? $"{newSlugEn}-{DateTime.UtcNow.Ticks}" : newSlugEn;
            brand.SlugAr = GenerateSlug(dto.NameAr);
        }

        await _context.SaveChangesAsync();

        return ApiResponse<BrandDto>.SuccessResult(MapToDto(brand), "تم تحديث العلامة التجارية بنجاح");
    }

    public async Task<ApiResponse<bool>> DeleteBrandAsync(int id)
    {
        var brand = await _context.Brands.FindAsync(id);
        if (brand == null)
            return ApiResponse<bool>.FailResult("العلامة التجارية غير موجودة");

        // Check if brand has products
        var hasProducts = await _context.Products.AnyAsync(p => p.BrandId == id);

        if (hasProducts)
            return ApiResponse<bool>.FailResult("لا يمكن حذف العلامة التجارية لأنها مرتبطة بمنتجات");

        _context.Brands.Remove(brand);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true, "تم حذف العلامة التجارية بنجاح");
    }

    public async Task<ApiResponse<bool>> UpdateBrandLogoAsync(int id, string logoPath)
    {
        var brand = await _context.Brands.FindAsync(id);
        if (brand == null)
            return ApiResponse<bool>.FailResult("العلامة التجارية غير موجودة");

        brand.LogoPath = logoPath;
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> ReorderBrandsAsync(List<int> brandIds)
    {
        var brands = await _context.Brands
            .Where(b => brandIds.Contains(b.Id))
            .ToListAsync();

        for (int i = 0; i < brandIds.Count; i++)
        {
            var brand = brands.FirstOrDefault(b => b.Id == brandIds[i]);
            if (brand != null)
                brand.SortOrder = i + 1;
        }

        await _context.SaveChangesAsync();
        return ApiResponse<bool>.SuccessResult(true, "تم إعادة ترتيب العلامات التجارية بنجاح");
    }

    private static BrandDto MapToDto(Brand brand)
    {
        return new BrandDto(
            brand.Id,
            brand.NameAr,
            brand.NameEn,
            brand.SlugAr,
            brand.SlugEn,
            brand.LogoPath,
            brand.SortOrder,
            brand.IsActive
        );
    }

    private static string GenerateSlug(string text)
    {
        var slug = text.ToLowerInvariant();
        slug = Regex.Replace(slug, @"[^a-z0-9\s-]", "");
        slug = Regex.Replace(slug, @"\s+", "-");
        slug = Regex.Replace(slug, @"-+", "-");
        return slug.Trim('-');
    }
}
