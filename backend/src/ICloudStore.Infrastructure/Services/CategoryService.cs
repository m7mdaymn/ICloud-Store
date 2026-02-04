using ICloudStore.Application.Common;
using ICloudStore.Application.DTOs;
using ICloudStore.Application.Interfaces;
using ICloudStore.Domain.Entities;
using ICloudStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;

namespace ICloudStore.Infrastructure.Services;

public class CategoryService : ICategoryService
{
    private readonly ApplicationDbContext _context;

    public CategoryService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<CategoryDto>>> GetAllCategoriesAsync(bool includeInactive = false)
    {
        var query = _context.Categories.AsQueryable();
        
        if (!includeInactive)
            query = query.Where(c => c.IsActive);

        var categories = await query
            .Include(c => c.SubCategories.Where(sc => !sc.IsDeleted && (includeInactive || sc.IsActive)))
            .Where(c => c.ParentCategoryId == null)
            .OrderBy(c => c.SortOrder)
            .ToListAsync();

        return ApiResponse<List<CategoryDto>>.SuccessResult(categories.Select(c => MapToDto(c)).ToList());
    }

    public async Task<ApiResponse<List<CategoryDto>>> GetRootCategoriesAsync(bool includeInactive = false)
    {
        var query = _context.Categories
            .Where(c => c.ParentCategoryId == null);

        if (!includeInactive)
            query = query.Where(c => c.IsActive);

        var categories = await query
            .OrderBy(c => c.SortOrder)
            .ToListAsync();

        return ApiResponse<List<CategoryDto>>.SuccessResult(categories.Select(c => MapToDto(c, false)).ToList());
    }

    public async Task<ApiResponse<CategoryDto>> GetCategoryByIdAsync(int id)
    {
        var category = await _context.Categories
            .Include(c => c.SubCategories.Where(sc => !sc.IsDeleted))
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
            return ApiResponse<CategoryDto>.FailResult("الفئة غير موجودة");

        return ApiResponse<CategoryDto>.SuccessResult(MapToDto(category));
    }

    public async Task<ApiResponse<CategoryDto>> GetCategoryBySlugAsync(string slug, string language)
    {
        var category = language == "ar"
            ? await _context.Categories.Include(c => c.SubCategories).FirstOrDefaultAsync(c => c.SlugAr == slug)
            : await _context.Categories.Include(c => c.SubCategories).FirstOrDefaultAsync(c => c.SlugEn == slug);

        if (category == null)
            return ApiResponse<CategoryDto>.FailResult("الفئة غير موجودة");

        return ApiResponse<CategoryDto>.SuccessResult(MapToDto(category));
    }

    public async Task<ApiResponse<CategoryDto>> CreateCategoryAsync(CreateCategoryDto dto)
    {
        var category = new Category
        {
            NameAr = dto.NameAr,
            NameEn = dto.NameEn,
            SlugAr = GenerateSlug(dto.NameAr),
            SlugEn = GenerateSlug(dto.NameEn),
            DescriptionAr = dto.DescriptionAr,
            DescriptionEn = dto.DescriptionEn,
            ParentCategoryId = dto.ParentCategoryId,
            SortOrder = dto.SortOrder,
            IsActive = dto.IsActive
        };

        _context.Categories.Add(category);
        await _context.SaveChangesAsync();

        return ApiResponse<CategoryDto>.SuccessResult(MapToDto(category), "تم إنشاء الفئة بنجاح");
    }

    public async Task<ApiResponse<CategoryDto>> UpdateCategoryAsync(int id, UpdateCategoryDto dto)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            return ApiResponse<CategoryDto>.FailResult("الفئة غير موجودة");

        category.NameAr = dto.NameAr;
        category.NameEn = dto.NameEn;
        category.SlugAr = GenerateSlug(dto.NameAr);
        category.SlugEn = GenerateSlug(dto.NameEn);
        category.DescriptionAr = dto.DescriptionAr;
        category.DescriptionEn = dto.DescriptionEn;
        category.ParentCategoryId = dto.ParentCategoryId;
        category.SortOrder = dto.SortOrder;
        category.IsActive = dto.IsActive;

        await _context.SaveChangesAsync();

        return ApiResponse<CategoryDto>.SuccessResult(MapToDto(category), "تم تحديث الفئة بنجاح");
    }

    public async Task<ApiResponse<bool>> DeleteCategoryAsync(int id)
    {
        var category = await _context.Categories
            .Include(c => c.SubCategories)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (category == null)
            return ApiResponse<bool>.FailResult("الفئة غير موجودة");

        // Soft delete
        category.IsDeleted = true;
        category.DeletedAt = DateTime.UtcNow;

        // Also soft delete subcategories
        foreach (var sub in category.SubCategories)
        {
            sub.IsDeleted = true;
            sub.DeletedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true, "تم حذف الفئة بنجاح");
    }

    public async Task<ApiResponse<bool>> UpdateCategoryImageAsync(int id, string imagePath)
    {
        var category = await _context.Categories.FindAsync(id);
        if (category == null)
            return ApiResponse<bool>.FailResult("الفئة غير موجودة");

        category.ImagePath = imagePath;
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> ReorderCategoriesAsync(List<int> categoryIds)
    {
        for (int i = 0; i < categoryIds.Count; i++)
        {
            var category = await _context.Categories.FindAsync(categoryIds[i]);
            if (category != null)
            {
                category.SortOrder = i + 1;
            }
        }

        await _context.SaveChangesAsync();
        return ApiResponse<bool>.SuccessResult(true);
    }

    private static CategoryDto MapToDto(Category category, bool includeSubCategories = true)
    {
        return new CategoryDto(
            category.Id,
            category.NameAr,
            category.NameEn,
            category.SlugAr,
            category.SlugEn,
            category.DescriptionAr,
            category.DescriptionEn,
            category.ImagePath,
            category.ParentCategoryId,
            category.SortOrder,
            category.IsActive,
            includeSubCategories && category.SubCategories?.Any() == true
                ? category.SubCategories.OrderBy(c => c.SortOrder).Select(c => MapToDto(c, true)).ToList()
                : null
        );
    }

    private static string GenerateSlug(string text)
    {
        // Simple slug generation
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
