using Nexa.Domain.Entities;

namespace Nexa.Core.Entities;

public interface IEmailParser
{
    bool CanParse(string email);
    Task<Trip> ParseAsync(string emailBody, string emailMessageId, User user);
}