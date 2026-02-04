using ICloudStore.Domain.Enums;

namespace ICloudStore.Domain.Entities;

public class AuditLog : BaseEntity
{
    public string EntityName { get; set; } = string.Empty;
    public int EntityId { get; set; }
    public string Action { get; set; } = string.Empty; // Create, Update, Delete
    public string? OldValuesJson { get; set; }
    public string? NewValuesJson { get; set; }
    public int? UserId { get; set; }
    public string? UserName { get; set; }
    public string? IpAddress { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
}

public class LeadLog : BaseEntity
{
    public int? UserId { get; set; }
    public TargetType TargetType { get; set; }
    public int TargetId { get; set; }
    public string? ItemName { get; set; }
    public string WhatsAppUrl { get; set; } = string.Empty;
    public string Language { get; set; } = "ar";
    public string? UserAgent { get; set; }
    public string? IpAddress { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public virtual ApplicationUser? User { get; set; }
}
