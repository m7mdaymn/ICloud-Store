namespace ICloudStore.Domain.Entities;

public class ThemeSetting : BaseEntity
{
    public string ActiveTheme { get; set; } = "Light"; // Light or Dark
    public string AccentColor { get; set; } = "#25D366"; // WhatsApp Green
    public string? LogoLightPath { get; set; }
    public string? LogoDarkPath { get; set; }
    public string? FaviconPath { get; set; }
}

public class StoreSetting : BaseEntity
{
    public string Key { get; set; } = string.Empty;
    public string? ValueAr { get; set; }
    public string? ValueEn { get; set; }
    public string? Description { get; set; }
}

public class SocialLink : BaseEntity
{
    public string Platform { get; set; } = string.Empty; // facebook, instagram, twitter, tiktok, youtube
    public string Url { get; set; } = string.Empty;
    public string? IconClass { get; set; }
    public bool IsVisible { get; set; } = true;
    public int SortOrder { get; set; }
}
