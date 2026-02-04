using ICloudStore.Application.Common;
using ICloudStore.Application.DTOs;

namespace ICloudStore.Application.Interfaces;

public interface IHomeSectionService
{
    Task<ApiResponse<List<HomeSectionDto>>> GetAllSectionsAsync(bool includeInactive = false);
    Task<ApiResponse<List<HomeSectionDto>>> GetActiveSectionsAsync();
    Task<ApiResponse<HomeSectionDto>> GetSectionByIdAsync(int id);
    Task<ApiResponse<HomeSectionDto>> CreateSectionAsync(CreateHomeSectionDto dto);
    Task<ApiResponse<HomeSectionDto>> UpdateSectionAsync(int id, UpdateHomeSectionDto dto);
    Task<ApiResponse<bool>> DeleteSectionAsync(int id);
    Task<ApiResponse<bool>> ReorderSectionsAsync(List<int> sectionIds);
    
    // Section Items
    Task<ApiResponse<HomeSectionItemDto>> GetSectionItemByIdAsync(int id);
    Task<ApiResponse<HomeSectionItemDto>> CreateSectionItemAsync(CreateHomeSectionItemDto dto);
    Task<ApiResponse<HomeSectionItemDto>> UpdateSectionItemAsync(int id, UpdateHomeSectionItemDto dto);
    Task<ApiResponse<bool>> DeleteSectionItemAsync(int id);
    Task<ApiResponse<bool>> UpdateSectionItemImagesAsync(int id, string? desktopPath, string? mobilePath);
}

public interface ISettingsService
{
    // Theme
    Task<ApiResponse<ThemeSettingDto>> GetThemeSettingAsync();
    Task<ApiResponse<ThemeSettingDto>> UpdateThemeSettingAsync(UpdateThemeSettingDto dto);
    Task<ApiResponse<bool>> UpdateLogoAsync(string? logoLightPath, string? logoDarkPath, string? faviconPath);
    
    // Store Settings
    Task<ApiResponse<List<StoreSettingDto>>> GetAllStoreSettingsAsync();
    Task<ApiResponse<StoreSettingDto>> GetStoreSettingAsync(string key);
    Task<ApiResponse<StoreSettingDto>> UpdateStoreSettingAsync(string key, UpdateStoreSettingDto dto);
    
    // Social Links
    Task<ApiResponse<List<SocialLinkDto>>> GetAllSocialLinksAsync(bool includeHidden = false);
    Task<ApiResponse<SocialLinkDto>> CreateSocialLinkAsync(CreateSocialLinkDto dto);
    Task<ApiResponse<SocialLinkDto>> UpdateSocialLinkAsync(int id, UpdateSocialLinkDto dto);
    Task<ApiResponse<bool>> DeleteSocialLinkAsync(int id);
    Task<ApiResponse<bool>> ReorderSocialLinksAsync(List<int> linkIds);
    
    // Public
    Task<ApiResponse<StoreInfoDto>> GetPublicStoreInfoAsync();
}
