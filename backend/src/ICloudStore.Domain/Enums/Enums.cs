namespace ICloudStore.Domain.Enums;

public enum UserRole
{
    Admin = 1,
    Staff = 2,
    Customer = 3
}

public enum InventoryMode
{
    Unit = 1,   // Unique units for devices
    Stock = 2   // Quantity-based for accessories
}

public enum UnitStatus
{
    Available = 1,
    Reserved = 2,
    Sold = 3,
    Hidden = 4
}

public enum UnitCondition
{
    Excellent = 1,
    VeryGood = 2,
    Good = 3
}

public enum WarrantyType
{
    None = 0,
    Apple = 1,
    Store = 2
}

public enum HomeSectionType
{
    HeroSlider = 1,
    FeaturedCategories = 2,
    NewArrivals = 3,
    FeaturedUnits = 4,
    TrustStrip = 5,
    BrandStrip = 6,
    PromoBanners = 7,
    FaqBlock = 8,
    FooterBlocks = 9
}

public enum TargetType
{
    Unit = 1,
    Product = 2
}
