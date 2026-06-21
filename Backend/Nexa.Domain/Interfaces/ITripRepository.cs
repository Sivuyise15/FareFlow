using Nexa.Domain.Entities;
public interface ITripRepository
{
    Task<bool> ExistsByEmailMessageIdAsync(string emailMessageId);
    Task SaveAsync(Trip trip);
}