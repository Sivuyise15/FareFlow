using Nexa.Domain.Entities;
using Nexa.Infrastructure.Email;
using Nexa.Domain.Shared;
using Nexa.Infrastructure.Persistence;
using Nexa.Domain.Interfaces;

namespace Nexa.Core.Services;

public class ConnectEmailAccountService
{
    private readonly IGmailClient _gmailClient;
    private readonly IEmailAccountRepository _emailAccountRepository;
    private readonly IUserRepository _userRepository;

    public ConnectEmailAccountService(
        IGmailClient gmailClient,
         IEmailAccountRepository emailAccountRepository,
         IUserRepository userRepository 
        )
    {
        _gmailClient = gmailClient;
        _emailAccountRepository = emailAccountRepository;
        _userRepository = userRepository;
    }

    public async Task ExecuteAsync(int userId, string authCode, string emailAddress)
    {
        // 1. Exchange the auth code Google sent to mobile for real tokens
        OAuthToken tokens = await _gmailClient.ExchangeCodeForTokensAsync(authCode);
        Console.WriteLine($"Access Token: {tokens.accessToken}");
        Console.WriteLine($"Refresh Token: {tokens.refreshToken}");
        Console.WriteLine($"Expires In: {tokens.expiry} seconds");

        // 3.Build the EmailAccount entity
        var emailAccount = new EmailAccount()
        {
            user = await _userRepository.GetUserByIdAsync(userId),
            emailAddress = emailAddress,
            accessToken = tokens.accessToken,
            refreshToken = tokens.refreshToken,
            tokenExpiry = DateTime.UtcNow.AddSeconds(tokens.expiry == 0 ? 3600 : tokens.expiry),
            provider = ProviderType.Gmail
        };

        Console.WriteLine($"Email account for user {userId} created successfully.");

        // // 4. Save to database
        await _emailAccountRepository.SaveAsync(emailAccount);
        Console.WriteLine($"Email account for user {userId} saved successfully.");
    }
}