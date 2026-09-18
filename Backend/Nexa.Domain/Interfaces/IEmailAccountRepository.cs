using Nexa.Domain.Entities;

namespace Nexa.Domain.Interfaces;

public interface IEmailAccountRepository
{
    //Task<IEnumerable<EmailAccount>> GetAllAsync();
    //Task UpdateAsync(EmailAccount emailAccount);
    Task SaveAsync(EmailAccount emailAccount);
}