using FluentValidation;
using ICloudStore.Application.DTOs;

namespace ICloudStore.Application.Validators;

public class CreateCategoryValidator : AbstractValidator<CreateCategoryDto>
{
    public CreateCategoryValidator()
    {
        RuleFor(x => x.NameAr)
            .NotEmpty().WithMessage("الاسم بالعربية مطلوب")
            .MaximumLength(100).WithMessage("الاسم يجب ألا يتجاوز 100 حرف");
        
        RuleFor(x => x.NameEn)
            .NotEmpty().WithMessage("الاسم بالإنجليزية مطلوب")
            .MaximumLength(100).WithMessage("الاسم يجب ألا يتجاوز 100 حرف");
    }
}

public class UpdateCategoryValidator : AbstractValidator<UpdateCategoryDto>
{
    public UpdateCategoryValidator()
    {
        RuleFor(x => x.NameAr)
            .NotEmpty().WithMessage("الاسم بالعربية مطلوب")
            .MaximumLength(100).WithMessage("الاسم يجب ألا يتجاوز 100 حرف");
        
        RuleFor(x => x.NameEn)
            .NotEmpty().WithMessage("الاسم بالإنجليزية مطلوب")
            .MaximumLength(100).WithMessage("الاسم يجب ألا يتجاوز 100 حرف");
    }
}

public class CreateBrandValidator : AbstractValidator<CreateBrandDto>
{
    public CreateBrandValidator()
    {
        RuleFor(x => x.NameAr)
            .NotEmpty().WithMessage("الاسم بالعربية مطلوب")
            .MaximumLength(100).WithMessage("الاسم يجب ألا يتجاوز 100 حرف");
        
        RuleFor(x => x.NameEn)
            .NotEmpty().WithMessage("الاسم بالإنجليزية مطلوب")
            .MaximumLength(100).WithMessage("الاسم يجب ألا يتجاوز 100 حرف");
    }
}

public class CreateProductValidator : AbstractValidator<CreateProductDto>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.NameAr)
            .NotEmpty().WithMessage("اسم المنتج بالعربية مطلوب")
            .MaximumLength(200).WithMessage("الاسم يجب ألا يتجاوز 200 حرف");
        
        RuleFor(x => x.NameEn)
            .NotEmpty().WithMessage("اسم المنتج بالإنجليزية مطلوب")
            .MaximumLength(200).WithMessage("الاسم يجب ألا يتجاوز 200 حرف");
        
        RuleFor(x => x.CategoryIds)
            .NotEmpty().WithMessage("يجب تحديد فئة واحدة على الأقل");
        
        RuleFor(x => x.InventoryMode)
            .IsInEnum().WithMessage("نوع المخزون غير صالح");
    }
}

public class CreateUnitValidator : AbstractValidator<CreateUnitDto>
{
    public CreateUnitValidator()
    {
        RuleFor(x => x.ProductId)
            .GreaterThan(0).WithMessage("يجب تحديد المنتج");
        
        RuleFor(x => x.PriceEGP)
            .GreaterThan(0).WithMessage("السعر يجب أن يكون أكبر من صفر");
        
        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("الحالة غير صالحة");
        
        RuleFor(x => x.BatteryHealthPercent)
            .InclusiveBetween(0, 100).When(x => x.BatteryHealthPercent.HasValue)
            .WithMessage("صحة البطارية يجب أن تكون بين 0 و 100");
        
        RuleFor(x => x.StoreWarrantyMonths)
            .InclusiveBetween(1, 36).When(x => x.StoreWarrantyMonths.HasValue)
            .WithMessage("مدة الضمان يجب أن تكون بين 1 و 36 شهر");
    }
}

public class UpdateUnitValidator : AbstractValidator<UpdateUnitDto>
{
    public UpdateUnitValidator()
    {
        RuleFor(x => x.PriceEGP)
            .GreaterThan(0).WithMessage("السعر يجب أن يكون أكبر من صفر");
        
        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("الحالة غير صالحة");
        
        RuleFor(x => x.BatteryHealthPercent)
            .InclusiveBetween(0, 100).When(x => x.BatteryHealthPercent.HasValue)
            .WithMessage("صحة البطارية يجب أن تكون بين 0 و 100");
    }
}
