using Nexa.Domain.Entities;

namespace Nexa.Domain.Interfaces;

public interface IEmailParser
{
    bool CanParse(string email);
    Task<Trip> ParseAsync(string emailBody, string emailMessageId, User user);
}