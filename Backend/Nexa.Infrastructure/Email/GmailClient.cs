using Google.Apis.Auth.OAuth2;
using Google.Apis.Gmail.v1;
using Google.Apis.Gmail.v1.Data;
using Google.Apis.Util.Store;
using Google.Apis.Services;
using Nexa.Domain.Entities;
using Nexa.Domain.Interfaces;
using System.Net.Http;
using System.Text;

namespace Nexa.Infrastructure.Email;

public class GmailClient : IGmailClient
{
    private static readonly string[] KnownSenders =
    {
        "noreply@uber.com",
        "noreply@indrive.com",
        "receipts-southafrica@bolt.eu"
    };

    public async Task<UserCredential> ConnectGoogleAsync(
        string clientId,
        string clientSecret)
    {
        var secrets = new ClientSecrets
        {
            ClientId = clientId,
            ClientSecret = clientSecret
        };

        var credential = await GoogleWebAuthorizationBroker.AuthorizeAsync(
            secrets,
            new[]
            {
                "https://www.googleapis.com/auth/calendar.readonly"
            },
            "user",
            CancellationToken.None,
            new FileDataStore("GoogleTokens"));

        return credential;
    }

    public async Task<IEnumerable<RawEmail>> FetchRideReceiptsAsync(string accessToken, DateTime from)
    {
        var credential = GoogleCredential
            .FromAccessToken(accessToken);

        var service = new GmailService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credential
        });

        var results = new List<RawEmail>();

        // Build Gmail search query — known senders within 24 hour window
        var senderQuery = string.Join(" OR ", KnownSenders.Select(s => $"from:{s}"));
        var afterTimestamp = ((DateTimeOffset)from).ToUnixTimeSeconds();
        var query = $"({senderQuery}) after:{afterTimestamp}";

        var listRequest = service.Users.Messages.List("me");
        listRequest.Q = query;

        var response = await listRequest.ExecuteAsync();
        if (response.Messages is null) return results;

        foreach (var msg in response.Messages)
        {
            var fullMessage = await service.Users.Messages
                .Get("me", msg.Id)
                .ExecuteAsync();

            var sender = fullMessage.Payload.Headers
                .FirstOrDefault(h => h.Name == "From")?.Value ?? string.Empty;

            var dateHeader = fullMessage.Payload.Headers
                .FirstOrDefault(h => h.Name == "Date")?.Value;

            var body = ExtractBody(fullMessage.Payload);

            results.Add(new RawEmail
            {
                messageId = msg.Id,
                senderAddress = sender,
                body = body,
                receivedAt = DateTime.TryParse(dateHeader, out var date) ? date : DateTime.UtcNow
            });
        }

        return results;
    }

    private string ExtractBody(MessagePart payload)
    {
        if (payload.Body?.Data != null)
        {
            var data = payload.Body.Data
                .Replace('-', '+')
                .Replace('_', '/');
            return Encoding.UTF8.GetString(Convert.FromBase64String(data));
        }

        if (payload.Parts != null)
        {
            foreach (var part in payload.Parts)
            {
                var result = ExtractBody(part);
                if (!string.IsNullOrEmpty(result)) return result;
            }
        }

        return string.Empty;
    }
}