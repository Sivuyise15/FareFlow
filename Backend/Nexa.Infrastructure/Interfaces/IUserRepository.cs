using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Nexa.Domain.Entities;

namespace Nexa.Infrastructure.Interfaces
{
    public interface IUserRepository
    {
        Task<User> GetByIdAsync(string userId);
    }
}
