using Nexa.Domain.Shared;

namespace Nexa.Domain.Entities;

public class EmailAccount
{
    public int? id { get; set; }
    public User? user { get; set; }
    public string? email_address { get; set; }
    public string access_token { get; set; }
    public string refresh_token { get; set; }
    public DateTime? token_expiry { get; set; }
    public ProviderType? provider { get; set; }

}