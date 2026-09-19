using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Nexa.Domain.Entities;
using Nexa.Domain.Interfaces;
using Npgsql;

namespace Nexa.Infrastructure.Persistence
{
    public class EmailAccountRepository: IEmailAccountRepository
    {
        private readonly string _connectionString;
        public EmailAccountRepository(IConfiguration configuration)
        {
            _connectionString = configuration["ConnectionStrings:DefaultConnection"];
        }

        public async Task SaveAsync(EmailAccount emailAccount)
        {
            using (var connection = new Npgsql.NpgsqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                var query = @"
                    INSERT INTO ""EmailAccounts"" (userid, email_address, access_token, refresh_token, token_expiry, provider)
                    VALUES (@userid, @email_address, @access_token, @refresh_token, @token_expiry, @Provider)
                    ON CONFLICT (userid) DO UPDATE
                    SET EmailAddress = EXCLUDED.email_address,
                        AccessToken = EXCLUDED.access_token,
                        RefreshToken = EXCLUDED.refresh_token,
                        TokenExpiry = EXCLUDED.token_expiry,
                        Provider = EXCLUDED.provider;";
                using (var command = new Npgsql.NpgsqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@userid", emailAccount.user.id);
                    command.Parameters.AddWithValue("@email_address", emailAccount.email_address);
                    command.Parameters.AddWithValue("@access_token", emailAccount.access_token);
                    command.Parameters.AddWithValue("@refresh_token", emailAccount.refresh_token);
                    command.Parameters.AddWithValue("@token_expiry", emailAccount.token_expiry);
                    command.Parameters.AddWithValue("@Provider", emailAccount.provider.ToString());
                    await command.ExecuteNonQueryAsync();
                }
            }
        }
    }
}
