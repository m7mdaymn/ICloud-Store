using ICloudStore.Application.Common;
using ICloudStore.Application.DTOs;
using ICloudStore.Application.Interfaces;
using ICloudStore.Domain.Entities;
using ICloudStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace ICloudStore.Infrastructure.Services;

public class SettingsService : ISettingsService
{
    private readonly ApplicationDbContext _context;

    public SettingsService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<ApiResponse<ThemeSettingDto>> GetThemeSettingAsync()
    {
        var theme = await _context.ThemeSettings.FirstOrDefaultAsync();
        if (theme == null)
        {
            theme = new ThemeSetting { ActiveTheme = "Light", AccentColor = "#25D366" };
            _context.ThemeSettings.Add(theme);
            await _context.SaveChangesAsync();
        }

        return ApiResponse<ThemeSettingDto>.SuccessResult(new ThemeSettingDto(
            theme.Id, theme.ActiveTheme, theme.AccentColor,
            theme.LogoLightPath, theme.LogoDarkPath, theme.FaviconPath));
    }

    public async Task<ApiResponse<ThemeSettingDto>> UpdateThemeSettingAsync(UpdateThemeSettingDto dto)
    {
        var theme = await _context.ThemeSettings.FirstOrDefaultAsync();
        if (theme == null)
        {
            theme = new ThemeSetting();
            _context.ThemeSettings.Add(theme);
        }

        theme.ActiveTheme = dto.ActiveTheme;
        theme.AccentColor = dto.AccentColor;
        await _context.SaveChangesAsync();

        return ApiResponse<ThemeSettingDto>.SuccessResult(new ThemeSettingDto(
            theme.Id, theme.ActiveTheme, theme.AccentColor,
            theme.LogoLightPath, theme.LogoDarkPath, theme.FaviconPath));
    }

