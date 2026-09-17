using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Microsoft.Extensions.Configuration;
using Google.Apis.Gmail.v1;
using Google.Apis.Services;
using Nexa.Domain.Entities;
using System.Text;

namespace Nexa.Infrastructure.Email;

public class GmailClient : IGmailClient
{
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
                Scopes = new[] { "https://www.googleapis.com/auth/gmail.readonly",
                                "https://www.googleapis.com/auth/userinfo.email" }
            });
    }

    public async Task<TokenResponse> ExchangeCodeForTokensAsync(string authCode)
    {
        var flow = CreateAuthorizationCodeFlow();

        var token = await flow.ExchangeCodeForTokenAsync(
            "sivuyise977@gmail.com", // userId, can be any string
            authCode, // the authorization code received from the OAuth2 callback
            "http://localhost", // redirectUri, must match the one used in the authorization request
            CancellationToken.None);  // 

        return token; // contains AccessToken, RefreshToken, ExpiresInSeconds
    }

    public async Task<TokenResponse> RefreshAccessTokenAsync(string refreshToken)
    {
        var flow = CreateAuthorizationCodeFlow();

        var token = await flow.RefreshTokenAsync(
            "sivuyise977@gmail.com", // userId, can be any string
            refreshToken, // the refresh token
            CancellationToken.None);  // 

        return token; // contains AccessToken, RefreshToken, ExpiresInSeconds   

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

        var listResponse = await listRequest.ExecuteAsync();

        if (listResponse.Messages is null || !listResponse.Messages.Any())
            return results;

        // Step 2 — fetch full email for each ID
        foreach (var message in listResponse.Messages)
        {
            var fullMessage = await service.Users.Messages
                .Get(userId, message.Id)
                .ExecuteAsync();

            var sender = fullMessage.Payload.Headers
                .FirstOrDefault(h => h.Name == "From")?.Value ?? string.Empty;

            var dateHeader = fullMessage.Payload.Headers
                .FirstOrDefault(h => h.Name == "Date")?.Value;

            var body = ExtractBody(fullMessage.Payload);

            results.Add(new RawEmail
            {
                messageId = message.Id,
                senderAddress = sender,
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


}