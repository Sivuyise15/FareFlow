using Nexa.Domain.Entities;

namespace Nexa.Infrastructure.Email;

public interface IGmailClient
{
    Task<OAuthToken> ExchangeCodeForTokensAsync(string authCode);
    Task<OAuthToken> RefreshAccessTokenAsync(string refreshToken);
    Task<List<RawEmail>> GetEmailsAsync(string accessToken, string userId);
    Task<IEnumerable<RawEmail>> FetchRideReceiptsAsync(string accessToken, DateTime from);
}
