using ICloudStore.Domain.Enums;

namespace ICloudStore.Domain.Entities;

public class Unit : SoftDeleteEntity
{
    public int ProductId { get; set; }
    public bool IsNew { get; set; } = false;
    public UnitStatus Status { get; set; } = UnitStatus.Available;
    public UnitCondition? Condition { get; set; }
    
    // Specifications
    public string? Storage { get; set; } // 128GB, 256GB, 512GB, 1TB
    public string? Color { get; set; }
    public int? BatteryHealthPercent { get; set; }
    
    // Warranty
    public WarrantyType WarrantyType { get; set; } = WarrantyType.None;
    public DateTime? AppleWarrantyEndDate { get; set; }
    public int? StoreWarrantyMonths { get; set; }
    public DateTime? StoreWarrantyStartDate { get; set; }
    
    // Box Contents
    public bool HasBox { get; set; } = false;
    public bool HasCable { get; set; } = false;
    public bool HasCharger { get; set; } = false;
    public string? OtherAccessoriesText { get; set; }
    
    // Identifiers
    public string? IMEI { get; set; }
    public string? SerialNumber { get; set; }
    
    // Notes
    public string? NotesAr { get; set; }
    public string? NotesEn { get; set; }
    
    // Pricing
    public decimal PriceEGP { get; set; }
    
    // Computed warranty remaining
    public int? WarrantyRemainingMonths
    {
        get
        {
            if (WarrantyType == Enums.WarrantyType.Apple && AppleWarrantyEndDate.HasValue)
            {
                var remaining = (AppleWarrantyEndDate.Value - DateTime.UtcNow).TotalDays / 30;
                return Math.Max(0, (int)remaining);
            }
            if (WarrantyType == Enums.WarrantyType.Store && StoreWarrantyMonths.HasValue && StoreWarrantyStartDate.HasValue)
            {
                var endDate = StoreWarrantyStartDate.Value.AddMonths(StoreWarrantyMonths.Value);
                var remaining = (endDate - DateTime.UtcNow).TotalDays / 30;
                return Math.Max(0, (int)remaining);
            }
            return null;
        }
    }
    
    // Navigation
    public virtual Product Product { get; set; } = null!;
    public virtual ICollection<UnitMedia> Media { get; set; } = new List<UnitMedia>();
    public virtual UnitPaymentInfo? PaymentInfo { get; set; }
    public virtual ICollection<UnitInstallmentPlan> InstallmentPlans { get; set; } = new List<UnitInstallmentPlan>();
}

public class UnitMedia : BaseEntity
{
    public int UnitId { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public bool IsCover { get; set; } = false;
    public int SortOrder { get; set; }
    
    // Navigation
    public virtual Unit Unit { get; set; } = null!;
}
