using Nexa.Domain.Shared;

namespace Nexa.Domain.Entities;

public class EmailAccount
{
    public int? id { get; set; }
    public User? user { get; set; }
    public string? emailAddress { get; set; }
    public string accessToken { get; set; }
    public string refreshToken { get; set; }
    public ProviderType? provider { get; set; }
    public DateTime? tokenExpiry { get; set; }

}