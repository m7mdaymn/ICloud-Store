using ICloudStore.Application.Common;
using ICloudStore.Application.DTOs;
using ICloudStore.Application.Interfaces;
using ICloudStore.Domain.Entities;
using ICloudStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ICloudStore.Infrastructure.Services;

public class HomeSectionService : IHomeSectionService
{
    private readonly ApplicationDbContext _context;

    public HomeSectionService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<List<HomeSectionDto>>> GetAllSectionsAsync(bool includeInactive = false)
    {
        var query = _context.HomeSections.Include(s => s.Items).AsQueryable();
        
        if (!includeInactive)
            query = query.Where(s => s.IsActive);

        var sections = await query.OrderBy(s => s.SortOrder).ToListAsync();
        return ApiResponse<List<HomeSectionDto>>.SuccessResult(sections.Select(MapToDto).ToList());
    }

    public async Task<ApiResponse<List<HomeSectionDto>>> GetActiveSectionsAsync()
    {
        var now = DateTime.UtcNow;
        var sections = await _context.HomeSections
            .Include(s => s.Items.Where(i => i.IsActive &&
                (!i.ScheduleStart.HasValue || i.ScheduleStart <= now) &&
                (!i.ScheduleEnd.HasValue || i.ScheduleEnd >= now)))
            .Where(s => s.IsActive &&
                (!s.ScheduleStart.HasValue || s.ScheduleStart <= now) &&
                (!s.ScheduleEnd.HasValue || s.ScheduleEnd >= now))
            .OrderBy(s => s.SortOrder)
            .ToListAsync();

        return ApiResponse<List<HomeSectionDto>>.SuccessResult(sections.Select(MapToDto).ToList());
    }

    public async Task<ApiResponse<HomeSectionDto>> GetSectionByIdAsync(int id)
    {
        var section = await _context.HomeSections
            .Include(s => s.Items)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (section == null)
            return ApiResponse<HomeSectionDto>.FailResult("القسم غير موجود");

        return ApiResponse<HomeSectionDto>.SuccessResult(MapToDto(section));
    }

    public async Task<ApiResponse<HomeSectionDto>> CreateSectionAsync(CreateHomeSectionDto dto)
    {
        var section = new HomeSection
        {
            SectionType = dto.SectionType,
            TitleAr = dto.TitleAr,
            TitleEn = dto.TitleEn,
            SubtitleAr = dto.SubtitleAr,
            SubtitleEn = dto.SubtitleEn,
            SortOrder = dto.SortOrder,
            IsActive = dto.IsActive,
            ScheduleStart = dto.ScheduleStart,
            ScheduleEnd = dto.ScheduleEnd,
            ConfigJson = dto.ConfigJson
        };

        _context.HomeSections.Add(section);
        await _context.SaveChangesAsync();

        return ApiResponse<HomeSectionDto>.SuccessResult(MapToDto(section));
    }

    public async Task<ApiResponse<HomeSectionDto>> UpdateSectionAsync(int id, UpdateHomeSectionDto dto)
    {
        var section = await _context.HomeSections.FindAsync(id);
        if (section == null)
            return ApiResponse<HomeSectionDto>.FailResult("القسم غير موجود");

        section.TitleAr = dto.TitleAr;
        section.TitleEn = dto.TitleEn;
        section.SubtitleAr = dto.SubtitleAr;
        section.SubtitleEn = dto.SubtitleEn;
        section.SortOrder = dto.SortOrder;
        section.IsActive = dto.IsActive;
        section.ScheduleStart = dto.ScheduleStart;
        section.ScheduleEnd = dto.ScheduleEnd;
        section.ConfigJson = dto.ConfigJson;

        await _context.SaveChangesAsync();

        return ApiResponse<HomeSectionDto>.SuccessResult(MapToDto(section));
    }

