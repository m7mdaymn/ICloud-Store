namespace ICloudStore.Application.DTOs;

// Auth DTOs
public record LoginDto(string Email, string Password);

public record RegisterDto(
    string FullName,
    string Email,
    string PhoneNumber,
    string Password,
    string ConfirmPassword
);

public record AuthResponseDto(
    int UserId,
    string Email,
    string FullName,
    string Role,
    string AccessToken,
    string RefreshToken,
    DateTime AccessTokenExpires
);

public record RefreshTokenDto(string RefreshToken);

public record ChangePasswordDto(string CurrentPassword, string NewPassword, string ConfirmNewPassword);

public record UserDto(
    int Id,
    string FullName,
    string Email,
    string? PhoneNumber,
    string? ProfileImagePath,
    string Role,
    bool IsActive,
    DateTime CreatedAt
);

public record CreateUserDto(
    string FullName,
    string Email,
    string PhoneNumber,
    string Password,
    string Role
);

public record UpdateUserDto(
    string FullName,
    string Email,
    string? PhoneNumber,
    bool IsActive
);
