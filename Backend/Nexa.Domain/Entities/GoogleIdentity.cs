namespace Nexa.Domain.Entities;

public class GoogleIdentity
{
    public string Subject { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? GivenName { get; set; }
    public string? FamilyName { get; set; }
}