    public async Task<ApiResponse<bool>> UpdateLogoAsync(string? logoLightPath, string? logoDarkPath, string? faviconPath)
    {
        var theme = await _context.ThemeSettings.FirstOrDefaultAsync();
        if (theme == null)
        {
            theme = new ThemeSetting();
            _context.ThemeSettings.Add(theme);
        }

        if (logoLightPath != null) theme.LogoLightPath = logoLightPath;
        if (logoDarkPath != null) theme.LogoDarkPath = logoDarkPath;
        if (faviconPath != null) theme.FaviconPath = faviconPath;

        await _context.SaveChangesAsync();
        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<List<StoreSettingDto>>> GetAllStoreSettingsAsync()
    {
        var settings = await _context.StoreSettings.ToListAsync();
        return ApiResponse<List<StoreSettingDto>>.SuccessResult(
            settings.Select(s => new StoreSettingDto(s.Id, s.Key, s.ValueAr, s.ValueEn)).ToList());
    }

    public async Task<ApiResponse<StoreSettingDto>> GetStoreSettingAsync(string key)
    {
        var setting = await _context.StoreSettings.FirstOrDefaultAsync(s => s.Key == key);
        if (setting == null)
            return ApiResponse<StoreSettingDto>.FailResult("الإعداد غير موجود");

        return ApiResponse<StoreSettingDto>.SuccessResult(
            new StoreSettingDto(setting.Id, setting.Key, setting.ValueAr, setting.ValueEn));
    }

    public async Task<ApiResponse<StoreSettingDto>> UpdateStoreSettingAsync(string key, UpdateStoreSettingDto dto)
    {
        var setting = await _context.StoreSettings.FirstOrDefaultAsync(s => s.Key == key);
        if (setting == null)
        {
            setting = new StoreSetting { Key = key };
            _context.StoreSettings.Add(setting);
        }

        setting.ValueAr = dto.ValueAr;
        setting.ValueEn = dto.ValueEn;
        await _context.SaveChangesAsync();

        return ApiResponse<StoreSettingDto>.SuccessResult(
            new StoreSettingDto(setting.Id, setting.Key, setting.ValueAr, setting.ValueEn));
    }

    public async Task<ApiResponse<List<SocialLinkDto>>> GetAllSocialLinksAsync(bool includeHidden = false)
    {
        var query = _context.SocialLinks.AsQueryable();
        if (!includeHidden)
            query = query.Where(s => s.IsVisible);

        var links = await query.OrderBy(s => s.SortOrder).ToListAsync();
        return ApiResponse<List<SocialLinkDto>>.SuccessResult(
            links.Select(s => new SocialLinkDto(s.Id, s.Platform, s.Url, s.IconClass, s.IsVisible, s.SortOrder)).ToList());
    }

    public async Task<ApiResponse<SocialLinkDto>> CreateSocialLinkAsync(CreateSocialLinkDto dto)
    {
        var link = new SocialLink
        {
            Platform = dto.Platform,
            Url = dto.Url,
            IconClass = dto.IconClass,
            IsVisible = dto.IsVisible,
            SortOrder = dto.SortOrder
        };

        _context.SocialLinks.Add(link);
        await _context.SaveChangesAsync();

        return ApiResponse<SocialLinkDto>.SuccessResult(
            new SocialLinkDto(link.Id, link.Platform, link.Url, link.IconClass, link.IsVisible, link.SortOrder));
    }

    public async Task<ApiResponse<SocialLinkDto>> UpdateSocialLinkAsync(int id, UpdateSocialLinkDto dto)
    {
        var link = await _context.SocialLinks.FindAsync(id);
        if (link == null)
            return ApiResponse<SocialLinkDto>.FailResult("الرابط غير موجود");

        link.Platform = dto.Platform;
        link.Url = dto.Url;
        link.IconClass = dto.IconClass;
        link.IsVisible = dto.IsVisible;
        link.SortOrder = dto.SortOrder;
        await _context.SaveChangesAsync();

        return ApiResponse<SocialLinkDto>.SuccessResult(
            new SocialLinkDto(link.Id, link.Platform, link.Url, link.IconClass, link.IsVisible, link.SortOrder));
    }

    public async Task<ApiResponse<bool>> DeleteSocialLinkAsync(int id)
    {
        var link = await _context.SocialLinks.FindAsync(id);
        if (link == null)
            return ApiResponse<bool>.FailResult("الرابط غير موجود");

        _context.SocialLinks.Remove(link);
        await _context.SaveChangesAsync();

        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<bool>> ReorderSocialLinksAsync(List<int> linkIds)
    {
        for (int i = 0; i < linkIds.Count; i++)
        {
            var link = await _context.SocialLinks.FindAsync(linkIds[i]);
            if (link != null) link.SortOrder = i + 1;
        }
        await _context.SaveChangesAsync();
        return ApiResponse<bool>.SuccessResult(true);
    }

    public async Task<ApiResponse<StoreInfoDto>> GetPublicStoreInfoAsync()
    {
        var settings = await _context.StoreSettings.ToListAsync();
        var socialLinks = await _context.SocialLinks.Where(s => s.IsVisible).OrderBy(s => s.SortOrder).ToListAsync();
        var theme = await _context.ThemeSettings.FirstOrDefaultAsync();

        var getValue = (string key) => settings.FirstOrDefault(s => s.Key == key);

        return ApiResponse<StoreInfoDto>.SuccessResult(new StoreInfoDto(
            getValue("StoreName")?.ValueAr,
            getValue("StoreName")?.ValueEn,
            getValue("WhatsAppNumber")?.ValueAr,
            getValue("PhoneNumber")?.ValueAr,
            getValue("SupportEmail")?.ValueAr,
            getValue("Address")?.ValueAr,
            getValue("Address")?.ValueEn,
            getValue("WorkingHours")?.ValueAr,
            getValue("WorkingHours")?.ValueEn,
            socialLinks.Select(s => new SocialLinkDto(s.Id, s.Platform, s.Url, s.IconClass, s.IsVisible, s.SortOrder)).ToList(),
            theme != null
                ? new ThemeSettingDto(theme.Id, theme.ActiveTheme, theme.AccentColor, theme.LogoLightPath, theme.LogoDarkPath, theme.FaviconPath)
                : new ThemeSettingDto(0, "Light", "#25D366", null, null, null)
        ));
    }
}
