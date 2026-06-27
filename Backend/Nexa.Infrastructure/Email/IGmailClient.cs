using Google.Apis.Auth.OAuth2.Responses;

namespace Nexa.Infrastructure.Email;

public interface IGmailClient
{
    public Task<TokenResponse> ExchangeCodeForTokensAsync(string authCode);
}