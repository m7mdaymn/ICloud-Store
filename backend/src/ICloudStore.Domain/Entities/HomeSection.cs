using ICloudStore.Domain.Enums;

namespace ICloudStore.Domain.Entities;

public class HomeSection : BaseEntity
{
    public HomeSectionType SectionType { get; set; }
    public string TitleAr { get; set; } = string.Empty;
    public string TitleEn { get; set; } = string.Empty;
    public string? SubtitleAr { get; set; }
    public string? SubtitleEn { get; set; }
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? ScheduleStart { get; set; }
    public DateTime? ScheduleEnd { get; set; }
    public string? ConfigJson { get; set; } // Additional configuration in JSON
    
    // Navigation
    public virtual ICollection<HomeSectionItem> Items { get; set; } = new List<HomeSectionItem>();
}

public class HomeSectionItem : BaseEntity
{
    public int HomeSectionId { get; set; }
    public string? TitleAr { get; set; }
    public string? TitleEn { get; set; }
    public string? SubtitleAr { get; set; }
    public string? SubtitleEn { get; set; }
    public string? ImagePathDesktop { get; set; }
    public string? ImagePathMobile { get; set; }
    public string? LinkUrl { get; set; }
    public string? ButtonTextAr { get; set; }
    public string? ButtonTextEn { get; set; }
    public string? DataJson { get; set; } // Flexible data storage
    public int SortOrder { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime? ScheduleStart { get; set; }
    public DateTime? ScheduleEnd { get; set; }
    
    // Navigation
    public virtual HomeSection HomeSection { get; set; } = null!;
}
