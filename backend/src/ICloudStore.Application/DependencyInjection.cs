using FluentValidation;
using ICloudStore.Application.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace ICloudStore.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        // Register FluentValidation validators
        services.AddValidatorsFromAssemblyContaining<Validators.LoginValidator>();
        
        // Register AutoMapper
        services.AddAutoMapper(typeof(DependencyInjection).Assembly);
        
        return services;
    }
}
