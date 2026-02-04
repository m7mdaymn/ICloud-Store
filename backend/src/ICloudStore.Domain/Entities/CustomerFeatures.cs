using ICloudStore.Domain.Enums;

namespace ICloudStore.Domain.Entities;

public class Wishlist : BaseEntity
{
    public int UserId { get; set; }
    public TargetType TargetType { get; set; }
    public int TargetId { get; set; }
    
    // Navigation
    public virtual ApplicationUser User { get; set; } = null!;
}

public class RecentlyViewed : BaseEntity
{
    public int UserId { get; set; }
    public TargetType TargetType { get; set; }
    public int TargetId { get; set; }
    public DateTime ViewedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation
    public virtual ApplicationUser User { get; set; } = null!;
}
