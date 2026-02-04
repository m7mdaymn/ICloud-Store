using ICloudStore.Domain.Enums;

namespace ICloudStore.Application.DTOs;

// HomeSection DTOs
public record HomeSectionDto(
    int Id,
    HomeSectionType SectionType,
    string TitleAr,
    string TitleEn,
    string? SubtitleAr,
    string? SubtitleEn,
    int SortOrder,
    bool IsActive,
    DateTime? ScheduleStart,
    DateTime? ScheduleEnd,
    string? ConfigJson,
    List<HomeSectionItemDto>? Items
);

public record HomeSectionItemDto(
    int Id,
    string? TitleAr,
    string? TitleEn,
    string? SubtitleAr,
    string? SubtitleEn,
    string? ImagePathDesktop,
    string? ImagePathMobile,
    string? LinkUrl,
    string? ButtonTextAr,
    string? ButtonTextEn,
    string? DataJson,
    int SortOrder,
    bool IsActive,
    DateTime? ScheduleStart,
    DateTime? ScheduleEnd
);

public record CreateHomeSectionDto(
    HomeSectionType SectionType,
    string TitleAr,
    string TitleEn,
    string? SubtitleAr,
    string? SubtitleEn,
    int SortOrder,
    bool IsActive,
    DateTime? ScheduleStart,
    DateTime? ScheduleEnd,
    string? ConfigJson
);

public record UpdateHomeSectionDto(
    string TitleAr,
    string TitleEn,
    string? SubtitleAr,
    string? SubtitleEn,
    int SortOrder,
    bool IsActive,
    DateTime? ScheduleStart,
    DateTime? ScheduleEnd,
    string? ConfigJson
);

public record CreateHomeSectionItemDto(
    int HomeSectionId,
    string? TitleAr,
    string? TitleEn,
    string? SubtitleAr,
    string? SubtitleEn,
    string? LinkUrl,
    string? ButtonTextAr,
    string? ButtonTextEn,
    string? DataJson,
    int SortOrder,
    bool IsActive,
    DateTime? ScheduleStart,
    DateTime? ScheduleEnd
);

public record UpdateHomeSectionItemDto(
    string? TitleAr,
    string? TitleEn,
    string? SubtitleAr,
    string? SubtitleEn,
    string? LinkUrl,
    string? ButtonTextAr,
    string? ButtonTextEn,
    string? DataJson,
    int SortOrder,
    bool IsActive,
    DateTime? ScheduleStart,
    DateTime? ScheduleEnd
);
