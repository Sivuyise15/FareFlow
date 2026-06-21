using Nexa.Domain.Entities;

namespace Nexa.Domain.Interfaces;

public interface ITripRepository
{
    Task<bool> ExistsByEmailMessageIdAsync(string emailMessageId);
    Task SaveAsync(Trip trip);
}