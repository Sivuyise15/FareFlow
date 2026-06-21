using Nexa.Domain.Entities;

namespace Nexa.Domain.Interfaces;

public interface IUserRepository
{
    Task<User> GetUserByIdAsync(int userId);
    Task<User> GetUserByEmailAsync(string email);
    Task AddUserAsync(User user);
    Task UpdateUserAsync(User user);
    Task DeleteUserAsync(int userId);
}