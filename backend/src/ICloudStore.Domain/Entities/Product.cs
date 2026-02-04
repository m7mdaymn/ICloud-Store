using ICloudStore.Domain.Enums;

namespace ICloudStore.Domain.Entities;

public class Product : SoftDeleteEntity
{
    public string NameAr { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string SlugAr { get; set; } = string.Empty;
    public string SlugEn { get; set; } = string.Empty;
    public string? DescriptionAr { get; set; }
    public string? DescriptionEn { get; set; }
    public string? ShortDescriptionAr { get; set; }
    public string? ShortDescriptionEn { get; set; }
    public int? BrandId { get; set; }
    public InventoryMode InventoryMode { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
    
    // Navigation
    public virtual Brand? Brand { get; set; }
    public virtual ICollection<ProductCategory> ProductCategories { get; set; } = new List<ProductCategory>();
    public virtual ICollection<Unit> Units { get; set; } = new List<Unit>();
    public virtual ProductStock? ProductStock { get; set; }
    public virtual ICollection<ProductMedia> ProductMedia { get; set; } = new List<ProductMedia>();
    public virtual ICollection<ProductAttribute> ProductAttributes { get; set; } = new List<ProductAttribute>();
    public virtual ProductPaymentInfo? PaymentInfo { get; set; }
    public virtual ICollection<ProductInstallmentPlan> InstallmentPlans { get; set; } = new List<ProductInstallmentPlan>();
}

public class ProductCategory
{
    public int ProductId { get; set; }
    public int CategoryId { get; set; }
    public bool IsPrimary { get; set; } = false;
    
    // Navigation
    public virtual Product Product { get; set; } = null!;
    public virtual Category Category { get; set; } = null!;
}
