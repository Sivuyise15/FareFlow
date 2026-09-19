using Nexa.Domain.Entities;

namespace Nexa.Domain.Interfaces;

public interface IUserRepository
{
    Task SaveUserAsync(User user);
    Task<User> GetUserByIdAsync(int userId);
}