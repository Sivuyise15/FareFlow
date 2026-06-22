using Nexa.Domain.Entities;

namespace Nexa.Domain.Interfaces;

public interface IEmailParser
{
    bool CanParse(string senderEmail);
    Task<Trip?> ParseAsync(string emailBody, string emailMessageId, User user, DateTime receivedAt);
}