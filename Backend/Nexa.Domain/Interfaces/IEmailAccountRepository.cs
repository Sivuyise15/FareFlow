using Nexa.Domain.Entities;

namespace Nexa.Domain.Interfaces;

public interface IEmailAccountRepository
{
    Task UpsertAsync(EmailAccount emailAccount);
    Task<EmailAccount?> GetByUserIdAsync(int userId);
    Task DeleteByUserIdAsync(int userId);
}