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

    public async Task<User> ConnectGoogleAccountAsync(string authCode, string redirectUri)
    {
        OAuthToken tokens = await _gmailClient.ExchangeCodeForTokensAsync(authCode, redirectUri);
        if (string.IsNullOrWhiteSpace(tokens.idToken))
            throw new InvalidOperationException("Google did not return an identity token.");

        var identity = await _gmailClient.ValidateGoogleIdentityAsync(tokens.idToken);
        var user = await _userRepository.FindOrCreateGoogleUserAsync(
            identity.Subject,
            identity.Email,
            identity.GivenName,
            identity.FamilyName);

        await _emailAccountRepository.UpsertAsync(new EmailAccount
        {
            user = user,
            email_address = identity.Email,
            access_token = tokens.accessToken,
            refresh_token = tokens.refreshToken,
            token_expiry = DateTime.UtcNow.AddSeconds(tokens.expiry == 0 ? 3600 : tokens.expiry),
            provider = ProviderType.Gmail
        });

        return user;
    }

    public Task<EmailAccount?> GetGoogleAccountAsync(int userId)
    {
        return _emailAccountRepository.GetByUserIdAsync(userId);
    }

    public async Task DisconnectGoogleAccountAsync(int userId)
    {
        var account = await _emailAccountRepository.GetByUserIdAsync(userId);
        if (account is null)
            return;

        try
        {
            var token = account.refresh_token ?? account.access_token;
            if (!string.IsNullOrWhiteSpace(token))
                await _gmailClient.RevokeTokenAsync(token);
        }
        catch (HttpRequestException)
        {
        }

        await _emailAccountRepository.DeleteByUserIdAsync(userId);
    }
}