using ICloudStore.Domain.Enums;

namespace ICloudStore.Application.DTOs;

// Settings DTOs
public record ThemeSettingDto(
    int Id,
    string ActiveTheme,
    string AccentColor,
    string? LogoLightPath,
    string? LogoDarkPath,
    string? FaviconPath
);

public record UpdateThemeSettingDto(
    string ActiveTheme,
    string AccentColor
);

public record StoreSettingDto(
    int Id,
    string Key,
    string? ValueAr,
    string? ValueEn
);

public record UpdateStoreSettingDto(string? ValueAr, string? ValueEn);

public record SocialLinkDto(
    int Id,
    string Platform,
    string Url,
    string? IconClass,
    bool IsVisible,
    int SortOrder
);

public record CreateSocialLinkDto(
    string Platform,
    string Url,
    string? IconClass,
    bool IsVisible,
    int SortOrder
);

public record UpdateSocialLinkDto(
    string Platform,
    string Url,
    string? IconClass,
    bool IsVisible,
    int SortOrder
);

// Public store info
public record StoreInfoDto(
    string? StoreNameAr,
    string? StoreNameEn,
    string? WhatsAppNumber,
    string? PhoneNumber,
    string? SupportEmail,
    string? AddressAr,
    string? AddressEn,
    string? WorkingHoursAr,
    string? WorkingHoursEn,
    List<SocialLinkDto> SocialLinks,
    ThemeSettingDto Theme
);
