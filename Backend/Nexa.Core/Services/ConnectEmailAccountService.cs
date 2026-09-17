using Google.Apis.Auth.OAuth2.Responses;
using Nexa.Infrastructure.Email;

namespace Nexa.Core.Services;

public class ConnectEmailAccountService
{
    private readonly IGmailClient _gmailClient;
    // private readonly IEmailAccountRepository _emailAccountRepository;
    // private readonly IUserRepository _userRepository;

    public ConnectEmailAccountService(
        IGmailClient gmailClient
        // IEmailAccountRepository emailAccountRepository,
        // IUserRepository userRepository
        )
    {
        _gmailClient = gmailClient;
        // _emailAccountRepository = emailAccountRepository;
        // _userRepository = userRepository;
    }

    public async Task ExecuteAsync(int userId, string authCode, string emailAddress)
    {
        // 1. Exchange the auth code Google sent to mobile for real tokens
        TokenResponse tokens = await _gmailClient.ExchangeCodeForTokensAsync(authCode);
        Console.WriteLine($"Access Token: {tokens.AccessToken}");
        Console.WriteLine($"Refresh Token: {tokens.RefreshToken}");
        Console.WriteLine($"Expires In: {tokens.ExpiresInSeconds} seconds");

        // 2. tokens now contains the access token, refresh token, and expiration time. You can use these tokens to make authenticated requests to Gmail on behalf of the user.
        // We also have to store these tokens securely in our database for future use, especially the refresh token, which allows us to obtain new access tokens without requiring the user to re-authenticate.

        // 3. Build the EmailAccount entity
        // var emailAccount = new EmailAccount
        // {
        //     user = await _userRepository.GetByIdAsync(userId),
        //     emailAddress = emailAddress,
        //     accessToken = tokens.AccessToken,
        //     refreshToken = tokens.RefreshToken,
        //     tokenExpiry = DateTime.UtcNow.AddSeconds(tokens.ExpiresInSeconds ?? 3600),
        //     provider = ProviderType.Gmail
        // };

        // // 4. Save to database
        // await _emailAccountRepository.SaveAsync(emailAccount);
    }
}