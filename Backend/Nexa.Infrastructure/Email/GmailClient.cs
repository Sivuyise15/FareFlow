using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;

namespace Nexa.Infrastructure.Email;

public class GmailClient : IGmailClient
{
    private readonly string _clientId;
    private readonly string _clientSecret;

    public GmailClient(string clientId, string clientSecret)
    {
        _clientId = clientId;
        _clientSecret = clientSecret;
    }

    public async Task<TokenResponse> ExchangeCodeForTokensAsync(string authCode)
    {
        var flow = new GoogleAuthorizationCodeFlow(
            new GoogleAuthorizationCodeFlow.Initializer
            {
                ClientSecrets = new ClientSecrets
                {
                    ClientId = _clientId,
                    ClientSecret = _clientSecret
                },
                Scopes = new[] { "https://www.googleapis.com/auth/gmail.readonly",
                                "https://www.googleapis.com/auth/userinfo.email" }
            });

        var token = await flow.ExchangeCodeForTokenAsync(
            "user",
            authCode,
            "http://localhost",
            CancellationToken.None);

        return token; // contains AccessToken, RefreshToken, ExpiresInSeconds
    }
}