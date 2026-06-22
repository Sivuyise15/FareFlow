using Nexa.Domain.Entities;
using Nexa.Domain.Interfaces;

namespace Nexa.Application.Services;

public class ProcessEmailReceiptsService
{
    private readonly IEmailAccountRepository _emailAccountRepository;
    private readonly ITripRepository _tripRepository;
    private readonly IGmailClient _gmailClient;
    private readonly IEnumerable<IEmailParser> _parsers;

    public ProcessEmailReceiptsService(
        IEmailAccountRepository emailAccountRepository,
        ITripRepository tripRepository,
        IGmailClient gmailClient,
        IEnumerable<IEmailParser> parsers)
    {
        _emailAccountRepository = emailAccountRepository;
        _tripRepository = tripRepository;
        _gmailClient = gmailClient;
        _parsers = parsers;
    }

    public async Task HandleEmailReceiptsAsync()
    {
        var emailAccounts = await _emailAccountRepository.GetAllAsync();  // All users with connected emails
        var from = DateTime.UtcNow.AddHours(-24);  // The 24 hour window for fetching emails

        foreach (var account in emailAccounts)
        {
            await ProcessAccountAsync(account, from);
        }
    }

    private async Task ProcessAccountAsync(EmailAccount account, DateTime from)
    {
        try
        {
            var rawEmails = await _gmailClient.FetchRideReceiptsAsync(account.accessToken, from);
            foreach (var rawEmail in rawEmails)
            {
                var exists = await _tripRepository.ExistsByEmailMessageIdAsync(rawEmail.messageId);
                if (exists) continue;

                var parser = _parsers.FirstOrDefault(p => p.CanParse(rawEmail.senderEmail)); // Find the right parser based on sender
                if (parser is null) continue;

                var trip = await parser.ParseAsync( // Parse into a Trip entity
                    rawEmail.body,
                    rawEmail.messageId,
                    account.user,
                    rawEmail.receivedAt);

                if (trip is null) continue;

                await _tripRepository.SaveAsync(trip);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error processing email receipts for account {account.user.email}: {ex.Message}");
        }
    }
}