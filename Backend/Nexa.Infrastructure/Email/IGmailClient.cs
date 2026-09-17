using Google.Apis.Auth.OAuth2.Responses;
using Nexa.Domain.Entities;

namespace Nexa.Infrastructure.Email;

public interface IGmailClient
{
    public Task<TokenResponse> ExchangeCodeForTokensAsync(string authCode);
    public Task<TokenResponse> RefreshAccessTokenAsync(string refreshToken);
    public Task<List<RawEmail>> GetEmailsAsync(string accessToken, string userId);
}