    public async Task<ApiResponse<bool>> DeleteSectionAsync(int id)
    {
        var section = await _context.HomeSections.Include(s => s.Items).FirstOrDefaultAsync(s => s.Id == id);
        if (section == null)
            return ApiResponse<bool>.FailResult("القسم غير موجود");

        _context.HomeSectionItems.RemoveRange(section.Items);
        _context.HomeSections.Remove(section);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> ReorderSectionsAsync(List<int> sectionIds)
    {
        for (int i = 0; i < sectionIds.Count; i++)
        {
            var section = await _context.HomeSections.FindAsync(sectionIds[i]);
            if (section != null) section.SortOrder = i + 1;
        }
        await _context.SaveChangesAsync();
        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<HomeSectionItemDto>> GetSectionItemByIdAsync(int id)
    {
        var item = await _context.HomeSectionItems.FindAsync(id);
        if (item == null)
            return ApiResponse<HomeSectionItemDto>.FailResult("العنصر غير موجود");

        return ApiResponse<HomeSectionItemDto>.SuccessResult(MapItemToDto(item));
    }

    public async Task<ApiResponse<HomeSectionItemDto>> CreateSectionItemAsync(CreateHomeSectionItemDto dto)
    {
        var item = new HomeSectionItem
        {
            HomeSectionId = dto.HomeSectionId,
            TitleAr = dto.TitleAr,
            TitleEn = dto.TitleEn,
            SubtitleAr = dto.SubtitleAr,
            SubtitleEn = dto.SubtitleEn,
            LinkUrl = dto.LinkUrl,
            ButtonTextAr = dto.ButtonTextAr,
            ButtonTextEn = dto.ButtonTextEn,
            DataJson = dto.DataJson,
            SortOrder = dto.SortOrder,
            IsActive = dto.IsActive,
            ScheduleStart = dto.ScheduleStart,
            ScheduleEnd = dto.ScheduleEnd
        };

        _context.HomeSectionItems.Add(item);
        await _context.SaveChangesAsync();

        return ApiResponse<HomeSectionItemDto>.SuccessResult(MapItemToDto(item));
    }

    public async Task<ApiResponse<HomeSectionItemDto>> UpdateSectionItemAsync(int id, UpdateHomeSectionItemDto dto)
    {
        var item = await _context.HomeSectionItems.FindAsync(id);
        if (item == null)
            return ApiResponse<HomeSectionItemDto>.FailResult("العنصر غير موجود");

        item.TitleAr = dto.TitleAr;
        item.TitleEn = dto.TitleEn;
        item.SubtitleAr = dto.SubtitleAr;
        item.SubtitleEn = dto.SubtitleEn;
        item.LinkUrl = dto.LinkUrl;
        item.ButtonTextAr = dto.ButtonTextAr;
        item.ButtonTextEn = dto.ButtonTextEn;
        item.DataJson = dto.DataJson;
        item.SortOrder = dto.SortOrder;
        item.IsActive = dto.IsActive;
        item.ScheduleStart = dto.ScheduleStart;
        item.ScheduleEnd = dto.ScheduleEnd;

        await _context.SaveChangesAsync();

        return ApiResponse<HomeSectionItemDto>.SuccessResult(MapItemToDto(item));
    }

    public async Task<ApiResponse<bool>> DeleteSectionItemAsync(int id)
    {
        var item = await _context.HomeSectionItems.FindAsync(id);
        if (item == null)
            return ApiResponse<bool>.FailResult("العنصر غير موجود");

        _context.HomeSectionItems.Remove(item);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> UpdateSectionItemImagesAsync(int id, string? desktopPath, string? mobilePath)
    {
        var item = await _context.HomeSectionItems.FindAsync(id);
        if (item == null)
            return ApiResponse<bool>.FailResult("العنصر غير موجود");

        if (desktopPath != null) item.ImagePathDesktop = desktopPath;
        if (mobilePath != null) item.ImagePathMobile = mobilePath;

        await _context.SaveChangesAsync();
        return ApiResponse<bool>.SuccessResult(true);
    }

    private static HomeSectionDto MapToDto(HomeSection section)
    {
        return new HomeSectionDto(
            section.Id,
            section.SectionType,
            section.TitleAr,
            section.TitleEn,
            section.SubtitleAr,
            section.SubtitleEn,
            section.SortOrder,
            section.IsActive,
            section.ScheduleStart,
            section.ScheduleEnd,
            section.ConfigJson,
            section.Items?.OrderBy(i => i.SortOrder).Select(MapItemToDto).ToList()
        );
    }

    private static HomeSectionItemDto MapItemToDto(HomeSectionItem item)
    {
        return new HomeSectionItemDto(
            item.Id,
            item.TitleAr,
            item.TitleEn,
            item.SubtitleAr,
            item.SubtitleEn,
            item.ImagePathDesktop,
            item.ImagePathMobile,
            item.LinkUrl,
            item.ButtonTextAr,
            item.ButtonTextEn,
            item.DataJson,
            item.SortOrder,
            item.IsActive,
            item.ScheduleStart,
            item.ScheduleEnd
        );
    }
}
