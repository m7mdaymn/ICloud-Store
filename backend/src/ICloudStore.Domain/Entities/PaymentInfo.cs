namespace ICloudStore.Domain.Entities;

// Unit Payment Info
public class UnitPaymentInfo : BaseEntity
{
    public int UnitId { get; set; }
    public string? PaymentDetailsAr { get; set; }
    public string? PaymentDetailsEn { get; set; }
    
    // Navigation
    public virtual Unit Unit { get; set; } = null!;
}

public class UnitInstallmentPlan : BaseEntity
{
    public int UnitId { get; set; }
    public string ProgramName { get; set; } = string.Empty; // e.g., ValU, Contact, Bank
    public int DurationMonths { get; set; }
    public decimal? MonthlyAmount { get; set; }
    public decimal? DownPaymentAmount { get; set; }
    public decimal? DownPaymentPercent { get; set; }
    public string? NotesAr { get; set; }
    public string? NotesEn { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
    
    // Navigation
    public virtual Unit Unit { get; set; } = null!;
}

// Product Payment Info (for Accessories)
public class ProductPaymentInfo : BaseEntity
{
    public int ProductId { get; set; }
    public string? PaymentDetailsAr { get; set; }
    public string? PaymentDetailsEn { get; set; }
    
    // Navigation
    public virtual Product Product { get; set; } = null!;
}

public class ProductInstallmentPlan : BaseEntity
{
    public int ProductId { get; set; }
    public string ProgramName { get; set; } = string.Empty;
    public int DurationMonths { get; set; }
    public decimal? MonthlyAmount { get; set; }
    public decimal? DownPaymentAmount { get; set; }
    public decimal? DownPaymentPercent { get; set; }
    public string? NotesAr { get; set; }
    public string? NotesEn { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
    
    // Navigation
    public virtual Product Product { get; set; } = null!;
}
