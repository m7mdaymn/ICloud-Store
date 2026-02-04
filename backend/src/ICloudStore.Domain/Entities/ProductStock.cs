namespace ICloudStore.Domain.Entities;

public class ProductStock : BaseEntity
{
    public int ProductId { get; set; }
    public int QuantityAvailable { get; set; }
    public decimal PriceEGP { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsDeleted { get; set; } = false;
    public DateTime? DeletedAt { get; set; }
    public int? DeletedBy { get; set; }
    
    // Navigation
    public virtual Product Product { get; set; } = null!;
}

public class ProductMedia : BaseEntity
{
    public int ProductId { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public bool IsCover { get; set; } = false;
    public int SortOrder { get; set; }
    
    // Navigation
    public virtual Product Product { get; set; } = null!;
}

public class ProductAttribute : BaseEntity
{
    public int ProductId { get; set; }
    public string Key { get; set; } = string.Empty; // e.g., "Watt", "Ports", "CableLength"
    public string ValueAr { get; set; } = string.Empty;
    public string ValueEn { get; set; } = string.Empty;
    public int SortOrder { get; set; }
    
    // Navigation
    public virtual Product Product { get; set; } = null!;
}
