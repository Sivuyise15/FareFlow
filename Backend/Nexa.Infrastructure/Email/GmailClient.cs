using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Auth;
using Microsoft.Extensions.Configuration;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Services;
using Nexa.Domain.Entities;
using System.Text;
using System.Net.Http;

namespace Nexa.Infrastructure.Email;

public class GmailClient : IGmailClient
{
    private const string TokenStoreUserId = "nexa-google-auth";
    private readonly string _clientId;
    private readonly string _clientSecret;

    public static readonly string[] KnownSenders = new[]
    {
        "nonreply@uber.com"
    };

    public GmailClient(IConfiguration configuration)
    {
        _clientId = configuration["Google:ClientId"] ?? throw new ArgumentException("Google:ClientId configuration is missing");
        _clientSecret = configuration["Google:ClientSecret"] ?? throw new ArgumentException("Google:ClientSecret configuration is missing");
    }

    public GoogleAuthorizationCodeFlow CreateAuthorizationCodeFlow()
    {
        return new GoogleAuthorizationCodeFlow(
            new GoogleAuthorizationCodeFlow.Initializer
            {
                ClientSecrets = new ClientSecrets
                {
                    ClientId = _clientId,
                    ClientSecret = _clientSecret
                },
                Scopes = new[] { "openid",
                                "email",
                                "profile",
                                "https://www.googleapis.com/auth/gmail.readonly" }
            });
    }

    public async Task<OAuthToken> ExchangeCodeForTokensAsync(string authCode, string redirectUri)
    {
        var flow = CreateAuthorizationCodeFlow();

        var token = await flow.ExchangeCodeForTokenAsync(
            TokenStoreUserId,
            authCode,
            redirectUri,
            CancellationToken.None);

        return new OAuthToken
        {
            accessToken = token.AccessToken,
            refreshToken = token.RefreshToken,
            idToken = token.IdToken,
            expiry = (int)(token.ExpiresInSeconds ?? 0)
        };
    }

    public async Task<GoogleIdentity> ValidateGoogleIdentityAsync(string idToken)
    {
        var payload = await GoogleJsonWebSignature.ValidateAsync(
            idToken,
            new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { _clientId }
            });

        if (string.IsNullOrWhiteSpace(payload.Subject) ||
            string.IsNullOrWhiteSpace(payload.Email) ||
            !payload.EmailVerified)
        {
            throw new InvalidOperationException("Google did not return a verified email identity.");
        }

        return new GoogleIdentity
        {
            Subject = payload.Subject,
            Email = payload.Email,
            GivenName = payload.GivenName,
            FamilyName = payload.FamilyName
        };
    }

    public async Task RevokeTokenAsync(string token)
    {
        using var client = new HttpClient();
        using var response = await client.PostAsync(
            "https://oauth2.googleapis.com/revoke",
            new FormUrlEncodedContent(new Dictionary<string, string>
            {
                ["token"] = token
            }));

        response.EnsureSuccessStatusCode();
    }

    public async Task<OAuthToken> RefreshAccessTokenAsync(string refreshToken)
    {
        var flow = CreateAuthorizationCodeFlow();

        var token = await flow.RefreshTokenAsync(
            TokenStoreUserId,
            refreshToken,
            CancellationToken.None);

        return new OAuthToken
        {
            accessToken = token.AccessToken,
            refreshToken = token.RefreshToken,
            expiry = (int)(token.ExpiresInSeconds ?? 0)
        };

    }

    public async Task<List<RawEmail>> GetEmailsAsync(string accessToken, string userId)
    {
        // Build credential from access token
        var credential = GoogleCredential.FromAccessToken(accessToken);

        // Create Gmail service
        var service = new GmailService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = "Nexa"
        });

        var results = new List<RawEmail>();

        // Build search query — known senders only, last 24 hours
        var senderQuery = string.Join(" OR ", KnownSenders.Select(s => $"from:{s}"));
        var afterTimestamp = ((DateTimeOffset)DateTime.UtcNow.AddHours(-24)).ToUnixTimeSeconds();
        var query = $"({senderQuery}) after:{afterTimestamp}";

        // Step 1 — get list of message IDs
        var listRequest = service.Users.Messages.List(userId);
        listRequest.Q = query;

        var listResponse = listRequest.Execute();

        if (listResponse.Messages is null || !listResponse.Messages.Any())
            return results;

        // Step 2 — fetch full email for each ID
        foreach (var message in listResponse.Messages)
        {
            var fullMessage = service.Users.Messages
                .Get(userId, message.Id)
                .Execute();

            var sender = fullMessage.Payload.Headers
                .FirstOrDefault(h => h.Name == "From")?.Value ?? string.Empty;

            var dateHeader = fullMessage.Payload.Headers
                .FirstOrDefault(h => h.Name == "Date")?.Value;

            var body = ExtractBody(fullMessage.Payload);

            results.Add(new RawEmail
            {
                messageId = message.Id,
                senderEmail = sender,
                body = body,
                receivedAt = DateTime.TryParse(dateHeader, out var date)
                    ? date
                    : DateTime.UtcNow
            });
        }

        return results;
    }

    private string ExtractBody(MessagePart payload)
    {
        // If body data exists directly on the payload
        if (payload.Body?.Data != null)
        {
            var data = payload.Body.Data
                .Replace('-', '+')
                .Replace('_', '/');

            // Pad base64 string if needed
            while (data.Length % 4 != 0)
                data += "=";

            return Encoding.UTF8.GetString(Convert.FromBase64String(data));
        }

        // Otherwise check parts recursively (multipart emails)
        if (payload.Parts != null)
        {
            foreach (var part in payload.Parts)
            {
                // Prefer HTML over plain text
                if (part.MimeType == "text/html")
                {
                    var result = ExtractBody(part);
                    if (!string.IsNullOrEmpty(result))
                        return result;
                }
            }

            // Fallback to any part
            foreach (var part in payload.Parts)
            {
                var result = ExtractBody(part);
                if (!string.IsNullOrEmpty(result))
                    return result;
            }
        }

        return string.Empty;
    }

    public async Task<IEnumerable<RawEmail>> FetchRideReceiptsAsync(string accessToken, DateTime from)
    {
        return await GetEmailsAsync(accessToken, "me");
    }


}